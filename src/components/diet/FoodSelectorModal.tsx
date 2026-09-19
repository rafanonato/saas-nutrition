import React, { useState, useMemo } from 'react';
import { Search, X, Plus, AlertTriangle, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { FOOD_DATABASE, FoodDatabaseEntry, calculateFoodMacros } from '../../data/foodDatabase';
import { FoodItem } from '../../types';

interface FoodSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFood: (foodItem: FoodItem) => void;
  aversions?: string[];
}

export const FoodSelectorModal: React.FC<FoodSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectFood,
  aversions = ['Lactose', 'Batata-Doce']
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedFood, setSelectedFood] = useState<FoodDatabaseEntry | null>(null);
  const [customWeight, setCustomWeight] = useState<number>(100);

  const categories = [
    { id: 'todos', label: 'Todos os Grupos' },
    { id: 'carnes_ovos', label: 'Carnes, Aves e Ovos' },
    { id: 'cereais_tuberculos', label: 'Cereais e Tubérculos' },
    { id: 'leguminosas', label: 'Leguminosas' },
    { id: 'laticinios', label: 'Laticínios & Vegetais' },
    { id: 'frutas', label: 'Frutas' },
    { id: 'gorduras', label: 'Gorduras Saudáveis' },
    { id: 'suplementos', label: 'Suplementos Proteicos' }
  ];

  const filteredFoods = useMemo(() => {
    return FOOD_DATABASE.filter(food => {
      const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'todos' || food.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  if (!isOpen) return null;

  const handleSelectEntry = (food: FoodDatabaseEntry) => {
    setSelectedFood(food);
    setCustomWeight(food.defaultWeightGrams);
  };

  const handleConfirmAdd = () => {
    if (!selectedFood) return;
    const foodItem = calculateFoodMacros(selectedFood, customWeight);
    onSelectFood(foodItem);
    setSelectedFood(null);
    onClose();
  };

  const isAversive = (foodName: string): boolean => {
    const lower = foodName.toLowerCase();
    return aversions.some(a => {
      const aLower = a.toLowerCase();
      if (aLower.includes('batata-doce') && lower.includes('batata-doce')) return true;
      if (aLower.includes('lactose') && (lower.includes('leite') || lower.includes('iogurte natural') || lower.includes('minas frescal') || lower.includes('queijo prato'))) return true;
      return false;
    });
  };

  const previewItem = selectedFood ? calculateFoodMacros(selectedFood, customWeight) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                Tabelas TACO • TBCA • USDA
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              Adicionar Alimento ao Plano Alimentar
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Busca e Filtros de Categoria */}
        <div className="p-4 border-b border-slate-200 space-y-3 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar por nome do alimento (ex: frango, arroz, aveia, whey...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-full whitespace-nowrap text-[11px] font-semibold transition ${
                  selectedCategory === cat.id 
                    ? 'bg-blue-600 text-white shadow-2xs' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Alimentos */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 divide-y divide-slate-100">
          {filteredFoods.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              Nenhum alimento encontrado com o filtro "{searchTerm}".
            </div>
          ) : (
            filteredFoods.map(food => {
              const aversive = isAversive(food.name);
              const isSelected = selectedFood?.id === food.id;

              return (
                <div
                  key={food.id}
                  onClick={() => handleSelectEntry(food)}
                  className={`pt-2.5 pb-2 px-3 rounded-xl cursor-pointer transition flex items-center justify-between ${
                    isSelected 
                      ? 'bg-blue-50/80 border border-blue-200' 
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">{food.name}</span>
                      <span className="text-[9px] bg-slate-100 font-semibold text-slate-500 px-1.5 py-0.2 rounded">
                        {food.sourceTable}
                      </span>
                      {aversive && (
                        <span className="text-[9px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded flex items-center gap-1">
                          <AlertTriangle className="w-2.5 h-2.5" /> Aversão da Paciente
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Padrão: {food.defaultHouseholdMeasure} ({food.defaultWeightGrams}g)
                    </p>
                  </div>

                  <div className="text-right flex items-center gap-3">
                    <div className="text-[11px] text-slate-600 hidden sm:block">
                      <span className="font-bold text-emerald-600">{food.ptn100g}g PTN</span> •{' '}
                      <span className="font-bold text-blue-600">{food.cho100g}g CHO</span> •{' '}
                      <span className="font-bold text-amber-600">{food.lip100g}g LIP</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-lg">
                      {food.kcal100g} kcal <span className="text-[9px] font-normal text-slate-400">/100g</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Rodapé de Confirmação e Ajuste de Gramatura */}
        {selectedFood && previewItem && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in slide-in-from-bottom-2">
            <div className="flex items-center gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">
                  Peso a Prescrever:
                </label>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <input
                    type="number"
                    min="1"
                    step="5"
                    value={customWeight}
                    onChange={(e) => setCustomWeight(Math.max(1, parseFloat(e.target.value) || 0))}
                    className="w-20 px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                  />
                  <span className="text-xs font-bold text-slate-600">gramas (g)</span>
                </div>
              </div>

              <div className="text-xs pl-3 border-l border-slate-200">
                <div className="font-bold text-slate-900">{previewItem.kcal} kcal</div>
                <div className="text-[11px] text-slate-500 flex gap-2">
                  <span className="text-emerald-700 font-semibold">{previewItem.ptn}g PTN</span>
                  <span className="text-blue-700 font-semibold">{previewItem.cho}g CHO</span>
                  <span className="text-amber-700 font-semibold">{previewItem.lip}g LIP</span>
                  <span className="text-purple-700 font-semibold">({previewItem.leucineGrams}g Leucina)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedFood(null)}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmAdd}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Inserir na Refeição</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
