# PDR de cambios

Este archivo documenta los cambios funcionales y de producto. Cada cambio futuro debe registrarse aquí con fecha, objetivo, alcance y efecto en datos.

## 2026-06-06 - Documentación funcional y lógica operativa

### Objetivo

Formalizar la plataforma como un flujo donde los doctores generan órdenes digitales y Radio Imagen/Radiodiagnóstico les da seguimiento.

### Cambios realizados

- Se creó `PDR_RADIO_IMAGEN.md`.
- Se creó `LOGICA_INFORMACION.md`.
- Se actualizó `DATA_MODEL.md` para incluir seguimiento operativo de Radio Imagen.
- Se actualizó `README.md` para reflejar el alcance actual del portal del doctor.
- Se creó `DOCUMENTO_MAESTRO.md` para consolidar toda la documentación principal.

### Razón del cambio

La plataforma ya no debe describirse como solo prototipo visual. Necesita una base funcional clara para construir backend, permisos, base de datos y seguimiento interno.

### Impacto en producto

- El doctor queda definido como generador de órdenes.
- Radio Imagen queda definido como responsable de seguimiento operativo.
- La información se organiza alrededor de órdenes, estados, resultados y eventos.

### Impacto en datos

- Se agregan entidades de seguimiento como `order_status_events`, `radio_staff` y `order_assignments`.
- Se aclara que cada doctor solo accede a órdenes propias.
- Se define historial de estado para auditoría.

## 2026-06-07 - Reglas condicionales para Tomografía 3D

### Objetivo

Agregar Tomografía 3D como servicio especial con tamaños FOV y validaciones específicas.

### Cambios realizados

- Se agregó Tomografía 3D al catálogo.
- Se agregaron opciones FOV `17x13`, `11x10`, `8x8` y `5x5`.
- Se agregó validación para que `8x8` solicite maxilar o mandibular.
- Se agregó validación para que `5x5` solicite pieza de interés.
- Se documentó `studies.config` y `order_studies.configuration`.

### Razón del cambio

Tomografía 3D no funciona como un estudio simple: requiere capturar parámetros clínicos para que Radio Imagen sepa qué región debe observar.

### Impacto en producto

El doctor puede solicitar Tomografía 3D sin ambigüedad y Radio Imagen recibe la especificación junto con la orden.

### Impacto en datos

El catálogo necesita reglas configurables y cada estudio solicitado puede guardar configuración específica.

## 2026-06-07 - Estudio Ortodóntico Completo 2D/3D

### Objetivo

Agregar un paquete de servicio al inicio del catálogo para facilitar la solicitud de estudios ortodónticos completos.

### Cambios realizados

- Se agregó `Estudio Ortodóntico Completo` como primera categoría del formulario.
- Se agregaron opciones `2D` y `3D`.
- La versión `2D` incluye ortopantomografía, lateral de cráneo, escaneo intraoral, modelos en resina, fotografía extraoral e intraoral y análisis cefalométrico.
- La versión `3D` incluye lo anterior más Tomografía 3D.
- Para la versión `3D`, se reutilizan las reglas FOV: `17x13`, `11x10`, `8x8`, `5x5`.

### Razón del cambio

Los estudios ortodónticos completos se solicitan como paquetes clínicos, no como estudios individuales aislados.

### Impacto en producto

El doctor puede solicitar un paquete completo en una sola selección y Radio Imagen recibe el detalle de si es 2D o 3D.

### Impacto en datos

El estudio solicitado puede representar un paquete y guardar configuración adicional en `order_studies.configuration`.

## 2026-06-07 - Abreviación de métricas compactas

### Objetivo

Evitar que el texto de `Estudio más pedido` se encime dentro de la barra de métricas del doctor.

### Cambios realizados

- Se cambió el valor visible de `Ortopantomografía` a `OPG` en la tarjeta compacta.
- Se mantuvo `Ortopantomografía` como detalle debajo del valor.
- Se agregó truncado defensivo en las tarjetas para futuros estudios con nombres largos.

### Razón del cambio

La barra de métricas debe leerse en una sola línea y los nombres clínicos largos pueden romper el layout si se muestran como valor principal.

### Impacto en producto

El doctor ve una métrica más limpia y compacta sin perder el significado del estudio.

### Impacto en datos

Conviene separar en backend el nombre completo del estudio y su abreviación visible, por ejemplo `study.name` y `study.short_label`.

## 2026-06-07 - Cefalometría e indicaciones en paquete ortodóntico

### Objetivo

Completar la captura clínica del `Estudio Ortodóntico Completo` para que el doctor seleccione el análisis cefalométrico y agregue indicaciones especiales.

### Cambios realizados

- Se agregó selector de análisis cefalométrico dentro del paquete 2D/3D.
- Se agregaron opciones NEMOCEF: Rickets, Steiner, Mc. Namara, Tweed, Jaraback y Downs.
- Se agregó campo de indicaciones especiales para el paquete.
- Se valida que el análisis cefalométrico sea obligatorio cuando el paquete está seleccionado.

### Razón del cambio

El paquete incluye cefalometría, pero Radio Imagen necesita saber cuál análisis realizar y si existen indicaciones clínicas específicas del doctor.

### Impacto en producto

El doctor puede mandar una orden ortodóntica más completa sin escribir todo en notas generales.

### Impacto en datos

`order_studies.configuration` debe guardar `dimension`, `cephalometric_analysis`, `special_instructions` y, si aplica, datos de tomografía.

## 2026-06-07 - Programa Socios Radio Imagen

### Objetivo

Crear un sistema inicial de clasificación, puntos y recompensas para doctores que refieren pacientes.

### Cambios realizados

- Se agregó tarjeta `Socios Radio Imagen Dentomaxilar` al panel del doctor.
- Se agregaron niveles: `Socio Radio Imagen Dentomaxilar`, `Socio Activo`, `Socio Plata`, `Socio Oro` y `Socio Diamante`.
- Se definió que el primer paciente referido activa automáticamente el nivel base de socio.
- Se cambió el criterio principal de nivel a pacientes referidos: 1, 5, 10, 25 y 50.
- Se agregó lógica de puntos: cada paciente referido suma 100 puntos.
- Se muestra progreso al siguiente nivel y recompensas activa/siguiente.
- Al enviar una orden nueva, el prototipo incrementa pacientes referidos y puntos.

### Razón del cambio

El portal debe incentivar el hábito de referir pacientes y dar a los doctores visibilidad de su relación con Radio Imagen.

### Impacto en producto

El doctor entiende su nivel, puntos acumulados, recompensas y avance hacia el siguiente nivel.

### Impacto en datos

Se propone guardar `partner_tiers`, `doctor_partner_status` y `partner_point_events` para soportar niveles, saldos y auditoría de puntos.

## 2026-06-09 - Beneficios por nivel de Socios

### Objetivo

Convertir el programa de socios en un sistema de beneficios concreto por nivel.

### Cambios realizados

- Se agregaron beneficios detallados para `Socio Radio Imagen Dentomaxilar`.
- Se ampliaron beneficios de `Socio Activo`.
- Se agregaron beneficios propuestos para `Socio Plata`, `Socio Oro` y `Socio Diamante`.
- La tarjeta ahora muestra beneficios del nivel actual, beneficios del siguiente nivel y un catálogo compacto de niveles.

### Razón del cambio

El programa necesita comunicar valor inmediato desde el primer paciente referido y mostrar una ruta clara de crecimiento para el doctor.

### Impacto en producto

El doctor puede entender qué recibe al entrar al programa y qué desbloquea al subir de nivel.

### Impacto en datos

`partner_tiers` debe guardar `benefits` como lista estructurada para que Radio Imagen pueda ajustar beneficios sin cambiar código.

## 2026-06-09 - Base de datos demo y lógica de puntos

### Objetivo

Crear una base de datos demostrativa para visualizar el portal con datos reales y documentar cómo se atribuyen los puntos del programa de socios.

### Cambios realizados

- Se creó `database/schema.sql` con tablas y vistas.
- Se creó `database/seed.sql` con datos demo de clínicas, doctores, pacientes, órdenes, estudios, resultados, niveles, puntos y cashback.
- Se generó `database/radio_imagen_demo.sqlite`.
- Se creó `database/demo_queries.sql` con reportes listos para ejecutar.
- Se creó `database/README.md`.
- Se creó `LOGICA_PUNTOS_SOCIOS.md`.

### Razón del cambio

El proyecto necesita una base de datos tangible para probar cómo funcionaría el flujo con datos y explicar la lógica del programa Socios Radio Imagen Dentomaxilar.

### Impacto en producto

Permite enseñar niveles, puntos, estudios más solicitados, métricas del panel y cashback sin depender todavía de un backend.

### Impacto en datos

Se formaliza la atribución de puntos por evento, la separación entre puntos y cashback, y la auditoría con `partner_point_events`.

## 2026-06-09 - Interacción de métricas por periodo

### Objetivo

Hacer funcionales los filtros `Hoy`, `Semana`, `Mes` y `Año` del panel del doctor.

### Cambios realizados

- Se agregaron datos demo por periodo para cada doctor.
- Los botones de periodo actualizan órdenes activas, pacientes, pendientes, estudio más pedido y conversión.
- El botón seleccionado queda marcado como activo.
- El texto de pacientes cambia según el periodo, por ejemplo `Pacientes hoy`, `Pacientes semana` o `Pacientes año`.
- Se removió `Ayer` porque no aporta suficiente valor para esta vista ejecutiva.

### Razón del cambio

El dashboard necesitaba mostrar cómo se comportaría con información real al cambiar periodos de análisis.

### Impacto en producto

El usuario puede interactuar con el panel y entender cómo se visualizarán KPIs temporales para doctores o clínicas.

### Impacto en datos

En backend, estas métricas deben consultarse por rango de fechas usando `orders.referral_date`, `orders.status`, `order_studies` y `results`.

## Plantilla para próximos cambios

### YYYY-MM-DD - Nombre del cambio

### Objetivo

Descripción corta del resultado esperado.

### Cambios realizados

- Cambio 1.
- Cambio 2.
- Cambio 3.

### Razón del cambio

Por qué se hizo.

### Impacto en producto

Qué cambia para doctor, Radio Imagen o administración.

### Impacto en datos

Tablas, campos, relaciones o reglas afectadas.
