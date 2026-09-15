import React, { useState } from 'react';
import { ShieldCheck, Check, Send, FileText, Smartphone, Camera, Bell, MessageSquare } from 'lucide-react';
import { ComplianceChecklist } from '../../types';

interface FinalizacaoViewProps {
  compliance: ComplianceChecklist;
  onDispatchWhatsApp: () => void;
}

export const FinalizacaoView: React.FC<FinalizacaoViewProps> = ({
  compliance,
  onDispatchWhatsApp
}) => {
  const [dispatched, setDispatched] = useState(false);

  const handleDispatch = () => {
    setDispatched(true);
    onDispatchWhatsApp();
  };

  return (
    <div id="finalizacao-view" className="p-6 md:p-8 space-y-6 max-w-6xl mx-auto">
      {/* 1. Header de Status */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
            <Check className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Plano Pronto para Transmissão Zero-App</h2>
              <span className="bg-white text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                100% Validado
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              A paciente receberá a dieta estruturada, lembretes de hidratação e suporte interativo 24/7 via WhatsApp.
            </p>
          </div>
        </div>

        <button
          id="btn-dispatch-whatsapp"
          onClick={handleDispatch}
          className={`px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm transition ${
            dispatched
              ? 'bg-emerald-700 text-white cursor-default'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>{dispatched ? 'Plano Enviado com Sucesso!' : 'Disparar Plano no WhatsApp'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lado Esquerdo: Checklist de Conformidade CFN nº 856 (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Checklist de Conformidade & Metas Clínicas (CFN nº 856/2026)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Leucina Mínima Atingida (≥3.0g/ref)</span>
                </div>
                <p className="text-[11px] text-slate-600">Garante o gatilho da síntese proteica muscular pós-prandial.</p>
              </div>

              <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Restrição Respeitada: Batata-Doce</span>
                </div>
                <p className="text-[11px] text-slate-600">Nenhum alimento causador de náusea incluído nas opções.</p>
              </div>

              <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Suplementação de Ferro Quelato</span>
                </div>
                <p className="text-[11px] text-slate-600">Integrado devido à ferritina baixa (18 ng/mL) do OCR.</p>
              </div>

              <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tabela de Equivalências Dinâmica</span>
                </div>
                <p className="text-[11px] text-slate-600">Bot programado com opções imediatas por macronutriente.</p>
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
            <h3 className="text-sm font-bold text-slate-900">Automações Ativas do Paciente (Zero-App)</h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="font-semibold text-slate-800 block">Boas-vindas e Envio Imediato do PDF Diagramado</span>
                    <span className="text-[11px] text-slate-500">Paciente recebe mensagem humanizada com link do guia e resumo.</span>
                  </div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Camera className="w-4 h-4 text-blue-600" />
                  <div>
                    <span className="font-semibold text-slate-800 block">Micro Check-in Fotográfico de Prato (Visão Computacional)</span>
                    <span className="text-[11px] text-slate-500">Reconhecimento visual de vegetais, saladas e estimativa de adesão.</span>
                  </div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-amber-500" />
                  <div>
                    <span className="font-semibold text-slate-800 block">Lembretes Diários Inteligentes nos Horários das Refeições</span>
                    <span className="text-[11px] text-slate-500">Notificações 15 minutos antes: Café (07:30), Almoço (12:30), Lanche (16:30), Jantar (20:00).</span>
                  </div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito: Simulador de Smartphone do WhatsApp (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-slate-900 rounded-[36px] p-3 shadow-xl border-4 border-slate-800 max-w-sm mx-auto">
            {/* Topbar do Telefone */}
            <div className="bg-[#075E54] text-white px-4 py-3 rounded-t-[26px] flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                DC
              </div>
              <div className="flex-1">
                <div className="font-bold text-xs leading-tight">Clínica Nutrição & Dra. Camila</div>
                <div className="text-[10px] text-emerald-200">Online • Assistente Oficial</div>
              </div>
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
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="font-bold text-slate-800 truncate">Plano_Manuela_2026.pdf</div>
                    <div className="text-[9px] text-slate-400">2.4 MB • Prescrição Oficial</div>
                  </div>
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
                  Pode sim, Manuela! Para manter suas <strong>40g de proteína e leucina ideais</strong> do almoço:
                </p>
                <div className="space-y-1 bg-slate-50 p-2 rounded-xl border border-slate-200 text-slate-800">
                  <div>🥩 <strong>Opção 1:</strong> 140g de Patinho Moído</div>
                  <div>🍳 <strong>Opção 2:</strong> 3 ovos inteiros + 2 claras mexidas</div>
                </div>
                <p className="text-[10px] text-slate-500">Mantenha a mesma quantidade de arroz e feijão! Bom almoço! 💪</p>
                <span className="text-[9px] text-slate-400 block text-right">12:47</span>
              </div>
            </div>

            {/* Barra de input do celular */}
            <div className="bg-[#F0F0F0] p-2 rounded-b-[26px] flex items-center gap-2">
              <input 
                type="text" 
                readOnly 
                value="Testar mensagem no WhatsApp Real..." 
                className="bg-white rounded-full px-3 py-1.5 text-[11px] text-slate-500 w-full outline-none"
              />
              <button className="w-8 h-8 rounded-full bg-[#075E54] text-white flex items-center justify-center shrink-0">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
