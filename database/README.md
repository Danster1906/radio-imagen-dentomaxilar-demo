# Base de datos demo

Esta carpeta contiene una base de datos demo para visualizar cómo funcionaría Radio Imagen Dentomaxilar con datos reales.

## Archivos

- `schema.sql`: estructura de tablas y vistas.
- `seed.sql`: datos de ejemplo.
- `radio_imagen_demo.sqlite`: base SQLite generada para pruebas locales.

## Reconstruir la base

Desde la raíz del proyecto:

```bash
rm -f database/radio_imagen_demo.sqlite
sqlite3 database/radio_imagen_demo.sqlite < database/schema.sql
sqlite3 database/radio_imagen_demo.sqlite < database/seed.sql
```

## Abrir la base

```bash
sqlite3 database/radio_imagen_demo.sqlite
```

## Consultas rápidas

### Niveles y puntos de socios

```sql
SELECT
  doctor_name,
  current_tier,
  referred_patients_count,
  total_points,
  next_tier,
  referrals_to_next_tier
FROM v_doctor_partner_progress;
```

### Métricas del panel

```sql
SELECT *
FROM v_doctor_dashboard_metrics;
```

### Estudios más solicitados

```sql
SELECT *
FROM v_top_studies_by_doctor;
```

### Eventos de puntos

```sql
SELECT
  d.full_name,
  ppe.points,
  ppe.reason,
  ppe.description,
  ppe.created_at
FROM partner_point_events ppe
JOIN doctors d ON d.id = ppe.doctor_id
ORDER BY ppe.created_at DESC;
```

## Cómo se interpreta

El nivel del doctor se calcula por pacientes referidos:

- 1 paciente: Socio Radio Imagen Dentomaxilar.
- 5 pacientes: Socio Activo.
- 10 pacientes: Socio Plata.
- 25 pacientes: Socio Oro.
- 50 pacientes: Socio Diamante.

Los puntos son un saldo complementario:

```text
1 paciente referido válido = 100 puntos
```

Los bonos, ajustes o reversos se guardan como eventos separados en `partner_point_events`.
