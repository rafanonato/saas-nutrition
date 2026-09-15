import React, { useState } from 'react';
import { Cpu, Mic, Send, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Zap } from 'lucide-react';
import { ScribeMessage } from '../types';

interface CopilotPanelProps {
  messages: ScribeMessage[];
  onSendMessage: (text: string) => void;
  isRecording: boolean;
  onApplySolverSuggestion?: () => void;
}

export const CopilotPanel: React.FC<CopilotPanelProps> = ({
  messages,
  onSendMessage,
  isRecording,
  onApplySolverSuggestion
}) => {
  const [inputText, setInputText] = useState('');

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <aside 
      id="copilot-sidebar-panel" 
      className="w-full lg:w-[35%] bg-white border-l border-slate-200 flex flex-col shrink-0 shadow-[-1px_0_4px_rgba(0,0,0,0.02)] z-10 h-full overflow-hidden"
    >
      {/* 1. Header do Copiloto */}
      <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-blue-50/70 via-slate-50/40 to-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Copiloto Clínico HiGHS</h2>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-500">Solver Otimizador & Escuta Integrada</p>
          </div>
        </div>

        <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
          TACO / TBCA Conectado
        </span>
      </div>

      {/* 2. Feed de Transcrição & Mensagens */}
      <div 
        id="copilot-chat-feed"
        className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/60 text-xs"
      >
        {/* Banner de Escuta Ativa */}
        <div className={`p-3 rounded-2xl border transition-all ${
          isRecording 
            ? 'bg-rose-50/80 border-rose-200 text-rose-900' 
            : 'bg-slate-100/80 border-slate-200 text-slate-600'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold flex items-center gap-1.5 text-xs">
              <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-rose-600 animate-ping' : 'bg-slate-400'}`} />
              {isRecording ? 'ESCUTA ATIVA GRAVANDO EM TEMPO REAL' : 'ESCUTA AMBIENTE EM ESPERA'}
            </span>
            <span className="text-[10px] opacity-75">Res. CFN 856/2026</span>
          </div>
          <p className="text-[11px] opacity-85 leading-relaxed">
            {isRecording 
              ? 'Ouvindo o diálogo com a paciente. Sintomas, aversões e dados de medidas são extraídos e enviados diretamente ao prontuário.'
              : 'Clique no botão superior para ativar a captura contínua e extração do diálogo da consulta.'}
          </p>
        </div>

        {/* Mensagens do histórico */}
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-1">
            <div className={`flex items-center gap-1.5 text-[10px] text-slate-400 ${
              msg.speaker === 'nutritionist' ? 'justify-end mr-1' : 'ml-1'
            }`}>
              <span>
                {msg.speaker === 'patient' && 'Transcrição Paciente'}
                {msg.speaker === 'nutritionist' && 'Seu Comando / Nutricionista'}
                {msg.speaker === 'ai' && 'Copiloto HiGHS (84ms)'}
              </span>
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            <div className={`flex ${msg.speaker === 'nutritionist' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[92%] p-3 rounded-2xl text-xs leading-relaxed shadow-xs ${
                  msg.speaker === 'nutritionist'
                    ? 'bg-blue-600 text-white rounded-tr-xs'
                    : msg.speaker === 'ai'
                    ? 'bg-white border border-emerald-200 text-slate-800 rounded-tl-xs'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
                }`}
              >
                {msg.speaker === 'ai' && (
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold mb-1 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Sugestão de Conduta Metabólica</span>
                  </div>
                )}

                <p>{msg.text}</p>

                {/* Badge de Entidade Detectada */}
                {msg.detectedEntities && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                      <Zap className="w-2.5 h-2.5" />
                      {msg.detectedEntities.label}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Card Interativo de Solução do Solver HiGHS */}
        <div id="solver-suggestion-card" className="bg-white border border-emerald-300 rounded-2xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Solução Exata Encontrada (84ms)
            </span>
            <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">
              HiGHS v1.7
            </span>
          </div>
          <p className="text-[11px] text-slate-600 mb-3 leading-relaxed">
            Alcançado <strong>55.3g de proteína</strong> total e <strong>3.2g de leucina</strong> com medidas práticas: 150g de frango + 5 colheres de arroz + 1 concha de feijão.
          </p>
          <button 
            id="btn-apply-solver-solution"
            onClick={onApplySolverSuggestion}
            className="w-full bg-slate-900 hover:bg-black text-white font-medium py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Aplicar à Refeição 2 (Almoço)</span>
          </button>
        </div>

        {/* Indicador de escuta ao vivo */}
        {isRecording && (
          <div className="flex items-center gap-2 text-slate-400 text-[11px] px-2 py-1 bg-slate-100/60 rounded-xl w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            <span>Escutando consulta ativamente...</span>
          </div>
        )}
      </div>

      {/* 3. Input de Comandos Clínicos */}
      <div className="p-3 bg-white border-t border-slate-100 shrink-0">
        <form onSubmit={handleSend} className="relative flex items-center bg-slate-100/90 rounded-2xl px-3 py-1 border border-slate-200 focus-within:border-blue-400 focus-within:bg-white transition-all shadow-inner">
          <input
            id="copilot-input-field"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Peça ao copiloto: 'Ajuste almoço para 45g PTN'..."
            className="w-full bg-transparent border-none focus:outline-none py-2.5 text-xs text-slate-800 placeholder:text-slate-400"
          />
          <div className="flex items-center gap-1 ml-1.5 shrink-0">
            <button
              type="button"
              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
              title="Ditar comando por voz"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              id="copilot-send-btn"
              type="submit"
              disabled={!inputText.trim()}
              className="p-1.5 text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 rounded-lg transition shadow-xs"
              title="Enviar comando"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
        <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 mt-1.5">
          <span>Pressione Enter para enviar</span>
          <span>Sem alucinações • HiGHS Determinístico</span>
        </div>
      </div>
    </aside>
  );
};
