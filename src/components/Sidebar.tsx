import React from 'react';
import { Home, Users, Settings, Activity } from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  return (
    <aside 
      id="main-sidebar"
      className="w-18 bg-white border-r border-slate-200 flex flex-col items-center py-5 gap-7 z-20 shrink-0 select-none shadow-[1px_0_3px_rgba(0,0,0,0.03)]"
    >
      {/* Brand Logo */}
      <div 
        onClick={() => onSelectTab('dashboard')}
        className="w-11 h-11 bg-gradient-to-tr from-blue-700 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md cursor-pointer hover:scale-105 transition-transform"
        title="TalkNutri - SaaS Nutrição 2.0"
      >
        <span>N</span>
      </div>

      {/* Navigation Icons */}
      <nav className="flex flex-col gap-3 w-full items-center">
        <button
          id="nav-btn-dashboard"
          onClick={() => onSelectTab('dashboard')}
          className={`p-3 rounded-2xl transition-all duration-200 relative group ${
            activeTab === 'dashboard'
              ? 'bg-blue-50 text-blue-600 shadow-sm'
              : 'text-slate-400 hover:text-blue-600 hover:bg-slate-50'
          }`}
          title="Dashboard & Agenda"
        >
          <Home className="w-5 h-5" />
          <span className="sr-only">Dashboard</span>
          {activeTab === 'dashboard' && (
            <span className="absolute -left-1 top-2.5 bottom-2.5 w-1 bg-blue-600 rounded-r-full" />
          )}
        </button>

        <button
          id="nav-btn-clinical"
          onClick={() => onSelectTab('editor')}
          className={`p-3 rounded-2xl transition-all duration-200 relative group ${
            ['anamnese', 'avaliacao', 'editor', 'finalizar'].includes(activeTab)
              ? 'bg-blue-50 text-blue-600 shadow-sm'
              : 'text-slate-400 hover:text-blue-600 hover:bg-slate-50'
          }`}
          title="Atendimento Clínico & Dieta"
        >
          <Activity className="w-5 h-5" />
          <span className="sr-only">Atendimento Clínico</span>
          {['anamnese', 'avaliacao', 'editor', 'finalizar'].includes(activeTab) && (
            <span className="absolute -left-1 top-2.5 bottom-2.5 w-1 bg-blue-600 rounded-r-full" />
          )}
        </button>

        <button
          id="nav-btn-pacientes"
          onClick={() => onSelectTab('pacientes')}
          className={`p-3 rounded-2xl transition-all duration-200 relative group ${
            activeTab === 'pacientes'
              ? 'bg-blue-50 text-blue-600 shadow-sm'
              : 'text-slate-400 hover:text-blue-600 hover:bg-slate-50'
          }`}
          title="Base de Pacientes"
        >
          <Users className="w-5 h-5" />
          <span className="sr-only">Pacientes</span>
          {activeTab === 'pacientes' && (
            <span className="absolute -left-1 top-2.5 bottom-2.5 w-1 bg-blue-600 rounded-r-full" />
          )}
        </button>

        <button
          id="nav-btn-config"
          onClick={() => onSelectTab('configuracoes')}
          className={`p-3 rounded-2xl transition-all duration-200 relative group ${
            activeTab === 'configuracoes'
              ? 'bg-blue-50 text-blue-600 shadow-sm'
              : 'text-slate-400 hover:text-blue-600 hover:bg-slate-50'
          }`}
          title="Configurações Clínicas & Solver"
        >
          <Settings className="w-5 h-5" />
          <span className="sr-only">Configurações</span>
          {activeTab === 'configuracoes' && (
            <span className="absolute -left-1 top-2.5 bottom-2.5 w-1 bg-blue-600 rounded-r-full" />
          )}
        </button>
      </nav>

      {/* Doctor profile avatar at bottom */}
      <div className="mt-auto flex flex-col items-center gap-2">
        <div 
          className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-200 to-blue-100 border-2 border-white shadow-sm flex items-center justify-center text-blue-700 font-semibold text-xs cursor-pointer hover:ring-2 hover:ring-blue-400 transition"
          title="Dra. Camila Silveira (CRN-3 / 48.912)"
        >
          DC
        </div>
        <span className="text-[10px] font-medium text-slate-400">CRN-3</span>
      </div>
    </aside>
  );
};
