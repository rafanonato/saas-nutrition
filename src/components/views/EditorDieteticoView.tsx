import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  CornerDownRight, 
  PlusCircle, 
  Sparkles, 
  Repeat, 
  Flame, 
  Dna, 
  Layers, 
  Calendar, 
  Sliders, 
  ShieldCheck, 
  AlertTriangle, 
  Edit3, 
  Check, 
  ChevronRight,
  Info
} from 'lucide-react';
import { Meal, SubstitutionRule, FoodItem, PatientSummary, PatientContextPayload } from '../../types';
import { DIETARY_TEMPLATES, DietaryTemplate, BLANK_TEMPLATE } from '../../data/dietaryTemplates';
import { FoodSelectorModal } from '../diet/FoodSelectorModal';
import { TemplateLibraryModal } from '../diet/TemplateLibraryModal';
import { BlankTemplateModal } from '../diet/BlankTemplateModal';
import { HighsSolverOptimizer } from '../diet/HighsSolverOptimizer';
import { EquivalenceRuleModal } from '../diet/EquivalenceRuleModal';
import { AIConversationalEngineModal } from '../diet/AIConversationalEngineModal';
import { Bot } from 'lucide-react';
import { calculateMealsNutritionalTotals } from '../../utils/metabolicCalculator';

interface EditorDieteticoViewProps {
  meals: Meal[];
  substitutionRules: SubstitutionRule[];
  patient?: PatientSummary;
  aversions?: string[];
  onUpdateMeals?: (newMeals: Meal[]) => void;
  onUpdateSubstitutionRules?: (newRules: SubstitutionRule[]) => void;
  onNotifyScribe?: (message: string) => void;
  patientContext?: PatientContextPayload;
}

export const EditorDieteticoView: React.FC<EditorDieteticoViewProps> = ({
  meals: initialMeals,
  substitutionRules: initialRules,
  patient,
  aversions = ['Lactose (Leve desconforto)', 'Batata-Doce (Enjoo severo)'],
  onUpdateMeals,
  onUpdateSubstitutionRules,
  onNotifyScribe,
  patientContext
}) => {
  const [meals, setMeals] = useState<Meal[]>(initialMeals);
  const [substitutionRules, setSubstitutionRules] = useState<SubstitutionRule[]>(initialRules);
  const [activeMealId, setActiveMealId] = useState<string>(meals[1]?.id || meals[0]?.id || 'meal-1');

  // Sincroniza estado com as props quando atualizadas externamente
  useEffect(() => {
    setMeals(initialMeals);
  }, [initialMeals]);

  useEffect(() => {
    setSubstitutionRules(initialRules);
  }, [initialRules]);

  // Modais
  const [isFoodSelectorOpen, setIsFoodSelectorOpen] = useState(false);
  const [isTemplateLibraryOpen, setIsTemplateLibraryOpen] = useState(false);
  const [isBlankTemplateOpen, setIsBlankTemplateOpen] = useState(false);
  const [isEquivalenceModalOpen, setIsEquivalenceModalOpen] = useState(false);
  const [isAIEngineOpen, setIsAIEngineOpen] = useState(false);
  const [customTemplates, setCustomTemplates] = useState<DietaryTemplate[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  const activeMeal = meals.find(m => m.id === activeMealId) || meals[0];

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
    if (onNotifyScribe) {
      onNotifyScribe(msg);
    }
  };

  // Atualização de gramatura de um alimento na refeição
  const handleUpdateItemWeight = (foodId: string, newWeight: number) => {
    const safeWeight = Math.max(1, newWeight);
    const updatedMeals = meals.map(m => {
      if (m.id !== activeMealId) return m;
      const updatedItems = m.items.map(item => {
        if (item.id !== foodId) return item;
        const ratio = safeWeight / Math.max(item.weightGrams, 1);
        return {
          ...item,
          weightGrams: safeWeight,
          householdMeasure: `${safeWeight}g`,
          ptn: Number((item.ptn * ratio).toFixed(1)),
          cho: Number((item.cho * ratio).toFixed(1)),
          lip: Number((item.lip * ratio).toFixed(1)),
          kcal: Math.round(item.kcal * ratio),
          leucineGrams: Number((item.leucineGrams * ratio).toFixed(2))
        };
      });

      const totalLeucine = updatedItems.reduce((s, i) => s + i.leucineGrams, 0);
      return {
        ...m,
        items: updatedItems,
        currentLeucine: Number(totalLeucine.toFixed(2)),
        leucineThresholdMet: totalLeucine >= 2.5
      };
    });

    setMeals(updatedMeals);
    if (onUpdateMeals) onUpdateMeals(updatedMeals);
  };

  // Remover alimento da refeição
  const handleRemoveItem = (foodId: string) => {
    const updatedMeals = meals.map(m => {
      if (m.id !== activeMealId) return m;
      const updatedItems = m.items.filter(i => i.id !== foodId);
      const totalLeucine = updatedItems.reduce((s, i) => s + i.leucineGrams, 0);
      return {
        ...m,
        items: updatedItems,
        currentLeucine: Number(totalLeucine.toFixed(2)),
        leucineThresholdMet: totalLeucine >= 2.5
      };
    });

    setMeals(updatedMeals);
    if (onUpdateMeals) onUpdateMeals(updatedMeals);
    notify('Alimento removido da refeição.');
  };

  // Adicionar alimento da tabela TACO/TBCA
  const handleAddFoodItem = (newFood: FoodItem) => {
    const updatedMeals = meals.map(m => {
      if (m.id !== activeMealId) return m;
      const updatedItems = [...m.items, newFood];
      const totalLeucine = updatedItems.reduce((s, i) => s + i.leucineGrams, 0);
      return {
        ...m,
        items: updatedItems,
        currentLeucine: Number(totalLeucine.toFixed(2)),
        leucineThresholdMet: totalLeucine >= 2.5
      };
    });

    setMeals(updatedMeals);
    if (onUpdateMeals) onUpdateMeals(updatedMeals);
    notify(`"${newFood.name}" adicionado à ${activeMeal.name}.`);
  };

  // Aplicar Template na refeição ativa
  const handleApplyTemplateToCurrent = (template: DietaryTemplate) => {
    const updatedMeals = meals.map(m => {
      if (m.id !== activeMealId) return m;
      const totalLeucine = template.items.reduce((s, i) => s + i.leucineGrams, 0);
      return {
        ...m,
        name: `${m.name.split(':')[0]}: ${template.title}`,
        targetKcal: template.targetKcal,
        targetPtn: template.targetPtn,
        targetCho: template.targetCho,
        targetLip: template.targetLip,
        items: template.items,
        currentLeucine: Number(totalLeucine.toFixed(2)),
        leucineThresholdMet: totalLeucine >= 2.5
      };
    });

    setMeals(updatedMeals);
    if (onUpdateMeals) onUpdateMeals(updatedMeals);
    notify(`Template "${template.title}" aplicado com sucesso na refeição.`);
  };

  // Adicionar como Nova Refeição no plano
  const handleAddNewMealFromTemplate = (template: DietaryTemplate) => {
    const newMealIndex = meals.length + 1;
    const totalLeucine = template.items.reduce((s, i) => s + i.leucineGrams, 0);
    const newMeal: Meal = {
      id: `meal-${Date.now()}`,
      name: `Refeição ${newMealIndex}: ${template.title}`,
      time: '18:00',
      targetKcal: template.targetKcal,
      targetPtn: template.targetPtn,
      targetCho: template.targetCho,
      targetLip: template.targetLip,
      currentLeucine: Number(totalLeucine.toFixed(2)),
      leucineThresholdMet: totalLeucine >= 2.5,
      items: template.items
    };

    const updated = [...meals, newMeal];
    setMeals(updated);
    setActiveMealId(newMeal.id);
    if (onUpdateMeals) onUpdateMeals(updated);
    notify(`Nova Refeição ${newMealIndex} criada a partir do template.`);
  };

  // Salvar template personalizado vindo do criador em branco
  const handleSaveCustomTemplate = (newTemplate: DietaryTemplate, applyImmediately: boolean) => {
    setCustomTemplates(prev => [newTemplate, ...prev]);
    if (applyImmediately) {
      handleApplyTemplateToCurrent(newTemplate);
    } else {
      notify(`Template "${newTemplate.title}" salvo na biblioteca de templates!`);
    }
  };

  // Aplicar resultado do Solver HiGHS
  const handleApplySolverOptimization = (optimizedItems: FoodItem[]) => {
    const updatedMeals = meals.map(m => {
      if (m.id !== activeMealId) return m;
      const totalLeucine = optimizedItems.reduce((s, i) => s + i.leucineGrams, 0);
      return {
        ...m,
        items: optimizedItems,
        currentLeucine: Number(totalLeucine.toFixed(2)),
        leucineThresholdMet: totalLeucine >= 2.5
      };
    });

    setMeals(updatedMeals);
    if (onUpdateMeals) onUpdateMeals(updatedMeals);
    notify('Gramaturas otimizadas com sucesso pelo Solver HiGHS!');
  };

  // Criar nova refeição vazia
  const handleCreateEmptyMeal = () => {
    const newIndex = meals.length + 1;
    const newMeal: Meal = {
      id: `meal-${Date.now()}`,
      name: `Refeição ${newIndex}: Personalizada`,
      time: '15:00',
      targetKcal: 400,
      targetPtn: 30,
      targetCho: 45,
      targetLip: 12,
      currentLeucine: 0,
      leucineThresholdMet: false,
      items: []
    };

    const updated = [...meals, newMeal];
    setMeals(updated);
    setActiveMealId(newMeal.id);
    if (onUpdateMeals) onUpdateMeals(updated);
    notify(`Nova Refeição ${newIndex} adicionada ao plano.`);
  };

  // Salvar nova regra de substituição
  const handleSaveSubstitutionRule = (newRule: SubstitutionRule) => {
    const updated = [...substitutionRules, newRule];
    setSubstitutionRules(updated);
    if (onUpdateSubstitutionRules) onUpdateSubstitutionRules(updated);
    notify(`Regra de substituição para "${newRule.originalFood}" registrada para o WhatsApp Bot.`);
  };

  // Cálculos do dia todo via utilitário centralizado
  const targetKcal = patient?.targetKcal || 2100;
  const dayTotals = calculateMealsNutritionalTotals(meals, targetKcal);
  const dayKcal = dayTotals.totalKcal;
  const dayPtn = dayTotals.totalPtn;
  const dayCho = dayTotals.totalCho;
  const dayLip = dayTotals.totalLip;
  const targetPtn = patient?.targetPtn || 140;
  const targetCho = patient?.targetCho || 250;
  const targetLip = patient?.targetLip || 60;
  const patientWeight = patient?.weight || 62.4;

  const currentPtnPerKg = Number((dayPtn / patientWeight).toFixed(2));
  const currentChoPerKg = Number((dayCho / patientWeight).toFixed(2));
  const currentLipPerKg = Number((dayLip / patientWeight).toFixed(2));

  // Cálculos da refeição ativa
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

  // Leucina anabólica: limiar de 2.5g a 3.0g para mTORC1
  const leucinePercent = Math.min(Math.round((mealLeucine / 3.0) * 100), 100);
  const isLeucineMet = mealLeucine >= 2.5;

  // Verificação de aversões na refeição atual
  const conflictItems = activeMeal.items.filter(item => {
    const lower = item.name.toLowerCase();
    return aversions.some(a => {
      const aLower = a.toLowerCase();
      if (aLower.includes('batata-doce') && lower.includes('batata-doce')) return true;
      if (aLower.includes('lactose') && (lower.includes('leite') || lower.includes('iogurte natural') || lower.includes('minas frescal') || lower.includes('queijo prato'))) return true;
      return false;
    });
  });

  return (
    <div id="editor-dietetico-view" className="p-4 sm:p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Top Banner de Notificação */}
      {notification && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-white/80 hover:text-white text-xs">
            ✕
          </button>
        </div>
      )}

      {/* 1. Barra de Acesso aos +30 Templates Inteligentes & Criador em Branco */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/30 text-blue-200 border border-blue-400/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Biblioteca de Templates Inteligentes (+35 Prontos)
              </span>
              <span className="text-xs text-slate-300 hidden md:inline">
                Modelos balanceados de TACO, TBCA e mTORC1
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white mt-1">
              Composição Rápida de Cardápios & Templates
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsBlankTemplateOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Criar Template em Branco</span>
            </button>

            <button
              type="button"
              onClick={() => setIsTemplateLibraryOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Layers className="w-4 h-4 text-blue-300" />
              <span>Abrir Biblioteca (+35)</span>
            </button>

            {patientContext && (
              <button
                type="button"
                onClick={() => setIsAIEngineOpen(true)}
                className="bg-purple-600 hover:bg-purple-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                title="Testar motor conversacional de IA com o cardápio e prontuário deste paciente"
              >
                <Bot className="w-4 h-4 text-emerald-300" />
                <span>Simular Motor IA</span>
              </button>
            )}
          </div>
        </div>

        {/* Templates Rápidos (Carrossel Horizontal de 1-Clique) */}
        <div className="flex gap-2 overflow-x-auto pb-1 pt-1">
          {DIETARY_TEMPLATES.slice(0, 7).map(tmpl => (
            <button
              key={tmpl.id}
              onClick={() => handleApplyTemplateToCurrent(tmpl)}
              className="flex items-center gap-1.5 whitespace-nowrap bg-white/10 hover:bg-white/20 border border-white/15 text-slate-100 hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0"
              title={tmpl.description}
            >
              <PlusCircle className="w-3 h-3 text-emerald-400" />
              <span>{tmpl.title.split(':')[0]}</span>
              <span className="text-[10px] bg-white/15 text-blue-200 px-1.5 py-0.2 rounded font-normal">
                {tmpl.targetKcal} kcal
              </span>
            </button>
          ))}
          <button
            onClick={() => setIsTemplateLibraryOpen(true)}
            className="whitespace-nowrap bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0"
          >
            Ver todos (+35)...
          </button>
        </div>
      </div>

      {/* 2. Resumo Macro do Dia Inteiro vs Metas do Paciente */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              Plano Alimentar Diário • {patient?.name || 'Manuela Rocchetto'}
            </h3>
            <p className="text-xs text-slate-500">
              Objetivo: <strong>{patient?.goal || 'Hipertrofia'}</strong> • TMB Cunningham: <strong>{patient?.bmr || 1551} kcal</strong> • GET: <strong>{patient?.get || 2180} kcal</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
              {meals.length} Refeições Prescritas
            </span>
            <button
              type="button"
              onClick={handleCreateEmptyMeal}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-xl transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nova Refeição</span>
            </button>
          </div>
        </div>

        {/* 4 Cards de Resumo Clínico do Plano */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 uppercase font-bold">VET Consumido</span>
              <span className={`text-[10px] font-bold ${Math.abs(dayKcal - targetKcal) <= 75 ? 'text-emerald-700' : 'text-amber-700'}`}>
                {dayKcal >= targetKcal ? `+${dayKcal - targetKcal}` : `${dayKcal - targetKcal}`} kcal
              </span>
            </div>
            <div className="text-lg font-extrabold text-slate-900 mt-0.5">
              {dayKcal} <span className="text-xs font-normal text-slate-400">/ {targetKcal} kcal</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-slate-800 h-full rounded-full transition-all" style={{ width: `${Math.min((dayKcal / targetKcal) * 100, 100)}%` }} />
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              {Math.round((dayKcal / targetKcal) * 100)}% da meta prescrita
            </span>
          </div>

          <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-emerald-800 uppercase font-bold">Proteínas (PTN)</span>
              <span className="text-[10px] font-bold text-emerald-800 font-mono bg-emerald-100/80 px-1 rounded">
                {currentPtnPerKg} g/kg
              </span>
            </div>
            <div className="text-lg font-extrabold text-emerald-950 mt-0.5">
              {dayPtn.toFixed(0)}g <span className="text-xs font-normal text-emerald-700">/ {targetPtn}g</span>
            </div>
            <div className="w-full bg-emerald-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full transition-all" style={{ width: `${Math.min((dayPtn / targetPtn) * 100, 100)}%` }} />
            </div>
            <span className="text-[10px] text-emerald-700 mt-1 block">
              {Math.round(((dayPtn * 4) / Math.max(dayKcal, 1)) * 100)}% VET • Meta: {patient?.ptnPerKg || 2.24} g/kg
            </span>
          </div>

          <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-blue-800 uppercase font-bold">Carboidratos (CHO)</span>
              <span className="text-[10px] font-bold text-blue-800 font-mono bg-blue-100/80 px-1 rounded">
                {currentChoPerKg} g/kg
              </span>
            </div>
            <div className="text-lg font-extrabold text-blue-950 mt-0.5">
              {dayCho.toFixed(0)}g <span className="text-xs font-normal text-blue-700">/ {targetCho}g</span>
            </div>
            <div className="w-full bg-blue-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${Math.min((dayCho / targetCho) * 100, 100)}%` }} />
            </div>
            <span className="text-[10px] text-blue-700 mt-1 block">
              {Math.round(((dayCho * 4) / Math.max(dayKcal, 1)) * 100)}% VET • Meta: {patient?.choPerKg || 4.0} g/kg
            </span>
          </div>

          <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-amber-800 uppercase font-bold">Lipídios (LIP)</span>
              <span className="text-[10px] font-bold text-amber-800 font-mono bg-amber-100/80 px-1 rounded">
                {currentLipPerKg} g/kg
              </span>
            </div>
            <div className="text-lg font-extrabold text-amber-950 mt-0.5">
              {dayLip.toFixed(0)}g <span className="text-xs font-normal text-amber-700">/ {targetLip}g</span>
            </div>
            <div className="w-full bg-amber-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-amber-600 h-full rounded-full transition-all" style={{ width: `${Math.min((dayLip / targetLip) * 100, 100)}%` }} />
            </div>
            <span className="text-[10px] text-amber-700 mt-1 block">
              {Math.round(((dayLip * 9) / Math.max(dayKcal, 1)) * 100)}% VET • Meta: {patient?.lipPerKg || 0.96} g/kg
            </span>
          </div>
        </div>

        {/* Abas das Refeições R1..Rn */}
        <div className="flex gap-2 overflow-x-auto pb-1 border-t border-slate-100 pt-3">
          {meals.map((meal, idx) => {
            const isSelected = meal.id === activeMealId;
            const mKcal = meal.items.reduce((s, i) => s + i.kcal, 0);

            return (
              <button
                key={meal.id}
                onClick={() => setActiveMealId(meal.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${isSelected ? 'bg-white text-blue-600' : 'bg-slate-300 text-slate-800'}`}>
                  R{idx + 1}
                </span>
                <span>{meal.name.split(':')[0]}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${isSelected ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {mKcal} kcal
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Card Principal da Refeição Ativa */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs space-y-0">
        {/* Cabeçalho da Refeição */}
        <div className="bg-gradient-to-r from-blue-50/90 via-slate-50 to-white px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
                R{meals.findIndex(m => m.id === activeMealId) + 1}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{activeMeal.name}</h3>
              <span className="text-xs bg-white border border-slate-200 px-2.5 py-0.5 rounded-full text-slate-600 font-medium flex items-center gap-1 shadow-2xs">
                <Clock className="w-3 h-3 text-slate-400" />
                {activeMeal.time}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Meta Alvo: <strong>{activeMeal.targetPtn}g Proteína</strong> • <strong>{activeMeal.targetCho}g Carbo</strong> • <strong>{activeMeal.targetLip}g Lipídios</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsTemplateLibraryOpen(true)}
              className="text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Trocar por Template (+35)</span>
            </button>
          </div>
        </div>

        {/* Alerta de Aversão Conflitante */}
        {conflictItems.length > 0 && (
          <div className="bg-rose-50 border-b border-rose-200 px-6 py-2.5 text-xs text-rose-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                <strong>Atenção:</strong> O alimento <strong>{conflictItems.map(c => c.name).join(', ')}</strong> foi marcado como aversão na anamnese da paciente.
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase bg-rose-200 text-rose-900 px-2 py-0.5 rounded">
              Aversão Detectada
            </span>
          </div>
        )}

        {/* Tabela de Alimentos da Refeição */}
        <div className="p-6 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-slate-400 font-semibold border-b border-slate-200 uppercase text-[10px]">
                <tr>
                  <th className="py-2.5">Alimento Base TACO/TBCA/USDA</th>
                  <th className="py-2.5">Medida Caseira</th>
                  <th className="py-2.5 text-center">Peso (g)</th>
                  <th className="py-2.5 text-right">PTN (g)</th>
                  <th className="py-2.5 text-right">CHO (g)</th>
                  <th className="py-2.5 text-right">LIP (g)</th>
                  <th className="py-2.5 text-right">Kcal</th>
                  <th className="py-2.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {activeMeal.items.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                      Esta refeição está vazia. Clique em "+ Adicionar Alimento" ou escolha um template na biblioteca.
                    </td>
                  </tr>
                ) : (
                  activeMeal.items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 font-semibold text-slate-800">
                        {item.name}
                        <span className="ml-1.5 text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                          {item.sourceTable}
                        </span>
                      </td>
                      <td className="py-3 text-slate-600">{item.householdMeasure}</td>
                      <td className="py-3 text-center">
                        <input
                          type="number"
                          min="1"
                          step="5"
                          value={item.weightGrams}
                          onChange={(e) => handleUpdateItemWeight(item.id, parseFloat(e.target.value) || 0)}
                          className="w-16 text-center font-bold text-slate-900 bg-slate-100/80 border border-slate-300 rounded px-1.5 py-1 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="py-3 text-right font-bold text-emerald-600">{item.ptn.toFixed(1)}</td>
                      <td className="py-3 text-right font-bold text-blue-600">{item.cho.toFixed(1)}</td>
                      <td className="py-3 text-right font-bold text-amber-600">{item.lip.toFixed(1)}</td>
                      <td className="py-3 text-right font-bold text-slate-900">{item.kcal}</td>
                      <td className="py-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-slate-300 hover:text-rose-500 p-1 cursor-pointer transition"
                          title="Remover alimento"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setIsFoodSelectorOpen(true)}
              className="text-blue-600 hover:text-blue-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Alimento da Tabela TACO/TBCA</span>
            </button>

            <span className="text-[11px] text-slate-400">
              *Pesos editáveis em tempo real com recálculo determinístico
            </span>
          </div>
        </div>

        {/* Distribuição Energética & Leucina mTORC1 */}
        <div className="bg-slate-50/90 px-6 py-4 border-t border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="text-xs text-slate-700">
              Total da Refeição: <span className="font-extrabold text-slate-900 text-sm">{mealKcal} kcal</span>{' '}
              <span className="text-slate-400">(Meta: {activeMeal.targetKcal} kcal)</span>
            </div>

            {/* Badge de Leucina mTORC1 */}
            <div className="flex items-center gap-2">
              <span className={`text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5 shadow-2xs ${
                isLeucineMet 
                  ? 'bg-purple-100 text-purple-900 border border-purple-300' 
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}>
                <Dna className="w-3.5 h-3.5 text-purple-600" />
                <span>Leucina: {mealLeucine.toFixed(1)}g</span>
                <span className="text-[10px] font-normal">
                  {isLeucineMet ? '(Gatilho mTORC1 Ativo ≥ 2.5g)' : '(Subótimo para Hipertrofia < 2.5g)'}
                </span>
              </span>
            </div>
          </div>

          {/* Barra Empilhada de Macronutrientes */}
          <div className="w-full h-2.5 rounded-full flex overflow-hidden shadow-inner">
            <div className="bg-emerald-500 h-full" style={{ width: `${ptnPercent}%` }} title={`Proteína: ${ptnPercent}%`} />
            <div className="bg-blue-500 h-full" style={{ width: `${choPercent}%` }} title={`Carboidrato: ${choPercent}%`} />
            <div className="bg-amber-500 h-full" style={{ width: `${lipPercent}%` }} title={`Lipídio: ${lipPercent}%`} />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex flex-wrap items-center gap-5">
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

            <div className="text-[11px] text-slate-400">
              Densidade Proteica: <strong>{((mealPtn * 4 / Math.max(mealKcal, 1)) * 100).toFixed(0)}% das kcal</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Otimizador Linear HiGHS Integrado */}
      <HighsSolverOptimizer
        meal={activeMeal}
        aversions={aversions}
        onApplyOptimization={handleApplySolverOptimization}
      />

      {/* 5. Matriz de Equivalências & Substituições do WhatsApp Bot */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Repeat className="w-4 h-4 text-blue-600" />
              Matriz de Equivalências Dinâmicas (WhatsApp Bot • RF-03)
            </h3>
            <p className="text-xs text-slate-500">
              O paciente pode solicitar substituições por áudio ou texto no WhatsApp mantendo rigorosamente as calorias e proteínas calculadas.
            </p>
          </div>
          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full self-start sm:self-auto">
            Regras Zero-App Ativas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {substitutionRules.map((rule) => (
            <div key={rule.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/70 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800 border-b border-slate-200 pb-2">
                <span>Se faltar: <strong className="text-blue-700">{rule.originalFood} ({rule.originalGrams}g)</strong></span>
                <span className="text-slate-500">Meta: {rule.originalPtn}g PTN</span>
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
                    <div className="text-right">
                      <span className="font-bold text-emerald-600 block">{alt.ptn}g PTN</span>
                      <span className="text-[10px] text-slate-400">{alt.kcal} kcal</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setIsEquivalenceModalOpen(true)}
                className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Adicionar Alternativa à Regra</span>
              </button>
            </div>
          ))}

          {/* Card para criar nova regra */}
          <div 
            onClick={() => setIsEquivalenceModalOpen(true)}
            className="border border-dashed border-slate-300 rounded-2xl p-4 flex flex-col items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-400 hover:bg-slate-50 cursor-pointer transition min-h-[140px]"
          >
            <PlusCircle className="w-6 h-6 mb-1.5" />
            <span className="text-xs font-semibold">Criar Nova Regra de Equivalência</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Ex: Substitutos para Ovos, Aveia ou Feijão</span>
          </div>
        </div>
      </div>

      {/* MODAIS */}
      {/* Modal de Seleção de Alimento TACO/TBCA */}
      <FoodSelectorModal
        isOpen={isFoodSelectorOpen}
        onClose={() => setIsFoodSelectorOpen(false)}
        onSelectFood={handleAddFoodItem}
        aversions={aversions}
      />

      {/* Modal de Biblioteca de +30 Templates */}
      <TemplateLibraryModal
        isOpen={isTemplateLibraryOpen}
        onClose={() => setIsTemplateLibraryOpen(false)}
        activeMealName={activeMeal.name}
        onApplyTemplateToCurrentMeal={handleApplyTemplateToCurrent}
        onAddNewMealFromTemplate={handleAddNewMealFromTemplate}
        onOpenBlankTemplateCreator={() => {
          setIsTemplateLibraryOpen(false);
          setIsBlankTemplateOpen(true);
        }}
      />

      {/* Modal de Template em Branco (Criar do Zero) */}
      <BlankTemplateModal
        isOpen={isBlankTemplateOpen}
        onClose={() => setIsBlankTemplateOpen(false)}
        onSaveTemplate={handleSaveCustomTemplate}
        aversions={aversions}
      />

      {/* Modal de Regras de Equivalência */}
      <EquivalenceRuleModal
        isOpen={isEquivalenceModalOpen}
        onClose={() => setIsEquivalenceModalOpen(false)}
        onSaveRule={handleSaveSubstitutionRule}
      />

      {/* Modal do Motor Conversacional de IA (Pós-Consulta) */}
      {patientContext && (
        <AIConversationalEngineModal
          isOpen={isAIEngineOpen}
          onClose={() => setIsAIEngineOpen(false)}
          context={patientContext}
        />
      )}
    </div>
  );
};
