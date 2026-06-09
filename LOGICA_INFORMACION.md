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

- Al mandar su primer paciente, el doctor se convierte automáticamente en `Socio Radio Imagen Dentomaxilar`.
- Cada paciente referido suma puntos.
- Los pacientes referidos definen el nivel principal.
- Los puntos acumulados funcionan como saldo complementario para recompensas.
- Cada nivel puede desbloquear recompensas operativas o comerciales.
- Cada movimiento de puntos debe guardarse como evento auditable.

Niveles iniciales:

- `Socio Radio Imagen Dentomaxilar`: desde 1 paciente referido.
- `Socio Activo`: desde 5 pacientes referidos.
- `Socio Plata`: desde 10 pacientes referidos.
- `Socio Oro`: desde 25 pacientes referidos.
- `Socio Diamante`: desde 50 pacientes referidos.

Beneficios iniciales:

- `Socio Radio Imagen Dentomaxilar`: acceso a plataforma iTero, Xelis Dental Viewer, Sidexis Dental Viewer, 10% cashback en estudios de pacientes y capacitación 1 a 1.
- `Socio Activo`: invitación preferente a pláticas/capacitaciones, presentación personalizada de estudios ortodónticos, material digital para explicar estudios, soporte para preparar casos y avisos prioritarios de resultados.
- `Socio Plata`: prioridad en seguimiento, plantillas personalizadas, resumen mensual de pacientes referidos y revisión trimestral de estudios más solicitados.
- `Socio Oro`: reporte mensual personalizado, sesión de KPIs, apoyo para campañas de diagnóstico y capacitación grupal para el equipo.
- `Socio Diamante`: beneficios preferenciales, planeación conjunta, capacitaciones privadas, revisión estratégica de crecimiento y material co-brandeado.

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
2. Sistema carga `doctor_profile`.
3. Doctor llena datos del paciente.
4. Sistema crea o reutiliza paciente.
5. Doctor selecciona estudios.
6. Sistema valida reglas especiales del estudio, por ejemplo FOV de Tomografía 3D.
7. Sistema crea `order`.
8. Sistema crea registros en `order_studies`.
9. Sistema guarda configuraciones especiales en `order_studies.configuration`.
10. Sistema crea primer evento en `order_status_events` con estado `recibida`.
11. Radio Imagen ve la orden en bandeja de seguimiento.

## Flujo de seguimiento por Radiodiagnóstico

1. Radio Imagen abre bandeja de órdenes.
2. Filtra órdenes nuevas o pendientes.
3. Revisa información del paciente.
4. Cambia estado según avance:
   - `recibida`
   - `en_revision`
   - `agendada`
   - `en_proceso`
   - `lista`
   - `entregada`
   - `cancelada`
5. Cada cambio crea un evento histórico.
6. Si el resultado está listo, se crea un registro en `results`.
7. El doctor ve la orden como lista y puede descargar resultado.

## Lógica de métricas

Las métricas no deben guardarse como datos fijos al inicio. Se calculan desde órdenes y eventos.

Ejemplos:

```sql
-- Órdenes activas por doctor
SELECT COUNT(*)
FROM orders
WHERE doctor_id = :doctor_id
AND status IN ('recibida', 'en_revision', 'agendada', 'en_proceso');
```

```sql
-- Estudios más solicitados
SELECT studies.name, COUNT(*) AS total
FROM order_studies
JOIN studies ON studies.id = order_studies.study_id
JOIN orders ON orders.id = order_studies.order_id
WHERE orders.doctor_id = :doctor_id
GROUP BY studies.name
ORDER BY total DESC;
```

```sql
-- Conversión de órdenes a resultados listos
SELECT
  COUNT(*) FILTER (WHERE status IN ('lista', 'entregada'))::decimal
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
