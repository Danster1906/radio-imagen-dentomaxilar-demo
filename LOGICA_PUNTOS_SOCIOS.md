# Lógica de puntos - Socios Radio Imagen Dentomaxilar

## Objetivo

El programa de socios debe incentivar que los doctores refieran pacientes reales que sí acuden a Radio Imagen Dentomaxilar.

La lógica separa dos conceptos:

- **Nivel de socio:** se calcula por pacientes atendidos y validados.
- **Puntos:** funcionan como saldo complementario para beneficios, bonos, ajustes y auditoría.

## Regla principal

Cada paciente atendido y validado suma:

```text
1 paciente validado = 100 puntos
```

El punto se atribuye al `doctor_id` que creó la orden digital.

## Cuándo se asignan puntos

Los puntos se asignan sólo cuando Radio Imagen valida la atención del paciente:

1. El doctor crea una orden digital.
2. La orden queda en estado `Recibida`.
3. Admin contacta al paciente y puede cambiarla a `Agendada`.
4. El paciente acude y se realiza el estudio.
5. Admin cambia la orden a `Completa` o `Lista para descargar`.
6. La orden marca `counts_for_partner = true` y sólo entonces suma puntos.

Evento creado:

```text
partner_point_events.event_type = paciente_validado
partner_point_events.points = 100
partner_point_events.doctor_id = doctor que refiere
partner_point_events.order_id = orden validada
```

Una orden enviada no suma puntos por sí sola. Esto evita premiar órdenes canceladas, duplicadas, pruebas internas o pacientes que nunca asistieron.

## Por paciente, no por estudio

La lógica base debe ser por paciente atendido y validado, no por cantidad de estudios.

Ejemplo:

- Un doctor manda 1 paciente con ortopantomografía y admin valida asistencia = 100 puntos.
- Un doctor manda 1 paciente con CBCT + fotos + modelos y admin valida asistencia = 100 puntos.
- Un doctor manda 3 pacientes diferentes que sí acuden = 300 puntos.

Razón:

El objetivo del programa es premiar pacientes atendidos, no inflar puntos por seleccionar varios estudios dentro de una misma orden.

## Niveles

El nivel principal se calcula por número de pacientes atendidos y validados por admin.

| Nivel | Pacientes validados mínimos | Puntos base equivalentes |
| --- | ---: | ---: |
| Socio Activo | 1 | 100 |
| Socio Plata | 15 | 1,500 |
| Socio Oro | 25 | 2,500 |
| Socio Diamante | 50 | 5,000 |

## Beneficios por nivel

### Socio Activo

Se desbloquea desde el primer paciente validado.

Beneficios:

- Acceso a plataforma iTero.
- Xelis Dental Viewer.
- Sidexis Dental Viewer.
- Acceso a pláticas mensuales.
- Branding del doctor o clínica en sus estudios.
- Preferencia en comunicación con Radio Imagen.
- Newsletter semanal con información actualizada del mundo del diagnóstico.

### Socio Plata

Se desbloquea desde 15 pacientes validados.

Beneficios:

- Consulta personalizada de redes sociales con implementación IA.
- Cortesías mensuales para estudios seleccionados.
- Kit de contenidos para explicar diagnósticos a pacientes.
- Revisión mensual de pacientes validados y conversión.
- Plantillas personalizadas para solicitar estudios.

### Socio Oro

Se desbloquea desde 25 pacientes validados.

Beneficios:

- Dashboard mensual de desempeño y estudios más solicitados.
- Sesión bimestral de estrategia para crecer referencias.
- Capacitación grupal para el equipo de consulta.
- Prioridad extendida para agenda y liberación de resultados.
- Material co-brandeado para campañas de diagnóstico.

### Socio Diamante

Se desbloquea desde 50 pacientes validados.

Beneficios:

- Plan trimestral de crecimiento de consulta con KPIs.
- Capacitaciones privadas para el equipo completo.
- Eventos o webinars co-brandeados con Radio Imagen.
- Atención prioritaria para casos especiales y coordinación clínica.
- Reporte ejecutivo de retorno por pacientes validados.

## Eventos de puntos

Los puntos no deben guardarse solo como un número total. Deben guardarse como eventos para poder auditar el historial.

Tabla:

```text
partner_point_events
```

Tipos de evento permitidos:

| event_type | Uso |
| --- | --- |
| paciente_validado | Suma por paciente validado por admin |
| bono_perfil_completo | Bono por completar perfil |
| bono_capacitacion | Bono por asistir a capacitación |
| ajuste_manual | Ajuste manual de Radio Imagen |
| reverso_duplicado | Reverso por orden duplicada |
| reverso_cancelacion | Reverso por orden cancelada |
| canje_beneficio | Descuento o uso de puntos |

## Ejemplo de cálculo

Doctora Sofía:

- 18 pacientes validados.
- 18 eventos `paciente_validado` x 100 puntos = 1,800 puntos.
- 1 bono de perfil completo = 50 puntos.
- Total = 1,850 puntos.
- Nivel por pacientes validados = Socio Plata.
- Siguiente nivel = Socio Oro.
- Le faltan 7 pacientes para llegar a 25.

Dr. Marco:

- 8 pacientes validados.
- 8 eventos `paciente_validado` x 100 puntos = 800 puntos.
- 1 bono de capacitación = 20 puntos.
- Total = 820 puntos.
- Nivel por pacientes validados = Socio Activo.
- Siguiente nivel = Socio Plata.
- Le faltan 7 pacientes para llegar a 15.

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
paciente_validado = +100
reverso_cancelacion = -100
```

Esto permite conservar auditoría.

## Consultas útiles

### Ver nivel y avance

```sql
SELECT
  doctor_name,
  current_tier,
  referred_patients AS validated_patients_count,
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
