// Vista: resultados (tablas activas/terminadas y modal de descarga)
import {
  resultsTable,
  resultsTableDone,
  resultsTabButtons,
  resultsSearch,
  downloadModal,
  downloadPatientName,
  downloadStudySummary,
  downloadFullStudyButton,
  downloadFileList,
} from "../dom.js";
import {
  orders,
  doctorProfile,
  resultPackages,
  downloadedOrders,
  markOrderDownloaded,
} from "../state.js";
import { statusClass } from "../utils.js";
import { showToast } from "../ui/toast.js";

let activeDownloadOrder = null;

export function renderResults(filter = "") {
  const normalizedFilter = filter.trim().toLowerCase();
  const myOrders = orders.filter(
    (order) => order.doctorId === doctorProfile.id && order.patient.toLowerCase().includes(normalizedFilter),
  );

  const activeOrders = myOrders.filter((o) => !downloadedOrders.has(o.id));
  const doneOrders = myOrders.filter((o) => downloadedOrders.has(o.id));

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
    btn.textContent = btn.dataset.resultsTab === "done"
      ? `Terminadas${doneOrders.length ? ` (${doneOrders.length})` : ""}`
      : `Activas${activeOrders.length ? ` (${activeOrders.length})` : ""}`;
  });
}

export async function openDownloadModal(order) {
  activeDownloadOrder = order;

  downloadPatientName.textContent = order.patient;
  downloadStudySummary.textContent = order.studies.join(", ");
  downloadFileList.innerHTML = '<p class="download-list-hint">Cargando archivos…</p>';
  downloadModal.hidden = false;

  try {
    const res = await fetch(`/api/files/${encodeURIComponent(order.id)}`);
    const data = await res.json();
    const serverFiles = data.files || [];

    const localPkg = resultPackages[order.id];
    const allFiles = serverFiles.length > 0 ? serverFiles : (localPkg?.files || []);

    if (allFiles.length === 0) {
      downloadFileList.innerHTML = '<p class="download-list-hint">No hay archivos disponibles para esta orden.</p>';
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
    downloadFileList.innerHTML = '<p class="download-list-hint download-list-error">Error al cargar archivos.</p>';
  }
}

export function closeDownloadModal() {
  downloadModal.hidden = true;
  activeDownloadOrder = null;
}

function realDownload(orderId, filename) {
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

export function simulateDownload(file) {
  const orderId = activeDownloadOrder?.id;
  if (orderId && file) {
    realDownload(orderId, file);
  } else {
    showToast("Archivo no disponible para descarga.");
  }
}
