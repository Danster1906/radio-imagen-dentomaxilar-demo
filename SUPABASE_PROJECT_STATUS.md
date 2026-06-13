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
- `20260613232958_revoke_public_execute_role_helpers`

## Tablas creadas

- `profiles`
- `doctor_profiles`
- `partner_tiers`
- `doctor_partner_status`
- `studies`
- `orders`
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

## Advertencias pendientes

Supabase Advisor conserva advertencias para:

- `current_app_role()`
- `current_doctor_id()`

Motivo:

Son funciones `SECURITY DEFINER` usadas por las políticas RLS para saber si el usuario es doctor o admin.

Antes de producción conviene moverlas a un esquema privado o reemplazarlas por un patrón que no aparezca como RPC ejecutable para usuarios autenticados.

## Próximos pasos operativos

1. Crear usuarios reales en Supabase Auth.
2. Insertar perfiles en `profiles`.
3. Insertar doctores en `doctor_profiles`.
4. Conectar login del frontend a Supabase Auth.
5. Cambiar el formulario `Nueva orden` para insertar en `orders` y `order_studies`.
6. Cambiar admin para leer y actualizar órdenes reales.
7. Crear edge function o endpoint seguro para solicitar descargas.
8. Conectar el agente local a `download_requests` y `result_files`.

