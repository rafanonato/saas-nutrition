import React from 'react';
import { ShieldCheck, Zap, Info } from 'lucide-react';
import { Meal } from '../types';

interface MetabolicHUDProps {
  meals: Meal[];
  targetKcal?: number;
  targetPtn?: number;
  targetCho?: number;
  targetLip?: number;
  isLeucineThresholdMet?: boolean;
}

export const MetabolicHUD: React.FC<MetabolicHUDProps> = ({
  meals,
  targetKcal = 2100,
  targetPtn = 140,
  targetCho = 250,
  targetLip = 60,
  isLeucineThresholdMet = true
}) => {
  // Aggregate totals across all meals
  const totals = meals.reduce(
    (acc, meal) => {
      const mealPtn = meal.items.reduce((sum, item) => sum + item.ptn, 0);
      const mealCho = meal.items.reduce((sum, item) => sum + item.cho, 0);
      const mealLip = meal.items.reduce((sum, item) => sum + item.lip, 0);
      const mealKcal = meal.items.reduce((sum, item) => sum + item.kcal, 0);
      const mealLeucine = meal.items.reduce((sum, item) => sum + item.leucineGrams, 0);

      return {
        ptn: acc.ptn + mealPtn,
        cho: acc.cho + mealCho,
        lip: acc.lip + mealLip,
        kcal: acc.kcal + mealKcal,
        maxLeucineInSingleMeal: Math.max(acc.maxLeucineInSingleMeal, mealLeucine)
      };
    },
    { ptn: 0, cho: 0, lip: 0, kcal: 0, maxLeucineInSingleMeal: 0 }
  );

  const roundedKcal = Math.round(totals.kcal);
  const roundedPtn = Math.round(totals.ptn);
  const roundedCho = Math.round(totals.cho);
  const roundedLip = Math.round(totals.lip);

  const kcalPercent = Math.min(Math.round((roundedKcal / targetKcal) * 100), 100);
  const ptnPercent = Math.min(Math.round((roundedPtn / targetPtn) * 100), 100);
  const choPercent = Math.min(Math.round((roundedCho / targetCho) * 100), 100);
  const lipPercent = Math.min(Math.round((roundedLip / targetLip) * 100), 100);

  const leucineSaturated = totals.maxLeucineInSingleMeal >= 2.8 || isLeucineThresholdMet;

  return (
    <div 
      id="metabolic-hud-container" 
      className="bg-slate-50 border-b border-slate-200 px-6 py-3 shrink-0 select-none shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Calorias Totais */}
        <div id="hud-calories-card" className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs">
          <div className="flex justify-between items-center text-xs font-medium text-slate-500 mb-1">
            <span>Calorias (Alvo vs. Atual)</span>
            <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
              {kcalPercent}%
            </span>
          </div>
          <div className="flex items-baseline justify-between mb-1.5">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-slate-900 tracking-tight">{roundedKcal.toLocaleString('pt-BR')}</span>
              <span className="text-xs text-slate-500">kcal</span>
            </div>
            <span className="text-xs font-medium text-slate-400">Meta: {targetKcal.toLocaleString('pt-BR')} kcal</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-slate-800 h-full rounded-full transition-all duration-300"
              style={{ width: `${kcalPercent}%` }}
            />
          </div>
        </div>

        {/* 2. Proteínas & Leucina */}
        <div id="hud-protein-card" className="bg-white border border-emerald-200 rounded-2xl p-3 shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-emerald-800 flex items-center gap-1">
              <span>Proteínas (2.2 g/kg)</span>
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
              <span className="text-[11px] text-emerald-600/70 font-medium">({totals.maxLeucineInSingleMeal.toFixed(1)}g max ref)</span>
            </div>
            <span className="text-xs font-medium text-slate-400">Meta: {targetPtn}g</span>
          </div>
          <div className="w-full bg-emerald-50 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${ptnPercent}%` }}
            />
          </div>
        </div>

        {/* 3. Carboidratos */}
        <div id="hud-carbs-card" className="bg-white border border-blue-200 rounded-2xl p-3 shadow-xs">
          <div className="flex justify-between items-center text-xs font-medium text-blue-900 mb-1">
            <span>Carboidratos (4.0 g/kg)</span>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
              {choPercent}%
            </span>
          </div>
          <div className="flex items-baseline justify-between mb-1.5">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-blue-600 tracking-tight">{roundedCho}g</span>
              <span className="text-[11px] text-blue-500 font-medium">Peri-treino 55%</span>
            </div>
            <span className="text-xs font-medium text-slate-400">Meta: {targetCho}g</span>
          </div>
          <div className="w-full bg-blue-50 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${choPercent}%` }}
            />
          </div>
        </div>

        {/* 4. Lipídios */}
        <div id="hud-lipids-card" className="bg-white border border-amber-200 rounded-2xl p-3 shadow-xs">
          <div className="flex justify-between items-center text-xs font-medium text-amber-900 mb-1">
            <span>Lipídios (0.9 g/kg)</span>
            <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">
              {lipPercent}%
            </span>
          </div>
          <div className="flex items-baseline justify-between mb-1.5">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-amber-600 tracking-tight">{roundedLip}g</span>
              <span className="text-[11px] text-amber-700/70 font-medium">Perfil Ác. Graxos</span>
            </div>
            <span className="text-xs font-medium text-slate-400">Meta: {targetLip}g</span>
          </div>
          <div className="w-full bg-amber-50 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-amber-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${lipPercent}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
};
