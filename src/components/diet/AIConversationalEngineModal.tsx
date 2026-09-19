import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  Camera, 
  Mic, 
  FileText, 
  Check, 
  RotateCcw, 
  Cpu, 
  Database, 
  Activity, 
  ShieldCheck, 
  UserCheck, 
  AlertCircle,
  Clock,
  Eye
} from 'lucide-react';
import { 
  WhatsAppChatMessage, 
  PatientContextPayload, 
  Meal 
} from '../../types';
import { 
  buildPatientSystemPrompt, 
  generateLocalContextAwareReply 
} from './aiConversationEngine';

interface AIConversationalEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: PatientContextPayload;
  onDispatchWhatsAppPlan?: () => void;
}

export const AIConversationalEngineModal: React.FC<AIConversationalEngineModalProps> = ({
  isOpen,
  onClose,
  context,
  onDispatchWhatsAppPlan
}) => {
  const [activeViewMode, setActiveViewMode] = useState<'simulator' | 'context_debugger' | 'rules'>('simulator');
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [useLiveGemini, setUseLiveGemini] = useState(true);
  const [engineBadge, setEngineBadge] = useState<string>('Gemini 3.8 Flash • Ativo');
  const [messages, setMessages] = useState<WhatsAppChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      timestamp: '14:40',
      text: `Olá ${context.patient.name.split(' ')[0]}! Aqui é o seu Canal Zero-App oficial da Clínica. Seu plano de Hipertrofia de ${context.patient.targetKcal} kcal está 100% calibrado pela Dra. Camila Silveira (CRN-3 / 48.912). Qualquer dúvida sobre trocas de alimentos, horários ou fotos de prato, me envie aqui! ✨`,
      mediaType: 'pdf',
      mediaUrl: `Plano_Nutricional_${context.patient.name.replace(' ', '_')}_2026.pdf`
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const systemPrompt = buildPatientSystemPrompt(context);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  if (!isOpen) return null;

  const handleSend = async (customText?: string, isImage = false) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() && !isImage) return;

    const userTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const userMsg: WhatsAppChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'patient',
      timestamp: userTime,
      text: isImage ? '📷 [Foto do Almoço Enviada para Micro Check-in]' : textToSend,
      mediaType: isImage ? 'image' : 'text'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsProcessing(true);

    try {
      if (useLiveGemini) {
        // Chamada real ao endpoint seguro Express /api/ai/patient-chat
        const response = await fetch('/api/ai/patient-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userMessage: textToSend,
            context,
            isImageCheckin: isImage
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.source === 'live_ai') {
            setEngineBadge('Gemini 3.8 Flash • Online');
          } else if (data.source === 'resilient_fallback') {
            setEngineBadge('Copiloto Resiliente (Proteção 503)');
          } else {
            setEngineBadge('Motor Clínico Local');
          }

          const botMsg: WhatsAppChatMessage = {
            id: `bot-${Date.now()}`,
            sender: 'assistant',
            timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            text: data.replyText,
            visionAnalysis: data.visionAnalysis,
            substitutionCard: data.substitutionCard
          };
          setMessages(prev => [...prev, botMsg]);
          setIsProcessing(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Fallback para motor heurístico contextual local:', e);
      setEngineBadge('Motor Clínico Local (Offline)');
    }

    // Fallback gracioso com motor local ultrarrápido
    setTimeout(() => {
      setEngineBadge('Motor Clínico Local');
      const reply = generateLocalContextAwareReply(textToSend, context, isImage);
      setMessages(prev => [...prev, reply]);
      setIsProcessing(false);
    }, 450);
  };

  const handleSimulateQuickPrompt = (prompt: string, isImage = false) => {
    handleSend(prompt, isImage);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'init-reset',
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        text: `Olá ${context.patient.name.split(' ')[0]}! Canal reiniciado com o prontuário atualizado. Como posso te apoiar hoje?`,
        mediaType: 'pdf'
      }
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-3 md:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white tracking-tight">Motor Conversacional de IA (Pós-Consulta)</h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Prontuário Ativo
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Atendimento Zero-App WhatsApp com IA Generativa conectada ao prontuário, refeições e regras clínicas
              </p>
            </div>
          </div>

          {/* Tab switches */}
          <div className="flex items-center gap-2">
            <div className="bg-slate-800 p-1 rounded-xl flex items-center text-xs">
              <button
                onClick={() => setActiveViewMode('simulator')}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  activeViewMode === 'simulator' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Simulador WhatsApp
              </button>
              <button
                onClick={() => setActiveViewMode('context_debugger')}
                className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                  activeViewMode === 'context_debugger' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                Contexto Injetado
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row bg-slate-50">
          {/* Lado Esquerdo: Simulador WhatsApp ou Visualizador de Contexto */}
          {activeViewMode === 'simulator' ? (
            <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
              {/* WhatsApp Device Container */}
              <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 bg-slate-100 overflow-y-auto">
                <div className="w-full max-w-md bg-white rounded-[32px] shadow-xl border-4 border-slate-800 overflow-hidden flex flex-col h-[560px]">
                  {/* WhatsApp Topbar */}
                  <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center border border-white/20">
                        DC
                      </div>
                      <div>
                        <div className="font-bold text-xs leading-tight">Dra. Camila Silveira</div>
                        <div className="text-[10px] text-emerald-200 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>{engineBadge}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={handleResetChat}
                        title="Reiniciar Conversa"
                        className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 bg-[#E5DDD5] p-3.5 space-y-3 overflow-y-auto text-xs">
                    <div className="text-center">
                      <span className="bg-white/80 text-slate-500 text-[10px] font-medium px-2.5 py-1 rounded-full shadow-2xs">
                        Hoje • Criptografia e Prontuário Homologado
                      </span>
                    </div>

                    {messages.map((m) => (
                      <div
                        key={m.id}
                        className={`flex flex-col ${m.sender === 'patient' ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`rounded-2xl p-3 shadow-xs max-w-[88%] space-y-1.5 ${
                            m.sender === 'patient'
                              ? 'bg-[#DCF8C6] text-slate-900 rounded-tr-xs'
                              : 'bg-white text-slate-800 rounded-tl-xs'
                          }`}
                        >
                          {/* Attached PDF card */}
                          {m.mediaType === 'pdf' && (
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center gap-3 my-1">
                              <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div className="overflow-hidden">
                                <div className="font-bold text-slate-800 text-[11px] truncate">
                                  {m.mediaUrl || 'Plano_Alimentar_Prescrito.pdf'}
                                </div>
                                <div className="text-[9px] text-slate-500">2.4 MB • Prescrição CFN nº 856</div>
                              </div>
                            </div>
                          )}

                          {/* Text */}
                          <div className="text-[11.5px] leading-relaxed whitespace-pre-line">
                            {m.text}
                          </div>

                          {/* Substitution Card if present */}
                          {m.substitutionCard && (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 space-y-1 text-[11px] mt-1.5">
                              <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                Equivalência Matemática Aprovada
                              </div>
                              <div className="text-slate-700">
                                <span className="font-semibold text-slate-800">Original:</span> {m.substitutionCard.originalFood}
                              </div>
                              <div className="text-emerald-800 font-medium">
                                <span className="font-semibold text-slate-800">Troca:</span> {m.substitutionCard.suggestedAlternative}
                              </div>
                              <div className="text-[10px] text-slate-500 pt-1 border-t border-emerald-100 flex items-center justify-between">
                                <span>{m.substitutionCard.macrosPreserved}</span>
                                <span className="bg-white px-1.5 py-0.5 rounded text-emerald-700 font-bold">mTORC1 OK</span>
                              </div>
                            </div>
                          )}

                          {/* Vision Analysis Card if present */}
                          {m.visionAnalysis && (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-2.5 space-y-1 text-[11px] mt-1.5">
                              <div className="font-bold text-blue-900 flex items-center gap-1.5">
                                <Eye className="w-3.5 h-3.5 text-blue-600" />
                                Reconhecimento Visual de Refeição
                              </div>
                              <div className="text-slate-700">
                                <span className="font-semibold text-slate-800">Itens:</span> {m.visionAnalysis.identifiedItems.join(', ')}
                              </div>
                              <div className="text-[10px] text-blue-800 font-medium flex items-center justify-between pt-1 border-t border-blue-100">
                                <span>{m.visionAnalysis.complianceEstimate}</span>
                                <span className="bg-white px-1.5 py-0.5 rounded text-blue-700 font-bold">Fibras: {m.visionAnalysis.fiberVegetableScore}</span>
                              </div>
                            </div>
                          )}

                          <span className="text-[9px] text-slate-400 block text-right">
                            {m.timestamp}
                          </span>
                        </div>
                      </div>
                    ))}

                    {isProcessing && (
                      <div className="flex items-start">
                        <div className="bg-white rounded-2xl rounded-tl-xs p-3 shadow-xs text-xs text-slate-500 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                          <span>Dra. Camila digitando / consultando prontuário...</span>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Bar */}
                  <div className="bg-[#F0F0F0] p-2.5 flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleSimulateQuickPrompt('📷 Enviar foto do almoço de hoje', true)}
                      title="Simular foto de prato (Visão Computacional)"
                      className="w-9 h-9 rounded-full bg-white hover:bg-slate-200 text-slate-600 flex items-center justify-center transition shadow-2xs"
                    >
                      <Camera className="w-4 h-4 text-blue-600" />
                    </button>

                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Mensagem do paciente..."
                      className="flex-1 bg-white rounded-full px-3.5 py-2 text-xs text-slate-800 outline-none border border-slate-200 focus:border-emerald-500"
                    />

                    <button
                      onClick={() => handleSend()}
                      className="w-9 h-9 rounded-full bg-[#075E54] hover:bg-[#064e46] text-white flex items-center justify-center transition shadow-2xs"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Lado Direito do Simulador: Cenários Rápidos de Teste Clínico */}
              <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-200 p-5 bg-white space-y-4 overflow-y-auto">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Cenários de Teste Rápidos
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Envie perguntas frequentes de pacientes para testar as travas do prontuário:
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => handleSimulateQuickPrompt('Posso trocar o filé de frango do almoço por ovos ou patinho hoje?')}
                    className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition text-xs space-y-1"
                  >
                    <span className="font-bold text-slate-800 block text-[11px]">🍗 Substituição de Proteína</span>
                    <p className="text-[10px] text-slate-500">Testa equivalência de 40g Ptn e leucina sem alterar macros.</p>
                  </button>

                  <button
                    onClick={() => handleSimulateQuickPrompt('Posso trocar o arroz do almoço por batata-doce?')}
                    className="w-full text-left p-2.5 rounded-xl border border-rose-200 bg-rose-50/30 hover:bg-rose-50 transition text-xs space-y-1"
                  >
                    <span className="font-bold text-rose-900 block text-[11px]">🍠 Teste de Aversão (Batata-Doce)</span>
                    <p className="text-[10px] text-rose-700">Verifica se o motor respeita a restrição de enjoo detectada.</p>
                  </button>

                  <button
                    onClick={() => handleSimulateQuickPrompt('Meu intestino travou faz 2 dias, o que posso fazer?')}
                    className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition text-xs space-y-1"
                  >
                    <span className="font-bold text-slate-800 block text-[11px]">🌿 Queixa de Constipação (Bristol 2)</span>
                    <p className="text-[10px] text-slate-500">Resgata prescrição de fibras, hidratação e anota no prontuário.</p>
                  </button>

                  <button
                    onClick={() => handleSimulateQuickPrompt('Qual o melhor horário para eu tomar o suplemento de ferro?')}
                    className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition text-xs space-y-1"
                  >
                    <span className="font-bold text-slate-800 block text-[11px]">💊 Suplementação (Ferritina 18)</span>
                    <p className="text-[10px] text-slate-500">Valida orientação de absorção (longe de leite e com vitamina C).</p>
                  </button>

                  <button
                    onClick={() => handleSimulateQuickPrompt('📷 Enviar foto do almoço de hoje', true)}
                    className="w-full text-left p-2.5 rounded-xl border border-blue-200 bg-blue-50/30 hover:bg-blue-50 transition text-xs space-y-1"
                  >
                    <span className="font-bold text-blue-900 block text-[11px]">📸 Micro-Checkin com Foto</span>
                    <p className="text-[10px] text-blue-700">Simula visão computacional avaliando proporção do prato.</p>
                  </button>
                </div>

                {/* Finalizar e Disparar Consulta */}
                <div className="pt-3 border-t border-slate-200 space-y-2">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-[11px] text-emerald-900">
                    <strong>Disparo Conectado:</strong> O motor de IA é inicializado automaticamente quando a consulta é finalizada.
                  </div>
                  {onDispatchWhatsAppPlan && (
                    <button
                      onClick={() => {
                        onDispatchWhatsAppPlan();
                        onClose();
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition"
                    >
                      <Check className="w-4 h-4" />
                      Finalizar e Disparar no WhatsApp
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Context Debugger View: Injeção Completa de Prontuário */
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Database className="w-5 h-5 text-emerald-600" />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Context Payload Injetado no Modelo Gemini</h4>
                      <p className="text-xs text-slate-500">Todo o histórico clínico, medições antropométricas, exames laboratoriais e refeições calculadas.</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded">
                    CFN nº 856 / 2026 Compliant
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[10px] font-bold uppercase">Massa Livre de Gordura (MLG)</span>
                    <span className="text-sm font-bold text-slate-900">{context.bodyComposition.leanMassKg} kg</span>
                    <p className="text-[10px] text-slate-500 mt-1">Cunningham: {context.bodyComposition.bmrCunningham} kcal</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[10px] font-bold uppercase">Restrições e Aversões</span>
                    <span className="text-xs font-bold text-rose-600">{context.anamnese.aversions.join(', ')}</span>
                    <p className="text-[10px] text-slate-500 mt-1">Trava estrita ativa</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[10px] font-bold uppercase">Refeições Homologadas</span>
                    <span className="text-sm font-bold text-emerald-700">{context.meals.length} Refeições</span>
                    <p className="text-[10px] text-slate-500 mt-1">Meta: {context.patient.targetKcal} kcal</p>
                  </div>
                </div>

                {/* Raw System Prompt View */}
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    System Instruction Gerada Automaticamente:
                  </label>
                  <pre className="bg-slate-950 text-emerald-400 p-4 rounded-xl text-[11px] font-mono whitespace-pre-wrap max-h-72 overflow-y-auto leading-relaxed">
                    {systemPrompt}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
