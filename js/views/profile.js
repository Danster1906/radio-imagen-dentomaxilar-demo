// Vista: perfil profesional del doctor (datos + foto con recorte)
import {
  profileForm,
  doctorIdLabel,
  profilePhotoInput,
  profilePhotoPreview,
  profileInitials,
  doctorPreviewPhoto,
  doctorPreviewInitials,
  editableAvatar,
  photoZoomInput,
  photoXInput,
  photoYInput,
} from "../dom.js";
import { doctorProfile } from "../state.js";
import { getInitials } from "../utils.js";
import { showToast } from "../ui/toast.js";
import { renderDoctorScopedData } from "../render.js";

let dragStart = null;

export function renderProfile() {
  const initials = getInitials(doctorProfile.name);
  const photoTranslateX = `${Number(doctorProfile.photoX)}%`;
  const photoTranslateY = `${Number(doctorProfile.photoY)}%`;

  document.querySelectorAll("[data-profile-name]").forEach((node) => {
    node.textContent = doctorProfile.name;
  });

  document.querySelectorAll("[data-profile-specialty]").forEach((node) => {
    node.textContent = doctorProfile.specialty || "Especialidad no capturada";
  });

  document.querySelectorAll("[data-profile-clinic]").forEach((node) => {
    node.textContent = doctorProfile.clinic;
  });
  document.querySelectorAll("[data-profile-handle]").forEach((node) => {
    node.textContent = doctorProfile.handle;
  });
  doctorIdLabel.textContent = doctorProfile.doctorCode || doctorProfile.id;
  document.querySelector("[data-profile-contact]").textContent = doctorProfile.contactPhone;
  document.querySelector("[data-profile-city]").textContent = doctorProfile.city;
  profileInitials.textContent = initials;
  doctorPreviewInitials.textContent = initials;

  [profilePhotoPreview, doctorPreviewPhoto].forEach((image) => {
    image.src = doctorProfile.photo;
    image.hidden = !doctorProfile.photo;
    image.style.setProperty("--photo-zoom", doctorProfile.photoZoom);
    image.style.setProperty("--photo-translate-x", photoTranslateX);
    image.style.setProperty("--photo-translate-y", photoTranslateY);
  });

  [profileInitials, doctorPreviewInitials].forEach((node) => {
    node.hidden = Boolean(doctorProfile.photo);
  });
}

export function syncPhotoControls() {
  photoZoomInput.value = doctorProfile.photoZoom;
  photoXInput.value = doctorProfile.photoX;
  photoYInput.value = doctorProfile.photoY;
}

export function updatePhotoCrop() {
  doctorProfile.photoZoom = photoZoomInput.value;
  doctorProfile.photoX = photoXInput.value;
  doctorProfile.photoY = photoYInput.value;
  renderProfile();
}

function clampPhotoOffset(value) {
  return Math.max(-40, Math.min(40, value));
}

export function startPhotoDrag(event) {
  if (!doctorProfile.photo) {
    return;
  }

  editableAvatar.classList.add("dragging");
  editableAvatar.setPointerCapture(event.pointerId);
  dragStart = {
    pointerId: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    photoX: Number(doctorProfile.photoX),
    photoY: Number(doctorProfile.photoY),
  };
}

export function movePhotoDrag(event) {
  if (!dragStart || dragStart.pointerId !== event.pointerId) {
    return;
  }

  const avatarSize = editableAvatar.getBoundingClientRect().width;
  const deltaX = ((event.clientX - dragStart.x) / avatarSize) * 100;
  const deltaY = ((event.clientY - dragStart.y) / avatarSize) * 100;

  doctorProfile.photoX = clampPhotoOffset(dragStart.photoX + deltaX);
  doctorProfile.photoY = clampPhotoOffset(dragStart.photoY + deltaY);
  syncPhotoControls();
  renderProfile();
}

export function stopPhotoDrag(event) {
  if (!dragStart || dragStart.pointerId !== event.pointerId) {
    return;
  }

  editableAvatar.classList.remove("dragging");
  dragStart = null;
}

export function centerPhoto() {
  doctorProfile.photoZoom = 1;
  doctorProfile.photoX = 0;
  doctorProfile.photoY = 0;
  syncPhotoControls();
  renderProfile();
  showToast("Imagen centrada en el recuadro.");
}

export function handleProfilePhotoChange() {
  const file = profilePhotoInput.files[0];

  if (!file) {
    return;
  }

  if (!file.type.startsWith("image/")) {
    showToast("Selecciona una imagen en formato PNG, JPG o WebP.");
    profilePhotoInput.value = "";
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    doctorProfile.photo = reader.result;
    doctorProfile.photoZoom = 1;
    doctorProfile.photoX = 0;
    doctorProfile.photoY = 0;
    syncPhotoControls();
    renderProfile();
    showToast("Imagen de perfil actualizada en la vista previa.");
  });
  reader.readAsDataURL(file);
}

export function handleProfileSubmit(event) {
  event.preventDefault();
  const formData = new FormData(profileForm);

  doctorProfile.name = formData.get("doctorName").trim();
  doctorProfile.specialty = formData.get("specialty").trim();
  doctorProfile.clinic = formData.get("clinic").trim();
  doctorProfile.contactPhone = formData.get("contactPhone").trim();
  doctorProfile.email = formData.get("email").trim();
  doctorProfile.city = formData.get("city").trim();

  renderDoctorScopedData();
  showToast("Perfil actualizado para las próximas órdenes.");
}
