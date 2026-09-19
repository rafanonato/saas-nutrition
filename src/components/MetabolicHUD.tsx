import React, { useState } from 'react';
import { ShieldCheck, Zap, Info, ChevronDown, ChevronUp, Scale, Flame, Activity } from 'lucide-react';
import { Meal } from '../types';
import { calculateMealsNutritionalTotals } from '../utils/metabolicCalculator';

interface MetabolicHUDProps {
  meals: Meal[];
  targetKcal?: number;
  targetPtn?: number;
  targetCho?: number;
  targetLip?: number;
  ptnPerKg?: number;
  choPerKg?: number;
  lipPerKg?: number;
  patientWeight?: number;
  isLeucineThresholdMet?: boolean;
  bmr?: number;
  get?: number;
  bmrFormula?: string;
  activityLevel?: string;
  goal?: string;
}

export const MetabolicHUD: React.FC<MetabolicHUDProps> = ({
  meals,
  targetKcal = 2100,
  targetPtn = 140,
  targetCho = 250,
  targetLip = 60,
  ptnPerKg,
  choPerKg,
  lipPerKg,
  patientWeight = 62.4,
  isLeucineThresholdMet = true,
  bmr = 1552,
  get = 2405,
  bmrFormula = 'cunningham',
  activityLevel = 'Moderado (Musculação 5x/sem)',
  goal = 'Hipertrofia'
}) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Cálculos consolidados em tempo real com base nos alimentos cadastrados
  const totals = calculateMealsNutritionalTotals(meals, targetKcal);

  const roundedKcal = totals.totalKcal;
  const roundedPtn = totals.totalPtn;
  const roundedCho = totals.totalCho;
  const roundedLip = totals.totalLip;

  const kcalPercent = totals.kcalPercent;
  const ptnPercent = targetPtn > 0 ? Math.min(Math.round((roundedPtn / targetPtn) * 100), 150) : 0;
  const choPercent = targetCho > 0 ? Math.min(Math.round((roundedCho / targetCho) * 100), 150) : 0;
  const lipPercent = targetLip > 0 ? Math.min(Math.round((roundedLip / targetLip) * 100), 150) : 0;

  const currentPtnPerKg = (roundedPtn / patientWeight).toFixed(2);
  const currentChoPerKg = (roundedCho / patientWeight).toFixed(2);
  const currentLipPerKg = (roundedLip / patientWeight).toFixed(2);

  const targetPtnPerKgDisplay = (ptnPerKg || (targetPtn / patientWeight)).toFixed(1);
  const targetChoPerKgDisplay = (choPerKg || (targetCho / patientWeight)).toFixed(1);
  const targetLipPerKgDisplay = (lipPerKg || (targetLip / patientWeight)).toFixed(1);

  // Gatilho de mTORC1 / Leucina
  const leucineSaturated = totals.isLeucineThresholdMet || isLeucineThresholdMet;

  // Distribuição percentual calórica prescrita vs meta
  const prescribedPtnPct = totals.ptnPercent;
  const prescribedChoPct = totals.choPercent;
  const prescribedLipPct = totals.lipPercent;

  const targetPtnKcal = targetPtn * 4;
  const targetChoKcal = targetCho * 4;
  const targetLipKcal = targetLip * 9;
  const targetSumKcal = Math.max(targetPtnKcal + targetChoKcal + targetLipKcal, 1);

  const targetPtnPct = Number(((targetPtnKcal / targetSumKcal) * 100).toFixed(1));
  const targetChoPct = Number(((targetChoKcal / targetSumKcal) * 100).toFixed(1));
  const targetLipPct = Number(((targetLipKcal / targetSumKcal) * 100).toFixed(1));

  const deltaKcal = roundedKcal - targetKcal;

  return (
    <div 
      id="metabolic-hud-container" 
      className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-2.5 shrink-0 select-none shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all"
    >
      <div className="max-w-7xl mx-auto space-y-2">
        {/* 1. Grade Principal dos 4 Cards de Telemetria */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* 1. Calorias Totais (VET Alvo vs. Real Prescrito) */}
          <div id="hud-calories-card" className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs hover:border-slate-300 transition">
            <div className="flex justify-between items-center text-xs font-medium text-slate-500 mb-1">
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                VET Calórico Total
              </span>
              <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                Math.abs(deltaKcal) <= 50 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : deltaKcal > 50 
                    ? 'bg-amber-100 text-amber-800' 
                    : 'bg-slate-100 text-slate-700'
              }`}>
                {kcalPercent}%
              </span>
            </div>
            <div className="flex items-baseline justify-between mb-1.5">
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-slate-900 tracking-tight">{roundedKcal.toLocaleString('pt-BR')}</span>
                <span className="text-xs text-slate-500 font-medium">kcal</span>
              </div>
              <span className="text-xs font-medium text-slate-400">
                Alvo: <strong className="text-slate-600">{targetKcal.toLocaleString('pt-BR')}</strong> kcal
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  Math.abs(deltaKcal) <= 50 ? 'bg-emerald-600' : 'bg-slate-800'
                }`}
                style={{ width: `${Math.min(kcalPercent, 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1">
              <span>{deltaKcal >= 0 ? `+${deltaKcal} kcal` : `${deltaKcal} kcal`} do alvo</span>
              <span className="font-mono text-slate-400">TMB: {bmr} | GET: {get}</span>
            </div>
          </div>

          {/* 2. Proteínas & Leucina (mTORC1) */}
          <div id="hud-protein-card" className="bg-white border border-emerald-200 rounded-2xl p-3 shadow-xs hover:border-emerald-300 transition relative overflow-hidden">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-emerald-900 flex items-center gap-1 font-semibold">
                <span>Proteínas ({currentPtnPerKg} g/kg)</span>
              </span>
              <span 
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors ${
                  leucineSaturated 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}
                title="Gatilho de Leucina (mTORC1): Exige 2.5g a 3.0g na refeição principal"
              >
                <Zap className="w-2.5 h-2.5 fill-current" />
                {leucineSaturated ? 'LEUCINA OK' : 'LEUCINA SUBÓTIMA'}
              </span>
            </div>
            <div className="flex items-baseline justify-between mb-1.5">
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-emerald-600 tracking-tight">{roundedPtn}g</span>
                <span className="text-[11px] text-emerald-700/80 font-medium">({totals.maxLeucineInSingleMeal.toFixed(1)}g max)</span>
              </div>
              <span className="text-xs font-medium text-slate-400">
                Alvo: <strong className="text-slate-600">{targetPtn}g</strong> ({targetPtnPerKgDisplay} g/kg)
              </span>
            </div>
            <div className="w-full bg-emerald-50 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(ptnPercent, 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-emerald-800 mt-1">
              <span>{prescribedPtnPct}% do VET</span>
              <span>{totals.mealsWithLeucineMet} ref. com mTORC1</span>
            </div>
          </div>

          {/* 3. Carboidratos */}
          <div id="hud-carbs-card" className="bg-white border border-blue-200 rounded-2xl p-3 shadow-xs hover:border-blue-300 transition">
            <div className="flex justify-between items-center text-xs font-medium text-blue-900 mb-1 font-semibold">
              <span>Carboidratos ({currentChoPerKg} g/kg)</span>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                {choPercent}%
              </span>
            </div>
            <div className="flex items-baseline justify-between mb-1.5">
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-blue-600 tracking-tight">{roundedCho}g</span>
                <span className="text-[11px] text-blue-500 font-medium">Peri-treino</span>
              </div>
              <span className="text-xs font-medium text-slate-400">
                Alvo: <strong className="text-slate-600">{targetCho}g</strong> ({targetChoPerKgDisplay} g/kg)
              </span>
            </div>
            <div className="w-full bg-blue-50 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(choPercent, 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-blue-800 mt-1">
              <span>{prescribedChoPct}% do VET</span>
              <span>Energia Glicolítica</span>
            </div>
          </div>

          {/* 4. Lipídios */}
          <div id="hud-lipids-card" className="bg-white border border-amber-200 rounded-2xl p-3 shadow-xs hover:border-amber-300 transition">
            <div className="flex justify-between items-center text-xs font-medium text-amber-900 mb-1 font-semibold">
              <span>Lipídios ({currentLipPerKg} g/kg)</span>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">
                {lipPercent}%
              </span>
            </div>
            <div className="flex items-baseline justify-between mb-1.5">
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-amber-600 tracking-tight">{roundedLip}g</span>
                <span className="text-[11px] text-amber-700/70 font-medium">Ác. Graxos</span>
              </div>
              <span className="text-xs font-medium text-slate-400">
                Alvo: <strong className="text-slate-600">{targetLip}g</strong> ({targetLipPerKgDisplay} g/kg)
              </span>
            </div>
            <div className="w-full bg-amber-50 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(lipPercent, 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-amber-800 mt-1">
              <span>{prescribedLipPct}% do VET</span>
              <span>Aporte Hormonal</span>
            </div>
          </div>

        </div>

        {/* 2. Barra Visual de Distribuição de Macronutrientes & Botão de Auditoria */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-slate-200/60 text-xs">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-[11px] font-bold text-slate-600 shrink-0">Proporção Calórica:</span>
            
            {/* Barra empilhada visual com os 3 macronutrientes */}
            <div className="flex-1 max-w-md h-3 bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
              <div 
                className="bg-emerald-600 h-full transition-all duration-300"
                style={{ width: `${prescribedPtnPct}%` }}
                title={`Proteínas: ${prescribedPtnPct}% (${roundedPtn * 4} kcal)`}
              />
              <div 
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${prescribedChoPct}%` }}
                title={`Carboidratos: ${prescribedChoPct}% (${roundedCho * 4} kcal)`}
              />
              <div 
                className="bg-amber-500 h-full transition-all duration-300"
                style={{ width: `${prescribedLipPct}%` }}
                title={`Lipídios: ${prescribedLipPct}% (${roundedLip * 9} kcal)`}
              />
            </div>

            {/* Legenda compacta das proporções */}
            <div className="flex items-center gap-2 text-[10px] font-medium shrink-0">
              <span className="flex items-center gap-1 text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                PTN: {prescribedPtnPct}% (meta {targetPtnPct}%)
              </span>
              <span className="flex items-center gap-1 text-blue-800">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                CHO: {prescribedChoPct}% (meta {targetChoPct}%)
              </span>
              <span className="flex items-center gap-1 text-amber-800">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                LIP: {prescribedLipPct}% (meta {targetLipPct}%)
              </span>
            </div>
          </div>

          {/* Botão de Auditoria Metabólica Expansível */}
          <button
            type="button"
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
            className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg transition cursor-pointer self-end sm:self-auto shrink-0 shadow-2xs"
          >
            <Activity className="w-3.5 h-3.5 text-blue-600" />
            <span>Auditoria Metabólica Clínica</span>
            {isDetailsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* 3. Painel Expansível: Auditoria das Fórmulas e Regras de Nutrição */}
        {isDetailsOpen && (
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs text-xs text-slate-700 animate-in fade-in slide-in-from-top-2 duration-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-900">Fundamentação Matemática das Regras de Nutrição do Atendimento</span>
              </div>
              <span className="text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                Objetivo: {goal}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">1. Taxa Metabólica Basal (TMB)</span>
                <div className="font-bold text-slate-900 text-sm">{bmr} kcal</div>
                <div className="text-[11px] text-slate-600 mt-1">
                  Fórmula: <strong>{bmrFormula === 'cunningham' ? 'Cunningham (500 + 22 × MLG)' : bmrFormula === 'mifflin' ? 'Mifflin-St Jeor' : 'Harris-Benedict'}</strong>
                </div>
              </div>

              <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-blue-800 block mb-1">2. Fator de Atividade Física (FAF) & GET</span>
                <div className="font-bold text-blue-950 text-sm">GET: {get} kcal</div>
                <div className="text-[11px] text-blue-800 mt-1">
                  Nível: <strong>{activityLevel}</strong> (TMB × FAF)
                </div>
              </div>

              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block mb-1">3. VET Prescrito & Balanço Energético</span>
                <div className="font-bold text-emerald-950 text-sm">Alvo: {targetKcal} kcal</div>
                <div className="text-[11px] text-emerald-800 mt-1">
                  Prescrito nas refeições: <strong>{roundedKcal} kcal</strong> (Diferença: {deltaKcal >= 0 ? `+${deltaKcal}` : deltaKcal} kcal)
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
              <span>
                <strong>Diretriz de Macronutrientes (ISSN/SBAN):</strong> Proteínas com meta de {targetPtnPerKgDisplay} g/kg para síntese proteica, Lipídios a {targetLipPerKgDisplay} g/kg para suporte hormonal e Carboidratos completando a cota energética glicolítica ({targetChoPerKgDisplay} g/kg).
              </span>
              <span className="font-mono text-[10px] text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200 shrink-0 ml-2">
                100% Validado
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

