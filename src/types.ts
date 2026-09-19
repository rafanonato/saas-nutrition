export type ActiveTab = 
  | 'dashboard'
  | 'anamnese'
  | 'avaliacao'
  | 'editor'
  | 'finalizar'
  | 'pacientes'
  | 'gestao-clinica'
  | 'configuracoes';

export interface ClinicTenant {
  id: string;
  name: string;
  tradeName: string;
  cnpj?: string;
  plan: 'trial' | 'free_trial' | 'pro' | 'enterprise';
  active: boolean;
  createdAt: string;
  address?: string;
  phone?: string;
}

export interface NutritionistUser {
  id: string;
  clinicId: string;
  name: string;
  email: string;
  phone: string;
  crn: string;
  role: 'admin_nutri' | 'nutri';
  specialty: string;
  avatarInitials: string;
  active: boolean;
  createdAt: string;
  notes?: string;
  accessGrantedAt?: string;
  patientsCount?: number;
}

export interface PatientSummary {
  id: string;
  clinicId?: string;
  nutritionistId?: string;
  name: string;
  cpf?: string;
  email?: string;
  birthDate?: string;
  age: number;
  height: number; // in cm
  weight: number; // in kg
  gender?: 'feminino' | 'masculino';
  goal: string;
  targetKcal: number;
  targetPtn?: number;
  targetCho?: number;
  targetLip?: number;
  ptnPerKg?: number;
  choPerKg?: number;
  lipPerKg?: number;
  bmr: number; // Cunningham ou fórmula selecionada
  bmrFormula?: 'cunningham' | 'mifflin' | 'harris';
  get: number; // Gasto Energético Total
  activityFactor?: number;
  activityLevel?: string;
  calorieGoalAdjustment?: number;
  phone: string;
  status: string;
  ocrReady: boolean;
  appointmentTime: string;
  attendanceDate: string;
  whatsappComplianceRate: number; // 0 to 100%
  avatarInitials: string;
  notes?: string;
  createdAt?: string;
}

export interface DiscrepancyAlert {
  id: string;
  field: string;
  statementA: { text: string; timestamp: string };
  statementB: { text: string; timestamp: string };
  status: 'pendente' | 'resolvido';
  resolvedChoice?: string;
}

export interface AnamneseData {
  consultationGoal: string;
  mainComplaints: string;
  complaintsTimestamp: string;
  trainingRoutine: {
    modality: string;
    schedule: string;
    frequency: string;
    timestamp: string;
    isLiveFilled: boolean;
  };
  sleepRoutine: {
    hoursPerNight: number;
    quality: string;
    timestamp: string;
    isLiveFilled: boolean;
  };
  hydration: {
    litersPerDay: number;
    timestamp: string;
    isLiveFilled: boolean;
  };
  gastrointestinal: {
    bristolType: number; // 1 to 7
    symptoms: string[];
    timestamp: string;
    isLiveFilled: boolean;
  };
  aversions: string[];
  discrepancies: DiscrepancyAlert[];
  audioQuality: {
    confidenceScore: number; // 0 to 100
    hasExcessiveNoise: boolean;
    noiseWarning?: string;
  };
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
  isOutlier?: boolean;
  ocrConfidence?: number;
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

export type SkinfoldProtocol = 'jp7' | 'jp3' | 'faulkner';

export interface HistoricalBioimpedance {
  date: string;
  weight: number;
  leanMassKg: number;
  fatMassKg: number;
  bodyFatPercent: number;
  bodyWaterPercent: number;
}

export interface PosturalPhotos {
  anteriorUrl: string;
  lateralUrl: string;
  posteriorUrl: string;
  isEncryptedAes256: boolean;
  date: string;
  cfn856ComplianceVerified: boolean;
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
  skinfoldProtocol: SkinfoldProtocol;
  skinfolds: Skinfolds;
  circumferences: {
    waist: number;
    hip: number;
    relaxedArm: number;
    contractedArm: number;
    thigh: number;
  };
  historicalRecords: HistoricalBioimpedance[];
  posturalPhotos: PosturalPhotos;
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
  insightBadge?: string;
  suggestedAction?: {
    type: string;
    label: string;
    payload?: any;
  };
  engine?: string;
  source?: string;
  detectedEntities?: {
    type: 'complaint' | 'symptom' | 'aversion' | 'weight' | 'routine' | string;
    label: string;
    fieldUpdated?: string;
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

export interface WhatsAppChatMessage {
  id: string;
  sender: 'patient' | 'assistant' | 'system';
  timestamp: string;
  text: string;
  mediaType?: 'text' | 'image' | 'audio' | 'pdf';
  mediaUrl?: string;
  substitutionCard?: {
    originalFood: string;
    suggestedAlternative: string;
    portionMatch: string;
    macrosPreserved: string;
  };
  visionAnalysis?: {
    identifiedItems: string[];
    complianceEstimate: string;
    fiberVegetableScore: 'excelente' | 'moderado' | 'baixo';
  };
  audioTranscribed?: string;
  audioDurationSeconds?: number;
}

export interface PatientContextPayload {
  patient: PatientSummary;
  anamnese: AnamneseData;
  bodyComposition: BodyComposition;
  biomarkers: Biomarker[];
  meals: Meal[];
  substitutionRules: SubstitutionRule[];
  clinicConfig: ClinicConfig;
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

export interface AudioTranscriptionSegment {
  id: string;
  timestamp: string;
  secondsOffset: number;
  speaker: 'patient' | 'nutritionist';
  text: string;
  confidenceScore: number;
  detectedEntities?: {
    type: 'treino' | 'aversao' | 'bristol' | 'sono' | 'agua' | 'queixa';
    label: string;
    field: string;
  }[];
}

export interface ConsultationRecordingRecord {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  durationSeconds: number;
  formattedDuration: string;
  status: 'gravando' | 'pausado' | 'processado' | 'arquivado';
  audioQualityScore: number;
  audioSource: 'microphone_live' | 'audio_sample_simulation';
  audioUrl?: string;
  notes?: string;
  segments: AudioTranscriptionSegment[];
  summaryExtracted: {
    mainComplaints?: string;
    training?: string;
    sleep?: string;
    hydration?: string;
    bristolType?: number;
    aversions?: string[];
  };
  storageKey: string;
  cfnComplianceEncrypted: boolean;
}

export interface MealPlanPdfExport {
  id: string;
  version: string;
  title: string;
  patientId: string;
  patientName: string;
  targetKcal: number;
  mealsCount: number;
  generatedAt: string;
  fileSizeKb: number;
  status: 'gerado' | 'enviado_whatsapp' | 'visualizado_paciente';
  viewedAt?: string;
  authenticityHash: string;
  signedBy: string;
  crn: string;
  downloadUrl?: string;
}
