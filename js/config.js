// Constantes de configuración del portal
export const SESSION_KEY = "radioImagenDoctorSession";
export const ADMIN_EMAIL = "admin@radioimagen.mx";

export const POINTS_PER_REFERRED_PATIENT = 100;

export const metricPeriods = {
  today: "Hoy",
  week: "Semana",
  month: "Mes",
  year: "Año",
};

export const adminOrderStatuses = ["Recibida", "Agendada", "Completa", "Lista para descargar", "Cancelada"];

export const viewTitles = {
  dashboard: "Panel doctor",
  "new-order": "Nueva orden digital",
  results: "Resultados",
  profile: "Mi perfil profesional",
  admin: "Admin Radio Imagen",
  future: "Consulta plus",
};

export const partnerTiers = [
  {
    name: "Socio Activo",
    shortName: "Activo",
    minPoints: 100,
    minReferrals: 1,
    reward: "Acceso digital y comunicación preferente",
    benefits: [
      "Acceso a plataforma iTero",
      "Xelis Dental Viewer",
      "Sidexis Dental Viewer",
      "Acceso a pláticas mensuales",
      "Branding del doctor o clínica en sus estudios",
      "Preferencia en comunicación con Radio Imagen",
      "Newsletter semanal con información actualizada del mundo del diagnóstico",
    ],
  },
  {
    name: "Socio Plata",
    shortName: "Plata",
    minPoints: 1500,
    minReferrals: 15,
    reward: "Impulso digital con IA",
    benefits: [
      "Consulta personalizada de redes sociales con implementación IA",
      "Cortesías mensuales para estudios seleccionados",
      "Kit de contenidos para explicar diagnósticos a pacientes",
      "Revisión mensual de pacientes referidos y conversión",
      "Plantillas personalizadas para solicitar estudios",
    ],
  },
  {
    name: "Socio Oro",
    shortName: "Oro",
    minPoints: 2500,
    minReferrals: 25,
    reward: "Crecimiento clínico y comercial",
    benefits: [
      "Dashboard mensual de desempeño y estudios más solicitados",
      "Sesión bimestral de estrategia para crecer referencias",
      "Capacitación grupal para el equipo de consulta",
      "Prioridad extendida para agenda y liberación de resultados",
      "Material co-brandeado para campañas de diagnóstico",
    ],
  },
  {
    name: "Socio Diamante",
    shortName: "Diamante",
    minPoints: 5000,
    minReferrals: 50,
    reward: "Alianza preferencial Radio Imagen",
    benefits: [
      "Plan trimestral de crecimiento de consulta con KPIs",
      "Capacitaciones privadas para el equipo completo",
      "Eventos o webinars co-brandeados con Radio Imagen",
      "Atención prioritaria para casos especiales y coordinación clínica",
      "Reporte ejecutivo de retorno por pacientes referidos",
    ],
  },
];
