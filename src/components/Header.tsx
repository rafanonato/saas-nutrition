import React from 'react';
import { Mic, MicOff, ChevronRight, FileText, Activity, PieChart, Send, Sparkles } from 'lucide-react';
import { ActiveTab, PatientSummary } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  patient: PatientSummary;
  isRecording: boolean;
  onToggleRecording: () => void;
  recordingDuration: string;
  onOpenRecordingStudio?: () => void;
  onOpenPdfModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  patient,
  isRecording,
  onToggleRecording,
  recordingDuration,
  onOpenRecordingStudio,
  onOpenPdfModal
}) => {
  return (
    <header 
      id="main-app-header" 
      className="bg-white border-b border-slate-200 px-6 py-3.5 shrink-0 flex flex-col md:flex-row md:items-center md:justify-between gap-4 select-none shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
    >
      {/* 1. Informações do Paciente Ativo */}
      <div className="flex items-center gap-3.5">
        <div 
          id="patient-avatar-badge"
          className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-sm shadow-xs border border-blue-200"
        >
          {patient.avatarInitials}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-slate-900 text-base tracking-tight">{patient.name}</h1>
            <span className="text-xs text-slate-400 font-normal">• {patient.age} anos • {(patient.height / 100).toFixed(2)}m</span>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
              {patient.status}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
            <span className="font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
              Meta: {patient.goal}
            </span>
            <span className="text-slate-400">
              TMB: {patient.bmr} kcal (Cunningham)
            </span>
            <span className="text-slate-400 hidden sm:inline">
              Data: {patient.attendanceDate}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Navegação em Pílulas (Pill Navigation - Estilo Google Material 3) */}
      <nav 
        id="clinical-stepper-navigation"
        className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200/80 shadow-inner overflow-x-auto"
      >
        <button
          id="tab-btn-anamnese"
          onClick={() => onSelectTab('anamnese')}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'anamnese'
              ? 'bg-white text-blue-600 font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Anamnese & Exames</span>
        </button>

        <button
          id="tab-btn-avaliacao"
          onClick={() => onSelectTab('avaliacao')}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'avaliacao'
              ? 'bg-white text-blue-600 font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Avaliação Física</span>
        </button>

        <button
          id="tab-btn-editor"
          onClick={() => onSelectTab('editor')}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'editor'
              ? 'bg-white text-blue-600 font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <PieChart className="w-3.5 h-3.5" />
          <span>Editor Dietético</span>
        </button>

        <button
          id="tab-btn-finalizar"
          onClick={() => onSelectTab('finalizar')}
          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'finalizar'
              ? 'bg-white text-blue-600 font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Finalizar & WhatsApp</span>
        </button>
      </nav>

      {/* 3. Gravação / Ações Rápidas */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Botão de Gravação de Escuta Ativa */}
        <div className="flex items-center gap-1.5">
          <button
            id="btn-toggle-recording"
            onClick={onToggleRecording}
            className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all border cursor-pointer ${
              isRecording
                ? 'bg-rose-50 text-rose-700 border-rose-200 shadow-xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
            title={isRecording ? 'Pausar escuta ambiente' : 'Ativar escuta ambiente da consulta'}
          >
            {isRecording ? (
              <>
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping inline-block" />
                <Mic className="w-3.5 h-3.5 text-rose-600" />
                <span className="font-semibold">Gravando: {recordingDuration}</span>
              </>
            ) : (
              <>
                <MicOff className="w-3.5 h-3.5 text-slate-400" />
                <span>Escuta Pausada</span>
              </>
            )}
          </button>

          {onOpenRecordingStudio && (
            <button
              type="button"
              onClick={onOpenRecordingStudio}
              className="px-2.5 py-1.5 rounded-full text-xs font-semibold bg-rose-100/70 hover:bg-rose-100 text-rose-800 border border-rose-200 transition cursor-pointer flex items-center gap-1 shadow-2xs"
              title="Abrir Estúdio de Áudio da Consulta & Speech-to-Text"
            >
              <Sparkles className="w-3 h-3 text-rose-600" />
              <span className="hidden sm:inline">Estúdio STT</span>
            </button>
          )}
        </div>

        {/* Botão Rápido de PDF se estiver no Editor ou Finalização */}
        {onOpenPdfModal && (activeTab === 'editor' || activeTab === 'finalizar') && (
          <button
            type="button"
            onClick={onOpenPdfModal}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
            title="Gerar e Visualizar PDF Diagramado do Plano Alimentar"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Gerar PDF</span>
          </button>
        )}

        {/* Botão de Próxima Etapa */}
        <button
          id="btn-next-step"
          onClick={() => {
            if (activeTab === 'anamnese') onSelectTab('avaliacao');
            else if (activeTab === 'avaliacao') onSelectTab('editor');
            else if (activeTab === 'editor') onSelectTab('finalizar');
            else onSelectTab('dashboard');
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-1.5 rounded-full text-xs shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <span>
            {activeTab === 'anamnese' && 'Avançar para Avaliação'}
            {activeTab === 'avaliacao' && 'Avançar para Editor Dietético'}
            {activeTab === 'editor' && 'Concluir & Disparar Plano'}
            {activeTab === 'finalizar' && 'Ir para Agenda'}
            {activeTab === 'dashboard' && 'Iniciar Consulta'}
            {activeTab === 'pacientes' && 'Retornar ao Editor'}
            {activeTab === 'configuracoes' && 'Voltar'}
          </span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
