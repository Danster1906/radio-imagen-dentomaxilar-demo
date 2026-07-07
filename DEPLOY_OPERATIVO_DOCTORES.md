# Deployment operativo para doctores

> Esta guía refleja la operación **real** del portal. Reemplaza versiones anteriores que
> describían un despliegue estático por ZIP (Neubox) y una integración con Supabase
> (Auth, `order_studies`, `doctor_partner_status`, Edge Function `create-doctor`, bucket
> `result-temp`): ese diseño fue descartado. Hoy todo corre en una sola app Node en Replit,
> con PostgreSQL y Object Storage de Replit. Para la infraestructura, ver
> [`REPLIT_DEPLOYMENT.md`](REPLIT_DEPLOYMENT.md).

## Arquitectura de la operación real

- **Una sola app Node** (`server.js`) publicada en Replit como **Autoscale Deployment**.
- **PostgreSQL de Replit** (`db.js`) guarda cuentas, órdenes, eventos de puntos y el índice de archivos. No hay Supabase.
- **Object Storage de Replit** (`storage.js`) guarda temporalmente los archivos de resultados.
- **Login propio**: correo autorizado + contraseña con hash scrypt. El alta de cuentas la hace el admin desde el panel; no hay signup público ni OAuth.

## Ruta para iniciar operación real

1. Publicar la app en Replit como Autoscale Deployment (ver `REPLIT_DEPLOYMENT.md`).
2. Configurar los Secrets: `ADMIN_TOKEN` (obligatorio en producción) y, para correos, `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` y `PORTAL_URL`.
3. Iniciar sesión como admin y dar de alta 1 doctor de confianza.
4. Hacer la prueba de humo operativa (sección "Primer piloto real").
5. Abrir a 3–5 doctores.

## Alta de doctores (desde el panel admin)

Es el único flujo de alta. No se crean usuarios en ninguna consola externa.

1. Iniciar sesión como admin.
2. Entrar a **Admin Radio Imagen → Doctores**.
3. Llenar el formulario:

   ```text
   Nombre
   Correo
   Contraseña inicial
   Especialidad
   Clínica
   Teléfono
   Ciudad
   Tipo de cuenta (Personal o Clínica)
   Pacientes validados iniciales
   ```

4. Presionar **Crear doctor y asignar puntos**.

Al crear, el sistema (`server.js` → `createAccount` en `db.js`):

- Inserta una fila en la tabla `accounts` con `role = 'doctor'`.
- Genera un `id` correlativo tipo `DR-0001`.
- Guarda la contraseña **hasheada con scrypt** (nunca en texto plano; el admin puede asignarla pero no verla).
- Convierte los "pacientes validados iniciales" en puntos: `pacientes × 100`.

> **Tipo de cuenta.** *Personal*: las órdenes quedan a nombre del doctor. *Clínica*: al crear una orden se elige el doctor tratante de su propia lista (o se agrega uno nuevo al vuelo); los puntos de Socios se acumulan a la cuenta clínica.

### Contraseñas y seguridad

- Las contraseñas se guardan con hash scrypt (`password_hash`). Las cuentas antiguas en texto plano se migran automáticamente al arrancar o al iniciar sesión.
- El API nunca devuelve contraseñas.
- El token de admin se fija con `ADMIN_TOKEN` para que sobreviva reinicios/escala; si no existe, se genera uno aleatorio por instancia.

## Flujo operativo de una orden

```text
Doctor crea la orden           -> status: Recibida
Admin agenda al paciente       -> status: Agendada
Admin valida que el paciente acudió -> status: Completa  (suma +100 pts y +1 paciente referido)
Admin sube el resultado        -> status: Lista para descargar
Doctor descarga (una sola vez) -> el archivo se elimina del Object Storage
```

Los puntos de Socios se otorgan en el paso **Completa** (validación de asistencia), no al crear la orden. Detalle en [`LOGICA_PUNTOS_SOCIOS.md`](LOGICA_PUNTOS_SOCIOS.md).

## Resultados (subida y descarga)

- El admin sube el archivo (ZIP/DCM/PDF/STL… hasta **2.5 GB**) desde el panel **Resultados**, arrastrar-y-soltar. La subida va por **fragmentos de 15 MB** directo al Object Storage de Replit, con barra de progreso y reintentos.
- El doctor recibe un correo de aviso (si hay SMTP configurado).
- La descarga es **de un solo uso**: al completarse, el archivo se elimina del storage. Si el doctor lo necesita de nuevo, usa **Solicitar reenvío** y el admin lo ve marcado.
- Si una descarga se corta a medias, el archivo **no** se borra y se puede reintentar. Las subidas abandonadas se limpian solas a las 24 h.

## Primer piloto real

1. Crear 1 admin real (semilla o alta) y 1 doctor real desde el panel.
2. El doctor crea 2 órdenes.
3. El admin cambia el estatus: `Recibida` → `Agendada` → `Completa`.
4. El admin sube un resultado de prueba.
5. El doctor descarga el resultado.
6. Confirmar que el doctor **solo** ve sus propias órdenes.

## Criterio de "listo para operación"

- Login real con correo + contraseña (scrypt).
- Las órdenes se guardan en PostgreSQL y el admin ve las creadas por doctores reales.
- Cada doctor solo ve sus órdenes.
- Los resultados se suben al Object Storage y el doctor descarga sin apoyo manual.
- El estatus se actualiza para doctor y admin.
- Al validar asistencia (`Completa`), los puntos de Socios se acreditan correctamente.
