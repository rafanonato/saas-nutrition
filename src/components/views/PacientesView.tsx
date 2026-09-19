import React, { useState, useMemo } from 'react';
import { 
  Search, 
  UserPlus, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpDown, 
  Filter,
  Building2,
  Stethoscope,
  ShieldCheck,
  Phone,
  Calendar,
  Sparkles,
  Edit2,
  Trash2,
  Activity,
  Flame,
  UserCheck,
  Zap,
  Users
} from 'lucide-react';
import { PatientSummary, NutritionistUser, ClinicTenant } from '../../types';
import { NovoPacienteModal } from '../patients/NovoPacienteModal';
import { EditarPacienteModal } from '../patients/EditarPacienteModal';
import { tenantService, DEFAULT_CLINIC, DEFAULT_NUTRITIONISTS } from '../../services/tenantService';

interface PacientesViewProps {
  patients: PatientSummary[];
  onSelectPatient: (patient: PatientSummary) => void;
  onAddNewPatient?: (newPatient: PatientSummary, autoStart: boolean) => void;
  onUpdatePatient?: (id: string, updates: Partial<PatientSummary>) => void;
  onDeletePatient?: (id: string) => void;
  currentNutritionist?: NutritionistUser;
  currentClinic?: ClinicTenant;
}

export const PacientesView: React.FC<PacientesViewProps> = ({
  patients,
  onSelectPatient,
  onAddNewPatient,
  onUpdatePatient,
  onDeletePatient,
  currentNutritionist,
  currentClinic
}) => {
  const [filter, setFilter] = useState<'todos' | 'alta' | 'atencao' | 'novos'>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recente' | 'adesao' | 'nome'>('recente');

  // Modals
  const [isNovoPacienteModalOpen, setIsNovoPacienteModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<PatientSummary | null>(null);

  // Tenant / Nutri data
  const clinic = currentClinic || tenantService.getClinic();
  const nutritionist = currentNutritionist || tenantService.getActiveNutritionist();

  // Filtragem e Ordenação
  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      // Filtros rápidos
      if (filter === 'alta' && p.whatsappComplianceRate < 80) return false;
      if (filter === 'atencao' && p.whatsappComplianceRate >= 80) return false;
      if (filter === 'novos' && !p.status?.toLowerCase().includes('novo')) return false;

      // Busca
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = p.name.toLowerCase().includes(query);
        const matchPhone = p.phone.toLowerCase().includes(query);
        const matchCpf = p.cpf ? p.cpf.toLowerCase().includes(query) : false;
        const matchGoal = p.goal.toLowerCase().includes(query);
        if (!matchName && !matchPhone && !matchCpf && !matchGoal) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'adesao') {
        return b.whatsappComplianceRate - a.whatsappComplianceRate;
      }
      if (sortBy === 'nome') {
        return a.name.localeCompare(b.name);
      }
      // Padrão: mais recente primeiro
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });
  }, [patients, filter, searchQuery, sortBy]);

  // Métricas calculadas dinamicamente com base nos pacientes da nutricionista
  const stats = useMemo(() => {
    const total = patients.length;
    const highAdherence = patients.filter(p => p.whatsappComplianceRate >= 80).length;
    const attention = patients.filter(p => p.whatsappComplianceRate < 80).length;
    const avgAdherence = total > 0 
      ? Math.round(patients.reduce((acc, p) => acc + p.whatsappComplianceRate, 0) / total) 
      : 0;

    return { total, highAdherence, attention, avgAdherence };
  }, [patients]);

  const handleSaveNewPatient = (newPatient: PatientSummary, autoStart: boolean) => {
    setIsNovoPacienteModalOpen(false);
    if (onAddNewPatient) {
      onAddNewPatient(newPatient, autoStart);
    }
  };

  const handleUpdate = (id: string, updates: Partial<PatientSummary>) => {
    if (onUpdatePatient) {
      onUpdatePatient(id, updates);
    }
  };

  const handleDelete = (id: string) => {
    if (onDeletePatient) {
      onDeletePatient(id);
    }
  };

  return (
    <div id="pacientes-view" className="p-6 md:p-8 space-y-6 max-w-6xl mx-auto animate-fadeIn">
      
      {/* 1. Barra de Governança & Camadas Arquiteturais */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-500 text-white flex items-center justify-center font-bold text-base shadow-sm">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">Gestão de Pacientes da Nutricionista</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Camada 3 • Workspace Isolado
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1 font-semibold text-slate-800">
                <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                {nutritionist.name} ({nutritionist.crn})
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 text-slate-500">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {clinic.name}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-center">
          <div className="text-right hidden sm:block">
            <span className="text-[11px] text-slate-400 block font-medium">Arquitetura Multi-Tenant</span>
            <span className="text-xs font-bold text-slate-700">Clínica ➔ Nutricionista ➔ Pacientes</span>
          </div>

          <button 
            id="btn-novo-paciente"
            onClick={() => setIsNovoPacienteModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-full text-xs shadow-sm flex items-center gap-2 transition hover:scale-[1.02] active:scale-[0.98]"
          >
            <UserPlus className="w-4 h-4" />
            <span>Novo Paciente</span>
          </button>
        </div>
      </div>

      {/* 2. Cards de Resumo & Telemetria */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Total de Pacientes</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 flex items-baseline gap-2">
            <span>{stats.total}</span>
            <span className="text-xs font-normal text-slate-400">sob {nutritionist.name}</span>
          </div>
        </div>

        <div className="bg-white border border-emerald-200/80 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] text-emerald-800 font-semibold uppercase tracking-wider">Alta Adesão Zero-App</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1 flex items-baseline gap-2">
            <span>{stats.highAdherence}</span>
            <span className="text-xs font-normal text-slate-400">pacientes (≥80%)</span>
          </div>
        </div>

        <div className="bg-white border border-amber-200/80 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] text-amber-800 font-semibold uppercase tracking-wider">Atenção Necessária</div>
          <div className="text-2xl font-bold text-amber-600 mt-1 flex items-baseline gap-2">
            <span>{stats.attention}</span>
            <span className="text-xs font-normal text-slate-400">check-in pendente</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Adesão Média WhatsApp</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 flex items-baseline gap-2">
            <span>{stats.avgAdherence}%</span>
            <span className="text-xs font-semibold text-emerald-600">+12% vs mês ant.</span>
          </div>
        </div>
      </div>

      {/* 3. Tabela & Filtros */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        
        {/* Barra de Filtros e Busca */}
        <div className="p-4 md:p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={() => setFilter('todos')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                filter === 'todos' 
                  ? 'bg-slate-900 text-white shadow-2xs' 
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Todos ({stats.total})
            </button>
            <button 
              onClick={() => setFilter('alta')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                filter === 'alta' 
                  ? 'bg-emerald-600 text-white shadow-2xs' 
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Alta Adesão ({stats.highAdherence})
            </button>
            <button 
              onClick={() => setFilter('atencao')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                filter === 'atencao' 
                  ? 'bg-amber-600 text-white shadow-2xs' 
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Atenção ({stats.attention})
            </button>
            <button 
              onClick={() => setFilter('novos')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                filter === 'novos' 
                  ? 'bg-blue-600 text-white shadow-2xs' 
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Novos Cadastros
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nome, telefone ou CPF..."
                className="w-full bg-white border border-slate-200 rounded-full pl-9 pr-4 py-2 text-xs text-slate-800 outline-none focus:border-blue-400 shadow-2xs transition"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
              <span className="hidden sm:inline text-slate-400">Ordem:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-slate-200 rounded-full px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-blue-400 shadow-2xs"
              >
                <option value="recente">Mais Recente</option>
                <option value="adesao">Adesão WhatsApp</option>
                <option value="nome">Nome (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Listagem de Pacientes */}
        {filteredPatients.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Nenhum paciente encontrado</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Não encontramos nenhum paciente para os critérios de busca selecionados.
            </p>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-xs text-blue-600 font-semibold hover:underline"
              >
                Limpar busca
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 uppercase text-[10px] font-semibold text-slate-400">
                <tr>
                  <th className="py-3.5 px-6">Paciente & Contato Zero-App</th>
                  <th className="py-3.5 px-6">Objetivo & Caloria</th>
                  <th className="py-3.5 px-6 text-center">Status / Consulta</th>
                  <th className="py-3.5 px-6">Adesão WhatsApp</th>
                  <th className="py-3.5 px-6 text-center">Canal Bot</th>
                  <th className="py-3.5 px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredPatients.map((pat) => (
                  <tr 
                    key={pat.id} 
                    className="hover:bg-slate-50/80 transition group"
                  >
                    {/* Paciente e Contato */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div 
                          onClick={() => onSelectPatient(pat)}
                          className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0 cursor-pointer hover:bg-blue-200 transition"
                        >
                          {pat.avatarInitials}
                        </div>
                        <div>
                          <div 
                            onClick={() => onSelectPatient(pat)}
                            className="font-bold text-slate-900 text-sm hover:text-blue-600 cursor-pointer transition flex items-center gap-1.5"
                          >
                            <span>{pat.name}</span>
                            {pat.status?.toLowerCase().includes('novo') && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 bg-blue-100 text-blue-700 rounded-full">
                                Novo
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-emerald-600" />
                              {pat.phone}
                            </span>
                            {pat.cpf && (
                              <span>• CPF: {pat.cpf}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Objetivo e Caloria */}
                    <td className="py-4 px-6">
                      <div>
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-[11px] font-semibold block w-fit">
                          {pat.goal}
                        </span>
                        <span className="text-[11px] text-slate-400 mt-1 block">
                          Alvo: <strong className="text-slate-600">{pat.targetKcal} kcal</strong> • TMB {pat.bmr}
                        </span>
                      </div>
                    </td>

                    {/* Status Consulta */}
                    <td className="py-4 px-6 text-center">
                      <span className="text-slate-700 font-medium block">
                        {pat.appointmentTime}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {pat.status}
                      </span>
                    </td>

                    {/* Adesão WhatsApp */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
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

                    {/* Status Bot */}
                    <td className="py-4 px-6 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        pat.whatsappComplianceRate >= 80 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {pat.whatsappComplianceRate >= 80 ? 'Zero-App Ativo' : 'Ajuste Pendente'}
                      </span>
                    </td>

                    {/* Ações */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingPatient(pat)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                          title="Editar Cadastro"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onSelectPatient(pat)}
                          className="bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-bold px-3 py-1.5 rounded-full text-xs transition flex items-center gap-1 shadow-2xs"
                        >
                          <span>Prontuário</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Novo Paciente */}
      <NovoPacienteModal 
        isOpen={isNovoPacienteModalOpen}
        onClose={() => setIsNovoPacienteModalOpen(false)}
        onSavePatient={handleSaveNewPatient}
        nutritionist={nutritionist}
        clinic={clinic}
      />

      {/* Modal: Editar Paciente */}
      <EditarPacienteModal 
        isOpen={!!editingPatient}
        patient={editingPatient}
        onClose={() => setEditingPatient(null)}
        onUpdatePatient={handleUpdate}
        onDeletePatient={handleDelete}
      />

    </div>
  );
};
