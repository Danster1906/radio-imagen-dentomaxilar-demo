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

const orders = [];

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

let deliveredFilesIndex = {};

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
      };
    }
  } catch (e) {
    console.error("apiLoadDoctors:", e);
  }
}

const doctorDirectory = {};

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
const adminDoctorForm = document.querySelector("#admin-doctor-form");
const focusNewDoctorButton = document.querySelector("#focus-new-doctor");
const adminSectionButtons = document.querySelectorAll("[data-admin-section]");
const adminSectionPanels = document.querySelectorAll("[data-admin-section-panel]");
const sendStudiesButton = document.querySelector("#send-studies-button");
const manualUploadForm = document.querySelector("#manual-upload-form");
const manualUploadOrder = document.querySelector("#manual-upload-order");
const uploadDropzone = document.querySelector("#upload-dropzone");
const uploadFileInput = document.querySelector("#upload-file-input");
const uploadQueueList = document.querySelector("#upload-queue");
const deliveredFilesList = document.querySelector("#delivered-files");
const orderForm = document.querySelector("#order-form");
const treatingDoctorSelect = document.querySelector("#treating-doctor-select");
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
  id: "",
  handle: "",
  name: "",
  specialty: "",
  clinic: "",
  contactPhone: "",
  email: "",
  city: "",
  photo: "",
  photoZoom: 1,
  photoX: 0,
  photoY: 0,
  metrics: {},
  metricsByPeriod: {},
  partner: { referredPatients: 0, points: 0 },
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

  if (viewId === "future") {
    loadPlusInterestState();
  }
}

async function loadPlusInterestState() {
  if (currentRole !== "doctor" || !doctorProfile.email) {
    return;
  }
  try {
    const res = await fetch(`/api/plus-interest/${encodeURIComponent(doctorProfile.email)}`);
    if (!res.ok) return;
    const data = await res.json();
    applyPlusInterestState(data.modules || []);
  } catch (e) {
    console.error("loadPlusInterestState:", e);
  }
}

function applyPlusInterestState(modules) {
  document.querySelectorAll("[data-plus-module]").forEach((button) => {
    const registered = modules.includes(button.dataset.plusModule);
    button.disabled = registered;
    button.textContent = registered ? "Interés registrado" : "Me interesa";
  });
}

let plusInterestData = [];

async function refreshPlusInterestAdmin() {
  try {
    const res = await fetch("/api/plus-interest", { headers: { "x-admin-token": getAdminToken() } });
    if (res.ok) {
      plusInterestData = (await res.json()).interests || [];
    }
  } catch (e) {
    console.error("refreshPlusInterestAdmin:", e);
  }
  renderPlusInterestSummary();
}

function renderPlusInterestSummary() {
  const node = document.querySelector("#plus-interest-summary");
  if (!node) {
    return;
  }
  if (!plusInterestData.length) {
    node.innerHTML = '<p class="admin-helper">Aún no hay doctores interesados. Los registros aparecerán aquí.</p>';
    return;
  }
  const labels = { agenda: "Agenda", finanzas: "Finanzas", kpis: "KPIs", coach: "Coach" };
  const counts = {};
  plusInterestData.forEach((interest) => {
    counts[interest.module] = (counts[interest.module] || 0) + 1;
  });
  node.innerHTML =
    Object.entries(labels)
      .map(
        ([key, label]) => `
          <div class="plus-interest-row">
            <span>${label}</span>
            <strong>${counts[key] || 0}</strong>
          </div>
        `,
      )
      .join("") + `<small>${plusInterestData.length} registro(s) en total</small>`;
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
  doctorProfile.metrics = profile.metrics || {};
  doctorProfile.metricsByPeriod = profile.metricsByPeriod || {};
  doctorProfile.partner = { referredPatients: 0, points: 0, ...profile.partner };
  doctorProfile.accountType = profile.accountType || "personal";
  if (Array.isArray(profile.clinicDoctors)) {
    doctorProfile.clinicDoctors = [...profile.clinicDoctors];
  } else if (doctorProfile.accountType !== "clinic") {
    doctorProfile.clinicDoctors = [];
  }
}

async function loadClinicRoster() {
  if (doctorProfile.accountType !== "clinic" || !doctorProfile.email) {
    return;
  }
  try {
    const res = await fetch(`/api/clinic-doctors/${encodeURIComponent(doctorProfile.email)}`);
    if (!res.ok) return;
    const data = await res.json();
    doctorProfile.clinicDoctors = data.doctors || [];
    renderTreatingDoctorField();
  } catch (e) {
    console.error("loadClinicRoster:", e);
  }
}

function renderTreatingDoctorField() {
  const clinicNodes = document.querySelectorAll("[data-clinic-only]");
  const isClinic = currentRole === "doctor" && doctorProfile.accountType === "clinic";

  if (!isClinic || !treatingDoctorSelect) {
    clinicNodes.forEach((node) => {
      node.hidden = true;
    });
    return;
  }

  const roster = doctorProfile.clinicDoctors || [];
  const current = treatingDoctorSelect.value;
  treatingDoctorSelect.innerHTML = [
    '<option value="">Seleccionar doctor</option>',
    ...roster.map((name) => `<option value="${name}">${name}</option>`),
    '<option value="__new__">+ Agregar nuevo doctor</option>',
  ].join("");
  if (roster.includes(current) || current === "__new__") {
    treatingDoctorSelect.value = current;
  } else if (!roster.length) {
    treatingDoctorSelect.value = "__new__";
  }

  clinicNodes.forEach((node) => {
    node.hidden = node.hasAttribute("data-new-treating") ? treatingDoctorSelect.value !== "__new__" : false;
  });
}

function getAccountRole(email) {
  return email.toLowerCase() === ADMIN_EMAIL ? "admin" : "doctor";
}

function findDoctorByEmail(email) {
  return doctorDirectory[email.toLowerCase()];
}

function renderMetrics() {
  if (doctorProfile.id) {
    const computed = buildMetricsFromOrders(doctorProfile.id);
    doctorProfile.metrics = computed.metrics;
    doctorProfile.metricsByPeriod = computed.metricsByPeriod;
  }
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
      label: "Subir archivos del estudio",
      action: "Subir resultado",
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

async function runAdminNextStep(orderId) {
  const order = orders.find((currentOrder) => currentOrder.id === orderId);

  if (!order) {
    return;
  }

  if (order.status === "Recibida") {
    order.status = "Agendada";
    order.scheduledAt = todayISO();
    await apiUpdateOrder(order.id, { status: order.status, scheduledAt: order.scheduledAt });
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
    setAdminSection("results");
    renderManualUploadOptions();
    if (manualUploadOrder) {
      manualUploadOrder.value = order.id;
    }
    showToast(`Sube los archivos del estudio de ${order.patient}.`);
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
        accountType: formData.get("accountType") === "clinic" ? "clinic" : "personal",
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
    doctorDirectory[email] = { ...doc };

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
  renderTreatingDoctorField();
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
      };
      applyDoctorProfile(doctorDirectory[normalizedEmail]);
      loadClinicRoster();
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
      refreshDeliveredFiles();
      refreshPlusInterestAdmin();
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
            ${
              order.treatingDoctor && order.treatingDoctor !== order.doctor
                ? `<span class="order-meta">Atiende: ${order.treatingDoctor}</span>`
                : ""
            }
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
      <span class="result-meta">${order.treatingDoctor || order.doctor}</span>
      ${isDone
        ? `<span class="status lista">Descargado</span>
           <button class="download-action" data-download-order="${order.id}" type="button">Ver archivos</button>`
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

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B";
  }
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
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
    const allFiles = data.files || [];

    if (allFiles.length === 0) {
      downloadFileList.innerHTML = '<p style="font-size:0.85rem;color:#888;padding:8px 0;">No hay archivos disponibles para esta orden.</p>';
      downloadFullStudyButton.disabled = true;
      downloadFullStudyButton.textContent = "Sin archivos";
      return;
    }

    const pendingFiles = allFiles.filter((file) => !file.deleted && !file.downloaded);
    downloadFullStudyButton.disabled = pendingFiles.length === 0;
    downloadFullStudyButton.textContent = pendingFiles.length ? "Descargar todo" : "Sin descargas pendientes";
    downloadFullStudyButton.dataset.downloadFile = pendingFiles[0]?.filename || "";
    downloadFullStudyButton.dataset.downloadLabel = "estudio completo";

    downloadFileList.innerHTML = allFiles
      .map((file) => {
        const filename = file.filename || "";
        const label = file.label || filename;
        const ext = filename.includes(".") ? filename.split(".").pop().toUpperCase() : "ARCHIVO";
        const sizeLabel = file.size ? ` · ${formatBytes(file.size)}` : "";
        const isGone = file.deleted || file.downloaded;
        const statusLine = isGone
          ? file.resendRequested
            ? '<small class="download-file-status">Reenvío solicitado — Radio Imagen lo subirá de nuevo</small>'
            : '<small class="download-file-status">Descargado y eliminado de nuestros servidores</small>'
          : '<small class="download-file-status">Descarga única: el archivo se elimina al completarse</small>';
        const action = isGone
          ? file.resendRequested
            ? '<button class="small-action" type="button" disabled>Solicitado</button>'
            : `<button class="small-action" data-request-resend="${filename}" type="button">Solicitar reenvío</button>`
          : `<button class="small-action" data-download-file="${filename}" data-download-label="${label}" type="button">Descargar</button>`;
        return `
          <article class="download-file-card">
            <div>
              <strong>${label}</strong>
              <span>${ext} · ${filename}${sizeLabel}</span>
              ${statusLine}
            </div>
            ${action}
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
    showToast("✓ Descarga iniciada. El archivo se eliminará de nuestros servidores al completarse.");
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
  if (!adminOrderTable || !adminDoctorList) {
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
          <span>${order.doctor}${
            order.treatingDoctor && order.treatingDoctor !== order.doctor
              ? `<br /><small class="treating-doctor-label">Atiende: ${order.treatingDoctor}</small>`
              : ""
          }</span>
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
            <span class="admin-chip">${doctor.accountType === "clinic" ? "Clínica" : "Personal"}</span>
            <span class="admin-chip">${tier.shortName}</span>
          </header>
          <span>${doctor.specialty || "Sin especialidad"}</span>
          <small class="admin-credential-line">Correo: <strong>${doctor.email}</strong></small>
          <div class="admin-pw-row" style="display:flex;gap:6px;margin-top:8px;">
            <input class="admin-pw-input" type="text" placeholder="Nueva contraseña" data-pw-email="${doctor.email}"
              style="flex:1;font-size:0.8rem;padding:4px 8px;border:1px solid #ccc;border-radius:6px;" />
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

  renderDeliveredFiles();
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

function countPendingDeliveries() {
  let pending = 0;
  for (const entry of Object.values(deliveredFilesIndex)) {
    for (const file of entry.files || []) {
      if (!file.deleted && !file.downloaded) {
        pending += 1;
      }
    }
  }
  return pending;
}

async function refreshDeliveredFiles() {
  try {
    const res = await fetch("/api/files-index");
    if (res.ok) {
      deliveredFilesIndex = (await res.json()) || {};
    }
  } catch (e) {
    console.error("refreshDeliveredFiles:", e);
  }
  renderDeliveredFiles();
}

function renderDeliveredFiles() {
  const metricNode = document.querySelector('[data-admin-metric="downloadRequests"]');
  if (metricNode) {
    metricNode.textContent = countPendingDeliveries();
  }

  if (!deliveredFilesList) {
    return;
  }

  const entries = Object.entries(deliveredFilesIndex).flatMap(([orderId, entry]) =>
    (entry.files || []).map((file) => ({ orderId, file })),
  );

  if (!entries.length) {
    deliveredFilesList.innerHTML = '<p class="admin-helper">Aún no hay archivos subidos.</p>';
    return;
  }

  entries.sort((a, b) => (b.file.uploadedAt || "").localeCompare(a.file.uploadedAt || ""));

  deliveredFilesList.innerHTML = entries
    .map(({ orderId, file }) => {
      const order = orders.find((currentOrder) => currentOrder.id === orderId);
      const patient = order?.patient || orderId;
      const chip = file.resendRequested
        ? '<span class="admin-chip chip-resend">Reenvío solicitado</span>'
        : file.deleted || file.downloaded
          ? '<span class="admin-chip">Descargado y eliminado</span>'
          : '<span class="admin-chip chip-pending">Pendiente de descarga</span>';
      const when = file.downloadedAt || file.uploadedAt || "";
      const canDelete = !file.deleted && !file.downloaded && file.storagePrefix;
      return `
        <article class="download-card">
          <header>
            <strong>${patient}</strong>
            ${chip}
          </header>
          <span>${file.label || "Archivo"} · ${file.filename}</span>
          <small>${file.size ? `${formatBytes(file.size)} · ` : ""}${when ? new Date(when).toLocaleString("es-MX") : ""}</small>
          ${canDelete ? `<button class="ghost-action admin-delete-file" data-order-id="${orderId}" data-filename="${file.filename}" type="button">Eliminar del almacenamiento</button>` : ""}
        </article>
      `;
    })
    .join("");
}

async function assignResultToOrder(order, resultFilename) {
  order.result = resultFilename;
  if (!order.countsForPartner) {
    await validateAttendedOrder(order.id, "Lista para descargar");
  } else {
    order.status = "Lista para descargar";
    await apiUpdateOrder(order.id, { status: order.status, result: order.result });
  }
}

const UPLOAD_MAX_SIZE = 2 * 1024 * 1024 * 1024;
const UPLOAD_EXTENSIONS = [".pdf", ".zip", ".dcm", ".stl", ".ply", ".obj", ".png", ".jpg", ".jpeg"];
const uploadQueue = [];
let uploadItemCounter = 0;
let uploadingNow = false;

function renderUploadQueue() {
  if (!uploadQueueList) {
    return;
  }
  uploadQueueList.innerHTML = uploadQueue
    .map(
      (item) => `
        <article class="upload-item upload-item--${item.status}" data-upload-item="${item.id}">
          <div class="upload-item-info">
            <strong>${item.file.name}</strong>
            <span>${formatBytes(item.file.size)} · ${item.order.patient}</span>
            <small class="upload-item-status">${item.statusText}</small>
          </div>
          <div class="upload-item-progress">
            <div class="upload-item-bar" style="width:${Math.round(item.progress * 100)}%"></div>
          </div>
          ${
            item.status === "waiting" || item.status === "uploading"
              ? `<button class="small-action upload-cancel" data-upload-cancel="${item.id}" type="button">Cancelar</button>`
              : ""
          }
        </article>
      `,
    )
    .join("");
}

function updateUploadItemProgress(item) {
  const node = uploadQueueList?.querySelector(`[data-upload-item="${item.id}"]`);
  if (!node) {
    return;
  }
  node.querySelector(".upload-item-bar").style.width = `${Math.round(item.progress * 100)}%`;
  node.querySelector(".upload-item-status").textContent = item.statusText;
}

async function uploadFileInChunks(item) {
  const { order, file, label } = item;
  const token = getAdminToken();

  const startRes = await fetch("/api/upload/start", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-admin-token": token },
    body: JSON.stringify({
      orderId: order.id,
      doctorId: order.doctorId || "",
      filename: file.name,
      size: file.size,
      label,
      patientName: order.patient || "",
      studyType: order.studies ? order.studies.join(", ") : label,
    }),
  });
  const startData = await startRes.json();
  if (!startRes.ok) {
    throw new Error(startData.error || "No se pudo iniciar la subida");
  }
  item.uploadId = startData.uploadId;
  const { partSize, totalParts } = startData;

  const putPart = (index) =>
    new Promise((resolvePart, rejectPart) => {
      const blob = file.slice(index * partSize, Math.min((index + 1) * partSize, file.size));
      const xhr = new XMLHttpRequest();
      item.xhr = xhr;
      xhr.open("PUT", `/api/upload/part/${item.uploadId}/${index}`);
      xhr.setRequestHeader("x-admin-token", token);
      xhr.setRequestHeader("Content-Type", "application/octet-stream");
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          item.progress = Math.min((index * partSize + event.loaded) / file.size, 1);
          item.statusText = `Subiendo fragmento ${index + 1} de ${totalParts} · ${Math.round(item.progress * 100)}%`;
          updateUploadItemProgress(item);
        }
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolvePart();
        } else {
          rejectPart(new Error(`Fragmento ${index + 1}: HTTP ${xhr.status}`));
        }
      };
      xhr.onerror = () => rejectPart(new Error(`Fragmento ${index + 1}: error de red`));
      xhr.onabort = () => rejectPart(new Error("cancelado"));
      xhr.send(blob);
    });

  const uploadPart = async (index) => {
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      if (item.cancelled) {
        throw new Error("cancelado");
      }
      try {
        await putPart(index);
        return;
      } catch (err) {
        if (item.cancelled || err.message === "cancelado" || attempt === 3) {
          throw err;
        }
        item.statusText = `Reintentando fragmento ${index + 1} (intento ${attempt + 1} de 3)…`;
        updateUploadItemProgress(item);
        await new Promise((wait) => setTimeout(wait, attempt * 3000));
      }
    }
  };

  for (let i = 0; i < totalParts; i += 1) {
    await uploadPart(i);
  }

  const complete = () =>
    fetch("/api/upload/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ uploadId: item.uploadId }),
    });

  let completeRes = await complete();
  let completeData = await completeRes.json();
  if (completeRes.status === 409 && Array.isArray(completeData.missing)) {
    for (const index of completeData.missing) {
      await uploadPart(index);
    }
    completeRes = await complete();
    completeData = await completeRes.json();
  }
  if (!completeRes.ok) {
    throw new Error(completeData.error || "No se pudo completar la subida");
  }
  return completeData.file;
}

async function processUploadQueue() {
  if (uploadingNow) {
    return;
  }
  const item = uploadQueue.find((entry) => entry.status === "waiting");
  if (!item) {
    return;
  }
  uploadingNow = true;
  item.status = "uploading";
  item.statusText = "Iniciando subida…";
  renderUploadQueue();

  try {
    await uploadFileInChunks(item);
    item.status = "done";
    item.progress = 1;
    item.statusText = "✓ Subido y notificado al doctor";
    await assignResultToOrder(item.order, item.file.name);
    showToast(`✓ ${item.file.name} disponible para ${item.order.patient}.`);
  } catch (err) {
    if (item.cancelled || err.message === "cancelado") {
      item.status = "cancelled";
      item.statusText = "Cancelado";
      if (item.uploadId) {
        fetch("/api/upload/abort", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-admin-token": getAdminToken() },
          body: JSON.stringify({ uploadId: item.uploadId }),
        }).catch(() => {});
      }
    } else {
      console.error(err);
      item.status = "error";
      item.statusText = `Error: ${err.message}`;
      showToast(`No se pudo subir ${item.file.name}.`);
    }
  }

  uploadingNow = false;
  renderUploadQueue();
  renderAdmin();
  renderDoctorOrders();
  renderResults(resultsSearch.value);
  refreshDeliveredFiles();
  processUploadQueue();
}

function enqueueUploads(fileList) {
  const orderId = manualUploadOrder?.value;
  const order = orders.find((currentOrder) => currentOrder.id === orderId);
  if (!order) {
    showToast("Selecciona primero la orden del paciente.");
    return;
  }
  const label = manualUploadForm?.querySelector('[name="manualFileType"]')?.value || "Archivo";

  for (const file of fileList) {
    const dot = file.name.lastIndexOf(".");
    const ext = dot === -1 ? "" : file.name.slice(dot).toLowerCase();
    if (!UPLOAD_EXTENSIONS.includes(ext)) {
      showToast(`Formato no permitido: ${file.name}`);
      continue;
    }
    if (file.size > UPLOAD_MAX_SIZE) {
      showToast(`${file.name} excede el máximo de 2 GB.`);
      continue;
    }
    uploadItemCounter += 1;
    uploadQueue.push({
      id: uploadItemCounter,
      order,
      file,
      label,
      status: "waiting",
      statusText: "En cola…",
      progress: 0,
      cancelled: false,
      uploadId: null,
      xhr: null,
    });
  }
  renderUploadQueue();
  processUploadQueue();
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

  if (profileForm) {
    const profileFields = {
      doctorName: doctorProfile.name,
      specialty: doctorProfile.specialty,
      clinic: doctorProfile.clinic,
      contactPhone: doctorProfile.contactPhone,
      email: doctorProfile.email,
      city: doctorProfile.city,
    };
    Object.entries(profileFields).forEach(([name, value]) => {
      const input = profileForm.querySelector(`[name="${name}"]`);
      if (input && document.activeElement !== input) {
        input.value = value || "";
      }
    });
  }
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
  modalDoctorName.textContent =
    order.treatingDoctor && order.treatingDoctor !== order.doctor
      ? `${order.treatingDoctor} · ${order.doctor}`
      : order.doctor;
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
  localStorage.removeItem(SESSION_KEY);
  showLogin();
  showToast("Sesión cerrada.");
});

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

  let treatingDoctor = doctorProfile.name;
  if (doctorProfile.accountType === "clinic") {
    const selectedValue = formData.get("treatingDoctor") || "";
    const newName = (formData.get("newTreatingDoctor") || "").trim();
    treatingDoctor = selectedValue === "__new__" ? newName : selectedValue;
    if (!treatingDoctor) {
      showToast(
        selectedValue === "__new__"
          ? "Escribe el nombre del nuevo doctor tratante."
          : "Selecciona el doctor tratante de la orden.",
      );
      return;
    }
  }

  const newOrder = {
    id: `ORD-${new Date().getFullYear()}-${String(orders.length + 1).padStart(4, "0")}`,
    patient: formData.get("patientName"),
    phone: formData.get("phone")?.trim() || "",
    doctor: doctorProfile.name,
    treatingDoctor,
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
    if (doctorProfile.accountType === "clinic" && !doctorProfile.clinicDoctors?.includes(treatingDoctor)) {
      doctorProfile.clinicDoctors = [...(doctorProfile.clinicDoctors || []), treatingDoctor].sort((a, b) =>
        a.localeCompare(b, "es"),
      );
    }
  } catch (e) {
    orders.unshift(newOrder);
    console.error("No se pudo persistir la orden:", e);
  }

  orderForm.reset();
  setDefaultReferralDate();
  updateTomographyFields();
  updateOrthodonticPackageFields();
  renderTreatingDoctorField();
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

treatingDoctorSelect?.addEventListener("change", () => {
  document.querySelectorAll("[data-new-treating]").forEach((node) => {
    node.hidden = treatingDoctorSelect.value !== "__new__";
  });
});

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
  renderAdmin();
  renderPartnerProgram();
  renderDoctorOrders();
  renderResults(resultsSearch.value);
  showToast(`Estatus actualizado: ${order.patient} · ${order.status}.`);
});

sendStudiesButton?.addEventListener("click", () => {
  setAdminSection("results");
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
});

uploadDropzone?.addEventListener("click", () => uploadFileInput?.click());

uploadDropzone?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    uploadFileInput?.click();
  }
});

uploadDropzone?.addEventListener("dragover", (event) => {
  event.preventDefault();
  uploadDropzone.classList.add("dragging");
});

uploadDropzone?.addEventListener("dragleave", () => {
  uploadDropzone.classList.remove("dragging");
});

uploadDropzone?.addEventListener("drop", (event) => {
  event.preventDefault();
  uploadDropzone.classList.remove("dragging");
  if (event.dataTransfer?.files?.length) {
    enqueueUploads(event.dataTransfer.files);
  }
});

uploadFileInput?.addEventListener("change", () => {
  if (uploadFileInput.files?.length) {
    enqueueUploads(uploadFileInput.files);
    uploadFileInput.value = "";
  }
});

uploadQueueList?.addEventListener("click", (event) => {
  const cancelBtn = event.target.closest("[data-upload-cancel]");
  if (!cancelBtn) {
    return;
  }
  const item = uploadQueue.find((entry) => String(entry.id) === cancelBtn.dataset.uploadCancel);
  if (!item) {
    return;
  }
  item.cancelled = true;
  if (item.status === "waiting") {
    item.status = "cancelled";
    item.statusText = "Cancelado";
    renderUploadQueue();
  }
  item.xhr?.abort();
});

deliveredFilesList?.addEventListener("click", async (event) => {
  const deleteBtn = event.target.closest(".admin-delete-file");
  if (!deleteBtn) {
    return;
  }
  if (!confirm(`¿Eliminar ${deleteBtn.dataset.filename} del almacenamiento?`)) {
    return;
  }
  try {
    const res = await fetch(
      `/api/files/${encodeURIComponent(deleteBtn.dataset.orderId)}/${encodeURIComponent(deleteBtn.dataset.filename)}`,
      { method: "DELETE", headers: { "x-admin-token": getAdminToken() } },
    );
    if (!res.ok) {
      showToast("No se pudo eliminar el archivo.");
      return;
    }
    showToast("Archivo eliminado del almacenamiento.");
    refreshDeliveredFiles();
  } catch {
    showToast("Error de conexión.");
  }
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
  const resendButton = event.target.closest("[data-request-resend]");
  const plusButton = event.target.closest("[data-plus-module]");
  const orderButton = event.target.closest("[data-order-patient]");
  const validateOrderButton = event.target.closest("[data-validate-order]");
  const adminNextButton = event.target.closest("[data-admin-next-order]");

  if (downloadOrderButton) {
    const order = orders.find(
      (currentOrder) =>
        currentOrder.doctorId === doctorProfile.id &&
        currentOrder.id === downloadOrderButton.dataset.downloadOrder,
    );

    if (order?.result || downloadedOrders.has(order?.id)) {
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

  if (resendButton && activeDownloadOrder) {
    resendButton.disabled = true;
    try {
      const res = await fetch("/api/request-resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: activeDownloadOrder.id, filename: resendButton.dataset.requestResend }),
      });
      if (!res.ok) {
        throw new Error("request-resend falló");
      }
      showToast("✓ Radio Imagen recibió tu solicitud de reenvío.");
      openDownloadModal(activeDownloadOrder);
    } catch {
      showToast("No se pudo solicitar el reenvío. Intenta de nuevo.");
      resendButton.disabled = false;
    }
  }

  if (plusButton && !plusButton.disabled) {
    plusButton.disabled = true;
    const moduleLabel = plusButton.closest("article")?.querySelector("strong")?.textContent || plusButton.dataset.plusModule;
    try {
      const res = await fetch("/api/plus-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: doctorProfile.email, module: plusButton.dataset.plusModule }),
      });
      if (!res.ok) {
        throw new Error("plus-interest falló");
      }
      plusButton.textContent = "Interés registrado";
      showToast(`✓ Registramos tu interés en ${moduleLabel}. Te avisaremos cuando esté listo.`);
    } catch {
      plusButton.disabled = false;
      showToast("No se pudo registrar tu interés. Intenta de nuevo.");
    }
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
        const profile = findDoctorByEmail(session.email);
        if (!profile) {
          localStorage.removeItem(SESSION_KEY);
          showLogin();
          return;
        }
        applyDoctorProfile(profile);
        loadClinicRoster();
      }
      if (currentRole === "admin") {
        await apiLoadPartnerEvents();
        refreshDeliveredFiles();
        refreshPlusInterestAdmin();
      }
      const gotoView = new URLSearchParams(window.location.search).get("goto");
      showApp(
        false,
        currentRole === "admin" ? "admin" : gotoView === "results" ? "results" : "dashboard",
      );
    } catch {
      localStorage.removeItem(SESSION_KEY);
      showLogin();
    }
  } else {
    showLogin();
  }
}

initializePortal();
