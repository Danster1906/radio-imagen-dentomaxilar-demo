import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import path from "node:path";

const requiredEnv = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_STORAGE_BUCKET",
  "LOCAL_RESULTS_ROOT",
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const bucket = process.env.SUPABASE_STORAGE_BUCKET;
const localRoot = path.resolve(process.env.LOCAL_RESULTS_ROOT);
const signedUrlTtlSeconds = Number(process.env.SIGNED_URL_TTL_SECONDS || 3600);
const pollIntervalMs = Number(process.env.POLL_INTERVAL_MS || 30000);
const maxRequestsPerRun = Number(process.env.MAX_REQUESTS_PER_RUN || 5);
const runOnce = process.argv.includes("--once");

function assertLocalPathIsAllowed(localPath) {
  const resolved = path.resolve(localPath);

  if (!resolved.startsWith(`${localRoot}${path.sep}`) && resolved !== localRoot) {
    throw new Error(`Blocked local_path outside LOCAL_RESULTS_ROOT: ${localPath}`);
  }

  return resolved;
}

function contentTypeFor(fileName) {
  const extension = path.extname(fileName).toLowerCase();

  if (extension === ".pdf") return "application/pdf";
  if (extension === ".zip") return "application/zip";
  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
  if (extension === ".png") return "image/png";

  return "application/octet-stream";
}

async function markRequestFailed(requestId, message) {
  await supabase
    .from("download_requests")
    .update({
      status: "failed",
      error_message: message,
    })
    .eq("id", requestId);
}

async function processDownloadRequests() {
  const { data: requests, error } = await supabase
    .from("download_requests")
    .select("id, result_file_id, doctor_id, result_files(*)")
    .eq("status", "requested")
    .order("requested_at", { ascending: true })
    .limit(maxRequestsPerRun);

  if (error) {
    throw error;
  }

  if (!requests?.length) {
    console.log(`[${new Date().toISOString()}] No pending download requests.`);
    return;
  }

  for (const request of requests) {
    const file = request.result_files;

    try {
      if (!file) {
        throw new Error("Request has no linked result_file.");
      }

      if (file.doctor_id !== request.doctor_id) {
        throw new Error("Request doctor_id does not match result_file doctor_id.");
      }

      const localPath = assertLocalPathIsAllowed(file.local_path);
      const bytes = await readFile(localPath);
      const cloudPath = `${file.doctor_id}/${file.order_id}/${file.id}/${file.file_name}`;

      await supabase.from("download_requests").update({ status: "uploading" }).eq("id", request.id);
      await supabase.from("result_files").update({ status: "upload_requested" }).eq("id", file.id);

      const upload = await supabase.storage.from(bucket).upload(cloudPath, bytes, {
        cacheControl: "3600",
        contentType: contentTypeFor(file.file_name),
        upsert: true,
      });

      if (upload.error) {
        throw upload.error;
      }

      const signed = await supabase.storage.from(bucket).createSignedUrl(cloudPath, signedUrlTtlSeconds);

      if (signed.error) {
        throw signed.error;
      }

      const now = new Date();
      const expiresAt = new Date(now.getTime() + signedUrlTtlSeconds * 1000).toISOString();

      await supabase
        .from("result_files")
        .update({
          status: "cloud_ready",
          cloud_bucket: bucket,
          cloud_path: cloudPath,
          cloud_uploaded_at: now.toISOString(),
          cloud_expires_at: expiresAt,
        })
        .eq("id", file.id);

      await supabase
        .from("download_requests")
        .update({
          status: "ready",
          signed_url: signed.data.signedUrl,
          signed_url_expires_at: expiresAt,
          fulfilled_at: now.toISOString(),
        })
        .eq("id", request.id);

      console.log(`[${now.toISOString()}] Ready: ${file.file_name} -> ${cloudPath}`);
    } catch (requestError) {
      console.error(`[${new Date().toISOString()}] Failed request ${request.id}:`, requestError.message);
      await markRequestFailed(request.id, requestError.message);
    }
  }
}

async function cleanupExpiredCloudFiles() {
  const { data: files, error } = await supabase
    .from("result_files")
    .select("id, cloud_bucket, cloud_path, downloaded_at, cloud_expires_at")
    .eq("status", "cloud_ready")
    .not("cloud_path", "is", null);

  if (error) {
    throw error;
  }

  const now = Date.now();

  for (const file of files || []) {
    const isDownloaded = Boolean(file.downloaded_at);
    const isExpired = file.cloud_expires_at && new Date(file.cloud_expires_at).getTime() < now;

    if (!isDownloaded && !isExpired) {
      continue;
    }

    const remove = await supabase.storage.from(file.cloud_bucket || bucket).remove([file.cloud_path]);

    if (remove.error) {
      console.error(`[${new Date().toISOString()}] Cleanup failed ${file.cloud_path}:`, remove.error.message);
      continue;
    }

    await supabase
      .from("result_files")
      .update({
        status: "cloud_deleted",
        cloud_deleted_at: new Date().toISOString(),
      })
      .eq("id", file.id);

    console.log(`[${new Date().toISOString()}] Deleted temporary cloud file: ${file.cloud_path}`);
  }
}

async function tick() {
  await processDownloadRequests();
  await cleanupExpiredCloudFiles();
}

if (runOnce) {
  await tick();
} else {
  console.log("Radio Imagen local agent running.");
  console.log(`Watching download_requests every ${pollIntervalMs}ms.`);
  await tick();
  setInterval(() => {
    tick().catch((error) => {
      console.error(`[${new Date().toISOString()}] Agent tick failed:`, error);
    });
  }, pollIntervalMs);
}
