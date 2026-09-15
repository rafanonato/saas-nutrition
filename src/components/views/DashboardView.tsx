import React from 'react';
import { Calendar, CheckCircle, AlertCircle, Play, ChevronRight, FileText, Activity } from 'lucide-react';
import { PatientSummary } from '../../types';

interface DashboardViewProps {
  patients: PatientSummary[];
  onStartConsultation: (patient: PatientSummary) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  patients,
  onStartConsultation
}) => {
  return (
    <div id="dashboard-view" className="p-8 space-y-7 max-w-6xl mx-auto">
      {/* 1. Header de Boas-Vindas */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Bom dia, Dra. Camila</h2>
          <p className="text-xs text-slate-500">Terça-feira, 15 de Setembro de 2026 • 4 atendimentos agendados hoje</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Meta API Conectada (Zero-App Ativo)
          </span>
        </div>
      </div>

      {/* 2. Cards de Métricas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Consultas Hoje</div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">4 <span className="text-xs font-normal text-blue-600 font-semibold">• 1 em andamento</span></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Adesão Zero-App</div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">92% <span className="text-xs font-normal text-emerald-600 font-semibold">+4% esse mês</span></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Alertas Bioquímicos</div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">2 <span className="text-xs font-normal text-amber-600 font-semibold">OCR detectou</span></div>
          </div>
        </div>
      </div>

      {/* 3. Próximos Atendimentos */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            Próximos Atendimentos da Grade (Fluxo Contínuo)
          </h3>
          <span className="text-xs text-slate-400">Horário de Brasília (GMT-3)</span>
        </div>

        <div className="space-y-3.5">
          {patients.map((pat, idx) => {
            const isFirst = idx === 0;
            return (
              <div 
                key={pat.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all gap-4 ${
                  isFirst 
                    ? 'bg-blue-50/60 border-blue-200 shadow-xs' 
                    : 'bg-white border-slate-200 hover:bg-slate-50/80'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`text-center px-3.5 py-1 rounded-xl border shrink-0 ${
                    isFirst 
                      ? 'bg-white border-blue-200 text-blue-700' 
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Hoje</div>
                    <div className="text-lg font-bold tracking-tight">{pat.appointmentTime}</div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{pat.name}</h4>
                      {pat.ocrReady && (
                        <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                          OCR Pronto
                        </span>
                      )}
                      <span className="text-xs text-emerald-700 font-medium">
                        • {pat.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Foco: {pat.goal} • WhatsApp: {pat.whatsappComplianceRate}% adesão • {pat.age} anos
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {isFirst ? (
                    <button
                      id={`btn-start-${pat.id}`}
                      onClick={() => onStartConsultation(pat)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-full text-xs shadow-xs flex items-center gap-2 transition"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Iniciar Consulta</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onStartConsultation(pat)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-4 rounded-full text-xs transition"
                    >
                      Ver Prontuário
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Banner de Desempenho do Algoritmo HiGHS */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-3xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <CheckCircle className="w-4 h-4" />
            Desempenho do Algoritmo HiGHS & Automações
          </div>
          <h4 className="text-base font-semibold">Tempo Médio de Elaboração de Dieta: <span className="text-emerald-300">4min 12s</span> (-82% vs. manual)</h4>
          <p className="text-xs text-slate-300 max-w-xl">
            O motor de otimização inteira mista eliminou a tentativa e erro com frações quebradas, garantindo o limiar de leucina e medidas caseiras práticas em &lt;100ms.
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-2xl font-bold text-emerald-400">1.482</div>
          <div className="text-[11px] text-slate-400">Interações pelo WhatsApp esta semana</div>
        </div>
      </div>
    </div>
  );
};
