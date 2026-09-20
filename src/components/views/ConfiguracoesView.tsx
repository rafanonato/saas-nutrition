import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Settings2, 
  MessageCircle, 
  Save, 
  Check, 
  Send, 
  Copy, 
  ExternalLink, 
  ShieldCheck, 
  Smartphone, 
  Radio, 
  CheckCircle2, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';
import { ClinicConfig } from '../../types';
import { 
  getWhatsAppStatus, 
  sendWhatsAppTestMessage, 
  generateDirectWhatsAppUrl, 
  WhatsAppStatus 
} from '../../services/whatsappService';

interface ConfiguracoesViewProps {
  config: ClinicConfig;
  onSaveConfig?: (newConfig: ClinicConfig) => void;
}

export const ConfiguracoesView: React.FC<ConfiguracoesViewProps> = ({ config, onSaveConfig }) => {
  const [currentConfig, setCurrentConfig] = useState<ClinicConfig>(config);
  const [saved, setSaved] = useState(false);

  // Estados do WhatsApp
  const [waStatus, setWaStatus] = useState<WhatsAppStatus | null>(null);
  const [testPhone, setTestPhone] = useState<string>('11987654321');
  const [testMessage, setTestMessage] = useState<string>('🥗 TalkNutri Zero-App: Teste de canal WhatsApp ativo e homologado com conformidade CFN nº 856/2026.');
  const [isSendingTest, setIsSendingTest] = useState<boolean>(false);
  const [testFeedback, setTestFeedback] = useState<{ success: boolean; text: string; directUrl?: string } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    getWhatsAppStatus().then(status => setWaStatus(status));
  }, []);

  const handleSave = () => {
    if (onSaveConfig) {
      onSaveConfig(currentConfig);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSendTest = async () => {
    if (!testPhone) return;
    setIsSendingTest(true);
    setTestFeedback(null);

    try {
      const result = await sendWhatsAppTestMessage(testPhone, testMessage);
      setTestFeedback({
        success: result.success,
        text: result.success 
          ? `Mensagem transmitida para +${result.targetPhone} (${result.mode === 'meta_cloud' ? 'Meta Cloud API Oficial' : 'Canal Zero-App Operacional'})!`
          : `Erro ao enviar: ${result.message}`,
        directUrl: result.directWhatsAppUrl
      });
    } catch (err: any) {
      setTestFeedback({
        success: false,
        text: err.message || 'Falha na transmissão da mensagem'
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://sua-clinica.com.br';
  const webhookFullUrl = `${currentOrigin}/api/whatsapp/webhook`;
  const verifyToken = 'talknutri_secure_webhook_2026';

  return (
    <div id="configuracoes-view" className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto">
      {/* 1. Header com Salvar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Configurações Clínicas & WhatsApp Zero-App</h2>
          <p className="text-xs text-slate-500">Parâmetros do motor matemático, bases alimentares e canal conversacional oficial</p>
        </div>

        <button 
          onClick={handleSave}
          className="bg-slate-900 hover:bg-black text-white font-semibold px-5 py-2 rounded-full text-xs shadow-xs flex items-center gap-2 transition cursor-pointer"
        >
          {saved ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Preferências Salvas!</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5 text-slate-400" />
              <span>Salvar Preferências</span>
            </>
          )}
        </button>
      </div>

      {/* 2. Bancos de Alimentos */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-600" />
            Bancos de Alimentos Ativos (Solver HiGHS)
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">Mais de 4.800 alimentos calibrados</span>
        </div>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100/70 transition">
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={currentConfig.activeFoodBanks.taco} 
                onChange={(e) => setCurrentConfig(prev => ({
                  ...prev, 
                  activeFoodBanks: { ...prev.activeFoodBanks, taco: e.target.checked }
                }))}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
              <div>
                <span className="font-bold text-slate-900 block">TACO (Tabela Brasileira de Composição de Alimentos - UNICAMP)</span>
                <span className="text-[11px] text-slate-500">Padrão-ouro nacional para micronutrientes e medidas caseiras brasileiras.</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              Principal
            </span>
          </label>

          <label className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100/70 transition">
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={currentConfig.activeFoodBanks.tbca} 
                onChange={(e) => setCurrentConfig(prev => ({
                  ...prev, 
                  activeFoodBanks: { ...prev.activeFoodBanks, tbca: e.target.checked }
                }))}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
              <div>
                <span className="font-bold text-slate-900 block">TBCA (Tabela Brasileira de Composição de Alimentos - USP)</span>
                <span className="text-[11px] text-slate-500">Ampla variedade de alimentos cozidos, processados e fracionamento de carboidratos.</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded">
              Secundária
            </span>
          </label>

          <label className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition">
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={currentConfig.activeFoodBanks.usda} 
                onChange={(e) => setCurrentConfig(prev => ({
                  ...prev, 
                  activeFoodBanks: { ...prev.activeFoodBanks, usda: e.target.checked }
                }))}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
              <div>
                <span className="font-bold text-slate-900 block">USDA FoodData Central (Departamento de Agricultura dos EUA)</span>
                <span className="text-[11px] text-slate-500">Recomendado para pacientes com consumo frequente de suplementos importados.</span>
              </div>
            </div>
            <span className="text-[10px] text-slate-400">Opcional</span>
          </label>
        </div>
      </div>

      {/* 3. Calibração do Algoritmo HiGHS */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-emerald-600" />
          Calibração do Algoritmo de Otimização (Simplex HiGHS)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-600 mb-1.5 block">Tolerância para Substituições Nutricionais</label>
            <select 
              value={currentConfig.solverTolerance}
              onChange={(e) => setCurrentConfig(prev => ({ ...prev, solverTolerance: e.target.value as any }))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 outline-none focus:border-emerald-500"
            >
              <option value="estrita">Estrita (Variação max. 2% em Kcal e Macros)</option>
              <option value="moderada">Moderada (Variação max. 5% em Kcal e Macros - Recomendado)</option>
              <option value="flexivel">Flexível (Variação max. 10% - Foco em Adesão)</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-600 mb-1.5 block">Arredondamento de Medidas Caseiras</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 outline-none focus:border-emerald-500">
              <option>Sempre números inteiros (ex: 1 concha, 5 colheres)</option>
              <option>Permitir meia medida (ex: 1/2 colher, 1.5 filé)</option>
            </select>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <label className="flex items-center justify-between p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl cursor-pointer">
            <div>
              <span className="font-bold text-emerald-950 text-xs block">Gatilho de Síntese Proteica (Limiar de Leucina)</span>
              <span className="text-[11px] text-emerald-800 mt-0.5 block">
                Exigir no mínimo 3.0g de Leucina por refeição principal antes de validar a otimização matemática.
              </span>
            </div>
            <input 
              type="checkbox" 
              checked={currentConfig.enforceLeucineGate}
              onChange={(e) => setCurrentConfig(prev => ({ ...prev, enforceLeucineGate: e.target.checked }))}
              className="w-5 h-5 accent-emerald-600 rounded"
            />
          </label>
        </div>
      </div>

      {/* 4. Integração Meta WhatsApp Business Cloud API & Webhook (Zero-App) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Camada WhatsApp Zero-App (Comunicação Oficial Meta Cloud API)
              </h3>
              <p className="text-[11px] text-slate-500">
                Infraestrutura conversacional para paciente e nutricionista sem download de aplicativo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              waStatus?.configured 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>{waStatus?.configured ? 'Meta Cloud API Oficial Ativa' : 'Canal Zero-App Operacional (Simulação/Homologação)'}</span>
            </span>
          </div>
        </div>

        {/* Informações de Webhook para a Meta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700">URL do Webhook (Endpoint de Entrada)</span>
              <button 
                onClick={() => handleCopy(webhookFullUrl, 'webhook')}
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                {copiedField === 'webhook' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedField === 'webhook' ? 'Copiado!' : 'Copiar URL'}</span>
              </button>
            </div>
            <input 
              readOnly 
              value={webhookFullUrl}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-700 text-xs font-mono select-all"
            />
            <p className="text-[10px] text-slate-500">
              Cole esta URL no painel <em>Meta for Developers &gt; WhatsApp &gt; Configuration &gt; Callback URL</em>.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700">Token de Verificação (Verify Token)</span>
              <button 
                onClick={() => handleCopy(verifyToken, 'token')}
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                {copiedField === 'token' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedField === 'token' ? 'Copiado!' : 'Copiar Token'}</span>
              </button>
            </div>
            <input 
              readOnly 
              value={verifyToken}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-700 text-xs font-mono select-all"
            />
            <p className="text-[10px] text-slate-500">
              Insira este token no campo <em>Verify Token</em> da Meta para validação automática com o TalkNutri.
            </p>
          </div>
        </div>

        {/* Ferramenta de Teste de Disparo em Tempo Real */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-teal-50/50 border border-emerald-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-700" />
              <span className="font-bold text-emerald-950 text-xs">
                Testar Envio Imediato no seu WhatsApp (Homologação)
              </span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              CFN nº 856 Homologado
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
            <div className="sm:col-span-5">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Telefone de Destino (com DDD)
              </label>
              <input 
                type="text" 
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="Ex: 11987654321"
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-semibold outline-none focus:border-emerald-500"
              />
            </div>

            <div className="sm:col-span-7 flex items-end gap-2">
              <button
                onClick={handleSendTest}
                disabled={isSendingTest || !testPhone}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
              >
                {isSendingTest ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitindo...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Testar Disparo via API</span>
                  </>
                )}
              </button>

              <a
                href={generateDirectWhatsAppUrl(testPhone, testMessage)}
                target="_blank"
                rel="noreferrer noopener"
                className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition"
                title="Abrir diretamente no WhatsApp Web ou aplicativo"
              >
                <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                <span>Abrir wa.me</span>
              </a>
            </div>
          </div>

          {testFeedback && (
            <div className={`p-3 rounded-xl text-xs flex items-start gap-2.5 animate-fade-in ${
              testFeedback.success 
                ? 'bg-emerald-100/90 text-emerald-900 border border-emerald-300' 
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {testFeedback.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <span className="font-semibold block">{testFeedback.text}</span>
                {testFeedback.directUrl && (
                  <a 
                    href={testFeedback.directUrl} 
                    target="_blank" 
                    rel="noreferrer noopener"
                    className="underline text-[11px] font-bold mt-1 inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950"
                  >
                    <span>Clique aqui para ver ou responder a conversa no WhatsApp Web</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 5. Comportamento e Persona no WhatsApp */}
        <div className="border-t border-slate-200/80 pt-4 space-y-4">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Comportamento & Persona Clínica do Bot
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-600 mb-1.5 block">Tom de Voz do Assistente Virtual</label>
              <select 
                value={currentConfig.whatsappPersona}
                onChange={(e) => setCurrentConfig(prev => ({ ...prev, whatsappPersona: e.target.value as any }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 outline-none focus:border-emerald-500"
              >
                <option value="assistente_1p">Assistente em 1ª Pessoa ("Sou a assistente oficial da Dra. Maithe")</option>
                <option value="institucional">Institucional Neutro ("TalkNutri Informa:")</option>
                <option value="imitar_nutri">Espelho da Linguagem da Nutricionista</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-600 mb-1.5 block">Janela de Resposta Automática</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 outline-none focus:border-emerald-500">
                <option>24 horas por dia (Instantâneo)</option>
                <option>Apenas horário comercial (08h às 20h)</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <label className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 text-xs block">Micro-Checkins com Visão Computacional de Pratos</span>
                <span className="text-[11px] text-slate-500 block">O bot analisará fotos de prato enviadas pelo paciente para estimar adesão de vegetais e fibras.</span>
              </div>
              <input 
                type="checkbox" 
                checked={currentConfig.photoCheckins}
                onChange={(e) => setCurrentConfig(prev => ({ ...prev, photoCheckins: e.target.checked }))}
                className="w-5 h-5 accent-emerald-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 text-xs block">Encaminhar ao WhatsApp do Nutricionista em caso de Alerta</span>
                <span className="text-[11px] text-slate-500 block">Se o paciente relatar dor grave, recaída ou sintomas atípicos, a IA notifica imediatamente a Dra.</span>
              </div>
              <input 
                type="checkbox" 
                checked={currentConfig.autoForwardAlerts}
                onChange={(e) => setCurrentConfig(prev => ({ ...prev, autoForwardAlerts: e.target.checked }))}
                className="w-5 h-5 accent-emerald-600 rounded"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
