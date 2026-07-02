// Composición de renders entre vistas. Las vistas no se importan entre sí;
// cuando una operación afecta datos de varias vistas, se refresca desde aquí.
import { currentRole } from "./state.js";
import { resultsSearch } from "./dom.js";
import { renderMetrics, renderPartnerProgram, renderDoctorOrders } from "./views/dashboard.js";
import { renderResults } from "./views/results.js";
import { renderProfile } from "./views/profile.js";
import { renderAdmin } from "./views/admin.js";

export function renderDoctorScopedData() {
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

// Refresco tras cambios de datos (órdenes, puntos, doctores)
export function refreshAfterDataChange() {
  renderAdmin();
  renderPartnerProgram();
  renderDoctorOrders();
  renderResults(resultsSearch.value);
}
