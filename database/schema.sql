PRAGMA foreign_keys = ON;

DROP VIEW IF EXISTS v_top_studies_by_doctor;
DROP VIEW IF EXISTS v_doctor_dashboard_metrics;
DROP VIEW IF EXISTS v_doctor_partner_progress;
DROP VIEW IF EXISTS v_partner_points_by_doctor;

DROP TABLE IF EXISTS partner_cashback_events;
DROP TABLE IF EXISTS partner_point_events;
DROP TABLE IF EXISTS doctor_partner_status;
DROP TABLE IF EXISTS partner_tiers;
DROP TABLE IF EXISTS results;
DROP TABLE IF EXISTS order_studies;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS studies;
DROP TABLE IF EXISTS patients;
DROP TABLE IF EXISTS doctors;
DROP TABLE IF EXISTS clinics;

CREATE TABLE clinics (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE doctors (
  id TEXT PRIMARY KEY,
  clinic_id TEXT NOT NULL REFERENCES clinics(id),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  handle TEXT NOT NULL UNIQUE,
  specialty TEXT,
  phone TEXT,
  city TEXT,
  profile_photo_url TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE patients (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  birth_date TEXT,
  phone TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE studies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_label TEXT,
  category TEXT NOT NULL,
  base_price REAL DEFAULT 0,
  estimated_duration_minutes INTEGER,
  active INTEGER NOT NULL DEFAULT 1,
  config_json TEXT
);

CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  clinic_id TEXT NOT NULL REFERENCES clinics(id),
  doctor_id TEXT NOT NULL REFERENCES doctors(id),
  patient_id TEXT NOT NULL REFERENCES patients(id),
  referral_date TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('recibida', 'en_revision', 'agendada', 'en_proceso', 'lista', 'entregada', 'cancelada')),
  clinical_notes TEXT,
  internal_notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE order_studies (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id),
  study_id TEXT NOT NULL REFERENCES studies(id),
  price_at_order REAL DEFAULT 0,
  notes TEXT,
  configuration_json TEXT
);

CREATE TABLE results (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  result_type TEXT NOT NULL DEFAULT 'pdf',
  uploaded_at TEXT NOT NULL,
  downloaded_at TEXT
);

CREATE TABLE partner_tiers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  min_referrals INTEGER NOT NULL,
  min_points INTEGER NOT NULL,
  reward_description TEXT NOT NULL,
  benefits_json TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE doctor_partner_status (
  id TEXT PRIMARY KEY,
  doctor_id TEXT NOT NULL UNIQUE REFERENCES doctors(id),
  current_tier_id TEXT NOT NULL REFERENCES partner_tiers(id),
  total_points INTEGER NOT NULL DEFAULT 0,
  referred_patients_count INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL
);

CREATE TABLE partner_point_events (
  id TEXT PRIMARY KEY,
  doctor_id TEXT NOT NULL REFERENCES doctors(id),
  order_id TEXT REFERENCES orders(id),
  points INTEGER NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('referred_patient', 'profile_completion_bonus', 'training_attendance_bonus', 'manual_adjustment', 'duplicate_reversal', 'cancelled_order_reversal', 'reward_redemption')),
  description TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE partner_cashback_events (
  id TEXT PRIMARY KEY,
  doctor_id TEXT NOT NULL REFERENCES doctors(id),
  order_id TEXT NOT NULL REFERENCES orders(id),
  percentage REAL NOT NULL,
  base_amount REAL NOT NULL,
  cashback_amount REAL NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
  created_at TEXT NOT NULL
);

CREATE INDEX idx_orders_doctor_id ON orders(doctor_id);
CREATE INDEX idx_orders_patient_id ON orders(patient_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_studies_order_id ON order_studies(order_id);
CREATE INDEX idx_point_events_doctor_id ON partner_point_events(doctor_id);

CREATE VIEW v_partner_points_by_doctor AS
SELECT
  d.id AS doctor_id,
  d.full_name AS doctor_name,
  COUNT(DISTINCT CASE WHEN ppe.reason = 'referred_patient' THEN ppe.order_id END) AS referral_point_events,
  COALESCE(SUM(ppe.points), 0) AS total_points_from_events
FROM doctors d
LEFT JOIN partner_point_events ppe ON ppe.doctor_id = d.id
GROUP BY d.id, d.full_name;

CREATE VIEW v_doctor_partner_progress AS
SELECT
  d.id AS doctor_id,
  d.full_name AS doctor_name,
  dps.referred_patients_count,
  dps.total_points,
  current_tier.name AS current_tier,
  current_tier.short_name AS current_tier_short,
  next_tier.name AS next_tier,
  next_tier.min_referrals AS next_tier_min_referrals,
  CASE
    WHEN next_tier.id IS NULL THEN 0
    ELSE next_tier.min_referrals - dps.referred_patients_count
  END AS referrals_to_next_tier
FROM doctor_partner_status dps
JOIN doctors d ON d.id = dps.doctor_id
JOIN partner_tiers current_tier ON current_tier.id = dps.current_tier_id
LEFT JOIN partner_tiers next_tier
  ON next_tier.active = 1
  AND next_tier.min_referrals = (
    SELECT MIN(pt.min_referrals)
    FROM partner_tiers pt
    WHERE pt.active = 1
      AND pt.min_referrals > dps.referred_patients_count
  );

CREATE VIEW v_doctor_dashboard_metrics AS
SELECT
  d.id AS doctor_id,
  d.full_name AS doctor_name,
  COUNT(CASE WHEN o.status IN ('recibida', 'en_revision', 'agendada', 'en_proceso') THEN 1 END) AS active_orders,
  COUNT(CASE WHEN substr(o.referral_date, 1, 7) = '2026-06' THEN 1 END) AS patients_this_month,
  COUNT(CASE WHEN o.status = 'agendada' THEN 1 END) AS pending_appointments,
  ROUND(
    100.0 * COUNT(CASE WHEN o.status IN ('lista', 'entregada') THEN 1 END) / NULLIF(COUNT(o.id), 0),
    1
  ) AS conversion_percent
FROM doctors d
LEFT JOIN orders o ON o.doctor_id = d.id
GROUP BY d.id, d.full_name;

CREATE VIEW v_top_studies_by_doctor AS
SELECT
  ranked.doctor_id,
  ranked.doctor_name,
  ranked.study_name,
  ranked.short_label,
  ranked.total_requested
FROM (
  SELECT
    d.id AS doctor_id,
    d.full_name AS doctor_name,
    s.name AS study_name,
    s.short_label,
    COUNT(*) AS total_requested,
    ROW_NUMBER() OVER (PARTITION BY d.id ORDER BY COUNT(*) DESC, s.name ASC) AS row_number
  FROM doctors d
  JOIN orders o ON o.doctor_id = d.id
  JOIN order_studies os ON os.order_id = o.id
  JOIN studies s ON s.id = os.study_id
  GROUP BY d.id, d.full_name, s.id, s.name, s.short_label
) ranked
WHERE ranked.row_number = 1;
