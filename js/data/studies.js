// Catálogo de estudios disponibles
export const studies = [
  {
    id: "estudio-ortodontico-completo",
    name: "Estudio Ortodóntico Completo",
    category: "Estudio Ortodóntico Completo",
    description:
      "Incluye ortopantomografía, lateral de cráneo, escaneo intraoral, modelos en resina, fotografía extraoral e intraoral y análisis cefalométrico",
    type: "orthodontic-package",
    fovOptions: ["17x13", "11x10", "8x8", "5x5"],
  },
  {
    id: "ortopantomografia",
    name: "Ortopantomografía",
    category: "Radiografías y proyecciones",
    description: "Radiografía panorámica dental",
  },
  {
    id: "lateral-craneo",
    name: "Lateral de Craneo",
    category: "Radiografías y proyecciones",
    description: "Proyección lateral para análisis cefalométrico",
  },
  {
    id: "pa-craneo",
    name: "PA De craneo",
    category: "Radiografías y proyecciones",
    description: "Proyección posteroanterior de cráneo",
  },
  {
    id: "ap-craneo",
    name: "A-P de craneo",
    category: "Radiografías y proyecciones",
    description: "Proyección anteroposterior de cráneo",
  },
  {
    id: "waters",
    name: "WATERS",
    category: "Radiografías y proyecciones",
    description: "Proyección de senos paranasales",
  },
  {
    id: "atm-comparativa",
    name: "ATM COMPARATIVA",
    category: "Radiografías y proyecciones",
    description: "Evaluación comparativa de articulación temporomandibular",
  },
  {
    id: "carpal",
    name: "Carpal",
    category: "Radiografías y proyecciones",
    description: "Radiografía carpal para valoración de crecimiento",
  },
  {
    id: "senos-paranasales",
    name: "Senos paranasales",
    category: "Radiografías y proyecciones",
    description: "Estudio radiográfico de senos paranasales",
  },
  {
    id: "tomografia-3d",
    name: "Tomografía 3D",
    category: "Tomografía 3D",
    description: "Selecciona tamaño FOV y especificaciones cuando aplique",
    type: "tomography",
    fovOptions: ["17x13", "11x10", "8x8", "5x5"],
  },
  {
    id: "fotografia-extraoral-intraoral-digital",
    name: "FOTOGRAFÍA EXTRAORAL E INTRAORAL DIGITAL",
    category: "Fotografía, escaneo intraoral y modelos de estudio",
    description: "Registro fotográfico clínico en formato digital",
  },
  {
    id: "fotografia-extraoral-intraoral-impresa",
    name: "FOTOGRAFÍA EXTRAORAL E INTRAORAL IMPRESA",
    category: "Fotografía, escaneo intraoral y modelos de estudio",
    description: "Registro fotográfico clínico en formato impreso",
  },
  {
    id: "modelos-estudio-yeso",
    name: "MODELOS DE ESTUDIO EN YESO",
    category: "Fotografía, escaneo intraoral y modelos de estudio",
    description: "Modelos físicos para análisis y archivo clínico",
  },
  {
    id: "modelos-estudio-resina",
    name: "MODELOS DE ESTUDIO EN RESINA",
    category: "Fotografía, escaneo intraoral y modelos de estudio",
    description: "Modelos en resina para planeación y presentación",
  },
  {
    id: "escaneo-intraoral-itero",
    name: "ESCANEO INTRAORAL ITERO",
    category: "Fotografía, escaneo intraoral y modelos de estudio",
    description: "Escaneo intraoral digital con iTero",
  },
  {
    id: "analisis-modelos-bolton",
    name: "ANALISIS DE MODELOS BOLTON",
    category: "Análisis de modelos",
    description: "Análisis de discrepancia dentaria Bolton",
  },
  {
    id: "analisis-modelos-moyers",
    name: "ANALISIS DE MODELOS MOYERS",
    category: "Análisis de modelos",
    description: "Análisis predictivo de espacio Moyers",
  },
  {
    id: "nemocef-rickets",
    name: "NEMOCEF RICKETS",
    category: "Análisis cefalométrico NEMOCEF",
    description: "Análisis cefalométrico Rickets",
  },
  {
    id: "nemocef-steiner",
    name: "NEMOCEF STEINER",
    category: "Análisis cefalométrico NEMOCEF",
    description: "Análisis cefalométrico Steiner",
  },
  {
    id: "nemocef-mc-namara",
    name: "NEMOCEF MC. NAMARA",
    category: "Análisis cefalométrico NEMOCEF",
    description: "Análisis cefalométrico Mc. Namara",
  },
  {
    id: "nemocef-tweed",
    name: "NEMOCEF TWEED",
    category: "Análisis cefalométrico NEMOCEF",
    description: "Análisis cefalométrico Tweed",
  },
  {
    id: "nemocef-jaraback",
    name: "NEMOCEF JARABACK",
    category: "Análisis cefalométrico NEMOCEF",
    description: "Análisis cefalométrico Jaraback",
  },
  {
    id: "nemocef-downs",
    name: "NEMOCEF DOWNS",
    category: "Análisis cefalométrico NEMOCEF",
    description: "Análisis cefalométrico Downs",
  },
];

export const cephalometricStudies = studies.filter((study) => study.category === "Análisis cefalométrico NEMOCEF");

export function getStudyAbbreviation(studyName) {
  if (studyName.toLowerCase().includes("ortopantom")) {
    return "OPG";
  }

  if (studyName.toLowerCase().includes("tomograf")) {
    return "CBCT";
  }

  if (studyName.toLowerCase().includes("ortod")) {
    return "EOC";
  }

  return studyName
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 5)
    .toUpperCase();
}
