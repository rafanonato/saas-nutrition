import React, { useState } from 'react';
import { 
  User, 
  AlertCircle, 
  RefreshCw, 
  UploadCloud, 
  Plus, 
  X, 
  Droplet, 
  Clock, 
  Sparkles, 
  Volume2, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  FileText, 
  Moon, 
  Dumbbell, 
  Check, 
  Mic, 
  HelpCircle,
  Flame
} from 'lucide-react';
import { Biomarker, AnamneseData, DiscrepancyAlert, PatientSummary } from '../../types';
import { ExamOcrModal } from '../ocr/ExamOcrModal';
import { ConsultationAudioRecordingModal } from '../assessment/ConsultationAudioRecordingModal';

interface AnamneseViewProps {
  biomarkers: Biomarker[];
  patient?: PatientSummary;
  anamnese?: AnamneseData;
  isRecordingGlobal?: boolean;
  onToggleRecordingGlobal?: () => void;
  recordingSeconds?: number;
  onUpdateBiomarkers?: (newBiomarkers: Biomarker[]) => void;
  onUpdateAnamnese?: (newAnamnese: AnamneseData) => void;
  onUpdatePatient?: (updates: Partial<PatientSummary>) => void;
  onDispatchScribeMessage?: (text: string, speaker: 'patient' | 'nutritionist' | 'ai') => void;
}

export const AnamneseView: React.FC<AnamneseViewProps> = ({ 
  biomarkers,
  patient = {
    id: 'pat-1',
    name: 'Manuela Silveira',
    age: 29,
    height: 168,
    weight: 62.4,
    goal: 'Hipertrofia Muscular',
    targetKcal: 2100,
    bmr: 1410,
    get: 2210,
    phone: '+55 11 98765-4321',
    status: 'Em Atendimento',
    ocrReady: true,
    appointmentTime: '12:00',
    attendanceDate: '18/09/2026',
    whatsappComplianceRate: 98,
    avatarInitials: 'MS'
  },
  anamnese: anamneseProp,
  isRecordingGlobal = true,
  onToggleRecordingGlobal = () => {},
  recordingSeconds = 1122,
  onUpdateBiomarkers,
  onUpdateAnamnese,
  onUpdatePatient,
  onDispatchScribeMessage 
}) => {
  // Estado da Anamnese Estruturada
  const [aversions, setAversions] = useState<string[]>(
    anamneseProp?.aversions || [
      'Lactose (Leve desconforto / distensão)',
      'Batata-Doce (Enjoo severo / aversão gustativa)'
    ]
  );
  const [newAversionInput, setNewAversionInput] = useState('');

  // Rotina & Hábitos
  const [trainingSchedule, setTrainingSchedule] = useState(
    anamneseProp?.trainingRoutine?.schedule 
      ? `${anamneseProp.trainingRoutine.schedule} (${anamneseProp.trainingRoutine.modality || 'Musculação'}, ${anamneseProp.trainingRoutine.frequency || '5x/sem'})`
      : '07:00 às 08:15 (Musculação ABC, 5x/sem)'
  );
  const [sleepInfo, setSleepInfo] = useState(
    anamneseProp?.sleepRoutine?.quality 
      ? `${anamneseProp.sleepRoutine.hoursPerNight}h / noite (${anamneseProp.sleepRoutine.quality})`
      : '6h30 / noite (Sono fragmentado, acorda cansada)'
  );
  const [hydrationLiters, setHydrationLiters] = useState(
    anamneseProp?.hydration?.litersPerDay 
      ? `${anamneseProp.hydration.litersPerDay} L / dia (Água filtrada)`
      : '2.2 L / dia (Água filtrada)'
  );
  const [bristolType, setBristolType] = useState<number>(
    anamneseProp?.gastrointestinal?.bristolType ?? 2
  );
  const [mainComplaints, setMainComplaints] = useState(
    anamneseProp?.mainComplaints || 'Sonolência pós-almoço e constipação intestinal severa (3 dias sem evacuar espontaneamente).'
  );

  // Sincroniza se anamneseProp for atualizada externamente (ex: áudio recording modal)
  React.useEffect(() => {
    if (anamneseProp) {
      if (anamneseProp.aversions) setAversions(anamneseProp.aversions);
      if (anamneseProp.trainingRoutine?.schedule) {
        setTrainingSchedule(`${anamneseProp.trainingRoutine.schedule} (${anamneseProp.trainingRoutine.modality || 'Musculação'}, ${anamneseProp.trainingRoutine.frequency || '5x/sem'})`);
      }
      if (anamneseProp.sleepRoutine) {
        setSleepInfo(`${anamneseProp.sleepRoutine.hoursPerNight}h / noite (${anamneseProp.sleepRoutine.quality})`);
      }
      if (anamneseProp.hydration) {
        setHydrationLiters(`${anamneseProp.hydration.litersPerDay} L / dia (Água filtrada)`);
      }
      if (anamneseProp.gastrointestinal) {
        setBristolType(anamneseProp.gastrointestinal.bristolType);
      }
      if (anamneseProp.mainComplaints) {
        setMainComplaints(anamneseProp.mainComplaints);
      }
    }
  }, [anamneseProp]);

  // Função auxiliar para emitir atualização para App.tsx
  const emitAnamneseUpdate = (overrides: Partial<AnamneseData> = {}) => {
    if (!onUpdateAnamnese) return;
    const current: AnamneseData = {
      consultationGoal: patient.goal,
      mainComplaints,
      complaintsTimestamp: '12:05',
      trainingRoutine: {
        modality: 'Musculação Hipertrofia (Treino ABC)',
        schedule: trainingSchedule,
        frequency: '5x por semana',
        timestamp: '12:07',
        isLiveFilled: true
      },
      sleepRoutine: {
        hoursPerNight: parseFloat(sleepInfo) || 6.5,
        quality: sleepInfo,
        timestamp: '12:08',
        isLiveFilled: true
      },
      hydration: {
        litersPerDay: parseFloat(hydrationLiters.replace(/[^\d.]/g, '')) || 2.2,
        timestamp: '12:09',
        isLiveFilled: true
      },
      gastrointestinal: {
        bristolType,
        symptoms: ['Distensão abdominal', 'Gases frequentes ao final da tarde'],
        timestamp: '12:05',
        isLiveFilled: true
      },
      aversions,
      discrepancies: discrepancy ? [discrepancy] : [],
      audioQuality: {
        confidenceScore: 96,
        hasExcessiveNoise: audioNoiseWarning
      },
      ...overrides
    };
    onUpdateAnamnese(current);
  };
  
  // Live-fill pulse states
  const [liveFillField, setLiveFillField] = useState<string | null>('complaints');

  // RF-01: Discrepâncias Léxicas na fala
  const [discrepancy, setDiscrepancy] = useState<DiscrepancyAlert | null>({
    id: 'disc-1',
    field: 'Jejum Intermitente vs Refeição Matinal',
    statementA: { 
      text: 'Declaração 12:01: "Faço jejum intermitente estrito até as 12:30 todos os dias."', 
      timestamp: '12:01' 
    },
    statementB: { 
      text: 'Declaração 12:11: "Tomo café com leite e 2 torradas com queijo às 08h antes do treino."', 
      timestamp: '12:11' 
    },
    status: 'pendente'
  });

  // RF-01: Alerta de Ruído Excessivo / Áudio Inconsistente (<75% confiança)
  const [audioNoiseWarning, setAudioNoiseWarning] = useState<boolean>(false);

  // Modais de OCR e Gravação de Áudio da Consulta
  const [isOcrModalOpen, setIsOcrModalOpen] = useState<boolean>(false);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState<boolean>(false);

  const handleApplyExtractedAnamnese = (data: {
    trainingSchedule?: string;
    bristolType?: number;
    aversions?: string[];
    hydrationLiters?: string;
    mainComplaints?: string;
    sleepInfo?: string;
    patientProfileUpdates?: {
      weightReported?: number;
      age?: number;
      goal?: string;
    };
    discrepancyAlert?: {
      detected: boolean;
      field: string;
      statementA: string;
      statementB: string;
    };
  }) => {
    const newAversions = (data.aversions && data.aversions.length > 0) ? data.aversions : aversions;
    if (data.trainingSchedule) setTrainingSchedule(data.trainingSchedule);
    if (data.bristolType) setBristolType(data.bristolType);
    if (data.aversions && data.aversions.length > 0) setAversions(data.aversions);
    if (data.hydrationLiters) setHydrationLiters(data.hydrationLiters);
    if (data.mainComplaints) setMainComplaints(data.mainComplaints);
    if (data.sleepInfo) setSleepInfo(data.sleepInfo);

    // Se detectou discrepância léxica (RF-01)
    if (data.discrepancyAlert?.detected) {
      setDiscrepancy({
        id: `disc-${Date.now()}`,
        field: data.discrepancyAlert.field,
        statementA: { text: data.discrepancyAlert.statementA, timestamp: '12:01' },
        statementB: { text: data.discrepancyAlert.statementB, timestamp: '12:11' },
        status: 'pendente'
      });
    }

    // Se houver atualizações do perfil do paciente
    if (data.patientProfileUpdates && onUpdatePatient) {
      if (data.patientProfileUpdates.weightReported) {
        onUpdatePatient({ weight: data.patientProfileUpdates.weightReported });
      }
      if (data.patientProfileUpdates.goal) {
        onUpdatePatient({ goal: data.patientProfileUpdates.goal });
      }
    }

    emitAnamneseUpdate({
      aversions: newAversions,
      mainComplaints: data.mainComplaints || mainComplaints,
      trainingRoutine: {
        modality: 'Musculação Hipertrofia (Treino ABC)',
        schedule: data.trainingSchedule || trainingSchedule,
        frequency: '5x por semana',
        timestamp: '12:07',
        isLiveFilled: true
      },
      hydration: {
        litersPerDay: data.hydrationLiters ? parseFloat(data.hydrationLiters.replace(/[^\d.]/g, '')) || 2.2 : 2.2,
        timestamp: '12:09',
        isLiveFilled: true
      },
      gastrointestinal: {
        bristolType: data.bristolType ?? bristolType,
        symptoms: ['Distensão abdominal', 'Gases frequentes ao final da tarde'],
        timestamp: '12:05',
        isLiveFilled: true
      }
    });

    setLiveFillField('all');
    setTimeout(() => setLiveFillField(null), 4000);

    if (onDispatchScribeMessage) {
      onDispatchScribeMessage(
        'Variáveis clínicas da consulta transcrita e gravada foram aplicadas com sucesso à Anamnese do paciente.',
        'ai'
      );
    }
  };

  const handleAddAversion = () => {
    if (!newAversionInput.trim()) return;
    const added = [...aversions, newAversionInput.trim()];
    setAversions(added);
    setNewAversionInput('');
    emitAnamneseUpdate({ aversions: added });
    if (onDispatchScribeMessage) {
      onDispatchScribeMessage(`Aversão cadastrada: ${newAversionInput.trim()} foi excluída de todas as soluções do Solver HiGHS.`, 'ai');
    }
  };

  const handleRemoveAversion = (item: string) => {
    const filtered = aversions.filter(a => a !== item);
    setAversions(filtered);
    emitAnamneseUpdate({ aversions: filtered });
  };

  const handleResolveDiscrepancy = (choice: 'jejum' | 'refeicao') => {
    if (!discrepancy) return;
    setDiscrepancy(prev => prev ? { ...prev, status: 'resolvido', resolvedChoice: choice } : null);
    if (choice === 'refeicao') {
      setMainComplaints(prev => `${prev} [Nota Nutricionista: Paciente mantém desjejum leve às 08h pré-treino, desconsiderando jejum prolongado]`);
    }
    if (onDispatchScribeMessage) {
      onDispatchScribeMessage(
        `Discrepância clínica resolvida pela Dra. Camila Silveira: Optado por ${choice === 'refeicao' ? 'Desjejum às 08:00' : 'Jejum Matinal estrito'}. Prontuário sincronizado.`, 
        'ai'
      );
    }
  };

  // Simulações Interativas para Testes de Validação
  const handleSimulateTrainingSpeech = () => {
    setLiveFillField('training');
    setTrainingSchedule('06:45 às 08:00 (Musculação Força + 20min Cárdio Zona 2)');
    if (onDispatchScribeMessage) {
      onDispatchScribeMessage('Treino às 06h45 agora, faço musculação pesada e mais 20 minutos de esteira em ritmo moderado.', 'patient');
    }
    setTimeout(() => setLiveFillField(null), 3000);
  };

  const handleSimulateBristolSpeech = () => {
    setLiveFillField('bristol');
    setBristolType(2);
    if (onDispatchScribeMessage) {
      onDispatchScribeMessage('Minhas fezes continuam muito ressecadas, saem em pedaços duros como bolinhas encaroçadas.', 'patient');
    }
    setTimeout(() => setLiveFillField(null), 3000);
  };

  const handleToggleNoiseSimulation = () => {
    setAudioNoiseWarning(prev => !prev);
    if (!audioNoiseWarning && onDispatchScribeMessage) {
      onDispatchScribeMessage('[Trecho Inaudível: interferência no microfone USB da sala clínica]', 'system');
    }
  };

  const handleToggleContradictionSimulation = () => {
    if (!discrepancy || discrepancy.status === 'resolvido') {
      setDiscrepancy({
        id: `disc-${Date.now()}`,
        field: 'Suplementação: Creatina em uso vs Nunca tomou',
        statementA: { text: '12:03: "Tomo creatina 5g todo dia há 6 meses."', timestamp: '12:03' },
        statementB: { text: '12:14: "Nunca tomei creatina por medo de retenção líquida."', timestamp: '12:14' },
        status: 'pendente'
      });
      if (onDispatchScribeMessage) {
        onDispatchScribeMessage('Alerta RF-01: Contradição detectada entre falas das 12:03 e 12:14 referente à Creatina.', 'ai');
      }
    } else {
      setDiscrepancy(null);
    }
  };

  return (
    <div id="anamnese-view-container" className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Top Banner & Ações de Teste RF-01 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
              RF-01 • Ambient Scribing Whisper
            </span>
            <span className="text-xs font-semibold text-slate-500">Fluxo Contínuo & Live-Fill</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-1">
            Anamnese Clínica & Ingestão Automatizada
          </h2>
        </div>

        {/* Status de Sincronização & Botão do Modal de Áudio */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsAudioModalOpen(true)}
            className="bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
            title="Abrir Prontuário de Áudio da Consulta & Speech-to-Text"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Gravação & Speech-to-Text</span>
          </button>

          {audioNoiseWarning ? (
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-full animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
              <span>Áudio inconsistente: verifique o microfone (&lt;75%)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
              <span>Escuta ativa: 96% de confiança STT</span>
            </div>
          )}
        </div>
      </div>

      {/* Card de Destaque: Camada de Áudio e Speech-to-Text no Prontuário */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-5 shadow-xs border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold shrink-0 mt-0.5">
            <Mic className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-sm text-white">Prontuário de Áudio & Diarização da Consulta</h3>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Camada Persistida (CFN nº 856)
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              O áudio ambiente da consulta com {patient.name} é transcrito em tempo real (Speech-to-Text). As variáveis clínicas (treino, aversão à batata-doce, Bristol tipo 2) são extraídas diretamente para os campos abaixo.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setIsAudioModalOpen(true)}
            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-rose-200" />
            <span>Testar Gravação & Extração</span>
          </button>
        </div>
      </div>

      {/* Barra de Testes Interativos da Anamnese (RF-01) */}
      <div className="bg-slate-100 border border-slate-200 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-bold text-slate-700 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          Testar Simulação de Fala RF-01:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleSimulateTrainingSpeech}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg font-semibold text-[11px] transition cursor-pointer flex items-center gap-1 shadow-2xs"
          >
            <Dumbbell className="w-3 h-3 text-blue-600" />
            <span>Simular: Rotina de Treino</span>
          </button>
          <button
            type="button"
            onClick={handleSimulateBristolSpeech}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg font-semibold text-[11px] transition cursor-pointer flex items-center gap-1 shadow-2xs"
          >
            <Activity className="w-3 h-3 text-emerald-600" />
            <span>Simular: Escala Bristol</span>
          </button>
          <button
            type="button"
            onClick={handleToggleContradictionSimulation}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg font-semibold text-[11px] transition cursor-pointer flex items-center gap-1 shadow-2xs"
          >
            <AlertCircle className="w-3 h-3 text-amber-600" />
            <span>Simular: Contradição Léxica</span>
          </button>
          <button
            type="button"
            onClick={handleToggleNoiseSimulation}
            className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition cursor-pointer flex items-center gap-1 ${
              audioNoiseWarning 
                ? 'bg-amber-600 text-white shadow-2xs' 
                : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-2xs'
            }`}
          >
            <Volume2 className="w-3 h-3" />
            <span>{audioNoiseWarning ? 'Desativar Ruído' : 'Simular Ruído (<75%)'}</span>
          </button>
        </div>
      </div>

      {/* Alerta de Discrepância Léxica na Fala (Regra de Falha RF-01) */}
      {discrepancy && discrepancy.status === 'pendente' && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>RF-01 Alerta: Contradição Léxica Detectada na Fala da Paciente</span>
            </div>
            <span className="text-[10px] font-bold uppercase bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-full">
              Revisão Obrigatória
            </span>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            O motor semântico identificou informações mutuamente excludentes em diferentes momentos da consulta. 
            O prontuário bloqueou a sobrescrita cega para evitar erros no cálculo das janelas metabólicas.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-white p-3 rounded-xl border border-amber-200">
              <div className="font-bold text-amber-900 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {discrepancy.statementA.timestamp}
              </div>
              <p className="text-slate-700 italic">"{discrepancy.statementA.text}"</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-amber-200">
              <div className="font-bold text-amber-900 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {discrepancy.statementB.timestamp}
              </div>
              <p className="text-slate-700 italic">"{discrepancy.statementB.text}"</p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleResolveDiscrepancy('jejum')}
              className="bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold transition"
            >
              Validar Jejum Intermitente
            </button>
            <button
              type="button"
              onClick={() => handleResolveDiscrepancy('refeicao')}
              className="bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Validar Desjejum às 08:00</span>
            </button>
          </div>
        </div>
      )}

      {/* 1. Card de Queixas Principais e Alvo */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <User className="w-4 h-4 text-blue-600" />
          Queixas Clínicas & Motivo da Consulta (Live-Fill em Tempo Real)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-600 mb-1.5 block">Motivo da Consulta & Objetivo Primário</label>
            <input 
              type="text" 
              readOnly 
              value="Ganho de massa magra (Hipertrofia) com redução de desconforto gástrico e melhora da disposição." 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-medium outline-none focus:bg-white focus:border-blue-400 transition"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-slate-600 block">Queixas Principais (Gastro / Rotina)</label>
              <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                Live-Fill via fala (12:05)
              </span>
            </div>
            <input 
              type="text" 
              readOnly 
              value={mainComplaints} 
              className={`w-full rounded-xl px-3.5 py-2.5 text-blue-950 font-medium outline-none transition duration-300 ${
                liveFillField === 'complaints'
                  ? 'bg-blue-100 border-2 border-blue-400 ring-4 ring-blue-100 shadow-md'
                  : 'bg-blue-50/70 border border-blue-200 ring-1 ring-blue-100'
              }`}
            />
          </div>
        </div>
      </div>

      {/* 2. Hábitos, Sono e Rotina de Treino */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Dumbbell className="w-4 h-4 text-blue-600" />
          Rotina de Treinamento, Sono & Ingestão Hídrica
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Treino */}
          <div className={`p-4 rounded-2xl border transition duration-300 ${
            liveFillField === 'training'
              ? 'bg-blue-50 border-blue-400 ring-4 ring-blue-100 shadow-sm'
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5 text-blue-600" />
                Treino Físico
              </span>
              <span className="text-[10px] font-semibold text-blue-600">Áudio 12:07</span>
            </div>
            <input 
              type="text" 
              value={trainingSchedule}
              onChange={(e) => setTrainingSchedule(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-blue-400"
            />
            <span className="text-[10px] text-slate-500 block mt-1">
              Gasto energético recalculado com base no volume diário.
            </span>
          </div>

          {/* Sono */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-indigo-600" />
                Qualidade de Sono
              </span>
              <span className="text-[10px] font-semibold text-indigo-600">Áudio 12:08</span>
            </div>
            <input 
              type="text" 
              value={sleepInfo}
              onChange={(e) => setSleepInfo(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-blue-400"
            />
            <span className="text-[10px] text-slate-500 block mt-1">
              Higiene do sono & Ceia anticatólica com triptofano recomendada.
            </span>
          </div>

          {/* Água */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Droplet className="w-3.5 h-3.5 text-cyan-600" />
                Ingestão Hídrica
              </span>
              <span className="text-[10px] font-semibold text-cyan-600">35 ml/kg</span>
            </div>
            <input 
              type="text" 
              value={hydrationLiters}
              onChange={(e) => setHydrationLiters(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-blue-400"
            />
            <span className="text-[10px] text-slate-500 block mt-1">
              Meta mínima para Manuela (62.4kg): 2.180 ml/dia.
            </span>
          </div>
        </div>
      </div>

      {/* 3. Escala de Bristol Interativa (Saúde Intestinal) */}
      <div className={`bg-white border rounded-3xl p-6 shadow-xs space-y-4 transition duration-300 ${
        liveFillField === 'bristol' ? 'border-blue-400 ring-4 ring-blue-100' : 'border-slate-200'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              Escala de Bristol de Consistência Fecal (Padrão Clínico)
            </h3>
            <p className="text-xs text-slate-500">
              Classificação semântica automática extraída do relato da paciente no áudio.
            </p>
          </div>
          <span className="text-xs font-bold text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full">
            Selecionado: Tipo 2 (Constipação Moderada a Severa)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-center text-xs">
          {[
            { type: 1, label: 'Tipo 1', desc: 'Pedaços duros separados (bolinhas)', status: 'Constipação Severa' },
            { type: 2, label: 'Tipo 2', desc: 'Forma de salsicha, encaroçada', status: 'Constipação' },
            { type: 3, label: 'Tipo 3', desc: 'Como salsicha, com fendas na superfície', status: 'Normal' },
            { type: 4, label: 'Tipo 4', desc: 'Como salsicha ou cobra, suave e mole', status: 'Ideal' },
            { type: 5, label: 'Tipo 5', desc: 'Pedaços moles com bordas nítidas', status: 'Carência de Fibra' },
            { type: 6, label: 'Tipo 6', desc: 'Pedaços aerados com bordas esfarrapadas', status: 'Subdiarreico' },
            { type: 7, label: 'Tipo 7', desc: 'Aquoso, sem pedaços sólidos', status: 'Diarreia' },
          ].map((item) => {
            const isSelected = bristolType === item.type;
            return (
              <button
                key={item.type}
                type="button"
                onClick={() => setBristolType(item.type)}
                className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition ${
                  isSelected
                    ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-200 text-amber-950 font-bold'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                }`}
              >
                <div>
                  <div className="font-bold text-xs mb-0.5">{item.label}</div>
                  <div className="text-[10px] leading-tight text-slate-500">{item.desc}</div>
                </div>
                <div className={`text-[9px] font-bold mt-2 uppercase ${isSelected ? 'text-amber-700' : 'text-slate-400'}`}>
                  {item.status}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Aversões e Restrições Alimentares (Exclusões do Solver HiGHS) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-600" />
            Aversões, Alergias & Restrições (Excluídas Deterministicamente do Solver)
          </h3>
          <p className="text-xs text-slate-500">
            Nenhum cardápio gerado pelo solver conterá alimentos listados nesta matriz de restrição.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center bg-slate-50 border border-slate-200 rounded-2xl p-3">
          {aversions.map((aversion) => {
            const isSevero = aversion.includes('Batata-Doce');
            return (
              <span 
                key={aversion} 
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-2xs transition ${
                  isSevero 
                    ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                <span>{aversion}</span>
                <button 
                  type="button"
                  onClick={() => handleRemoveAversion(aversion)}
                  className="hover:text-rose-600 rounded p-0.5"
                  title="Remover restrição"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            );
          })}
          
          <div className="flex items-center gap-1 min-w-[240px] flex-1">
            <input 
              type="text" 
              value={newAversionInput} 
              onChange={(e) => setNewAversionInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddAversion()}
              placeholder="+ Digite e pressione Enter para excluir..." 
              className="bg-transparent text-xs text-slate-700 outline-none w-full px-2"
            />
            {newAversionInput.trim() && (
              <button
                type="button"
                onClick={handleAddAversion}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-2.5 py-1 text-[11px] font-bold"
              >
                Adicionar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 5. Biomarcadores Laboratoriais Extraídos por OCR (RF-02) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Droplet className="w-4 h-4 text-rose-600" />
              Biomarcadores Laboratoriais & Pipeline OCR (RF-02)
            </h3>
            <p className="text-xs text-slate-500">
              Laudo Fleury ingerido automaticamente com mapeamento de faixas convencionais e alvos funcionais de hipertrofia.
            </p>
          </div>
          <button 
            type="button"
            onClick={() => setIsOcrModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Abrir Leitor / Fazer Upload OCR</span>
          </button>
        </div>

        <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-semibold text-slate-500">
              <tr>
                <th className="py-2.5 px-4">Biomarcador</th>
                <th className="py-2.5 px-4 text-center">Resultado</th>
                <th className="py-2.5 px-4 text-center">Faixa Convencional</th>
                <th className="py-2.5 px-4 text-center font-bold text-blue-700">Alvo Funcional</th>
                <th className="py-2.5 px-4">Interpretação IA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {biomarkers.map((bio) => (
                <tr key={bio.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4 font-semibold text-slate-800 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      bio.status === 'critico' ? 'bg-rose-600' : bio.status === 'alerta' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`} />
                    {bio.name}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-slate-900">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      bio.status === 'critico' 
                        ? 'text-rose-700 bg-rose-50 border border-rose-200' 
                        : bio.status === 'alerta'
                        ? 'text-amber-800 bg-amber-50 border border-amber-200'
                        : 'text-slate-800'
                    }`}>
                      {bio.result} {bio.unit}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-slate-500">{bio.conventionalRef}</td>
                  <td className="py-3 px-4 text-center font-semibold text-blue-700 bg-blue-50/40">
                    {bio.functionalTarget}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      bio.status === 'critico' 
                        ? 'bg-rose-100 text-rose-800' 
                        : bio.status === 'alerta' 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {bio.interpretation}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de OCR Laboratorial */}
      <ExamOcrModal 
        isOpen={isOcrModalOpen}
        onClose={() => setIsOcrModalOpen(false)}
        onImportBiomarkers={(newBios) => {
          if (onUpdateBiomarkers) {
            onUpdateBiomarkers(newBios);
          }
        }}
      />

      {/* Modal de Prontuário de Áudio da Consulta & Speech-to-Text */}
      <ConsultationAudioRecordingModal
        isOpen={isAudioModalOpen}
        onClose={() => setIsAudioModalOpen(false)}
        patient={patient}
        isRecordingGlobal={isRecordingGlobal}
        onToggleRecordingGlobal={onToggleRecordingGlobal}
        recordingSeconds={recordingSeconds}
        onApplyExtractedAnamnese={handleApplyExtractedAnamnese}
        onUpdatePatient={onUpdatePatient}
      />
    </div>
  );
};
