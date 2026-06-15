# Supabase multitenant - Radio Imagen Dentomaxilar

Este documento es el esqueleto para convertir el prototipo en producto final con Supabase Auth, Postgres, RLS y Realtime.

## Objetivo

Cada doctor debe usar la misma plataforma, pero solo debe ver:

- Su perfil.
- Sus pacientes referidos.
- Sus ordenes.
- Sus resultados y solicitudes de descarga.
- Sus puntos y nivel de socio.

Radio Imagen/Admin debe poder ver todo, cambiar estatus, validar pacientes atendidos, asignar resultados y activar descargas.

## Proyecto Supabase

- URL: `https://wwrfuwtvllgecjmfjfwf.supabase.co`
- Publishable key frontend: `sb_publishable_9-mqQEWpDWG4UL_rL6dxsw_uJSfXK7P`
- Nunca usar `service_role` en frontend, Neubox, Replit publico o navegador.

## Modelo de acceso

### Roles

- `doctor`: usuario externo. Puede crear ordenes y leer solo su informacion.
- `admin`: usuario interno Radio Imagen. Puede leer y actualizar operacion completa.

### Tablas base

- `profiles`: espejo de `auth.users`, con `role`, nombre, correo y telefono.
- `doctor_profiles`: perfil profesional del doctor.
- `orders`: ordenes referidas.
- `order_studies`: estudios solicitados por orden.
- `order_status_events`: historial auditable de cambios.
- `result_packages`: paquete general por orden.
- `result_files`: archivos disponibles o locales.
- `download_requests`: solicitudes de descarga bajo demanda.
- `doctor_partner_status`: nivel, pacientes validados y puntos.
- `partner_point_events`: historial auditable de puntos.

## Flujo de estatus

El Dr. ve el mismo estatus que actualiza Radio Imagen.

```text
Recibida
  -> se crea automaticamente cuando el Dr. manda la orden.

Agendada
  -> Radio Imagen hace outreach por WhatsApp y captura la cita.
  -> se llena orders.scheduled_at.

Completa
  -> Radio Imagen confirma que el paciente llego y se hizo el estudio.
  -> se llena orders.completed_at.
  -> counts_for_partner = true.
  -> se suman 100 puntos una sola vez.

Lista para descargar
  -> Radio Imagen asigna/sube resultados.
  -> el Dr. puede solicitar descarga parcial o completa.

Cancelada
  -> cierre operativo cuando no procede.
  -> no suma puntos.
```

## Conexion frontend

Usar `@supabase/supabase-js`.

```js
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://wwrfuwtvllgecjmfjfwf.supabase.co",
  "sb_publishable_9-mqQEWpDWG4UL_rL6dxsw_uJSfXK7P",
);
```

## Login

### Email

```js
await supabase.auth.signInWithOtp({
  email,
  options: {
    emailRedirectTo: `${window.location.origin}/index.html`,
  },
});
```

### Google

```js
await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: `${window.location.origin}/index.html`,
  },
});
```

En Supabase Dashboard se debe configurar Google Provider con Client ID y Client Secret de Google Cloud.

## Carga de sesion

Al iniciar:

```js
const { data: sessionData } = await supabase.auth.getSession();
const user = sessionData.session?.user;

const { data: profile } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", user.id)
  .single();
```

Si `profile.role === "doctor"`:

```js
const { data: doctor } = await supabase
  .from("doctor_profiles")
  .select("*, doctor_partner_status(*)")
  .eq("profile_id", user.id)
  .single();
```

Si `profile.role === "admin"`, cargar bandeja completa de ordenes.

## Crear doctor desde admin

El alta real de doctor no debe hacerse solo desde frontend porque crear usuarios de Auth requiere privilegios.

Implementar una Edge Function segura:

```text
admin-create-doctor
```

Entrada:

```json
{
  "email": "doctor@consulta.mx",
  "full_name": "Dra. Nombre",
  "specialty": "Ortodoncia",
  "clinic": "Clinica Dental",
  "phone": "55...",
  "city": "Ciudad de Mexico",
  "validated_patients": 0
}
```

La funcion debe:

1. Verificar que quien llama tenga `profiles.role = admin`.
2. Crear usuario en Supabase Auth con invitacion o magic link.
3. Insertar `profiles`.
4. Insertar `doctor_profiles`.
5. Insertar `doctor_partner_status`.
6. Si se cargan pacientes historicos, crear eventos en `partner_point_events`.

## Crear orden desde doctor

El doctor inserta:

1. `orders` con:
   - `doctor_id` del doctor autenticado.
   - `status = Recibida`.
   - datos del paciente.
   - fecha de remision default `CURRENT_DATE`.
2. `order_studies` con los estudios seleccionados y configuracion JSON.
3. `order_status_events` con `new_status = Recibida`.

La RLS ya impide que un doctor inserte ordenes para otro `doctor_id`.

## Admin cambia estatus

Cuando admin cambia a `Agendada`:

```sql
update orders
set status = 'Agendada',
    scheduled_at = :scheduled_at,
    scheduled_by = auth.uid(),
    updated_at = now()
where id = :order_id;
```

Cuando admin cambia a `Completa`:

```sql
update orders
set status = 'Completa',
    completed_at = now(),
    counts_for_partner = true,
    patient_attended_at = now(),
    validated_by = auth.uid(),
    partner_points_awarded_at = coalesce(partner_points_awarded_at, now()),
    updated_at = now()
where id = :order_id
  and counts_for_partner = false;
```

Despues crear `partner_point_events` y actualizar `doctor_partner_status`.

Cuando admin cambia a `Lista para descargar`, debe existir al menos un `result_file` o `result_package`.

## Realtime

Ya se habilitaron en `supabase_realtime`:

- `orders`
- `order_status_events`
- `result_files`
- `download_requests`

Suscripcion recomendada para doctor:

```js
supabase
  .channel(`doctor-orders-${doctor.id}`)
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "orders",
      filter: `doctor_id=eq.${doctor.id}`,
    },
    () => reloadDoctorOrders(),
  )
  .subscribe();
```

Suscripcion recomendada para admin:

```js
supabase
  .channel("admin-orders")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "orders" },
    () => reloadAdminOrders(),
  )
  .subscribe();
```

## Seguridad minima antes de operar

- RLS activo en todas las tablas expuestas.
- No usar `service_role` en frontend.
- Mover helpers `current_app_role()` y `current_doctor_id()` fuera del schema `public` antes de produccion.
- Configurar Google OAuth con dominio real.
- Configurar Site URL y Redirect URLs en Supabase Auth.
- Crear backups y rutina de exportacion.
- Usar Edge Function o backend para acciones admin sensibles.

## Prompt para una IA desarrolladora

```text
Construye una app multitenant para Radio Imagen Dentomaxilar usando Supabase.

Objetivo:
- Doctores crean ordenes digitales y ven solo su informacion.
- Admin Radio Imagen ve todas las ordenes, cambia estatus, valida pacientes atendidos, asigna resultados y gestiona descargas.

Supabase:
- URL: https://wwrfuwtvllgecjmfjfwf.supabase.co
- Usar publishable key en frontend.
- Nunca exponer service_role.
- Usar RLS existente.

Roles:
- doctor: solo su perfil, sus ordenes, sus resultados, sus puntos.
- admin: operacion completa.

Workflow de orders.status:
- Recibida: default cuando doctor crea orden.
- Agendada: admin agenda por WhatsApp y captura scheduled_at.
- Completa: admin confirma que el paciente llego y se hizo estudio; aqui se suman puntos.
- Lista para descargar: resultado asignado/subido y disponible para el doctor.
- Cancelada: cierre sin puntos.

Realtime:
- Suscribir doctor a orders filtrado por doctor_id.
- Suscribir admin a orders completas.

Crear doctor:
- No hacerlo solo desde frontend.
- Crear Edge Function admin-create-doctor que valide rol admin y cree Auth user, profiles, doctor_profiles y doctor_partner_status.

Orden nueva:
- Insertar orders con status Recibida.
- Insertar order_studies.
- Insertar order_status_events.

Puntos:
- No sumar por orden creada.
- Sumar 100 puntos solo cuando admin marque Completa.
- Nunca duplicar puntos si counts_for_partner ya es true.
```
