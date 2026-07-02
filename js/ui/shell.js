// Cascarón de la app: navegación entre vistas, reloj y transición login/app
import { viewTitles } from "../config.js";
import {
  pageTitle,
  loginScreen,
  loadingScreen,
  appShell,
  loadingHandle,
  doctorIdLabel,
  adminSectionButtons,
  adminSectionPanels,
  currentDate,
  currentTime,
  referralDateInput,
} from "../dom.js";
import { currentRole, setCurrentRole, adminProfile, doctorProfile } from "../state.js";
import { todayISO } from "../utils.js";
import { renderDoctorScopedData } from "../render.js";

export function updateInternalClock() {
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

export function setDefaultReferralDate() {
  referralDateInput.value = todayISO();
}

export function setAdminSection(sectionId) {
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

export function setView(viewId) {
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

export function configureShellForRole(role) {
  setCurrentRole(role);
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

export function showApp(useLoader = false, initialView = currentRole === "admin" ? "admin" : "dashboard") {
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

export function showLogin() {
  appShell.hidden = true;
  loadingScreen.hidden = true;
  loginScreen.hidden = false;
}
