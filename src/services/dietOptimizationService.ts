import { FoodItem, Meal } from '../types';

/**
 * Itens calculados e otimizados pelo Solver HiGHS para o Almoço (Refeição 2)
 * Alvo: Hipertrofia com exclusão de batata-doce e lactose, atingindo o gatilho de leucina mTORC1 (>3.0g)
 */
export const HIGHS_OPTIMIZED_LUNCH_ITEMS: FoodItem[] = [
  {
    id: 'food-highs-1',
    name: 'Peito de Frango Grelhado',
    householdMeasure: '1 filé médio e meio (150g)',
    weightGrams: 150,
    kcal: 239,
    ptn: 48.0,
    cho: 0.0,
    lip: 3.8,
    leucineGrams: 3.60,
    sourceTable: 'TACO'
  },
  {
    id: 'food-highs-2',
    name: 'Arroz Branco Cozido',
    householdMeasure: '4 colheres de sopa cheias (160g)',
    weightGrams: 160,
    kcal: 205,
    ptn: 4.0,
    cho: 45.0,
    lip: 0.4,
    leucineGrams: 0.34,
    sourceTable: 'TACO'
  },
  {
    id: 'food-highs-3',
    name: 'Feijão Carioca Cozido (50% grão / 50% caldo)',
    householdMeasure: '1 concha média rasa (100g)',
    weightGrams: 100,
    kcal: 76,
    ptn: 4.8,
    cho: 13.6,
    lip: 0.5,
    leucineGrams: 0.38,
    sourceTable: 'TACO'
  },
  {
    id: 'food-highs-4',
    name: 'Azeite de Oliva Extravirgem',
    householdMeasure: '1 colher de sobremesa (8ml)',
    weightGrams: 8,
    kcal: 71,
    ptn: 0.0,
    cho: 0.0,
    lip: 8.0,
    leucineGrams: 0.0,
    sourceTable: 'TBCA'
  },
  {
    id: 'food-highs-5',
    name: 'Salada de Rúcula, Tomate e Alface',
    householdMeasure: '1 prato de sobremesa farto',
    weightGrams: 120,
    kcal: 19,
    ptn: 1.6,
    cho: 3.2,
    lip: 0.2,
    leucineGrams: 0.11,
    sourceTable: 'TACO'
  }
];

/**
 * Aplica a solução matemática otimizada pelo HiGHS à refeição alvo (padrão: meal-2 / Almoço)
 */
export function applyHighsSolutionToMeal(meals: Meal[], targetMealId: string = 'meal-2'): {
  updatedMeals: Meal[];
  appliedMeal: Meal;
  totalLeucine: number;
  totalPtn: number;
} {
  let targetMealFound = false;
  let totalLeucine = 0;
  let totalPtn = 0;
  let appliedMeal: Meal | null = null;

  const updatedMeals = meals.map(meal => {
    if (meal.id === targetMealId || (!targetMealFound && meal.name.toLowerCase().includes('almoço'))) {
      targetMealFound = true;
      const items = HIGHS_OPTIMIZED_LUNCH_ITEMS;
      const currentLeucine = Number(items.reduce((s, i) => s + i.leucineGrams, 0).toFixed(2));
      const currentPtnCalc = Number(items.reduce((s, i) => s + i.ptn, 0).toFixed(1));

      totalLeucine = currentLeucine;
      totalPtn = currentPtnCalc;

      const updated: Meal = {
        ...meal,
        items,
        currentLeucine,
        leucineThresholdMet: currentLeucine >= 3.0
      };
      appliedMeal = updated;
      return updated;
    }
    return meal;
  });

  return {
    updatedMeals,
    appliedMeal: appliedMeal || updatedMeals[1] || updatedMeals[0],
    totalLeucine,
    totalPtn
  };
}
