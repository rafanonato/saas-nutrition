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

import { 
  ActiveTab, 
  PatientSummary, 
  Meal, 
  ScribeMessage 
} from './types';

import { 
  CURRENT_PATIENT, 
  ALL_PATIENTS, 
  INITIAL_MEALS, 
  INITIAL_BIOMARKERS, 
  INITIAL_BODY_COMPOSITION, 
  INITIAL_SUBSTITUTION_RULES, 
  INITIAL_SCRIBE_MESSAGES, 
  DEFAULT_CLINIC_CONFIG, 
  INITIAL_COMPLIANCE 
} from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('editor');
  const [activePatient, setActivePatient] = useState<PatientSummary>(CURRENT_PATIENT);
  const [allPatients] = useState<PatientSummary[]>(ALL_PATIENTS);
  const [meals, setMeals] = useState<Meal[]>(INITIAL_MEALS);
  const [biomarkers] = useState(INITIAL_BIOMARKERS);
  const [bodyComposition] = useState(INITIAL_BODY_COMPOSITION);
  const [substitutionRules] = useState(INITIAL_SUBSTITUTION_RULES);
  const [scribeMessages, setScribeMessages] = useState<ScribeMessage[]>(INITIAL_SCRIBE_MESSAGES);
  const [clinicConfig] = useState(DEFAULT_CLINIC_CONFIG);
  const [compliance] = useState(INITIAL_COMPLIANCE);

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

  const formatDuration = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleRecording = () => {
    setIsRecording(prev => !prev);
  };

  const handleSendMessageToCopilot = (text: string) => {
    const newMsg: ScribeMessage = {
      id: `msg-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      speaker: 'nutritionist',
      text
    };

    setScribeMessages(prev => [...prev, newMsg]);

    // Simulate instant solver response (<100ms)
    setTimeout(() => {
      const aiReply: ScribeMessage = {
        id: `msg-reply-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        speaker: 'ai',
        text: `Comando processado via HiGHS Solver: Gramaturas e macronutrientes recalculados com base nas tabelas TACO/TBCA. Leucina garantida em 3.2g para estímulo da via mTORC1.`
      };
      setScribeMessages(prev => [...prev, aiReply]);
    }, 400);
  };

  const handleApplySolverSuggestion = () => {
    // Flash visual confirmation and ensure lunch meal has exact optimized values
    setMeals(prev => prev.map(meal => {
      if (meal.id === 'meal-2') {
        return {
          ...meal,
          targetPtn: 40,
          currentLeucine: 3.2,
          leucineThresholdMet: true
        };
      }
      return meal;
    }));

    const confirmMsg: ScribeMessage = {
      id: `msg-confirm-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      speaker: 'ai',
      text: 'Sucesso: Solução do Solver HiGHS aplicada à Refeição 2. O HUD Metabólico e a Matriz de Substituições foram sincronizados.'
    };
    setScribeMessages(prev => [...prev, confirmMsg]);
  };

  const handleStartConsultation = (patient: PatientSummary) => {
    setActivePatient(patient);
    setActiveTab('anamnese');
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
      />

      {/* 2. Área Central de Aplicação */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Topbar com dados do Paciente e Navegação em Pílulas */}
        <Header 
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          patient={activePatient}
          isRecording={isRecording}
          onToggleRecording={handleToggleRecording}
          recordingDuration={formatDuration(recordingSeconds)}
        />

        {/* HUD Metabólico Superior Fixo (Visível em abas clínicas e no editor) */}
        {isClinicalTab && (
          <MetabolicHUD 
            meals={meals}
            targetKcal={activePatient.targetKcal}
            targetPtn={140}
            targetCho={250}
            targetLip={60}
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
              />
            )}

            {activeTab === 'avaliacao' && (
              <AvaliacaoFisicaView 
                composition={bodyComposition}
              />
            )}

            {activeTab === 'editor' && (
              <EditorDieteticoView 
                meals={meals}
                substitutionRules={substitutionRules}
              />
            )}

            {activeTab === 'finalizar' && (
              <FinalizacaoView 
                compliance={compliance}
                onDispatchWhatsApp={handleDispatchWhatsApp}
              />
            )}

            {activeTab === 'pacientes' && (
              <PacientesView 
                patients={allPatients}
                onSelectPatient={handleStartConsultation}
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
            />
          )}
        </div>
      </div>
    </div>
  );
}
