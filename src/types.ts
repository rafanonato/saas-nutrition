export type ActiveTab = 
  | 'dashboard'
  | 'anamnese'
  | 'avaliacao'
  | 'editor'
  | 'finalizar'
  | 'pacientes'
  | 'configuracoes';

export interface PatientSummary {
  id: string;
  name: string;
  age: number;
  height: number; // in cm
  weight: number; // in kg
  goal: string;
  targetKcal: number;
  bmr: number; // Cunningham
  get: number;
  phone: string;
  status: string;
  ocrReady: boolean;
  appointmentTime: string;
  attendanceDate: string;
  whatsappComplianceRate: number; // 0 to 100%
  avatarInitials: string;
}

export interface Biomarker {
  id: string;
  name: string;
  unit: string;
  result: number;
  conventionalRef: string;
  functionalTarget: string;
  status: 'normal' | 'alerta' | 'critico';
  interpretation: string;
  date: string;
}

export interface Skinfolds {
  triceps: number;
  subscapular: number;
  suprailiac: number;
  abdominal: number;
  axillary: number;
  pectoral: number;
  thigh: number;
  sum7: number;
  bodyFatPercent: number;
}

export interface BodyComposition {
  currentWeight: number;
  previousWeight: number;
  height: number;
  bodyFatPercent: number;
  fatMassKg: number;
  leanMassKg: number; // MLG
  targetLeanMassKg: number;
  bmrCunningham: number;
  getCalculated: number;
  skinfolds: Skinfolds;
  circumferences: {
    waist: number;
    hip: number;
    relaxedArm: number;
    contractedArm: number;
    thigh: number;
  };
}

export interface FoodItem {
  id: string;
  name: string;
  householdMeasure: string;
  weightGrams: number;
  ptn: number;
  cho: number;
  lip: number;
  kcal: number;
  leucineGrams: number;
  sourceTable: 'TACO' | 'TBCA' | 'USDA';
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  targetPtn: number;
  targetCho: number;
  targetLip: number;
  targetKcal: number;
  items: FoodItem[];
  leucineThresholdMet: boolean; // >= 3.0g or 2.5g
  currentLeucine: number;
}

export interface SubstitutionOption {
  id: string;
  foodName: string;
  weightGrams: number;
  householdMeasure: string;
  ptn: number;
  cho: number;
  lip: number;
  kcal: number;
}

export interface SubstitutionRule {
  id: string;
  originalFood: string;
  originalGrams: number;
  originalPtn: number;
  alternatives: SubstitutionOption[];
}

export interface ScribeMessage {
  id: string;
  timestamp: string;
  speaker: 'patient' | 'nutritionist' | 'system' | 'ai';
  text: string;
  detectedEntities?: {
    type: 'complaint' | 'symptom' | 'aversion' | 'weight' | 'routine';
    label: string;
    fieldUpdated: string;
    badgeColor?: string;
  };
}

export interface ClinicConfig {
  activeFoodBanks: {
    taco: boolean;
    tbca: boolean;
    usda: boolean;
  };
  solverTolerance: 'estrita' | 'moderada' | 'flexivel';
  integerPortions: boolean;
  enforceLeucineGate: boolean;
  whatsappPersona: 'assistente_1p' | 'institucional' | 'imitar_nutri';
  photoCheckins: boolean;
  autoForwardAlerts: boolean;
}

export interface ComplianceChecklist {
  leucineRequirementMet: boolean;
  aversionRespected: boolean;
  supplementationChecked: boolean;
  tacoTbcaCalibrated: boolean;
  humanReviewSigned: boolean;
  cfn856DeclarationAccepted: boolean;
  twoFactorToken: string;
  signatureDate: string;
  professionalName: string;
  crnRegistry: string;
}
