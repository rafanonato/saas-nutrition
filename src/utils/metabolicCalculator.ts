import { Meal } from '../types';

export type BmrFormula = 'cunningham' | 'mifflin' | 'harris';
export type CalorieGoalStrategy = 'hipertrofia' | 'emagrecimento' | 'manutencao' | 'performance';

export interface ActivityFactorOption {
  factor: number;
  label: string;
  description: string;
}

export const ACTIVITY_FACTOR_OPTIONS: ActivityFactorOption[] = [
  { 
    factor: 1.20, 
    label: 'Sedentário (1.20)', 
    description: 'Pouca ou nenhuma atividade física regular, trabalho de escritório/sedentário' 
  },
  { 
    factor: 1.375, 
    label: 'Levemente Ativo (1.375)', 
    description: 'Exercícios leves ou caminhadas 1 a 3 dias por semana' 
  },
  { 
    factor: 1.55, 
    label: 'Moderadamente Ativo (1.55)', 
    description: 'Musculação / aeróbico moderado 3 a 5 dias/semana (Perfil de Manuela Rocchetto)' 
  },
  { 
    factor: 1.725, 
    label: 'Muito Ativo (1.725)', 
    description: 'Treinos intensos diários ou treinos pesados 6 a 7 dias por semana' 
  },
  { 
    factor: 1.90, 
    label: 'Extremamente Ativo (1.90)', 
    description: 'Atleta de alto rendimento, treinos bidiários ou trabalho de alta demanda física' 
  }
];

export interface MetabolicCalculationInput {
  weightKg: number;
  heightCm: number;
  ageYears: number;
  gender?: 'feminino' | 'masculino' | string;
  leanMassKg?: number; // Massa Livre de Gordura (MLG)
  formula: BmrFormula;
  activityFactor: number;
  goal: CalorieGoalStrategy;
  calorieDeltaPercent?: number; // ex: +10 para +10%, -15 para -15%
  calorieAdjustmentPercent?: number;
  fixedTargetKcal?: number; // se a nutricionista quiser fixar o VET manualmente
  ptnPerKg?: number; // ex: 2.2 g/kg
  lipPerKg?: number; // ex: 0.9 g/kg
}

export interface MacroDistribution {
  grams: number;
  kcal: number;
  percent: number;
  gPerKg: number;
  gPerKgLeanMass?: number;
}

export interface MetabolicCalculationResult {
  bmr: number; // TMB
  formulaUsed: BmrFormula;
  formulaLabel: string;
  formulaFormulaText: string;
  activityFactor: number;
  activityLabel: string;
  get: number; // Gasto Energético Total (TDEE)
  targetKcal: number; // VET Alvo Prescrito
  calorieDeltaKcal: number;
  calorieDeltaPercent: number;
  goalStrategy: CalorieGoalStrategy;
  ptn: MacroDistribution;
  lip: MacroDistribution;
  cho: MacroDistribution;
}

/**
 * Calcula a Taxa Metabólica Basal (TMB) segundo as regras de nutrição clínica:
 * 1. Cunningham (1980/1991): TMB = 500 + 22 * MLG (kg)
 * 2. Mifflin-St Jeor (1990):
 *    - Mulher: 10 * peso + 6.25 * altura - 5 * idade - 161
 *    - Homem: 10 * peso + 6.25 * altura - 5 * idade + 5
 * 3. Harris-Benedict Revisada (Roza & Shizgal 1984):
 *    - Mulher: 447.593 + (9.247 * peso) + (3.098 * altura) - (4.330 * idade)
 *    - Homem: 88.362 + (13.397 * peso) + (4.799 * altura) - (5.677 * idade)
 */
export function calculateBMR(
  formula: BmrFormula,
  weightKg: number,
  heightCm: number,
  ageYears: number,
  gender: 'feminino' | 'masculino',
  leanMassKg?: number
): { bmr: number; formulaLabel: string; formulaText: string } {
  const safeWeight = Math.max(weightKg, 30);
  const safeHeight = Math.max(heightCm, 100);
  const safeAge = Math.max(ageYears, 10);
  const safeLeanMass = leanMassKg && leanMassKg > 0 ? leanMassKg : safeWeight * 0.76;

  if (formula === 'cunningham') {
    const bmr = Math.round(500 + (22 * safeLeanMass));
    return {
      bmr,
      formulaLabel: 'Cunningham (MLG)',
      formulaText: `TMB = 500 + (22 × ${safeLeanMass.toFixed(1)} kg MLG) = ${bmr} kcal`
    };
  }

  if (formula === 'mifflin') {
    const base = (10 * safeWeight) + (6.25 * safeHeight) - (5 * safeAge);
    const bmr = Math.round(gender === 'feminino' ? base - 161 : base + 5);
    return {
      bmr,
      formulaLabel: 'Mifflin-St Jeor',
      formulaText: gender === 'feminino' 
        ? `TMB = (10 × ${safeWeight}) + (6.25 × ${safeHeight}) - (5 × ${safeAge}) - 161 = ${bmr} kcal`
        : `TMB = (10 × ${safeWeight}) + (6.25 × ${safeHeight}) - (5 × ${safeAge}) + 5 = ${bmr} kcal`
    };
  }

  // Harris-Benedict Revisada (Roza & Shizgal 1984)
  if (gender === 'feminino') {
    const bmr = Math.round(447.593 + (9.247 * safeWeight) + (3.098 * safeHeight) - (4.330 * safeAge));
    return {
      bmr,
      formulaLabel: 'Harris-Benedict Revisada',
      formulaText: `TMB = 447.59 + (9.25 × ${safeWeight}) + (3.10 × ${safeHeight}) - (4.33 × ${safeAge}) = ${bmr} kcal`
    };
  } else {
    const bmr = Math.round(88.362 + (13.397 * safeWeight) + (4.799 * safeHeight) - (5.677 * safeAge));
    return {
      bmr,
      formulaLabel: 'Harris-Benedict Revisada',
      formulaText: `TMB = 88.36 + (13.40 × ${safeWeight}) + (4.80 × ${safeHeight}) - (5.68 × ${safeAge}) = ${bmr} kcal`
    };
  }
}

/**
 * Realiza o cálculo metabólico completo e a distribuição de macronutrientes:
 * TMB -> GET = TMB * FAF -> VET (com delta de superávit/déficit) -> PTN (g/kg), LIP (g/kg) e CHO (remanescente).
 */
export function calculateFullMetabolicTargets(input: MetabolicCalculationInput): MetabolicCalculationResult {
  const {
    weightKg,
    heightCm,
    ageYears,
    gender,
    leanMassKg,
    formula,
    activityFactor,
    goal,
    calorieDeltaPercent,
    fixedTargetKcal,
    ptnPerKg = 2.2,
    lipPerKg = 0.9
  } = input;

  const safeGender: 'feminino' | 'masculino' = gender === 'masculino' ? 'masculino' : 'feminino';

  const { bmr, formulaLabel, formulaText } = calculateBMR(
    formula, 
    weightKg, 
    heightCm, 
    ageYears, 
    safeGender, 
    leanMassKg
  );

  // 1. GET = TMB * Fator de Atividade
  const get = Math.round(bmr * activityFactor);

  // 2. Alvo Calórico Prescrito (VET)
  let targetKcal = get;
  let deltaPercent = 0;

  if (fixedTargetKcal && fixedTargetKcal > 0) {
    targetKcal = Math.round(fixedTargetKcal);
    deltaPercent = Number((((targetKcal - get) / get) * 100).toFixed(1));
  } else if (calorieDeltaPercent !== undefined || input.calorieAdjustmentPercent !== undefined) {
    deltaPercent = calorieDeltaPercent !== undefined ? calorieDeltaPercent : (input.calorieAdjustmentPercent || 0);
    targetKcal = Math.round(get * (1 + (deltaPercent / 100)));
  } else {
    // Padrão clínico por objetivo
    if (goal === 'hipertrofia') {
      deltaPercent = 8.5; // Superávit leve (+8.5%)
      targetKcal = Math.round(get * 1.085);
    } else if (goal === 'emagrecimento') {
      deltaPercent = -18.0; // Déficit moderado (-18%)
      targetKcal = Math.round(get * 0.82);
    } else {
      deltaPercent = 0; // Manutenção / Recomposição
      targetKcal = get;
    }
  }

  const deltaKcal = targetKcal - get;

  // 3. Distribuição de Macronutrientes (ISSN / SBAN)
  // Proteína: g/kg (ex: 2.2 g/kg)
  const safePtnPerKg = Math.max(ptnPerKg, 1.0);
  const ptnGrams = Math.round(weightKg * safePtnPerKg);
  const ptnKcal = ptnGrams * 4;

  // Lipídio: g/kg (ex: 0.9 g/kg)
  const safeLipPerKg = Math.max(lipPerKg, 0.5);
  const lipGrams = Math.round(weightKg * safeLipPerKg);
  const lipKcal = lipGrams * 9;

  // Carboidrato: cota energética remanescente (VET - PtnKcal - LipKcal) / 4
  const remainingKcal = Math.max(targetKcal - ptnKcal - lipKcal, 0);
  const choGrams = Math.round(remainingKcal / 4);
  const choKcal = choGrams * 4;

  const totalCalculatedKcal = ptnKcal + lipKcal + choKcal;

  const ptnPercent = Number(((ptnKcal / totalCalculatedKcal) * 100).toFixed(1));
  const lipPercent = Number(((lipKcal / totalCalculatedKcal) * 100).toFixed(1));
  const choPercent = Number(((choKcal / totalCalculatedKcal) * 100).toFixed(1));

  const safeLeanMass = leanMassKg && leanMassKg > 0 ? leanMassKg : weightKg * 0.76;

  const actOption = ACTIVITY_FACTOR_OPTIONS.find(a => Math.abs(a.factor - activityFactor) < 0.01);
  const activityLabel = actOption ? actOption.label : `Fator ${activityFactor}`;

  return {
    bmr,
    formulaUsed: formula,
    formulaLabel,
    formulaFormulaText: formulaText,
    activityFactor,
    activityLabel,
    get,
    targetKcal,
    calorieDeltaKcal: deltaKcal,
    calorieDeltaPercent: deltaPercent,
    goalStrategy: goal,
    ptn: {
      grams: ptnGrams,
      kcal: ptnKcal,
      percent: ptnPercent,
      gPerKg: Number(safePtnPerKg.toFixed(2)),
      gPerKgLeanMass: Number((ptnGrams / safeLeanMass).toFixed(2))
    },
    lip: {
      grams: lipGrams,
      kcal: lipKcal,
      percent: lipPercent,
      gPerKg: Number(safeLipPerKg.toFixed(2))
    },
    cho: {
      grams: choGrams,
      kcal: choKcal,
      percent: choPercent,
      gPerKg: Number((choGrams / weightKg).toFixed(2))
    }
  };
}

/**
 * Consolida os totais nutricionais em tempo real de uma lista de refeições prescritas
 */
export function calculateMealsNutritionalTotals(meals: Meal[], targetKcal: number = 2100) {
  const totals = meals.reduce(
    (acc, meal) => {
      const mPtn = meal.items.reduce((s, i) => s + (Number(i.ptn) || 0), 0);
      const mCho = meal.items.reduce((s, i) => s + (Number(i.cho) || 0), 0);
      const mLip = meal.items.reduce((s, i) => s + (Number(i.lip) || 0), 0);
      const mKcal = meal.items.reduce((s, i) => s + (Number(i.kcal) || 0), 0);
      const mLeucine = meal.items.reduce((s, i) => s + (Number(i.leucineGrams) || 0), 0);

      return {
        ptn: acc.ptn + mPtn,
        cho: acc.cho + mCho,
        lip: acc.lip + mLip,
        kcal: acc.kcal + mKcal,
        maxLeucineInSingleMeal: Math.max(acc.maxLeucineInSingleMeal, mLeucine),
        mealsWithLeucineMet: acc.mealsWithLeucineMet + (mLeucine >= 2.5 ? 1 : 0)
      };
    },
    { ptn: 0, cho: 0, lip: 0, kcal: 0, maxLeucineInSingleMeal: 0, mealsWithLeucineMet: 0 }
  );

  const roundedKcal = Math.round(totals.kcal);
  const roundedPtn = Number(totals.ptn.toFixed(1));
  const roundedCho = Number(totals.cho.toFixed(1));
  const roundedLip = Number(totals.lip.toFixed(1));

  const ptnKcal = roundedPtn * 4;
  const choKcal = roundedCho * 4;
  const lipKcal = roundedLip * 9;
  const calculatedVET = Math.max(ptnKcal + choKcal + lipKcal, 1);

  const ptnPercent = Number(((ptnKcal / calculatedVET) * 100).toFixed(1));
  const choPercent = Number(((choKcal / calculatedVET) * 100).toFixed(1));
  const lipPercent = Number(((lipKcal / calculatedVET) * 100).toFixed(1));

  const kcalPercent = targetKcal > 0 ? Math.round((roundedKcal / targetKcal) * 100) : 100;
  const deltaFromTarget = roundedKcal - targetKcal;

  return {
    totalKcal: roundedKcal,
    totalPtn: roundedPtn,
    totalCho: roundedCho,
    totalLip: roundedLip,
    ptnKcal: Math.round(ptnKcal),
    choKcal: Math.round(choKcal),
    lipKcal: Math.round(lipKcal),
    ptnPercent,
    choPercent,
    lipPercent,
    kcalPercent,
    deltaFromTarget,
    maxLeucineInSingleMeal: totals.maxLeucineInSingleMeal,
    isLeucineThresholdMet: totals.maxLeucineInSingleMeal >= 2.5,
    mealsWithLeucineMet: totals.mealsWithLeucineMet
  };
}
