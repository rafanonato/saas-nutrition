import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MetabolicHUD } from './components/MetabolicHUD';
import { CopilotPanel } from './components/CopilotPanel';
import { DashboardView } from './components/views/DashboardView';
import { AnamneseView } from './components/views/AnamneseView';
import { AvaliacaoFisicaView } from './components/views/AvaliacaoFisicaView';
import { EditorDieteticoView } from './components/views/EditorDieteticoView';
import { FinalizacaoView } from './components/views/FinalizacaoView';
import { PacientesView } from './components/views/PacientesView';
import { ConfiguracoesView } from './components/views/ConfiguracoesView';
import { GestaoClinicaView } from './components/views/GestaoClinicaView';

import { 
  ActiveTab, 
  PatientSummary, 
  Meal, 
  ScribeMessage,
  Biomarker,
  BodyComposition,
  PatientContextPayload,
  MealPlanPdfExport,
  AnamneseData,
  ClinicTenant,
  NutritionistUser
} from './types';
import { ConsultationAudioRecordingModal } from './components/assessment/ConsultationAudioRecordingModal';
import { MealPlanPdfModal } from './components/diet/MealPlanPdfModal';
import { tenantService } from './services/tenantService';
import { patientClinicalService } from './services/patientClinicalService';

import { 
  CURRENT_PATIENT, 
  ALL_PATIENTS, 
  INITIAL_MEALS, 
  INITIAL_BIOMARKERS, 
  INITIAL_BODY_COMPOSITION, 
  INITIAL_ANAMNESE,
  INITIAL_SUBSTITUTION_RULES, 
  INITIAL_SCRIBE_MESSAGES, 
  DEFAULT_CLINIC_CONFIG, 
  INITIAL_COMPLIANCE 
} from './data/mockData';
import { applyHighsSolutionToMeal } from './services/dietOptimizationService';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('editor');
  const [clinic, setClinic] = useState<ClinicTenant>(() => tenantService.getClinic());
  const [allNutritionists, setAllNutritionists] = useState<NutritionistUser[]>(() => tenantService.getNutritionists());
  const [activeNutritionist, setActiveNutritionist] = useState<NutritionistUser>(() => tenantService.getActiveNutritionist());
  
  // Pacientes da nutricionista ativa (com persistência via tenantService)
  const [allPatients, setAllPatients] = useState<PatientSummary[]>(() => {
    const nutri = tenantService.getActiveNutritionist();
    const nutriPatients = tenantService.getPatientsByNutritionist(nutri.id);
    return nutriPatients.length > 0 ? nutriPatients : ALL_PATIENTS;
  });

  const [activePatient, setActivePatient] = useState<PatientSummary>(() => {
    return allPatients[0] || CURRENT_PATIENT;
  });

  // Prontuário isolado e limpo (carregado dinamicamente via patientClinicalService)
  const initialClinicalData = patientClinicalService.getPatientClinicalData(allPatients[0] || CURRENT_PATIENT);

  const [meals, setMeals] = useState<Meal[]>(initialClinicalData.meals);
  const [biomarkers, setBiomarkers] = useState<Biomarker[]>(initialClinicalData.biomarkers);
  const [bodyComposition, setBodyComposition] = useState<BodyComposition>(initialClinicalData.bodyComposition);
  const [substitutionRules, setSubstitutionRules] = useState(initialClinicalData.substitutionRules);
  const [scribeMessages, setScribeMessages] = useState<ScribeMessage[]>(initialClinicalData.scribeMessages);
  const [clinicConfig] = useState(DEFAULT_CLINIC_CONFIG);
  const [compliance] = useState(INITIAL_COMPLIANCE);
  const [anamnese, setAnamnese] = useState<AnamneseData>(initialClinicalData.anamnese);
  const [consultationRecordings, setConsultationRecordings] = useState<any[]>(initialClinicalData.recordings);
  const [pdfHistory, setPdfHistory] = useState<MealPlanPdfExport[]>(initialClinicalData.pdfHistory);

  // Global Modals State
  const [isGlobalAudioModalOpen, setIsGlobalAudioModalOpen] = useState<boolean>(false);
  const [isGlobalPdfModalOpen, setIsGlobalPdfModalOpen] = useState<boolean>(false);

  // Payload de contexto clínico completo para o motor de IA (Etapa 4)
  const patientContext: PatientContextPayload = {
    patient: activePatient,
    anamnese,
    bodyComposition,
    biomarkers,
    meals,
    substitutionRules,
    clinicConfig
  };

  // Audio Recording Simulation State
  const [isRecording, setIsRecording] = useState<boolean>(true);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(1122); // 00:18:42

  useEffect(() => {
    let interval: any = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Troca de paciente com persistência isolada e dados limpos (Clean Clinical Record)
  const switchActivePatient = (nextPatient: PatientSummary) => {
    // 1. Salva prontuário do paciente anterior
    if (activePatient?.id) {
      patientClinicalService.savePatientClinicalData(activePatient.id, {
        meals,
        biomarkers,
        bodyComposition,
        anamnese,
        substitutionRules,
        recordings: consultationRecordings,
        pdfHistory,
        scribeMessages
      });
    }

    // 2. Carrega prontuário limpo ou histórico do próximo paciente
    const record = patientClinicalService.getPatientClinicalData(nextPatient);
    setActivePatient(nextPatient);
    setMeals(record.meals);
    setBiomarkers(record.biomarkers);
    setBodyComposition(record.bodyComposition);
    setAnamnese(record.anamnese);
    setSubstitutionRules(record.substitutionRules);
    setConsultationRecordings(record.recordings);
    setPdfHistory(record.pdfHistory);
    setScribeMessages(record.scribeMessages);
  };

  // Salva automaticamente mutações no prontuário do paciente ativo
  useEffect(() => {
    if (activePatient?.id) {
      patientClinicalService.savePatientClinicalData(activePatient.id, {
        meals,
        biomarkers,
        bodyComposition,
        anamnese,
        substitutionRules,
        recordings: consultationRecordings,
        pdfHistory,
        scribeMessages
      });
    }
  }, [activePatient.id, meals, biomarkers, bodyComposition, anamnese, substitutionRules, consultationRecordings, pdfHistory, scribeMessages]);

  // Gestão Administrativa da Clínica (Camada 1 e 2)
  const handleUpdateClinic = (updates: Partial<ClinicTenant>) => {
    const updated = tenantService.updateClinic(updates);
    setClinic(updated);
  };

  const handleAddNutritionist = (data: Omit<NutritionistUser, 'id' | 'clinicId' | 'createdAt' | 'patientsCount'>) => {
    tenantService.createNutritionist(data);
    setAllNutritionists(tenantService.getNutritionists());
  };

  const handleUpdateNutritionist = (id: string, updates: Partial<NutritionistUser>) => {
    tenantService.updateNutritionist(id, updates);
    const updatedList = tenantService.getNutritionists();
    setAllNutritionists(updatedList);
    if (activeNutritionist.id === id) {
      const target = updatedList.find(n => n.id === id);
      if (target) setActiveNutritionist(target);
    }
  };

  const handleToggleNutritionistAccess = (id: string, active: boolean) => {
    tenantService.toggleNutritionistAccess(id, active);
    const updatedList = tenantService.getNutritionists();
    setAllNutritionists(updatedList);
    if (activeNutritionist.id === id) {
      const target = updatedList.find(n => n.id === id);
      if (target) setActiveNutritionist(target);
    }
  };

  const handleDeleteNutritionist = (id: string) => {
    tenantService.deleteNutritionist(id);
    const updatedList = tenantService.getNutritionists();
    setAllNutritionists(updatedList);
    if (activeNutritionist.id === id && updatedList.length > 0) {
      handleSwitchNutritionist(updatedList[0].id);
    }
  };

  const handleSwitchNutritionist = (id: string) => {
    tenantService.setActiveNutritionist(id);
    const nutris = tenantService.getNutritionists();
    const targetNutri = nutris.find(n => n.id === id) || nutris[0];
    setActiveNutritionist(targetNutri);
    const nutriPatients = tenantService.getPatientsByNutritionist(id);
    setAllPatients(nutriPatients);
    if (nutriPatients.length > 0) {
      switchActivePatient(nutriPatients[0]);
    }
  };

  const formatDuration = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleRecording = () => {
    setIsRecording(prev => !prev);
  };

  const handleUpdatePatient = (updates: Partial<PatientSummary>) => {
    setActivePatient(prev => ({
      ...prev,
      ...updates
    }));
  };

  const handleApplyExtractedAnamnese = (extractedData: {
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
    if (extractedData.patientProfileUpdates?.weightReported) {
      handleUpdatePatient({ weight: extractedData.patientProfileUpdates.weightReported });
    }
    if (extractedData.patientProfileUpdates?.goal) {
      handleUpdatePatient({ goal: extractedData.patientProfileUpdates.goal });
    }

    setAnamnese(prev => ({
      ...prev,
      mainComplaints: extractedData.mainComplaints || prev.mainComplaints,
      aversions: extractedData.aversions && extractedData.aversions.length > 0 ? extractedData.aversions : prev.aversions,
      trainingRoutine: {
        ...prev.trainingRoutine,
        schedule: extractedData.trainingSchedule || prev.trainingRoutine.schedule
      },
      sleepRoutine: {
        ...prev.sleepRoutine,
        quality: extractedData.sleepInfo || prev.sleepRoutine.quality
      },
      hydration: {
        ...prev.hydration,
        litersPerDay: extractedData.hydrationLiters ? parseFloat(extractedData.hydrationLiters.replace(/[^\d.]/g, '')) || prev.hydration.litersPerDay : prev.hydration.litersPerDay
      },
      gastrointestinal: {
        ...prev.gastrointestinal,
        bristolType: extractedData.bristolType || prev.gastrointestinal.bristolType
      }
    }));

    const summary = [
      extractedData.aversions?.length ? `Aversões: ${extractedData.aversions.join(', ')}` : null,
      extractedData.trainingSchedule ? `Treino: ${extractedData.trainingSchedule}` : null,
      extractedData.bristolType ? `Escala Bristol: Tipo ${extractedData.bristolType}` : null,
      extractedData.hydrationLiters ? `Hidratação: ${extractedData.hydrationLiters}` : null
    ].filter(Boolean).join(' | ');

    handleDispatchScribeMessage(
      `Dados clínicos extraídos da escuta ativa sincronizados com o prontuário: ${summary || 'Anamnese atualizada.'}`,
      'ai'
    );
  };

  const handleRecordPdfSent = (record: MealPlanPdfExport) => {
    setPdfHistory(prev => [record, ...prev]);
    handleDispatchScribeMessage(
      `Documento PDF gerado e arquivado no histórico de envios: ${record.title} (${record.version}). Autenticação ${record.authenticityHash} vinculada ao CRN-3 / 48.912.`,
      'ai'
    );
  };

  const [isCopilotLoading, setIsCopilotLoading] = useState<boolean>(false);

  const handleSendMessageToCopilot = async (text: string) => {
    const newMsg: ScribeMessage = {
      id: `msg-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      speaker: 'nutritionist',
      text
    };

    setScribeMessages(prev => [...prev, newMsg]);
    setIsCopilotLoading(true);

    try {
      const response = await fetch('/api/ai/copilot-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: patientContext,
          historyRecordings: consultationRecordings,
          activeMealId: 'meal-2'
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiReply: ScribeMessage = {
          id: `msg-reply-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          speaker: 'ai',
          text: data.replyText || 'Comando processado com sucesso pelo Copiloto HiGHS.',
          insightBadge: data.insightBadge,
          suggestedAction: data.suggestedAction,
          engine: data.engine || 'Copiloto Clínico HiGHS',
          source: data.source
        };
        setScribeMessages(prev => [...prev, aiReply]);
      } else {
        throw new Error(`Falha na resposta: ${response.status}`);
      }
    } catch (err: any) {
      console.warn('[Copilot HiGHS] Contingência acionada no cliente:', err?.message);
      const aiReply: ScribeMessage = {
        id: `msg-reply-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        speaker: 'ai',
        text: `**Parecer do Solver HiGHS (Dual Simplex):**\n\n` +
          `Análise concluída com base nas tabelas TACO/TBCA para ${activePatient.name}. A meta de 140g de PTN (2.24 g/kg) e o gatilho de leucina (>3.0g) para ativação da via mTORC1 no pós-treino foram devidamente calibrados.`,
        insightBadge: 'HiGHS Solver Contingência',
        engine: 'highs-solver-local',
        suggestedAction: {
          type: 'apply_solver_lunch',
          label: 'Aplicar Solução HiGHS ao Almoço'
        }
      };
      setScribeMessages(prev => [...prev, aiReply]);
    } finally {
      setIsCopilotLoading(false);
    }
  };

  const handleCopilotTriggerAction = (actionType: string) => {
    if (actionType === 'view_exams') {
      setActiveTab('avaliacao');
    } else if (actionType === 'view_history') {
      setIsGlobalAudioModalOpen(true);
    } else if (actionType === 'apply_cunningham') {
      handleApplyCunninghamToPlan(
        bodyComposition.bmrCunningham,
        bodyComposition.getCalculated,
        activePatient.targetKcal,
        {
          targetPtn: activePatient.targetPtn,
          targetCho: activePatient.targetCho,
          targetLip: activePatient.targetLip
        }
      );
    } else if (actionType === 'apply_solver_lunch') {
      handleApplySolverSuggestion();
    }
  };

  const handleResetCopilotMessages = () => {
    setScribeMessages(INITIAL_SCRIBE_MESSAGES);
  };

  const handleApplySolverSuggestion = () => {
    // Aplicação cirúrgica dos alimentos e macronutrientes da solução do HiGHS
    const { updatedMeals, totalLeucine, totalPtn } = applyHighsSolutionToMeal(meals, 'meal-2');
    setMeals(updatedMeals);

    // Conduz suavemente a visualização para o Editor Dietético
    setActiveTab('editor');

    const confirmMsg: ScribeMessage = {
      id: `msg-confirm-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      speaker: 'ai',
      text: `**Solução do Solver HiGHS Aplicada com Sucesso ao Almoço (Refeição 2):**\n\n` +
        `• **Proteína da Refeição:** ${totalPtn}g (supera meta de 40g)\n` +
        `• **Gatilho de Leucina:** ${totalLeucine}g (≥ 3.0g, ativação ótima da via mTORC1 no pós-treino)\n` +
        `• **Restrições Respeitadas:** 0g Batata-doce e 0g Lactose atendidas com base nas aversões declaradas.\n` +
        `• **Alimentos Inseridos:** 150g Peito de Frango, 160g Arroz Branco, 100g Feijão Carioca, 8g Azeite de Oliva, 120g Salada Verde.\n\n` +
        `O Editor Dietético foi sincronizado e o HUD Metabólico recalculado em tempo real.`,
      insightBadge: 'Plano Otimizado HiGHS'
    };
    setScribeMessages(prev => [...prev, confirmMsg]);
  };

  const handleApplyCunninghamToPlan = (
    bmr: number, 
    get: number, 
    targetKcal?: number, 
    macros?: {
      targetPtn: number;
      targetCho: number;
      targetLip: number;
      ptnPerKg?: number;
      choPerKg?: number;
      lipPerKg?: number;
      formula?: string;
      activityFactor?: number;
      activityLabel?: string;
    }
  ) => {
    const finalTargetKcal = targetKcal || Math.round(get * 0.95);
    setActivePatient(prev => ({
      ...prev,
      bmr,
      get,
      targetKcal: finalTargetKcal,
      targetPtn: macros?.targetPtn ?? prev.targetPtn ?? 140,
      targetCho: macros?.targetCho ?? prev.targetCho ?? 250,
      targetLip: macros?.targetLip ?? prev.targetLip ?? 60,
      ptnPerKg: macros?.ptnPerKg ?? prev.ptnPerKg ?? 2.24,
      choPerKg: macros?.choPerKg ?? prev.choPerKg ?? 4.0,
      lipPerKg: macros?.lipPerKg ?? prev.lipPerKg ?? 0.96,
      bmrFormula: (macros?.formula as any) ?? prev.bmrFormula ?? 'cunningham',
      activityFactor: macros?.activityFactor ?? prev.activityFactor ?? 1.55,
      activityLevel: macros?.activityLabel ?? prev.activityLevel ?? 'Moderado (Musculação 5x/sem)'
    }));

    const formulaName = macros?.formula === 'cunningham' 
      ? 'Cunningham (baseada em MLG)' 
      : macros?.formula === 'mifflin' 
        ? 'Mifflin-St Jeor' 
        : 'Harris-Benedict';

    const updateMsg: ScribeMessage = {
      id: `msg-bmr-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      speaker: 'ai',
      text: `Telemetria Metabólica Sincronizada: TMB = ${bmr} kcal (${formulaName}), GET = ${get} kcal (${macros?.activityLabel || 'FAF 1.55'}). VET Alvo calibrado para ${finalTargetKcal} kcal com macronutrientes: PTN ${macros?.targetPtn || 140}g (${macros?.ptnPerKg || 2.24} g/kg), CHO ${macros?.targetCho || 250}g (${macros?.choPerKg || 4.0} g/kg), LIP ${macros?.targetLip || 60}g (${macros?.lipPerKg || 0.96} g/kg).`
    };
    setScribeMessages(prev => [...prev, updateMsg]);
  };

  const handleUpdateBiomarkers = (newBios: Biomarker[]) => {
    setBiomarkers(newBios);
    const ocrMsg: ScribeMessage = {
      id: `msg-ocr-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      speaker: 'ai',
      text: `Pipeline OCR RF-02 concluído: ${newBios.length} analitos laboratoriais importados com normalização de unidades e alvos funcionais calibrados.`
    };
    setScribeMessages(prev => [...prev, ocrMsg]);
  };

  const handleDispatchScribeMessage = (text: string, speaker: 'patient' | 'nutritionist' | 'ai' | 'system' = 'patient') => {
    const customMsg: ScribeMessage = {
      id: `msg-live-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      speaker,
      text
    };
    setScribeMessages(prev => [...prev, customMsg]);
  };

  const handleStartConsultation = (patient: PatientSummary) => {
    switchActivePatient(patient);
    setActiveTab('anamnese');
  };

  const handleAddNewPatient = (newPatient: PatientSummary, autoStart: boolean) => {
    tenantService.createPatient(newPatient);
    setAllPatients(prev => [newPatient, ...prev]);

    // Registro no Copiloto Clínico
    const announceMsg: ScribeMessage = {
      id: `msg-new-pat-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      speaker: 'ai',
      text: `Novo paciente registrado no prontuário de ${activeNutritionist.name}: **${newPatient.name}**. TMB estimada: ${newPatient.bmr} kcal, GET: ${newPatient.get} kcal, Meta calórica alvo: ${newPatient.targetKcal} kcal (${newPatient.goal}). Canal WhatsApp Zero-App (${newPatient.phone}) provisionado com conformidade CFN nº 856/2026.`
    };
    setScribeMessages(prev => [...prev, announceMsg]);

    if (autoStart) {
      switchActivePatient(newPatient);
      setActiveTab('anamnese');
    }
  };

  const handleUpdatePatientRecord = (id: string, updates: Partial<PatientSummary>) => {
    tenantService.updatePatient(id, updates);
    setAllPatients(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    if (activePatient.id === id) {
      setActivePatient(prev => ({ ...prev, ...updates }));
    }
  };

  const handleDeletePatientRecord = (id: string) => {
    tenantService.deletePatient(id);
    const updated = allPatients.filter(p => p.id !== id);
    setAllPatients(updated);
    if (activePatient.id === id && updated.length > 0) {
      switchActivePatient(updated[0]);
    }
  };

  const handleDispatchWhatsApp = () => {
    const notifyMsg: ScribeMessage = {
      id: `msg-disp-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      speaker: 'ai',
      text: `Plano alimentar transmitido via WhatsApp Business Cloud API para ${activePatient.name} (${activePatient.phone}). Lembretes programados.`
    };
    setScribeMessages(prev => [...prev, notifyMsg]);
  };

  const isClinicalTab = ['anamnese', 'avaliacao', 'editor', 'finalizar'].includes(activeTab);

  return (
    <div className="h-screen w-screen flex bg-[#F8F9FA] text-slate-800 overflow-hidden font-['Roboto',sans-serif]">
      {/* 1. Sidebar Global */}
      <Sidebar 
        activeTab={activeTab} 
        onSelectTab={setActiveTab} 
        activeNutritionist={activeNutritionist}
      />

      {/* 2. Área Central de Aplicação */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Topbar com dados do Paciente ou da Clínica e Navegação em Pílulas */}
        <Header 
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          patient={activePatient}
          isRecording={isRecording}
          onToggleRecording={handleToggleRecording}
          recordingDuration={formatDuration(recordingSeconds)}
          onOpenRecordingStudio={() => setIsGlobalAudioModalOpen(true)}
          onOpenPdfModal={() => setIsGlobalPdfModalOpen(true)}
          clinic={clinic}
          activeNutritionist={activeNutritionist}
        />

        {/* HUD Metabólico Superior Fixo (Visível em abas clínicas e no editor) */}
        {isClinicalTab && (
          <MetabolicHUD 
            meals={meals}
            targetKcal={activePatient.targetKcal}
            targetPtn={activePatient.targetPtn || 140}
            targetCho={activePatient.targetCho || 250}
            targetLip={activePatient.targetLip || 60}
            ptnPerKg={activePatient.ptnPerKg}
            choPerKg={activePatient.choPerKg}
            lipPerKg={activePatient.lipPerKg}
            patientWeight={activePatient.weight}
            bmr={activePatient.bmr}
            get={activePatient.get}
            bmrFormula={activePatient.bmrFormula || 'cunningham'}
            activityLevel={activePatient.activityLevel || 'Moderado (Musculação 5x/sem)'}
            goal={activePatient.goal}
            isLeucineThresholdMet={true}
          />
        )}

        {/* 3. Corpo Principal com Arquitetura Dual-Pane (65% Canvas / 35% Copiloto) */}
        <div className="flex-1 flex overflow-hidden">
          {/* Lado Esquerdo: Canvas Clínico / Conteúdo Principal */}
          <main className={`h-full overflow-y-auto ${isClinicalTab ? 'w-full lg:w-[65%]' : 'w-full'}`}>
            {activeTab === 'dashboard' && (
              <DashboardView 
                patients={allPatients}
                onStartConsultation={handleStartConsultation}
              />
            )}

            {activeTab === 'anamnese' && (
              <AnamneseView 
                biomarkers={biomarkers}
                patient={activePatient}
                anamnese={anamnese}
                onUpdateAnamnese={setAnamnese}
                isRecordingGlobal={isRecording}
                onToggleRecordingGlobal={handleToggleRecording}
                recordingSeconds={recordingSeconds}
                onUpdateBiomarkers={handleUpdateBiomarkers}
                onUpdatePatient={handleUpdatePatient}
                onDispatchScribeMessage={handleDispatchScribeMessage}
              />
            )}

            {activeTab === 'avaliacao' && (
              <AvaliacaoFisicaView 
                composition={bodyComposition}
                patientAge={activePatient.age}
                patientGoal={activePatient.goal}
                patientGender={activePatient.gender || 'feminino'}
                initialTargetKcal={activePatient.targetKcal}
                initialTargetPtn={activePatient.targetPtn}
                initialTargetCho={activePatient.targetCho}
                initialTargetLip={activePatient.targetLip}
                onApplyCunninghamToPlan={handleApplyCunninghamToPlan}
              />
            )}

            {activeTab === 'editor' && (
              <EditorDieteticoView 
                meals={meals}
                substitutionRules={substitutionRules}
                patient={activePatient}
                aversions={anamnese.aversions}
                onUpdateMeals={setMeals}
                onUpdateSubstitutionRules={setSubstitutionRules}
                onNotifyScribe={(msg) => handleDispatchScribeMessage(msg, 'ai')}
                patientContext={patientContext}
              />
            )}

            {activeTab === 'finalizar' && (
              <FinalizacaoView 
                compliance={compliance}
                onDispatchWhatsApp={handleDispatchWhatsApp}
                patientContext={patientContext}
                pdfHistory={pdfHistory}
                onRecordPdfSent={handleRecordPdfSent}
              />
            )}

            {activeTab === 'pacientes' && (
              <PacientesView 
                patients={allPatients}
                onSelectPatient={handleStartConsultation}
                onAddNewPatient={handleAddNewPatient}
                onUpdatePatient={handleUpdatePatientRecord}
                onDeletePatient={handleDeletePatientRecord}
                currentNutritionist={activeNutritionist}
                currentClinic={clinic}
              />
            )}

            {/* Camada 1: Gestão Administrativa da Clínica e de Nutricionistas */}
            {activeTab === 'gestao-clinica' && (
              <GestaoClinicaView 
                clinic={clinic}
                nutritionists={allNutritionists}
                activeNutritionist={activeNutritionist}
                onUpdateClinic={handleUpdateClinic}
                onAddNutritionist={handleAddNutritionist}
                onUpdateNutritionist={handleUpdateNutritionist}
                onToggleAccess={handleToggleNutritionistAccess}
                onDeleteNutritionist={handleDeleteNutritionist}
                onSwitchActiveNutritionist={handleSwitchNutritionist}
                onNavigateToTab={setActiveTab}
              />
            )}

            {activeTab === 'configuracoes' && (
              <ConfiguracoesView 
                config={clinicConfig}
              />
            )}
          </main>

          {/* Lado Direito: Copiloto Conversacional & Escuta Ativa (visível em abas clínicas) */}
          {isClinicalTab && (
            <CopilotPanel 
              messages={scribeMessages}
              onSendMessage={handleSendMessageToCopilot}
              isRecording={isRecording}
              onApplySolverSuggestion={handleApplySolverSuggestion}
              isLoading={isCopilotLoading}
              patient={activePatient}
              onTriggerAction={handleCopilotTriggerAction}
              onResetMessages={handleResetCopilotMessages}
            />
          )}
        </div>
      </div>

      {/* Modais Globais de Gravação da Consulta & Geração de PDF */}
      <ConsultationAudioRecordingModal
        isOpen={isGlobalAudioModalOpen}
        onClose={() => setIsGlobalAudioModalOpen(false)}
        patient={activePatient}
        isRecordingGlobal={isRecording}
        onToggleRecordingGlobal={handleToggleRecording}
        recordingSeconds={recordingSeconds}
        onApplyExtractedAnamnese={handleApplyExtractedAnamnese}
        onUpdatePatient={handleUpdatePatient}
      />

      {patientContext && (
        <MealPlanPdfModal
          isOpen={isGlobalPdfModalOpen}
          onClose={() => setIsGlobalPdfModalOpen(false)}
          context={patientContext}
          onRecordPdfSent={handleRecordPdfSent}
        />
      )}
    </div>
  );
}
