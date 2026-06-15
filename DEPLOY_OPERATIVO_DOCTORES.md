# Deployment operativo para doctores

## Resumen

Ya existe un paquete actualizado para publicar el portal:

```text
deploy/radio-imagen-operativo-v1.zip
```

Este ZIP sirve para publicar la interfaz actual en Neubox, Replit Static Deployment o cualquier hosting estatico.

## Decision importante antes de invitar doctores

### Opcion A - Piloto visual inmediato

Sirve para mostrar la herramienta, capacitar doctores y validar flujo.

Limitaciones:

- Los datos viven en el navegador.
- Las ordenes no se comparten realmente entre computadoras.
- Las contrasenas son demo.
- No debe usarse como expediente operativo real.

### Opcion B - Operacion real

Sirve para que doctores creen ordenes reales y Radio Imagen les de seguimiento.

Requiere conectar:

- Supabase Auth para usuarios reales.
- Supabase Postgres para doctores, ordenes, estudios y resultados.
- Supabase Storage privado para archivos.
- RLS para que cada doctor vea solo su informacion.

La recomendacion es publicar el frontend ya, pero no entregar acceso a doctores reales hasta conectar Supabase.

## Ruta recomendada

1. Publicar el portal en un subdominio.
2. Crear usuarios reales en Supabase Auth.
3. Insertar perfiles de doctores en Supabase.
4. Conectar login a Supabase Auth.
5. Conectar nueva orden a `orders` y `order_studies`.
6. Conectar admin a las ordenes reales.
7. Conectar subida manual de resultados a Supabase Storage.
8. Hacer prueba con 1 doctor de confianza.
9. Abrir a 3-5 doctores.

## Deployment en Neubox

Archivo a subir:

```text
deploy/radio-imagen-operativo-v1.zip
```

Pasos:

1. Entrar a Neubox.
2. Abrir cPanel.
3. Ir a `Administrador de archivos`.
4. Crear subdominio recomendado:

```text
doctores.radioimagendentomaxilar.com
```

5. Entrar a la carpeta del subdominio o `public_html`.
6. Subir `deploy/radio-imagen-operativo-v1.zip`.
7. Extraer el ZIP.
8. Confirmar que `index.html` quede directamente en la raiz del sitio.
9. Abrir el dominio.

## Deployment en Replit

Pasos:

1. Importar el repositorio desde GitHub:

```text
https://github.com/Danster1906/radio-imagen-dentomaxilar-demo
```

2. Confirmar que Replit detecte Node.
3. Si solicita comando de ejecucion, usar:

```text
npm start
```

4. Presionar `Run`.
5. Abrir el preview y probar:

```text
/index.html
/portal.html
```

6. Crear `Autoscale Deployment`.
7. Copiar el URL publicado de Replit.
8. En Supabase, configurar ese URL en `Authentication > URL Configuration`.
9. Conectar el dominio o subdominio desde Neubox si se quiere usar dominio propio.

Archivos agregados para Replit:

```text
package.json
server.js
.replit
```

## Supabase real

Proyecto activo:

```text
radio-imagen-dentomaxilar
https://wwrfuwtvllgecjmfjfwf.supabase.co
```

Clave publica para frontend:

```text
sb_publishable_9-mqQEWpDWG4UL_rL6dxsw_uJSfXK7P
```

Nunca subir al frontend:

```text
service_role
secret key
```

## Alta manual inicial de usuarios

En Supabase Dashboard:

1. Authentication.
2. Users.
3. Add user.
4. Crear admin:

```text
admin@radioimagen.mx
```

5. Crear cada doctor con correo real y contrasena asignada.
6. Copiar el `User UID` de cada usuario.

Luego insertar perfil en SQL Editor.

Plantilla local lista:

```text
SUPABASE_ALTA_USUARIOS.sql
```

### Admin

```sql
insert into public.profiles (id, role, full_name, email, phone)
values (
  'AUTH_USER_ID_AQUI',
  'admin',
  'Admin Radio Imagen',
  'admin@radioimagen.mx',
  '55 0000 0000'
);
```

### Doctor

```sql
insert into public.profiles (id, role, full_name, email, phone)
values (
  'AUTH_USER_ID_AQUI',
  'doctor',
  'Dra. Nombre Apellido',
  'doctor@consultorio.com',
  '55 0000 0000'
);

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
  'AUTH_USER_ID_AQUI',
  'DR-0001',
  'Dra. Nombre Apellido',
  'Ortodoncia',
  'Clinica / Consultorio',
  '55 0000 0000',
  'Ciudad de Mexico'
);

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
where profile_id = 'AUTH_USER_ID_AQUI';
```

## Configuracion de Auth

En Supabase:

1. Authentication.
2. URL Configuration.
3. Site URL:

```text
https://doctores.radioimagendentomaxilar.com
```

4. Redirect URLs:

```text
https://doctores.radioimagendentomaxilar.com/**
http://127.0.0.1:8003/**
```

5. Para una operacion privada, desactivar signup publico si no se quiere que cualquier persona cree cuenta.

## Storage

Bucket existente:

```text
result-temp
```

Uso recomendado:

```text
doctor_id/order_id/result_file_id/nombre_archivo
```

Reglas:

- Privado.
- Doctor solo descarga archivos de sus ordenes.
- Admin puede subir resultados.
- Links firmados para descargas temporales.
- Vigencia sugerida: 90 dias para archivos disponibles, 60 minutos para link firmado.

## Primer piloto real

Para iniciar sin saturarse:

1. Crear 1 admin real.
2. Crear 1 doctor real.
3. El doctor manda 2 ordenes.
4. Admin cambia estatus: `Recibida` -> `Agendada` -> `Completa`.
5. Admin sube resultado.
6. Doctor descarga resultado.
7. Confirmar que no ve ordenes de otros doctores.

## Criterio para decir que ya esta listo para operacion

Debe cumplirse:

- Login real con Supabase Auth.
- Ordenes se guardan en Supabase.
- Admin ve ordenes creadas por doctores reales.
- Doctor solo ve sus ordenes.
- Resultados se suben a Supabase Storage.
- Doctor descarga sin pedir apoyo manual.
- El estatus se actualiza para doctor y admin.
