import React, { useState } from 'react';
import { X, Plus, Trash2, Repeat, CheckCircle2 } from 'lucide-react';
import { SubstitutionRule, SubstitutionOption } from '../../types';
import { FOOD_DATABASE } from '../../data/foodDatabase';

interface EquivalenceRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRule: (rule: SubstitutionRule) => void;
}

export const EquivalenceRuleModal: React.FC<EquivalenceRuleModalProps> = ({
  isOpen,
  onClose,
  onSaveRule
}) => {
  const [originalFood, setOriginalFood] = useState('Peito de Frango Grelhado');
  const [originalGrams, setOriginalGrams] = useState<number>(150);
  const [originalPtn, setOriginalPtn] = useState<number>(46.5);
  const [alternatives, setAlternatives] = useState<SubstitutionOption[]>([
    {
      id: 'alt-new-1',
      foodName: 'Patinho Moído Grelhado',
      weightGrams: 140,
      householdMeasure: '4 colheres de sopa cheias',
      ptn: 45.8,
      cho: 0.0,
      lip: 7.8,
      kcal: 254
    },
    {
      id: 'alt-new-2',
      foodName: 'Filé de Tilápia Grelhado',
      weightGrams: 170,
      householdMeasure: '1 filé grande',
      ptn: 44.2,
      cho: 0.0,
      lip: 2.8,
      kcal: 202
    }
  ]);

  const [newFoodName, setNewFoodName] = useState('');
  const [newWeightGrams, setNewWeightGrams] = useState<number>(150);
  const [newMeasure, setNewMeasure] = useState('');

  if (!isOpen) return null;

  const handleAddAlternative = () => {
    if (!newFoodName.trim()) return;
    const foodEntry = FOOD_DATABASE.find(f => f.name.toLowerCase() === newFoodName.toLowerCase());
    const factor = newWeightGrams / 100;

    const opt: SubstitutionOption = {
      id: `alt-${Date.now()}`,
      foodName: newFoodName.trim(),
      weightGrams: newWeightGrams,
      householdMeasure: newMeasure.trim() || `${newWeightGrams}g`,
      ptn: foodEntry ? Number((foodEntry.ptn100g * factor).toFixed(1)) : Number((newWeightGrams * 0.25).toFixed(1)),
      cho: foodEntry ? Number((foodEntry.cho100g * factor).toFixed(1)) : 0,
      lip: foodEntry ? Number((foodEntry.lip100g * factor).toFixed(1)) : 2.5,
      kcal: foodEntry ? Math.round(foodEntry.kcal100g * factor) : Math.round(newWeightGrams * 1.5)
    };

    setAlternatives(prev => [...prev, opt]);
    setNewFoodName('');
    setNewMeasure('');
  };

  const handleRemoveAlternative = (id: string) => {
    setAlternatives(prev => prev.filter(a => a.id !== id));
  };

  const handleSave = () => {
    const rule: SubstitutionRule = {
      id: `rule-${Date.now()}`,
      originalFood,
      originalGrams,
      originalPtn,
      alternatives
    };
    onSaveRule(rule);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-3 md:p-6 animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Repeat className="w-4 h-4 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              Nova Regra de Equivalência (WhatsApp Bot)
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Alimento Original */}
          <div className="space-y-3 bg-blue-50/60 p-4 rounded-2xl border border-blue-200">
            <h4 className="font-bold text-blue-950 uppercase text-[10px] tracking-wider">
              Alimento Original da Dieta
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="sm:col-span-2">
                <label className="block text-slate-600 font-medium mb-1">Nome do Alimento:</label>
                <input
                  type="text"
                  value={originalFood}
                  onChange={(e) => setOriginalFood(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Gramas:</label>
                <input
                  type="number"
                  value={originalGrams}
                  onChange={(e) => setOriginalGrams(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 text-center"
                />
              </div>
            </div>
          </div>

          {/* Lista de Alternativas Cadastradas */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">
              Substitutos Equivalentes Permitidos ({alternatives.length})
            </h4>
            <div className="space-y-2">
              {alternatives.map(alt => (
                <div key={alt.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">{alt.weightGrams}g</span>
                    <span className="text-slate-700"> de {alt.foodName}</span>
                    <span className="text-[10px] text-slate-400 block">{alt.householdMeasure}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-emerald-600">{alt.ptn}g PTN</span>
                    <span className="text-slate-500 font-semibold">{alt.kcal} kcal</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAlternative(alt.id)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Adicionar Nova Alternativa */}
            <div className="border border-dashed border-slate-300 p-3 rounded-xl space-y-2 bg-slate-50/50">
              <span className="font-bold text-slate-700 text-[11px] block">
                + Adicionar Outra Alternativa:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Nome do alimento substituto"
                  value={newFoodName}
                  onChange={(e) => setNewFoodName(e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                />
                <input
                  type="number"
                  placeholder="Peso em gramas (g)"
                  value={newWeightGrams}
                  onChange={(e) => setNewWeightGrams(parseFloat(e.target.value) || 0)}
                  className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                />
                <input
                  type="text"
                  placeholder="Medida caseira (ex: 2 fatias)"
                  value={newMeasure}
                  onChange={(e) => setNewMeasure(e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <button
                type="button"
                onClick={handleAddAlternative}
                className="text-blue-600 hover:text-blue-700 font-bold text-xs flex items-center gap-1 mt-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Incluir na Lista de Substitutos</span>
              </button>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Salvar Regra para o Bot</span>
          </button>
        </div>
      </div>
    </div>
  );
};
