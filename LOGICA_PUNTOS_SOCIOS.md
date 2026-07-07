# Lógica de puntos - Socios Radio Imagen Dentomaxilar

## Objetivo

El programa de socios debe incentivar que los doctores usen la plataforma para referir pacientes a Radio Imagen Dentomaxilar.

La lógica separa dos conceptos:

- **Nivel de socio:** se calcula por pacientes referidos.
- **Puntos:** funcionan como saldo complementario para beneficios, bonos, ajustes y auditoría.

## Regla principal

Cada paciente referido válido suma:

```text
1 paciente referido validado = 100 puntos
```

El punto se atribuye a la cuenta (`email`) del doctor que creó la orden digital.

## Cuándo se asignan puntos

> **Implementación real (`app.js` → `validateAttendedOrder`, `server.js`, `db.js`):** los puntos NO se asignan al crear la orden. Se asignan cuando Radio Imagen (admin) **valida que el paciente acudió** y marca la orden como `Completa` (`countsForPartner = true`). Una orden en estado `Recibida` todavía no genera puntos.

Los puntos se asignan cuando:

1. El doctor creó una orden digital con un paciente asociado.
2. El admin valida la asistencia del paciente y la orden pasa a `Completa`.
3. La orden no es una duplicación evidente ni una prueba interna.

Al validar, se suman 100 puntos e +1 paciente referido a la cuenta, y se registra un evento auditable.

Evento creado (tabla real `partner_events`):

```text
partner_events.reason  = validation      -- 'reversal' si luego se revierte
partner_events.delta   = 100
partner_events.email   = doctor que refiere
partner_events.order_id = orden validada
```

## Por paciente, no por estudio

La lógica base debe ser por paciente referido, no por cantidad de estudios.

Ejemplo:

- Un doctor manda 1 paciente con ortopantomografía = 100 puntos.
- Un doctor manda 1 paciente con CBCT + fotos + modelos = 100 puntos.
- Un doctor manda 3 pacientes diferentes = 300 puntos.

Razón:

El objetivo del programa es premiar la referencia de pacientes, no inflar puntos por seleccionar varios estudios dentro de una misma orden.

## Niveles

El nivel principal se calcula por número de pacientes referidos acumulados.

| Nivel | Pacientes referidos mínimos | Puntos base equivalentes |
| --- | ---: | ---: |
| Socio Activo | 1 | 100 |
| Socio Plata | 15 | 1,500 |
| Socio Oro | 25 | 2,500 |
| Socio Diamante | 50 | 5,000 |

## Beneficios por nivel

### Socio Activo

Se desbloquea desde el primer paciente referido.

Beneficios:

- Acceso a plataforma iTero.
- Xelis Dental Viewer.
- Sidexis Dental Viewer.
- Acceso a pláticas mensuales.
- Branding del doctor o clínica en sus estudios.
- Preferencia en comunicación con Radio Imagen.
- Newsletter semanal con información actualizada del mundo del diagnóstico.

### Socio Plata

Se desbloquea desde 15 pacientes referidos.

Beneficios:

- Consulta personalizada de redes sociales con implementación IA.
- Cortesías mensuales para estudios seleccionados.
- Kit de contenidos para explicar diagnósticos a pacientes.
- Revisión mensual de pacientes referidos y conversión.
- Plantillas personalizadas para solicitar estudios.

### Socio Oro

Se desbloquea desde 25 pacientes referidos.

Beneficios:

- Dashboard mensual de desempeño y estudios más solicitados.
- Sesión bimestral de estrategia para crecer referencias.
- Capacitación grupal para el equipo de consulta.
- Prioridad extendida para agenda y liberación de resultados.
- Material co-brandeado para campañas de diagnóstico.

### Socio Diamante

Se desbloquea desde 50 pacientes referidos.

Beneficios:

- Plan trimestral de crecimiento de consulta con KPIs.
- Capacitaciones privadas para el equipo completo.
- Eventos o webinars co-brandeados con Radio Imagen.
- Atención prioritaria para casos especiales y coordinación clínica.
- Reporte ejecutivo de retorno por pacientes referidos.

## Eventos de puntos

Los puntos no deben guardarse solo como un número total. Deben guardarse como eventos para poder auditar el historial.

Tabla real (`db.js`):

```text
partner_events (id, email, order_id, delta, reason, created_at)
```

El acumulado de cada doctor vive además en `accounts.points` y `accounts.referred_patients`.

Razones (`reason`) que el código escribe hoy:

| reason | Uso |
| --- | --- |
| validation | Suma por paciente referido validado (+100) |
| reversal | Reverso cuando se revierte una validación (−100) |
| manual | Ajuste manual (valor por defecto de `addEvent`) |

> Las razones extendidas (`profile_completion_bonus`, `training_attendance_bonus`, `duplicate_reversal`, `reward_redemption`, etc.) son **diseño futuro**: aún no las genera el código.

## Ejemplo de cálculo

Doctora Sofía:

- 18 pacientes referidos.
- 18 eventos `referred_patient` x 100 puntos = 1,800 puntos.
- 1 bono de perfil completo = 50 puntos.
- Total = 1,850 puntos.
- Nivel por pacientes referidos = Socio Plata.
- Siguiente nivel = Socio Oro.
- Le faltan 7 pacientes para llegar a 25.

Dr. Marco:

- 8 pacientes referidos.
- 8 eventos `referred_patient` x 100 puntos = 800 puntos.
- 1 bono de capacitación = 20 puntos.
- Total = 820 puntos.
- Nivel por pacientes referidos = Socio Activo.
- Siguiente nivel = Socio Plata.
- Le faltan 7 pacientes para llegar a 15.

## Cashback

> **Diseño futuro — no implementado.** No existe la tabla `partner_cashback_events` ni lógica de cashback en `db.js`, `server.js` ni `app.js`. Esta sección describe una propuesta.

El cashback es un beneficio financiero separado de los puntos.

Regla MVP:

```text
cashback = estudios_pagados_del_paciente * 10%
```

Se registra en:

```text
partner_cashback_events
```

Estados sugeridos:

- `pending`: calculado, pendiente de validación.
- `approved`: validado por Radio Imagen.
- `paid`: pagado o aplicado.
- `cancelled`: cancelado.

El cashback no cambia el nivel del doctor.

## Qué pasa si una orden se cancela

Si una validación que ya había generado puntos se revierte, no se borra el evento original. Se crea un evento negativo.

Ejemplo (tal como lo escribe el código):

```text
validation = +100
reversal   = -100
```

Esto permite conservar auditoría.

## Consultas útiles

> **Diseño futuro — no implementado.** Las vistas `v_doctor_partner_progress`, `v_partner_points_by_doctor`, `v_doctor_dashboard_metrics` y `v_top_studies_by_doctor` NO existen en la base actual. Hoy los niveles y métricas se calculan en el frontend (`app.js`: `partnerTiers`, `computeDoctorMetrics`) sobre las órdenes y `partner_events`. Las siguientes SQL son una propuesta para un esquema normalizado futuro.

### Ver nivel y avance

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

### Ver puntos por doctor

```sql
SELECT
  doctor_name,
  total_points_from_events
FROM v_partner_points_by_doctor;
```

### Ver métricas del panel

```sql
SELECT *
FROM v_doctor_dashboard_metrics;
```

### Ver estudio más pedido

```sql
SELECT *
FROM v_top_studies_by_doctor;
```

## Recomendación para producción

Al validar una orden, el backend debe hacer sus operaciones en una misma transacción:

1. Actualizar el estado de la orden en `orders` a `Completa`.
2. Registrar el evento en `partner_events` (reason `validation`).
3. Actualizar el acumulado en `accounts.points` y `accounts.referred_patients`.

Así se evita que una validación exista sin puntos, o que existan puntos sin una orden válida.
