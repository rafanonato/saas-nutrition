import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  X, 
  Search, 
  PlusCircle, 
  Check, 
  Flame, 
  Layers, 
  Activity, 
  Tag, 
  Clock, 
  FileText, 
  ArrowRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { DIETARY_TEMPLATES, DietaryTemplate, BLANK_TEMPLATE, TemplateGoal, TemplateMealType } from '../../data/dietaryTemplates';
import { Meal } from '../../types';

interface TemplateLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeMealName: string;
  onApplyTemplateToCurrentMeal: (template: DietaryTemplate) => void;
  onAddNewMealFromTemplate: (template: DietaryTemplate) => void;
  onOpenBlankTemplateCreator: () => void;
}

export const TemplateLibraryModal: React.FC<TemplateLibraryModalProps> = ({
  isOpen,
  onClose,
  activeMealName,
  onApplyTemplateToCurrentMeal,
  onAddNewMealFromTemplate,
  onOpenBlankTemplateCreator
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<string>('todos');
  const [selectedMealType, setSelectedMealType] = useState<string>('todos');
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);

  const goalOptions: { id: string; label: string }[] = [
    { id: 'todos', label: 'Todos os Objetivos' },
    { id: 'Hipertrofia', label: 'Hipertrofia & Ganho Muscular' },
    { id: 'Emagrecimento', label: 'Emagrecimento & Cutting' },
    { id: 'Performance', label: 'Performance Esportiva' },
    { id: 'Low-Carb', label: 'Low-Carb / Cetogênica' },
    { id: 'Vegetariano', label: 'Vegetariano / Vegano' },
    { id: 'Sem Lactose', label: 'Sem Lactose / Gastro-Safe' },
    { id: 'Prático/Marmita', label: 'Prático / Marmitas' }
  ];

  const mealTypeOptions: { id: string; label: string }[] = [
    { id: 'todos', label: 'Todas as Refeições' },
    { id: 'desjejum', label: 'Desjejum / Café' },
    { id: 'almoco', label: 'Almoço' },
    { id: 'pre_treino', label: 'Pré-Treino' },
    { id: 'pos_treino', label: 'Pós-Treino' },
    { id: 'jantar', label: 'Jantar' },
    { id: 'ceia', label: 'Ceia' }
  ];

  const filteredTemplates = useMemo(() => {
    return DIETARY_TEMPLATES.filter(template => {
      const matchesSearch = 
        template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
        template.items.some(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesGoal = selectedGoal === 'todos' || template.goal === selectedGoal;
      const matchesMealType = selectedMealType === 'todos' || template.mealType === selectedMealType || template.mealType === 'qualquer';

      return matchesSearch && matchesGoal && matchesMealType;
    });
  }, [searchTerm, selectedGoal, selectedMealType]);

  if (!isOpen) return null;

  const handleApplyToCurrent = (tmpl: DietaryTemplate) => {
    onApplyTemplateToCurrentMeal(tmpl);
    setAppliedNotification(`Template "${tmpl.title}" aplicado à "${activeMealName}" com sucesso!`);
    setTimeout(() => {
      setAppliedNotification(null);
      onClose();
    }, 1200);
  };

  const handleAddNewMeal = (tmpl: DietaryTemplate) => {
    onAddNewMealFromTemplate(tmpl);
    setAppliedNotification(`Nova refeição criada a partir de "${tmpl.title}"!`);
    setTimeout(() => {
      setAppliedNotification(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-3 md:p-6 animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header com indicador de templates */}
        <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-100 border border-blue-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-600" />
                Biblioteca de Prescrição • +35 Templates Inteligentes
              </span>
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                Sincronizado com Solver HiGHS & mTORC1
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              Templates Dietéticos Clínicos & Esportivos
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {appliedNotification && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>{appliedNotification}</span>
          </div>
        )}

        {/* Barra de Filtros e Busca */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Pesquisar por receita, ingrediente (frango, whey, ovos...), ou tag..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            {/* Botão de Criação de Template em Branco */}
            <button
              type="button"
              onClick={onOpenBlankTemplateCreator}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Criar Template em Branco</span>
            </button>
          </div>

          {/* Filtros de Objetivos Clínicos */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
            {goalOptions.map(g => (
              <button
                key={g.id}
                onClick={() => setSelectedGoal(g.id)}
                className={`px-3 py-1 rounded-full whitespace-nowrap text-[11px] font-semibold transition ${
                  selectedGoal === g.id
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Filtros de Refeições */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
            {mealTypeOptions.map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedMealType(m.id)}
                className={`px-2.5 py-0.5 rounded-md whitespace-nowrap text-[10px] font-bold uppercase transition ${
                  selectedMealType === m.id
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-200/80 text-slate-600 hover:bg-slate-300'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grade de Templates */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-100/50 space-y-4">
          {/* Card Especial: Template em Branco */}
          <div className="border-2 border-dashed border-emerald-400 bg-emerald-50/50 rounded-2xl p-5 hover:bg-emerald-50 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                  Canvas Livre
                </span>
                <h4 className="font-bold text-slate-900 text-sm">
                  {BLANK_TEMPLATE.title}
                </h4>
              </div>
              <p className="text-xs text-slate-600 max-w-2xl">
                {BLANK_TEMPLATE.description} Ideal para montar cardápios exclusivos utilizando a tabela TACO/TBCA com balanceamento matemático.
              </p>
            </div>
            <button
              onClick={onOpenBlankTemplateCreator}
              className="bg-white border border-emerald-500 text-emerald-700 hover:bg-emerald-600 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer shrink-0"
            >
              <span>Abrir Criador do Zero</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Listagem dos 35+ Templates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map(template => {
              const isMtorcMet = template.targetLeucine >= 2.5;

              return (
                <div 
                  key={template.id}
                  className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                            {template.goal}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 uppercase">
                            {template.mealType}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm leading-snug">
                          {template.title}
                        </h4>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-base font-bold text-slate-900 flex items-center gap-1">
                          <Flame className="w-4 h-4 text-amber-500" />
                          <span>{template.targetKcal} kcal</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2">
                      {template.description}
                    </p>

                    {/* Macros e mTORC1 Leucina */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 grid grid-cols-4 gap-1 text-center text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">PROTEÍNA</span>
                        <span className="font-bold text-emerald-700">{template.targetPtn}g</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">CARBO</span>
                        <span className="font-bold text-blue-700">{template.targetCho}g</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">GORDURA</span>
                        <span className="font-bold text-amber-700">{template.targetLip}g</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">LEUCINA</span>
                        <span className={`font-bold ${isMtorcMet ? 'text-purple-700' : 'text-slate-600'}`}>
                          {template.targetLeucine}g
                        </span>
                      </div>
                    </div>

                    {/* Alimentos contidos no template */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Alimentos na Receita ({template.items.length}):
                      </span>
                      <div className="text-[11px] text-slate-700 space-y-0.5">
                        {template.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <span className="truncate pr-2">• {item.name}</span>
                            <span className="text-slate-400 shrink-0 font-medium">{item.householdMeasure}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Ações de Aplicação */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleApplyToCurrent(template)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Substituir "{activeMealName}"</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAddNewMeal(template)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 px-3 rounded-xl text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                      title="Adicionar ao plano como nova refeição"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
                      <span>Nova Refeição</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 text-xs">
              Nenhum template encontrado com os filtros selecionados. Experimente buscar outro termo ou clique no botão "+ Criar Template em Branco" para formular um novo cardápio.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
