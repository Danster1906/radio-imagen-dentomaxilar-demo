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

## 2026-06-13 - Agente local y guía de deployment en Replit

### Objetivo

Preparar la arquitectura para desplegar el portal en Replit y correr un agente local en la computadora de Radio Imagen.

### Cambios realizados

- Se creó `local-agent/` como proyecto Node.js independiente.
- Se agregó `local-agent/local-agent.js` para procesar solicitudes de descarga.
- Se agregó `.env.example` con variables requeridas.
- Se agregó `local-agent/README.md`.
- Se creó `REPLIT_DEPLOYMENT.md`.

### Razón del cambio

Replit no puede leer directamente el disco local de Radio Imagen. El portal debe crear solicitudes y el agente local debe procesarlas desde la computadora que sí tiene acceso a los archivos.

### Impacto en producto

Permite un flujo híbrido: Replit publica la app, Supabase coordina la descarga temporal y la computadora local conserva los archivos maestros.

### Impacto en datos

El flujo requiere `result_files`, `download_requests`, `cloud_path`, `signed_url_expires_at` y estados de descarga.

## 2026-06-13 - Primera interfaz Admin Radio Imagen

### Objetivo

Crear una vista interna para que Radio Imagen pueda visualizar cómo funcionaría la operación administrativa.

### Cambios realizados

- Se agregó navegación `Admin Radio Imagen`.
- Se creó una vista con KPIs operativos.
- Se agregó bandeja de órdenes con filtro por estado.
- Se agregó lista de doctores con nivel de socio, pacientes y puntos.
- Se agregó cola de descargas para representar el flujo servidor local + Supabase.
- Se agregó formulario visual de alta rápida de doctor con pacientes históricos.

### Razón del cambio

El producto necesita separar la experiencia del doctor de la operación interna de Radio Imagen.

### Impacto en producto

Permite mostrar cómo Radio Imagen daría seguimiento a órdenes, doctores, socios y solicitudes de descarga.

### Impacto en datos

La vista depende de `doctors`, `orders`, `partner_tiers`, `doctor_partner_status`, `result_files` y `download_requests`.

## 2026-06-13 - Guia de trabajo con Claude Code

### Objetivo

Documentar como usar Claude Code junto con Codex sin mezclar cambios ni perder trazabilidad.

### Cambios realizados

- Se agregó `CLAUDE_CODE_WORKFLOW.md`.
- Se definió GitHub como punto de integración entre agentes.
- Se propuso trabajar por ramas separadas para Codex y Claude Code.
- Se agregó un prompt base para que Claude Code lea la documentación del producto antes de modificar código.

### Razón del cambio

El proyecto empezará una etapa de deployment y colaboración con más de una herramienta de desarrollo.

### Impacto en producto

Reduce riesgo de cambios cruzados y mantiene la documentación como fuente de verdad para Replit, Codex y Claude Code.

## 2026-06-13 - Cuenta admin separada y agente de resultados

### Objetivo

Separar la cuenta de administrador de la cuenta del doctor y simular el flujo operativo de Radio Imagen para estatus, asignación de radiografías y subida temporal.

### Cambios realizados

- Se agregó acceso demo `admin@radioimagen.mx`.
- La cuenta doctor ya no muestra la vista admin en navegación.
- La cuenta admin aterriza directamente en `Admin Radio Imagen`.
- Se agregaron controles para cambiar estatus de cada orden desde admin.
- Se agregó un agente local demo que cruza nombres de pacientes contra archivos locales.
- El agente asigna el archivo correcto a la orden, cambia el estatus a `Lista` y crea/actualiza una solicitud de subida inmediata.
- Se agregó bitácora visual del agente con porcentaje de coincidencia y acción realizada.

### Razón del cambio

El flujo real requiere que Radio Imagen opere resultados y descargas sin exponer controles internos al doctor.

### Lógica de datos

- `orders` representa la orden clínica del paciente.
- `localResultFiles` representa los archivos disponibles en el CPU/servidor local.
- `adminDownloadRequests` representa la cola que activa subida temporal a Supabase.
- `runAgent()` normaliza nombres, busca coincidencias y prepara la subida bajo demanda.

### Riesgos pendientes

- En producción el cruce debe validar folio, fecha de nacimiento y doctor, no solamente nombre.
- La subida inmediata debe ejecutarse en backend/local-agent, no desde el navegador.
- Se requiere auditoría para saber qué admin cambió estatus o liberó un resultado.

## 2026-06-13 - Botón Mandar estudios en admin

### Objetivo

Agregar una acción principal para que Radio Imagen pueda enviar estudios desde la consola admin.

### Cambios realizados

- Se agregó el botón `Mandar estudios` en el encabezado de `Admin Radio Imagen`.
- El botón usa la cola de descargas y simula el envío de estudios al portal del doctor.
- Si todavía no hay estudios listos para enviar, primero ejecuta el agente local demo.
- Se cambió `Alta doctor` a acción secundaria para priorizar el flujo operativo de resultados.

### Razón del cambio

La operación diaria necesita una acción explícita para liberar resultados ya asignados.

## 2026-06-13 - Descarga completa o por componentes

### Objetivo

Permitir que el doctor descargue todo el estudio completo o solamente archivos específicos.

### Cambios realizados

- Se agregó un centro de descarga en modal desde la vista `Resultados`.
- El botón `Descargar` abre opciones cuando el resultado está listo.
- Se agregó descarga recomendada de `Estudio completo`.
- Se agregaron componentes individuales como panorámica, lateral, cefalometría, fotografías, reportes o archivos del estudio.
- Se agregó estructura `resultPackages` para representar el paquete completo y sus archivos internos.

### Razón UX

La tabla de resultados debe mantenerse simple. La decisión de descargar todo o partes del estudio aparece sólo cuando el doctor ya decidió descargar.

### Lógica futura

En producción cada orden debe tener una tabla `result_files` con:

- `order_id`
- `file_type`
- `display_name`
- `storage_path`
- `is_part_of_full_package`
- `expires_at`
- `download_count`

## 2026-06-13 - Visibilidad del botón Crear orden

### Objetivo

Evitar que el atajo `Crear orden` aparezca dentro de la pestaña donde ya se está creando una orden.

### Cambios realizados

- El botón superior `Crear orden` permanece visible en `Panel doctor`, `Resultados`, `Mi perfil` y `Consulta plus`.
- El botón se oculta automáticamente en la pestaña `Nueva orden`.
- La lógica sigue respetando que el botón sólo exista para cuentas de doctor, no para admin.

### Razón UX

Reduce redundancia y evita que el usuario vea dos acciones con el mismo propósito dentro del formulario de nueva orden.

## 2026-06-13 - Ajuste de tiers Socios Radio Imagen

### Objetivo

Actualizar el programa de socios para que el primer paciente active el nivel `Socio Activo` y hacer más valiosos los niveles superiores.

### Cambios realizados

- `Socio Activo` ahora inicia desde 1 paciente referido.
- Se eliminaron los beneficios anteriores del nivel intermedio de 5 pacientes.
- `Socio Activo` incluye iTero, Xelis, Sidexis, pláticas mensuales, branding, comunicación preferente y newsletter semanal.
- `Socio Plata` sube a 15 pacientes referidos.
- `Socio Plata` incluye consulta personalizada de redes sociales con implementación IA y cortesías mensuales.
- Se propusieron beneficios nuevos para `Socio Oro` y `Socio Diamante`.
- Se actualizó `LOGICA_PUNTOS_SOCIOS.md` para alinear documentación y prototipo.

### Beneficios sugeridos para niveles superiores

`Socio Oro` debe enfocarse en crecimiento y equipo:

- Dashboard mensual de desempeño.
- Sesión bimestral de estrategia.
- Capacitación grupal para el equipo de consulta.
- Prioridad extendida para agenda y liberación de resultados.
- Material co-brandeado para campañas de diagnóstico.

`Socio Diamante` debe sentirse como alianza estratégica:

- Plan trimestral de crecimiento con KPIs.
- Capacitaciones privadas.
- Eventos o webinars co-brandeados.
- Atención prioritaria para casos especiales.
- Reporte ejecutivo de retorno por pacientes referidos.

### Razón de producto

El primer paciente debe tener una recompensa clara para activar hábito. Los niveles superiores deben justificar mayor lealtad con herramientas de crecimiento, no sólo descuentos.

## 2026-06-13 - Configuración inicial de Supabase

### Objetivo

Crear el proyecto Supabase real para iniciar operación con base de datos, roles, órdenes, estudios, resultados y storage temporal.

### Cambios realizados

- Se creó el proyecto `radio-imagen-dentomaxilar` en Supabase.
- Se aplicó la migración inicial de esquema.
- Se crearon tablas para perfiles, doctores, órdenes, estudios, resultados, descargas, agente local y programa de socios.
- Se cargaron 23 estudios base.
- Se cargaron 4 tiers de Socios Radio Imagen.
- Se creó el bucket privado `result-temp`.
- Se documentó el estado en `SUPABASE_PROJECT_STATUS.md`.

### Pendiente

- Crear usuarios reales en Supabase Auth.
- Conectar el frontend al login real.
- Cambiar órdenes mock por inserciones reales.
- Conectar admin y agente local a las tablas reales.

## 2026-06-15 - Validación de paciente atendido

### Objetivo

Separar una orden referida de un paciente realmente atendido para que el programa de socios sólo sume puntos cuando Radio Imagen confirme la asistencia.

### Cambios realizados

- Las órdenes nuevas ya no suman puntos automáticamente.
- Se agregó estado `Atendida` y `No asistió`.
- Se agregó botón admin `Validar atendido`.
- Una orden validada queda marcada como `countsForPartner`.
- El botón queda bloqueado después de validar para evitar doble conteo.
- Al validar se suman 100 puntos y un paciente validado al doctor correspondiente.
- La UI de socios ahora habla de `pacientes validados`.
- Supabase recibió campos de validación en `orders`.
- Supabase recibió la tabla `order_status_events`.

### Regla operativa

```text
Doctor crea orden -> no suma puntos
Paciente llega y se hace estudio -> admin valida atendido
Admin valida atendido -> suma 100 puntos una sola vez
No asistió / cancelada -> no suma puntos
```

### Pendiente

- Conectar esta validación al frontend real de Supabase.
- Registrar `partner_point_events` desde una acción transaccional segura.
- Mover helpers RLS a un esquema privado antes de producción.

## 2026-06-15 - Alta de doctor desde admin

### Objetivo

Hacer funcional la opción de alta de doctores dentro del panel admin.

### Cambios realizados

- El botón `Alta doctor` lleva al formulario de registro rápido.
- El formulario ahora captura nombre, correo, especialidad, clínica, teléfono, ciudad y pacientes validados históricos.
- Al crear doctor, se genera un código `DR-000X`.
- Se calcula el puntaje inicial con pacientes validados x 100 puntos.
- Se calcula automáticamente el tier según pacientes validados.
- El nuevo doctor aparece inmediatamente en la lista de `Alta y socios`.
- El correo creado puede usarse en demo para simular login de ese doctor.

### Lógica de producción

En Supabase, el alta real debe crear:

- Usuario en Supabase Auth.
- Registro en `profiles`.
- Registro en `doctor_profiles`.
- Registro en `doctor_partner_status`.
- Eventos históricos en `partner_point_events` si se cargan pacientes validados previos.

## 2026-06-15 - Supabase multitenant y flujo simple de estatus

### Objetivo

Preparar el producto final para que cada doctor vea sólo su información y Radio Imagen pueda actualizar el seguimiento operativo de las órdenes.

### Cambios realizados

- Se simplificó el flujo visible de estatus a `Recibida`, `Agendada`, `Completa`, `Lista para descargar` y `Cancelada`.
- En el demo, `Completa` reemplaza a `Atendida` como validación de paciente atendido.
- En el demo, `Lista para descargar` reemplaza a `Lista` como estado final visible para resultados.
- El admin puede cambiar a `Agendada` y el doctor verá el mismo estado.
- El admin valida asistencia al cambiar a `Completa`; ahí se suman puntos.
- Supabase recibió campos `scheduled_at`, `scheduled_by` y `completed_at` en `orders`.
- Supabase recibió el nuevo constraint de estatus en `orders`.
- Supabase Realtime quedó habilitado para `orders`, `order_status_events`, `result_files` y `download_requests`.
- Se creó `SUPABASE_MULTITENANT_IMPLEMENTATION.md` con instrucciones para una IA o desarrollador.

### Razón del cambio

Reducir complejidad operativa. Radio Imagen sólo necesita saber si la orden fue recibida, agendada, completada y liberada para descarga.

### Impacto en producto

El doctor no tendrá que interpretar estatus internos. Verá el avance real de su paciente: recibido, agendado, completo y listo para descargar.

### Impacto en datos

- `orders.status` acepta: `Recibida`, `Agendada`, `Completa`, `Lista para descargar`, `Cancelada`.
- `orders.scheduled_at` registra la cita acordada por WhatsApp.
- `orders.completed_at` registra cuando el paciente acudió y se realizó el estudio.
- `order_status_events` debe guardar auditoría de cada cambio.

## 2026-06-15 - Login privado y corrección visual del panel doctor

### Objetivo

Quitar la sensación de demo pública y hacer que el acceso sea privado para dentistas autorizados por Radio Imagen.

### Cambios realizados

- El login ahora pide correo autorizado y contraseña.
- Se quitaron las opciones de Google y entrada demo de admin.
- Se agregaron credenciales de demo controladas en `authorizedAccounts`.
- Al dar de alta un doctor desde admin, se le asigna una contraseña inicial de demo.
- Se redujo el tamaño del encabezado de login para evitar una pantalla gigante en móvil.
- El panel doctor ahora evita que las filas de pacientes se desborden encima de la tarjeta de socios.
- El dashboard cambia a una sola columna en anchos medianos para evitar encimados.
- Se simplificó el login a una sola tarjeta centrada, sin showcase lateral ni métricas decorativas.

### Razón del cambio

El producto debe sentirse privado y exclusivo para doctores dados de alta, no como un portal abierto o social login.

### Impacto en producto

El doctor sólo entra con credenciales asignadas por Radio Imagen. La vista de pacientes y socios deja de encimarse en pantallas medianas.

### Impacto en datos

En producción, estas credenciales deben vivir en Supabase Auth. El demo mantiene contraseñas locales sólo para simular el flujo.

## 2026-06-15 - Logos nuevos y admin simplificado

### Objetivo

Mejorar la presencia de marca y reducir la confusión en la vista de administrador.

### Cambios realizados

- Se agregaron los logos nuevos en `img/brand/`.
- El login usa el logo rojo/dorado.
- El sidebar y pantalla de carga usan el logo blanco para fondos oscuros.
- Se retiró la caja blanca detrás del logo del sidebar.
- La vista admin ahora muestra primero el flujo operativo por estado: recibidas, agendadas, completas, listas y descargas.
- La bandeja principal de órdenes muestra paciente, doctor, estatus, siguiente paso y una acción recomendada.
- Se eliminó de cada fila la combinación confusa de varios botones simultáneos.
- El layout admin ahora prioriza una columna principal en lugar de competir con varios módulos laterales.

### Razón del cambio

Admin necesita entender rápidamente qué está pasando con cada orden y cuál es la siguiente acción operativa.

### Impacto en producto

Radio Imagen puede usar el panel como bandeja de trabajo: contactar, agendar, completar, asignar resultado y liberar descarga.

### Impacto en datos

No cambia la estructura de datos. Sólo cambia presentación y flujo de acciones en el prototipo.

## 2026-06-15 - Guía de estatus y contraseña en alta de doctores

### Objetivo

Hacer más claro el manejo operativo de órdenes y permitir que Radio Imagen asigne credenciales desde el alta del doctor.

### Cambios realizados

- Se agregó una guía visual de estatus dentro de la bandeja admin.
- Se agregó el campo `Contraseña inicial` al formulario de nuevo doctor.
- El alta de doctor ahora guarda la contraseña capturada en el demo.
- La lista de doctores en admin muestra correo y contraseña de acceso para control interno.

### Lógica operativa de estatus

- `Recibida`: el doctor ya envió la orden; Radio Imagen debe contactar al paciente.
- `Agendada`: el paciente ya tiene cita confirmada.
- `Completa`: el paciente asistió y el estudio ya se realizó; aquí cuenta como paciente validado para puntos/tier.
- `Lista para descargar`: el resultado ya fue asignado y está visible para el doctor.
- `Cancelada`: la orden queda cerrada y no avanza.

### Impacto en producto

El admin puede entender rápidamente qué acción corresponde a cada orden y puede crear doctores con contraseña propia sin depender de una clave fija.

### Impacto en datos

En el prototipo, la contraseña vive en el objeto local `authorizedAccounts`. En producción debe pasar a Supabase Auth y no mostrarse como texto plano.

## 2026-06-15 - Separación del admin por módulos

### Objetivo

Ordenar la vista de administrador para que Dashboard, seguimiento de órdenes, resultados y doctores no compitan en la misma pantalla.

### Cambios realizados

- Se agregó navegación interna en Admin: `Dashboard`, `Órdenes`, `Resultados` y `Doctores`.
- El Dashboard conserva las métricas generales y una lectura rápida de prioridades.
- La bandeja de seguimiento ahora vive sólo en el módulo `Órdenes`.
- La asignación local, agente y cola de descargas viven en `Resultados`.
- La lista de doctores y el alta de doctor viven en `Doctores`.
- El botón `Alta doctor` abre directamente el módulo de doctores.
- El botón `Mandar estudios` abre el módulo de resultados antes de ejecutar el envío.

### Razón del cambio

La operación admin necesita una separación mental clara: revisar estado general, dar seguimiento a órdenes, manejar archivos/resultados y administrar doctores son tareas distintas.

### Impacto en producto

El panel admin se vuelve más fácil de operar diariamente y reduce la sensación de desorden en la pantalla.

### Impacto en datos

No cambia la estructura de datos. Sólo cambia navegación, agrupación visual y comportamiento de botones internos.

## 2026-06-15 - Subida manual de resultados

### Objetivo

Permitir que Radio Imagen libere resultados al doctor sin depender del agente local ni de una solicitud manual de descarga por parte del doctor.

### Cambios realizados

- Se agregó una tarjeta `Asignar resultado manual` dentro del módulo `Resultados`.
- El admin puede elegir una orden completa/lista, seleccionar tipo de archivo y cargar el archivo final.
- La orden cambia a `Lista para descargar`.
- El archivo queda registrado como paquete descargable para la vista del doctor.
- La cola de descargas muestra el archivo como `Subido manual`.

### Lógica operativa

El flujo recomendado queda:

1. Doctor genera orden.
2. Radio Imagen contacta y agenda.
3. Paciente asiste y admin marca `Completa`.
4. Admin sube el archivo final manualmente o usa agente.
5. Orden queda `Lista para descargar`.
6. Doctor entra y descarga sin pedirlo.

### Recomendación técnica para producción

Usar Supabase Storage con bucket privado, RLS por doctor/orden y links firmados temporales. Para archivos pequeños se puede usar subida estándar; para archivos pesados como ZIP/DICOM conviene subida resumible. El servidor local puede quedar como respaldo operativo, no como dependencia central del flujo.

### Impacto en datos

En el prototipo, el archivo se simula usando el nombre del archivo seleccionado en navegador. En producción, ese valor debe ser la ruta real del objeto en Supabase Storage.

## 2026-06-15 - Nomenclatura clara para subida de resultados

### Objetivo

Evitar confusión entre el estudio solicitado, el tipo de entrega y el formato técnico del archivo.

### Cambios realizados

- El campo `Orden` cambió a `Paciente / orden`.
- El selector de orden ahora muestra paciente, estudios solicitados y estatus.
- El campo `Tipo de archivo` cambió a `Entrega que subes`.
- Las opciones ahora usan lenguaje operativo: estudio completo, reporte, radiografía, tomografía 3D - DICOM, fotografías y modelo 3D.
- Se evitó agregar una guía visual extra para no saturar la operación diaria.

### Decisión de producto

No es necesario poner DICOM ni PDF en la selección de orden. La orden debe identificar al paciente y los estudios que pidió el doctor. La entrega identifica qué archivo está liberando Radio Imagen.

### Impacto en datos

No cambia la estructura. Sólo se aclara la etiqueta de la entrega y el texto visible en el selector.

## 2026-06-15 - Paquete de deployment operativo

### Objetivo

Preparar el proyecto para publicar una version actualizada y definir el camino minimo para que doctores puedan usar la herramienta en operacion real.

### Cambios realizados

- Se genero el paquete `deploy/radio-imagen-operativo-v1.zip` con la version actual del frontend.
- Se agrego `DEPLOY_OPERATIVO_DOCTORES.md` con pasos para Neubox, Replit, Supabase Auth, perfiles, Storage y piloto real.
- Se actualizo `DEPLOY_NEUBOX.md` para apuntar al paquete nuevo.
- Se actualizo `README.md` para incluir la guia operativa de deployment.

### Decision de producto

El frontend se puede publicar ya para piloto visual, pero no se debe abrir a doctores reales como operacion definitiva hasta conectar Supabase Auth, Postgres y Storage.

### Impacto en datos

No cambia la base de datos. El proyecto Supabase ya existe, pero las tablas operativas estan vacias y necesitan usuarios/perfiles reales antes del piloto.

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
