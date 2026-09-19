import React, { useState, useEffect } from 'react';
import { X, Edit3, Trash2, Shield, Mail, Phone, Award, Stethoscope, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { NutritionistUser } from '../../types';

interface EditarNutricionistaModalProps {
  isOpen: boolean;
  onClose: () => void;
  nutritionist: NutritionistUser | null;
  onUpdateNutritionist: (id: string, updates: Partial<NutritionistUser>) => void;
  onDeleteNutritionist: (id: string) => void;
}

export const EditarNutricionistaModal: React.FC<EditarNutricionistaModalProps> = ({
  isOpen,
  onClose,
  nutritionist,
  onUpdateNutritionist,
  onDeleteNutritionist
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [crn, setCrn] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [role, setRole] = useState<'admin_nutri' | 'nutri'>('nutri');
  const [notes, setNotes] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (nutritionist) {
      setName(nutritionist.name);
      setEmail(nutritionist.email);
      setPhone(nutritionist.phone);
      setCrn(nutritionist.crn);
      setSpecialty(nutritionist.specialty);
      setRole(nutritionist.role);
      setNotes(nutritionist.notes || '');
      setConfirmDelete(false);
    }
  }, [nutritionist, isOpen]);

  if (!isOpen || !nutritionist) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onUpdateNutritionist(nutritionist.id, {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      crn: crn.trim(),
      specialty: specialty.trim(),
      role,
      notes: notes.trim() || undefined
    });

    onClose();
  };

  const handleDelete = () => {
    onDeleteNutritionist(nutritionist.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header do Modal */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Edit3 className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Editar Cadastro Profissional</h3>
              <p className="text-xs text-slate-400">
                {nutritionist.name} • {nutritionist.crn}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-sm flex-1">
          {/* Nome e Papel */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nome da Nutricionista
              </label>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nível de Acesso
              </label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
              >
                <option value="nutri">Nutricionista</option>
                <option value="admin_nutri">Gestora Técnica / Admin</option>
              </select>
            </div>
          </div>

          {/* CRN e Especialidade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                Registro CRN
              </label>
              <input 
                type="text"
                value={crn}
                onChange={(e) => setCrn(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
                Especialidade
              </label>
              <input 
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* E-mail e Telefone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                E-mail de Acesso
              </label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                Telefone
              </label>
              <input 
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Observações Administrativas
            </label>
            <textarea 
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Zona de Exclusão ou Alerta */}
          <div className="pt-2">
            {!confirmDelete ? (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="text-xs text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Excluir nutricionista da clínica
              </button>
            ) : (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-rose-800">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Tem certeza? Esta ação revoga todos os acessos deste perfil.</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="px-2.5 py-1 text-slate-600 hover:bg-slate-200/50 rounded font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded font-semibold transition-colors"
                  >
                    Sim, excluir
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Rodapé / Ações */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
