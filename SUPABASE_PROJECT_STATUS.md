# Supabase - Radio Imagen Dentomaxilar

## Proyecto

- Nombre: `radio-imagen-dentomaxilar`
- Project ID / ref: `wwrfuwtvllgecjmfjfwf`
- URL: `https://wwrfuwtvllgecjmfjfwf.supabase.co`
- Región: `us-east-1`
- Organización: `Danster1906's`
- Plan actual: `free`

## Clave pública para frontend

Usar la publishable key moderna:

```text
sb_publishable_9-mqQEWpDWG4UL_rL6dxsw_uJSfXK7P
```

No usar ni subir llaves privadas/service role al hosting.

## Migraciones aplicadas

- `20260613232826_initial_radio_imagen_schema`
- `20260613232912_harden_role_helper_functions`
- `20260613232941_revoke_public_execute_role_helpers`
- `20260615174535_add_attended_validation_control`
- `20260615180425_simplify_order_status_workflow`
- `20260615180513_enable_realtime_operational_tables`
- `prepare_operational_access_policies`
- `harden_helpers_and_add_operational_indexes`

## Tablas creadas

- `profiles`
- `doctor_profiles`
- `partner_tiers`
- `doctor_partner_status`
- `studies`
- `orders`
- `order_status_events`
- `order_studies`
- `result_packages`
- `result_files`
- `download_requests`
- `local_agent_matches`
- `partner_point_events`

Todas tienen RLS activado.

## Datos iniciales

- `partner_tiers`: 4 niveles
  - Socio Activo
  - Socio Plata
  - Socio Oro
  - Socio Diamante
- `studies`: 23 estudios cargados

## Storage

Bucket creado:

```text
result-temp
```

Configuración:

- Privado
- Límite inicial: 500 MB por archivo
- Uso previsto: almacenamiento temporal de resultados solicitados por doctores
- Políticas activas:
  - Admin autenticado puede subir, actualizar, leer y eliminar archivos.
  - Doctor autenticado sólo puede leer archivos dentro de su carpeta `doctor_id`.

## Seguridad

Estado actual:

- Security Advisor: sin warnings.
- RLS activo en tablas operativas.
- Helpers `current_app_role()` y `current_doctor_id()` movidos a esquema privado `app_private`.
- Bucket `result-temp` privado.

## Performance

Estado actual:

- Se agregaron índices para llaves foráneas operativas.
- Performance Advisor aún puede mostrar índices como `unused_index` porque todavía no hay tráfico real.
- También puede mostrar recomendaciones `auth_rls_initplan` para optimizar políticas a escala; no bloquean el piloto inicial.

## Próximos pasos operativos

1. Crear usuarios reales en Supabase Auth.
2. Insertar perfiles en `profiles`.
3. Insertar doctores en `doctor_profiles`.
4. Conectar login del frontend a Supabase Auth.
5. Cambiar el formulario `Nueva orden` para insertar en `orders` y `order_studies`.
6. Cambiar admin para validar pacientes atendidos y crear `partner_point_events`.
7. Cambiar admin para leer y actualizar órdenes reales.
8. Crear edge function o endpoint seguro para solicitar descargas.
9. Conectar el agente local a `download_requests` y `result_files`.

## Control de pacientes validados

Una orden referida no suma puntos automáticamente.

Campos agregados a `orders`:

- `counts_for_partner`
- `patient_attended_at`
- `validated_by`
- `partner_points_awarded_at`
- `scheduled_at`
- `scheduled_by`
- `completed_at`

Tabla agregada:

- `order_status_events`

Regla:

```text
Orden creada -> status Recibida -> no suma puntos
Admin agenda por WhatsApp -> status Agendada -> visible para el doctor
Admin confirma paciente atendido -> status Completa -> suma 100 puntos una sola vez
Admin libera resultados -> status Lista para descargar -> doctor puede descargar
Cancelada -> no suma puntos
```

## Realtime

Tablas habilitadas en `supabase_realtime`:

- `orders`
- `order_status_events`
- `result_files`
- `download_requests`

Uso previsto:

- Doctor escucha cambios de sus órdenes por `doctor_id`.
- Admin escucha cambios globales de operación.
- Cuando Radio Imagen actualiza estatus, el doctor puede ver el cambio sin recargar manualmente.
