import React, { useState, useMemo } from 'react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Scale, 
  Ruler, 
  Activity, 
  Target, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Flame, 
  Zap,
  Building2,
  Stethoscope
} from 'lucide-react';
import { PatientSummary, NutritionistUser, ClinicTenant } from '../../types';
import { tenantService } from '../../services/tenantService';

interface NovoPacienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePatient: (newPatient: PatientSummary, autoStartConsultation: boolean) => void;
  nutritionist: NutritionistUser;
  clinic: ClinicTenant;
}

const ACTIVITY_LEVELS = [
  { value: 1.2, label: 'Sedentário', desc: 'Trabalho em escritório, sem exercícios regulares' },
  { value: 1.375, label: 'Leve (1-2x/sem)', desc: 'Caminhadas leves, musculação esporádica' },
  { value: 1.55, label: 'Moderado (3-5x/sem)', desc: 'Musculação intensa ou corrida 3-5x semana' },
  { value: 1.725, label: 'Intenso (6-7x/sem)', desc: 'Treinos diários pesados ou bi-sets' },
  { value: 1.9, label: 'Atleta Profissional', desc: 'Treinos duplos, alta exigência metabólica' }
];

const CLINICAL_GOALS = [
  { label: 'Hipertrofia & Ganho de Massa', category: 'hipertrofia' },
  { label: 'Emagrecimento & Definição', category: 'emagrecimento' },
  { label: 'Performance Esportiva / Endurance', category: 'performance' },
  { label: 'Reeducação Alimentar & Longevidade', category: 'manutencao' },
  { label: 'Saúde Gastrointestinal & Intolerâncias', category: 'gastro' }
];

export const NovoPacienteModal: React.FC<NovoPacienteModalProps> = ({
  isOpen,
  onClose,
  onSavePatient,
  nutritionist,
  clinic
}) => {
  // Form state
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+55 ');
  const [birthDate, setBirthDate] = useState('1998-06-15');
  const [age, setAge] = useState<number>(28);
  const [gender, setGender] = useState<'feminino' | 'masculino'>('feminino');
  const [height, setHeight] = useState<number>(168);
  const [weight, setWeight] = useState<number>(64.0);
  const [goal, setGoal] = useState<string>('Hipertrofia & Ganho de Massa');
  const [activityFactor, setActivityFactor] = useState<number>(1.55);
  const [notes, setNotes] = useState('');

  // Validation
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Recalcular idade quando data mudar
  const handleBirthDateChange = (val: string) => {
    setBirthDate(val);
    if (val) {
      const birth = new Date(val);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        calculatedAge--;
      }
      if (calculatedAge > 0 && calculatedAge < 120) {
        setAge(calculatedAge);
      }
    }
  };

  // Cálculo metabólico em tempo real
  const metabolicPreview = useMemo(() => {
    return tenantService.calculateMetabolicEstimates({
      weightKg: weight || 60,
      heightCm: height || 165,
      age: age || 25,
      gender,
      activityFactor,
      goal
    });
  }, [weight, height, age, gender, activityFactor, goal]);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!name.trim() || name.trim().length < 3) {
      errs.name = 'Nome completo é obrigatório (mínimo 3 caracteres)';
    }
    if (!phone.trim() || phone.length < 8) {
      errs.phone = 'Telefone/WhatsApp é obrigatório para o canal Zero-App';
    }
    if (!weight || weight < 30 || weight > 300) {
      errs.weight = 'Peso inválido (deve estar entre 30 e 300 kg)';
    }
    if (!height || height < 100 || height > 240) {
      errs.height = 'Altura inválida (deve estar entre 100 e 240 cm)';
    }
    if (!age || age < 10 || age > 110) {
      errs.age = 'Idade inválida';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = (autoStart: boolean) => {
    if (!validate()) return;

    const selectedActivityObj = ACTIVITY_LEVELS.find(a => a.value === activityFactor);
    const activityLabel = selectedActivityObj ? selectedActivityObj.label : 'Moderado';

    const newPatient = tenantService.createPatient(
      {
        name,
        cpf: cpf.trim() || undefined,
        email: email.trim() || undefined,
        phone,
        age,
        birthDate,
        gender,
        height,
        weight,
        goal,
        activityLevel: activityLabel,
        activityFactor,
        notes: notes.trim() || undefined
      },
      nutritionist.id,
      clinic.id
    );

    onSavePatient(newPatient, autoStart);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Cadastrar Novo Paciente</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  Prontuário Individual
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span className="flex items-center gap-1">
                  <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                  Nutricionista: <strong className="text-slate-700">{nutritionist.name}</strong> ({nutritionist.crn})
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Building2 className="w-3 h-3" />
                  {clinic.name}
                </span>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body with scroll */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(92vh-140px)]">
          
          {/* Camada Informativa de Governança */}
          <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-3.5 flex items-start gap-3">
            <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="text-xs text-blue-900 leading-relaxed">
              <span className="font-bold">Arquitetura de Isolamento Clínico:</span> Este paciente será registrado sob a titularidade exclusiva da <strong>{nutritionist.name}</strong> dentro da <strong>{clinic.tradeName}</strong>. Todos os planos alimentares e o canal Zero-App WhatsApp serão configurados automaticamente com assinatura digital e carimbo de autenticidade (CFN nº 856/2026).
            </div>
          </div>

          {/* Bloco 1: Dados Pessoais & Contato */}
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>1. Identificação & Contato (Zero-App WhatsApp)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome Completo do Paciente <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Gabriela Vasconcelos Ribeiro"
                    className={`w-full bg-slate-50 border rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-800 outline-none transition ${
                      errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 focus:border-blue-400 focus:bg-white'
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  WhatsApp / Celular <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
                  <input 
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+55 11 98765-4321"
                    className={`w-full bg-slate-50 border rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-800 outline-none transition ${
                      errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 focus:border-blue-400 focus:bg-white'
                    }`}
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Receberá os micro-check-ins e PDFs diretamente</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  E-mail do Paciente
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="gabriela@email.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CPF ou Registro Clínico
                </label>
                <input 
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nascimento
                  </label>
                  <input 
                    type="date"
                    value={birthDate}
                    onChange={(e) => handleBirthDateChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Idade <span className="text-slate-400">(anos)</span>
                  </label>
                  <input 
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    min={10}
                    max={110}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bloco 2: Perfil Antropométrico & Fisiológico */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>2. Parâmetros Antropométricos & Nível de Atividade</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sexo Biológico <span className="text-slate-400">(TMB)</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGender('feminino')}
                    className={`py-2 text-xs font-bold rounded-xl border transition ${
                      gender === 'feminino'
                        ? 'bg-rose-50 border-rose-300 text-rose-800'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Feminino
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('masculino')}
                    className={`py-2 text-xs font-bold rounded-xl border transition ${
                      gender === 'masculino'
                        ? 'bg-blue-50 border-blue-300 text-blue-800'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Masculino
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Peso Atual (kg) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Scale className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input 
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Altura (cm) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Ruler className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input 
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Objetivo Principal da Conduta <span className="text-rose-500">*</span>
                </label>
                <select 
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition"
                >
                  {CLINICAL_GOALS.map((g) => (
                    <option key={g.label} value={g.label}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nível de Atividade Física (Fator FAF)
                </label>
                <select 
                  value={activityFactor}
                  onChange={(e) => setActivityFactor(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition"
                >
                  {ACTIVITY_LEVELS.map((a) => (
                    <option key={a.value} value={a.value}>
                      {a.label} (FAF {a.value})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Bloco 3: Telemetria Metabólica Estimada (Ao Vivo) */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Estimativa Metabólica Basal (Mifflin-St Jeor & HiGHS)
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">
                Calibrado ao vivo
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-slate-800/80 rounded-xl p-2.5 border border-slate-700/60">
                <div className="text-[10px] text-slate-400 font-medium">TMB Estimada</div>
                <div className="text-base font-bold text-white mt-0.5">{metabolicPreview.bmr} <span className="text-[10px] text-slate-400 font-normal">kcal</span></div>
              </div>
              <div className="bg-slate-800/80 rounded-xl p-2.5 border border-slate-700/60">
                <div className="text-[10px] text-slate-400 font-medium">GET (Gasto Total)</div>
                <div className="text-base font-bold text-sky-400 mt-0.5">{metabolicPreview.get} <span className="text-[10px] text-slate-400 font-normal">kcal</span></div>
              </div>
              <div className="bg-slate-800/80 rounded-xl p-2.5 border border-slate-700/60">
                <div className="text-[10px] text-emerald-300 font-medium">VET Alvo Inicial</div>
                <div className="text-base font-bold text-emerald-400 mt-0.5">{metabolicPreview.targetKcal} <span className="text-[10px] text-emerald-200 font-normal">kcal</span></div>
              </div>
              <div className="bg-slate-800/80 rounded-xl p-2.5 border border-slate-700/60">
                <div className="text-[10px] text-amber-300 font-medium">Proteína Alvo</div>
                <div className="text-base font-bold text-amber-400 mt-0.5">{metabolicPreview.targetPtn}g <span className="text-[10px] text-slate-400 font-normal">({metabolicPreview.ptnPerKg} g/kg)</span></div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
              <span>Carboidratos: <strong className="text-slate-200">{metabolicPreview.targetCho}g</strong> ({metabolicPreview.choPerKg} g/kg)</span>
              <span>Lipídios: <strong className="text-slate-200">{metabolicPreview.targetLip}g</strong> ({metabolicPreview.lipPerKg} g/kg)</span>
              <span className="text-slate-400 hidden sm:inline">• Editável no Prontuário</span>
            </div>
          </div>

          {/* Bloco 4: Queixas & Histórico Clínico Prévio */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700">
              Anotações Iniciais / Histórico Prévio ou Restrições Informadas
            </label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Paciente relata desconforto com laticínios; treina musculação pela manhã; busca redução de gordura corporal sem perda de massa magra."
              rows={2}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition"
            />
          </div>

        </div>

        {/* Modal Actions Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-slate-300 text-slate-600 hover:bg-slate-200/60 text-xs font-bold transition"
          >
            Cancelar
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button 
              type="button"
              onClick={() => handleSave(false)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-white border border-slate-300 text-slate-800 hover:bg-slate-100 text-xs font-bold shadow-2xs transition"
            >
              Salvar na Lista
            </button>

            <button 
              type="button"
              onClick={() => handleSave(true)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition"
            >
              <Zap className="w-4 h-4" />
              <span>Salvar & Iniciar Consulta</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
