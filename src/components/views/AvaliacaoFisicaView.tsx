import React from 'react';
import { Activity, Scissors, RotateCcw, Check, Sparkles } from 'lucide-react';
import { BodyComposition } from '../../types';

interface AvaliacaoFisicaViewProps {
  composition: BodyComposition;
}

export const AvaliacaoFisicaView: React.FC<AvaliacaoFisicaViewProps> = ({ composition }) => {
  return (
    <div id="avaliacao-fisica-view" className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      {/* 1. Composição Corporal Atual */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            Composição Corporal Atual (Live-Fill via Escuta & InBody)
          </h3>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            Taxa Metabólica: {composition.bmrCunningham} kcal (Cunningham)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-3.5">
            <div className="text-[11px] font-semibold text-blue-900 mb-1">Peso Atual</div>
            <div className="text-2xl font-bold text-blue-900">{composition.currentWeight} <span className="text-xs font-normal">kg</span></div>
            <div className="text-[10px] text-blue-600 mt-1">Preenchido via áudio (12:02)</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5">
            <div className="text-[11px] font-semibold text-slate-600 mb-1">Estatura</div>
            <div className="text-2xl font-bold text-slate-900">{composition.height} <span className="text-xs font-normal">cm</span></div>
            <div className="text-[10px] text-slate-400 mt-1">IMC: 22.9 kg/m²</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5">
            <div className="text-[11px] font-semibold text-slate-600 mb-1">Gordura Corp.</div>
            <div className="text-2xl font-bold text-emerald-600">{composition.bodyFatPercent}%</div>
            <div className="text-[10px] text-slate-400 mt-1">Massa Gorda: {composition.fatMassKg} kg</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5">
            <div className="text-[11px] font-semibold text-slate-600 mb-1">Massa Magra (MLG)</div>
            <div className="text-2xl font-bold text-indigo-600">{composition.leanMassKg} <span className="text-xs font-normal">kg</span></div>
            <div className="text-[10px] text-indigo-500 mt-1">Alvo: {composition.targetLeanMassKg} kg</div>
          </div>
        </div>
      </div>

      {/* 2. Dobras Cutâneas (Protocolo Jackson & Pollock 7 Dobras) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Scissors className="w-4 h-4 text-emerald-600" />
              Dobras Cutâneas (Adipômetro Clínico)
            </h3>
            <p className="text-xs text-slate-500">Valores em milímetros (mm). O copiloto transcreve o ditado do nutricionista em tempo real.</p>
          </div>
          <button className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5" />
            Recalcular Equações
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block mb-1">Tricipital</span>
            <span className="text-base font-bold text-slate-900">{composition.skinfolds.triceps} mm</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block mb-1">Subescapular</span>
            <span className="text-base font-bold text-slate-900">{composition.skinfolds.subscapular} mm</span>
          </div>
          <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200">
            <span className="text-blue-900 font-semibold block mb-1">Suprailíaca (Destacada)</span>
            <span className="text-base font-bold text-blue-800">{composition.skinfolds.suprailiac} mm</span>
          </div>
          <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200">
            <span className="text-blue-900 font-semibold block mb-1">Abdominal (Destacada)</span>
            <span className="text-base font-bold text-blue-800">{composition.skinfolds.abdominal} mm</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block mb-1">Axilar Média</span>
            <span className="text-base font-bold text-slate-900">{composition.skinfolds.axillary} mm</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block mb-1">Peitoral</span>
            <span className="text-base font-bold text-slate-900">{composition.skinfolds.pectoral} mm</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block mb-1">Coxa Medial</span>
            <span className="text-base font-bold text-slate-900">{composition.skinfolds.thigh} mm</span>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
            <span className="text-emerald-800 font-bold block mb-1 uppercase text-[10px]">Soma das 7</span>
            <span className="text-base font-bold text-emerald-700">{composition.skinfolds.sum7} mm</span>
          </div>
        </div>
      </div>

      {/* 3. Circunferências Corporais */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Circunferências Corporais (Fita Métrica)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 border border-slate-200 rounded-xl">
            <span className="text-slate-500 block mb-1">Cintura</span>
            <span className="text-base font-bold text-slate-900">{composition.circumferences.waist} cm</span>
            <span className="text-[10px] text-emerald-600 block mt-0.5">Relação C/Q: 0.71 (Excelente)</span>
          </div>
          <div className="p-3 border border-slate-200 rounded-xl">
            <span className="text-slate-500 block mb-1">Quadril</span>
            <span className="text-base font-bold text-slate-900">{composition.circumferences.hip} cm</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Ginoide</span>
          </div>
          <div className="p-3 border border-slate-200 rounded-xl">
            <span className="text-slate-500 block mb-1">Braço Relaxado</span>
            <span className="text-base font-bold text-slate-900">{composition.circumferences.relaxedArm} cm</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Contraído: {composition.circumferences.contractedArm} cm</span>
          </div>
          <div className="p-3 border border-slate-200 rounded-xl">
            <span className="text-slate-500 block mb-1">Coxa Medial</span>
            <span className="text-base font-bold text-slate-900">{composition.circumferences.thigh} cm</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Simetria D/E 100%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
