-- Alta inicial de usuarios Radio Imagen Dentomaxilar
-- Paso previo obligatorio:
-- 1. Crear el usuario en Supabase Dashboard > Authentication > Users.
-- 2. Copiar el User UID generado por Supabase Auth.
-- 3. Reemplazar los placeholders AUTH_USER_ID_AQUI antes de ejecutar.

-- Admin Radio Imagen
insert into public.profiles (id, role, full_name, email, phone)
values (
  'AUTH_USER_ID_ADMIN_AQUI',
  'admin',
  'Admin Radio Imagen',
  'admin@radioimagen.mx',
  '55 0000 0000'
)
on conflict (id) do update set
  role = excluded.role,
  full_name = excluded.full_name,
  email = excluded.email,
  phone = excluded.phone,
  updated_at = now();

-- Doctor ejemplo
insert into public.profiles (id, role, full_name, email, phone)
values (
  'AUTH_USER_ID_DOCTOR_AQUI',
  'doctor',
  'Dra. Sofia Herrera',
  'sofia.herrera@consulta.mx',
  '55 7123 8842'
)
on conflict (id) do update set
  role = excluded.role,
  full_name = excluded.full_name,
  email = excluded.email,
  phone = excluded.phone,
  updated_at = now();

insert into public.doctor_profiles (
  profile_id,
  doctor_code,
  display_name,
  specialty,
  clinic,
  contact_phone,
  city
)
values (
  'AUTH_USER_ID_DOCTOR_AQUI',
  'DR-0001',
  'Dra. Sofia Herrera',
  'Ortodoncia y ATM',
  'Clinica Herrera Dental',
  '55 7123 8842',
  'Ciudad de Mexico'
)
on conflict (profile_id) do update set
  doctor_code = excluded.doctor_code,
  display_name = excluded.display_name,
  specialty = excluded.specialty,
  clinic = excluded.clinic,
  contact_phone = excluded.contact_phone,
  city = excluded.city,
  updated_at = now();

insert into public.doctor_partner_status (
  doctor_id,
  referred_patients,
  points,
  current_tier_id
)
select
  id,
  0,
  0,
  'activo'
from public.doctor_profiles
where profile_id = 'AUTH_USER_ID_DOCTOR_AQUI'
on conflict (doctor_id) do nothing;

