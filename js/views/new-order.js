// Vista: nueva orden digital (catálogo de estudios y envío del formulario)
import { studies, cephalometricStudies } from "../data/studies.js";
import { studyGrid, orderForm } from "../dom.js";
import { orders, doctorProfile } from "../state.js";
import { apiSaveOrder, apiLoadOrders } from "../api.js";
import { todayISO } from "../utils.js";
import { showToast } from "../ui/toast.js";
import { setView, setDefaultReferralDate } from "../ui/shell.js";
import { refreshAfterDataChange } from "../render.js";

export function renderStudies() {
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

export function updateTomographyFields() {
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

export function updateOrthodonticPackageFields() {
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

export async function handleOrderSubmit(event) {
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

  const newOrder = {
    id: `ORD-${new Date().getFullYear()}-${String(orders.length + 1).padStart(4, "0")}`,
    patient: formData.get("patientName"),
    phone: formData.get("phone")?.trim() || "",
    doctor: doctorProfile.name,
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
  } catch (e) {
    orders.unshift(newOrder);
    console.error("No se pudo persistir la orden:", e);
  }

  orderForm.reset();
  setDefaultReferralDate();
  updateTomographyFields();
  updateOrthodonticPackageFields();
  refreshAfterDataChange();
  setView("dashboard");
  showToast("Orden enviada a Radio Imagen. Sumará puntos cuando el paciente sea atendido.");
}
