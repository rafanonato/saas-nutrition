import React, { useState } from 'react';
import { Search, UserPlus, ChevronRight, CheckCircle2, AlertTriangle, ArrowUpDown, Filter } from 'lucide-react';
import { PatientSummary } from '../../types';

interface PacientesViewProps {
  patients: PatientSummary[];
  onSelectPatient: (patient: PatientSummary) => void;
}

export const PacientesView: React.FC<PacientesViewProps> = ({
  patients,
  onSelectPatient
}) => {
  const [filter, setFilter] = useState<'todos' | 'alta' | 'atencao'>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatients = patients.filter(p => {
    if (filter === 'alta' && p.whatsappComplianceRate < 80) return false;
    if (filter === 'atencao' && p.whatsappComplianceRate >= 80) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div id="pacientes-view" className="p-6 md:p-8 space-y-6 max-w-6xl mx-auto">
      {/* 1. Header com busca e novo paciente */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Gestão e CRM de Pacientes</h2>
          <p className="text-xs text-slate-500">124 pacientes cadastrados • 88% de adesão média no WhatsApp (Zero-App)</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome ou CPF..."
              className="bg-white border border-slate-200 rounded-full pl-9 pr-4 py-2 text-xs text-slate-800 outline-none focus:border-blue-400 w-60 shadow-2xs"
            />
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-full text-xs shadow-xs flex items-center gap-1.5 transition">
            <UserPlus className="w-4 h-4" />
            <span>Novo Paciente</span>
          </button>
        </div>
      </div>

      {/* 2. Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="text-xs text-slate-400 font-semibold uppercase">Total de Pacientes</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">124</div>
        </div>
        <div className="bg-white border border-emerald-200 rounded-2xl p-4 shadow-xs">
          <div className="text-xs text-emerald-800 font-semibold uppercase">Alta Adesão Zero-App</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">80 <span className="text-xs font-normal text-slate-400">(≥85%)</span></div>
        </div>
        <div className="bg-white border border-amber-200 rounded-2xl p-4 shadow-xs">
          <div className="text-xs text-amber-800 font-semibold uppercase">Atenção Necessária</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">12 <span className="text-xs font-normal text-slate-400">(&lt;60%)</span></div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="text-xs text-slate-400 font-semibold uppercase">Mensagens WhatsApp/dia</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">214 <span className="text-xs font-semibold text-emerald-600">+18%</span></div>
        </div>
      </div>

      {/* 3. Tabela de Pacientes */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        {/* Filtros */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <button 
              onClick={() => setFilter('todos')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                filter === 'todos' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Todos (124)
            </button>
            <button 
              onClick={() => setFilter('alta')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                filter === 'alta' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Alta Adesão (80)
            </button>
            <button 
              onClick={() => setFilter('atencao')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                filter === 'atencao' ? 'bg-amber-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Atenção Necessária (12)
            </button>
          </div>

          <span className="text-xs text-slate-400">Ordenar por: Adesão mais recente</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase text-[10px] font-semibold text-slate-400">
              <tr>
                <th className="py-3 px-6">Paciente & Contato</th>
                <th className="py-3 px-6">Objetivo Principal</th>
                <th className="py-3 px-6 text-center">Última Consulta</th>
                <th className="py-3 px-6">Adesão no WhatsApp (Zero-App)</th>
                <th className="py-3 px-6 text-center">Status Bot</th>
                <th className="py-3 px-6 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredPatients.map((pat) => (
                <tr 
                  key={pat.id} 
                  onClick={() => onSelectPatient(pat)}
                  className="hover:bg-slate-50 transition cursor-pointer"
                >
                  <td className="py-4 px-6 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0">
                      {pat.avatarInitials}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{pat.name}</div>
                      <div className="text-[11px] text-slate-400">{pat.phone}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-[11px] font-semibold">
                      {pat.goal}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center text-slate-500">
                    Hoje ({pat.appointmentTime})
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2.5">
                      <div className="w-28 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            pat.whatsappComplianceRate >= 80 ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${pat.whatsappComplianceRate}%` }}
                        />
                      </div>
                      <span className={`font-bold ${
                        pat.whatsappComplianceRate >= 80 ? 'text-emerald-700' : 'text-amber-700'
                      }`}>
                        {pat.whatsappComplianceRate}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      pat.whatsappComplianceRate >= 80 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {pat.whatsappComplianceRate >= 80 ? 'Ativo / Check-in OK' : 'Necessita Ajuste'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-blue-600 hover:text-blue-700 font-bold hover:underline">
                      Abrir Prontuário
                    </button>
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
