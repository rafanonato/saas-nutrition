import React, { useState } from 'react';
import { X, Plus, Trash2, Save, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { DietaryTemplate, TemplateGoal, TemplateMealType } from '../../data/dietaryTemplates';
import { FoodItem } from '../../types';
import { FoodSelectorModal } from './FoodSelectorModal';

interface BlankTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTemplate: (newTemplate: DietaryTemplate, applyImmediately: boolean) => void;
  aversions?: string[];
}

export const BlankTemplateModal: React.FC<BlankTemplateModalProps> = ({
  isOpen,
  onClose,
  onSaveTemplate,
  aversions = []
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState<TemplateGoal>('Hipertrofia');
  const [mealType, setMealType] = useState<TemplateMealType>('almoco');
  const [items, setItems] = useState<FoodItem[]>([]);
  const [isFoodSelectorOpen, setIsFoodSelectorOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Totais calculados dinamicamente
  const totalKcal = items.reduce((s, i) => s + i.kcal, 0);
  const totalPtn = Number(items.reduce((s, i) => s + i.ptn, 0).toFixed(1));
  const totalCho = Number(items.reduce((s, i) => s + i.cho, 0).toFixed(1));
  const totalLip = Number(items.reduce((s, i) => s + i.lip, 0).toFixed(1));
  const totalLeucine = Number(items.reduce((s, i) => s + i.leucineGrams, 0).toFixed(2));

  const handleAddFood = (foodItem: FoodItem) => {
    setItems(prev => [...prev, foodItem]);
  };

  const handleRemoveFood = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleUpdateWeight = (id: string, newWeight: number) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const ratio = newWeight / Math.max(item.weightGrams, 1);
      return {
        ...item,
        weightGrams: newWeight,
        householdMeasure: `${newWeight}g`,
        ptn: Number((item.ptn * ratio).toFixed(1)),
        cho: Number((item.cho * ratio).toFixed(1)),
        lip: Number((item.lip * ratio).toFixed(1)),
        kcal: Math.round(item.kcal * ratio),
        leucineGrams: Number((item.leucineGrams * ratio).toFixed(2))
      };
    }));
  };

  const handleSave = (applyImmediately: boolean) => {
    if (!title.trim()) {
      setValidationError('Por favor, informe um título descritivo para o template.');
      return;
    }
    if (items.length === 0) {
      setValidationError('Adicione pelo menos 1 alimento da tabela TACO/TBCA ao template.');
      return;
    }

    const newTemplate: DietaryTemplate = {
      id: `tmpl-custom-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || `Template personalizado de ${mealType} focado em ${goal}.`,
      goal,
      mealType,
      tags: [goal, mealType, 'Personalizado'],
      targetKcal: totalKcal,
      targetPtn: totalPtn,
      targetCho: totalCho,
      targetLip: totalLip,
      targetLeucine: totalLeucine,
      items
    };

    onSaveTemplate(newTemplate, applyImmediately);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-3 md:p-6 animate-in fade-in">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                Criador de Templates em Branco
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                Novo Template Alimentar Personalizado
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Formulário Principal */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {validationError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Título da Refeição / Template:
                </label>
                <input
                  type="text"
                  placeholder="Ex: Almoço Low Carb com Peixe e Brócolis"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Objetivo Clínico:
                  </label>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value as TemplateGoal)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
                  >
                    <option value="Hipertrofia">Hipertrofia</option>
                    <option value="Emagrecimento">Emagrecimento</option>
                    <option value="Performance">Performance</option>
                    <option value="Low-Carb">Low-Carb</option>
                    <option value="Vegetariano">Vegetariano</option>
                    <option value="Sem Lactose">Sem Lactose</option>
                    <option value="Prático/Marmita">Prático/Marmita</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Tipo de Refeição:
                  </label>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value as TemplateMealType)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
                  >
                    <option value="desjejum">Desjejum</option>
                    <option value="almoco">Almoço</option>
                    <option value="pre_treino">Pré-Treino</option>
                    <option value="pos_treino">Pós-Treino</option>
                    <option value="jantar">Jantar</option>
                    <option value="ceia">Ceia</option>
                    <option value="qualquer">Qualquer</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Descrição ou Instruções de Preparo (Opcional):
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Modo de preparo, tempo de cozimento, dicas para marmitas..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none"
              />
            </div>

            {/* Painel de Macros em Tempo Real */}
            <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Calórico</span>
                <span className="text-xl font-extrabold text-white">{totalKcal} kcal</span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-400 block uppercase font-bold">Proteína</span>
                <span className="text-base font-bold text-emerald-300">{totalPtn}g</span>
              </div>
              <div>
                <span className="text-[10px] text-blue-400 block uppercase font-bold">Carboidrato</span>
                <span className="text-base font-bold text-blue-300">{totalCho}g</span>
              </div>
              <div>
                <span className="text-[10px] text-amber-400 block uppercase font-bold">Lipídios</span>
                <span className="text-base font-bold text-amber-300">{totalLip}g</span>
              </div>
              <div>
                <span className="text-[10px] text-purple-400 block uppercase font-bold">Leucina mTORC1</span>
                <span className="text-base font-bold text-purple-300">{totalLeucine}g</span>
              </div>
            </div>

            {/* Alimentos do Template */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Alimentos Selecionados ({items.length})
                </h4>
                <button
                  type="button"
                  onClick={() => setIsFoodSelectorOpen(true)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Alimento TACO/TBCA</span>
                </button>
              </div>

              {items.length === 0 ? (
                <div className="border border-dashed border-slate-300 rounded-2xl p-6 text-center text-slate-400 text-xs">
                  Nenhum alimento adicionado ainda. Clique no botão acima para pesquisar alimentos na tabela oficial e compor este template.
                </div>
              ) : (
                <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase text-slate-500 font-semibold">
                      <tr>
                        <th className="p-3">Alimento</th>
                        <th className="p-3 text-center">Peso (g)</th>
                        <th className="p-3 text-right">PTN</th>
                        <th className="p-3 text-right">CHO</th>
                        <th className="p-3 text-right">LIP</th>
                        <th className="p-3 text-right">Kcal</th>
                        <th className="p-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {items.map(item => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="p-3 font-semibold text-slate-800">
                            {item.name}
                            <span className="text-[9px] text-slate-400 block">{item.sourceTable}</span>
                          </td>
                          <td className="p-3 text-center">
                            <input
                              type="number"
                              min="1"
                              step="5"
                              value={item.weightGrams}
                              onChange={(e) => handleUpdateWeight(item.id, parseFloat(e.target.value) || 0)}
                              className="w-16 px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-center font-bold text-slate-900"
                            />
                          </td>
                          <td className="p-3 text-right font-bold text-emerald-600">{item.ptn}g</td>
                          <td className="p-3 text-right font-bold text-blue-600">{item.cho}g</td>
                          <td className="p-3 text-right font-bold text-amber-600">{item.lip}g</td>
                          <td className="p-3 text-right font-bold text-slate-900">{item.kcal}</td>
                          <td className="p-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveFood(item.id)}
                              className="text-slate-300 hover:text-rose-500 p-1 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Rodapé com botões de ação */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition"
            >
              Cancelar
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSave(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Salvar na Biblioteca</span>
              </button>

              <button
                type="button"
                onClick={() => handleSave(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Salvar & Aplicar no Plano</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Busca de Alimentos */}
      <FoodSelectorModal
        isOpen={isFoodSelectorOpen}
        onClose={() => setIsFoodSelectorOpen(false)}
        onSelectFood={handleAddFood}
        aversions={aversions}
      />
    </>
  );
};
