# Lógica de información

## Principio central

La plataforma debe funcionar con una lógica simple:

```text
Doctor crea orden -> Radio Imagen recibe -> Radiodiagnóstico da seguimiento -> Doctor consulta estado/resultado
```

El doctor no administra el flujo interno. Solo crea órdenes, consulta sus órdenes y accede a resultados.

Radio Imagen/Radiodiagnóstico sí administra estados, agenda operativa, carga de resultados y seguimiento.

## Objetos principales

### Doctor

Representa al profesional que refiere pacientes.

Información necesaria:

- Nombre profesional.
- Especialidad.
- Clínica.
- Correo.
- Teléfono.
- Imagen de perfil.
- Preferencias operativas para Radio Imagen.

### Paciente

Representa a la persona enviada a estudio.

Información necesaria:

- Nombre completo.
- Fecha de nacimiento.
- Teléfono.
- Doctor que lo refiere.
- Clínica de origen.

### Orden

Es el centro del sistema.

Información necesaria:

- Folio.
- Doctor.
- Clínica.
- Paciente.
- Fecha de remisión.
- Estudios solicitados.
- Indicaciones clínicas.
- Estado actual.
- Historial de estado.

### Socio Radio Imagen Dentomaxilar

Representa la clasificación del doctor dentro del programa de referidos.

Reglas iniciales:

- Cuando Radio Imagen valida que el primer paciente referido acudió (orden `Completa`), el doctor suma su primer paciente referido y se activa como `Socio Activo`. Crear la orden por sí solo aún no otorga nivel ni puntos.
- Cada paciente referido validado suma puntos.
- Los pacientes referidos definen el nivel principal.
- Los puntos acumulados funcionan como saldo complementario para recompensas.
- Cada nivel puede desbloquear recompensas operativas o comerciales.
- Cada movimiento de puntos debe guardarse como evento auditable.

Niveles reales (según `app.js` → `partnerTiers`):

- `Socio Activo`: desde 1 paciente referido.
- `Socio Plata`: desde 15 pacientes referidos.
- `Socio Oro`: desde 25 pacientes referidos.
- `Socio Diamante`: desde 50 pacientes referidos.

> El detalle de beneficios por nivel es la fuente única en [`LOGICA_PUNTOS_SOCIOS.md`](LOGICA_PUNTOS_SOCIOS.md), que coincide con los arrays `benefits` de `app.js`.

### Estudio

Catálogo controlado por Radio Imagen.

Información necesaria:

- Nombre del estudio.
- Categoría.
- Precio opcional.
- Estado activo/inactivo.
- Indicaciones o preparación opcional.
- Reglas especiales cuando el estudio requiere especificaciones.

Tomografía 3D:

- FOV `17x13`: no requiere especificación adicional.
- FOV `11x10`: no requiere especificación adicional.
- FOV `8x8`: requiere especificar `Maxilar` o `Mandibular`.
- FOV `5x5`: requiere especificar pieza de interés.

Estudio Ortodóntico Completo:

- Versión `2D`: incluye ortopantomografía, lateral de cráneo, escaneo intraoral, modelos en resina, fotografía extraoral e intraoral y análisis cefalométrico.
- Versión `3D`: incluye todo lo anterior más Tomografía 3D.
- Debe seleccionar el análisis cefalométrico específico, por ejemplo Rickets, Steiner, Mc. Namara, Tweed, Jaraback o Downs.
- Puede incluir indicaciones especiales del doctor para Radio Imagen/Radiodiagnóstico.
- Si la versión es `3D`, debe capturar FOV con las mismas reglas de Tomografía 3D.

### Resultado

Archivo o enlace asociado a una orden.

Información necesaria:

- Orden relacionada.
- Nombre del archivo.
- URL o ubicación.
- Tipo de archivo.
- Fecha de carga.
- Fecha de descarga/consulta.

## Lógica de permisos

### Doctor

Puede:

- Ver su perfil.
- Editar su perfil.
- Crear órdenes.
- Ver solo sus órdenes.
- Ver estado de sus órdenes.
- Descargar resultados de sus órdenes.

No puede:

- Ver órdenes de otros doctores.
- Cambiar estados internos.
- Subir resultados.
- Editar catálogo de estudios.

### Radio Imagen / Radiodiagnóstico

Puede:

- Ver todas las órdenes.
- Filtrar por doctor, clínica, estado y fecha.
- Cambiar estado de una orden.
- Agregar notas internas.
- Subir resultados.
- Marcar resultado como listo.
- Consultar métricas operativas.

### Administrador

Puede:

- Administrar doctores.
- Administrar clínicas.
- Administrar catálogo de estudios.
- Administrar usuarios internos.
- Consultar reportes globales.

## Flujo de creación de orden

1. Doctor inicia sesión.
2. Sistema carga la cuenta del doctor desde `accounts`.
3. Doctor llena datos del paciente.
4. Doctor selecciona estudios.
5. Sistema valida reglas especiales del estudio, por ejemplo FOV de Tomografía 3D.
6. Sistema crea la orden: una fila en `orders` con todo el detalle (paciente, estudios, configuraciones, indicaciones) dentro de la columna `data` (JSONB) y `status = 'Recibida'`.
7. Radio Imagen ve la orden en bandeja de seguimiento.

> Modelo real: la orden es una sola fila en `orders` (`db.js`); no existen tablas separadas `order_studies` ni `order_status_events`. Un esquema normalizado con esas tablas es diseño futuro (ver `DATA_MODEL.md`).

## Flujo de seguimiento por Radiodiagnóstico

1. Radio Imagen abre bandeja de órdenes.
2. Filtra órdenes nuevas o pendientes.
3. Revisa información del paciente.
4. Cambia estado según avance:
   - `Recibida`
   - `Agendada`
   - `Completa`
   - `Lista para descargar`
   - `Cancelada`
5. Cada cambio actualiza `orders.status` (y `updated_at`).
6. Si el paciente acudió, `Completa` valida asistencia y otorga puntos (evento en `partner_events`).
7. Si el resultado está listo, el admin sube los archivos: se registran en `files_index` y los binarios van al Object Storage de Replit (`storage.js`).
8. El doctor ve la orden como `Lista para descargar` y puede descargar el resultado (descarga de un solo uso).

## Lógica de métricas

Las métricas no deben guardarse como datos fijos al inicio. Se calculan desde órdenes y eventos.

> Hoy las métricas del panel se calculan en el frontend (`app.js` → `computeDoctorMetrics`) leyendo las órdenes (con su detalle en `data` JSONB). Las SQL de abajo son ilustrativas: las que consultan `orders.status` funcionan tal cual; las que usan `order_studies`/`studies` asumen un esquema normalizado que aún no existe (los estudios viven dentro de `orders.data`).

```sql
-- Órdenes activas por doctor (funciona sobre el esquema real)
SELECT COUNT(*)
FROM orders
WHERE doctor_id = :doctor_id
AND status IN ('Recibida', 'Agendada', 'Completa');
```

```sql
-- Estudios más solicitados (requiere esquema normalizado futuro;
-- hoy los estudios están en orders.data -> 'studies')
SELECT studies.name, COUNT(*) AS total
FROM order_studies
JOIN studies ON studies.id = order_studies.study_id
JOIN orders ON orders.id = order_studies.order_id
WHERE orders.doctor_id = :doctor_id
GROUP BY studies.name
ORDER BY total DESC;
```

```sql
-- Conversión de órdenes a resultados listos (funciona sobre el esquema real)
SELECT
  COUNT(*) FILTER (WHERE status IN ('Completa', 'Lista para descargar'))::decimal
  / NULLIF(COUNT(*), 0) AS conversion
FROM orders
WHERE doctor_id = :doctor_id;
```

## Decisiones importantes

- La orden digital es la fuente de verdad.
- El paciente puede existir muchas veces si viene de distintos doctores, hasta que se decida hacer deduplicación.
- Los resultados se asocian a órdenes, no a pacientes sueltos.
- El historial de estado es obligatorio para saber quién cambió qué y cuándo.
- El módulo de agenda/finanzas debe construirse después, sin mezclarlo con el flujo actual.
