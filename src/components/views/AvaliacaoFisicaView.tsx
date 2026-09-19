import React, { useState } from 'react';
import { 
  Activity, 
  Scissors, 
  RotateCcw, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Calendar, 
  Lock, 
  AlertCircle, 
  CheckCircle2, 
  Maximize2,
  Camera,
  ArrowRight,
  Flame,
  Scale,
  Zap,
  Sliders,
  CheckCircle
} from 'lucide-react';
import { BodyComposition, Skinfolds, SkinfoldProtocol } from '../../types';
import { AnatomicalSkinfoldGuide } from '../assessment/AnatomicalSkinfoldGuide';
import { 
  BmrFormula, 
  CalorieGoalStrategy, 
  ACTIVITY_FACTOR_OPTIONS, 
  calculateFullMetabolicTargets 
} from '../../utils/metabolicCalculator';

interface AvaliacaoFisicaViewProps {
  composition: BodyComposition;
  patientAge?: number;
  patientGoal?: string;
  patientGender?: 'feminino' | 'masculino';
  initialTargetKcal?: number;
  initialTargetPtn?: number;
  initialTargetCho?: number;
  initialTargetLip?: number;
  onApplyCunninghamToPlan?: (
    bmr: number, 
    get: number, 
    targetKcal?: number, 
    macros?: {
      targetPtn: number;
      targetCho: number;
      targetLip: number;
      ptnPerKg: number;
      choPerKg: number;
      lipPerKg: number;
      formula: string;
      activityFactor: number;
      activityLabel: string;
    }
  ) => void;
}

export const AvaliacaoFisicaView: React.FC<AvaliacaoFisicaViewProps> = ({ 
  composition: initialComposition,
  patientAge = 21,
  patientGoal = 'Hipertrofia',
  patientGender = 'feminino',
  initialTargetKcal = 2100,
  initialTargetPtn = 140,
  initialTargetCho = 250,
  initialTargetLip = 60,
  onApplyCunninghamToPlan
}) => {
  const [protocol, setProtocol] = useState<SkinfoldProtocol>(initialComposition.skinfoldProtocol || 'jp7');
  const [weight, setWeight] = useState<number>(initialComposition.currentWeight);
  const [skinfolds, setSkinfolds] = useState<Skinfolds>(initialComposition.skinfolds);
  const [syncedNotification, setSyncedNotification] = useState<boolean>(false);

  // Recálculo determinístico das equações matemáticas
  const calculateBodyDensity = (sf: Skinfolds, prot: SkinfoldProtocol, age: number): number => {
    if (prot === 'jp7') {
      const sum = sf.triceps + sf.subscapular + sf.axillary + sf.suprailiac + sf.abdominal + sf.pectoral + sf.thigh;
      return 1.0970 - (0.00046971 * sum) + (0.00000056 * Math.pow(sum, 2)) - (0.00012828 * age);
    } else if (prot === 'jp3') {
      // JP3 Mulheres: Tríceps, Suprailíaca, Coxa
      const sum3 = sf.triceps + sf.suprailiac + sf.thigh;
      return 1.0994921 - (0.0009929 * sum3) + (0.0000023 * Math.pow(sum3, 2)) - (0.0001392 * age);
    } else {
      // Faulkner 4 dobras: TR + SE + SI + AB
      const sum4 = sf.triceps + sf.subscapular + sf.suprailiac + sf.abdominal;
      const fatPct = (sum4 * 0.153) + 5.783;
      return (4.95 / ((fatPct / 100) + 4.5)); // Aproximação reversa
    }
  };

  const currentSum7 = skinfolds.triceps + skinfolds.subscapular + skinfolds.axillary + 
                      skinfolds.suprailiac + skinfolds.abdominal + skinfolds.pectoral + skinfolds.thigh;

  const currentDensity = calculateBodyDensity(skinfolds, protocol, patientAge);
  
  // Siri equation
  const calculatedFatPercent = protocol === 'faulkner'
    ? Number((( (skinfolds.triceps + skinfolds.subscapular + skinfolds.suprailiac + skinfolds.abdominal) * 0.153) + 5.783).toFixed(1))
    : Number((((4.95 / currentDensity) - 4.5) * 100).toFixed(1));

  const calculatedFatMass = Number(((calculatedFatPercent / 100) * weight).toFixed(1));
  const calculatedLeanMass = Number((weight - calculatedFatMass).toFixed(1)); // MLG
  
  // Estados da Calculadora Metabólica Clínica (Regras Funcionais de Atendimento)
  const [selectedFormula, setSelectedFormula] = useState<BmrFormula>('cunningham');
  const [activityFactor, setActivityFactor] = useState<number>(1.55); // Moderado / Musculação 5x
  const [goalStrategy, setGoalStrategy] = useState<CalorieGoalStrategy>('hipertrofia');
  const [useFixedKcal, setUseFixedKcal] = useState<boolean>(false);
  const [fixedKcalInput, setFixedKcalInput] = useState<number>(initialTargetKcal);
  const [ptnPerKg, setPtnPerKg] = useState<number>(2.24); // 2.24 g/kg para hipertrofia
  const [lipPerKg, setLipPerKg] = useState<number>(0.96); // 0.96 g/kg
  const [adjustmentPercent, setAdjustmentPercent] = useState<number>(10);

  // Cálculo Metabólico Centralizado e Dinâmico
  const metabolicTargets = calculateFullMetabolicTargets({
    weightKg: weight,
    heightCm: initialComposition.height,
    ageYears: patientAge,
    gender: patientGender,
    leanMassKg: calculatedLeanMass,
    formula: selectedFormula,
    activityFactor,
    goal: goalStrategy,
    calorieAdjustmentPercent: adjustmentPercent,
    fixedTargetKcal: useFixedKcal ? fixedKcalInput : undefined,
    ptnPerKg,
    lipPerKg
  });

  const calculatedBmr = metabolicTargets.bmr;
  const calculatedGet = metabolicTargets.get;
  const calculatedTargetKcal = metabolicTargets.targetKcal;

  const handleUpdateSkinfold = (key: keyof Skinfolds, value: number) => {
    setSkinfolds(prev => {
      const updated = { ...prev, [key]: value };
      const newSum = updated.triceps + updated.subscapular + updated.axillary + 
                     updated.suprailiac + updated.abdominal + updated.pectoral + updated.thigh;
      return {
        ...updated,
        sum7: Number(newSum.toFixed(1))
      };
    });
  };

  const handleVoiceDictateAll = () => {
    // Simula a captura rápida por voz de todas as dobras
    setSkinfolds({
      triceps: 14.0,
      subscapular: 12.5,
      suprailiac: 16.2,
      abdominal: 18.0,
      axillary: 11.0,
      pectoral: 8.5,
      thigh: 21.0,
      sum7: 91.2,
      bodyFatPercent: 22.8
    });
  };

  const handleApplyBmr = () => {
    if (onApplyCunninghamToPlan) {
      onApplyCunninghamToPlan(
        calculatedBmr, 
        calculatedGet, 
        calculatedTargetKcal,
        {
          targetPtn: metabolicTargets.ptn.grams,
          targetCho: metabolicTargets.cho.grams,
          targetLip: metabolicTargets.lip.grams,
          ptnPerKg: metabolicTargets.ptn.gPerKg,
          choPerKg: metabolicTargets.cho.gPerKg,
          lipPerKg: metabolicTargets.lip.gPerKg,
          formula: metabolicTargets.formulaUsed,
          activityFactor: metabolicTargets.activityFactor,
          activityLabel: metabolicTargets.activityLabel
        }
      );
    }
    setSyncedNotification(true);
    setTimeout(() => setSyncedNotification(false), 4500);
  };

  return (
    <div id="avaliacao-fisica-view" className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
              RF-02 • Composição Corporal & Antropometria
            </span>
            <span className="text-xs font-semibold text-slate-500">Cunningham, Mifflin & Harris-Benedict</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-1">
            Avaliação Antropométrica & Telemetria Metabólica Clínica
          </h2>
        </div>

        {/* Botão de Sincronização da TMB */}
        <button
          type="button"
          onClick={handleApplyBmr}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>Sincronizar Cálculo Metabólico com o Plano</span>
        </button>
      </div>

      {syncedNotification && (
        <div className="bg-emerald-100 border border-emerald-300 text-emerald-950 px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              Sucesso: TMB ({calculatedBmr} kcal), GET ({calculatedGet} kcal) e VET Alvo ({calculatedTargetKcal} kcal com {metabolicTargets.ptn.grams}g PTN, {metabolicTargets.cho.grams}g CHO, {metabolicTargets.lip.grams}g LIP) sincronizados com o HUD e o Plano Alimentar!
            </span>
          </div>
          <span className="text-[10px] bg-white text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-300">
            Auditado
          </span>
        </div>
      )}

      {/* 1. Composição Corporal & Cunningham HUD */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            Composição Corporal Determinística (Recalculada em Tempo Real)
          </h3>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            Massa Livre de Gordura (MLG): {calculatedLeanMass} kg • TMB: {calculatedBmr} kcal
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {/* Peso */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4">
            <div className="text-[11px] font-semibold text-blue-900 mb-1">Peso Corporal Atual</div>
            <div className="text-2xl font-bold text-blue-950 flex items-center justify-center gap-1">
              <input 
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 60)}
                className="w-20 text-center bg-transparent outline-none font-bold text-2xl text-blue-950 focus:bg-white rounded-lg"
              />
              <span className="text-xs font-normal text-blue-800">kg</span>
            </div>
            <div className="text-[10px] text-blue-600 mt-1">Preenchido via áudio (12:02)</div>
          </div>

          {/* Estatura */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="text-[11px] font-semibold text-slate-600 mb-1">Estatura</div>
            <div className="text-2xl font-bold text-slate-900">
              {initialComposition.height} <span className="text-xs font-normal">cm</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              IMC: {(weight / Math.pow(initialComposition.height / 100, 2)).toFixed(1)} kg/m² (Eutrofia)
            </div>
          </div>

          {/* % Gordura */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="text-[11px] font-semibold text-slate-600 mb-1">% Gordura (Siri)</div>
            <div className="text-2xl font-bold text-emerald-600">
              {calculatedFatPercent}%
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Massa Gorda: {calculatedFatMass} kg</div>
          </div>

          {/* Massa Magra */}
          <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-4">
            <div className="text-[11px] font-semibold text-indigo-900 mb-1">Massa Livre de Gordura (MLG)</div>
            <div className="text-2xl font-bold text-indigo-900">
              {calculatedLeanMass} <span className="text-xs font-normal">kg</span>
            </div>
            <div className="text-[10px] text-indigo-600 mt-1">Alvo Hipertrofia: 50.5 kg (+2.7 kg)</div>
          </div>
        </div>
      </div>

      {/* 2. COCKPIT METABÓLICO CLÍNICO: Cálculo de Calorias, FAF & Distribuição de Macronutrientes */}
      <div id="calculo-calorias-cockpit" className="bg-white border-2 border-emerald-300/80 rounded-3xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900">
                Calculadora de Calorias Basais, Gasto Energético & Macronutrientes
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Cálculo com base nas regras funcionais do atendimento nutricional, diretrizes de composição corporal (MLG) e índices de atividade física.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Regras do Atendimento Ativas
            </span>
          </div>
        </div>

        {/* Grade de 3 Passos: TMB -> FAF/GET -> VET */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Passo 1: Fórmula de TMB */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">1. Equação de TMB Basal</span>
              <span className="text-sm font-extrabold text-slate-900 font-mono">{calculatedBmr} kcal</span>
            </div>

            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => setSelectedFormula('cunningham')}
                className={`w-full text-left p-2.5 rounded-xl border text-xs transition cursor-pointer ${
                  selectedFormula === 'cunningham'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>Cunningham (MLG {calculatedLeanMass}kg)</span>
                  {selectedFormula === 'cunningham' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                  500 + 22 × MLG = {Math.round(500 + 22 * calculatedLeanMass)} kcal (Padrão Ouro Atletas)
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedFormula('mifflin')}
                className={`w-full text-left p-2.5 rounded-xl border text-xs transition cursor-pointer ${
                  selectedFormula === 'mifflin'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>Mifflin-St Jeor</span>
                  {selectedFormula === 'mifflin' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                  10P + 6.25A - 5I - 161 = {Math.round(10 * weight + 6.25 * initialComposition.height - 5 * patientAge - 161)} kcal
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedFormula('harris')}
                className={`w-full text-left p-2.5 rounded-xl border text-xs transition cursor-pointer ${
                  selectedFormula === 'harris'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>Harris-Benedict Revisada</span>
                  {selectedFormula === 'harris' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                  Equação clássica de calorimetria indireta
                </div>
              </button>
            </div>
          </div>

          {/* Passo 2: Fator de Atividade Física (FAF) & GET */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">2. Atividade Física & GET</span>
              <span className="text-sm font-extrabold text-blue-900 font-mono">GET: {calculatedGet} kcal</span>
            </div>

            <div className="space-y-1 text-xs">
              <label className="text-[11px] text-slate-600 block">Nível de Treino (FAO/WHO/DRI):</label>
              <select
                value={activityFactor}
                onChange={(e) => setActivityFactor(parseFloat(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 font-medium"
              >
                {ACTIVITY_FACTOR_OPTIONS.map((opt) => (
                  <option key={opt.factor} value={opt.factor}>
                    {opt.factor} - {opt.label} ({opt.description})
                  </option>
                ))}
              </select>
            </div>

            <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-xl text-[11px] text-blue-950 space-y-1">
              <div className="font-bold flex items-center justify-between">
                <span>GET = TMB × FAF</span>
                <span className="font-mono">{calculatedBmr} × {activityFactor}</span>
              </div>
              <p className="text-blue-800 text-[10px]">
                Conforme Anamnese: Paciente realiza musculação de alta intensidade 5x por semana (FAF 1.55 calibrado).
              </p>
            </div>
          </div>

          {/* Passo 3: Alvo Calórico Prescrito (VET) */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">3. VET Prescrito (Meta)</span>
              <span className="text-sm font-extrabold text-emerald-700 font-mono">{calculatedTargetKcal} kcal</span>
            </div>

            <div className="space-y-1 text-xs">
              <label className="text-[11px] text-slate-600 block">Estratégia do Plano:</label>
              <div className="grid grid-cols-3 gap-1">
                <button
                  type="button"
                  onClick={() => { setGoalStrategy('hipertrofia'); setUseFixedKcal(false); }}
                  className={`py-1.5 px-2 rounded-lg text-center text-[10px] font-bold border transition cursor-pointer ${
                    goalStrategy === 'hipertrofia' && !useFixedKcal
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Hipertrofia
                </button>
                <button
                  type="button"
                  onClick={() => { setGoalStrategy('manutencao'); setUseFixedKcal(false); }}
                  className={`py-1.5 px-2 rounded-lg text-center text-[10px] font-bold border transition cursor-pointer ${
                    goalStrategy === 'manutencao' && !useFixedKcal
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Manutenção
                </button>
                <button
                  type="button"
                  onClick={() => { setGoalStrategy('emagrecimento'); setUseFixedKcal(false); }}
                  className={`py-1.5 px-2 rounded-lg text-center text-[10px] font-bold border transition cursor-pointer ${
                    goalStrategy === 'emagrecimento' && !useFixedKcal
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Déficit
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
              <label className="text-[11px] text-slate-600 font-medium flex items-center gap-1">
                <input 
                  type="checkbox"
                  checked={useFixedKcal}
                  onChange={(e) => setUseFixedKcal(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                Calorias fixas:
              </label>
              <div className="flex items-center gap-1">
                <input 
                  type="number"
                  disabled={!useFixedKcal}
                  value={useFixedKcal ? fixedKcalInput : calculatedTargetKcal}
                  onChange={(e) => setFixedKcalInput(parseInt(e.target.value) || 2100)}
                  className={`w-20 px-2 py-1 text-right text-xs font-bold rounded-lg border ${
                    useFixedKcal 
                      ? 'bg-white border-emerald-400 text-slate-900' 
                      : 'bg-slate-100 border-slate-200 text-slate-500'
                  }`}
                />
                <span className="text-[10px] text-slate-500">kcal</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 flex justify-between">
              <span>Balanço vs GET:</span>
              <span className={`font-semibold ${calculatedTargetKcal >= calculatedGet ? 'text-emerald-700' : 'text-amber-700'}`}>
                {calculatedTargetKcal >= calculatedGet ? `+${calculatedTargetKcal - calculatedGet} kcal` : `${calculatedTargetKcal - calculatedGet} kcal`}
              </span>
            </div>
          </div>

        </div>

        {/* 4. Distribuição de Macronutrientes (g/kg & Proporção Calórica) */}
        <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Distribuição de Macronutrientes Prescritos (ISSN / SBAN)
              </span>
              <p className="text-[11px] text-slate-500">
                Calculado com base no peso corporal ({weight} kg) e VET alvo ({calculatedTargetKcal} kcal).
              </p>
            </div>
            
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                PTN: {metabolicTargets.ptn.grams}g ({metabolicTargets.ptn.percent}%)
              </span>
              <span className="text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                CHO: {metabolicTargets.cho.grams}g ({metabolicTargets.cho.percent}%)
              </span>
              <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                LIP: {metabolicTargets.lip.grams}g ({metabolicTargets.lip.percent}%)
              </span>
            </div>
          </div>

          {/* 3 Controles de g/kg */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Proteínas */}
            <div className="p-3 bg-white border border-emerald-200 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-emerald-900">Proteínas (PTN)</span>
                <span className="text-emerald-700 font-bold font-mono">{metabolicTargets.ptn.grams}g ({metabolicTargets.ptn.kcal} kcal)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">Meta g/kg:</span>
                <div className="flex items-center gap-1">
                  <input 
                    type="number"
                    step="0.05"
                    min="1.0"
                    max="3.5"
                    value={ptnPerKg}
                    onChange={(e) => setPtnPerKg(parseFloat(e.target.value) || 2.2)}
                    className="w-16 px-2 py-0.5 text-center text-xs font-bold rounded border border-emerald-300 text-emerald-950"
                  />
                  <span className="text-[10px] text-slate-500">g/kg</span>
                </div>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${metabolicTargets.ptn.percent}%` }} />
              </div>
              <span className="text-[10px] text-emerald-800 block">Síntese proteica & Leucina mTORC1</span>
            </div>

            {/* Lipídios */}
            <div className="p-3 bg-white border border-amber-200 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-amber-900">Lipídios (LIP)</span>
                <span className="text-amber-700 font-bold font-mono">{metabolicTargets.lip.grams}g ({metabolicTargets.lip.kcal} kcal)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">Meta g/kg:</span>
                <div className="flex items-center gap-1">
                  <input 
                    type="number"
                    step="0.05"
                    min="0.5"
                    max="2.0"
                    value={lipPerKg}
                    onChange={(e) => setLipPerKg(parseFloat(e.target.value) || 0.9)}
                    className="w-16 px-2 py-0.5 text-center text-xs font-bold rounded border border-amber-300 text-amber-950"
                  />
                  <span className="text-[10px] text-slate-500">g/kg</span>
                </div>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${metabolicTargets.lip.percent}%` }} />
              </div>
              <span className="text-[10px] text-amber-800 block">Aporte hormonal & Ácidos graxos</span>
            </div>

            {/* Carboidratos */}
            <div className="p-3 bg-white border border-blue-200 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-blue-900">Carboidratos (CHO)</span>
                <span className="text-blue-700 font-bold font-mono">{metabolicTargets.cho.grams}g ({metabolicTargets.cho.kcal} kcal)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">g/kg restante:</span>
                <span className="text-xs font-bold text-blue-950 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {metabolicTargets.cho.gPerKg} g/kg
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${metabolicTargets.cho.percent}%` }} />
              </div>
              <span className="text-[10px] text-blue-800 block">Via glicolítica peri-treino</span>
            </div>

          </div>

          {/* Gráfico Superior de Distribuição Calórica (Barra Empilhada) */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between items-center text-xs font-medium text-slate-600">
              <span className="font-bold text-slate-700">Gráfico de Proporção Energética Prescrita (% do VET):</span>
              <span className="font-mono text-[11px] text-slate-500">Total: 100% ({calculatedTargetKcal} kcal)</span>
            </div>
            
            <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
              <div 
                className="bg-emerald-600 h-full transition-all duration-300 flex items-center justify-center text-[10px] font-bold text-white"
                style={{ width: `${metabolicTargets.ptn.percent}%` }}
                title={`Proteínas: ${metabolicTargets.ptn.percent}% (${metabolicTargets.ptn.kcal} kcal)`}
              >
                {metabolicTargets.ptn.percent > 12 && `${metabolicTargets.ptn.percent}%`}
              </div>
              <div 
                className="bg-blue-600 h-full transition-all duration-300 flex items-center justify-center text-[10px] font-bold text-white"
                style={{ width: `${metabolicTargets.cho.percent}%` }}
                title={`Carboidratos: ${metabolicTargets.cho.percent}% (${metabolicTargets.cho.kcal} kcal)`}
              >
                {metabolicTargets.cho.percent > 12 && `${metabolicTargets.cho.percent}%`}
              </div>
              <div 
                className="bg-amber-500 h-full transition-all duration-300 flex items-center justify-center text-[10px] font-bold text-white"
                style={{ width: `${metabolicTargets.lip.percent}%` }}
                title={`Lipídios: ${metabolicTargets.lip.percent}% (${metabolicTargets.lip.kcal} kcal)`}
              >
                {metabolicTargets.lip.percent > 12 && `${metabolicTargets.lip.percent}%`}
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  PTN: {metabolicTargets.ptn.percent}% ({metabolicTargets.ptn.grams}g)
                </span>
                <span className="flex items-center gap-1 text-blue-800">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  CHO: {metabolicTargets.cho.percent}% ({metabolicTargets.cho.grams}g)
                </span>
                <span className="flex items-center gap-1 text-amber-800">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  LIP: {metabolicTargets.lip.percent}% ({metabolicTargets.lip.grams}g)
                </span>
              </div>

              {/* Botão de Aplicação Direta */}
              <button
                type="button"
                onClick={handleApplyBmr}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Aplicar Regras ao Atendimento</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* 2. Guia Anatômico Visual & Plicômetro Clínico (RF-02) */}
      <AnatomicalSkinfoldGuide 
        skinfolds={skinfolds}
        protocol={protocol}
        onChangeProtocol={setProtocol}
        onUpdateSkinfold={handleUpdateSkinfold}
        onVoiceDictateAll={handleVoiceDictateAll}
      />

      {/* 3. Circunferências Corporais (Fita Métrica) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Circunferências Corporais (Fita Métrica Antropométrica)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 border border-slate-200 rounded-2xl bg-slate-50">
            <span className="text-slate-500 block mb-1 font-semibold">Cintura</span>
            <span className="text-lg font-bold text-slate-900">{initialComposition.circumferences.waist} cm</span>
            <span className="text-[10px] text-emerald-600 block mt-0.5 font-bold">Relação C/Q: 0.71 (Baixo Risco)</span>
          </div>
          <div className="p-3.5 border border-slate-200 rounded-2xl bg-slate-50">
            <span className="text-slate-500 block mb-1 font-semibold">Quadril</span>
            <span className="text-lg font-bold text-slate-900">{initialComposition.circumferences.hip} cm</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Biotipo Ginoide</span>
          </div>
          <div className="p-3.5 border border-slate-200 rounded-2xl bg-slate-50">
            <span className="text-slate-500 block mb-1 font-semibold">Braço Relaxado</span>
            <span className="text-lg font-bold text-slate-900">{initialComposition.circumferences.relaxedArm} cm</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Contraído: {initialComposition.circumferences.contractedArm} cm</span>
          </div>
          <div className="p-3.5 border border-slate-200 rounded-2xl bg-slate-50">
            <span className="text-slate-500 block mb-1 font-semibold">Coxa Medial</span>
            <span className="text-lg font-bold text-slate-900">{initialComposition.circumferences.thigh} cm</span>
            <span className="text-[10px] text-emerald-600 block mt-0.5">Simetria D/E 100%</span>
          </div>
        </div>
      </div>

      {/* 4. Série Histórica Longitudinal de Bioimpedância (RF-02) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Série Histórica Longitudinal de Composição Corporal (Últimos 90 Dias)
            </h3>
            <p className="text-xs text-slate-500">
              Trajetória de ganho de massa livre de gordura (MLG) com estabilização de massa gorda.
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
            Evolução: +2.6 kg MLG
          </span>
        </div>

        <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] uppercase font-semibold text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Data do Exame</th>
                <th className="py-2.5 px-4 text-center">Peso Total</th>
                <th className="py-2.5 px-4 text-center">Massa Magra (MLG)</th>
                <th className="py-2.5 px-4 text-center">Massa Gorda</th>
                <th className="py-2.5 px-4 text-center">% Gordura</th>
                <th className="py-2.5 px-4 text-center">Água Corporal (ACT)</th>
                <th className="py-2.5 px-4">Evolução Clínica</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(initialComposition.historicalRecords || []).map((rec, idx) => (
                <tr key={rec.date} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {rec.date}
                  </td>
                  <td className="py-3 px-4 text-center font-semibold text-slate-900">{rec.weight} kg</td>
                  <td className="py-3 px-4 text-center font-bold text-indigo-700">{rec.leanMassKg} kg</td>
                  <td className="py-3 px-4 text-center text-slate-600">{rec.fatMassKg} kg</td>
                  <td className="py-3 px-4 text-center font-semibold text-emerald-700">{rec.bodyFatPercent}%</td>
                  <td className="py-3 px-4 text-center text-slate-600">{rec.bodyWaterPercent}%</td>
                  <td className="py-3 px-4">
                    {idx === 0 && <span className="text-slate-500">Marco Zero (Início do Acompanhamento)</span>}
                    {idx === 1 && <span className="text-indigo-600 font-semibold">+1.3 kg MLG • Adaptação Neural</span>}
                    {idx === 2 && <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">+1.3 kg MLG • Resposta Hipertrófica Ativa</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Galeria Fotográfica Postural em 3 Eixos & Conformidade CFN nº 856/2026 */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Camera className="w-4 h-4 text-blue-600" />
              Registro Fotográfico Postural Padronizado (3 Eixos)
            </h3>
            <p className="text-xs text-slate-500">
              Imagens capturadas em plano ortogonal para análise simétrica e biomecânica.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Criptografia AES-256 no Repositório</span>
          </div>
        </div>

        {/* 3 Fotos Eixo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50">
            <div className="px-3 py-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">1. Eixo Anterior</span>
              <span className="text-[10px] text-slate-500">15/09/2026</span>
            </div>
            <div className="h-44 bg-slate-900 flex items-center justify-center relative group overflow-hidden">
              <img 
                src={initialComposition.posturalPhotos.anteriorUrl} 
                alt="Registro Anterior" 
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <span className="text-xs text-white font-semibold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" /> AES-256 Protegido
                </span>
              </div>
            </div>
            <div className="p-2.5 text-[11px] text-slate-600 text-center font-medium">
              Alinhamento escapular e simetria abdominal preservados.
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50">
            <div className="px-3 py-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">2. Eixo Lateral (Direito)</span>
              <span className="text-[10px] text-slate-500">15/09/2026</span>
            </div>
            <div className="h-44 bg-slate-900 flex items-center justify-center relative group overflow-hidden">
              <img 
                src={initialComposition.posturalPhotos.lateralUrl} 
                alt="Registro Lateral" 
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <span className="text-xs text-white font-semibold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" /> AES-256 Protegido
                </span>
              </div>
            </div>
            <div className="p-2.5 text-[11px] text-slate-600 text-center font-medium">
              Curvatura lombar fisiológica, sem hiperlordose aparente.
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50">
            <div className="px-3 py-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">3. Eixo Posterior</span>
              <span className="text-[10px] text-slate-500">15/09/2026</span>
            </div>
            <div className="h-44 bg-slate-900 flex items-center justify-center relative group overflow-hidden">
              <img 
                src={initialComposition.posturalPhotos.posteriorUrl} 
                alt="Registro Posterior" 
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <span className="text-xs text-white font-semibold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" /> AES-256 Protegido
                </span>
              </div>
            </div>
            <div className="p-2.5 text-[11px] text-slate-600 text-center font-medium">
              Densidade muscular dorsal e trapézio superior com tônus elevado.
            </div>
          </div>
        </div>

        {/* Selo Normativo Obrigatório CFN nº 856/2026 */}
        <div className="bg-amber-50 border-2 border-amber-300/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-950">
          <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-amber-900 block text-xs uppercase tracking-wide">
              Cláusula Deontológica de Conformidade • CFN nº 856/2026 (Artigos 38 e 69)
            </span>
            <p className="leading-relaxed text-amber-900/90">
              Em estrito cumprimento às normas éticas do Conselho Federal de Nutricionistas, 
              <strong> é terminantemente vedada a geração, manipulação algorítmica ou projeção sintética de imagens de "antes e depois"</strong>. 
              As fotos acima destinam-se exclusivamente ao prontuário médico-nutricional confidencial para acompanhamento clínico presencial, com criptografia AES-256 e sem compartilhamento público.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
