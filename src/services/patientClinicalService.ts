import { 
  Meal, 
  Biomarker, 
  BodyComposition, 
  AnamneseData, 
  SubstitutionRule, 
  ScribeMessage, 
  MealPlanPdfExport, 
  PatientSummary 
} from '../types';
import { 
  INITIAL_MEALS, 
  INITIAL_BIOMARKERS, 
  INITIAL_BODY_COMPOSITION, 
  INITIAL_ANAMNESE, 
  INITIAL_SUBSTITUTION_RULES, 
  INITIAL_SCRIBE_MESSAGES 
} from '../data/mockData';

export interface PatientClinicalData {
  patientId: string;
  meals: Meal[];
  biomarkers: Biomarker[];
  bodyComposition: BodyComposition;
  anamnese: AnamneseData;
  substitutionRules: SubstitutionRule[];
  recordings: any[];
  pdfHistory: MealPlanPdfExport[];
  scribeMessages: ScribeMessage[];
}

const STORAGE_PREFIX = 'talknutri_patient_record_';

export const patientClinicalService = {
  /**
   * Obtém a chave de armazenamento para o prontuário de um paciente específico
   */
  getStorageKey(patientId: string): string {
    return `${STORAGE_PREFIX}${patientId}`;
  },

  /**
   * Cria uma estrutura clínica limpa e realista para um novo paciente
   * (Sem mock carregado de aversões a batata-doce, sem exames fleury da Manuela, sem dobras fake)
   */
  createCleanClinicalRecord(patient: PatientSummary): PatientClinicalData {
    const recommendedWaterLiters = Number(((patient.weight * 35) / 1000).toFixed(1));

    // Refeições base limpas (templates vazios prontos para prescrição ou geração pelo Solver)
    const cleanMeals: Meal[] = [
      {
        id: `meal-${patient.id}-1`,
        name: 'Café da Manhã',
        time: '07:30',
        targetPtn: Math.round((patient.targetPtn || 140) * 0.25),
        targetCho: Math.round((patient.targetCho || 250) * 0.25),
        targetLip: Math.round((patient.targetLip || 60) * 0.25),
        targetKcal: Math.round(patient.targetKcal * 0.25),
        items: [],
        leucineThresholdMet: false,
        currentLeucine: 0
      },
      {
        id: `meal-${patient.id}-2`,
        name: 'Almoço',
        time: '12:30',
        targetPtn: Math.round((patient.targetPtn || 140) * 0.35),
        targetCho: Math.round((patient.targetCho || 250) * 0.35),
        targetLip: Math.round((patient.targetLip || 60) * 0.35),
        targetKcal: Math.round(patient.targetKcal * 0.35),
        items: [],
        leucineThresholdMet: false,
        currentLeucine: 0
      },
      {
        id: `meal-${patient.id}-3`,
        name: 'Lanche da Tarde',
        time: '16:00',
        targetPtn: Math.round((patient.targetPtn || 140) * 0.15),
        targetCho: Math.round((patient.targetCho || 250) * 0.15),
        targetLip: Math.round((patient.targetLip || 60) * 0.15),
        targetKcal: Math.round(patient.targetKcal * 0.15),
        items: [],
        leucineThresholdMet: false,
        currentLeucine: 0
      },
      {
        id: `meal-${patient.id}-4`,
        name: 'Jantar',
        time: '19:30',
        targetPtn: Math.round((patient.targetPtn || 140) * 0.25),
        targetCho: Math.round((patient.targetCho || 250) * 0.25),
        targetLip: Math.round((patient.targetLip || 60) * 0.25),
        targetKcal: Math.round(patient.targetKcal * 0.25),
        items: [],
        leucineThresholdMet: false,
        currentLeucine: 0
      }
    ];

    // Avaliação física inicial zerada, baseada no peso e altura informados no cadastro
    const cleanBodyComp: BodyComposition = {
      currentWeight: patient.weight,
      previousWeight: patient.weight,
      height: patient.height,
      bodyFatPercent: 0,
      fatMassKg: 0,
      leanMassKg: patient.weight,
      targetLeanMassKg: patient.weight,
      bmrCunningham: patient.bmr,
      getCalculated: patient.get,
      skinfoldProtocol: 'jp7',
      skinfolds: {
        triceps: 0,
        subscapular: 0,
        suprailiac: 0,
        abdominal: 0,
        axillary: 0,
        pectoral: 0,
        thigh: 0,
        sum7: 0,
        bodyFatPercent: 0
      },
      circumferences: {
        waist: 0,
        hip: 0,
        relaxedArm: 0,
        contractedArm: 0,
        thigh: 0
      },
      historicalRecords: [],
      posturalPhotos: {
        anteriorUrl: '',
        lateralUrl: '',
        posteriorUrl: '',
        isEncryptedAes256: true,
        date: new Date().toLocaleDateString('pt-BR'),
        cfn856ComplianceVerified: true
      }
    };

    // Anamnese limpa, apenas com dados reais do cadastro
    const cleanAnamnese: AnamneseData = {
      consultationGoal: patient.goal,
      mainComplaints: patient.notes?.trim() || 'Primeira consulta de acolhimento e planejamento nutricional.',
      complaintsTimestamp: patient.appointmentTime || '10:00',
      trainingRoutine: {
        modality: patient.activityLevel || 'Não informada',
        schedule: '',
        frequency: '',
        timestamp: '',
        isLiveFilled: false
      },
      sleepRoutine: {
        hoursPerNight: 7.5,
        quality: 'Não avaliado',
        timestamp: '',
        isLiveFilled: false
      },
      hydration: {
        litersPerDay: recommendedWaterLiters,
        timestamp: '',
        isLiveFilled: false
      },
      gastrointestinal: {
        bristolType: 4,
        symptoms: [],
        timestamp: '',
        isLiveFilled: false
      },
      aversions: [], // Vazio! Sem aversões mockadas
      discrepancies: [],
      audioQuality: {
        confidenceScore: 98,
        hasExcessiveNoise: false
      }
    };

    // Mensagem de abertura no copiloto contextualizada ao paciente
    const initialMessages: ScribeMessage[] = [
      {
        id: `msg-welcome-${patient.id}`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        speaker: 'ai',
        text: `Prontuário clínico aberto para **${patient.name}** (${patient.age} anos, ${patient.weight}kg, ${(patient.height/100).toFixed(2)}m). Meta: **${patient.goal}**. Gasto Energético Total (GET): ${patient.get} kcal/dia. VET Alvo: ${patient.targetKcal} kcal. Prontuário pronto para preenchimento via escuta ativa ou digitação direta.`
      }
    ];

    return {
      patientId: patient.id,
      meals: cleanMeals,
      biomarkers: [], // Vazio! Aguardando OCR ou inclusão manual de exames
      bodyComposition: cleanBodyComp,
      anamnese: cleanAnamnese,
      substitutionRules: [],
      recordings: [],
      pdfHistory: [],
      scribeMessages: initialMessages
    };
  },

  /**
   * Obtém os dados clínicos de um paciente. Se for o paciente de demonstração legado ('pat-1' ou 'pat-001'),
   * preserva os dados de exemplo ricos para fins de vitrine se ainda não houver alteração salva.
   */
  getPatientClinicalData(patient: PatientSummary): PatientClinicalData {
    const key = this.getStorageKey(patient.id);

    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.patientId === patient.id) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn(`Erro ao carregar prontuário do paciente ${patient.id}:`, e);
    }

    // Caso de demonstração retrocompatível para Manuela Silveira (pat-1 ou pat-001)
    if (patient.id === 'pat-1' || patient.id === 'pat-001' || patient.name?.includes('Manuela')) {
      const demoRecord: PatientClinicalData = {
        patientId: patient.id,
        meals: INITIAL_MEALS,
        biomarkers: INITIAL_BIOMARKERS,
        bodyComposition: INITIAL_BODY_COMPOSITION,
        anamnese: INITIAL_ANAMNESE,
        substitutionRules: INITIAL_SUBSTITUTION_RULES,
        recordings: [
          {
            id: 'rec-demo-1',
            patientId: patient.id,
            patientName: patient.name,
            date: '18/09/2026',
            formattedDuration: '18m 42s',
            audioQualityScore: 97,
            notes: 'Paciente relata treinos de musculação às 06h45, aversão estrita a batata-doce e intolerância à lactose.'
          }
        ],
        pdfHistory: [
          {
            id: 'pdf-export-demo-1',
            version: 'v1.0',
            title: `Plano_Alimentar_${patient.name.replace(/\s+/g, '_')}.pdf`,
            patientId: patient.id,
            patientName: patient.name,
            targetKcal: patient.targetKcal || 2100,
            mealsCount: 4,
            generatedAt: '18/09/2026 às 12:45',
            fileSizeKb: 2420,
            status: 'visualizado_paciente',
            viewedAt: '12:47 (via WhatsApp)',
            authenticityHash: 'SHA-256-CFN856-9B41-XF82',
            signedBy: 'Dra. Maithe',
            crn: 'CRN-3 / 48.912'
          }
        ],
        scribeMessages: INITIAL_SCRIBE_MESSAGES
      };

      try {
        localStorage.setItem(key, JSON.stringify(demoRecord));
      } catch {}

      return demoRecord;
    }

    // Para novos pacientes: cria e persiste registro 100% limpo
    const clean = this.createCleanClinicalRecord(patient);
    try {
      localStorage.setItem(key, JSON.stringify(clean));
    } catch {}

    return clean;
  },

  /**
   * Salva os dados clínicos atualizados de um paciente específico
   */
  savePatientClinicalData(patientId: string, data: Partial<PatientClinicalData>): void {
    const key = this.getStorageKey(patientId);
    try {
      const existing = localStorage.getItem(key);
      const base: Partial<PatientClinicalData> = existing ? JSON.parse(existing) : { patientId };
      const updated = {
        ...base,
        ...data,
        patientId
      };
      localStorage.setItem(key, JSON.stringify(updated));
    } catch (e) {
      console.error(`Erro ao persistir dados clínicos do paciente ${patientId}:`, e);
    }
  },

  /**
   * Reseta os dados clínicos de um paciente para o estado limpo
   */
  resetPatientClinicalData(patient: PatientSummary): PatientClinicalData {
    const clean = this.createCleanClinicalRecord(patient);
    const key = this.getStorageKey(patient.id);
    try {
      localStorage.setItem(key, JSON.stringify(clean));
    } catch {}
    return clean;
  }
};
