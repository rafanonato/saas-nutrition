import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  UserPlus, 
  Search, 
  Lock, 
  Unlock, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  SlidersHorizontal,
  Mail,
  Phone,
  Award,
  Stethoscope,
  ExternalLink,
  ChevronRight,
  UserCheck,
  ShieldAlert
} from 'lucide-react';
import { ClinicTenant, NutritionistUser, ActiveTab } from '../../types';
import { NovaNutricionistaModal } from '../clinic/NovaNutricionistaModal';
import { EditarNutricionistaModal } from '../clinic/EditarNutricionistaModal';
import { EditarClinicaModal } from '../clinic/EditarClinicaModal';

interface GestaoClinicaViewProps {
  clinic: ClinicTenant;
  nutritionists: NutritionistUser[];
  activeNutritionist: NutritionistUser;
  onUpdateClinic: (updates: Partial<ClinicTenant>) => void;
  onAddNutritionist: (data: {
    name: string;
    email: string;
    phone: string;
    crn: string;
    specialty: string;
    role: 'admin_nutri' | 'nutri';
    notes?: string;
  }) => void;
  onUpdateNutritionist: (id: string, updates: Partial<NutritionistUser>) => void;
  onToggleAccess: (id: string, active: boolean) => void;
  onDeleteNutritionist: (id: string) => void;
  onSwitchActiveNutritionist: (id: string) => void;
  onNavigateToTab: (tab: ActiveTab) => void;
}

export const GestaoClinicaView: React.FC<GestaoClinicaViewProps> = ({
  clinic,
  nutritionists,
  activeNutritionist,
  onUpdateClinic,
  onAddNutritionist,
  onUpdateNutritionist,
  onToggleAccess,
  onDeleteNutritionist,
  onSwitchActiveNutritionist,
  onNavigateToTab
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'ativos' | 'inativos'>('todos');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isClinicModalOpen, setIsClinicModalOpen] = useState(false);
  const [selectedNutritionist, setSelectedNutritionist] = useState<NutritionistUser | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  // Filtragem
  const filteredNutritionists = useMemo(() => {
    return nutritionists.filter(n => {
      const matchesSearch = 
        n.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.crn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.specialty.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = 
        statusFilter === 'todos' ? true :
        statusFilter === 'ativos' ? n.active :
        !n.active;

      return matchesSearch && matchesStatus;
    });
  }, [nutritionists, searchTerm, statusFilter]);

  // Métricas
  const totalNutris = nutritionists.length;
  const activeNutris = nutritionists.filter(n => n.active).length;
  const inactiveNutris = totalNutris - activeNutris;
  const maxLicenses = clinic.maxNutritionists || 5;

  const handleOpenEdit = (nutri: NutritionistUser) => {
    setSelectedNutritionist(nutri);
    setIsEditModalOpen(true);
  };

  const handleToggleAccessWithFeedback = (nutri: NutritionistUser) => {
    const nextState = !nutri.active;
    onToggleAccess(nutri.id, nextState);
    showToast(
      nextState 
        ? `Permissão de acesso concedida para ${nutri.name}.` 
        : `Acesso suspenso para ${nutri.name}.`
    );
  };

  const handleSwitchAndGoToWorkspace = (nutri: NutritionistUser) => {
    if (!nutri.active) {
      showToast(`Não é possível alternar: o acesso da profissional ${nutri.name} está desativado.`);
      return;
    }
    onSwitchActiveNutritionist(nutri.id);
    showToast(`Ambiente clínico alternado para ${nutri.name}. Redirecionando para gestão de pacientes.`);
    setTimeout(() => {
      onNavigateToTab('pacientes');
    }, 400);
  };

  return (
    <div id="clinic-management-view" className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Toast Notifier */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-200 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* 1. Cabeçalho Institucional da Clínica (Camada Global) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shrink-0">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                {clinic.tradeName || clinic.name}
              </h1>
              <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                Plano {clinic.plan.toUpperCase()} Multi-Nutri
              </span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Clínica Ativa
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {clinic.name} • CNPJ: {clinic.cnpj || '38.412.981/0001-44'} • Responsável Técnica: {clinic.responsibleName || 'Dra. Maithe'}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {clinic.address}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsClinicModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl transition flex items-center gap-1.5 shadow-2xs"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Editar Dados da Clínica
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
          >
            <UserPlus className="w-4 h-4" />
            Cadastrar Nutricionista
          </button>
        </div>
      </div>

      {/* 2. Banner de Isolamento Arquitetural & Sigilo Profissional (CFN nº 856/2026 e LGPD) */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-4.5 border border-slate-700 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <span className="text-xs font-bold text-blue-300 uppercase tracking-wider block">
              Isolamento Rigoroso de Camadas (Tenant Clínica vs. Sigilo do Prontuário)
            </span>
            <p className="text-xs text-slate-300 mt-0.5 max-w-3xl leading-relaxed">
              Nesta tela administrativa, a clínica gerencia exclusivamente o <strong>cadastro de profissionais e concessão de permissão de acesso</strong>. Por força das resoluções do CFN e da LGPD de dados sensíveis de saúde, a gestão da clínica <strong>não acessa prontuários, fotos ou exames de pacientes</strong> das nutricionistas.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-slate-400 font-medium">Nutri Conectada no Workspace:</span>
          <span className="px-2.5 py-1 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold">
            {activeNutritionist.name} ({activeNutritionist.avatarInitials})
          </span>
        </div>
      </div>

      {/* 3. Cards de Indicadores de Gestão de Profissionais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Profissionais</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">{totalNutris}</div>
          <span className="text-xs text-slate-400 mt-1 block">Nutricionistas vinculadas</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Acessos Liberados</span>
            <Unlock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 tracking-tight">{activeNutris}</div>
          <span className="text-xs text-emerald-600 mt-1 block font-medium">Autorizadas a prescrever</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Acessos Suspensos</span>
            <Lock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800 tracking-tight">{inactiveNutris}</div>
          <span className="text-xs text-slate-400 mt-1 block">Sem permissão de login</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Licenças Contratadas</span>
            <ShieldAlert className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-700 tracking-tight">
            {totalNutris} <span className="text-sm font-normal text-slate-400">/ {maxLicenses}</span>
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            {maxLicenses - totalNutris > 0 ? `${maxLicenses - totalNutris} licenças disponíveis` : 'Capacidade máxima atingida'}
          </span>
        </div>
      </div>

      {/* 4. Barra de Busca, Filtros e Lista de Nutricionistas */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Header da Tabela */}
        <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Quadro de Nutricionistas da Clínica
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Visualize dados de registro, credenciais e conceda ou revogue a permissão de acesso ao sistema
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Busca */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome, CRN ou área..."
                className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-hidden transition"
              />
            </div>

            {/* Filtro de Status */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setStatusFilter('todos')}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  statusFilter === 'todos' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Todas ({totalNutris})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('ativos')}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  statusFilter === 'ativos' ? 'bg-white text-emerald-700 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Acesso Ativo ({activeNutris})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('inativos')}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  statusFilter === 'inativos' ? 'bg-white text-amber-700 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Suspensos ({inactiveNutris})
              </button>
            </div>
          </div>
        </div>

        {/* Listagem de Nutricionistas */}
        <div className="divide-y divide-slate-200">
          {filteredNutritionists.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700">Nenhuma nutricionista encontrada</p>
              <p className="text-xs text-slate-400 mt-1">Ajuste os filtros de busca ou cadastre uma nova profissional.</p>
            </div>
          ) : (
            filteredNutritionists.map((nutri) => {
              const isCurrentSessionNutri = activeNutritionist.id === nutri.id;

              return (
                <div 
                  key={nutri.id} 
                  className={`p-5 transition hover:bg-slate-50/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                    !nutri.active ? 'bg-slate-50/50 opacity-90' : ''
                  }`}
                >
                  {/* Informações da Profissional */}
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shadow-xs shrink-0 border ${
                      nutri.active 
                        ? 'bg-gradient-to-tr from-blue-100 to-indigo-100 text-blue-800 border-blue-200' 
                        : 'bg-slate-200 text-slate-600 border-slate-300'
                    }`}>
                      {nutri.avatarInitials}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{nutri.name}</h3>
                        
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                          <Award className="w-3 h-3 text-slate-500" />
                          {nutri.crn}
                        </span>

                        {nutri.role === 'admin_nutri' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            Responsável Técnica & Admin
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                            Nutricionista Clínica
                          </span>
                        )}

                        {isCurrentSessionNutri && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-600 text-white shadow-2xs">
                            Sessão Atual
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1 text-slate-700 font-medium">
                          <Stethoscope className="w-3.5 h-3.5 text-blue-500" />
                          {nutri.specialty}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          {nutri.email}
                        </span>
                        {nutri.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {nutri.phone}
                          </span>
                        )}
                      </div>

                      {nutri.notes && (
                        <p className="text-[11px] text-slate-400 italic">
                          Obs: {nutri.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Controle de Permissão de Acesso ao Sistema & Ações */}
                  <div className="flex flex-wrap items-center gap-4 lg:justify-end shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    {/* Toggle de Permissão de Acesso */}
                    <div className="flex items-center gap-3 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
                      <div className="text-right">
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                          Permissão de Acesso
                        </span>
                        <span className={`text-xs font-bold flex items-center gap-1 ${
                          nutri.active ? 'text-emerald-700' : 'text-slate-500'
                        }`}>
                          {nutri.active ? (
                            <>
                              <Unlock className="w-3 h-3 text-emerald-600" />
                              Acesso Liberado
                            </>
                          ) : (
                            <>
                              <Lock className="w-3 h-3 text-slate-400" />
                              Acesso Suspenso
                            </>
                          )}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleAccessWithFeedback(nutri)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                          nutri.active ? 'bg-emerald-600' : 'bg-slate-300'
                        }`}
                        title={nutri.active ? 'Clique para suspender acesso ao sistema' : 'Clique para liberar acesso ao sistema'}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                            nutri.active ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(nutri)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition shadow-2xs flex items-center gap-1.5"
                        title="Editar dados cadastrais e especialidade"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                        Editar
                      </button>

                      {nutri.active && !isCurrentSessionNutri && (
                        <button
                          type="button"
                          onClick={() => handleSwitchAndGoToWorkspace(nutri)}
                          className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition flex items-center gap-1.5 shadow-2xs"
                          title="Alternar para o ambiente clínico desta nutricionista"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                          <span>Entrar no Consultório</span>
                        </button>
                      )}

                      {isCurrentSessionNutri && (
                        <button
                          type="button"
                          onClick={() => onNavigateToTab('pacientes')}
                          className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition flex items-center gap-1.5 shadow-2xs"
                          title="Ir para a carteira de pacientes desta profissional"
                        >
                          <span>Ver Pacientes</span>
                          <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Rodapé Informativo */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Mostrando {filteredNutritionists.length} de {totalNutris} profissionais cadastrados.</span>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              Acesso Ativo (Prescrição Liberada)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-300 inline-block" />
              Acesso Bloqueado
            </span>
          </div>
        </div>
      </div>

      {/* Modais */}
      <NovaNutricionistaModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        clinic={clinic}
        onAddNutritionist={(data) => {
          onAddNutritionist(data);
          showToast(`Nutricionista ${data.name} cadastrada com sucesso!`);
        }}
      />

      <EditarNutricionistaModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedNutritionist(null);
        }}
        nutritionist={selectedNutritionist}
        onUpdateNutritionist={(id, updates) => {
          onUpdateNutritionist(id, updates);
          showToast('Cadastro atualizado com sucesso!');
        }}
        onDeleteNutritionist={(id) => {
          onDeleteNutritionist(id);
          showToast('Cadastro profissional removido.');
        }}
      />

      <EditarClinicaModal
        isOpen={isClinicModalOpen}
        onClose={() => setIsClinicModalOpen(false)}
        clinic={clinic}
        onSaveClinic={(updates) => {
          onUpdateClinic(updates);
          showToast('Dados da clínica atualizados com sucesso!');
        }}
      />
    </div>
  );
};
