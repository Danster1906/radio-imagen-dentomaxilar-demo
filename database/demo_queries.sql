.headers on
.mode column

SELECT 'NIVELES Y PUNTOS' AS reporte;
SELECT
  doctor_name,
  current_tier,
  referred_patients_count,
  total_points,
  next_tier,
  referrals_to_next_tier
FROM v_doctor_partner_progress;

SELECT 'METRICAS DEL PANEL' AS reporte;
SELECT
  doctor_name,
  active_orders,
  patients_this_month,
  pending_appointments,
  conversion_percent
FROM v_doctor_dashboard_metrics;

SELECT 'ESTUDIO MAS PEDIDO' AS reporte;
SELECT
  doctor_name,
  study_name,
  short_label,
  total_requested
FROM v_top_studies_by_doctor;

SELECT 'CASHBACK' AS reporte;
SELECT
  d.full_name AS doctor_name,
  o.order_number,
  pce.percentage,
  pce.base_amount,
  pce.cashback_amount,
  pce.status
FROM partner_cashback_events pce
JOIN doctors d ON d.id = pce.doctor_id
JOIN orders o ON o.id = pce.order_id
ORDER BY d.full_name, o.order_number;

SELECT 'EVENTOS DE PUNTOS' AS reporte;
SELECT
  d.full_name AS doctor_name,
  o.order_number,
  ppe.points,
  ppe.reason,
  ppe.description,
  ppe.created_at
FROM partner_point_events ppe
JOIN doctors d ON d.id = ppe.doctor_id
LEFT JOIN orders o ON o.id = ppe.order_id
ORDER BY ppe.created_at DESC
LIMIT 12;
