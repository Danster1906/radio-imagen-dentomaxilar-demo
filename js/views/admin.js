// Vista: panel de administración (órdenes, doctores, resultados y agente local)
import { POINTS_PER_REFERRED_PATIENT, adminOrderStatuses } from "../config.js";
import {
  adminStatusFilter,
  adminOrderTable,
  adminDoctorList,
  adminDownloadQueue,
  adminDoctorForm,
  manualUploadOrder,
  manualUploadForm,
  agentLog,
} from "../dom.js";
import {
  orders,
  doctorDirectory,
  doctorProfile,
  adminProfile,
  adminDownloadRequests,
  localResultFiles,
  resultPackages,
  agentState,
  partnerEvents,
  getDoctorById,
  getAdminToken,
} from "../state.js";
import { apiUpdateOrder, apiLogPartnerEvent } from "../api.js";
import { todayISO, normalizeName, generateRandomPassword } from "../utils.js";
import { getPartnerTier } from "../partner.js";
import { showToast } from "../ui/toast.js";
import { refreshAfterDataChange } from "../render.js";

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

export async function runAdminNextStep(orderId) {
  const order = orders.find((currentOrder) => currentOrder.id === orderId);

  if (!order) {
    return;
  }

  if (order.status === "Recibida") {
    order.status = "Agendada";
    order.scheduledAt = todayISO();
    await apiUpdateOrder(order.id, { status: order.status, scheduledAt: order.scheduledAt });
    refreshAfterDataChange();
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

export async function reverseOrderValidation(order) {
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

export async function validateAttendedOrder(orderId, nextStatus = "Completa") {
  const order = orders.find((currentOrder) => currentOrder.id === orderId);

  if (!order) {
    return;
  }

  if (order.countsForPartner) {
    order.status = nextStatus;
    await apiUpdateOrder(order.id, { status: order.status });
    refreshAfterDataChange();
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

  refreshAfterDataChange();
  showToast(`Paciente completado: ${order.patient}. Se sumaron ${POINTS_PER_REFERRED_PATIENT} pts.`);
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

export async function createDoctorFromAdmin(formData) {
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

export async function deleteDoctorFromAdmin(email) {
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

export function renderAdmin() {
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
      const waNumber = digits.length === 10 ? `52${digits}` : digits;
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
            return `<li class="admin-history-item">
              <span class="admin-history-meta">${date} ${time} · ${reasonLabel}${e.orderId ? " · " + e.orderId : ""}</span>
              <strong class="${e.delta > 0 ? "admin-pts-positive" : "admin-pts-negative"}">${sign}${e.delta} pts</strong>
            </li>`;
          }).join("")
        : `<li class="admin-history-empty">Sin eventos registrados aún.</li>`;

      return `
        <article class="admin-doctor-card">
          <header>
            <strong>${doctor.name}</strong>
            <span class="admin-chip">${tier.shortName}</span>
          </header>
          <span>${doctor.specialty || "Sin especialidad"}</span>
          <small class="admin-credential-line">Correo: <strong>${doctor.email}</strong></small>
          <div class="admin-pw-row">
            <input class="admin-pw-input" type="text" placeholder="Nueva contraseña" data-pw-email="${doctor.email}" />
            <button class="small-action admin-generate-password" data-email="${doctor.email}" type="button">Generar</button>
            <button class="small-action admin-reset-password" data-email="${doctor.email}" type="button">Cambiar</button>
          </div>
          <div class="admin-notif-row">
            <label class="admin-notif-label">
              <input type="checkbox" class="admin-notif-toggle" data-email="${doctor.email}" ${notificationsOn ? "checked" : ""} />
              Notificar por correo al subir resultados
            </label>
          </div>
          <small class="admin-doctor-summary">${doctor.partner.referredPatients} pacientes validados · ${doctor.partner.points.toLocaleString("es-MX")} pts</small>
          <details class="admin-history-details">
            <summary>Historial de puntos (${doctorEvents.length})</summary>
            <ul id="${historyId}" class="admin-history-list">
              ${historyRows}
            </ul>
          </details>
          <button class="ghost-action admin-delete-doctor" data-email="${doctor.email}" type="button">Eliminar doctor</button>
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

export async function uploadManualResult(formData) {
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
    refreshAfterDataChange();
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

export async function runAgent(orderId = null, options = {}) {
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
  refreshAfterDataChange();
  if (!options.silent) {
    showToast(matches.length ? `Agente asignó ${matches.length} resultado(s) y solicitó subida.` : "Agente no encontró coincidencias.");
  }
}

export function sendReadyStudies() {
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
  refreshAfterDataChange();
  showToast(`${pendingUploads.length} estudio(s) enviados al portal del doctor.`);
}

export async function handleAdminStatusChange(event) {
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
  refreshAfterDataChange();
  showToast(`Estatus actualizado: ${order.patient} · ${order.status}.`);
}

export async function handleAdminDoctorListClick(event) {
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
}

export async function handleAdminNotificationsChange(event) {
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
}
