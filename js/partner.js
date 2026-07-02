// Lógica del programa de socios (niveles y beneficios)
import { partnerTiers } from "./config.js";

export function getPartnerTier(referrals) {
  if (referrals < 1) {
    return {
      name: "Por activar",
      shortName: "Inicio",
      minPoints: 0,
      minReferrals: 0,
      reward: "Envía tu primer paciente para activar Socios Radio Imagen Dentomaxilar",
      benefits: ["Al enviar el primer paciente se desbloquea el kit digital de inicio"],
    };
  }

  return partnerTiers.reduce(
    (currentTier, tier) => (referrals >= tier.minReferrals ? tier : currentTier),
    partnerTiers[0],
  );
}

export function getNextPartnerTier(referrals) {
  return partnerTiers.find((tier) => tier.minReferrals > referrals) || null;
}
