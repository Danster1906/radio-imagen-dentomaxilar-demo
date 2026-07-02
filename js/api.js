// Capa de acceso a la API JSON del servidor (/api/*)
import {
  setOrders,
  setPartnerEvents,
  partnerEvents,
  doctorDirectory,
  getAdminToken,
} from "./state.js";

export async function apiLoadPartnerEvents() {
  try {
    const res = await fetch("/api/partner-events", { headers: { "x-admin-token": getAdminToken() } });
    if (!res.ok) return;
    const data = await res.json();
    setPartnerEvents(data.events || []);
  } catch (e) {
    console.error("apiLoadPartnerEvents:", e);
  }
}

export async function apiLogPartnerEvent(email, orderId, delta, reason) {
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

export async function apiLoadOrders() {
  try {
    const res = await fetch("/api/orders");
    if (!res.ok) return;
    const data = await res.json();
    setOrders(data.orders || []);
  } catch (e) {
    console.error("apiLoadOrders:", e);
  }
}

export async function apiSaveOrder(order) {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order)
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Error al guardar la orden");
  }
}

export async function apiUpdateOrder(orderId, changes) {
  const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(changes)
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Error al actualizar la orden");
  }
}

export async function apiLoadDoctors() {
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
