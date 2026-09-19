import React, { useState } from 'react';
import { ShieldCheck, Check, Send, FileText, Smartphone, Camera, Bell, MessageSquare, Bot, Sparkles, AlertCircle, RefreshCw, Eye, Download } from 'lucide-react';
import { ComplianceChecklist, PatientContextPayload, MealPlanPdfExport } from '../../types';
import { AIConversationalEngineModal } from '../diet/AIConversationalEngineModal';
import { MealPlanPdfModal } from '../diet/MealPlanPdfModal';
import { SendHistoryCard } from '../diet/SendHistoryCard';

interface FinalizacaoViewProps {
  compliance: ComplianceChecklist;
  onDispatchWhatsApp: () => void;
  patientContext?: PatientContextPayload;
  pdfHistory?: MealPlanPdfExport[];
  onRecordPdfSent?: (record: MealPlanPdfExport) => void;
}

export const FinalizacaoView: React.FC<FinalizacaoViewProps> = ({
  compliance,
  onDispatchWhatsApp,
  patientContext,
  pdfHistory: externalPdfHistory,
  onRecordPdfSent
}) => {
  const [dispatched, setDispatched] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Histórico local inicializado com o envio oficial
  const [internalHistory, setInternalHistory] = useState<MealPlanPdfExport[]>([
    {
      id: 'pdf-1',
      version: 'v1.0',
      title: `Plano_Alimentar_Hipertrofia_${patientContext?.patient?.name?.replace(/\s+/g, '_') || 'Paciente'}.pdf`,
      patientId: patientContext?.patient?.id || 'pat-1',
      patientName: patientContext?.patient?.name || 'Manuela Silveira',
      targetKcal: patientContext?.patient?.targetKcal || 2100,
      mealsCount: patientContext?.meals?.length || 4,
      generatedAt: '18/09/2026 às 12:45',
      fileSizeKb: 2420,
      status: 'visualizado_paciente',
      viewedAt: '12:47 (via WhatsApp)',
      authenticityHash: 'SHA-256-CFN856-9B41-XF82',
      signedBy: 'Dra. Camila Silveira',
      crn: 'CRN-3 / 48.912'
    }
  ]);

  const currentHistory = externalPdfHistory || internalHistory;

  const handleDispatch = () => {
    setDispatched(true);
    onDispatchWhatsApp();

    // Adiciona ao histórico caso ainda não tenha
    const newRecord: MealPlanPdfExport = {
      id: `pdf-${Date.now()}`,
      version: `v1.${currentHistory.length + 1}`,
      title: `Plano_Alimentar_${patientContext?.patient?.name?.replace(/\s+/g, '_') || 'Paciente'}_Oficial.pdf`,
      patientId: patientContext?.patient?.id || 'pat-1',
      patientName: patientContext?.patient?.name || 'Manuela Silveira',
      targetKcal: patientContext?.patient?.targetKcal || 2100,
      mealsCount: patientContext?.meals?.length || 4,
      generatedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      fileSizeKb: 2420,
      status: 'enviado_whatsapp',
      viewedAt: 'Entregue via WhatsApp',
      authenticityHash: 'SHA-256-CFN856-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      signedBy: 'Dra. Camila Silveira',
      crn: 'CRN-3 / 48.912'
    };

    if (onRecordPdfSent) {
      onRecordPdfSent(newRecord);
    } else {
      setInternalHistory(prev => [newRecord, ...prev]);
    }
  };

  const handleRecordSent = (record: MealPlanPdfExport) => {
    if (onRecordPdfSent) {
      onRecordPdfSent(record);
    } else {
      setInternalHistory(prev => [record, ...prev]);
    }
  };

  return (
    <div id="finalizacao-view" className="p-6 md:p-8 space-y-6 max-w-6xl mx-auto animate-fade-in">
      {/* 1. Header de Status & Disparo */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
            <Check className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Plano Pronto para Transmissão Zero-App</h2>
              <span className="bg-white text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                100% Homologado CFN
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              A paciente receberá a dieta estruturada em PDF, lembretes inteligentes e o Motor Conversacional de IA ativado no WhatsApp.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {patientContext && (
            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="px-4 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-2xs transition cursor-pointer"
              title="Visualizar e Baixar PDF Diagramado com Regras CFN nº 856"
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Gerar & Visualizar PDF</span>
            </button>
          )}

          {patientContext && (
            <button
              onClick={() => setIsAIModalOpen(true)}
              className="px-4 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 bg-slate-900 hover:bg-black text-white shadow-xs transition"
            >
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>Testar Motor de IA</span>
            </button>
          )}

          <button
            id="btn-dispatch-whatsapp"
            onClick={handleDispatch}
            className={`px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-xs transition ${
              dispatched
                ? 'bg-emerald-700 text-white cursor-default'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>{dispatched ? 'Plano Disparado com Sucesso!' : 'Finalizar Consulta e Disparar WhatsApp'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lado Esquerdo: Checklist de Conformidade CFN nº 856 (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Checklist de Conformidade & Metas Clínicas (CFN nº 856/2026)
              </h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Auditoria Aprovada
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Leucina Mínima Atingida (≥3.0g/ref)</span>
                </div>
                <p className="text-[11px] text-slate-600">Garante o estímulo da via mTORC1 na síntese proteica muscular pós-prandial.</p>
              </div>

              <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Restrição Respeitada: Batata-Doce</span>
                </div>
                <p className="text-[11px] text-slate-600">Nenhum alimento causador de náusea/aversão incluído no plano ou nas trocas.</p>
              </div>

              <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Suplementação de Ferro Quelato</span>
                </div>
                <p className="text-[11px] text-slate-600">Integrado devido à ferritina em 18 ng/mL (analito crítico do OCR).</p>
              </div>

              <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tabela de Equivalências Dinâmica</span>
                </div>
                <p className="text-[11px] text-slate-600">Motor de IA treinado com opções pré-calculadas por macronutriente.</p>
              </div>
            </div>

            {/* Assinatura Digital & Token 2FA */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
              <div>
                <span className="font-semibold text-slate-800">Assinatura Digital Validada: </span>
                <span>{compliance.professionalName} ({compliance.crnRegistry})</span>
              </div>
              <div className="font-mono text-[10px] bg-slate-100 px-2.5 py-1 rounded text-slate-700">
                Token: {compliance.twoFactorToken}
              </div>
            </div>
          </div>

          {/* Automações Ativas no WhatsApp */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                Automações Ativas do Paciente (Zero-App WhatsApp)
              </h3>
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Motor 24/7 Pronto
              </span>
            </div>
            
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-800 block">Boas-vindas e Envio Imediato do PDF Diagramado</span>
                    <span className="text-[11px] text-slate-500">Paciente recebe mensagem humanizada com o guia alimentar oficial.</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Ativo</span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <Camera className="w-4 h-4 text-blue-600 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-800 block">Micro Check-in Fotográfico de Prato (Visão Computacional)</span>
                    <span className="text-[11px] text-slate-500">Estimativa automática de volume de saladas, proteína e calorias consumidas.</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Ativo</span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <Bot className="w-4 h-4 text-purple-600 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-800 block">Tira-Dúvidas e Substituições de Alimentos pelo Prontuário</span>
                    <span className="text-[11px] text-slate-500">Respostas em 2 segundos mantendo rigorosamente macros e limiar de leucina.</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">Ativo</span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-amber-500 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-800 block">Lembretes Diários Inteligentes nos Horários das Refeições</span>
                    <span className="text-[11px] text-slate-500">Café (07:30), Almoço (12:30), Lanche (16:30), Jantar (20:00).</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Ativo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito: Visualizador Interativo de WhatsApp (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-sm bg-slate-900 rounded-[36px] p-3 shadow-xl border-4 border-slate-800">
            {/* Topbar do Telefone */}
            <div className="bg-[#075E54] text-white px-4 py-3 rounded-t-[26px] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                  DC
                </div>
                <div>
                  <div className="font-bold text-xs leading-tight">Clínica Nutrição & Dra. Camila</div>
                  <div className="text-[10px] text-emerald-200">Online • Assistente Oficial</div>
                </div>
              </div>

              {patientContext && (
                <button
                  onClick={() => setIsAIModalOpen(true)}
                  className="bg-white/20 hover:bg-white/30 text-white p-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition"
                  title="Abrir Simulador Completo com IA"
                >
                  <Sparkles className="w-3 h-3 text-emerald-300" />
                  <span>Testar</span>
                </button>
              )}
            </div>

            {/* Corpo das Mensagens do WhatsApp */}
            <div className="bg-[#ECE5DD] p-3 space-y-3 min-h-[420px] max-h-[440px] overflow-y-auto text-[11px]">
              <div className="text-center">
                <span className="bg-white/80 text-slate-500 text-[9px] px-2 py-0.5 rounded-full shadow-2xs">
                  Hoje, 12:45
                </span>
              </div>

                {/* Mensagem 1: Envio do PDF */}
                <div className="bg-white rounded-2xl rounded-tl-xs p-3 shadow-xs max-w-[90%] space-y-2">
                  <p className="font-semibold text-slate-800">Olá, Manuela! Tudo bem? 😊</p>
                  <p className="text-slate-600">
                    Seu plano alimentar focado em <strong>Hipertrofia</strong> já está ativo! Sem necessidade de baixar nenhum app, você pode falar diretamente comigo por aqui.
                  </p>
                  <div 
                    onClick={() => setIsPdfModalOpen(true)}
                    className="bg-slate-50 border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 rounded-xl p-2.5 flex items-center justify-between gap-2.5 cursor-pointer transition group shadow-2xs"
                    title="Clique para abrir e baixar o PDF oficial"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <div className="font-bold text-slate-800 truncate text-[11px] group-hover:text-emerald-800">
                          Plano_Manuela_2026.pdf
                        </div>
                        <div className="text-[9px] text-slate-400">2.4 MB • Prescrição Oficial CFN</div>
                      </div>
                    </div>

                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 group-hover:bg-emerald-200 px-2 py-1 rounded-md shrink-0 flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>Abrir</span>
                    </span>
                  </div>
                </div>

                {/* Mensagem 2: Paciente pede substituição */}
                <div className="bg-[#DCF8C6] rounded-2xl rounded-tr-xs p-3 shadow-xs max-w-[90%] ml-auto text-slate-800 space-y-1">
                  <p>Oi Dra.! Acabei de ver que no almoço tem filé de frango, mas esqueci de comprar no mercado. Posso trocar por ovo ou carne moída hoje?</p>
                  <span className="text-[9px] text-slate-400 block text-right">12:47</span>
                </div>

                {/* Mensagem 3: Bot HiGHS responde em 2 segundos */}
                <div className="bg-white rounded-2xl rounded-tl-xs p-3 shadow-xs max-w-[95%] space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[10px]">
                    <span>COPILOTO CLÍNICO HiGHS</span>
                  </div>
                  <p className="text-slate-700">
                    Pode sim, Manuela! Para manter suas <strong>40g de proteína e leucina ideais (3.2g)</strong> do almoço:
                  </p>
                  <div className="space-y-1 bg-slate-50 p-2 rounded-xl border border-slate-200 text-slate-800">
                    <div>🥩 <strong>Opção 1:</strong> 140g de Patinho Moído</div>
                    <div>🍳 <strong>Opção 2:</strong> 3 ovos inteiros + 2 claras mexidas</div>
                  </div>
                  <p className="text-[10px] text-slate-500">Mantenha a mesma quantidade de arroz e feijão! Bom almoço! 💪</p>
                  <span className="text-[9px] text-slate-400 block text-right">12:47</span>
                </div>
              </div>

              {/* Barra de input do celular com acionador do Modal */}
              <div 
                onClick={() => patientContext && setIsAIModalOpen(true)}
                className="bg-[#F0F0F0] p-2 rounded-b-[26px] flex items-center gap-2 cursor-pointer hover:bg-slate-200/80 transition"
              >
                <input 
                  type="text" 
                  readOnly 
                  value="Clique para abrir o Chat de IA ao vivo..." 
                  className="bg-white rounded-full px-3 py-1.5 text-[11px] text-slate-500 w-full outline-none cursor-pointer"
                />
                <button className="w-8 h-8 rounded-full bg-[#075E54] text-white flex items-center justify-center shrink-0">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Histórico de Envios & Versões do PDF (Abaixo dos cards principais) */}
        <div className="pt-2">
          <SendHistoryCard 
            historyRecords={currentHistory}
            onOpenPdfModal={() => setIsPdfModalOpen(true)}
            onResendWhatsApp={() => handleDispatch()}
          />
        </div>

        {/* Modal do Motor Conversacional de IA (Pós-Consulta) */}
        {patientContext && (
          <AIConversationalEngineModal
            isOpen={isAIModalOpen}
            onClose={() => setIsAIModalOpen(false)}
            context={patientContext}
            onDispatchWhatsAppPlan={handleDispatch}
          />
        )}

        {/* Modal de Visualização & Impressão do PDF */}
        {patientContext && (
          <MealPlanPdfModal
            isOpen={isPdfModalOpen}
            onClose={() => setIsPdfModalOpen(false)}
            context={patientContext}
            onRecordPdfSent={handleRecordSent}
          />
        )}
      </div>
    );
  };
