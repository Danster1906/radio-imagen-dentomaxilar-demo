// Vista: panel del doctor (métricas, programa de socios, órdenes recientes)
import { metricPeriods, partnerTiers, POINTS_PER_REFERRED_PATIENT } from "../config.js";
import {
  periodButtons,
  doctorOrderList,
  partnerTier,
  partnerPoints,
  partnerReferrals,
  partnerNext,
  partnerProgress,
  partnerCurrentReward,
  partnerNextReward,
  partnerCurrentBenefits,
  partnerNextBenefits,
  partnerBenefitCatalog,
  partnerLadder,
  partnerHistorySection,
  partnerHistoryList,
  modalPatientName,
  modalStudies,
  modalOrderDate,
  modalOrderStatus,
  modalDoctorName,
  modalResult,
  modalNotes,
  orderModal,
} from "../dom.js";
import { orders, doctorProfile } from "../state.js";
import { statusClass } from "../utils.js";
import { getPartnerTier, getNextPartnerTier } from "../partner.js";
import { showToast } from "../ui/toast.js";

let selectedMetricsPeriod = "today";

export function renderMetrics() {
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

export function setMetricsPeriod(period) {
  if (!metricPeriods[period]) {
    return;
  }

  selectedMetricsPeriod = period;
  renderMetrics();
  showToast(`Métricas actualizadas: ${metricPeriods[period]}.`);
}

export function renderPartnerProgram() {
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

export function renderDoctorOrders() {
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

export function openOrderModal(order) {
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

export function closeOrderModal() {
  orderModal.hidden = true;
}
