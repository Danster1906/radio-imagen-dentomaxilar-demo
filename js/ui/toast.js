// Notificación tipo toast
import { toast } from "../dom.js";

export function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.setTimeout(() => toast.classList.remove("visible"), 2800);
}
