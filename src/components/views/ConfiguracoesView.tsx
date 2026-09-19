import React, { useState } from 'react';
import { Database, Settings2, MessageCircle, Save, Check } from 'lucide-react';
import { ClinicConfig } from '../../types';

interface ConfiguracoesViewProps {
  config: ClinicConfig;
  onSaveConfig?: (newConfig: ClinicConfig) => void;
}

export const ConfiguracoesView: React.FC<ConfiguracoesViewProps> = ({ config }) => {
  const [currentConfig, setCurrentConfig] = useState<ClinicConfig>(config);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div id="configuracoes-view" className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto">
      {/* 1. Header com Salvar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Configurações Clínicas & Solver HiGHS</h2>
          <p className="text-xs text-slate-500">Parâmetros do motor matemático, bases alimentares e bot WhatsApp</p>
        </div>

        <button 
          onClick={handleSave}
          className="bg-slate-900 hover:bg-black text-white font-semibold px-5 py-2 rounded-full text-xs shadow-xs flex items-center gap-2 transition"
        >
          {saved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
          <span>{saved ? 'Preferências Salvas!' : 'Salvar Preferências'}</span>
        </button>
      </div>

      {/* 2. Bancos de Alimentos */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-600" />
            Bancos de Alimentos Ativos (Solver HiGHS)
          </h3>
          <span className="text-[11px] text-slate-400">Mais de 4.800 alimentos calibrados</span>
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
                className="w-4 h-4 accent-blue-600 rounded"
              />
              <div>
                <span className="font-bold text-slate-900 block">TACO (Tabela Brasileira de Composição de Alimentos - UNICAMP)</span>
                <span className="text-[11px] text-slate-500">Padrão-ouro nacional para micronutrientes e medidas caseiras brasileiras.</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
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
                className="w-4 h-4 accent-blue-600 rounded"
              />
              <div>
                <span className="font-bold text-slate-900 block">TBCA (Tabela Brasileira de Composição de Alimentos - USP)</span>
                <span className="text-[11px] text-slate-500">Ampla variedade de alimentos cozidos, processados e fracionamento de carboidratos.</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
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
                className="w-4 h-4 accent-blue-600 rounded"
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
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 outline-none focus:border-blue-400"
            >
              <option value="estrita">Estrita (Variação max. 2% em Kcal e Macros)</option>
              <option value="moderada">Moderada (Variação max. 5% em Kcal e Macros - Recomendado)</option>
              <option value="flexivel">Flexível (Variação max. 10% - Foco em Adesão)</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-600 mb-1.5 block">Arredondamento de Medidas Caseiras</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 outline-none focus:border-blue-400">
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

      {/* 4. Comportamento e Persona no WhatsApp */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-emerald-600" />
          Comportamento e Persona no WhatsApp (Zero-App)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-600 mb-1.5 block">Tom de Voz do Assistente Virtual</label>
            <select 
              value={currentConfig.whatsappPersona}
              onChange={(e) => setCurrentConfig(prev => ({ ...prev, whatsappPersona: e.target.value as any }))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 outline-none focus:border-blue-400"
            >
              <option value="assistente_1p">Assistente em 1ª Pessoa ("Sou a assistente da Dra. Maithe")</option>
              <option value="institucional">Institucional Neutro ("Clínica informa:")</option>
              <option value="imitar_nutri">Espelho da Linguagem da Nutricionista</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-600 mb-1.5 block">Janela de Resposta Automática</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 outline-none focus:border-blue-400">
              <option>24 horas por dia (Instantâneo)</option>
              <option>Apenas horário comercial (08h às 20h)</option>
            </select>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <label className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer">
            <div>
              <span className="font-bold text-slate-900 text-xs block">Micro-Checkins com Visão Computacional de Pratos</span>
              <span className="text-[11px] text-slate-500 block">O bot analisará fotos de prato enviadas pelo paciente para estimar adesão de vegetais e fibras.</span>
            </div>
            <input 
              type="checkbox" 
              checked={currentConfig.photoCheckins}
              onChange={(e) => setCurrentConfig(prev => ({ ...prev, photoCheckins: e.target.checked }))}
              className="w-5 h-5 accent-blue-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer">
            <div>
              <span className="font-bold text-slate-900 text-xs block">Encaminhar ao WhatsApp do Nutricionista em caso de Alerta</span>
              <span className="text-[11px] text-slate-500 block">Se o paciente relatar dor grave, recaída grave ou sintomas atípicos, a IA notifica imediatamente a Dra.</span>
            </div>
            <input 
              type="checkbox" 
              checked={currentConfig.autoForwardAlerts}
              onChange={(e) => setCurrentConfig(prev => ({ ...prev, autoForwardAlerts: e.target.checked }))}
              className="w-5 h-5 accent-blue-600 rounded"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
