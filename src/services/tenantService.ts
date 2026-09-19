import { ClinicTenant, NutritionistUser, PatientSummary } from '../types';
import { ALL_PATIENTS, CURRENT_PATIENT } from '../data/mockData';

export const CLINIC_STORAGE_KEY = 'talknutri_clinic_tenant';
export const NUTRITIONISTS_STORAGE_KEY = 'talknutri_nutritionists';
export const ACTIVE_NUTRI_STORAGE_KEY = 'talknutri_active_nutri_id';
export const PATIENTS_STORAGE_KEY = 'talknutri_patients_db';

export const DEFAULT_CLINIC: ClinicTenant = {
  id: 'clinic-alpha-01',
  name: 'Clínica Integrada de Nutrição & Performance Humana',
  tradeName: 'Clínica Dra. Maithe & Associadas',
  cnpj: '38.412.981/0001-44',
  plan: 'pro',
  active: true,
  createdAt: '01/01/2026',
  address: 'Av. Brigadeiro Faria Lima, 3477 - 12º Andar, Itaim Bibi, São Paulo - SP',
  phone: '+55 11 3088-9200'
};

export const DEFAULT_NUTRITIONISTS: NutritionistUser[] = [
  {
    id: 'nutri-maithe',
    clinicId: 'clinic-alpha-01',
    name: 'Dra. Maithe',
    email: 'dra.maithe@talknutri.com.br',
    phone: '+55 11 98765-4321',
    crn: 'CRN-3 / 48.912',
    role: 'admin_nutri',
    specialty: 'Nutrição Esportiva, Hipertrofia & Metabólica',
    avatarInitials: 'DM',
    active: true,
    createdAt: '15/01/2026'
  },
  {
    id: 'nutri-patricia',
    clinicId: 'clinic-alpha-01',
    name: 'Dra. Patrícia Fontes',
    email: 'patricia.fontes@talknutri.com.br',
    phone: '+55 11 97123-9988',
    crn: 'CRN-3 / 52.140',
    role: 'nutri',
    specialty: 'Nutrição Clínica Funcional & Saúde Intestinal',
    avatarInitials: 'PF',
    active: true,
    createdAt: '10/02/2026'
  }
];

export const INITIAL_SEEDED_PATIENTS: PatientSummary[] = ALL_PATIENTS.map((p, idx) => ({
  ...p,
  clinicId: 'clinic-alpha-01',
  // Os primeiros são da Dra. Maithe, o último pode ser demonstrativo de outra nutri para demonstrar isolamento
  nutritionistId: idx === 3 ? 'nutri-patricia' : 'nutri-maithe',
  gender: p.gender || (idx === 0 || idx === 2 ? 'feminino' : 'masculino'),
  cpf: idx === 0 ? '382.910.458-12' : `421.${100 + idx}.890-0${idx}`,
  email: `${p.name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
  birthDate: '1998-05-14',
  createdAt: '2026-09-01'
}));

export const tenantService = {
  getClinic(): ClinicTenant {
    try {
      const stored = localStorage.getItem(CLINIC_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Erro ao ler clinic do storage:', e);
    }
    return DEFAULT_CLINIC;
  },

  getNutritionists(): NutritionistUser[] {
    try {
      const stored = localStorage.getItem(NUTRITIONISTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Erro ao ler nutricionistas do storage:', e);
    }
    return DEFAULT_NUTRITIONISTS;
  },

  getActiveNutritionistId(): string {
    try {
      const stored = localStorage.getItem(ACTIVE_NUTRI_STORAGE_KEY);
      if (stored) return stored;
    } catch (e) {
      console.warn('Erro ao ler active nutri id:', e);
    }
    return 'nutri-maithe'; // Padrão: Dra. Maithe
  },

  getActiveNutritionist(): NutritionistUser {
    const list = this.getNutritionists();
    const activeId = this.getActiveNutritionistId();
    return list.find(n => n.id === activeId) || list[0] || DEFAULT_NUTRITIONISTS[0];
  },

  setActiveNutritionist(id: string): void {
    try {
      localStorage.setItem(ACTIVE_NUTRI_STORAGE_KEY, id);
    } catch (e) {
      console.warn('Erro ao salvar active nutri id:', e);
    }
  },

  getAllPatients(): PatientSummary[] {
    try {
      const stored = localStorage.getItem(PATIENTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Erro ao ler pacientes do storage:', e);
    }
    // Salva a base inicial se estiver vazia
    try {
      localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(INITIAL_SEEDED_PATIENTS));
    } catch {}
    return INITIAL_SEEDED_PATIENTS;
  },

  getPatientsByNutritionist(nutriId: string): PatientSummary[] {
    const all = this.getAllPatients();
    return all.filter(p => (p.nutritionistId || 'nutri-maithe') === nutriId);
  },

  savePatients(patients: PatientSummary[]): void {
    try {
      localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(patients));
    } catch (e) {
      console.error('Falha ao persistir pacientes:', e);
    }
  },

  calculateMetabolicEstimates(params: {
    weightKg: number;
    heightCm: number;
    age: number;
    gender: 'feminino' | 'masculino';
    activityFactor: number;
    goal: string;
  }): {
    bmr: number;
    get: number;
    targetKcal: number;
    targetPtn: number;
    targetCho: number;
    targetLip: number;
    ptnPerKg: number;
    choPerKg: number;
    lipPerKg: number;
  } {
    const { weightKg, heightCm, age, gender, activityFactor, goal } = params;

    // Fórmula de Mifflin-St Jeor como base antropométrica inicial
    let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
    if (gender === 'feminino') {
      bmr -= 161;
    } else {
      bmr += 5;
    }
    bmr = Math.round(bmr);

    // Gasto Energético Total
    const get = Math.round(bmr * activityFactor);

    // VET Alvo com base no objetivo clínico
    let targetKcal = get;
    let ptnPerKg = 2.0;
    let lipPerKg = 0.9;

    const lowerGoal = goal.toLowerCase();
    if (lowerGoal.includes('hipertrofia') || lowerGoal.includes('massa')) {
      targetKcal = Math.round(get + 300);
      ptnPerKg = 2.2;
      lipPerKg = 0.95;
    } else if (lowerGoal.includes('emagrecimento') || lowerGoal.includes('defini') || lowerGoal.includes('gordura')) {
      targetKcal = Math.round(Math.max(1200, get - 450));
      ptnPerKg = 2.1;
      lipPerKg = 0.8;
    } else if (lowerGoal.includes('performance') || lowerGoal.includes('maratona') || lowerGoal.includes('esporte')) {
      targetKcal = Math.round(get + 200);
      ptnPerKg = 2.0;
      lipPerKg = 1.0;
    } else {
      targetKcal = get;
      ptnPerKg = 1.8;
      lipPerKg = 0.9;
    }

    const targetPtn = Math.round(weightKg * ptnPerKg);
    const targetLip = Math.round(weightKg * lipPerKg);
    const kcalFromPtnLip = (targetPtn * 4) + (targetLip * 9);
    const remainingKcalCho = Math.max(200, targetKcal - kcalFromPtnLip);
    const targetCho = Math.round(remainingKcalCho / 4);
    const choPerKg = Number((targetCho / weightKg).toFixed(2));

    return {
      bmr,
      get,
      targetKcal,
      targetPtn,
      targetCho,
      targetLip,
      ptnPerKg,
      choPerKg,
      lipPerKg
    };
  },

  updateClinic(updates: Partial<ClinicTenant>): ClinicTenant {
    const current = this.getClinic();
    const updated: ClinicTenant = {
      ...current,
      ...updates
    };
    try {
      localStorage.setItem(CLINIC_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Falha ao salvar clinic:', e);
    }
    return updated;
  },

  saveNutritionists(nutritionists: NutritionistUser[]): void {
    try {
      localStorage.setItem(NUTRITIONISTS_STORAGE_KEY, JSON.stringify(nutritionists));
    } catch (e) {
      console.error('Falha ao salvar nutricionistas:', e);
    }
  },

  createNutritionist(
    data: Omit<NutritionistUser, 'id' | 'clinicId' | 'createdAt' | 'patientsCount'>
  ): NutritionistUser {
    const clinic = this.getClinic();
    const all = this.getNutritionists();

    const nameParts = data.name.trim().split(' ');
    const initials = nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : nameParts[0].substring(0, 2).toUpperCase();

    const newNutri: NutritionistUser = {
      id: `nutri-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
      clinicId: clinic.id,
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      crn: data.crn.trim(),
      role: data.role || 'nutri',
      specialty: data.specialty?.trim() || 'Nutrição Clínica',
      avatarInitials: data.avatarInitials || initials,
      active: data.active !== undefined ? data.active : true,
      notes: data.notes,
      accessGrantedAt: new Date().toLocaleDateString('pt-BR'),
      createdAt: new Date().toISOString()
    };

    const updated = [...all, newNutri];
    this.saveNutritionists(updated);
    return newNutri;
  },

  updateNutritionist(id: string, updates: Partial<NutritionistUser>): NutritionistUser | null {
    const all = this.getNutritionists();
    const index = all.findIndex(n => n.id === id);
    if (index === -1) return null;

    const updatedNutri: NutritionistUser = {
      ...all[index],
      ...updates
    };

    all[index] = updatedNutri;
    this.saveNutritionists(all);
    return updatedNutri;
  },

  toggleNutritionistAccess(id: string, active: boolean): NutritionistUser | null {
    return this.updateNutritionist(id, { 
      active, 
      accessGrantedAt: active ? new Date().toLocaleDateString('pt-BR') : undefined 
    });
  },

  deleteNutritionist(id: string): boolean {
    const all = this.getNutritionists();
    const filtered = all.filter(n => n.id !== id);
    if (filtered.length === all.length) return false;
    this.saveNutritionists(filtered);
    return true;
  },

  createPatient(
    patientData: PatientSummary | {
      name: string;
      cpf?: string;
      email?: string;
      phone: string;
      age: number;
      birthDate?: string;
      gender?: 'feminino' | 'masculino';
      height: number;
      weight: number;
      goal: string;
      activityLevel: string;
      activityFactor: number;
      notes?: string;
    },
    nutriId?: string,
    clinicId?: string
  ): PatientSummary {
    const all = this.getAllPatients();

    // Se já é um PatientSummary completo (ex: vindo de NovoPacienteModal)
    if ('id' in patientData && 'whatsappComplianceRate' in patientData) {
      const fullPatient = patientData as PatientSummary;
      const updated = [fullPatient, ...all.filter(p => p.id !== fullPatient.id)];
      this.savePatients(updated);
      return fullPatient;
    }

    const activeNutriId = nutriId || this.getActiveNutritionistId();
    const activeClinicId = clinicId || this.getClinic().id;

    // Calcular telemetria inicial
    const calculated = this.calculateMetabolicEstimates({
      weightKg: patientData.weight,
      heightCm: patientData.height,
      age: patientData.age,
      gender: patientData.gender || 'feminino',
      activityFactor: patientData.activityFactor,
      goal: patientData.goal
    });

    const nameParts = patientData.name.trim().split(' ');
    const initials = nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : nameParts[0].substring(0, 2).toUpperCase();

    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

    const newPatient: PatientSummary = {
      id: `pat-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      clinicId: activeClinicId,
      nutritionistId: activeNutriId,
      name: patientData.name.trim(),
      cpf: patientData.cpf,
      email: patientData.email,
      phone: patientData.phone,
      age: patientData.age,
      birthDate: patientData.birthDate,
      gender: patientData.gender || 'feminino',
      height: patientData.height,
      weight: patientData.weight,
      goal: patientData.goal,
      targetKcal: calculated.targetKcal,
      targetPtn: calculated.targetPtn,
      targetCho: calculated.targetCho,
      targetLip: calculated.targetLip,
      ptnPerKg: calculated.ptnPerKg,
      choPerKg: calculated.choPerKg,
      lipPerKg: calculated.lipPerKg,
      bmr: calculated.bmr,
      bmrFormula: 'mifflin',
      get: calculated.get,
      activityFactor: patientData.activityFactor,
      activityLevel: patientData.activityLevel,
      calorieGoalAdjustment: Math.round(((calculated.targetKcal - calculated.get) / calculated.get) * 100),
      status: 'Novo Paciente Cadastrado',
      ocrReady: false,
      appointmentTime: timeStr,
      attendanceDate: dateStr,
      whatsappComplianceRate: 100, // Inicia em 100% no onboarding
      avatarInitials: initials,
      notes: patientData.notes,
      createdAt: now.toISOString()
    };

    const updated = [newPatient, ...all];
    this.savePatients(updated);

    return newPatient;
  },

  updatePatient(id: string, updates: Partial<PatientSummary>): PatientSummary | null {
    const all = this.getAllPatients();
    const index = all.findIndex(p => p.id === id);
    if (index === -1) return null;

    const current = all[index];
    const updatedPatient: PatientSummary = {
      ...current,
      ...updates
    };

    all[index] = updatedPatient;
    this.savePatients(all);
    return updatedPatient;
  },

  deletePatient(id: string): boolean {
    const all = this.getAllPatients();
    const filtered = all.filter(p => p.id !== id);
    if (filtered.length === all.length) return false;
    this.savePatients(filtered);
    return true;
  }
};
