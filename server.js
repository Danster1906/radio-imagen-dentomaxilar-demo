import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const rootDir = resolve(".");
const preferredPort = Number(process.env.PORT || 8003);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".zip": "application/zip",
  ".pdf": "application/pdf"
};

function resolveRequestPath(urlPath) {
  const cleanPath = normalize(decodeURIComponent(urlPath.split("?")[0])).replace(/^(\.\.[/\\])+/, "");
  const requestedPath = cleanPath === "/" ? "/portal.html" : cleanPath;
  const absolutePath = resolve(join(rootDir, requestedPath));

  if (!absolutePath.startsWith(rootDir)) {
    return null;
  }

  if (existsSync(absolutePath) && statSync(absolutePath).isFile()) {
    return absolutePath;
  }

  return null;
}

function createStaticServer() {
  return createServer((request, response) => {
    const filePath = resolveRequestPath(request.url || "/");

    if (!filePath) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Archivo no encontrado");
      return;
    }

    const contentType = mimeTypes[extname(filePath).toLowerCase()] || "application/octet-stream";
    response.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "no-store"
    });
    createReadStream(filePath).pipe(response);
  });
}

function listen(port) {
  const server = createStaticServer();

  server.once("error", (error) => {
    if (error.code === "EADDRINUSE" && !process.env.PORT) {
      listen(port + 1);
      return;
    }

    throw error;
  });

  server.listen(port, "0.0.0.0", () => {
    console.log(`Radio Imagen portal disponible en http://localhost:${port}`);
  });
}

listen(preferredPort);
