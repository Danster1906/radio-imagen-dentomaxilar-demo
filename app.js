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

const downloadedOrders = new Set(
  JSON.parse(localStorage.getItem("ri_downloaded_orders") || "[]")
);

function persistDownloadedOrders() {
  localStorage.setItem("ri_downloaded_orders", JSON.stringify([...downloadedOrders]));
}

function markOrderDownloaded(orderId) {
  downloadedOrders.add(orderId);
  persistDownloadedOrders();
  fetch(`/api/mark-downloaded/${encodeURIComponent(orderId)}`, { method: "POST" }).catch(() => {});
}

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

const supabaseClient = null;
let currentAuthUser = null;
let currentProfile = null;
let partnerEvents = [];

async function apiLoadPartnerEvents() {
  try {
    const res = await fetch("/api/partner-events", { headers: { "x-admin-token": getAdminToken() } });
    if (!res.ok) return;
    const data = await res.json();
    partnerEvents = data.events || [];
  } catch (e) {
    console.error("apiLoadPartnerEvents:", e);
  }
}

async function apiLogPartnerEvent(email, orderId, delta, reason) {
  try {
    await fetch("/api/partner-events", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-token": getAdminToken() },
      body: JSON.stringify({ email, orderId, delta, reason })
    });
    const event = { email, orderId, delta, timestamp: new Date().toISOString(), reason };
    partnerEvents.push(event);
  } catch (e) {
    console.error("apiLogPartnerEvent:", e);
  }
}

async function apiLoadOrders() {
  try {
    const res = await fetch("/api/orders");
    if (!res.ok) return;
    const data = await res.json();
    setOrders(data.orders || []);
  } catch (e) {
    console.error("apiLoadOrders:", e);
  }
}

async function apiSaveOrder(order) {
  try {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order)
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Error al guardar la orden");
    }
  } catch (e) {
    throw e;
  }
}

async function apiUpdateOrder(orderId, changes) {
  try {
    const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changes)
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Error al actualizar la orden");
    }
  } catch (e) {
    throw e;
  }
}

async function apiLoadDoctors() {
  try {
    const res = await fetch("/api/doctors");
    if (!res.ok) return;
    const data = await res.json();
    for (const [email, doc] of Object.entries(data.doctors || {})) {
      doctorDirectory[email] = {
        ...doctorDirectory[email],
        ...doc,
        metrics: doctorDirectory[email]?.metrics || {
          activeOrders: "0", readyResults: "0 listas", monthlyPatients: "0",
          growth: "0%", pendingAppointments: "0", topStudy: "OPG",
          topStudyDetail: "Ortopantomografía", conversion: "0%",
        },
        metricsByPeriod: doctorDirectory[email]?.metricsByPeriod || {},
      };
    }
  } catch (e) {
    console.error("apiLoadDoctors:", e);
  }
}

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
const resultsTableDone = document.querySelector("#results-table-done");
const resultsTabButtons = document.querySelectorAll("[data-results-tab]");
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
const manualUploadForm = document.querySelector("#manual-upload-form");
const manualUploadOrder = document.querySelector("#manual-upload-order");
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
const partnerHistorySection = document.querySelector("[data-partner-history]");
const partnerHistoryList = document.querySelector("[data-partner-history-list]");
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

function setOrders(nextOrders) {
  orders.splice(0, orders.length, ...nextOrders);
}

function getStudyBySelection(selection) {
  const normalizedSelection = selection.toLowerCase();
  return (
    studies.find((study) => study.name === selection) ||
    studies.find((study) => normalizedSelection.startsWith(study.name.toLowerCase())) ||
    studies.find((study) => normalizedSelection.includes(study.name.toLowerCase()))
  );
}

function mapDatabaseOrder(order) {
  const studyRows = order.order_studies || [];
  const doctorName = order.doctor_profiles?.display_name || order.doctor_name || "Doctor no asignado";
  const resultFiles = order.result_files || [];
  const hasResult = resultFiles.some((file) => ["cloud_ready", "ready", "uploaded"].includes(file.status));

  return {
    id: order.id,
    folio: order.folio,
    patient: order.patient_full_name,
    phone: order.patient_phone || "",
    doctor: doctorName,
    owner: "supabase",
    doctorId: order.doctor_id,
    studies: studyRows.length ? studyRows.map((study) => study.study_name) : ["Estudio sin detalle"],
    status: order.status,
    date: order.referral_date,
    result: hasResult ? resultFiles[0]?.display_name || "Resultado disponible" : "",
    notes: order.clinical_notes || "",
    countsForPartner: Boolean(order.counts_for_partner),
    scheduledAt: order.scheduled_at?.slice(0, 10),
    completedAt: order.completed_at?.slice(0, 10),
    validatedAt: order.patient_attended_at?.slice(0, 10),
    validatedBy: order.validated_by ? "Admin Radio Imagen" : "",
    resultFiles,
  };
}

function buildMetricsFromOrders(doctorId) {
  const doctorOrders = orders.filter((order) => order.doctorId === doctorId);
  const today = todayISO();
  const activeOrders = doctorOrders.filter((order) => !["Cancelada", "Lista para descargar"].includes(order.status)).length;
  const readyResults = doctorOrders.filter((order) => order.status === "Lista para descargar").length;
  const pendingAppointments = doctorOrders.filter((order) => order.status === "Recibida").length;
  const completedOrders = doctorOrders.filter((order) => ["Completa", "Lista para descargar"].includes(order.status)).length;
  const topStudy = doctorOrders.flatMap((order) => order.studies).reduce((counts, study) => {
    counts[study] = (counts[study] || 0) + 1;
    return counts;
  }, {});
  const topStudyName = Object.entries(topStudy).sort((a, b) => b[1] - a[1])[0]?.[0] || "OPG";
  const conversion = doctorOrders.length ? `${Math.round((completedOrders / doctorOrders.length) * 100)}%` : "0%";
  const base = {
    activeOrders: String(activeOrders),
    readyResults: `${readyResults} listas`,
    patientsLabel: "Pacientes",
    monthlyPatients: String(doctorOrders.length),
    growth: "Datos reales",
    pendingAppointments: String(pendingAppointments),
    topStudy: topStudyName.length > 16 ? getStudyAbbreviation(topStudyName) : topStudyName,
    topStudyDetail: topStudyName,
    conversion,
  };

  return {
    metrics: base,
    metricsByPeriod: {
      today: {
        ...base,
        patientsLabel: "Pacientes hoy",
        monthlyPatients: String(doctorOrders.filter((order) => order.date === today).length),
      },
      week: {
        ...base,
        patientsLabel: "Pacientes semana",
      },
      month: {
        ...base,
        patientsLabel: "Pacientes mes",
      },
      year: {
        ...base,
        patientsLabel: "Pacientes año",
      },
    },
  };
}

function getStudyAbbreviation(studyName) {
  if (studyName.toLowerCase().includes("ortopantom")) {
    return "OPG";
  }

  if (studyName.toLowerCase().includes("tomograf")) {
    return "CBCT";
  }

  if (studyName.toLowerCase().includes("ortod")) {
    return "EOC";
  }

  return studyName
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 5)
    .toUpperCase();
}

function mapDatabaseDoctor(doctor, profile, partnerStatus) {
  const partner = {
    referredPatients: partnerStatus?.referred_patients || 0,
    points: partnerStatus?.points || 0,
  };
  const metricsData = buildMetricsFromOrders(doctor.id);

  return {
    id: doctor.id,
    doctorCode: doctor.doctor_code,
    handle: slugifyDoctorName(doctor.display_name),
    name: doctor.display_name,
    specialty: doctor.specialty || "Especialidad por definir",
    clinic: doctor.clinic || "Consultorio independiente",
    contactPhone: doctor.contact_phone || profile?.phone || "",
    email: profile?.email || "",
    city: doctor.city || "Ciudad por definir",
    photo: doctor.profile_image_url || "",
    photoZoom: 1,
    photoX: 0,
    photoY: 0,
    partner,
    ...metricsData,
  };
}

async function loadOrdersFromSupabase(role) {
  if (!supabaseClient) {
    return;
  }

  let query = supabaseClient
    .from("orders")
    .select(
      "*, doctor_profiles(display_name, doctor_code, profile_id), order_studies(study_id, study_name, study_category, details), result_files(display_name, file_type, original_file_name, storage_path, status)",
    )
    .order("created_at", { ascending: false });

  if (role === "doctor" && doctorProfile.id) {
    query = query.eq("doctor_id", doctorProfile.id);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  setOrders((data || []).map(mapDatabaseOrder));
}

async function loadDoctorsFromSupabase() {
  if (!supabaseClient) {
    return;
  }

  const [{ data: doctors, error: doctorsError }, { data: profiles, error: profilesError }, { data: partnerStatuses, error: partnerError }] =
    await Promise.all([
      supabaseClient.from("doctor_profiles").select("*").order("doctor_code"),
      supabaseClient.from("profiles").select("*").eq("role", "doctor"),
      supabaseClient.from("doctor_partner_status").select("*"),
    ]);

  if (doctorsError || profilesError || partnerError) {
    throw doctorsError || profilesError || partnerError;
  }

  Object.keys(doctorDirectory).forEach((email) => delete doctorDirectory[email]);
  (doctors || []).forEach((doctor) => {
    const profile = (profiles || []).find((item) => item.id === doctor.profile_id);
    const partnerStatus = (partnerStatuses || []).find((item) => item.doctor_id === doctor.id);
    const mappedDoctor = mapDatabaseDoctor(doctor, profile, partnerStatus);
    doctorDirectory[mappedDoctor.email] = mappedDoctor;
  });
}

async function loadAuthenticatedContext(user) {
  currentAuthUser = user;
  const { data: profile, error: profileError } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    throw profileError || new Error("Cuenta sin perfil operativo.");
  }

  currentProfile = profile;
  currentRole = profile.role;

  if (currentRole === "admin") {
    adminProfile.id = profile.id;
    adminProfile.name = profile.full_name;
    adminProfile.email = profile.email;
    await loadOrdersFromSupabase("admin");
    await loadDoctorsFromSupabase();
    return;
  }

  const { data: doctor, error: doctorError } = await supabaseClient
    .from("doctor_profiles")
    .select("*")
    .eq("profile_id", user.id)
    .single();

  if (doctorError || !doctor) {
    throw doctorError || new Error("Cuenta sin perfil de doctor.");
  }

  doctorProfile.id = doctor.id;
  doctorProfile.doctorCode = doctor.doctor_code;
  await loadOrdersFromSupabase("doctor");

  const { data: partnerStatus } = await supabaseClient
    .from("doctor_partner_status")
    .select("*")
    .eq("doctor_id", doctor.id)
    .maybeSingle();
  const mappedDoctor = mapDatabaseDoctor(doctor, profile, partnerStatus);
  doctorDirectory[mappedDoctor.email] = mappedDoctor;
  applyDoctorProfile(mappedDoctor);
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
  doctorProfile.doctorCode = profile.doctorCode || profile.id;
  doctorProfile.handle = profile.handle;
  doctorProfile.name = profile.name;
  doctorProfile.specialty = profile.specialty;
  doctorProfile.clinic = profile.clinic;
  doctorProfile.contactPhone = profile.contactPhone;
  doctorProfile.email = profile.email;
  doctorProfile.city = profile.city;
  doctorProfile.photo = profile.photo || doctorProfile.photo || "";
  doctorProfile.photoZoom = profile.photoZoom || doctorProfile.photoZoom || 1;
  doctorProfile.photoX = profile.photoX || doctorProfile.photoX || 0;
  doctorProfile.photoY = profile.photoY || doctorProfile.photoY || 0;
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

  const validatedOrders = orders
    .filter((o) => o.doctorId === doctorProfile.id && o.countsForPartner)
    .sort((a, b) => (b.validatedAt || "").localeCompare(a.validatedAt || ""));

  if (partnerHistorySection) {
    partnerHistorySection.style.display = validatedOrders.length ? "" : "none";
  }

  if (partnerHistoryList) {
    partnerHistoryList.innerHTML = validatedOrders
      .map(
        (o) => `
          <li class="partner-history-row">
            <span class="partner-history-patient">${o.patient}</span>
            <span class="partner-history-meta">${o.validatedAt || ""}</span>
            <span class="partner-history-pts">+${POINTS_PER_REFERRED_PATIENT} pts</span>
          </li>
        `,
      )
      .join("");
  }
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

async function updateOrderStatusInSupabase(order, nextStatus) {
  const now = new Date().toISOString();
  const payload = {
    status: nextStatus,
    updated_at: now,
  };

  if (nextStatus === "Agendada") {
    payload.scheduled_at = order.scheduledAt ? undefined : now;
    payload.scheduled_by = currentAuthUser?.id || null;
  }

  if (nextStatus === "Completa" || nextStatus === "Lista para descargar") {
    payload.completed_at = order.completedAt ? undefined : now;
    payload.patient_attended_at = order.validatedAt ? undefined : now;
    payload.validated_by = currentAuthUser?.id || null;
    payload.counts_for_partner = true;
  }

  if (nextStatus === "Lista para descargar") {
    payload.result_ready_at = now;
  }

  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined) {
      delete payload[key];
    }
  });

  const { error } = await supabaseClient.from("orders").update(payload).eq("id", order.id);

  if (error) {
    throw error;
  }

  await supabaseClient.from("order_status_events").insert({
    order_id: order.id,
    previous_status: order.status,
    new_status: nextStatus,
    changed_by: currentAuthUser?.id || null,
    notes: "Cambio desde panel admin",
  });

  if ((nextStatus === "Completa" || nextStatus === "Lista para descargar") && !order.countsForPartner) {
    const { data: partnerStatus } = await supabaseClient
      .from("doctor_partner_status")
      .select("*")
      .eq("doctor_id", order.doctorId)
      .maybeSingle();
    const nextReferrals = (partnerStatus?.referred_patients || 0) + 1;
    const nextPoints = (partnerStatus?.points || 0) + POINTS_PER_REFERRED_PATIENT;
    const nextTier = getPartnerTier(nextReferrals);

    await supabaseClient
      .from("doctor_partner_status")
      .update({
        referred_patients: nextReferrals,
        points: nextPoints,
        current_tier_id: nextTier.shortName === "Inicio" ? null : nextTier.shortName.toLowerCase(),
        updated_at: now,
      })
      .eq("doctor_id", order.doctorId);

    await supabaseClient.from("partner_point_events").insert({
      doctor_id: order.doctorId,
      order_id: order.id,
      event_type: "paciente_validado",
      points: POINTS_PER_REFERRED_PATIENT,
      notes: `Paciente validado desde admin: ${order.patient}`,
    });
  }

  await loadOrdersFromSupabase(currentRole);

  if (currentRole === "admin") {
    await loadDoctorsFromSupabase();
  }
}

async function runAdminNextStep(orderId) {
  const order = orders.find((currentOrder) => currentOrder.id === orderId);

  if (!order) {
    return;
  }

  if (order.status === "Recibida") {
    if (supabaseClient && currentAuthUser) {
      await updateOrderStatusInSupabase(order, "Agendada");
    } else {
      order.status = "Agendada";
      order.scheduledAt = todayISO();
      await apiUpdateOrder(order.id, { status: order.status, scheduledAt: order.scheduledAt });
    }
    renderAdmin();
    renderDoctorOrders();
    renderResults(resultsSearch.value);
    showToast(`${order.patient} marcado como Agendada.`);
    return;
  }

  if (order.status === "Agendada") {
    await validateAttendedOrder(order.id, "Completa");
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

async function reverseOrderValidation(order) {
  const doctor = getDoctorById(order.doctorId);

  order.countsForPartner = false;
  order.validatedAt = null;
  order.validatedBy = null;

  if (doctor) {
    doctor.partner.referredPatients = Math.max(0, doctor.partner.referredPatients - 1);
    doctor.partner.points = Math.max(0, doctor.partner.points - POINTS_PER_REFERRED_PATIENT);

    if (doctorProfile && doctorProfile.id === doctor.id) {
      doctorProfile.partner = { ...doctor.partner };
    }

    try {
      await fetch(`/api/doctors/${encodeURIComponent(doctor.email)}/partner`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-token": getAdminToken() },
        body: JSON.stringify({ referredPatients: doctor.partner.referredPatients, points: doctor.partner.points })
      });
      await apiLogPartnerEvent(doctor.email, order.id, -POINTS_PER_REFERRED_PATIENT, "reversal");
    } catch (e) {
      console.error("Error al revertir puntos del doctor:", e);
    }
  }
}

async function validateAttendedOrder(orderId, nextStatus = "Completa") {
  const order = orders.find((currentOrder) => currentOrder.id === orderId);

  if (!order) {
    return;
  }

  if (supabaseClient && currentAuthUser) {
    try {
      await updateOrderStatusInSupabase(order, nextStatus);
      renderAdmin();
      renderPartnerProgram();
      renderDoctorOrders();
      renderResults(resultsSearch.value);
      showToast(`Paciente actualizado: ${order.patient} · ${nextStatus}.`);
      return;
    } catch (error) {
      console.error(error);
      showToast("No se pudo actualizar la orden en Supabase.");
      return;
    }
  }

  if (order.countsForPartner) {
    order.status = nextStatus;
    await apiUpdateOrder(order.id, { status: order.status });
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

    try {
      await fetch(`/api/doctors/${encodeURIComponent(doctor.email)}/partner`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-token": getAdminToken() },
        body: JSON.stringify({ referredPatients: doctor.partner.referredPatients, points: doctor.partner.points })
      });
      await apiLogPartnerEvent(doctor.email, order.id, POINTS_PER_REFERRED_PATIENT, "validation");
    } catch (e) {
      console.error("Error al persistir puntos del doctor:", e);
    }
  }

  await apiUpdateOrder(order.id, {
    status: order.status,
    result: order.result || undefined,
    countsForPartner: order.countsForPartner,
    validatedAt: order.validatedAt,
    validatedBy: order.validatedBy,
    completedAt: order.completedAt
  });

  renderAdmin();
  renderPartnerProgram();
  renderDoctorOrders();
  renderResults(resultsSearch.value);
  showToast(`Paciente completado: ${order.patient}. Se sumaron ${POINTS_PER_REFERRED_PATIENT} pts.`);
}

async function createDoctorFromAdmin(formData) {
  const email = formData.get("doctorEmail").trim().toLowerCase();
  const name = formData.get("doctorName").trim();
  const password = formData.get("doctorPassword").trim();
  const validatedPatients = Math.max(Number(formData.get("validatedPatients")) || 0, 0);

  if (!email || !name || !password) {
    showToast("Nombre, correo y contraseña son obligatorios.");
    return;
  }

  try {
    const res = await fetch("/api/doctors", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-token": getAdminToken() },
      body: JSON.stringify({
        email,
        name,
        password,
        specialty: formData.get("doctorSpecialty").trim() || "Especialidad por definir",
        clinic: formData.get("doctorClinic").trim() || "Consultorio independiente",
        contactPhone: formData.get("doctorPhone").trim(),
        city: formData.get("doctorCity").trim() || "Ciudad por definir",
        validatedPatients,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      showToast(data.error || "No se pudo crear el doctor.");
      return;
    }

    const doc = data.doctor;
    doctorDirectory[email] = {
      ...doc,
      metrics: buildDefaultMetrics(validatedPatients),
      metricsByPeriod: buildMetricsByPeriod(validatedPatients),
    };

    renderAdmin();
    adminDoctorForm.reset();
    adminDoctorForm.querySelectorAll("input").forEach((input) => {
      input.value = input.name === "validatedPatients" ? "0" : "";
    });
    showToast(`${name} creado como ${doc.id}. Contraseña guardada.`);
  } catch (e) {
    console.error(e);
    showToast("Error de conexión al crear doctor.");
  }
}

function generateRandomPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!#$%";
  const values = new Uint32Array(14);
  crypto.getRandomValues(values);
  return Array.from(values, (v) => chars[v % chars.length]).join("");
}

async function deleteDoctorFromAdmin(email) {
  if (!confirm(`¿Eliminar al doctor ${email}?`)) return;
  try {
    const res = await fetch(`/api/doctors/${encodeURIComponent(email)}`, { method: "DELETE", headers: { "x-admin-token": getAdminToken() } });
    if (!res.ok) { showToast("No se pudo eliminar el doctor."); return; }
    delete doctorDirectory[email];
    renderAdmin();
    showToast("Doctor eliminado.");
  } catch (e) {
    showToast("Error de conexión al eliminar doctor.");
  }
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

function getAdminToken() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "{}");
    return session.adminToken || "";
  } catch { return ""; }
}

async function loginAccount(email, password) {
  const normalizedEmail = email.toLowerCase();

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: normalizedEmail, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      showToast(data.error || "Correo o contraseña incorrectos.");
      return;
    }

    const role = data.role;
    currentRole = role;

    if (role === "doctor" && data.doctor) {
      doctorDirectory[normalizedEmail] = {
        ...doctorDirectory[normalizedEmail],
        ...data.doctor,
        metrics: doctorDirectory[normalizedEmail]?.metrics || {
          activeOrders: "0", readyResults: "0 listas", monthlyPatients: "0",
          growth: "0%", pendingAppointments: "0", topStudy: "OPG",
          topStudyDetail: "Ortopantomografía", conversion: "0%",
        },
        metricsByPeriod: doctorDirectory[normalizedEmail]?.metricsByPeriod || {},
      };
      applyDoctorProfile(findDoctorByEmail(normalizedEmail));
    }

    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        email: normalizedEmail,
        provider: "local",
        role,
        adminToken: role === "admin" ? (data.adminToken || "") : undefined,
        accountId: role === "admin" ? adminProfile.id : doctorProfile.id,
        handle: role === "admin" ? adminProfile.handle : doctorProfile.handle,
        signedInAt: new Date().toISOString(),
      }),
    );
    if (role === "admin") {
      await apiLoadPartnerEvents();
    }
    showApp(true, role === "admin" ? "admin" : "dashboard");
    showToast(role === "admin" ? "Sesión admin iniciada." : "Sesión iniciada.");
  } catch (e) {
    console.error(e);
    showToast("No se pudo conectar al servidor. Intenta de nuevo.");
  }
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
  const myOrders = orders.filter(
    (order) => order.doctorId === doctorProfile.id && order.patient.toLowerCase().includes(normalizedFilter),
  );

  const activeOrders = myOrders.filter((o) => !downloadedOrders.has(o.id));
  const doneOrders = myOrders.filter((o) => downloadedOrders.has(o.id));

  const activeTab = document.querySelector("[data-results-tab].active")?.dataset.resultsTab || "active";

  const buildRow = (order, isDone) => `
    <article class="result-row ${isDone ? "result-row--done" : ""}">
      <div class="result-name">
        <strong>${order.patient}</strong>
        <span class="result-meta">${order.studies.join(", ")}</span>
      </div>
      <span class="result-meta">${order.doctor}</span>
      ${isDone
        ? `<span class="status lista">Descargado</span>
           <button class="download-action" type="button" disabled>Entregado</button>`
        : `<span class="status ${statusClass(order.status)}">${order.status}</span>
           <button class="download-action ${order.result ? "ready" : ""}" data-download-order="${order.id}" type="button" ${order.result ? "" : "disabled"}>
             ${order.result ? "Descargar" : "Pendiente"}
           </button>`
      }
    </article>
  `;

  if (resultsTable) {
    resultsTable.innerHTML = activeOrders.length
      ? activeOrders.map((o) => buildRow(o, false)).join("")
      : `<p class="empty-state-hint">No hay estudios activos.</p>`;
  }

  if (resultsTableDone) {
    resultsTableDone.innerHTML = doneOrders.length
      ? doneOrders.map((o) => buildRow(o, true)).join("")
      : `<p class="empty-state-hint">Aún no has descargado ningún estudio.</p>`;
  }

  resultsTabButtons.forEach((btn) => {
    const count = btn.dataset.resultsTab === "done" ? doneOrders.length : activeOrders.length;
    btn.textContent = btn.dataset.resultsTab === "done"
      ? `Terminadas${doneOrders.length ? ` (${doneOrders.length})` : ""}`
      : `Activas${activeOrders.length ? ` (${activeOrders.length})` : ""}`;
  });
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

async function openDownloadModal(order) {
  activeDownloadOrder = order;

  downloadPatientName.textContent = order.patient;
  downloadStudySummary.textContent = order.studies.join(", ");
  downloadFileList.innerHTML = '<p style="font-size:0.85rem;color:#888;padding:8px 0;">Cargando archivos…</p>';
  downloadModal.hidden = false;

  try {
    const res = await fetch(`/api/files/${encodeURIComponent(order.id)}`);
    const data = await res.json();
    const serverFiles = data.files || [];

    const localPkg = resultPackages[order.id];
    const allFiles = serverFiles.length > 0 ? serverFiles : (localPkg?.files || []);

    if (allFiles.length === 0) {
      downloadFileList.innerHTML = '<p style="font-size:0.85rem;color:#888;padding:8px 0;">No hay archivos disponibles para esta orden.</p>';
      downloadFullStudyButton.disabled = true;
      downloadFullStudyButton.textContent = "Sin archivos";
      return;
    }

    downloadFullStudyButton.disabled = false;
    downloadFullStudyButton.textContent = "Descargar todo";
    downloadFullStudyButton.dataset.downloadFile = allFiles[0].filename || allFiles[0].file || "";
    downloadFullStudyButton.dataset.downloadLabel = "estudio completo";

    downloadFileList.innerHTML = allFiles
      .map((file) => {
        const filename = file.filename || file.file || "";
        const label = file.label || filename;
        const ext = filename.includes(".") ? filename.split(".").pop().toUpperCase() : "ARCHIVO";
        return `
          <article class="download-file-card">
            <div>
              <strong>${label}</strong>
              <span>${ext} · ${filename}</span>
            </div>
            <button class="small-action" data-download-file="${filename}" data-download-label="${label}" type="button">
              Descargar
            </button>
          </article>
        `;
      })
      .join("");
  } catch {
    downloadFileList.innerHTML = '<p style="font-size:0.85rem;color:#e44;padding:8px 0;">Error al cargar archivos.</p>';
  }
}

function closeDownloadModal() {
  downloadModal.hidden = true;
  activeDownloadOrder = null;
}

function realDownload(orderId, filename, label = "archivo") {
  if (!orderId || !filename) {
    showToast("Archivo no disponible.");
    return;
  }
  const url = `/api/uploads/${encodeURIComponent(orderId)}/${encodeURIComponent(filename)}`;
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  markOrderDownloaded(orderId);

  setTimeout(() => {
    closeDownloadModal();
    renderResults(resultsSearch?.value || "");
    showToast("✓ Archivo descargado. La orden se movió a Terminadas.");
  }, 800);
}

function simulateDownload(file, label = "archivo") {
  const orderId = activeDownloadOrder?.id;
  if (orderId && file) {
    realDownload(orderId, file, label);
  } else {
    showToast("Archivo no disponible para descarga.");
  }
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
  renderManualUploadOptions();

  adminOrderTable.innerHTML = visibleOrders
    .map((order) => {
      const nextStep = getAdminNextStep(order);

      const rawPhone = order.phone || "";
      const digits = rawPhone.replace(/\D/g, "");
      const waNumber = digits.length === 10 ? `52${digits}` : digits.length === 12 && digits.startsWith("52") ? digits : digits;
      const waLink = waNumber ? `https://wa.me/${waNumber}` : "";

      return `
        <article class="admin-row" data-admin-order="${order.id}">
          <div>
            <strong>${order.patient}</strong>
            ${rawPhone ? `<span class="admin-patient-phone">
              <a href="${waLink}" target="_blank" rel="noopener" class="phone-wa-link" title="Abrir WhatsApp">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.103 1.523 5.824L0 24l6.356-1.498A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 0 1-5.001-1.367l-.358-.213-3.724.877.91-3.617-.234-.372A9.787 9.787 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
                ${rawPhone}
              </a>
              <a href="tel:${digits}" class="phone-call-link" title="Llamar">Llamar</a>
            </span>` : `<small class="no-phone-hint">Sin teléfono</small>`}
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
      const notificationsOn = doctor.notifications !== false;
      const doctorEvents = partnerEvents
        .filter((e) => e.email === doctor.email)
        .slice()
        .reverse();
      const historyId = `partner-history-${doctor.email.replace(/[^a-z0-9]/gi, "-")}`;
      const historyRows = doctorEvents.length
        ? doctorEvents.map((e) => {
            const date = new Date(e.timestamp).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
            const time = new Date(e.timestamp).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
            const sign = e.delta > 0 ? "+" : "";
            const reasonLabel = e.reason === "validation" ? "Validación" : e.reason === "reversal" ? "Reversión" : e.reason;
            return `<li style="display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-bottom:1px solid #f0f0f0;font-size:0.78rem;">
              <span style="color:#555;">${date} ${time} · ${reasonLabel}${e.orderId ? " · " + e.orderId : ""}</span>
              <strong style="color:${e.delta > 0 ? "#1a7a3a" : "#c0392b"};">${sign}${e.delta} pts</strong>
            </li>`;
          }).join("")
        : `<li style="font-size:0.78rem;color:#999;padding:4px 0;">Sin eventos registrados aún.</li>`;

      return `
        <article class="admin-doctor-card">
          <header>
            <strong>${doctor.name}</strong>
            <span class="admin-chip">${tier.shortName}</span>
          </header>
          <span>${doctor.specialty || "Sin especialidad"}</span>
          <small class="admin-credential-line">Correo: <strong>${doctor.email}</strong></small>
          <div class="admin-pw-row" style="display:flex;gap:6px;margin-top:8px;">
            <input class="admin-pw-input" type="text" placeholder="Nueva contraseña" data-pw-email="${doctor.email}"
              style="flex:1;font-size:0.8rem;padding:4px 8px;border:1px solid #ccc;border-radius:6px;" />
            <button class="small-action admin-generate-password" data-email="${doctor.email}" type="button">Generar</button>
            <button class="small-action admin-reset-password" data-email="${doctor.email}" type="button">Cambiar</button>
          </div>
          <div class="admin-notif-row" style="display:flex;align-items:center;gap:8px;margin-top:10px;">
            <label class="admin-notif-label" style="display:flex;align-items:center;gap:6px;font-size:0.8rem;cursor:pointer;">
              <input type="checkbox" class="admin-notif-toggle" data-email="${doctor.email}" ${notificationsOn ? "checked" : ""} style="width:16px;height:16px;cursor:pointer;" />
              Notificar por correo al subir resultados
            </label>
          </div>
          <small style="margin-top:4px;display:block;">${doctor.partner.referredPatients} pacientes validados · ${doctor.partner.points.toLocaleString("es-MX")} pts</small>
          <details style="margin-top:8px;">
            <summary style="cursor:pointer;font-size:0.8rem;color:var(--brand);user-select:none;">Historial de puntos (${doctorEvents.length})</summary>
            <ul id="${historyId}" style="list-style:none;margin:6px 0 0;padding:0;">
              ${historyRows}
            </ul>
          </details>
          <button class="ghost-action admin-delete-doctor" data-email="${doctor.email}" type="button" style="margin-top:8px;color:var(--brand);font-size:0.8rem;">Eliminar doctor</button>
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

function renderManualUploadOptions() {
  if (!manualUploadOrder) {
    return;
  }

  const currentValue = manualUploadOrder.value;
  const eligibleOrders = orders;

  if (eligibleOrders.length === 0) {
    manualUploadOrder.innerHTML = '<option value="">No hay órdenes registradas</option>';
    return;
  }

  manualUploadOrder.innerHTML = eligibleOrders
    .map((order) => {
      const studiesLabel = order.studies.join(", ");
      const label = `${order.patient} · ${studiesLabel} · ${order.status}`;
      return `<option value="${order.id}" ${order.id === currentValue ? "selected" : ""}>${label}</option>`;
    })
    .join("");
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

function upsertDownloadRequest(order, fileMatch, options = {}) {
  const existingRequest = adminDownloadRequests.find((request) => request.orderId === order.id);
  const payload = {
    orderId: order.id,
    patient: order.patient,
    doctor: order.doctor,
    file: fileMatch.file,
    status: options.status || "Subida inmediata",
    storage: options.storage || "upload_requested",
    expires: options.expires || "Supabase temporal: 60 min al solicitar descarga",
  };

  if (existingRequest) {
    Object.assign(existingRequest, payload);
    return;
  }

  adminDownloadRequests.unshift(payload);
}

async function assignResultToOrder(order, fileMatch, options = {}) {
  order.result = fileMatch.file;
  if (!order.countsForPartner) {
    await validateAttendedOrder(order.id, "Lista para descargar");
  } else {
    order.status = "Lista para descargar";
    await apiUpdateOrder(order.id, { status: order.status, result: order.result });
  }
  upsertDownloadRequest(order, fileMatch, options);
}

function upsertResultPackageFile(order, fileMatch) {
  const fileType = fileMatch.type || "ZIP";
  const fileLabel = fileMatch.label || "Archivo liberado por Radio Imagen";

  if (!resultPackages[order.id]) {
    resultPackages[order.id] = {
      complete: fileMatch.file,
      files: [],
    };
  }

  if (fileLabel === "Estudio completo") {
    resultPackages[order.id].complete = fileMatch.file;
  }

  const existingFile = resultPackages[order.id].files.find((file) => file.file === fileMatch.file);
  if (!existingFile) {
    resultPackages[order.id].files.unshift({
      label: fileLabel,
      type: fileType,
      file: fileMatch.file,
    });
  }
}

async function uploadManualResult(formData) {
  const orderId = formData.get("manualOrderId");
  const order = orders.find((currentOrder) => currentOrder.id === orderId);
  const file = formData.get("manualResultFile");
  const label = formData.get("manualFileType") || "Archivo";

  if (!order) { showToast("Selecciona una orden válida."); return; }
  if (!file || !file.name) { showToast("Selecciona el archivo del estudio."); return; }

  showToast("Subiendo archivo...");

  try {
    const uploadData = new FormData();
    uploadData.append("orderId", orderId);
    uploadData.append("doctorId", order.doctorId || "");
    uploadData.append("fileLabel", label);
    uploadData.append("patientName", order.patient || "");
    uploadData.append("studyType", order.studies ? order.studies.join(", ") : label);
    uploadData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: uploadData });
    const data = await res.json();
    if (!res.ok) { showToast(data.error || "Error al subir el archivo."); return; }

    const extension = file.name.includes(".") ? file.name.split(".").pop().toUpperCase() : "ARCHIVO";
    const fileMatch = {
      file: file.name, patient: order.patient, modality: label,
      status: "local_ready", confidence: 100, label, type: extension,
    };
    upsertResultPackageFile(order, fileMatch);
    await assignResultToOrder(order, fileMatch, {
      status: "Subido",
      storage: "local_server",
      expires: "Disponible para doctor · sin vencimiento",
    });
    agentState.uploads++;
    manualUploadForm.reset();
    renderAdmin();
    renderDoctorOrders();
    renderResults(resultsSearch.value);
    showToast(`✓ ${file.name} disponible para ${order.patient}.`);
  } catch (e) {
    console.error(e);
    showToast("Error de conexión al subir el archivo.");
  }
}

function matchLocalFileToOrder(order) {
  const normalizedPatient = normalizeName(order.patient);

  return localResultFiles.find((file) => {
    const filePatient = normalizeName(file.patient);
    const fileName = normalizeName(file.file);
    return filePatient === normalizedPatient || fileName.includes(normalizedPatient.replace(/\s+/g, " "));
  });
}

async function runAgent(orderId = null, options = {}) {
  const targetOrders = orders.filter((order) => !orderId || order.id === orderId);
  const matches = [];

  const promises = targetOrders.map(async (order) => {
    const fileMatch = matchLocalFileToOrder(order);

    if (!fileMatch) {
      return;
    }

    await assignResultToOrder(order, fileMatch);
    matches.push({
      patient: order.patient,
      file: fileMatch.file,
      confidence: fileMatch.confidence,
      action: "Resultado asignado y subida solicitada",
    });
  });
  await Promise.all(promises);

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
  doctorIdLabel.textContent = doctorProfile.doctorCode || doctorProfile.id;
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

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  await loginAccount(formData.get("loginEmail").trim(), formData.get("loginPassword"));
});

logoutButton.addEventListener("click", async () => {
  if (supabaseClient) {
    await supabaseClient.auth.signOut();
  }
  localStorage.removeItem(SESSION_KEY);
  currentAuthUser = null;
  currentProfile = null;
  showLogin();
  showToast("Sesión cerrada.");
});

async function createOrderInSupabase(formData, selectedStudies) {
  const folio = `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
  const { data: order, error: orderError } = await supabaseClient
    .from("orders")
    .insert({
      folio,
      doctor_id: doctorProfile.id,
      patient_full_name: formData.get("patientName").trim(),
      patient_birth_date: formData.get("birthDate"),
      patient_phone: formData.get("phone").trim() || null,
      referral_date: formData.get("referralDate") || todayISO(),
      clinical_notes: formData.get("notes").trim() || null,
      status: "Recibida",
    })
    .select()
    .single();

  if (orderError) {
    throw orderError;
  }

  const studyRows = selectedStudies.map((selection) => {
    const study = getStudyBySelection(selection);

    return {
      order_id: order.id,
      study_id: study?.id || null,
      study_name: selection,
      study_category: study?.category || "Estudio solicitado",
      details: {},
    };
  });

  const { error: studiesError } = await supabaseClient.from("order_studies").insert(studyRows);

  if (studiesError) {
    throw studiesError;
  }

  await loadOrdersFromSupabase(currentRole);
}

function validateOrderForm(formData) {
  const requiredFields = ["patientName", "birthDate", "phone", "referralDate"];
  let valid = true;
  requiredFields.forEach((name) => {
    const val = (formData.get(name) || "").trim();
    const errorEl = orderForm.querySelector(`[data-error="${name}"]`);
    const inputEl = orderForm.querySelector(`[name="${name}"]`);
    if (!val) {
      valid = false;
      if (errorEl) errorEl.classList.add("visible");
      if (inputEl) inputEl.classList.add("field-invalid");
    } else {
      if (errorEl) errorEl.classList.remove("visible");
      if (inputEl) inputEl.classList.remove("field-invalid");
    }
  });
  return valid;
}

orderForm.querySelectorAll("[data-error]").forEach((errorEl) => {
  const name = errorEl.dataset.error;
  const inputEl = orderForm.querySelector(`[name="${name}"]`);
  if (inputEl) {
    inputEl.addEventListener("input", () => {
      if (inputEl.value.trim()) {
        errorEl.classList.remove("visible");
        inputEl.classList.remove("field-invalid");
      }
    });
    inputEl.addEventListener("change", () => {
      if (inputEl.value.trim()) {
        errorEl.classList.remove("visible");
        inputEl.classList.remove("field-invalid");
      }
    });
  }
});

orderForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(orderForm);

  if (!validateOrderForm(formData)) {
    const firstInvalid = orderForm.querySelector(".field-invalid");
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  const selectedStudies = getSelectedStudiesWithDetails(formData);

  if (!selectedStudies) {
    return;
  }

  if (selectedStudies.length === 0) {
    showToast("Selecciona al menos un estudio para enviar la orden.");
    return;
  }

  if (supabaseClient && currentAuthUser) {
    try {
      await createOrderInSupabase(formData, selectedStudies);
    } catch (error) {
      console.error(error);
      showToast("No se pudo guardar la orden en Supabase. Revisa permisos o conexión.");
      return;
    }
  } else {
    const newOrder = {
      id: `ORD-${new Date().getFullYear()}-${String(orders.length + 1).padStart(4, "0")}`,
      patient: formData.get("patientName"),
      phone: formData.get("phone")?.trim() || "",
      doctor: doctorProfile.name,
      owner: "current-doctor",
      doctorId: doctorProfile.id,
      studies: selectedStudies,
      status: "Recibida",
      date: formData.get("referralDate") || todayISO(),
      result: "",
      notes: formData.get("notes").trim(),
      countsForPartner: false,
    };
    try {
      await apiSaveOrder(newOrder);
      await apiLoadOrders();
    } catch (e) {
      orders.unshift(newOrder);
      console.error("No se pudo persistir la orden:", e);
    }
  }

  orderForm.reset();
  setDefaultReferralDate();
  updateTomographyFields();
  updateOrthodonticPackageFields();
  renderAdmin();
  renderDoctorOrders();
  renderResults(resultsSearch.value);
  setView("dashboard");
  showToast("Orden enviada a Radio Imagen. Sumará puntos cuando el paciente sea atendido.");
});

profileForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(profileForm);

  doctorProfile.name = formData.get("doctorName").trim();
  doctorProfile.specialty = formData.get("specialty").trim();
  doctorProfile.clinic = formData.get("clinic").trim();
  doctorProfile.contactPhone = formData.get("contactPhone").trim();
  doctorProfile.email = formData.get("email").trim();
  doctorProfile.city = formData.get("city").trim();

  if (supabaseClient && currentAuthUser) {
    try {
      const [{ error: doctorError }, { error: profileError }] = await Promise.all([
        supabaseClient
          .from("doctor_profiles")
          .update({
            display_name: doctorProfile.name,
            specialty: doctorProfile.specialty || null,
            clinic: doctorProfile.clinic || null,
            contact_phone: doctorProfile.contactPhone || null,
            city: doctorProfile.city || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", doctorProfile.id),
        supabaseClient
          .from("profiles")
          .update({
            full_name: doctorProfile.name,
            phone: doctorProfile.contactPhone || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", currentAuthUser.id),
      ]);

      if (doctorError || profileError) {
        throw doctorError || profileError;
      }
    } catch (error) {
      console.error(error);
      showToast("No se pudo guardar el perfil en Supabase.");
      return;
    }
  }

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

resultsTabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    resultsTabButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const panel = btn.dataset.resultsTab;
    if (resultsTable) resultsTable.hidden = panel !== "active";
    if (resultsTableDone) resultsTableDone.hidden = panel !== "done";
  });
});

adminStatusFilter?.addEventListener("change", renderAdmin);

adminOrderTable?.addEventListener("change", async (event) => {
  const statusControl = event.target.closest("[data-admin-status]");

  if (!statusControl) {
    return;
  }

  const order = orders.find((currentOrder) => currentOrder.id === statusControl.dataset.adminStatus);

  if (!order) {
    return;
  }

  if (statusControl.value === "Completa" || statusControl.value === "Lista para descargar") {
    await validateAttendedOrder(order.id, statusControl.value);
    return;
  }

  if (supabaseClient && currentAuthUser) {
    try {
      await updateOrderStatusInSupabase(order, statusControl.value);
    } catch (error) {
      console.error(error);
      showToast("No se pudo actualizar la orden en Supabase.");
      renderAdmin();
      return;
    }
  } else {
    const wasValidated = order.countsForPartner;
    const nextStatus = statusControl.value;
    const isReversal = wasValidated && nextStatus !== "Completa" && nextStatus !== "Lista para descargar";

    order.status = nextStatus;
    if (nextStatus === "Agendada" && !order.scheduledAt) {
      order.scheduledAt = todayISO();
    }

    const orderChanges = { status: order.status, scheduledAt: order.scheduledAt };

    if (isReversal) {
      await reverseOrderValidation(order);
      orderChanges.countsForPartner = false;
      orderChanges.validatedAt = null;
      orderChanges.validatedBy = null;
    }

    await apiUpdateOrder(order.id, orderChanges);
  }
  renderAdmin();
  renderPartnerProgram();
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

manualUploadForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  uploadManualResult(new FormData(manualUploadForm));
});

adminDoctorForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  await createDoctorFromAdmin(new FormData(adminDoctorForm));
});

adminDoctorList?.addEventListener("click", async (event) => {
  const deleteBtn = event.target.closest(".admin-delete-doctor");
  if (deleteBtn) {
    await deleteDoctorFromAdmin(deleteBtn.dataset.email);
    return;
  }

  const generateBtn = event.target.closest(".admin-generate-password");
  if (generateBtn) {
    const input = adminDoctorList.querySelector(`.admin-pw-input[data-pw-email="${generateBtn.dataset.email}"]`);
    if (input) input.value = generateRandomPassword();
    return;
  }

  const resetBtn = event.target.closest(".admin-reset-password");
  if (resetBtn) {
    const email = resetBtn.dataset.email;
    const input = adminDoctorList.querySelector(`.admin-pw-input[data-pw-email="${email}"]`);
    const newPassword = input?.value?.trim();
    if (!newPassword) { showToast("Escribe la nueva contraseña primero."); return; }
    try {
      const res = await fetch(`/api/doctors/${encodeURIComponent(email)}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-token": getAdminToken() },
        body: JSON.stringify({ password: newPassword }),
      });
      if (!res.ok) { const d = await res.json(); showToast(d.error || "Error al cambiar contraseña."); return; }
      showToast(`✓ Contraseña de ${email} actualizada.`);
      input.value = "";
      renderAdmin();
    } catch { showToast("Error de conexión."); }
    return;
  }
});

adminDoctorList?.addEventListener("change", async (event) => {
  const toggle = event.target.closest(".admin-notif-toggle");
  if (!toggle) return;
  const email = toggle.dataset.email;
  const enabled = toggle.checked;
  try {
    const res = await fetch(`/api/doctors/${encodeURIComponent(email)}/notifications`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-token": getAdminToken() },
      body: JSON.stringify({ notifications: enabled }),
    });
    if (!res.ok) { showToast("Error al actualizar notificaciones."); toggle.checked = !enabled; return; }
    if (doctorDirectory[email]) doctorDirectory[email].notifications = enabled;
    showToast(enabled ? `✓ Notificaciones activadas para ${email}.` : `Notificaciones desactivadas para ${email}.`);
  } catch { showToast("Error de conexión."); toggle.checked = !enabled; }
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

document.addEventListener("click", async (event) => {
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
    await validateAttendedOrder(validateOrderButton.dataset.validateOrder);
  }

  if (adminNextButton) {
    await runAdminNextStep(adminNextButton.dataset.adminNextOrder);
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

async function initializePortal() {
  await apiLoadDoctors();
  await apiLoadOrders();

  const savedSession = localStorage.getItem(SESSION_KEY);
  if (savedSession) {
    try {
      const session = JSON.parse(savedSession);
      currentRole = session.role || getAccountRole(session.email);
      if (currentRole === "doctor") {
        applyDoctorProfile(findDoctorByEmail(session.email));
      }
      if (currentRole === "admin") {
        await apiLoadPartnerEvents();
      }
      showApp(false, currentRole === "admin" ? "admin" : "dashboard");
    } catch {
      localStorage.removeItem(SESSION_KEY);
      showLogin();
    }
  } else {
    showLogin();
  }
}

initializePortal();
