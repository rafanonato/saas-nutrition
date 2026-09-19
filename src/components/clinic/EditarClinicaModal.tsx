import React, { useState, useEffect } from 'react';
import { X, Building2, Phone, MapPin, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';
import { ClinicTenant } from '../../types';

interface EditarClinicaModalProps {
  isOpen: boolean;
  onClose: () => void;
  clinic: ClinicTenant;
  onSaveClinic: (updates: Partial<ClinicTenant>) => void;
}

export const EditarClinicaModal: React.FC<EditarClinicaModalProps> = ({
  isOpen,
  onClose,
  clinic,
  onSaveClinic
}) => {
  const [name, setName] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [plan, setPlan] = useState<'free_trial' | 'pro' | 'enterprise'>('pro');

  useEffect(() => {
    if (clinic) {
      setName(clinic.name);
      setTradeName(clinic.tradeName || '');
      setCnpj(clinic.cnpj || '');
      setPhone(clinic.phone || '');
      setAddress(clinic.address || '');
      setPlan(clinic.plan || 'pro');
    }
  }, [clinic, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSaveClinic({
      name: name.trim(),
      tradeName: tradeName.trim() || undefined,
      cnpj: cnpj.trim() || undefined,
      phone: phone.trim() || undefined,
      address: address.trim() || undefined,
      plan
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header do Modal */}
        <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Building2 className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Configurações da Clínica (Tenant Global)</h3>
              <p className="text-xs text-slate-300">
                Camada institucional e identidade jurídica da clínica
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
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Razão Social da Clínica *
            </label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nome Fantasia (Exibição aos Pacientes)
              </label>
              <input 
                type="text"
                value={tradeName}
                onChange={(e) => setTradeName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                CNPJ
              </label>
              <input 
                type="text"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                placeholder="00.000.000/0001-00"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                Telefone Central
              </label>
              <input 
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Plano Institucional
              </label>
              <select 
                value={plan}
                onChange={(e) => setPlan(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
              >
                <option value="free_trial">Degustação (Até 2 Nutricionistas)</option>
                <option value="pro">Profissional Pro (Nutricionistas Ilimitadas)</option>
                <option value="enterprise">Enterprise Multi-Unidade</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Endereço Físico
            </label>
            <textarea 
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ex: Av. Paulista, 1000 - Sala 42, Bela Vista, São Paulo - SP"
              className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
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
              Salvar Dados da Clínica
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
