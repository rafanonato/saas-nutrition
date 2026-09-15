import React, { useState } from 'react';
import { User, AlertCircle, RefreshCw, UploadCloud, Plus, X, Droplet, Clock } from 'lucide-react';
import { Biomarker } from '../../types';

interface AnamneseViewProps {
  biomarkers: Biomarker[];
  onAddAversion?: (aversion: string) => void;
  onRemoveAversion?: (aversion: string) => void;
}

export const AnamneseView: React.FC<AnamneseViewProps> = ({ biomarkers }) => {
  const [aversions, setAversions] = useState<string[]>(['Lactose (Leve desconforto)', 'Batata-Doce (Enjoo Severo)']);
  const [newAversionInput, setNewAversionInput] = useState('');

  const handleAddAversion = () => {
    if (!newAversionInput.trim()) return;
    setAversions(prev => [...prev, newAversionInput.trim()]);
    setNewAversionInput('');
  };

  const handleRemoveAversion = (item: string) => {
    setAversions(prev => prev.filter(a => a !== item));
  };

  return (
    <div id="anamnese-view-container" className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Prontuário Inteligente & Live-Fill</span>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Dados Cadastrais, Hábitos e Histórico Alimentar</h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>Escuta ativa sincronizando</span>
        </div>
      </div>

      {/* 1. Queixas, Rotina e Aversões Clínicas */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <User className="w-4 h-4 text-blue-600" />
          Queixas, Rotina e Aversões Clínicas (Alimentam o Solver HiGHS)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-600 mb-1.5 block">Motivo da Consulta & Alvo</label>
            <input 
              type="text" 
              readOnly 
              value="Ganho de massa magra (Hipertrofia) sem desconforto gástrico." 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-medium outline-none focus:bg-white focus:border-blue-400 transition"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-slate-600 block">Queixas Principais (Gastro / Rotina)</label>
              <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-semibold">• Preenchido via fala (12:05)</span>
            </div>
            <input 
              type="text" 
              readOnly 
              value="Sonolência pós-almoço e constipação intestinal (3 dias sem evacuar)." 
              className="w-full bg-blue-50/70 border border-blue-200 rounded-xl px-3.5 py-2.5 text-blue-950 font-medium outline-none ring-2 ring-blue-100"
            />
          </div>

          <div className="md:col-span-2">
            <label className="font-semibold text-slate-600 mb-1.5 block">Aversões, Alergias ou Intolerâncias (Excluídas automaticamente dos cálculos)</label>
            <div className="flex flex-wrap gap-2 items-center bg-slate-50 border border-slate-200 rounded-2xl p-2.5">
              {aversions.map((aversion) => {
                const isSevero = aversion.includes('Batata-Doce');
                return (
                  <span 
                    key={aversion} 
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-xl shadow-2xs ${
                      isSevero 
                        ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    <span>{aversion}</span>
                    <button 
                      type="button"
                      onClick={() => handleRemoveAversion(aversion)}
                      className="hover:text-rose-600 rounded p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
              
              <div className="flex items-center gap-1 min-w-[200px] flex-1">
                <input 
                  type="text" 
                  value={newAversionInput} 
                  onChange={(e) => setNewAversionInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddAversion()}
                  placeholder="+ Adicionar aversão para excluir..." 
                  className="bg-transparent text-xs text-slate-700 outline-none w-full px-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Biomarcadores Laboratoriais (OCR) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Droplet className="w-4 h-4 text-rose-600" />
              Biomarcadores Laboratoriais (Extração OCR Automática)
            </h3>
            <p className="text-xs text-slate-500">Laudo enviado pela paciente no WhatsApp e processado às 22:40</p>
          </div>
          <button 
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Fazer Upload de Novo Laudo (PDF)</span>
          </button>
        </div>

        <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-semibold text-slate-500">
              <tr>
                <th className="py-2.5 px-4">Biomarcador</th>
                <th className="py-2.5 px-4 text-center">Resultado</th>
                <th className="py-2.5 px-4 text-center">Referência Clínica</th>
                <th className="py-2.5 px-4">Interpretação IA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {biomarkers.map((bio) => (
                <tr key={bio.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4 font-semibold text-slate-800 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      bio.status === 'critico' ? 'bg-rose-600' : bio.status === 'alerta' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`} />
                    {bio.name}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-slate-900">
                    <span className={bio.status === 'critico' ? 'text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200' : ''}>
                      {bio.result} {bio.unit}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-slate-500">{bio.functionalTarget}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      bio.status === 'critico' 
                        ? 'bg-rose-100 text-rose-800' 
                        : bio.status === 'alerta' 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {bio.interpretation}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
