// Punto de entrada: cablea eventos e inicializa el portal
import { SESSION_KEY } from "./config.js";
import {
  navButtons,
  periodButtons,
  loginForm,
  logoutButton,
  orderForm,
  profileForm,
  profilePhotoInput,
  photoZoomInput,
  photoXInput,
  photoYInput,
  editableAvatar,
  centerPhotoButton,
  resultsSearch,
  resultsTable,
  resultsTableDone,
  resultsTabButtons,
  adminStatusFilter,
  adminOrderTable,
  adminDoctorList,
  adminDoctorForm,
  adminSectionButtons,
  runAgentButton,
  sendStudiesButton,
  focusNewDoctorButton,
  manualUploadForm,
  studyGrid,
  orderModal,
  closeOrderModalButton,
  downloadModal,
  closeDownloadModalButton,
} from "./dom.js";
import {
  orders,
  doctorProfile,
  setCurrentRole,
  currentRole,
  getAccountRole,
  applyDoctorProfile,
  findDoctorByEmail,
} from "./state.js";
import { apiLoadDoctors, apiLoadOrders, apiLoadPartnerEvents } from "./api.js";
import { showToast } from "./ui/toast.js";
import {
  setView,
  setAdminSection,
  showApp,
  showLogin,
  updateInternalClock,
  setDefaultReferralDate,
} from "./ui/shell.js";
import { loginAccount, logoutAccount } from "./auth.js";
import {
  setMetricsPeriod,
  renderDoctorOrders,
  openOrderModal,
  closeOrderModal,
} from "./views/dashboard.js";
import {
  renderStudies,
  updateTomographyFields,
  updateOrthodonticPackageFields,
  handleOrderSubmit,
} from "./views/new-order.js";
import {
  renderResults,
  openDownloadModal,
  closeDownloadModal,
  simulateDownload,
} from "./views/results.js";
import {
  renderProfile,
  syncPhotoControls,
  updatePhotoCrop,
  startPhotoDrag,
  movePhotoDrag,
  stopPhotoDrag,
  centerPhoto,
  handleProfilePhotoChange,
  handleProfileSubmit,
} from "./views/profile.js";
import {
  renderAdmin,
  runAgent,
  sendReadyStudies,
  validateAttendedOrder,
  runAdminNextStep,
  createDoctorFromAdmin,
  uploadManualResult,
  handleAdminStatusChange,
  handleAdminDoctorListClick,
  handleAdminNotificationsChange,
} from "./views/admin.js";

// --- Navegación y cascarón ---
navButtons.forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

periodButtons.forEach((button) => {
  button.addEventListener("click", () => setMetricsPeriod(button.dataset.period));
});

// --- Sesión ---
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  await loginAccount(formData.get("loginEmail").trim(), formData.get("loginPassword"));
});

logoutButton.addEventListener("click", () => {
  logoutAccount();
});

// --- Nueva orden ---
orderForm.querySelectorAll("[data-error]").forEach((errorEl) => {
  const name = errorEl.dataset.error;
  const inputEl = orderForm.querySelector(`[name="${name}"]`);
  if (inputEl) {
    const clearError = () => {
      if (inputEl.value.trim()) {
        errorEl.classList.remove("visible");
        inputEl.classList.remove("field-invalid");
      }
    };
    inputEl.addEventListener("input", clearError);
    inputEl.addEventListener("change", clearError);
  }
});

orderForm.addEventListener("submit", handleOrderSubmit);

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

// --- Perfil ---
profileForm.addEventListener("submit", handleProfileSubmit);
profilePhotoInput.addEventListener("change", handleProfilePhotoChange);

[photoZoomInput, photoXInput, photoYInput].forEach((input) => {
  input.addEventListener("input", updatePhotoCrop);
});

editableAvatar.addEventListener("pointerdown", startPhotoDrag);
editableAvatar.addEventListener("pointermove", movePhotoDrag);
editableAvatar.addEventListener("pointerup", stopPhotoDrag);
editableAvatar.addEventListener("pointercancel", stopPhotoDrag);

centerPhotoButton.addEventListener("click", centerPhoto);

// --- Resultados ---
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

// --- Admin ---
adminStatusFilter?.addEventListener("change", renderAdmin);
adminOrderTable?.addEventListener("change", handleAdminStatusChange);
adminDoctorList?.addEventListener("click", handleAdminDoctorListClick);
adminDoctorList?.addEventListener("change", handleAdminNotificationsChange);

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

// --- Delegación global de clicks (órdenes, descargas, validaciones) ---
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
    simulateDownload(downloadFileButton.dataset.downloadFile);
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

// --- Modales ---
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

// --- Render inicial ---
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
      setCurrentRole(session.role || getAccountRole(session.email));
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
