# Estructura de datos escalable

Propuesta para convertir la plataforma en un sistema donde doctores generan órdenes digitales y Radio Imagen/Radiodiagnóstico les da seguimiento operativo.

## Entidades principales

### users
Usuarios que pueden iniciar sesión.

| Campo | Tipo | Nota |
| --- | --- | --- |
| id | uuid | Primary key |
| email | text | Único |
| auth_provider | text | email, google |
| role | text | doctor, clinic_admin, radio_admin |
| created_at | timestamp | Fecha de alta |
| last_login_at | timestamp | Último acceso |

### clinics
Clínicas o consultorios.

| Campo | Tipo | Nota |
| --- | --- | --- |
| id | uuid | Primary key |
| name | text | Nombre comercial |
| phone | text | Opcional |
| email | text | Opcional |
| city | text | Ciudad |
| address | text | Dirección |
| created_at | timestamp | Fecha de alta |

### doctors
Perfil profesional del doctor.

| Campo | Tipo | Nota |
| --- | --- | --- |
| id | uuid | Primary key |
| user_id | uuid | FK users.id |
| clinic_id | uuid | FK clinics.id |
| professional_name | text | Ej. Dra. Sofia Herrera |
| specialty | text | Ortodoncia, endodoncia, etc. |
| phone | text | Contacto |
| photo_url | text | Imagen de perfil |
| photo_crop | jsonb | zoom, x, y |
| notes_for_radio | text | Preferencias operativas |
| created_at | timestamp | Fecha de alta |
| updated_at | timestamp | Última edición |

### radio_staff
Usuarios internos de Radio Imagen/Radiodiagnóstico.

| Campo | Tipo | Nota |
| --- | --- | --- |
| id | uuid | Primary key |
| user_id | uuid | FK users.id |
| full_name | text | Nombre del colaborador |
| department | text | recepción, radiología, administración |
| active | boolean | Usuario activo |

### patients
Pacientes del doctor o clínica. Para demos se puede anonimizar.

| Campo | Tipo | Nota |
| --- | --- | --- |
| id | uuid | Primary key |
| clinic_id | uuid | FK clinics.id |
| doctor_id | uuid | FK doctors.id |
| full_name | text | Puede ser anónimo en pruebas |
| birth_date | date | Fecha de nacimiento |
| phone | text | Opcional |
| created_at | timestamp | Fecha de registro |

### studies
Catálogo de estudios.

| Campo | Tipo | Nota |
| --- | --- | --- |
| id | uuid | Primary key |
| name | text | Ortopantomografía, Carpal, NEMOCEF RICKETS, etc. |
| category | text | Radiografías, fotografía/modelos, análisis cefalométrico |
| base_price | numeric | Para KPIs financieros |
| estimated_duration_minutes | integer | Operación |
| active | boolean | Catálogo vigente |
| config | jsonb | Reglas especiales como FOV y campos requeridos |

Ejemplo de `config` para Tomografía 3D:

```json
{
  "type": "tomography_3d",
  "fov_options": ["17x13", "11x10", "8x8", "5x5"],
  "rules": {
    "17x13": { "requires": [] },
    "11x10": { "requires": [] },
    "8x8": { "requires": ["arch"], "options": ["Maxilar", "Mandibular"] },
    "5x5": { "requires": ["tooth"] }
  }
}
```

Ejemplo de `configuration` para Estudio Ortodóntico Completo:

```json
{
  "type": "orthodontic_package",
  "dimension": "3D",
  "cephalometric_analysis": "NEMOCEF RICKETS",
  "special_instructions": "Evaluar vía aérea y asimetría mandibular.",
  "tomography": {
    "fov": "8x8",
    "arch": "Maxilar"
  }
}
```

### orders
Orden digital referida a Radio Imagen.

| Campo | Tipo | Nota |
| --- | --- | --- |
| id | uuid | Primary key |
| order_number | text | Folio visible |
| clinic_id | uuid | FK clinics.id |
| doctor_id | uuid | FK doctors.id |
| patient_id | uuid | FK patients.id |
| referral_date | date | Autollenada con fecha del día |
| status | text | recibida, agendada, proceso, no_asistio, atendida, lista, enviada, cancelada |
| clinical_notes | text | Indicaciones del doctor |
| internal_notes | text | Notas visibles solo para Radio Imagen |
| counts_for_partner | boolean | `true` sólo cuando Radio Imagen valida que el paciente fue atendido |
| patient_attended_at | timestamp | Fecha/hora en que admin validó la asistencia |
| validated_by | uuid | Admin que validó la asistencia |
| partner_points_awarded_at | timestamp | Fecha/hora en que se otorgaron puntos de socio |
| created_at | timestamp | Fecha real de creación |
| updated_at | timestamp | Última modificación |

### order_status_events
Historial de seguimiento de cada orden.

| Campo | Tipo | Nota |
| --- | --- | --- |
| id | uuid | Primary key |
| order_id | uuid | FK orders.id |
| previous_status | text | Estado anterior |
| new_status | text | Estado nuevo |
| changed_by_user_id | uuid | FK users.id |
| note | text | Comentario opcional |
| created_at | timestamp | Fecha del cambio |

Regla operativa:

- Una orden creada por el doctor es una referencia, pero no suma puntos todavía.
- Sólo suma puntos cuando admin valida que el paciente llegó y se hizo el estudio.
- La validación cambia `counts_for_partner` a `true`.
- Una misma orden no debe generar puntos dos veces.

### order_assignments
Asignación interna de seguimiento.

| Campo | Tipo | Nota |
| --- | --- | --- |
| id | uuid | Primary key |
| order_id | uuid | FK orders.id |
| staff_id | uuid | FK radio_staff.id |
| assigned_at | timestamp | Fecha de asignación |
| completed_at | timestamp | Fecha de cierre |

### order_studies
Relación muchos-a-muchos entre órdenes y estudios.

| Campo | Tipo | Nota |
| --- | --- | --- |
| id | uuid | Primary key |
| order_id | uuid | FK orders.id |
| study_id | uuid | FK studies.id |
| price_at_order | numeric | Precio histórico |
| notes | text | Detalle por estudio |
| configuration | jsonb | FOV, zona, pieza, análisis cefalométrico, indicaciones especiales u otras especificaciones |

### results
Archivos o enlaces de resultado.

| Campo | Tipo | Nota |
| --- | --- | --- |
| id | uuid | Primary key |
| order_id | uuid | FK orders.id |
| file_name | text | Nombre visible |
| file_url | text | Storage o link externo |
| result_type | text | pdf, image, dicom_link, other |
| uploaded_at | timestamp | Cuando Radio Imagen lo sube |
| downloaded_at | timestamp | Cuando el doctor lo descarga |

### partner_tiers
Catálogo de niveles del programa Socios Radio Imagen.

| Campo | Tipo | Nota |
| --- | --- | --- |
| id | uuid | Primary key |
| name | text | Socio Activo, Socio Plata, Socio Oro, Socio Diamante |
| min_points | integer | Puntos mínimos para entrar al nivel |
| min_referrals | integer | Pacientes referidos mínimos para entrar al nivel |
| reward_description | text | Beneficio visible para el doctor |
| benefits | jsonb | Lista de beneficios del nivel |
| active | boolean | Permite activar/desactivar niveles |

### doctor_partner_status
Estado acumulado del doctor dentro del programa.

| Campo | Tipo | Nota |
| --- | --- | --- |
| id | uuid | Primary key |
| doctor_id | uuid | FK doctors.id |
| current_tier_id | uuid | FK partner_tiers.id |
| total_points | integer | Puntos acumulados vigentes |
| referred_patients_count | integer | Pacientes atendidos/validados acumulados |
| updated_at | timestamp | Última actualización |

### partner_point_events
Historial auditable de puntos.

| Campo | Tipo | Nota |
| --- | --- | --- |
| id | uuid | Primary key |
| doctor_id | uuid | FK doctors.id |
| order_id | uuid | FK orders.id, opcional |
| points | integer | Puntos sumados o restados |
| reason | text | referred_patient, adjustment, reward_redemption |
| created_at | timestamp | Fecha del evento |

### appointments
Agenda futura para consulta plus.

| Campo | Tipo | Nota |
| --- | --- | --- |
| id | uuid | Primary key |
| clinic_id | uuid | FK clinics.id |
| doctor_id | uuid | FK doctors.id |
| patient_id | uuid | FK patients.id |
| starts_at | timestamp | Inicio |
| ends_at | timestamp | Fin |
| status | text | scheduled, completed, cancelled, no_show |
| reason | text | Motivo |

### financial_entries
Finanzas futuras del doctor.

| Campo | Tipo | Nota |
| --- | --- | --- |
| id | uuid | Primary key |
| clinic_id | uuid | FK clinics.id |
| doctor_id | uuid | FK doctors.id |
| entry_date | date | Fecha |
| type | text | income, expense |
| category | text | Consulta, material, renta, etc. |
| amount | numeric | Monto |
| source_id | uuid | Orden/cita relacionada, opcional |

## Relaciones clave

- Un `user` puede tener un perfil en `doctors`.
- Una `clinic` puede tener muchos `doctors`.
- Un `doctor` puede crear muchos `patients`.
- Una `order` pertenece a un `doctor`, `clinic` y `patient`.
- Una `order` puede tener muchos estudios mediante `order_studies`.
- Una `order` puede tener uno o muchos `results`.
- Una `order` debe tener muchos eventos en `order_status_events`.
- Un usuario interno de `radio_staff` puede tener órdenes asignadas mediante `order_assignments`.
- Los módulos de `appointments` y `financial_entries` crecen sin cambiar el flujo de órdenes.

## KPIs calculables

- Órdenes por periodo.
- Pacientes referidos por doctor.
- Conversión: órdenes recibidas vs. estudios realizados.
- Tiempo promedio de entrega: `results.uploaded_at - orders.created_at`.
- Estudios más solicitados.
- Ingreso estimado por estudio y doctor.
- Cancelaciones/no-shows cuando exista agenda.
- Descargas pendientes de resultados.
- Órdenes por estado para seguimiento interno.
- Tiempo promedio entre `recibida` y `lista`.

## Recomendación para Replit

Para una primera versión real:

- Base de datos: PostgreSQL.
- Auth: Google OAuth + correo mágico o passwordless.
- Storage: bucket para PDF/resultados/fotos de perfil.
- API: endpoints separados para `auth`, `orders`, `results`, `profile`, `metrics`.
- Seguridad: cada doctor solo ve órdenes donde `orders.doctor_id = current_doctor.id`.
- Seguridad interna: Radio Imagen ve todas las órdenes, pero los cambios de estado deben quedar auditados en `order_status_events`.
