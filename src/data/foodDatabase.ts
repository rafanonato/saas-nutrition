import { FoodItem } from '../types';

export interface FoodDatabaseEntry {
  id: string;
  name: string;
  category: 'carnes_ovos' | 'cereais_tuberculos' | 'leguminosas' | 'laticinios' | 'frutas' | 'vegetais' | 'gorduras' | 'suplementos';
  sourceTable: 'TACO' | 'TBCA' | 'USDA';
  defaultHouseholdMeasure: string;
  defaultWeightGrams: number;
  // Valores por 100g
  ptn100g: number;
  cho100g: number;
  lip100g: number;
  kcal100g: number;
  leucine100g: number; // gramas de leucina por 100g
}

export const FOOD_DATABASE: FoodDatabaseEntry[] = [
  // Carnes, Aves, Peixes e Ovos
  {
    id: 'db-001',
    name: 'Peito de Frango Grelhado',
    category: 'carnes_ovos',
    sourceTable: 'TACO',
    defaultHouseholdMeasure: '1 filé médio (150g)',
    defaultWeightGrams: 150,
    ptn100g: 31.5,
    cho100g: 0.0,
    lip100g: 3.2,
    kcal100g: 159,
    leucine100g: 2.3
  },
  {
    id: 'db-002',
    name: 'Patinho Bovino Moído Grelhado',
    category: 'carnes_ovos',
    sourceTable: 'TACO',
    defaultHouseholdMeasure: '4 colheres de sopa cheias (130g)',
    defaultWeightGrams: 130,
    ptn100g: 35.9,
    cho100g: 0.0,
    lip100g: 7.3,
    kcal100g: 219,
    leucine100g: 2.7
  },
  {
    id: 'db-003',
    name: 'Filé de Tilápia Grelhado',
    category: 'carnes_ovos',
    sourceTable: 'TACO',
    defaultHouseholdMeasure: '1 filé grande (160g)',
    defaultWeightGrams: 160,
    ptn100g: 26.2,
    cho100g: 0.0,
    lip100g: 2.7,
    kcal100g: 130,
    leucine100g: 2.1
  },
  {
    id: 'db-004',
    name: 'Ovo de Galinha Inteiro Cozido',
    category: 'carnes_ovos',
    sourceTable: 'TACO',
    defaultHouseholdMeasure: '2 unidades médias (100g)',
    defaultWeightGrams: 100,
    ptn100g: 13.0,
    cho100g: 0.8,
    lip100g: 9.5,
    kcal100g: 146,
    leucine100g: 1.1
  },
  {
    id: 'db-005',
    name: 'Clara de Ovo Pasteurizada Cozida',
    category: 'carnes_ovos',
    sourceTable: 'TACO',
    defaultHouseholdMeasure: '3 claras (90g)',
    defaultWeightGrams: 90,
    ptn100g: 10.8,
    cho100g: 0.7,
    lip100g: 0.1,
    kcal100g: 48,
    leucine100g: 0.9
  },
  {
    id: 'db-006',
    name: 'Filé de Salmão Grelhado',
    category: 'carnes_ovos',
    sourceTable: 'TBCA',
    defaultHouseholdMeasure: '1 filé médio (140g)',
    defaultWeightGrams: 140,
    ptn100g: 24.0,
    cho100g: 0.0,
    lip100g: 12.5,
    kcal100g: 210,
    leucine100g: 2.0
  },
  {
    id: 'db-007',
    name: 'Atum Sólido em Água (Drenado)',
    category: 'carnes_ovos',
    sourceTable: 'TACO',
    defaultHouseholdMeasure: '1 lata drenada (120g)',
    defaultWeightGrams: 120,
    ptn100g: 26.0,
    cho100g: 0.0,
    lip100g: 1.0,
    kcal100g: 115,
    leucine100g: 2.2
  },
  {
    id: 'db-008',
    name: 'Tofu Firme Orgânico',
    category: 'carnes_ovos',
    sourceTable: 'USDA',
    defaultHouseholdMeasure: '2 fatias grossas (150g)',
    defaultWeightGrams: 150,
    ptn100g: 14.0,
    cho100g: 2.5,
    lip100g: 8.0,
    kcal100g: 138,
    leucine100g: 1.1
  },

  // Cereais e Tubérculos
  {
    id: 'db-009',
    name: 'Arroz Branco Cozido',
    category: 'cereais_tuberculos',
    sourceTable: 'TACO',
    defaultHouseholdMeasure: '4 colheres de sopa cheias (120g)',
    defaultWeightGrams: 120,
    ptn100g: 2.5,
    cho100g: 28.1,
    lip100g: 0.2,
    kcal100g: 128,
    leucine100g: 0.2
  },
  {
    id: 'db-010',
    name: 'Arroz Integral Cozido',
    category: 'cereais_tuberculos',
    sourceTable: 'TACO',
    defaultHouseholdMeasure: '4 colheres de sopa cheias (120g)',
    defaultWeightGrams: 120,
    ptn100g: 2.6,
    cho100g: 25.8,
    lip100g: 1.0,
    kcal100g: 124,
    leucine100g: 0.2
  },
  {
    id: 'db-011',
    name: 'Mandioca / Aipim Cozida',
    category: 'cereais_tuberculos',
    sourceTable: 'TACO',
    defaultHouseholdMeasure: '3 pedaços médios (120g)',
    defaultWeightGrams: 120,
    ptn100g: 1.1,
    cho100g: 30.1,
    lip100g: 0.3,
    kcal100g: 125,
    leucine100g: 0.1
  },
  {
    id: 'db-012',
    name: 'Batata Inglesa Cozida / Amassada',
    category: 'cereais_tuberculos',
    sourceTable: 'TACO',
    defaultHouseholdMeasure: '2 batatas médias (180g)',
    defaultWeightGrams: 180,
    ptn100g: 1.2,
    cho100g: 14.7,
    lip100g: 0.1,
    kcal100g: 64,
    leucine100g: 0.1
  },
  {
    id: 'db-013',
    name: 'Aveia em Flocos Finos',
    category: 'cereais_tuberculos',
    sourceTable: 'TACO',
    defaultHouseholdMeasure: '3 colheres de sopa cheias (45g)',
    defaultWeightGrams: 45,
    ptn100g: 13.9,
    cho100g: 66.6,
    lip100g: 8.5,
    kcal100g: 394,
    leucine100g: 0.9
  },
  {
    id: 'db-014',
    name: 'Pão de Forma 100% Integral',
    category: 'cereais_tuberculos',
    sourceTable: 'TBCA',
    defaultHouseholdMeasure: '2 fatias (50g)',
    defaultWeightGrams: 50,
    ptn100g: 10.5,
    cho100g: 44.0,
    lip100g: 3.5,
    kcal100g: 245,
    leucine100g: 0.6
  },
  {
    id: 'db-015',
    name: 'Macarrão de Sêmola Cozido',
    category: 'cereais_tuberculos',
    sourceTable: 'TACO',
    defaultHouseholdMeasure: '1 prato raso (140g)',
    defaultWeightGrams: 140,
    ptn100g: 4.2,
    cho100g: 30.5,
    lip100g: 0.5,
    kcal100g: 145,
    leucine100g: 0.3
  },
  {
    id: 'db-016',
    name: 'Cuscuz Nordestino Cozido (Milharina)',
    category: 'cereais_tuberculos',
    sourceTable: 'TACO',
    defaultHouseholdMeasure: '1 pedaço médio (100g)',
    defaultWeightGrams: 100,
    ptn100g: 2.2,
    cho100g: 25.4,
    lip100g: 0.7,
    kcal100g: 113,
    leucine100g: 0.2
  },

  // Leguminosas
  {
    id: 'db-017',
    name: 'Feijão Carioca Cozido (50% Caldo)',
    category: 'leguminosas',
    sourceTable: 'TACO',
    defaultHouseholdMeasure: '1 concha média (100g)',
    defaultWeightGrams: 100,
    ptn100g: 4.8,
    cho100g: 13.6,
    lip100g: 0.5,
    kcal100g: 76,
    leucine100g: 0.4
  },
  {
    id: 'db-018',
    name: 'Feijão Preto Cozido (50% Caldo)',
    category: 'leguminosas',
    sourceTable: 'TACO',
    defaultHouseholdMeasure: '1 concha média (100g)',
    defaultWeightGrams: 100,
    ptn100g: 4.5,
    cho100g: 14.0,
    lip100g: 0.5,
    kcal100g: 77,
    leucine100g: 0.4
  },
  {
    id: 'db-019',
    name: 'Grão-de-Bico Cozido',
    category: 'leguminosas',
    sourceTable: 'TACO',
    defaultHouseholdMeasure: '3 colheres de sopa cheias (90g)',
    defaultWeightGrams: 90,
    ptn100g: 8.4,
    cho100g: 26.2,
    lip100g: 2.6,
    kcal100g: 160,
    leucine100g: 0.6
  },
  {
    id: 'db-020',
    name: 'Lentilha Cozida',
    category: 'leguminosas',
    sourceTable: 'TACO',
    defaultHouseholdMeasure: '1 concha pequena (90g)',
    defaultWeightGrams: 90,
    ptn100g: 6.3,
    cho100g: 16.3,
    lip100g: 0.5,
    kcal100g: 93,
    leucine100g: 0.5
  },

  // Laticínios e Derivados
  {
    id: 'db-021',
    name: 'Iogurte Natural Desnatado',
    category: 'laticinios',
    sourceTable: 'TBCA',
    defaultHouseholdMeasure: '1 pote (160g)',
    defaultWeightGrams: 160,
    ptn100g: 4.1,
    cho100g: 5.8,
    lip100g: 0.3,
    kcal100g: 43,
    leucine100g: 0.45
  },
  {
    id: 'db-022',
    name: 'Iogurte Grego Tradicional Zero Lactose',
    category: 'laticinios',
    sourceTable: 'TBCA',
    defaultHouseholdMeasure: '1 pote (100g)',
    defaultWeightGrams: 100,
    ptn100g: 7.5,
    cho100g: 4.5,
    lip100g: 2.0,
    kcal100g: 68,
    leucine100g: 0.75
  },
  {
    id: 'db-023',
    name: 'Queijo Cottage 0% Gordura',
    category: 'laticinios',
    sourceTable: 'TBCA',
    defaultHouseholdMeasure: '2 colheres de sopa cheias (80g)',
    defaultWeightGrams: 80,
    ptn100g: 14.5,
    cho100g: 3.0,
    lip100g: 0.5,
    kcal100g: 74,
    leucine100g: 1.4
  },
  {
    id: 'db-024',
    name: 'Queijo Minas Frescal Light',
    category: 'laticinios',
    sourceTable: 'TACO',
    defaultHouseholdMeasure: '1 fatia média (40g)',
    defaultWeightGrams: 40,
    ptn100g: 17.4,
    cho100g: 2.8,
    lip100g: 11.2,
    kcal100g: 180,
    leucine100g: 1.6
  },
  {
    id: 'db-025',
    name: 'Bebida Vegetal de Amêndoas Sem Açúcar',
    category: 'laticinios',
    sourceTable: 'USDA',
    defaultHouseholdMeasure: '1 copo (200ml)',
    defaultWeightGrams: 200,
    ptn100g: 0.6,
    cho100g: 0.3,
    lip100g: 1.2,
    kcal100g: 15,
    leucine100g: 0.05
  },

  // Frutas
  {
    id: 'db-026',
    name: 'Banana Prata',
    category: 'frutas',
    sourceTable: 'TACO',
    defaultHouseholdMeasure: '1 unidade média (85g)',
    defaultWeightGrams: 85,
    ptn100g: 1.3,
    cho100g: 26.0,
    lip100g: 0.1,
    kcal100g: 98,
    leucine100g: 0.08
  },
  {
    id: 'db-027',
    name: 'Mamão Papaia',
    category: 'frutas',
    sourceTable: 'TACO',
    defaultHouseholdMeasure: '1/2 unidade (140g)',
    defaultWeightGrams: 140,
    ptn100g: 0.5,
    cho100g: 10.4,
    lip100g: 0.1,
    kcal100g: 40,
    leucine100g: 0.04
  },
  {
    id: 'db-028',
    name: 'Maçã Gala com Casca',
    category: 'frutas',
    sourceTable: 'TACO',
    defaultHouseholdMeasure: '1 unidade média (130g)',
    defaultWeightGrams: 130,
    ptn100g: 0.3,
    cho100g: 14.2,
    lip100g: 0.2,
    kcal100g: 56,
    leucine100g: 0.02
  },
  {
    id: 'db-029',
    name: 'Morangos Frescos',
    category: 'frutas',
    sourceTable: 'TACO',
    defaultHouseholdMeasure: '8 unidades médias (120g)',
    defaultWeightGrams: 120,
    ptn100g: 0.9,
    cho100g: 6.8,
    lip100g: 0.3,
    kcal100g: 30,
    leucine100g: 0.05
  },
  {
    id: 'db-030',
    name: 'Abacate Hass / Manteiga',
    category: 'frutas',
    sourceTable: 'TACO',
    defaultHouseholdMeasure: '2 colheres de sopa cheias (60g)',
    defaultWeightGrams: 60,
    ptn100g: 1.2,
    cho100g: 6.0,
    lip100g: 8.4,
    kcal100g: 96,
    leucine100g: 0.07
  },

  // Gorduras e Oleaginosas
  {
    id: 'db-031',
    name: 'Azeite de Oliva Extravirgem',
    category: 'gorduras',
    sourceTable: 'TACO',
    defaultHouseholdMeasure: '1 colher de sopa (10g)',
    defaultWeightGrams: 10,
    ptn100g: 0.0,
    cho100g: 0.0,
    lip100g: 100.0,
    kcal100g: 884,
    leucine100g: 0.0
  },
  {
    id: 'db-032',
    name: 'Pasta de Amendoim Integral 100%',
    category: 'gorduras',
    sourceTable: 'TBCA',
    defaultHouseholdMeasure: '1 colher de sopa rasa (20g)',
    defaultWeightGrams: 20,
    ptn100g: 27.5,
    cho100g: 12.0,
    lip100g: 49.0,
    kcal100g: 595,
    leucine100g: 1.8
  },
  {
    id: 'db-033',
    name: 'Castanha-do-Pará (Brasil)',
    category: 'gorduras',
    sourceTable: 'TACO',
    defaultHouseholdMeasure: '2 unidades (10g)',
    defaultWeightGrams: 10,
    ptn100g: 14.5,
    cho100g: 12.0,
    lip100g: 66.0,
    kcal100g: 643,
    leucine100g: 1.1
  },
  {
    id: 'db-034',
    name: 'Sementes de Chia',
    category: 'gorduras',
    sourceTable: 'USDA',
    defaultHouseholdMeasure: '1 colher de sopa (15g)',
    defaultWeightGrams: 15,
    ptn100g: 16.5,
    cho100g: 42.0,
    lip100g: 30.7,
    kcal100g: 486,
    leucine100g: 1.0
  },

  // Suplementos Proteicos
  {
    id: 'db-035',
    name: 'Whey Protein Isolado 90%',
    category: 'suplementos',
    sourceTable: 'USDA',
    defaultHouseholdMeasure: '1 scoop medidor (30g)',
    defaultWeightGrams: 30,
    ptn100g: 90.0,
    cho100g: 2.0,
    lip100g: 1.0,
    kcal100g: 377,
    leucine100g: 9.6
  },
  {
    id: 'db-036',
    name: 'Whey Protein Concentrado 80%',
    category: 'suplementos',
    sourceTable: 'USDA',
    defaultHouseholdMeasure: '1 scoop medidor (30g)',
    defaultWeightGrams: 30,
    ptn100g: 80.0,
    cho100g: 6.5,
    lip100g: 5.5,
    kcal100g: 395,
    leucine100g: 8.8
  },
  {
    id: 'db-037',
    name: 'Proteína Vegetal Isolada (Ervilha + Arroz)',
    category: 'suplementos',
    sourceTable: 'USDA',
    defaultHouseholdMeasure: '1 scoop medidor (30g)',
    defaultWeightGrams: 30,
    ptn100g: 80.0,
    cho100g: 4.0,
    lip100g: 3.5,
    kcal100g: 367,
    leucine100g: 7.2
  },
  {
    id: 'db-038',
    name: 'Creatina Monoidratada Creapure',
    category: 'suplementos',
    sourceTable: 'TBCA',
    defaultHouseholdMeasure: '1 dosador raso (5g)',
    defaultWeightGrams: 5,
    ptn100g: 0.0,
    cho100g: 0.0,
    lip100g: 0.0,
    kcal100g: 0,
    leucine100g: 0.0
  }
];

export function calculateFoodMacros(food: FoodDatabaseEntry, grams: number): FoodItem {
  const factor = grams / 100;
  return {
    id: `food-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    name: food.name,
    householdMeasure: grams === food.defaultWeightGrams ? food.defaultHouseholdMeasure : `${grams}g`,
    weightGrams: Math.round(grams),
    ptn: Number((food.ptn100g * factor).toFixed(1)),
    cho: Number((food.cho100g * factor).toFixed(1)),
    lip: Number((food.lip100g * factor).toFixed(1)),
    kcal: Math.round(food.kcal100g * factor),
    leucineGrams: Number((food.leucine100g * factor).toFixed(2)),
    sourceTable: food.sourceTable
  };
}
