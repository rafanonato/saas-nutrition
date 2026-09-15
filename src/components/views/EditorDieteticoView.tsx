import React, { useState } from 'react';
import { Clock, Plus, Trash2, CheckCircle2, CornerDownRight, PlusCircle, Sparkles, Repeat } from 'lucide-react';
import { Meal, SubstitutionRule } from '../../types';

interface EditorDieteticoViewProps {
  meals: Meal[];
  substitutionRules: SubstitutionRule[];
  onUpdateMealWeight?: (mealId: string, foodId: string, newWeight: number) => void;
}

export const EditorDieteticoView: React.FC<EditorDieteticoViewProps> = ({
  meals,
  substitutionRules
}) => {
  const activeMeal = meals.find(m => m.id === 'meal-2') || meals[0];

  // Calculate meal total macros
  const mealKcal = activeMeal.items.reduce((s, i) => s + i.kcal, 0);
  const mealPtn = activeMeal.items.reduce((s, i) => s + i.ptn, 0);
  const mealCho = activeMeal.items.reduce((s, i) => s + i.cho, 0);
  const mealLip = activeMeal.items.reduce((s, i) => s + i.lip, 0);
  const mealLeucine = activeMeal.items.reduce((s, i) => s + i.leucineGrams, 0);

  const ptnKcal = mealPtn * 4;
  const choKcal = mealCho * 4;
  const lipKcal = mealLip * 9;
  const totalMacrosKcal = Math.max(ptnKcal + choKcal + lipKcal, 1);

  const ptnPercent = Math.round((ptnKcal / totalMacrosKcal) * 100);
  const choPercent = Math.round((choKcal / totalMacrosKcal) * 100);
  const lipPercent = Math.round((lipKcal / totalMacrosKcal) * 100);

  return (
    <div id="editor-dietetico-view" className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      {/* 1. Biblioteca de Templates Inteligentes */}
      <div>
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
          Biblioteca & Templates Inteligentes
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button className="flex items-center gap-1.5 whitespace-nowrap bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-2xs transition">
            <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Almoço Hipertrófico (40g PTN)</span>
          </button>
          <button className="flex items-center gap-1.5 whitespace-nowrap bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-2xs transition">
            <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Omelete c/ Aveia (Pré-Treino)</span>
          </button>
          <button className="flex items-center gap-1.5 whitespace-nowrap bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-2xs transition">
            <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Shake Whey + Fruta</span>
          </button>
          <button className="whitespace-nowrap bg-slate-100 hover:bg-slate-200 text-slate-600 px-3.5 py-1.5 rounded-full text-xs font-medium transition">
            Ver todos os templates...
          </button>
        </div>
      </div>

      {/* 2. Card Principal da Refeição 2 (Almoço) */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        {/* Cabeçalho */}
        <div className="bg-gradient-to-r from-blue-50/80 via-slate-50 to-white px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                R2
              </span>
              <h3 className="font-bold text-slate-900 text-base">{activeMeal.name}</h3>
              <span className="text-xs bg-white border border-slate-200 px-2.5 py-0.5 rounded-full text-slate-600 font-medium flex items-center gap-1 shadow-2xs">
                <Clock className="w-3 h-3 text-slate-400" />
                {activeMeal.time}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Meta da refeição: 40g Proteína • 75g Carboidrato • Leucina ≥ 3,0g (mTORC1)
            </p>
          </div>

          <button className="text-blue-600 hover:text-blue-700 text-xs font-semibold self-start sm:self-auto">
            Renomear Refeição
          </button>
        </div>

        {/* Tabela de Alimentos */}
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-slate-400 font-semibold border-b border-slate-200 uppercase text-[10px]">
                <tr>
                  <th className="py-2.5">Alimento Base TACO/TBCA</th>
                  <th className="py-2.5">Medida Caseira</th>
                  <th className="py-2.5 text-right">Peso (g)</th>
                  <th className="py-2.5 text-right">PTN (g)</th>
                  <th className="py-2.5 text-right">CHO (g)</th>
                  <th className="py-2.5 text-right">LIP (g)</th>
                  <th className="py-2.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {activeMeal.items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 font-semibold text-slate-800">
                      {item.name}
                      <span className="ml-1.5 text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                        {item.sourceTable}
                      </span>
                    </td>
                    <td className="py-3 text-slate-600">{item.householdMeasure}</td>
                    <td className="py-3 text-right">
                      <span className="font-bold text-slate-900 bg-slate-100/80 px-2 py-1 rounded">
                        {item.weightGrams}
                      </span>
                    </td>
                    <td className="py-3 text-right font-bold text-emerald-600">{item.ptn.toFixed(1)}</td>
                    <td className="py-3 text-right font-bold text-blue-600">{item.cho.toFixed(1)}</td>
                    <td className="py-3 text-right font-bold text-amber-600">{item.lip.toFixed(1)}</td>
                    <td className="py-3 text-right">
                      <button className="text-slate-300 hover:text-rose-500 p-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button className="mt-3 text-blue-600 hover:text-blue-700 font-semibold text-xs flex items-center gap-1.5 transition">
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Alimento Manualmente</span>
          </button>
        </div>

        {/* Distribuição Energética & Leucina */}
        <div className="bg-slate-50/80 px-6 py-4 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2.5 gap-2">
            <div className="text-xs text-slate-700">
              Total da Refeição: <span className="font-bold text-slate-900 text-sm">{mealKcal} kcal</span>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-full font-bold flex items-center gap-1.5 shadow-2xs self-start sm:self-auto">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Leucina: {mealLeucine.toFixed(1)}g (Gatilho Anabólico Ativo)
            </span>
          </div>

          {/* Barra Empilhada */}
          <div className="w-full h-2.5 rounded-full flex overflow-hidden mb-2 shadow-inner">
            <div className="bg-emerald-500 h-full" style={{ width: `${ptnPercent}%` }} title="Proteína" />
            <div className="bg-blue-500 h-full" style={{ width: `${choPercent}%` }} title="Carboidrato" />
            <div className="bg-amber-500 h-full" style={{ width: `${lipPercent}%` }} title="Lipídio" />
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Proteína: <strong className="text-slate-900">{mealPtn.toFixed(1)}g ({ptnPercent}%)</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Carboidrato: <strong className="text-slate-900">{mealCho.toFixed(1)}g ({choPercent}%)</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Gordura: <strong className="text-slate-900">{mealLip.toFixed(1)}g ({lipPercent}%)</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Matriz de Equivalências (WhatsApp Bot) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Repeat className="w-4 h-4 text-blue-600" />
              Matriz de Equivalências (WhatsApp Bot)
            </h3>
            <p className="text-xs text-slate-500">
              O assistente usará estas regras se a paciente pedir substituição rápida no WhatsApp durante o almoço.
            </p>
          </div>
          <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
            Solver HiGHS Ativo
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {substitutionRules.map((rule) => (
            <div key={rule.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/70 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800 border-b border-slate-200 pb-2">
                <span>Se faltar: <strong className="text-blue-700">{rule.originalFood} ({rule.originalGrams}g)</strong></span>
                <span className="text-slate-400">Meta: {rule.originalPtn}g PTN</span>
              </div>

              <div className="space-y-2 text-xs">
                {rule.alternatives.map((alt) => (
                  <div key={alt.id} className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-3 py-2">
                    <div className="flex items-center gap-2">
                      <CornerDownRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-900">{alt.weightGrams}g</span>
                        <span className="text-slate-600"> de {alt.foodName}</span>
                        <span className="text-[10px] text-slate-400 block">{alt.householdMeasure}</span>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-600">{alt.ptn}g PTN</span>
                  </div>
                ))}
              </div>

              <button className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
                <Plus className="w-3 h-3" />
                <span>Adicionar Alternativa</span>
              </button>
            </div>
          ))}

          {/* Card para criar nova regra */}
          <div className="border border-dashed border-slate-300 rounded-2xl p-4 flex flex-col items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-400 hover:bg-slate-50 cursor-pointer transition">
            <PlusCircle className="w-6 h-6 mb-1.5" />
            <span className="text-xs font-semibold">Criar Nova Regra de Substituição</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Ex: Substitutos para Arroz ou Feijão</span>
          </div>
        </div>
      </div>
    </div>
  );
};
