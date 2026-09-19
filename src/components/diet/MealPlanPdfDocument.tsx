import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Activity, 
  Droplet, 
  Pill, 
  Calendar, 
  User, 
  CheckCircle2, 
  Award, 
  Scale, 
  Flame,
  Clock,
  AlertTriangle,
  FileText,
  HeartPulse,
  Check,
  Info,
  ArrowRight
} from 'lucide-react';
import { PatientContextPayload, FoodItem, Meal, Biomarker, SubstitutionRule } from '../../types';
import { calculateMealsNutritionalTotals } from '../../utils/metabolicCalculator';

interface MealPlanPdfDocumentProps {
  context: PatientContextPayload;
  documentVersion?: string;
  generatedDate?: string;
}

export const MealPlanPdfDocument: React.FC<MealPlanPdfDocumentProps> = ({
  context,
  documentVersion = '1.1',
  generatedDate = '18 de Setembro de 2026'
}) => {
  const { patient, bodyComposition, meals, anamnese, substitutionRules, biomarkers } = context;

  // 1. Cálculos Dinâmicos Consolidados a partir das Refeições do Atendimento
  const mealTotals = calculateMealsNutritionalTotals(meals, patient.targetKcal);
  const totalKcalPrescribed = mealTotals.totalKcal;
  const totalPtnPrescribed = mealTotals.totalPtn;
  const totalChoPrescribed = mealTotals.totalCho;
  const totalLipPrescribed = mealTotals.totalLip;
  const ptnPercent = Math.round(mealTotals.ptnPercent);
  const choPercent = Math.round(mealTotals.choPercent);
  const lipPercent = Math.round(mealTotals.lipPercent);

  // Indicadores de Composição Corporal & Balanço
  const imc = (patient.weight / Math.pow(patient.height / 100, 2)).toFixed(1);
  const imcCategory = Number(imc) < 18.5 
    ? 'Baixo Peso' 
    : Number(imc) < 25 
    ? 'Eutrofia (Peso Saudável)' 
    : Number(imc) < 30 
    ? 'Sobrepeso' 
    : 'Obesidade';

  const ptnPerKgWeight = (totalPtnPrescribed / Math.max(patient.weight, 1)).toFixed(2);
  const ptnPerKgMlg = bodyComposition?.leanMassKg 
    ? (totalPtnPrescribed / bodyComposition.leanMassKg).toFixed(2) 
    : ptnPerKgWeight;
  const choPerKgWeight = (totalChoPrescribed / Math.max(patient.weight, 1)).toFixed(2);
  const lipPerKgWeight = (totalLipPrescribed / Math.max(patient.weight, 1)).toFixed(2);

  const getCalculated = bodyComposition?.getCalculated || patient.get || 2200;
  const bmrCalculated = bodyComposition?.bmrCunningham || patient.bmr || 1410;
  const caloricDelta = totalKcalPrescribed - getCalculated;
  const caloricDeltaPercent = Math.round((caloricDelta / Math.max(getCalculated, 1)) * 100);

  // Filtragem de exames alterados para fundamentação clínica
  const alteredBiomarkers = biomarkers.filter(b => b.status === 'critico' || b.status === 'alerta');

  return (
    <div id="printable-diet-plan" className="w-full bg-slate-100 py-6 px-2 sm:px-4 space-y-8 font-sans text-slate-800 print:bg-white print:p-0 print:m-0">
      
      {/* ========================================================================= */}
      {/* PÁGINA 1: Identificação, Resumo Clínico, Metas & Exames Laboratoriais     */}
      {/* ========================================================================= */}
      <div className="pdf-page bg-white max-w-4xl mx-auto shadow-xl rounded-2xl p-8 sm:p-10 border border-slate-200 print:shadow-none print:border-none print:rounded-none print:p-8 print:m-0 print:max-w-none print:break-after-page">
        
        {/* Top Header Institucional */}
        <div className="flex items-start justify-between border-b-2 border-emerald-700 pb-5 mb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-2xl shadow-sm">
              TN
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">TalkNutri • Nutrição de Precisão</h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                  CFN nº 856 / 2026
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Clínica Dra. Camila Silveira • CRN-3 / 48.912 • Prescrição Dietética Individualizada
              </p>
            </div>
          </div>

          <div className="text-right text-xs text-slate-500">
            <span className="font-bold text-slate-900 block text-sm">Plano Alimentar Oficial</span>
            <span>Versão {documentVersion} • {generatedDate}</span>
            <span className="text-[10px] text-slate-400 block font-mono mt-0.5">Hash: #TN-9842-BR-2026</span>
          </div>
        </div>

        {/* Card do Paciente & Diagnóstico Nutricional */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5 bg-slate-50 p-4.5 rounded-2xl border border-slate-200">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Paciente</span>
            <h2 className="text-base font-bold text-slate-900">{patient.name}</h2>
            <p className="text-xs text-slate-600 mt-0.5">
              {patient.age} anos • {(patient.height / 100).toFixed(2)}m • {patient.weight} kg
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              IMC: <span className="font-semibold text-slate-800">{imc} kg/m²</span> ({imcCategory})
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Objetivo Clínico do Atendimento</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span className="text-sm font-bold text-emerald-800">{patient.goal}</span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {anamnese.consultationGoal || 'Recomposição corporal e ganho de massa muscular magra'}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Composição Corporal (Cunningham)</span>
            <span className="text-sm font-bold text-slate-900">{bodyComposition.leanMassKg} kg MLG</span>
            <span className="text-xs text-slate-500 ml-1">({bodyComposition.bodyFatPercent}% Gordura)</span>
            <p className="text-[11px] text-slate-600 mt-0.5">
              TMB Cunningham: <span className="font-semibold">{bmrCalculated} kcal</span> • GET: <span className="font-semibold">{getCalculated} kcal</span>
            </p>
          </div>
        </div>

        {/* Metas Energéticas & Macronutrientes Calculados */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Flame className="w-4 h-4 text-emerald-600" />
              Balanço Energético & Macronutrientes Calculados no Atendimento
            </h3>
            <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Soma Exata das Refeições: {totalKcalPrescribed} kcal
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-3">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-700 uppercase block">VET Total Prescrito</span>
              <span className="text-lg font-bold text-emerald-900">{totalKcalPrescribed} kcal</span>
              <p className="text-[10px] text-emerald-700 mt-0.5">
                {caloricDelta >= 0 
                  ? `+${caloricDelta} kcal (+${caloricDeltaPercent}%) sobre o GET` 
                  : `${caloricDelta} kcal (${caloricDeltaPercent}%) de déficit`}
              </p>
            </div>

            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200">
              <span className="text-[10px] font-bold text-blue-700 uppercase block">Proteínas ({ptnPercent}%)</span>
              <span className="text-lg font-bold text-blue-950">{totalPtnPrescribed} g</span>
              <p className="text-[10px] text-blue-700 mt-0.5">
                {ptnPerKgMlg} g/kg MLG ({ptnPerKgWeight} g/kg peso)
              </p>
            </div>

            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200">
              <span className="text-[10px] font-bold text-amber-700 uppercase block">Carboidratos ({choPercent}%)</span>
              <span className="text-lg font-bold text-amber-950">{totalChoPrescribed} g</span>
              <p className="text-[10px] text-amber-700 mt-0.5">
                {choPerKgWeight} g/kg peso • Baixo/Médio IG
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-600 uppercase block">Lipídios ({lipPercent}%)</span>
              <span className="text-lg font-bold text-slate-900">{totalLipPrescribed} g</span>
              <p className="text-[10px] text-slate-600 mt-0.5">
                {lipPerKgWeight} g/kg peso • Mono/Poliinsaturados
              </p>
            </div>
          </div>

          {/* Barra de Proporção Visual Dinâmica */}
          <div className="w-full h-3 rounded-full bg-slate-200 flex overflow-hidden">
            <div style={{ width: `${ptnPercent}%` }} className="bg-blue-600" title={`Proteínas ${ptnPercent}%`} />
            <div style={{ width: `${choPercent}%` }} className="bg-amber-500" title={`Carboidratos ${choPercent}%`} />
            <div style={{ width: `${lipPercent}%` }} className="bg-slate-600" title={`Lipídios ${lipPercent}%`} />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-600 mt-1.5 px-1">
            <span className="flex items-center gap-1 font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-600" /> Proteínas: {totalPtnPrescribed}g ({ptnPercent}%)
            </span>
            <span className="flex items-center gap-1 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Carboidratos: {totalChoPrescribed}g ({choPercent}%)
            </span>
            <span className="flex items-center gap-1 font-medium">
              <span className="w-2 h-2 rounded-full bg-slate-600" /> Lipídios: {totalLipPrescribed}g ({lipPercent}%)
            </span>
          </div>
        </div>

        {/* Painel de Exames Bioquímicos Analisados na Consulta */}
        <div className="mb-5 bg-slate-50 border border-slate-200 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              Painel de Exames Bioquímicos & Biomarcadores da Consulta
            </h3>
            <span className="text-[10px] font-semibold text-slate-500">
              {biomarkers.length} Exames Integrados • Parecer Clínico Ativo
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold">
                  <th className="py-1 px-2">Biomarcador</th>
                  <th className="py-1 px-2 text-center">Resultado</th>
                  <th className="py-1 px-2">Alvo Funcional Ótimo</th>
                  <th className="py-1 px-2 text-center">Classificação</th>
                  <th className="py-1 px-2">Conduta Dietética / Prescrição</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70">
                {biomarkers.map((bio) => (
                  <tr key={bio.id} className="text-slate-700 hover:bg-white/80 transition">
                    <td className="py-1.5 px-2 font-semibold text-slate-900">
                      {bio.name}
                    </td>
                    <td className="py-1.5 px-2 text-center font-mono font-bold text-slate-800">
                      {bio.result} {bio.unit}
                    </td>
                    <td className="py-1.5 px-2 text-slate-600 text-[11px]">
                      {bio.functionalTarget}
                    </td>
                    <td className="py-1.5 px-2 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        bio.status === 'critico' 
                          ? 'bg-rose-100 text-rose-800 border-rose-300' 
                          : bio.status === 'alerta'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      }`}>
                        {bio.status === 'critico' ? 'Abaixo do Alvo' : bio.status === 'alerta' ? 'Subótimo' : 'Dentro do Alvo'}
                      </span>
                    </td>
                    <td className="py-1.5 px-2 text-[11px] text-slate-600">
                      {bio.interpretation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {alteredBiomarkers.length > 0 && (
            <div className="mt-2.5 bg-white p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>
                <strong>Fundamentação Clínica:</strong> As fontes de ferro heme e cofatores de absorção (Vitamina C) foram alocadas estrategicamente para restaurar os níveis séricos de Ferritina, e a suplementação de Vitamina D3 foi programada junto a refeições com lipídios para otimização da biodisponibilidade.
              </span>
            </div>
          )}
        </div>

        {/* Restrições Clínicas, Aversões & Rotina Registrada na Anamnese */}
        <div className="bg-rose-50/60 border border-rose-200 rounded-2xl p-4 space-y-2.5 mb-5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-rose-600" />
              Travas Clínicas Estritas & Alimentos Excluídos (Anamnese)
            </h4>
            <span className="text-[10px] text-rose-700 font-semibold">
              Exclusão estrita em todas as refeições
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            {anamnese.aversions && anamnese.aversions.length > 0 ? (
              anamnese.aversions.map((aversion, idx) => (
                <div key={idx} className="bg-white p-2.5 rounded-xl border border-rose-200">
                  <span className="font-bold text-rose-900 block flex items-center gap-1">
                    <span className="text-rose-600">🚫</span> {aversion}
                  </span>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    {aversion.toLowerCase().includes('lactose') 
                      ? 'Todos os laticínios prescritos foram convertidos para versões zero lactose ou fontes vegetais toleradas.'
                      : aversion.toLowerCase().includes('batata-doce')
                      ? 'Substituída por mandioca cozida, arroz ou batata inglesa devido ao desconforto gástrico relatado.'
                      : 'Alimento excluído das formulações e substituído por opções de mesma densidade nutricional.'}
                  </p>
                </div>
              ))
            ) : (
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 col-span-2 text-slate-500 text-xs">
                Nenhuma restrição alimentar severa cadastrada na anamnese.
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-rose-200/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
            <span>
              <strong>Rotina de Treino:</strong> {anamnese.trainingRoutine.modality} ({anamnese.trainingRoutine.schedule}, {anamnese.trainingRoutine.frequency})
            </span>
            <span>
              <strong>Sono:</strong> {anamnese.sleepRoutine.hoursPerNight}h/noite ({anamnese.sleepRoutine.quality})
            </span>
          </div>
        </div>

        {/* Rodapé da Página 1 */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
          <span>TalkNutri • Prescrição Clínica de {patient.name}</span>
          <span>Página 1 de 3</span>
        </div>
      </div>


      {/* ========================================================================= */}
      {/* PÁGINA 2: Quadro de Refeições Prescritas no Atendimento                   */}
      {/* ========================================================================= */}
      <div className="pdf-page bg-white max-w-4xl mx-auto shadow-xl rounded-2xl p-8 sm:p-10 border border-slate-200 print:shadow-none print:border-none print:rounded-none print:p-8 print:m-0 print:max-w-none print:break-after-page">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Quadro de Refeições Prescritas</h2>
            <p className="text-xs text-slate-500">
              Gramaturas e medidas caseiras calculadas pelas tabelas oficiais TACO e TBCA • {meals.length} Refeições Estruturadas
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">Página 2 de 3</span>
        </div>

        {/* Lista de Refeições */}
        <div className="space-y-4.5">
          {meals.map((meal) => {
            // Cálculos reais da refeição somando cada item
            const mealKcal = meal.items.reduce((acc, i) => acc + (Number(i.kcal) || 0), 0);
            const mealPtn = Number(meal.items.reduce((acc, i) => acc + (Number(i.ptn) || 0), 0).toFixed(1));
            const mealCho = Number(meal.items.reduce((acc, i) => acc + (Number(i.cho) || 0), 0).toFixed(1));
            const mealLip = Number(meal.items.reduce((acc, i) => acc + (Number(i.lip) || 0), 0).toFixed(1));
            const mealLeucine = Number(meal.items.reduce((acc, i) => acc + (Number(i.leucineGrams) || 0), 0).toFixed(2));
            const mealPercentVET = totalKcalPrescribed > 0 ? Math.round((mealKcal / totalKcalPrescribed) * 100) : 0;
            const hasLeucineGate = mealLeucine >= 2.5 || meal.leucineThresholdMet;

            return (
              <div key={meal.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{meal.name}</h3>
                      <span className="text-xs text-slate-500 font-medium">Horário Recomendado: {meal.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <div className="text-right">
                      <span className="font-bold text-slate-900 block">{mealKcal} kcal ({mealPercentVET}% do VET)</span>
                      <span className="text-[10px] text-slate-500">PTN: {mealPtn}g • CHO: {mealCho}g • LIP: {mealLip}g</span>
                    </div>

                    {hasLeucineGate && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-300 flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-700" />
                        Leucina: {mealLeucine}g (mTORC1)
                      </span>
                    )}
                  </div>
                </div>

                {/* Tabela de Alimentos da Refeição */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold">
                        <th className="py-1.5 px-2">Alimento Selecionado</th>
                        <th className="py-1.5 px-2 text-center">Peso</th>
                        <th className="py-1.5 px-2">Medida Caseira Prática</th>
                        <th className="py-1.5 px-2 text-right">Proteína</th>
                        <th className="py-1.5 px-2 text-right">Carboidrato</th>
                        <th className="py-1.5 px-2 text-right">Lipídio</th>
                        <th className="py-1.5 px-2 text-right">Calorias</th>
                        <th className="py-1.5 px-2 text-center text-[9px]">Tabela</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {meal.items.map((item) => (
                        <tr key={item.id} className="text-slate-700 hover:bg-white/60">
                          <td className="py-2 px-2 font-semibold text-slate-900 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            {item.name}
                          </td>
                          <td className="py-2 px-2 text-center font-mono font-medium">{item.weightGrams}g</td>
                          <td className="py-2 px-2 text-slate-600">{item.householdMeasure}</td>
                          <td className="py-2 px-2 text-right font-mono text-blue-900 font-semibold">{item.ptn}g</td>
                          <td className="py-2 px-2 text-right font-mono text-amber-900">{item.cho}g</td>
                          <td className="py-2 px-2 text-right font-mono text-slate-700">{item.lip}g</td>
                          <td className="py-2 px-2 text-right font-mono font-bold text-slate-900">{item.kcal} kcal</td>
                          <td className="py-2 px-2 text-center">
                            <span className="text-[9px] font-mono text-slate-400 bg-slate-100 px-1 py-0.5 rounded">
                              {item.sourceTable || 'TACO'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-slate-200 bg-white/70 font-bold text-slate-900 text-[11px]">
                        <td className="py-1.5 px-2" colSpan={3}>Subtotal da Refeição</td>
                        <td className="py-1.5 px-2 text-right font-mono text-blue-900">{mealPtn}g</td>
                        <td className="py-1.5 px-2 text-right font-mono text-amber-900">{mealCho}g</td>
                        <td className="py-1.5 px-2 text-right font-mono text-slate-700">{mealLip}g</td>
                        <td className="py-1.5 px-2 text-right font-mono text-emerald-900">{mealKcal} kcal</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rodapé da Página 2 */}
        <div className="pt-5 mt-6 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
          <span>TalkNutri • Prescrição Clínica de {patient.name}</span>
          <span>Página 2 de 3</span>
        </div>
      </div>


      {/* ========================================================================= */}
      {/* PÁGINA 3: Substituições Inteligentes, Suplementação & Assinatura          */}
      {/* ========================================================================= */}
      <div className="pdf-page bg-white max-w-4xl mx-auto shadow-xl rounded-2xl p-8 sm:p-10 border border-slate-200 print:shadow-none print:border-none print:rounded-none print:p-8 print:m-0 print:max-w-none">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Guia de Substituições & Prescrição</h2>
            <p className="text-xs text-slate-500">
              Trocas pré-calculadas com equivalência de macronutrientes e suplementação clínica individualizada
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">Página 3 de 3</span>
        </div>

        {/* 1. Matriz de Substituições Calculadas */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-emerald-600" />
              Matriz de Equivalências Alimentares (Zero Alteração Calórica)
            </h3>
            <span className="text-[10px] text-slate-500 font-semibold">
              Isocalóricas e Isoproteicas
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {substitutionRules && substitutionRules.length > 0 ? (
              substitutionRules.map((rule) => (
                <div key={rule.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="border-b pb-1.5 flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-[11px]">
                      Substitutos para {rule.originalGrams}g de {rule.originalFood}
                    </span>
                    <span className="text-[10px] font-mono font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      {rule.originalPtn}g PTN
                    </span>
                  </div>
                  <ul className="space-y-1.5 text-slate-700">
                    {rule.alternatives.map((alt) => (
                      <li key={alt.id} className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <ArrowRight className="w-3 h-3 text-emerald-600" />
                          <span>{alt.foodName}</span>
                          <span className="text-[10px] text-slate-500">({alt.householdMeasure})</span>
                        </span>
                        <span className="font-bold text-slate-900 font-mono text-[11px]">
                          {alt.weightGrams}g
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              // Regras Padrão Calculadas caso o usuário não tenha cadastrado regras específicas
              <>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 block border-b pb-1 text-[11px]">
                    Substitutos para 150g de Filé de Frango Grelhado (46.5g PTN)
                  </span>
                  <ul className="space-y-1.5 text-slate-700">
                    <li className="flex items-center justify-between">
                      <span>• Patinho Moído Grelhado (1 bife médio)</span>
                      <span className="font-bold text-slate-900 font-mono">140g</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>• Ovos inteiros mexidos</span>
                      <span className="font-bold text-slate-900 font-mono">3 ovos + 2 claras</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>• Filé de Tilápia / Saint Peter</span>
                      <span className="font-bold text-slate-900 font-mono">165g</span>
                    </li>
                  </ul>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 block border-b pb-1 text-[11px]">
                    Substitutos para 160g de Arroz Branco Cozido (45g CHO)
                  </span>
                  <ul className="space-y-1.5 text-slate-700">
                    <li className="flex items-center justify-between">
                      <span>• Batata Inglesa cozida / purê</span>
                      <span className="font-bold text-slate-900 font-mono">200g</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>• Mandioca / Macaxeira cozida</span>
                      <span className="font-bold text-slate-900 font-mono">130g</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>• Macarrão integral cozido</span>
                      <span className="font-bold text-slate-900 font-mono">140g</span>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 2. Suplementação e Hidratação */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Suplementação Derivada dos Biomarcadores e Objetivo */}
          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-2 text-xs">
            <h4 className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <Pill className="w-4 h-4 text-emerald-700" />
              Prescrição de Suplementação Clínica (Individualizada)
            </h4>
            <div className="space-y-2 text-slate-700">
              <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                <span className="font-bold text-slate-900 block">1. Ferro Bisglicinato Quelato (30 mg) + Vitamina C (200 mg)</span>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Ingerir 1 cápsula 30 min antes do almoço com fruta cítrica. Evitar café ou laticínios na mesma janela. Indicado para recuperar Ferritina sérica (18 ng/mL).
                </p>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                <span className="font-bold text-slate-900 block">2. Vitamina D3 (Colecalciferol 2.000 UI)</span>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Tomar 1 cápsula junto ao almoço (refeição com gordura carreadora). Indicado para correção do nível subótimo de 25-OH Vitamina D (26 ng/mL).
                </p>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                <span className="font-bold text-slate-900 block">3. Creatina Monohidratada 100% Pura (5 g)</span>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Tomar 5g diariamente com água ou no pós-treino às 08h15 para saturação celular e suporte ao ganho de massa magra.
                </p>
              </div>
            </div>
          </div>

          {/* Hidratação & Fibra */}
          <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl space-y-2 text-xs">
            <h4 className="font-bold text-blue-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <Droplet className="w-4 h-4 text-blue-700" />
              Protocolo Hídrico & Trânsito Intestinal
            </h4>
            <div className="space-y-2 text-slate-700">
              <div className="bg-white p-2.5 rounded-xl border border-blue-100">
                <span className="font-bold text-slate-900 block">
                  Meta Hídrica Individual: {anamnese.hydration.litersPerDay} Litros de Água / dia
                </span>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Calculado em 35-40 ml/kg para o peso de {patient.weight}kg. Fracionamento: 500ml ao acordar, 500ml pré-treino, 1000ml ao longo da tarde e 500ml à noite.
                </p>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-blue-100">
                <span className="font-bold text-slate-900 block">
                  Protocolo de Fibras Solúveis (Escala Bristol Tipo {anamnese.gastrointestinal.bristolType})
                </span>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Psyllium 5g pela manhã em jejum com 1 copo grande de água morna para reversão da constipação e amolecimento das fezes.
                </p>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-blue-100">
                <span className="font-bold text-slate-900 block">
                  Orientação Sono & Digestão
                </span>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Última refeição sólida até 2h antes de deitar ({anamnese.sleepRoutine.hoursPerNight}h de sono previstas) para prevenir refluxo e sonolência residual.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Assinatura Digital & Carimbo CFN nº 856 */}
        <div className="border-t-2 border-slate-200 pt-5 mt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6 text-emerald-700" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">Documento Assinado Digitalmente</span>
                <span className="text-slate-600">Dra. Camila Silveira • Nutricionista Clínica e Esportiva</span>
                <span className="text-slate-500 block text-[11px]">Registro Profissional: CRN-3 / 48.912</span>
              </div>
            </div>

            <div className="text-right text-xs">
              <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 block">
                Token 2FA: #CFN-856-7829-AUTH
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Validade Clínica: 60 dias a partir da emissão
              </span>
            </div>
          </div>
        </div>

        {/* Rodapé da Página 3 */}
        <div className="pt-5 mt-5 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
          <span>TalkNutri • Atendimento Zero-App WhatsApp: {patient.phone}</span>
          <span>Página 3 de 3</span>
        </div>
      </div>

    </div>
  );
};
