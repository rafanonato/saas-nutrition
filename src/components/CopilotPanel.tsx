import React, { useState, useRef, useEffect } from 'react';
import { 
  Cpu, 
  Mic, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Zap, 
  Search, 
  FileText, 
  Activity, 
  ShieldAlert, 
  TrendingUp, 
  RotateCcw,
  Loader2,
  Database,
  Flame,
  Check
} from 'lucide-react';
import { ScribeMessage, PatientSummary } from '../types';

interface CopilotPanelProps {
  messages: ScribeMessage[];
  onSendMessage: (text: string) => void;
  isRecording: boolean;
  onApplySolverSuggestion?: () => void;
  isLoading?: boolean;
  patient?: PatientSummary;
  onTriggerAction?: (actionType: string) => void;
  onResetMessages?: () => void;
}

export const CopilotPanel: React.FC<CopilotPanelProps> = ({
  messages,
  onSendMessage,
  isRecording,
  onApplySolverSuggestion,
  isLoading = false,
  patient,
  onTriggerAction,
  onResetMessages
}) => {
  const [inputText, setInputText] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Rolagem suave para o final quando novas mensagens chegam
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleQuickQuestion = (question: string) => {
    if (isLoading) return;
    onSendMessage(question);
  };

  const quickQuestions = [
    {
      id: 'q-exams',
      label: 'Exames & Ferritina',
      icon: Activity,
      query: 'Quais são os principais biomarcadores alterados nos exames da paciente e qual a conduta recomendada?'
    },
    {
      id: 'q-highs',
      label: '⚡ Otimizar Almoço (HiGHS)',
      icon: Zap,
      query: 'Otimize a Refeição 2 (Almoço) via HiGHS Solver para atingir 45g de proteína e garantir o gatilho de leucina mTORC1.'
    },
    {
      id: 'q-constipation',
      label: 'Constipação (Bristol 2)',
      icon: AlertTriangle,
      query: 'Qual a melhor conduta nutricional e hídrica para a queixa de fezes encaroçadas Bristol Tipo 2 relatada na anamnese?'
    },
    {
      id: 'q-aversions',
      label: 'Aversões & Lactose',
      icon: ShieldAlert,
      query: 'Quais são as aversões e restrições alimentares estritas cadastradas no prontuário e seus substitutos seguros?'
    },
    {
      id: 'q-mlg',
      label: 'Massa Magra (Cunningham)',
      icon: TrendingUp,
      query: 'Qual foi a evolução longitudinal de Massa Livre de Gordura (MLG) e como foi calculada a TMB Cunningham?'
    },
    {
      id: 'q-audio',
      label: 'Áudios da Consulta',
      icon: Mic,
      query: 'Resuma os principais relatos e horários declarados pela paciente nas gravações da consulta clínica.'
    }
  ];

  // Formatador simples para mensagens com quebras de linha e negrito markdown
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-1.5 leading-relaxed">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1" />;
          
          // Formatação básica de negrito **texto**
          const parts = line.split(/(\*\*.*?\*\*)/g);
          return (
            <p key={idx} className="text-xs">
              {parts.map((part, pIdx) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return (
                    <strong key={pIdx} className="font-semibold text-slate-900">
                      {part.slice(2, -2)}
                    </strong>
                  );
                }
                return part;
              })}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <aside 
      id="copilot-sidebar-panel" 
      className="w-full lg:w-[35%] bg-white border-l border-slate-200 flex flex-col shrink-0 shadow-[-1px_0_4px_rgba(0,0,0,0.02)] z-10 h-full overflow-hidden"
    >
      {/* 1. Header do Copiloto */}
      <div className="p-3.5 border-b border-slate-100 bg-gradient-to-r from-blue-50/70 via-slate-50/40 to-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Copiloto Clínico HiGHS</h2>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Motor Linear & IA Ativos" />
            </div>
            <p className="text-[10px] text-slate-500 flex items-center gap-1">
              <span>Dual Simplex v1.7</span>
              <span>•</span>
              <span className="text-emerald-700 font-medium">Bases TACO / TBCA</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {onResetMessages && (
            <button
              onClick={onResetMessages}
              title="Reiniciar diálogo do copiloto"
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition text-[11px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
          <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
            Prontuário Conectado
          </span>
        </div>
      </div>

      {/* 2. Barra de Pesquisa Rápida & Cenários de Teste do Copiloto */}
      <div className="p-2.5 bg-slate-50/80 border-b border-slate-100 shrink-0">
        <div className="flex items-center justify-between mb-1.5 px-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <Search className="w-3 h-3 text-blue-600" />
            Pesquisa Clínica Rápida (1-Clique)
          </span>
          <span className="text-[9px] text-slate-400 font-mono">
            {patient?.name || 'Manuela'}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
          {quickQuestions.map((q) => {
            const IconComp = q.icon;
            return (
              <button
                key={q.id}
                onClick={() => handleQuickQuestion(q.query)}
                disabled={isLoading}
                className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 rounded-lg shadow-2xs transition-all disabled:opacity-50"
              >
                <IconComp className="w-2.5 h-2.5 text-blue-600 shrink-0" />
                <span>{q.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Feed de Diálogo & Mensagens do Copiloto */}
      <div 
        id="copilot-chat-feed"
        className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 text-xs"
      >
        {/* Banner de Escuta Ativa (Ambient Scribing RF-01) */}
        <div className={`p-3 rounded-2xl border transition-all ${
          isRecording 
            ? 'bg-rose-50/90 border-rose-200 text-rose-900 shadow-xs' 
            : 'bg-white border-slate-200/80 text-slate-600 shadow-2xs'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold flex items-center gap-1.5 text-xs">
              <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-rose-600 animate-ping' : 'bg-slate-400'}`} />
              {isRecording ? 'ESCUTA AMBIENTE GRAVANDO AO VIVO' : 'ESCUTA AMBIENTE EM ESPERA'}
            </span>
            <span className="text-[10px] font-medium text-slate-400">Res. CFN 856/2026</span>
          </div>
          <p className="text-[11px] opacity-85 leading-relaxed">
            {isRecording 
              ? 'Transcrevendo consulta com diarização paciente-nutricionista. Entidades clínicas são automaticamente correlacionadas ao solver.'
              : 'Faça perguntas ao Copiloto sobre exames, histórico de consultas, condutas ou peça otimizações no plano.'}
          </p>
        </div>

        {/* Mensagens do histórico */}
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-1">
            <div className={`flex items-center gap-1.5 text-[10px] text-slate-400 ${
              msg.speaker === 'nutritionist' ? 'justify-end mr-1' : 'ml-1'
            }`}>
              <span>
                {msg.speaker === 'patient' && 'Transcrição da Paciente'}
                {msg.speaker === 'nutritionist' && 'Dra. Maithe (Nutricionista)'}
                {msg.speaker === 'ai' && (msg.engine || 'Copiloto Clínico HiGHS')}
                {msg.speaker === 'system' && 'Sistema TalkNutri'}
              </span>
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            <div className={`flex ${msg.speaker === 'nutritionist' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[94%] p-3.5 rounded-2xl text-xs shadow-xs ${
                  msg.speaker === 'nutritionist'
                    ? 'bg-blue-600 text-white rounded-tr-xs'
                    : msg.speaker === 'ai'
                    ? 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-xs'
                    : 'bg-slate-100 border border-slate-200 text-slate-800 rounded-tl-xs'
                }`}
              >
                {/* Header de Mensagem da IA com Badge de Categoria */}
                {msg.speaker === 'ai' && (
                  <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100">
                    <div className="flex items-center gap-1.5 text-blue-700 font-bold text-[11px]">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>{msg.insightBadge || 'Parecer do Copiloto Clínico'}</span>
                    </div>
                    <span className="text-[9px] font-mono bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200/60">
                      HiGHS
                    </span>
                  </div>
                )}

                {/* Conteúdo da mensagem */}
                {msg.speaker === 'ai' ? (
                  renderFormattedText(msg.text)
                ) : (
                  <p className="leading-relaxed">{msg.text}</p>
                )}

                {/* Badge de Entidades Detectadas */}
                {msg.detectedEntities && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                      <Zap className="w-2.5 h-2.5" />
                      {msg.detectedEntities.label}
                    </span>
                  </div>
                )}

                {/* Botão de Ação Sugerida pelo Copiloto */}
                {msg.suggestedAction && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100">
                    <button
                      onClick={() => {
                        if (msg.suggestedAction?.type === 'apply_solver_lunch' && onApplySolverSuggestion) {
                          onApplySolverSuggestion();
                        } else if (onTriggerAction) {
                          onTriggerAction(msg.suggestedAction?.type || 'action');
                        }
                      }}
                      className="w-full bg-slate-900 hover:bg-black text-white font-medium py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{msg.suggestedAction.label}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Card Interativo de Solução do Solver HiGHS para o Almoço */}
        <div id="solver-suggestion-card" className="bg-white border border-emerald-300 rounded-2xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Solução Exata Encontrada (84ms)
            </span>
            <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200">
              HiGHS v1.7
            </span>
          </div>
          <p className="text-[11px] text-slate-600 mb-3 leading-relaxed">
            Alcançado <strong>55.3g de proteína</strong> total e <strong>3.2g de leucina</strong> com medidas práticas: 150g de frango + 160g de arroz + 100g de feijão + azeite extravirgem.
          </p>
          <button 
            id="btn-apply-solver-solution"
            onClick={onApplySolverSuggestion}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            <span>Aplicar à Refeição 2 (Almoço)</span>
          </button>
        </div>

        {/* Indicador de Carregamento da IA */}
        {isLoading && (
          <div className="flex items-center gap-2 text-blue-700 text-xs px-3 py-2 bg-blue-50 border border-blue-200/80 rounded-xl w-fit animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
            <span>Consultando prontuário e executando HiGHS Solver...</span>
          </div>
        )}

        {/* Indicador de escuta ao vivo */}
        {isRecording && !isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-[11px] px-2 py-1 bg-slate-100/60 rounded-xl w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            <span>Escutando consulta ativamente...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* 4. Input de Comandos Clínicos */}
      <div className="p-3 bg-white border-t border-slate-100 shrink-0">
        <form onSubmit={handleSend} className="relative flex items-center bg-slate-100/90 rounded-2xl px-3 py-1 border border-slate-200 focus-within:border-blue-400 focus-within:bg-white transition-all shadow-inner">
          <input
            id="copilot-input-field"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder="Pesquise sobre exames, histórico ou peça: 'Ajuste almoço para 45g PTN'..."
            className="w-full bg-transparent border-none focus:outline-none py-2.5 text-xs text-slate-800 placeholder:text-slate-400 disabled:opacity-50"
          />
          <div className="flex items-center gap-1 ml-1.5 shrink-0">
            <button
              type="button"
              onClick={() => handleQuickQuestion("Resuma os principais relatos da paciente gravados na consulta e seus horários.")}
              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
              title="Perguntar sobre histórico da consulta"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              id="copilot-send-btn"
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-1.5 text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 rounded-lg transition shadow-xs flex items-center justify-center"
              title="Enviar comando"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
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
