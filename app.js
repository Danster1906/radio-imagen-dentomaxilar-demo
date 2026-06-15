const studies = [
  {
    id: "estudio-ortodontico-completo",
    name: "Estudio Ortodóntico Completo",
    category: "Estudio Ortodóntico Completo",
    description:
      "Incluye ortopantomografía, lateral de cráneo, escaneo intraoral, modelos en resina, fotografía extraoral e intraoral y análisis cefalométrico",
    type: "orthodontic-package",
    fovOptions: ["17x13", "11x10", "8x8", "5x5"],
  },
  {
    id: "ortopantomografia",
    name: "Ortopantomografía",
    category: "Radiografías y proyecciones",
    description: "Radiografía panorámica dental",
  },
  {
    id: "lateral-craneo",
    name: "Lateral de Craneo",
    category: "Radiografías y proyecciones",
    description: "Proyección lateral para análisis cefalométrico",
  },
  {
    id: "pa-craneo",
    name: "PA De craneo",
    category: "Radiografías y proyecciones",
    description: "Proyección posteroanterior de cráneo",
  },
  {
    id: "ap-craneo",
    name: "A-P de craneo",
    category: "Radiografías y proyecciones",
    description: "Proyección anteroposterior de cráneo",
  },
  {
    id: "waters",
    name: "WATERS",
    category: "Radiografías y proyecciones",
    description: "Proyección de senos paranasales",
  },
  {
    id: "atm-comparativa",
    name: "ATM COMPARATIVA",
    category: "Radiografías y proyecciones",
    description: "Evaluación comparativa de articulación temporomandibular",
  },
  {
    id: "carpal",
    name: "Carpal",
    category: "Radiografías y proyecciones",
    description: "Radiografía carpal para valoración de crecimiento",
  },
  {
    id: "senos-paranasales",
    name: "Senos paranasales",
    category: "Radiografías y proyecciones",
    description: "Estudio radiográfico de senos paranasales",
  },
  {
    id: "tomografia-3d",
    name: "Tomografía 3D",
    category: "Tomografía 3D",
    description: "Selecciona tamaño FOV y especificaciones cuando aplique",
    type: "tomography",
    fovOptions: ["17x13", "11x10", "8x8", "5x5"],
  },
  {
    id: "fotografia-extraoral-intraoral-digital",
    name: "FOTOGRAFÍA EXTRAORAL E INTRAORAL DIGITAL",
    category: "Fotografía, escaneo intraoral y modelos de estudio",
    description: "Registro fotográfico clínico en formato digital",
  },
  {
    id: "fotografia-extraoral-intraoral-impresa",
    name: "FOTOGRAFÍA EXTRAORAL E INTRAORAL IMPRESA",
    category: "Fotografía, escaneo intraoral y modelos de estudio",
    description: "Registro fotográfico clínico en formato impreso",
  },
  {
    id: "modelos-estudio-yeso",
    name: "MODELOS DE ESTUDIO EN YESO",
    category: "Fotografía, escaneo intraoral y modelos de estudio",
    description: "Modelos físicos para análisis y archivo clínico",
  },
  {
    id: "modelos-estudio-resina",
    name: "MODELOS DE ESTUDIO EN RESINA",
    category: "Fotografía, escaneo intraoral y modelos de estudio",
    description: "Modelos en resina para planeación y presentación",
  },
  {
    id: "escaneo-intraoral-itero",
    name: "ESCANEO INTRAORAL ITERO",
    category: "Fotografía, escaneo intraoral y modelos de estudio",
    description: "Escaneo intraoral digital con iTero",
  },
  {
    id: "analisis-modelos-bolton",
    name: "ANALISIS DE MODELOS BOLTON",
    category: "Análisis de modelos",
    description: "Análisis de discrepancia dentaria Bolton",
  },
  {
    id: "analisis-modelos-moyers",
    name: "ANALISIS DE MODELOS MOYERS",
    category: "Análisis de modelos",
    description: "Análisis predictivo de espacio Moyers",
  },
  {
    id: "nemocef-rickets",
    name: "NEMOCEF RICKETS",
    category: "Análisis cefalométrico NEMOCEF",
    description: "Análisis cefalométrico Rickets",
  },
  {
    id: "nemocef-steiner",
    name: "NEMOCEF STEINER",
    category: "Análisis cefalométrico NEMOCEF",
    description: "Análisis cefalométrico Steiner",
  },
  {
    id: "nemocef-mc-namara",
    name: "NEMOCEF MC. NAMARA",
    category: "Análisis cefalométrico NEMOCEF",
    description: "Análisis cefalométrico Mc. Namara",
  },
  {
    id: "nemocef-tweed",
    name: "NEMOCEF TWEED",
    category: "Análisis cefalométrico NEMOCEF",
    description: "Análisis cefalométrico Tweed",
  },
  {
    id: "nemocef-jaraback",
    name: "NEMOCEF JARABACK",
    category: "Análisis cefalométrico NEMOCEF",
    description: "Análisis cefalométrico Jaraback",
  },
  {
    id: "nemocef-downs",
    name: "NEMOCEF DOWNS",
    category: "Análisis cefalométrico NEMOCEF",
    description: "Análisis cefalométrico Downs",
  },
];

const cephalometricStudies = studies.filter((study) => study.category === "Análisis cefalométrico NEMOCEF");

const orders = [
  {
    id: "ORD-2026-0001",
    patient: "Mariana Lopez Garcia",
    doctor: "Dra. Sofia Herrera",
    owner: "current-doctor",
    doctorId: "DR-0001",
    studies: ["Ortopantomografía", "Lateral de Craneo"],
    status: "Lista para descargar",
    date: "2026-06-03",
    result: "Ortopantomografia_Mariana_Lopez.pdf",
    notes: "Planeación ortodóncica y registro fotográfico inicial.",
    countsForPartner: true,
    validatedAt: "2026-06-03",
    validatedBy: "Admin Radio Imagen",
  },
  {
    id: "ORD-2026-0002",
    patient: "Carlos Mendez Ruiz",
    doctor: "Dra. Sofia Herrera",
    owner: "current-doctor",
    doctorId: "DR-0001",
    studies: ["Ortopantomografía"],
    status: "Agendada",
    date: "2026-06-02",
    result: "",
    notes: "Valoración general para diagnóstico y plan de tratamiento.",
    countsForPartner: false,
  },
  {
    id: "ORD-2026-0003",
    patient: "Valeria Torres Diaz",
    doctor: "Dr. Marco Padilla",
    owner: "external-doctor",
    doctorId: "DR-0002",
    studies: ["Lateral de Craneo", "PA De craneo"],
    status: "Completa",
    date: "2026-06-01",
    result: "",
    notes: "Cefalometría y fotografías para seguimiento.",
    countsForPartner: false,
  },
  {
    id: "ORD-2026-0004",
    patient: "Roberto Salinas Vega",
    doctor: "Dra. Sofia Herrera",
    owner: "current-doctor",
    doctorId: "DR-0001",
    studies: ["ATM COMPARATIVA"],
    status: "Recibida",
    date: "2026-06-04",
    result: "",
    notes: "Evaluación de ATM y dolor articular referido.",
    countsForPartner: false,
  },
];

const adminDownloadRequests = [
  {
    orderId: "ORD-2026-0001",
    patient: "Mariana Lopez Garcia",
    doctor: "Dra. Sofia Herrera",
    file: "ORD-2026-0001.zip",
    status: "Solicitada",
    storage: "local_ready",
    expires: "Local vence en 68 días",
  },
  {
    orderId: "ORD-2026-0003",
    patient: "Valeria Torres Diaz",
    doctor: "Dr. Marco Padilla",
    file: "CBCT_Valeria_Torres.zip",
    status: "Subiendo",
    storage: "upload_requested",
    expires: "Supabase pendiente",
  },
  {
    orderId: "ORD-2026-0018",
    patient: "Sofia Calderon Reyes",
    doctor: "Dra. Sofia Herrera",
    file: "ORD-2026-0018.pdf",
    status: "Lista",
    storage: "cloud_ready",
    expires: "Link vence en 54 min",
  },
];

const SESSION_KEY = "radioImagenDoctorSession";
const ADMIN_EMAIL = "admin@radioimagen.mx";
const DEFAULT_DOCTOR_PASSWORD = "Dentista2026!";

const authorizedAccounts = {
  [ADMIN_EMAIL]: {
    password: "RadioImagen2026!",
    role: "admin",
  },
  "sofia.herrera@consulta.mx": {
    password: DEFAULT_DOCTOR_PASSWORD,
    role: "doctor",
  },
  "marco.padilla@consulta.mx": {
    password: DEFAULT_DOCTOR_PASSWORD,
    role: "doctor",
  },
};

const adminProfile = {
  id: "ADM-0001",
  handle: "@radio-imagen-admin",
  name: "Admin Radio Imagen",
  specialty: "Radiodiagnóstico y operación",
  clinic: "Radio Imagen Dentomaxilar",
  contactPhone: "55 0000 0000",
  email: ADMIN_EMAIL,
  city: "Ciudad de México",
};

const localResultFiles = [
  {
    file: "Mariana_Lopez_Garcia_OPG_Lateral.zip",
    patient: "Mariana Lopez Garcia",
    modality: "OPG + Lateral",
    status: "local_ready",
    confidence: 98,
  },
  {
    file: "Valeria_Torres_Diaz_Cefalometria.zip",
    patient: "Valeria Torres Diaz",
    modality: "Cefalometría",
    status: "local_ready",
    confidence: 94,
  },
  {
    file: "Roberto_Salinas_Vega_ATM.zip",
    patient: "Roberto Salinas Vega",
    modality: "ATM comparativa",
    status: "local_ready",
    confidence: 96,
  },
];

const resultPackages = {
  "ORD-2026-0001": {
    complete: "Mariana_Lopez_Garcia_Estudio_Completo.zip",
    files: [
      { label: "Radiografía panorámica", type: "PDF", file: "Mariana_Lopez_Garcia_OPG.pdf" },
      { label: "Lateral de cráneo", type: "PDF", file: "Mariana_Lopez_Garcia_Lateral.pdf" },
      { label: "Análisis cefalométrico", type: "PDF", file: "Mariana_Lopez_Garcia_Cefalometria.pdf" },
      { label: "Fotografías clínicas", type: "ZIP", file: "Mariana_Lopez_Garcia_Fotografias.zip" },
    ],
  },
  "ORD-2026-0003": {
    complete: "Valeria_Torres_Diaz_Estudio_Completo.zip",
    files: [
      { label: "Lateral de cráneo", type: "PDF", file: "Valeria_Torres_Diaz_Lateral.pdf" },
      { label: "PA de cráneo", type: "PDF", file: "Valeria_Torres_Diaz_PA.pdf" },
      { label: "Trazado cefalométrico", type: "PDF", file: "Valeria_Torres_Diaz_Cefalometria.pdf" },
    ],
  },
  "ORD-2026-0004": {
    complete: "Roberto_Salinas_Vega_ATM_Completo.zip",
    files: [
      { label: "ATM boca cerrada", type: "PDF", file: "Roberto_Salinas_Vega_ATM_Cerrada.pdf" },
      { label: "ATM boca abierta", type: "PDF", file: "Roberto_Salinas_Vega_ATM_Abierta.pdf" },
      { label: "Reporte comparativo", type: "PDF", file: "Roberto_Salinas_Vega_ATM_Reporte.pdf" },
    ],
  },
};

const agentState = {
  matches: [],
  uploads: 0,
  hasRun: false,
};

const partnerTiers = [
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

const POINTS_PER_REFERRED_PATIENT = 100;

const metricPeriods = {
  today: "Hoy",
  week: "Semana",
  month: "Mes",
  year: "Año",
};

const adminOrderStatuses = ["Recibida", "Agendada", "Completa", "Lista para descargar", "Cancelada"];

const doctorDirectory = {
  "sofia.herrera@consulta.mx": {
    id: "DR-0001",
    handle: "@sofia-herrera",
    name: "Dra. Sofia Herrera",
    specialty: "Ortodoncia y ATM",
    clinic: "Clínica Herrera Dental",
    contactPhone: "55 7123 8842",
    email: "sofia.herrera@consulta.mx",
    city: "Ciudad de México",
    metrics: {
      activeOrders: "18",
      readyResults: "4 listas",
      monthlyPatients: "42",
      growth: "+12%",
      pendingAppointments: "6",
      topStudy: "OPG",
      topStudyDetail: "Ortopantomografía",
      conversion: "83%",
    },
    metricsByPeriod: {
      today: {
        activeOrders: "18",
        readyResults: "4 listas",
        patientsLabel: "Pacientes hoy",
        monthlyPatients: "42",
        growth: "+12% vs ayer",
        pendingAppointments: "6",
        topStudy: "OPG",
        topStudyDetail: "Ortopantomografía",
        conversion: "83%",
      },
      week: {
        activeOrders: "34",
        readyResults: "11 listas",
        patientsLabel: "Pacientes semana",
        monthlyPatients: "96",
        growth: "+18% vs semana anterior",
        pendingAppointments: "14",
        topStudy: "EOC",
        topStudyDetail: "Estudio ortodóntico completo",
        conversion: "86%",
      },
      month: {
        activeOrders: "52",
        readyResults: "19 listas",
        patientsLabel: "Pacientes mes",
        monthlyPatients: "184",
        growth: "+24% vs mes anterior",
        pendingAppointments: "21",
        topStudy: "OPG",
        topStudyDetail: "Ortopantomografía",
        conversion: "84%",
      },
      year: {
        activeOrders: "118",
        readyResults: "63 listas",
        patientsLabel: "Pacientes año",
        monthlyPatients: "1,248",
        growth: "+31% acumulado",
        pendingAppointments: "48",
        topStudy: "EOC",
        topStudyDetail: "Estudio ortodóntico completo",
        conversion: "88%",
      },
    },
    partner: {
      referredPatients: 18,
      points: 1850,
    },
  },
  "marco.padilla@consulta.mx": {
    id: "DR-0002",
    handle: "@marco-padilla",
    name: "Dr. Marco Padilla",
    specialty: "Cirugía maxilofacial",
    clinic: "Padilla Maxilofacial",
    contactPhone: "55 4400 9821",
    email: "marco.padilla@consulta.mx",
    city: "Ciudad de México",
    metrics: {
      activeOrders: "9",
      readyResults: "2 listas",
      monthlyPatients: "28",
      growth: "+8%",
      pendingAppointments: "3",
      topStudy: "ATM COMPARATIVA",
      topStudyDetail: "Articulación temporomandibular",
      conversion: "76%",
    },
    metricsByPeriod: {
      today: {
        activeOrders: "9",
        readyResults: "2 listas",
        patientsLabel: "Pacientes hoy",
        monthlyPatients: "28",
        growth: "+8% vs ayer",
        pendingAppointments: "3",
        topStudy: "ATM",
        topStudyDetail: "Articulación temporomandibular",
        conversion: "76%",
      },
      week: {
        activeOrders: "16",
        readyResults: "5 listas",
        patientsLabel: "Pacientes semana",
        monthlyPatients: "48",
        growth: "+11% vs semana anterior",
        pendingAppointments: "7",
        topStudy: "CBCT",
        topStudyDetail: "Tomografía 3D",
        conversion: "78%",
      },
      month: {
        activeOrders: "29",
        readyResults: "12 listas",
        patientsLabel: "Pacientes mes",
        monthlyPatients: "116",
        growth: "+16% vs mes anterior",
        pendingAppointments: "11",
        topStudy: "CBCT",
        topStudyDetail: "Tomografía 3D",
        conversion: "81%",
      },
      year: {
        activeOrders: "74",
        readyResults: "38 listas",
        patientsLabel: "Pacientes año",
        monthlyPatients: "692",
        growth: "+22% acumulado",
        pendingAppointments: "24",
        topStudy: "CBCT",
        topStudyDetail: "Tomografía 3D",
        conversion: "85%",
      },
    },
    partner: {
      referredPatients: 8,
      points: 820,
    },
  },
};

const viewTitles = {
  dashboard: "Panel doctor",
  "new-order": "Nueva orden digital",
  results: "Resultados",
  profile: "Mi perfil profesional",
  admin: "Admin Radio Imagen",
  future: "Consulta plus",
};

const pageTitle = document.querySelector("#page-title");
const loginScreen = document.querySelector("#login-screen");
const loadingScreen = document.querySelector("#loading-screen");
const appShell = document.querySelector("#app-shell");
const loginForm = document.querySelector("#login-form");
const logoutButton = document.querySelector("#logout-button");
const loadingHandle = document.querySelector("#loading-handle");
const doctorIdLabel = document.querySelector("#doctor-id-label");
const navButtons = document.querySelectorAll("[data-view]");
const periodButtons = document.querySelectorAll("[data-period]");
const studyGrid = document.querySelector("#study-grid");
const doctorOrderList = document.querySelector("#doctor-order-list");
const resultsTable = document.querySelector("#results-table");
const resultsSearch = document.querySelector("#results-search");
const adminStatusFilter = document.querySelector("#admin-status-filter");
const adminOrderTable = document.querySelector("#admin-order-table");
const adminDoctorList = document.querySelector("#admin-doctor-list");
const adminDownloadQueue = document.querySelector("#admin-download-queue");
const adminDoctorForm = document.querySelector("#admin-doctor-form");
const focusNewDoctorButton = document.querySelector("#focus-new-doctor");
const adminSectionButtons = document.querySelectorAll("[data-admin-section]");
const adminSectionPanels = document.querySelectorAll("[data-admin-section-panel]");
const runAgentButton = document.querySelector("#run-agent-button");
const sendStudiesButton = document.querySelector("#send-studies-button");
const agentLog = document.querySelector("#agent-log");
const orderForm = document.querySelector("#order-form");
const profileForm = document.querySelector("#profile-form");
const toast = document.querySelector("#toast");
const currentDate = document.querySelector("#current-date");
const currentTime = document.querySelector("#current-time");
const referralDateInput = document.querySelector('input[name="referralDate"]');
const profilePhotoInput = document.querySelector('input[name="profilePhoto"]');
const profilePhotoPreview = document.querySelector("#profile-photo-preview");
const profileInitials = document.querySelector("#profile-initials");
const doctorPreviewPhoto = document.querySelector("#doctor-preview-photo");
const doctorPreviewInitials = document.querySelector("#doctor-preview-initials");
const editableAvatar = document.querySelector(".editable-avatar");
const photoZoomInput = document.querySelector('input[name="photoZoom"]');
const photoXInput = document.querySelector('input[name="photoX"]');
const photoYInput = document.querySelector('input[name="photoY"]');
const centerPhotoButton = document.querySelector("#center-photo");
const orderModal = document.querySelector("#order-modal");
const closeOrderModalButton = document.querySelector("#close-order-modal");
const downloadModal = document.querySelector("#download-modal");
const closeDownloadModalButton = document.querySelector("#close-download-modal");
const downloadPatientName = document.querySelector("#download-patient-name");
const downloadStudySummary = document.querySelector("#download-study-summary");
const downloadFullStudyButton = document.querySelector("#download-full-study");
const downloadFileList = document.querySelector("#download-file-list");
const modalPatientName = document.querySelector("#modal-patient-name");
const modalStudies = document.querySelector("#modal-studies");
const modalOrderDate = document.querySelector("#modal-order-date");
const modalOrderStatus = document.querySelector("#modal-order-status");
const modalDoctorName = document.querySelector("#modal-doctor-name");
const modalResult = document.querySelector("#modal-result");
const modalNotes = document.querySelector("#modal-notes");
const partnerTier = document.querySelector("[data-partner-tier]");
const partnerPoints = document.querySelector("[data-partner-points]");
const partnerReferrals = document.querySelector("[data-partner-referrals]");
const partnerNext = document.querySelector("[data-partner-next]");
const partnerProgress = document.querySelector("[data-partner-progress]");
const partnerCurrentReward = document.querySelector("[data-partner-current-reward]");
const partnerNextReward = document.querySelector("[data-partner-next-reward]");
const partnerCurrentBenefits = document.querySelector("[data-partner-current-benefits]");
const partnerNextBenefits = document.querySelector("[data-partner-next-benefits]");
const partnerBenefitCatalog = document.querySelector("[data-partner-benefit-catalog]");
const partnerLadder = document.querySelector("[data-partner-ladder]");
let dragStart = null;
let selectedMetricsPeriod = "today";
let currentRole = "doctor";
let activeDownloadOrder = null;

const doctorProfile = {
  id: "DR-0001",
  handle: "@sofia-herrera",
  name: "Dra. Sofia Herrera",
  specialty: "Ortodoncia y ATM",
  clinic: "Clínica Herrera Dental",
  contactPhone: "55 7123 8842",
  email: "sofia.herrera@consulta.mx",
  city: "Ciudad de México",
  photo: "",
  photoZoom: 1,
  photoX: 0,
  photoY: 0,
  metrics: doctorDirectory["sofia.herrera@consulta.mx"].metrics,
  metricsByPeriod: doctorDirectory["sofia.herrera@consulta.mx"].metricsByPeriod,
  partner: { ...doctorDirectory["sofia.herrera@consulta.mx"].partner },
};

function todayISO() {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

function updateInternalClock() {
  const now = new Date();

  currentDate.textContent = now.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  currentTime.textContent = now.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function setDefaultReferralDate() {
  referralDateInput.value = todayISO();
}

function getInitials(name) {
  const cleanName = name.replace(/\b(Doctora|Doctor|Dra|Dr)\.?\s*/gi, "").trim();
  const nameParts = cleanName.split(/\s+/).filter(Boolean);
  const initials = nameParts.slice(0, 2).map((part) => part[0]).join("");
  return initials.toUpperCase() || "DR";
}

function statusClass(status) {
  return status
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

function getDoctorById(doctorId) {
  return Object.values(doctorDirectory).find((doctor) => doctor.id === doctorId);
}

function getNextDoctorCode() {
  const nextNumber =
    Object.values(doctorDirectory).reduce((maxCode, doctor) => {
      const codeNumber = Number(doctor.id.replace("DR-", ""));
      return Number.isFinite(codeNumber) ? Math.max(maxCode, codeNumber) : maxCode;
    }, 0) + 1;

  return `DR-${String(nextNumber).padStart(4, "0")}`;
}

function slugifyDoctorName(name) {
  return `@${normalizeName(name).replace(/\s+/g, "-") || "doctor"}`;
}

function buildDefaultMetrics(validatedPatients) {
  const activeOrders = Math.max(Math.round(validatedPatients * 0.45), 0);
  const readyResults = Math.max(Math.round(validatedPatients * 0.2), 0);
  const pendingAppointments = Math.max(Math.round(validatedPatients * 0.12), 0);
  const conversion = validatedPatients > 0 ? "78%" : "0%";

  return {
    activeOrders: String(activeOrders),
    readyResults: `${readyResults} listas`,
    monthlyPatients: String(validatedPatients),
    growth: validatedPatients > 0 ? "Histórico cargado" : "Sin histórico",
    pendingAppointments: String(pendingAppointments),
    topStudy: "OPG",
    topStudyDetail: "Ortopantomografía",
    conversion,
  };
}

function buildMetricsByPeriod(validatedPatients) {
  return {
    today: {
      ...buildDefaultMetrics(Math.min(validatedPatients, 3)),
      patientsLabel: "Pacientes hoy",
      growth: validatedPatients > 0 ? "Alta inicial" : "Sin actividad",
    },
    week: {
      ...buildDefaultMetrics(Math.min(validatedPatients, 8)),
      patientsLabel: "Pacientes semana",
      growth: "Base inicial",
    },
    month: {
      ...buildDefaultMetrics(validatedPatients),
      patientsLabel: "Pacientes mes",
      growth: "Base histórica",
    },
    year: {
      ...buildDefaultMetrics(validatedPatients),
      patientsLabel: "Pacientes año",
      growth: "Histórico cargado",
    },
  };
}

function normalizeName(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.setTimeout(() => toast.classList.remove("visible"), 2800);
}

function setAdminSection(sectionId) {
  adminSectionButtons.forEach((button) => {
    const isActive = button.dataset.adminSection === sectionId;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  adminSectionPanels.forEach((panel) => {
    panel.hidden = panel.dataset.adminSectionPanel !== sectionId;
    panel.classList.toggle("active", panel.dataset.adminSectionPanel === sectionId);
  });
}

function setView(viewId) {
  if (currentRole === "doctor" && viewId === "admin") {
    viewId = "dashboard";
  }

  if (currentRole === "admin" && viewId !== "admin") {
    viewId = "admin";
  }

  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("active", view.id === viewId);
  });

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === viewId);
  });

  document.querySelectorAll("[data-doctor-only]").forEach((node) => {
    node.hidden = currentRole !== "doctor" || node.dataset.hideOnView === viewId;
  });

  pageTitle.textContent = viewTitles[viewId] || "Radio Imagen";
}

function configureShellForRole(role) {
  currentRole = role;
  appShell.dataset.role = role;

  document.querySelectorAll("[data-role-view]").forEach((button) => {
    button.hidden = button.dataset.roleView !== role;
  });

  document.querySelectorAll("[data-doctor-only]").forEach((node) => {
    node.hidden = role !== "doctor";
  });

  if (role === "admin") {
    document.querySelectorAll("[data-profile-name]").forEach((node) => {
      node.textContent = adminProfile.name;
    });
    document.querySelectorAll("[data-profile-specialty]").forEach((node) => {
      node.textContent = adminProfile.specialty;
    });
    document.querySelectorAll("[data-profile-clinic]").forEach((node) => {
      node.textContent = adminProfile.clinic;
    });
    document.querySelectorAll("[data-profile-handle]").forEach((node) => {
      node.textContent = adminProfile.handle;
    });
    doctorIdLabel.textContent = adminProfile.id;
  }
}

function applyDoctorProfile(profile) {
  doctorProfile.id = profile.id;
  doctorProfile.handle = profile.handle;
  doctorProfile.name = profile.name;
  doctorProfile.specialty = profile.specialty;
  doctorProfile.clinic = profile.clinic;
  doctorProfile.contactPhone = profile.contactPhone;
  doctorProfile.email = profile.email;
  doctorProfile.city = profile.city;
  doctorProfile.metrics = profile.metrics;
  doctorProfile.metricsByPeriod = profile.metricsByPeriod;
  doctorProfile.partner = { ...profile.partner };
}

function getAccountRole(email) {
  return email.toLowerCase() === ADMIN_EMAIL ? "admin" : "doctor";
}

function findDoctorByEmail(email) {
  return doctorDirectory[email.toLowerCase()] || doctorDirectory["sofia.herrera@consulta.mx"];
}

function renderMetrics() {
  const metrics = doctorProfile.metricsByPeriod?.[selectedMetricsPeriod] || doctorProfile.metrics;
  document.querySelector('[data-metric-label="patients"]').textContent = metrics.patientsLabel || "Pacientes";
  document.querySelector('[data-metric="activeOrders"]').textContent = metrics.activeOrders;
  document.querySelector('[data-metric-copy="readyResults"]').textContent = metrics.readyResults;
  document.querySelector('[data-metric="monthlyPatients"]').textContent = metrics.monthlyPatients;
  document.querySelector('[data-metric-copy="growth"]').textContent = metrics.growth;
  document.querySelector('[data-metric="pendingAppointments"]').textContent = metrics.pendingAppointments;
  document.querySelector('[data-metric="topStudy"]').textContent = metrics.topStudy;
  document.querySelector('[data-metric-copy="topStudyDetail"]').textContent = metrics.topStudyDetail;
  document.querySelector('[data-metric="conversion"]').textContent = metrics.conversion;
  periodButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.period === selectedMetricsPeriod);
    button.setAttribute("aria-pressed", String(button.dataset.period === selectedMetricsPeriod));
  });
}

function setMetricsPeriod(period) {
  if (!metricPeriods[period]) {
    return;
  }

  selectedMetricsPeriod = period;
  renderMetrics();
  showToast(`Métricas actualizadas: ${metricPeriods[period]}.`);
}

function getPartnerTier(referrals) {
  if (referrals < 1) {
    return {
      name: "Por activar",
      shortName: "Inicio",
      minPoints: 0,
      minReferrals: 0,
      reward: "Envía tu primer paciente para activar Socios Radio Imagen Dentomaxilar",
      benefits: ["Al enviar el primer paciente se desbloquea el kit digital de inicio"],
    };
  }

  return partnerTiers.reduce(
    (currentTier, tier) => (referrals >= tier.minReferrals ? tier : currentTier),
    partnerTiers[0],
  );
}

function getNextPartnerTier(referrals) {
  return partnerTiers.find((tier) => tier.minReferrals > referrals) || null;
}

function renderPartnerProgram() {
  const partner = doctorProfile.partner;
  const currentTier = getPartnerTier(partner.referredPatients);
  const nextTier = getNextPartnerTier(partner.referredPatients);
  const previousThreshold = currentTier.minReferrals;
  const nextThreshold = nextTier?.minReferrals || currentTier.minReferrals;
  const progressRange = Math.max(nextThreshold - previousThreshold, 1);
  const progressValue = nextTier
    ? Math.min(((partner.referredPatients - previousThreshold) / progressRange) * 100, 100)
    : 100;

  partnerTier.textContent = currentTier.name;
  partnerPoints.textContent = `${partner.points.toLocaleString("es-MX")} pts`;
  partnerReferrals.textContent = `${partner.referredPatients} pacientes validados`;
  partnerNext.textContent = nextTier
    ? `${nextTier.minReferrals - partner.referredPatients} pacientes para ${nextTier.shortName}`
    : "Nivel máximo activo";
  partnerProgress.style.width = `${Math.max(progressValue, 6)}%`;
  partnerCurrentReward.textContent = currentTier.reward;
  partnerNextReward.textContent = nextTier ? nextTier.reward : "Programa completo";
  partnerCurrentBenefits.innerHTML = renderBenefits(currentTier.benefits);
  partnerNextBenefits.innerHTML = nextTier ? renderBenefits(nextTier.benefits) : "<li>Todos los beneficios activos</li>";
  partnerLadder.innerHTML = partnerTiers
    .map(
      (tier) => `
        <span class="${partner.referredPatients >= tier.minReferrals ? "active" : ""}">
          ${tier.shortName}
          <small>${tier.minReferrals}</small>
        </span>
      `,
    )
    .join("");
  partnerBenefitCatalog.innerHTML = partnerTiers
    .map(
      (tier) => `
        <article class="${partner.referredPatients >= tier.minReferrals ? "active" : ""}">
          <strong>${tier.shortName}</strong>
          <span>${tier.minReferrals} paciente${tier.minReferrals === 1 ? "" : "s"}</span>
          <small>${tier.reward}</small>
        </article>
      `,
    )
    .join("");
}

function renderBenefits(benefits) {
  return benefits.map((benefit) => `<li>${benefit}</li>`).join("");
}

function awardPartnerPoints() {
  doctorProfile.partner.referredPatients += 1;
  doctorProfile.partner.points += POINTS_PER_REFERRED_PATIENT;
}

function getOrderOperationalCopy(order) {
  if (order.status === "Recibida") {
    return "WhatsApp pendiente para agendar";
  }

  if (order.status === "Agendada") {
    return order.scheduledAt ? `Agendado ${order.scheduledAt}` : "Paciente agendado";
  }

  if (order.status === "Lista para descargar") {
    return "Resultado liberado para el doctor";
  }

  if (order.status === "Cancelada") {
    return "No suma puntos";
  }

  if (order.countsForPartner) {
    return `Validado ${order.validatedAt} · ${order.validatedBy}`;
  }

  return "Pendiente de validar asistencia";
}

function getAdminNextStep(order) {
  if (order.status === "Recibida") {
    return {
      label: "Contactar y agendar",
      action: "Marcar agendada",
    };
  }

  if (order.status === "Agendada") {
    return {
      label: "Esperar asistencia",
      action: "Marcar completa",
    };
  }

  if (order.status === "Completa") {
    return {
      label: "Asignar archivos del estudio",
      action: "Asignar resultado",
    };
  }

  if (order.status === "Lista para descargar") {
    return {
      label: "Resultado visible para el doctor",
      action: "Lista",
    };
  }

  return {
    label: "Orden cerrada",
    action: "Sin acción",
  };
}

function runAdminNextStep(orderId) {
  const order = orders.find((currentOrder) => currentOrder.id === orderId);

  if (!order) {
    return;
  }

  if (order.status === "Recibida") {
    order.status = "Agendada";
    order.scheduledAt = todayISO();
    renderAdmin();
    renderDoctorOrders();
    renderResults(resultsSearch.value);
    showToast(`${order.patient} marcado como Agendada.`);
    return;
  }

  if (order.status === "Agendada") {
    validateAttendedOrder(order.id, "Completa");
    return;
  }

  if (order.status === "Completa") {
    runAgent(order.id);
    return;
  }

  if (order.status === "Lista para descargar") {
    showToast(`${order.patient} ya está listo para descargar.`);
    return;
  }

  showToast(`${order.patient} no tiene acción pendiente.`);
}

function validateAttendedOrder(orderId, nextStatus = "Completa") {
  const order = orders.find((currentOrder) => currentOrder.id === orderId);

  if (!order) {
    return;
  }

  if (order.countsForPartner) {
    order.status = nextStatus;
    renderAdmin();
    renderDoctorOrders();
    renderResults(resultsSearch.value);
    showToast(`${order.patient} ya estaba validado. Estatus actualizado a ${nextStatus}.`);
    return;
  }

  const doctor = getDoctorById(order.doctorId);

  order.status = nextStatus;
  order.countsForPartner = true;
  order.validatedAt = todayISO();
  order.validatedBy = adminProfile.name;
  order.completedAt = todayISO();

  if (doctor) {
    doctor.partner.referredPatients += 1;
    doctor.partner.points += POINTS_PER_REFERRED_PATIENT;

    if (doctorProfile.id === doctor.id) {
      doctorProfile.partner = { ...doctor.partner };
    }
  }

  renderAdmin();
  renderPartnerProgram();
  renderDoctorOrders();
  renderResults(resultsSearch.value);
  showToast(`Paciente completado: ${order.patient}. Se sumaron ${POINTS_PER_REFERRED_PATIENT} pts.`);
}

function createDoctorFromAdmin(formData) {
  const email = formData.get("doctorEmail").trim().toLowerCase();
  const name = formData.get("doctorName").trim();
  const password = formData.get("doctorPassword").trim();
  const validatedPatients = Math.max(Number(formData.get("validatedPatients")) || 0, 0);

  if (!email || !name || !password) {
    showToast("Nombre, correo y contraseña son obligatorios.");
    return;
  }

  if (doctorDirectory[email]) {
    showToast("Ese correo ya existe en el directorio de doctores.");
    return;
  }

  const doctorCode = getNextDoctorCode();
  const metrics = buildDefaultMetrics(validatedPatients);

  doctorDirectory[email] = {
    id: doctorCode,
    handle: slugifyDoctorName(name),
    name,
    specialty: formData.get("doctorSpecialty").trim() || "Especialidad por definir",
    clinic: formData.get("doctorClinic").trim() || "Consultorio independiente",
    contactPhone: formData.get("doctorPhone").trim(),
    email,
    city: formData.get("doctorCity").trim() || "Ciudad por definir",
    metrics,
    metricsByPeriod: buildMetricsByPeriod(validatedPatients),
    partner: {
      referredPatients: validatedPatients,
      points: validatedPatients * POINTS_PER_REFERRED_PATIENT,
    },
  };
  authorizedAccounts[email] = {
    password,
    role: "doctor",
  };

  renderAdmin();
  adminDoctorForm.reset();
  adminDoctorForm.querySelectorAll("input").forEach((input) => {
    input.value = input.name === "validatedPatients" ? "0" : "";
  });
  showToast(`${name} creado como ${doctorCode}. Contraseña inicial guardada.`);
}

function renderDoctorScopedData() {
  if (currentRole === "admin") {
    renderAdmin();
    return;
  }

  renderProfile();
  renderMetrics();
  renderPartnerProgram();
  renderDoctorOrders();
  renderResults(resultsSearch.value);
  renderAdmin();
}

function showApp(useLoader = false, initialView = currentRole === "admin" ? "admin" : "dashboard") {
  loginScreen.hidden = true;
  appShell.hidden = true;
  loadingScreen.hidden = !useLoader;
  loadingHandle.textContent = currentRole === "admin" ? adminProfile.handle : doctorProfile.handle;

  const reveal = () => {
    loadingScreen.hidden = true;
    appShell.hidden = false;
    configureShellForRole(currentRole);
    renderDoctorScopedData();
    setView(initialView);
  };

  if (useLoader) {
    window.setTimeout(reveal, 1100);
  } else {
    reveal();
  }
}

function showLogin() {
  appShell.hidden = true;
  loadingScreen.hidden = true;
  loginScreen.hidden = false;
}

function loginAccount(email, password) {
  const normalizedEmail = email.toLowerCase();
  const account = authorizedAccounts[normalizedEmail];

  if (!account) {
    showToast("Correo no autorizado. Radio Imagen debe dar de alta la cuenta.");
    return;
  }

  if (account.password !== password) {
    showToast("Contraseña incorrecta.");
    return;
  }

  const role = account.role || getAccountRole(normalizedEmail);
  currentRole = role;

  if (role === "doctor") {
    const profile = findDoctorByEmail(normalizedEmail);
    applyDoctorProfile(profile);
  }

  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      email: normalizedEmail,
      provider: "password",
      role,
      accountId: role === "admin" ? adminProfile.id : doctorProfile.id,
      handle: role === "admin" ? adminProfile.handle : doctorProfile.handle,
      signedInAt: new Date().toISOString(),
    }),
  );
  showApp(true, role === "admin" ? "admin" : "dashboard");
  showToast(role === "admin" ? "Sesión admin iniciada." : "Sesión iniciada.");
}

function renderStudies() {
  const studiesByCategory = studies.reduce((groups, study) => {
    if (!groups[study.category]) {
      groups[study.category] = [];
    }

    groups[study.category].push(study);
    return groups;
  }, {});

  studyGrid.innerHTML = Object.entries(studiesByCategory)
    .map(
      ([category, categoryStudies]) => `
        <section class="study-category">
          <h3>${category}</h3>
          <div class="study-category-grid">
            ${categoryStudies
              .map(
                (study) =>
                  study.type === "orthodontic-package"
                    ? `
                      <div class="study-option special-study-option orthodontic-option" data-orthodontic-card>
                        <label>
                          <input type="checkbox" name="studies" value="${study.name}" data-orthodontic-toggle />
                          <strong>${study.name}</strong>
                          <span>${study.description}</span>
                        </label>
                        <div class="special-study-fields" data-orthodontic-fields hidden>
                          <label>
                            Tipo de estudio
                            <select name="orthodonticStudyType">
                              <option value="">Seleccionar tipo</option>
                              <option value="2D">2D</option>
                              <option value="3D">3D</option>
                            </select>
                          </label>
                          <label>
                            Análisis cefalométrico
                            <select name="orthodonticCephalometry">
                              <option value="">Seleccionar análisis</option>
                              ${cephalometricStudies
                                .map((cephalometry) => `<option value="${cephalometry.name}">${cephalometry.name}</option>`)
                                .join("")}
                            </select>
                          </label>
                          <div class="package-includes">
                            <span>Incluye:</span>
                            <ul>
                              <li>Ortopantomografía</li>
                              <li>Lateral de Craneo</li>
                              <li>Escaneo intraoral</li>
                              <li>Modelos en resina</li>
                              <li>Fotografía extraoral e intraoral</li>
                              <li>Análisis cefalométrico seleccionado</li>
                            </ul>
                          </div>
                          <label class="orthodontic-instructions">
                            Indicaciones especiales
                            <textarea name="orthodonticInstructions" placeholder="Ej. evaluar clase esqueletal, vía aérea, crecimiento, asimetrías o comentarios para Radio Imagen"></textarea>
                          </label>
                          <div class="tomography-fields nested-fields" data-orthodontic-tomography-fields hidden>
                            <label>
                              FOV Tomografía 3D
                              <select name="orthodonticTomographyFov">
                                <option value="">Seleccionar FOV</option>
                                ${study.fovOptions.map((fov) => `<option value="${fov}">${fov}</option>`).join("")}
                              </select>
                            </label>
                            <label data-orthodontic-fov-8 hidden>
                              Especificación 8x8
                              <select name="orthodonticTomographyArch">
                                <option value="">Seleccionar zona</option>
                                <option value="Maxilar">Maxilar</option>
                                <option value="Mandibular">Mandibular</option>
                              </select>
                            </label>
                            <label data-orthodontic-fov-5 hidden>
                              Pieza de interés 5x5
                              <input name="orthodonticTomographyTooth" placeholder="Ej. 1.6, 3.7, incisivo central superior" />
                            </label>
                          </div>
                        </div>
                      </div>
                    `
                    : study.type === "tomography"
                    ? `
                      <div class="study-option special-study-option tomography-option" data-tomography-card>
                        <label>
                          <input type="checkbox" name="studies" value="${study.name}" data-tomography-toggle />
                          <strong>${study.name}</strong>
                          <span>${study.description}</span>
                        </label>
                        <div class="tomography-fields" data-tomography-fields hidden>
                          <label>
                            Tamaño FOV
                            <select name="tomographyFov">
                              <option value="">Seleccionar FOV</option>
                              ${study.fovOptions.map((fov) => `<option value="${fov}">${fov}</option>`).join("")}
                            </select>
                          </label>
                          <label data-fov-8 hidden>
                            Especificación 8x8
                            <select name="tomographyArch">
                              <option value="">Seleccionar zona</option>
                              <option value="Maxilar">Maxilar</option>
                              <option value="Mandibular">Mandibular</option>
                            </select>
                          </label>
                          <label data-fov-5 hidden>
                            Pieza de interés 5x5
                            <input name="tomographyTooth" placeholder="Ej. 1.6, 3.7, incisivo central superior" />
                          </label>
                        </div>
                      </div>
                    `
                    : `
                      <label class="study-option">
                        <input type="checkbox" name="studies" value="${study.name}" />
                        <strong>${study.name}</strong>
                        <span>${study.description}</span>
                      </label>
                    `,
              )
              .join("")}
          </div>
        </section>
      `,
    )
    .join("");
}

function updateTomographyFields() {
  const tomographyToggle = document.querySelector("[data-tomography-toggle]");
  const tomographyFields = document.querySelector("[data-tomography-fields]");
  const fovEightField = document.querySelector("[data-fov-8]");
  const fovFiveField = document.querySelector("[data-fov-5]");
  const fovValue = document.querySelector('select[name="tomographyFov"]')?.value;

  if (!tomographyToggle || !tomographyFields) {
    return;
  }

  tomographyFields.hidden = !tomographyToggle.checked;
  fovEightField.hidden = !tomographyToggle.checked || fovValue !== "8x8";
  fovFiveField.hidden = !tomographyToggle.checked || fovValue !== "5x5";
}

function updateOrthodonticPackageFields() {
  const orthodonticToggle = document.querySelector("[data-orthodontic-toggle]");
  const orthodonticFields = document.querySelector("[data-orthodontic-fields]");
  const orthodonticTomographyFields = document.querySelector("[data-orthodontic-tomography-fields]");
  const fovEightField = document.querySelector("[data-orthodontic-fov-8]");
  const fovFiveField = document.querySelector("[data-orthodontic-fov-5]");
  const studyType = document.querySelector('select[name="orthodonticStudyType"]')?.value;
  const fovValue = document.querySelector('select[name="orthodonticTomographyFov"]')?.value;

  if (!orthodonticToggle || !orthodonticFields) {
    return;
  }

  const showPackageFields = orthodonticToggle.checked;
  const showTomographyFields = showPackageFields && studyType === "3D";

  orthodonticFields.hidden = !showPackageFields;
  orthodonticTomographyFields.hidden = !showTomographyFields;
  fovEightField.hidden = !showTomographyFields || fovValue !== "8x8";
  fovFiveField.hidden = !showTomographyFields || fovValue !== "5x5";
}

function getSelectedStudiesWithDetails(formData) {
  const selectedStudies = formData.getAll("studies");
  const orthodonticIndex = selectedStudies.indexOf("Estudio Ortodóntico Completo");
  const tomographyIndex = selectedStudies.indexOf("Tomografía 3D");

  if (orthodonticIndex !== -1) {
    const orthodonticType = formData.get("orthodonticStudyType");
    const cephalometry = formData.get("orthodonticCephalometry");
    const instructions = formData.get("orthodonticInstructions").trim();

    if (!orthodonticType) {
      showToast("Selecciona si el Estudio Ortodóntico Completo es 2D o 3D.");
      return null;
    }

    if (!cephalometry) {
      showToast("Selecciona el análisis cefalométrico para el Estudio Ortodóntico Completo.");
      return null;
    }

    let orthodonticDetail =
      `Estudio Ortodóntico Completo ${orthodonticType} - ` +
      "incluye ortopantomografía, lateral de cráneo, escaneo intraoral, modelos en resina, fotografía extraoral e intraoral" +
      `, Análisis cefalométrico: ${cephalometry}`;

    if (orthodonticType === "3D") {
      const fov = formData.get("orthodonticTomographyFov");

      if (!fov) {
        showToast("Selecciona el FOV para la tomografía del Estudio Ortodóntico 3D.");
        return null;
      }

      if (fov === "8x8" && !formData.get("orthodonticTomographyArch")) {
        showToast("Para FOV 8x8 del estudio ortodóntico selecciona maxilar o mandibular.");
        return null;
      }

      if (fov === "5x5" && !formData.get("orthodonticTomographyTooth").trim()) {
        showToast("Para FOV 5x5 del estudio ortodóntico especifica la pieza de interés.");
        return null;
      }

      orthodonticDetail +=
        fov === "8x8"
          ? `, Tomografía 3D FOV ${fov} - ${formData.get("orthodonticTomographyArch")}`
          : fov === "5x5"
            ? `, Tomografía 3D FOV ${fov} - Pieza ${formData.get("orthodonticTomographyTooth").trim()}`
            : `, Tomografía 3D FOV ${fov}`;
    }

    if (instructions) {
      orthodonticDetail += `, Indicaciones especiales: ${instructions}`;
    }

    selectedStudies.splice(orthodonticIndex, 1, orthodonticDetail);
  }

  if (tomographyIndex === -1) {
    return selectedStudies;
  }

  const fov = formData.get("tomographyFov");

  if (!fov) {
    showToast("Selecciona el tamaño FOV para Tomografía 3D.");
    return null;
  }

  if (fov === "8x8" && !formData.get("tomographyArch")) {
    showToast("Para FOV 8x8 selecciona maxilar o mandibular.");
    return null;
  }

  if (fov === "5x5" && !formData.get("tomographyTooth").trim()) {
    showToast("Para FOV 5x5 especifica la pieza de interés.");
    return null;
  }

  const detail =
    fov === "8x8"
      ? `Tomografía 3D FOV ${fov} - ${formData.get("tomographyArch")}`
      : fov === "5x5"
        ? `Tomografía 3D FOV ${fov} - Pieza ${formData.get("tomographyTooth").trim()}`
        : `Tomografía 3D FOV ${fov}`;

  selectedStudies.splice(tomographyIndex, 1, detail);
  return selectedStudies;
}

function renderDoctorOrders() {
  doctorOrderList.innerHTML = orders
    .filter((order) => order.doctorId === doctorProfile.id)
    .map(
      (order) => `
        <article class="order-row">
          <div class="order-name">
            <strong>${order.patient}</strong>
            <span class="order-meta">${order.studies.join(", ")}</span>
          </div>
          <span class="order-meta">${order.date}</span>
          <span class="status ${statusClass(order.status)}">${order.status}</span>
          <button class="small-action" data-order-patient="${order.patient}" type="button">Ver orden</button>
        </article>
      `,
    )
    .join("");
}

function renderResults(filter = "") {
  const normalizedFilter = filter.trim().toLowerCase();
  const visibleOrders = orders.filter((order) =>
    order.doctorId === doctorProfile.id && order.patient.toLowerCase().includes(normalizedFilter),
  );

  resultsTable.innerHTML = visibleOrders
    .map(
      (order) => `
        <article class="result-row">
          <div class="result-name">
            <strong>${order.patient}</strong>
            <span class="result-meta">${order.studies.join(", ")}</span>
          </div>
          <span class="result-meta">${order.doctor}</span>
          <span class="status ${statusClass(order.status)}">${order.status}</span>
          <button class="download-action ${order.result ? "ready" : ""}" data-download-order="${order.id}" type="button" ${order.result ? "" : "disabled"}>
            ${order.result ? "Descargar" : "Pendiente"}
          </button>
        </article>
      `,
    )
    .join("");
}

function getResultPackage(order) {
  if (resultPackages[order.id]) {
    return resultPackages[order.id];
  }

  const baseName = normalizeName(order.patient).replace(/\s+/g, "_");
  return {
    complete: order.result || `${baseName}_Estudio_Completo.zip`,
    files: [
      {
        label: "Paquete liberado por Radio Imagen",
        type: "ZIP",
        file: order.result || `${baseName}_Resultado.zip`,
      },
      {
        label: "Reporte clínico",
        type: "PDF",
        file: `${baseName}_Reporte.pdf`,
      },
    ],
  };
}

function openDownloadModal(order) {
  activeDownloadOrder = order;
  const resultPackage = getResultPackage(order);

  downloadPatientName.textContent = order.patient;
  downloadStudySummary.textContent = order.studies.join(", ");
  downloadFullStudyButton.dataset.downloadFile = resultPackage.complete;
  downloadFullStudyButton.dataset.downloadLabel = "estudio completo";
  downloadFileList.innerHTML = resultPackage.files
    .map(
      (file) => `
        <article class="download-file-card">
          <div>
            <strong>${file.label}</strong>
            <span>${file.type} · ${file.file}</span>
          </div>
          <button class="small-action" data-download-file="${file.file}" data-download-label="${file.label}" type="button">
            Descargar
          </button>
        </article>
      `,
    )
    .join("");

  downloadModal.hidden = false;
}

function closeDownloadModal() {
  downloadModal.hidden = true;
  activeDownloadOrder = null;
}

function simulateDownload(file, label = "archivo") {
  const patient = activeDownloadOrder?.patient || "paciente";
  showToast(`Descarga simulada: ${label} · ${patient} · ${file}`);
}

function renderAdmin() {
  if (!adminOrderTable || !adminDoctorList || !adminDownloadQueue) {
    return;
  }

  const selectedStatus = adminStatusFilter?.value || "all";
  const allDoctors = Object.values(doctorDirectory);
  const visibleOrders = orders.filter((order) => selectedStatus === "all" || order.status === selectedStatus);
  const newOrders = orders.filter((order) => order.status === "Recibida").length;
  const scheduledOrders = orders.filter((order) => order.status === "Agendada").length;
  const completedOrders = orders.filter((order) => order.status === "Completa").length;
  const readyResults = orders.filter((order) => order.status === "Lista para descargar").length;

  document.querySelector('[data-admin-metric="newOrders"]').textContent = newOrders;
  document.querySelector('[data-admin-metric="scheduledOrders"]').textContent = scheduledOrders;
  document.querySelector('[data-admin-metric="completedOrders"]').textContent = completedOrders;
  document.querySelector('[data-admin-metric="readyResults"]').textContent = readyResults;
  document.querySelector('[data-admin-metric="downloadRequests"]').textContent = adminDownloadRequests.length;
  document.querySelector('[data-agent-metric="localFiles"]').textContent = localResultFiles.length;
  document.querySelector('[data-agent-metric="matches"]').textContent = agentState.matches.length;
  document.querySelector('[data-agent-metric="uploads"]').textContent = agentState.uploads;

  adminOrderTable.innerHTML = visibleOrders
    .map((order) => {
      const nextStep = getAdminNextStep(order);

      return `
        <article class="admin-row" data-admin-order="${order.id}">
          <div>
            <strong>${order.patient}</strong>
            <small>${order.studies.join(", ")}</small>
            <small class="validation-copy">
              ${getOrderOperationalCopy(order)}
            </small>
          </div>
          <span>${order.doctor}</span>
          <label class="admin-status-control">
            <span>Estatus</span>
            <select data-admin-status="${order.id}" aria-label="Cambiar estatus de ${order.patient}">
              ${adminOrderStatuses
                .map((status) => `<option value="${status}" ${order.status === status ? "selected" : ""}>${status}</option>`)
                .join("")}
            </select>
          </label>
          <div class="admin-next-step">
            <span>Siguiente paso</span>
            <strong>${nextStep.label}</strong>
          </div>
          <div class="admin-row-actions">
            <button class="small-action validate-action ${order.status === "Lista para descargar" || order.status === "Cancelada" ? "validated" : ""}" data-admin-next-order="${order.id}" type="button" ${order.status === "Cancelada" ? "disabled" : ""}>
              ${nextStep.action}
            </button>
          </div>
        </article>
      `;
    })
    .join("");

  adminDoctorList.innerHTML = allDoctors
    .map((doctor) => {
      const tier = getPartnerTier(doctor.partner.referredPatients);

      return `
        <article class="admin-doctor-card">
          <header>
            <strong>${doctor.name}</strong>
            <span class="admin-chip">${tier.shortName}</span>
          </header>
          <span>${doctor.specialty}</span>
          <small class="admin-credential-line">Correo: ${doctor.email}</small>
          <small class="admin-credential-line">Contraseña: ${authorizedAccounts[doctor.email]?.password || "No asignada"}</small>
          <small>${doctor.partner.referredPatients} pacientes validados · ${doctor.partner.points.toLocaleString("es-MX")} pts</small>
        </article>
      `;
    })
    .join("");

  adminDownloadQueue.innerHTML = adminDownloadRequests
    .map(
      (request) => `
        <article class="download-card">
          <header>
            <strong>${request.patient}</strong>
            <span class="admin-chip">${request.status}</span>
          </header>
          <span>${request.doctor}</span>
          <small>${request.file}</small>
          <small>${request.storage} · ${request.expires}</small>
        </article>
      `,
    )
    .join("");

  renderAgentLog();
}

function renderAgentLog() {
  if (!agentLog) {
    return;
  }

  if (!agentState.hasRun) {
    agentLog.innerHTML = `
      <article>
        <strong>Agente en espera</strong>
        <span>Listo para cruzar ${localResultFiles.length} archivos locales contra ${orders.length} órdenes.</span>
      </article>
    `;
    return;
  }

  agentLog.innerHTML = agentState.matches
    .map(
      (match) => `
        <article>
          <strong>${match.patient}</strong>
          <span>${match.file}</span>
          <small>${match.confidence}% coincidencia · ${match.action}</small>
        </article>
      `,
    )
    .join("");
}

function upsertDownloadRequest(order, fileMatch) {
  const existingRequest = adminDownloadRequests.find((request) => request.orderId === order.id);
  const payload = {
    orderId: order.id,
    patient: order.patient,
    doctor: order.doctor,
    file: fileMatch.file,
    status: "Subida inmediata",
    storage: "upload_requested",
    expires: "Supabase temporal: 60 min al solicitar descarga",
  };

  if (existingRequest) {
    Object.assign(existingRequest, payload);
    return;
  }

  adminDownloadRequests.unshift(payload);
}

function assignResultToOrder(order, fileMatch) {
  order.result = fileMatch.file;
  if (!order.countsForPartner) {
    validateAttendedOrder(order.id, "Lista para descargar");
  } else {
    order.status = "Lista para descargar";
  }
  upsertDownloadRequest(order, fileMatch);
}

function matchLocalFileToOrder(order) {
  const normalizedPatient = normalizeName(order.patient);

  return localResultFiles.find((file) => {
    const filePatient = normalizeName(file.patient);
    const fileName = normalizeName(file.file);
    return filePatient === normalizedPatient || fileName.includes(normalizedPatient.replace(/\s+/g, " "));
  });
}

function runAgent(orderId = null, options = {}) {
  const targetOrders = orders.filter((order) => !orderId || order.id === orderId);
  const matches = [];

  targetOrders.forEach((order) => {
    const fileMatch = matchLocalFileToOrder(order);

    if (!fileMatch) {
      return;
    }

    assignResultToOrder(order, fileMatch);
    matches.push({
      patient: order.patient,
      file: fileMatch.file,
      confidence: fileMatch.confidence,
      action: "Resultado asignado y subida solicitada",
    });
  });

  agentState.hasRun = true;
  agentState.matches = orderId ? [...matches, ...agentState.matches.filter((match) => match.patient !== targetOrders[0]?.patient)] : matches;
  agentState.uploads = adminDownloadRequests.filter((request) => request.status === "Subida inmediata").length;
  renderAdmin();
  renderDoctorOrders();
  renderResults(resultsSearch.value);
  if (!options.silent) {
    showToast(matches.length ? `Agente asignó ${matches.length} resultado(s) y solicitó subida.` : "Agente no encontró coincidencias.");
  }
}

function sendReadyStudies() {
  runAgent(null, { silent: true });

  const pendingUploads = adminDownloadRequests.filter(
    (request) => request.status === "Subida inmediata" || request.storage === "upload_requested",
  );

  if (pendingUploads.length === 0) {
    showToast("No hay estudios listos para enviar.");
    return;
  }

  pendingUploads.forEach((request) => {
    request.status = "Enviado";
    request.storage = "cloud_sent";
    request.expires = "Link enviado al doctor · vigencia 60 min";
  });

  agentState.uploads = 0;
  renderAdmin();
  renderResults(resultsSearch.value);
  showToast(`${pendingUploads.length} estudio(s) enviados al portal del doctor.`);
}

function renderProfile() {
  const initials = getInitials(doctorProfile.name);
  const photoTranslateX = `${Number(doctorProfile.photoX)}%`;
  const photoTranslateY = `${Number(doctorProfile.photoY)}%`;

  document.querySelectorAll("[data-profile-name]").forEach((node) => {
    node.textContent = doctorProfile.name;
  });

  document.querySelectorAll("[data-profile-specialty]").forEach((node) => {
    node.textContent = doctorProfile.specialty || "Especialidad no capturada";
  });

  document.querySelectorAll("[data-profile-clinic]").forEach((node) => {
    node.textContent = doctorProfile.clinic;
  });
  document.querySelectorAll("[data-profile-handle]").forEach((node) => {
    node.textContent = doctorProfile.handle;
  });
  doctorIdLabel.textContent = doctorProfile.id;
  document.querySelector("[data-profile-contact]").textContent = doctorProfile.contactPhone;
  document.querySelector("[data-profile-city]").textContent = doctorProfile.city;
  profileInitials.textContent = initials;
  doctorPreviewInitials.textContent = initials;

  [profilePhotoPreview, doctorPreviewPhoto].forEach((image) => {
    image.src = doctorProfile.photo;
    image.hidden = !doctorProfile.photo;
    image.style.setProperty("--photo-zoom", doctorProfile.photoZoom);
    image.style.setProperty("--photo-translate-x", photoTranslateX);
    image.style.setProperty("--photo-translate-y", photoTranslateY);
  });

  [profileInitials, doctorPreviewInitials].forEach((node) => {
    node.hidden = Boolean(doctorProfile.photo);
  });
}

function syncPhotoControls() {
  photoZoomInput.value = doctorProfile.photoZoom;
  photoXInput.value = doctorProfile.photoX;
  photoYInput.value = doctorProfile.photoY;
}

function updatePhotoCrop() {
  doctorProfile.photoZoom = photoZoomInput.value;
  doctorProfile.photoX = photoXInput.value;
  doctorProfile.photoY = photoYInput.value;
  renderProfile();
}

function openOrderModal(order) {
  modalPatientName.textContent = order.patient;
  modalStudies.textContent = order.studies.join(", ");
  modalOrderDate.textContent = order.date;
  modalOrderStatus.textContent = order.status;
  modalOrderStatus.className = `status ${statusClass(order.status)}`;
  modalDoctorName.textContent = order.doctor;
  modalResult.textContent = order.result || "Resultado pendiente";
  modalNotes.textContent = order.notes || "Sin indicaciones adicionales.";
  orderModal.hidden = false;
}

function closeOrderModal() {
  orderModal.hidden = true;
}

function clampPhotoOffset(value) {
  return Math.max(-40, Math.min(40, value));
}

function startPhotoDrag(event) {
  if (!doctorProfile.photo) {
    return;
  }

  editableAvatar.classList.add("dragging");
  editableAvatar.setPointerCapture(event.pointerId);
  dragStart = {
    pointerId: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    photoX: Number(doctorProfile.photoX),
    photoY: Number(doctorProfile.photoY),
  };
}

function movePhotoDrag(event) {
  if (!dragStart || dragStart.pointerId !== event.pointerId) {
    return;
  }

  const avatarSize = editableAvatar.getBoundingClientRect().width;
  const deltaX = ((event.clientX - dragStart.x) / avatarSize) * 100;
  const deltaY = ((event.clientY - dragStart.y) / avatarSize) * 100;

  doctorProfile.photoX = clampPhotoOffset(dragStart.photoX + deltaX);
  doctorProfile.photoY = clampPhotoOffset(dragStart.photoY + deltaY);
  syncPhotoControls();
  renderProfile();
}

function stopPhotoDrag(event) {
  if (!dragStart || dragStart.pointerId !== event.pointerId) {
    return;
  }

  editableAvatar.classList.remove("dragging");
  dragStart = null;
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

periodButtons.forEach((button) => {
  button.addEventListener("click", () => setMetricsPeriod(button.dataset.period));
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  loginAccount(formData.get("loginEmail").trim(), formData.get("loginPassword"));
});

logoutButton.addEventListener("click", () => {
  localStorage.removeItem(SESSION_KEY);
  showLogin();
  showToast("Sesión cerrada.");
});

orderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(orderForm);
  const selectedStudies = getSelectedStudiesWithDetails(formData);

  if (!selectedStudies) {
    return;
  }

  if (selectedStudies.length === 0) {
    showToast("Selecciona al menos un estudio para enviar la orden.");
    return;
  }

  orders.unshift({
    id: `ORD-${new Date().getFullYear()}-${String(orders.length + 1).padStart(4, "0")}`,
    patient: formData.get("patientName"),
    doctor: doctorProfile.name,
    owner: "current-doctor",
    doctorId: doctorProfile.id,
    studies: selectedStudies,
    status: "Recibida",
    date: formData.get("referralDate") || todayISO(),
    result: "",
    notes: formData.get("notes").trim(),
    countsForPartner: false,
  });

  orderForm.reset();
  setDefaultReferralDate();
  updateTomographyFields();
  updateOrthodonticPackageFields();
  renderAdmin();
  renderDoctorOrders();
  renderResults(resultsSearch.value);
  setView("dashboard");
  showToast("Orden enviada. Sumará puntos cuando Radio Imagen valide que el paciente fue atendido.");
});

profileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(profileForm);

  doctorProfile.name = formData.get("doctorName").trim();
  doctorProfile.specialty = formData.get("specialty").trim();
  doctorProfile.clinic = formData.get("clinic").trim();
  doctorProfile.contactPhone = formData.get("contactPhone").trim();
  doctorProfile.email = formData.get("email").trim();
  doctorProfile.city = formData.get("city").trim();

  renderProfile();
  renderDoctorOrders();
  renderResults(resultsSearch.value);
  showToast("Perfil actualizado para las próximas órdenes.");
});

profilePhotoInput.addEventListener("change", () => {
  const file = profilePhotoInput.files[0];

  if (!file) {
    return;
  }

  if (!file.type.startsWith("image/")) {
    showToast("Selecciona una imagen en formato PNG, JPG o WebP.");
    profilePhotoInput.value = "";
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    doctorProfile.photo = reader.result;
    doctorProfile.photoZoom = 1;
    doctorProfile.photoX = 0;
    doctorProfile.photoY = 0;
    syncPhotoControls();
    renderProfile();
    showToast("Imagen de perfil actualizada en la vista previa.");
  });
  reader.readAsDataURL(file);
});

[photoZoomInput, photoXInput, photoYInput].forEach((input) => {
  input.addEventListener("input", updatePhotoCrop);
});

editableAvatar.addEventListener("pointerdown", startPhotoDrag);
editableAvatar.addEventListener("pointermove", movePhotoDrag);
editableAvatar.addEventListener("pointerup", stopPhotoDrag);
editableAvatar.addEventListener("pointercancel", stopPhotoDrag);

centerPhotoButton.addEventListener("click", () => {
  doctorProfile.photoZoom = 1;
  doctorProfile.photoX = 0;
  doctorProfile.photoY = 0;
  syncPhotoControls();
  renderProfile();
  showToast("Imagen centrada en el recuadro.");
});

resultsSearch.addEventListener("input", () => renderResults(resultsSearch.value));

adminStatusFilter?.addEventListener("change", renderAdmin);

adminOrderTable?.addEventListener("change", (event) => {
  const statusControl = event.target.closest("[data-admin-status]");

  if (!statusControl) {
    return;
  }

  const order = orders.find((currentOrder) => currentOrder.id === statusControl.dataset.adminStatus);

  if (!order) {
    return;
  }

  if (statusControl.value === "Completa" || statusControl.value === "Lista para descargar") {
    validateAttendedOrder(order.id, statusControl.value);
    return;
  }

  order.status = statusControl.value;
  if (statusControl.value === "Agendada" && !order.scheduledAt) {
    order.scheduledAt = todayISO();
  }
  renderAdmin();
  renderDoctorOrders();
  renderResults(resultsSearch.value);
  showToast(`Estatus actualizado: ${order.patient} · ${order.status}.`);
});

runAgentButton?.addEventListener("click", () => runAgent());

sendStudiesButton?.addEventListener("click", () => {
  setAdminSection("results");
  sendReadyStudies();
});

focusNewDoctorButton?.addEventListener("click", () => {
  setAdminSection("doctors");
  adminDoctorForm?.scrollIntoView({ behavior: "smooth", block: "center" });
  adminDoctorForm?.querySelector('input[name="doctorName"]')?.focus();
});

adminSectionButtons.forEach((button) => {
  button.addEventListener("click", () => setAdminSection(button.dataset.adminSection));
});

adminDoctorForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  createDoctorFromAdmin(new FormData(adminDoctorForm));
});

studyGrid.addEventListener("change", (event) => {
  if (
    event.target.matches("[data-tomography-toggle]") ||
    event.target.matches('select[name="tomographyFov"]')
  ) {
    updateTomographyFields();
  }

  if (
    event.target.matches("[data-orthodontic-toggle]") ||
    event.target.matches('select[name="orthodonticStudyType"]') ||
    event.target.matches('select[name="orthodonticTomographyFov"]')
  ) {
    updateOrthodonticPackageFields();
  }
});

document.addEventListener("click", (event) => {
  const downloadOrderButton = event.target.closest("[data-download-order]");
  const downloadFileButton = event.target.closest("[data-download-file]");
  const orderButton = event.target.closest("[data-order-patient]");
  const agentOrderButton = event.target.closest("[data-agent-order]");
  const validateOrderButton = event.target.closest("[data-validate-order]");
  const adminNextButton = event.target.closest("[data-admin-next-order]");

  if (downloadOrderButton) {
    const order = orders.find(
      (currentOrder) =>
        currentOrder.doctorId === doctorProfile.id &&
        currentOrder.id === downloadOrderButton.dataset.downloadOrder,
    );

    if (order?.result) {
      openDownloadModal(order);
    } else {
      showToast("Este resultado aún no está listo.");
    }
  }

  if (downloadFileButton) {
    simulateDownload(downloadFileButton.dataset.downloadFile, downloadFileButton.dataset.downloadLabel);
  }

  if (orderButton) {
    const order = orders.find(
      (currentOrder) =>
        currentOrder.doctorId === doctorProfile.id &&
        currentOrder.patient === orderButton.dataset.orderPatient,
    );

    if (order) {
      openOrderModal(order);
    }
  }

  if (agentOrderButton) {
    runAgent(agentOrderButton.dataset.agentOrder);
  }

  if (validateOrderButton) {
    validateAttendedOrder(validateOrderButton.dataset.validateOrder);
  }

  if (adminNextButton) {
    runAdminNextStep(adminNextButton.dataset.adminNextOrder);
  }
});

closeOrderModalButton.addEventListener("click", closeOrderModal);

orderModal.addEventListener("click", (event) => {
  if (event.target === orderModal) {
    closeOrderModal();
  }
});

closeDownloadModalButton.addEventListener("click", closeDownloadModal);

downloadModal.addEventListener("click", (event) => {
  if (event.target === downloadModal) {
    closeDownloadModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !orderModal.hidden) {
    closeOrderModal();
  }

  if (event.key === "Escape" && !downloadModal.hidden) {
    closeDownloadModal();
  }
});

renderStudies();
renderProfile();
syncPhotoControls();
updateInternalClock();
setInterval(updateInternalClock, 60000);
setDefaultReferralDate();
renderDoctorOrders();
renderResults();

const savedSession = localStorage.getItem(SESSION_KEY);
if (savedSession) {
  const session = JSON.parse(savedSession);
  currentRole = session.role || getAccountRole(session.email);

  if (currentRole === "doctor") {
    applyDoctorProfile(findDoctorByEmail(session.email));
  }

  showApp(false, currentRole === "admin" ? "admin" : "dashboard");
} else {
  showLogin();
}
