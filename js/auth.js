// Autenticación contra POST /api/login y manejo de sesión local
import { SESSION_KEY } from "./config.js";
import {
  doctorDirectory,
  doctorProfile,
  adminProfile,
  setCurrentRole,
  applyDoctorProfile,
  findDoctorByEmail,
} from "./state.js";
import { apiLoadPartnerEvents } from "./api.js";
import { showToast } from "./ui/toast.js";
import { showApp, showLogin } from "./ui/shell.js";

export async function loginAccount(email, password) {
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
    setCurrentRole(role);

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

export function logoutAccount() {
  localStorage.removeItem(SESSION_KEY);
  showLogin();
  showToast("Sesión cerrada.");
}
