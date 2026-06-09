# Lógica de puntos - Socios Radio Imagen Dentomaxilar

## Objetivo

El programa de socios debe incentivar que los doctores usen la plataforma para referir pacientes a Radio Imagen Dentomaxilar.

La lógica separa dos conceptos:

- **Nivel de socio:** se calcula por pacientes referidos.
- **Puntos:** funcionan como saldo complementario para beneficios, bonos, ajustes y auditoría.

## Regla principal

Cada paciente referido válido suma:

```text
1 paciente referido = 100 puntos
```

El punto se atribuye al `doctor_id` que creó la orden digital.

## Cuándo se asignan puntos

En el MVP, los puntos se asignan cuando:

1. El doctor crea una orden digital.
2. La orden queda en estado `recibida`.
3. La orden tiene un paciente asociado.
4. La orden no es una duplicación evidente ni una prueba interna.

Evento creado:

```text
partner_point_events.reason = referred_patient
partner_point_events.points = 100
partner_point_events.doctor_id = doctor que refiere
partner_point_events.order_id = orden generada
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
| Socio Radio Imagen Dentomaxilar | 1 | 100 |
| Socio Activo | 5 | 500 |
| Socio Plata | 10 | 1,000 |
| Socio Oro | 25 | 2,500 |
| Socio Diamante | 50 | 5,000 |

## Beneficios por nivel

### Socio Radio Imagen Dentomaxilar

Se desbloquea desde el primer paciente referido.

Beneficios:

- Acceso a plataforma iTero.
- Xelis Dental Viewer.
- Sidexis Dental Viewer.
- 10% cashback en los estudios de sus pacientes.
- Capacitación 1 a 1.

### Socio Activo

Se desbloquea desde 5 pacientes referidos.

Beneficios:

- Invitación preferente para pláticas y capacitaciones.
- Presentación de estudios ortodónticos personalizada.
- Material digital para explicar estudios a pacientes.
- Soporte para preparar casos antes de iniciar tratamiento.
- Avisos prioritarios cuando los resultados estén listos.

### Socio Plata

Se desbloquea desde 10 pacientes referidos.

Beneficios:

- Prioridad en seguimiento operativo.
- Plantillas personalizadas para solicitar estudios.
- Resumen mensual de pacientes referidos.
- Revisión trimestral de estudios más solicitados.

### Socio Oro

Se desbloquea desde 25 pacientes referidos.

Beneficios:

- Reporte mensual personalizado.
- Sesión de lectura de KPIs de referidos.
- Apoyo para campañas internas de diagnóstico.
- Capacitación grupal para el equipo de consulta.

### Socio Diamante

Se desbloquea desde 50 pacientes referidos.

Beneficios:

- Beneficios preferenciales y planeación conjunta.
- Agenda preferente para capacitaciones privadas.
- Revisión estratégica de crecimiento de consulta.
- Material co-brandeado para comunicación con pacientes.

## Eventos de puntos

Los puntos no deben guardarse solo como un número total. Deben guardarse como eventos para poder auditar el historial.

Tabla:

```text
partner_point_events
```

Razones permitidas:

| reason | Uso |
| --- | --- |
| referred_patient | Suma por paciente referido válido |
| profile_completion_bonus | Bono por completar perfil |
| training_attendance_bonus | Bono por asistir a capacitación |
| manual_adjustment | Ajuste manual de Radio Imagen |
| duplicate_reversal | Reverso por orden duplicada |
| cancelled_order_reversal | Reverso por orden cancelada |
| reward_redemption | Descuento o uso de puntos |

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
- Le faltan 2 pacientes para llegar a 10.

## Cashback

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

Si una orden ya había generado puntos y luego se cancela, no se borra el evento original. Se crea un evento negativo.

Ejemplo:

```text
referred_patient = +100
cancelled_order_reversal = -100
```

Esto permite conservar auditoría.

## Consultas útiles

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

En producción, el backend debe hacer tres operaciones en una misma transacción:

1. Crear `orders`.
2. Crear `partner_point_events` si la orden es válida.
3. Recalcular `doctor_partner_status`.

Así se evita que una orden exista sin puntos, o que existan puntos sin una orden válida.
