import React, { useState } from 'react';
import { X, UserPlus, Shield, Mail, Phone, Award, Stethoscope, FileText, CheckCircle2 } from 'lucide-react';
import { ClinicTenant } from '../../types';

interface NovaNutricionistaModalProps {
  isOpen: boolean;
  onClose: () => void;
  clinic: ClinicTenant;
  onAddNutritionist: (data: {
    name: string;
    email: string;
    phone: string;
    crn: string;
    specialty: string;
    role: 'admin_nutri' | 'nutri';
    notes?: string;
  }) => void;
}

export const NovaNutricionistaModal: React.FC<NovaNutricionistaModalProps> = ({
  isOpen,
  onClose,
  clinic,
  onAddNutritionist
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [crn, setCrn] = useState('');
  const [specialty, setSpecialty] = useState('Nutrição Esportiva & Performance');
  const [role, setRole] = useState<'admin_nutri' | 'nutri'>('nutri');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = 'Nome completo é obrigatório';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'E-mail corporativo válido é obrigatório';
    if (!phone.trim()) newErrors.phone = 'Telefone para contato é obrigatório';
    if (!crn.trim()) newErrors.crn = 'Registro CRN obrigatório (ex: CRN-3 / 48.912)';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onAddNutritionist({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      crn: crn.trim(),
      specialty: specialty.trim(),
      role,
      notes: notes.trim() || undefined
    });

    // Reset
    setName('');
    setEmail('');
    setPhone('');
    setCrn('');
    setNotes('');
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header do Modal */}
        <div className="p-6 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <UserPlus className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Cadastrar Nova Nutricionista</h3>
              <p className="text-xs text-emerald-100/80">
                Vinculada à {clinic.tradeName || clinic.name}
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
                Nome Completo da Profissional *
              </label>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Dra. Larissa Carvalho"
                className={`w-full px-3.5 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                  errors.name ? 'border-rose-300 ring-rose-200 bg-rose-50/30' : 'border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500'
                }`}
              />
              {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
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
                <option value="nutri">Nutricionista (Prontuários e Prescrição)</option>
                <option value="admin_nutri">Gestora Técnica / Admin</option>
              </select>
            </div>
          </div>

          {/* CRN e Especialidade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                Registro Profissional (CRN) *
              </label>
              <input 
                type="text"
                value={crn}
                onChange={(e) => setCrn(e.target.value)}
                placeholder="Ex: CRN-3 / 54.890"
                className={`w-full px-3.5 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                  errors.crn ? 'border-rose-300 ring-rose-200 bg-rose-50/30' : 'border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500'
                }`}
              />
              {errors.crn && <p className="text-xs text-rose-500 mt-1">{errors.crn}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
                Especialidade Principal
              </label>
              <input 
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="Ex: Nutrição Clínica Funcional"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* E-mail e Telefone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                E-mail Corporativo *
              </label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@talknutri.com.br"
                className={`w-full px-3.5 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                  errors.email ? 'border-rose-300 ring-rose-200 bg-rose-50/30' : 'border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500'
                }`}
              />
              {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                Telefone / WhatsApp Comercial *
              </label>
              <input 
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+55 11 98888-7777"
                className={`w-full px-3.5 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                  errors.phone ? 'border-rose-300 ring-rose-200 bg-rose-50/30' : 'border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500'
                }`}
              />
              {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* Observações / Bio */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Observações Administrativas (Opcional)
            </label>
            <textarea 
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Turno matutino, credenciamento Unimed / Particular."
              className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Aviso de Isolamento das Camadas */}
          <div className="p-3 bg-emerald-50/60 border border-emerald-200/70 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800">
            <Shield className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-emerald-900">Isolamento Multi-Tenant Garantido</p>
              <p className="text-emerald-700 text-[11px] mt-0.5 leading-relaxed">
                Ao cadastrar a nutricionista, sua camada de prontuários é isolada. Os pacientes cadastrados por ela pertencerão estritamente ao seu perfil, garantindo sigilo ético e conformidade com o CFN.
              </p>
            </div>
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
              Confirmar Cadastro e Liberar Acesso
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
