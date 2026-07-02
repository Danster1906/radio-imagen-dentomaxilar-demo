// Estado compartido del portal (datos en memoria + persistencia ligera)
import { SESSION_KEY, ADMIN_EMAIL } from "./config.js";

export const orders = [
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

export function setOrders(nextOrders) {
  orders.splice(0, orders.length, ...nextOrders);
}

export const adminDownloadRequests = [
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

export const adminProfile = {
  id: "ADM-0001",
  handle: "@radio-imagen-admin",
  name: "Admin Radio Imagen",
  specialty: "Radiodiagnóstico y operación",
  clinic: "Radio Imagen Dentomaxilar",
  contactPhone: "55 0000 0000",
  email: ADMIN_EMAIL,
  city: "Ciudad de México",
};

export const localResultFiles = [
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

export const resultPackages = {
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

export const agentState = {
  matches: [],
  uploads: 0,
  hasRun: false,
};

export const downloadedOrders = new Set(
  JSON.parse(localStorage.getItem("ri_downloaded_orders") || "[]")
);

function persistDownloadedOrders() {
  localStorage.setItem("ri_downloaded_orders", JSON.stringify([...downloadedOrders]));
}

export function markOrderDownloaded(orderId) {
  downloadedOrders.add(orderId);
  persistDownloadedOrders();
  fetch(`/api/mark-downloaded/${encodeURIComponent(orderId)}`, { method: "POST" }).catch(() => {});
}

export const doctorDirectory = {
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

export const doctorProfile = {
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

export let currentRole = "doctor";

export function setCurrentRole(role) {
  currentRole = role;
}

export let partnerEvents = [];

export function setPartnerEvents(events) {
  partnerEvents = events;
}

export function getDoctorById(doctorId) {
  return Object.values(doctorDirectory).find((doctor) => doctor.id === doctorId);
}

export function findDoctorByEmail(email) {
  return doctorDirectory[email.toLowerCase()] || doctorDirectory["sofia.herrera@consulta.mx"];
}

export function getAccountRole(email) {
  return email.toLowerCase() === ADMIN_EMAIL ? "admin" : "doctor";
}

export function applyDoctorProfile(profile) {
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

export function getAdminToken() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "{}");
    return session.adminToken || "";
  } catch { return ""; }
}
