import { 
  PatientSummary, 
  Biomarker, 
  BodyComposition, 
  AnamneseData,
  Meal, 
  SubstitutionRule, 
  ScribeMessage, 
  ClinicConfig, 
  ComplianceChecklist 
} from '../types';

export const CURRENT_PATIENT: PatientSummary = {
  id: 'pat-001',
  name: 'Manuela Rocchetto',
  age: 21,
  height: 165,
  weight: 62.4,
  gender: 'feminino',
  goal: 'Hipertrofia',
  targetKcal: 2100,
  targetPtn: 140, // 2.24 g/kg
  targetCho: 250, // 4.00 g/kg
  targetLip: 60,  // 0.96 g/kg
  ptnPerKg: 2.24,
  choPerKg: 4.0,
  lipPerKg: 0.96,
  bmr: 1552, // Cunningham: 500 + 22 * 47.8 = 1551.6 (arredondado para 1552 kcal)
  bmrFormula: 'cunningham',
  get: 2405, // 1552 * 1.55 (Moderado: musculação 5x/semana)
  activityFactor: 1.55,
  activityLevel: 'Moderado (Musculação 5x/sem)',
  calorieGoalAdjustment: -12.7, // Déficit/Ajuste planejado em relação ao GET esportivo para início de ciclo
  phone: '+55 11 98765-4321',
  status: 'Na Sala de Espera',
  ocrReady: true,
  appointmentTime: '14:00',
  attendanceDate: '15 de Setembro de 2026',
  whatsappComplianceRate: 95,
  avatarInitials: 'MR'
};

export const ALL_PATIENTS: PatientSummary[] = [
  CURRENT_PATIENT,
  {
    id: 'pat-002',
    name: 'Carlos Almeida',
    age: 34,
    height: 178,
    weight: 84.5,
    goal: 'Emagrecimento',
    targetKcal: 1850,
    bmr: 1680,
    get: 2350,
    phone: '+55 21 99999-1111',
    status: 'Retorno 30d',
    ocrReady: false,
    appointmentTime: '15:30',
    attendanceDate: '15 de Setembro de 2026',
    whatsappComplianceRate: 45,
    avatarInitials: 'CA'
  },
  {
    id: 'pat-003',
    name: 'Fernanda Lima',
    age: 28,
    height: 170,
    weight: 59.2,
    goal: 'Performance Esportiva',
    targetKcal: 2400,
    bmr: 1390,
    get: 2600,
    phone: '+55 11 97777-8888',
    status: 'Ciclo Maratona SP',
    ocrReady: true,
    appointmentTime: '17:00',
    attendanceDate: '15 de Setembro de 2026',
    whatsappComplianceRate: 88,
    avatarInitials: 'FL'
  },
  {
    id: 'pat-004',
    name: 'Lucas Mendonça',
    age: 26,
    height: 182,
    weight: 75.0,
    goal: 'Hipertrofia Vegetariana',
    targetKcal: 2500,
    bmr: 1720,
    get: 2550,
    phone: '+55 11 96666-5555',
    status: 'Primeira Consulta',
    ocrReady: false,
    appointmentTime: '18:15',
    attendanceDate: '15 de Setembro de 2026',
    whatsappComplianceRate: 90,
    avatarInitials: 'LM'
  }
];

export const INITIAL_BIOMARKERS: Biomarker[] = [
  {
    id: 'bio-1',
    name: 'Ferritina Sérica',
    unit: 'ng/mL',
    result: 18,
    conventionalRef: '10 a 120 ng/mL',
    functionalTarget: '50 a 150 ng/mL',
    status: 'critico',
    interpretation: 'DEFICIÊNCIA (Prescrever Ferro Quelato / Bisglicinato)',
    date: '10/09/2026'
  },
  {
    id: 'bio-2',
    name: '25-Hidroxivitamina D',
    unit: 'ng/mL',
    result: 24,
    conventionalRef: '20 a 60 ng/mL',
    functionalTarget: '40 a 60 ng/mL',
    status: 'alerta',
    interpretation: 'SUBÓTIMA (Suplementar 2.000 a 4.000 UI)',
    date: '10/09/2026'
  },
  {
    id: 'bio-3',
    name: 'Glicemia de Jejum',
    unit: 'mg/dL',
    result: 92,
    conventionalRef: '70 a 99 mg/dL',
    functionalTarget: '75 a 85 mg/dL',
    status: 'normal',
    interpretation: 'EUGLEMICIDADE NORMAL',
    date: '10/09/2026'
  },
  {
    id: 'bio-4',
    name: 'Proteína C-Reativa Ultrassensível',
    unit: 'mg/L',
    result: 0.8,
    conventionalRef: '< 1.0 mg/L',
    functionalTarget: '< 0.5 mg/L',
    status: 'normal',
    interpretation: 'BAIXO RISCO INFLAMATÓRIO',
    date: '10/09/2026'
  }
];

export const INITIAL_ANAMNESE: AnamneseData = {
  consultationGoal: 'Ganho de massa magra (Hipertrofia) com redução de desconforto gástrico e melhora da disposição.',
  mainComplaints: 'Sonolência pós-almoço e constipação intestinal severa (3 dias sem evacuar espontaneamente).',
  complaintsTimestamp: '12:05',
  trainingRoutine: {
    modality: 'Musculação Hipertrofia (Treino ABC)',
    schedule: '07:00 às 08:15',
    frequency: '5x por semana',
    timestamp: '12:07',
    isLiveFilled: true
  },
  sleepRoutine: {
    hoursPerNight: 6.5,
    quality: 'Sono fragmentado, acorda com cansaço residual',
    timestamp: '12:08',
    isLiveFilled: true
  },
  hydration: {
    litersPerDay: 2.2,
    timestamp: '12:09',
    isLiveFilled: true
  },
  gastrointestinal: {
    bristolType: 2, // Tipo 2: Em forma de salsicha, mas encaroçada (constipação)
    symptoms: ['Distensão abdominal', 'Gases frequentes ao final da tarde', 'Azia esporádica'],
    timestamp: '12:05',
    isLiveFilled: true
  },
  aversions: [
    'Lactose (Leve desconforto / cólica)',
    'Batata-Doce (Enjoo severo / aversão gustativa)'
  ],
  discrepancies: [
    {
      id: 'disc-1',
      field: 'Jejum vs Refeição Matinal',
      statementA: { text: 'Informou na abertura: "Faço jejum intermitente de 14h diariamente até o almoço"', timestamp: '12:01' },
      statementB: { text: 'Informou na rotina: "Como 2 torradas com café com leite e queijo às 08:00 antes do trabalho"', timestamp: '12:11' },
      status: 'pendente'
    }
  ],
  audioQuality: {
    confidenceScore: 96,
    hasExcessiveNoise: false
  }
};

export const INITIAL_BODY_COMPOSITION: BodyComposition = {
  currentWeight: 62.4,
  previousWeight: 60.5,
  height: 165,
  bodyFatPercent: 23.4,
  fatMassKg: 14.6,
  leanMassKg: 47.8, // Massa Livre de Gordura (MLG)
  targetLeanMassKg: 50.5,
  bmrCunningham: 1552, // 500 + 22 * 47.8 = 1551.6 (arredondado para 1552 kcal)
  getCalculated: 2405, // 1552 * 1.55 (Moderado: musculação 5x/sem)
  skinfoldProtocol: 'jp7',
  skinfolds: {
    triceps: 14.0,
    subscapular: 12.5,
    suprailiac: 16.2,
    abdominal: 18.0,
    axillary: 11.0,
    pectoral: 8.5,
    thigh: 21.0,
    sum7: 91.2,
    bodyFatPercent: 22.8
  },
  circumferences: {
    waist: 68.5,
    hip: 96.0,
    relaxedArm: 26.2,
    contractedArm: 28.1,
    thigh: 54.0
  },
  historicalRecords: [
    {
      date: '15/06/2026',
      weight: 59.8,
      leanMassKg: 45.2,
      fatMassKg: 14.6,
      bodyFatPercent: 24.4,
      bodyWaterPercent: 53.2
    },
    {
      date: '02/08/2026',
      weight: 60.5,
      leanMassKg: 46.5,
      fatMassKg: 14.0,
      bodyFatPercent: 23.1,
      bodyWaterPercent: 54.1
    },
    {
      date: '15/09/2026',
      weight: 62.4,
      leanMassKg: 47.8,
      fatMassKg: 14.6,
      bodyFatPercent: 23.4,
      bodyWaterPercent: 55.0
    }
  ],
  posturalPhotos: {
    anteriorUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&auto=format&fit=crop&q=80',
    lateralUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&auto=format&fit=crop&q=80',
    posteriorUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    isEncryptedAes256: true,
    date: '15/09/2026',
    cfn856ComplianceVerified: true
  }
};

export const INITIAL_MEALS: Meal[] = [
  {
    id: 'meal-1',
    name: 'Refeição 1: Desjejum Proteico',
    time: '07:30',
    targetPtn: 32,
    targetCho: 45,
    targetLip: 16,
    targetKcal: 450,
    currentLeucine: 2.8,
    leucineThresholdMet: true,
    items: [
      {
        id: 'food-101',
        name: 'Ovos de Galinha Inteiros Cozidos',
        householdMeasure: '2 unidades médias',
        weightGrams: 100,
        ptn: 13.0,
        cho: 1.0,
        lip: 10.0,
        kcal: 146,
        leucineGrams: 1.1,
        sourceTable: 'TACO'
      },
      {
        id: 'food-102',
        name: 'Clara de Ovo Pasteurizada',
        householdMeasure: '2 claras (60ml)',
        weightGrams: 60,
        ptn: 6.5,
        cho: 0.4,
        lip: 0.1,
        kcal: 32,
        leucineGrams: 0.6,
        sourceTable: 'TACO'
      },
      {
        id: 'food-103',
        name: 'Pão de Forma Integral',
        householdMeasure: '2 fatias',
        weightGrams: 50,
        ptn: 5.0,
        cho: 24.0,
        lip: 1.5,
        kcal: 125,
        leucineGrams: 0.3,
        sourceTable: 'TBCA'
      },
      {
        id: 'food-104',
        name: 'Mamão Papaia',
        householdMeasure: '1/2 unidade',
        weightGrams: 140,
        ptn: 0.8,
        cho: 14.5,
        lip: 0.1,
        kcal: 62,
        leucineGrams: 0.1,
        sourceTable: 'TACO'
      },
      {
        id: 'food-105',
        name: 'Whey Protein Isolado 90%',
        householdMeasure: '1/2 scoop (15g)',
        weightGrams: 15,
        ptn: 13.5,
        cho: 0.5,
        lip: 0.2,
        kcal: 58,
        leucineGrams: 1.4,
        sourceTable: 'USDA'
      }
    ]
  },
  {
    id: 'meal-2',
    name: 'Refeição 2: Almoço Principal',
    time: '12:30',
    targetPtn: 40,
    targetCho: 75,
    targetLip: 18,
    targetKcal: 620,
    currentLeucine: 3.2,
    leucineThresholdMet: true,
    items: [
      {
        id: 'food-201',
        name: 'Peito de Frango Grelhado',
        householdMeasure: '1 filé médio',
        weightGrams: 150,
        ptn: 46.5,
        cho: 0.0,
        lip: 3.8,
        kcal: 238,
        leucineGrams: 2.7,
        sourceTable: 'TACO'
      },
      {
        id: 'food-202',
        name: 'Arroz Branco Cozido',
        householdMeasure: '5 colheres de sopa cheias',
        weightGrams: 160,
        ptn: 4.0,
        cho: 44.8,
        lip: 0.4,
        kcal: 205,
        leucineGrams: 0.3,
        sourceTable: 'TACO'
      },
      {
        id: 'food-203',
        name: 'Feijão Carioca Cozido (Caldo Médio)',
        householdMeasure: '1 concha média',
        weightGrams: 100,
        ptn: 4.8,
        cho: 13.6,
        lip: 0.5,
        kcal: 76,
        leucineGrams: 0.4,
        sourceTable: 'TACO'
      },
      {
        id: 'food-204',
        name: 'Azeite de Oliva Extravirgem',
        householdMeasure: '1 colher de sobremesa',
        weightGrams: 8,
        ptn: 0.0,
        cho: 0.0,
        lip: 8.0,
        kcal: 72,
        leucineGrams: 0.0,
        sourceTable: 'TACO'
      }
    ]
  },
  {
    id: 'meal-3',
    name: 'Refeição 3: Pré-Treino Energético',
    time: '16:30',
    targetPtn: 24,
    targetCho: 65,
    targetLip: 8,
    targetKcal: 430,
    currentLeucine: 2.6,
    leucineThresholdMet: true,
    items: [
      {
        id: 'food-301',
        name: 'Iogurte Natural Desnatado',
        householdMeasure: '1 pote (160g)',
        weightGrams: 160,
        ptn: 6.5,
        cho: 9.0,
        lip: 0.5,
        kcal: 68,
        leucineGrams: 0.7,
        sourceTable: 'TBCA'
      },
      {
        id: 'food-302',
        name: 'Aveia em Flocos Finos',
        householdMeasure: '3 colheres de sopa',
        weightGrams: 45,
        ptn: 6.2,
        cho: 28.0,
        lip: 3.2,
        kcal: 172,
        leucineGrams: 0.4,
        sourceTable: 'TACO'
      },
      {
        id: 'food-303',
        name: 'Banana Prata',
        householdMeasure: '1 unidade média',
        weightGrams: 85,
        ptn: 1.1,
        cho: 22.0,
        lip: 0.1,
        kcal: 83,
        leucineGrams: 0.1,
        sourceTable: 'TACO'
      },
      {
        id: 'food-304',
        name: 'Whey Protein Concentrado 80%',
        householdMeasure: '1/2 scoop (15g)',
        weightGrams: 15,
        ptn: 12.0,
        cho: 1.5,
        lip: 1.0,
        kcal: 62,
        leucineGrams: 1.4,
        sourceTable: 'USDA'
      }
    ]
  },
  {
    id: 'meal-4',
    name: 'Refeição 4: Jantar Recuperativo',
    time: '20:00',
    targetPtn: 38,
    targetCho: 55,
    targetLip: 14,
    targetKcal: 500,
    currentLeucine: 2.9,
    leucineThresholdMet: true,
    items: [
      {
        id: 'food-401',
        name: 'Patinho Moído Grelhado',
        householdMeasure: '1 porção média (130g)',
        weightGrams: 130,
        ptn: 42.5,
        cho: 0.0,
        lip: 7.2,
        kcal: 236,
        leucineGrams: 2.8,
        sourceTable: 'TACO'
      },
      {
        id: 'food-402',
        name: 'Mandioca Cozida',
        householdMeasure: '3 pedaços médios',
        weightGrams: 120,
        ptn: 1.4,
        cho: 44.0,
        lip: 0.3,
        kcal: 188,
        leucineGrams: 0.1,
        sourceTable: 'TACO'
      },
      {
        id: 'food-403',
        name: 'Salada de Folhas Verdes e Tomate',
        householdMeasure: '1 prato raso à vontade',
        weightGrams: 100,
        ptn: 1.5,
        cho: 3.5,
        lip: 0.2,
        kcal: 22,
        leucineGrams: 0.0,
        sourceTable: 'TACO'
      },
      {
        id: 'food-404',
        name: 'Azeite de Oliva Extravirgem',
        householdMeasure: '1 colher de chá',
        weightGrams: 5,
        ptn: 0.0,
        cho: 0.0,
        lip: 5.0,
        kcal: 45,
        leucineGrams: 0.0,
        sourceTable: 'TACO'
      }
    ]
  },
  {
    id: 'meal-5',
    name: 'Refeição 5: Ceia Anticatólica',
    time: '22:30',
    targetPtn: 16,
    targetCho: 10,
    targetLip: 8,
    targetKcal: 180,
    currentLeucine: 1.8,
    leucineThresholdMet: false,
    items: [
      {
        id: 'food-501',
        name: 'Queijo Cottage 0% Gordura',
        householdMeasure: '2 colheres de sopa cheias',
        weightGrams: 80,
        ptn: 12.0,
        cho: 2.4,
        lip: 0.5,
        kcal: 62,
        leucineGrams: 1.2,
        sourceTable: 'TBCA'
      },
      {
        id: 'food-502',
        name: 'Castanhas-do-Pará (Brasil)',
        householdMeasure: '2 unidades',
        weightGrams: 10,
        ptn: 1.5,
        cho: 1.2,
        lip: 6.6,
        kcal: 65,
        leucineGrams: 0.1,
        sourceTable: 'TACO'
      }
    ]
  }
];

export const INITIAL_SUBSTITUTION_RULES: SubstitutionRule[] = [
  {
    id: 'sub-1',
    originalFood: 'Peito de Frango Grelhado',
    originalGrams: 150,
    originalPtn: 46.5,
    alternatives: [
      {
        id: 'alt-1',
        foodName: 'Patinho Moído Grelhado',
        weightGrams: 140,
        householdMeasure: '4 colheres de sopa cheias',
        ptn: 45.8,
        cho: 0.0,
        lip: 7.8,
        kcal: 254
      },
      {
        id: 'alt-2',
        foodName: 'Filé de Tilápia Grelhado',
        weightGrams: 170,
        householdMeasure: '1 filé grande',
        ptn: 44.2,
        cho: 0.0,
        lip: 2.8,
        kcal: 202
      },
      {
        id: 'alt-3',
        foodName: 'Ovos Cozidos + Claras',
        weightGrams: 180,
        householdMeasure: '2 ovos inteiros + 3 claras',
        ptn: 36.0,
        cho: 1.5,
        lip: 10.5,
        kcal: 245
      }
    ]
  },
  {
    id: 'sub-2',
    originalFood: 'Arroz Branco Cozido',
    originalGrams: 160,
    originalPtn: 4.0,
    alternatives: [
      {
        id: 'alt-4',
        foodName: 'Mandioca Cozida',
        weightGrams: 130,
        householdMeasure: '3 pedaços pequenos',
        ptn: 1.5,
        cho: 47.0,
        lip: 0.4,
        kcal: 203
      },
      {
        id: 'alt-5',
        foodName: 'Batata Inglesa Cozida / Purê',
        weightGrams: 200,
        householdMeasure: '2 batatas médias',
        ptn: 2.8,
        cho: 44.0,
        lip: 0.2,
        kcal: 194
      }
    ]
  }
];

export const INITIAL_SCRIBE_MESSAGES: ScribeMessage[] = [
  {
    id: 'msg-1',
    timestamp: '12:02',
    speaker: 'patient',
    text: 'Fui na farmácia ontem de manhã em jejum e deu exatos 62 quilos e 400 gramas.',
    detectedEntities: {
      type: 'weight',
      label: 'Peso salvo: 62.4 kg pré-carregado',
      fieldUpdated: 'bodyComposition.currentWeight',
      badgeColor: 'green'
    }
  },
  {
    id: 'msg-2',
    timestamp: '12:04',
    speaker: 'nutritionist',
    text: 'Ótimo, Manuela. E como ficou a digestão das refeições que combinamos no ciclo passado?'
  },
  {
    id: 'msg-3',
    timestamp: '12:05',
    speaker: 'patient',
    text: 'Aquele negócio da batata-doce, não aguento mais. Me dá enjoo só de pensar! E meu intestino travou faz 3 dias, sinto muita sonolência pós-almoço.',
    detectedEntities: {
      type: 'aversion',
      label: 'Batata-doce excluída do solver & Constipação detectada',
      fieldUpdated: 'aversions',
      badgeColor: 'blue'
    }
  },
  {
    id: 'msg-4',
    timestamp: '12:06',
    speaker: 'ai',
    text: 'Recomendação do Copiloto HiGHS: Detectado padrão de Ferritina em 18 ng/mL combinado com queixa de cansaço. Sugiro prescrever Ferro Bisglicinato 30mg + Vitamina C na tela de finalização.'
  }
];

export const DEFAULT_CLINIC_CONFIG: ClinicConfig = {
  activeFoodBanks: {
    taco: true,
    tbca: true,
    usda: false
  },
  solverTolerance: 'moderada',
  integerPortions: true,
  enforceLeucineGate: true,
  whatsappPersona: 'assistente_1p',
  photoCheckins: true,
  autoForwardAlerts: true
};

export const INITIAL_COMPLIANCE: ComplianceChecklist = {
  leucineRequirementMet: true,
  aversionRespected: true,
  supplementationChecked: true,
  tacoTbcaCalibrated: true,
  humanReviewSigned: true,
  cfn856DeclarationAccepted: true,
  twoFactorToken: 'CFN-AUTH-98421-2026',
  signatureDate: '15/09/2026 14:42',
  professionalName: 'Dra. Camila Silveira',
  crnRegistry: 'CRN-3 / 48.912'
};
