import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function getTierId(validatedPatients: number) {
  if (validatedPatients >= 50) return "diamante";
  if (validatedPatients >= 25) return "oro";
  if (validatedPatients >= 15) return "plata";
  if (validatedPatients >= 1) return "activo";
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Metodo no permitido" }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: "Faltan secretos de Supabase" }, 500);
  }

  const authHeader = req.headers.get("Authorization") || "";
  const jwt = authHeader.replace("Bearer ", "");

  if (!jwt) {
    return jsonResponse({ error: "Sesion requerida" }, 401);
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: authUser, error: authError } = await adminClient.auth.getUser(jwt);

  if (authError || !authUser.user) {
    return jsonResponse({ error: "Sesion invalida" }, 401);
  }

  const { data: callerProfile, error: profileError } = await adminClient
    .from("profiles")
    .select("role")
    .eq("id", authUser.user.id)
    .single();

  if (profileError || callerProfile?.role !== "admin") {
    return jsonResponse({ error: "Solo admin puede crear doctores" }, 403);
  }

  const body = await req.json();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "").trim();
  const name = String(body.name || "").trim();
  const specialty = String(body.specialty || "").trim() || null;
  const clinic = String(body.clinic || "").trim() || null;
  const phone = String(body.phone || "").trim() || null;
  const city = String(body.city || "").trim() || null;
  const validatedPatients = Math.max(Number(body.validatedPatients || 0), 0);

  if (!email || !password || !name) {
    return jsonResponse({ error: "Nombre, correo y contrasena son obligatorios" }, 400);
  }

  const { data: createdUser, error: createUserError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: name,
      role: "doctor",
    },
  });

  if (createUserError || !createdUser.user) {
    return jsonResponse({ error: createUserError?.message || "No se pudo crear usuario" }, 400);
  }

  const userId = createdUser.user.id;

  const { error: insertProfileError } = await adminClient.from("profiles").insert({
    id: userId,
    role: "doctor",
    full_name: name,
    email,
    phone,
  });

  if (insertProfileError) {
    return jsonResponse({ error: insertProfileError.message }, 400);
  }

  const { data: existingDoctors, error: codesError } = await adminClient
    .from("doctor_profiles")
    .select("doctor_code");

  if (codesError) {
    return jsonResponse({ error: codesError.message }, 400);
  }

  const nextCodeNumber =
    (existingDoctors || []).reduce((maxCode, doctor) => {
      const match = String(doctor.doctor_code || "").match(/DR-(\d+)/i);
      return match ? Math.max(maxCode, Number(match[1])) : maxCode;
    }, 0) + 1;
  const doctorCode = `DR-${String(nextCodeNumber).padStart(4, "0")}`;

  const { data: doctorProfile, error: doctorError } = await adminClient
    .from("doctor_profiles")
    .insert({
      profile_id: userId,
      doctor_code: doctorCode,
      display_name: name,
      specialty,
      clinic,
      contact_phone: phone,
      city,
    })
    .select()
    .single();

  if (doctorError || !doctorProfile) {
    return jsonResponse({ error: doctorError?.message || "No se pudo crear perfil doctor" }, 400);
  }

  const points = validatedPatients * 100;
  const { error: partnerError } = await adminClient.from("doctor_partner_status").insert({
    doctor_id: doctorProfile.id,
    referred_patients: validatedPatients,
    points,
    current_tier_id: getTierId(validatedPatients),
  });

  if (partnerError) {
    return jsonResponse({ error: partnerError.message }, 400);
  }

  return jsonResponse({
    ok: true,
    userId,
    doctorId: doctorProfile.id,
    doctorCode,
    email,
  });
});
