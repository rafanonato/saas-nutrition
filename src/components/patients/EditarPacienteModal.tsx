import React, { useState } from 'react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  Scale, 
  Ruler, 
  Target, 
  CheckCircle2, 
  AlertCircle,
  Save,
  Trash2
} from 'lucide-react';
import { PatientSummary } from '../../types';

interface EditarPacienteModalProps {
  isOpen: boolean;
  patient: PatientSummary | null;
  onClose: () => void;
  onUpdatePatient: (id: string, updates: Partial<PatientSummary>) => void;
  onDeletePatient?: (id: string) => void;
}

export const EditarPacienteModal: React.FC<EditarPacienteModalProps> = ({
  isOpen,
  patient,
  onClose,
  onUpdatePatient,
  onDeletePatient
}) => {
  if (!isOpen || !patient) return null;

  const [name, setName] = useState(patient.name);
  const [phone, setPhone] = useState(patient.phone);
  const [email, setEmail] = useState(patient.email || '');
  const [cpf, setCpf] = useState(patient.cpf || '');
  const [age, setAge] = useState(patient.age);
  const [height, setHeight] = useState(patient.height);
  const [weight, setWeight] = useState(patient.weight);
  const [goal, setGoal] = useState(patient.goal);
  const [targetKcal, setTargetKcal] = useState(patient.targetKcal);
  const [status, setStatus] = useState(patient.status);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSave = () => {
    onUpdatePatient(patient.id, {
      name,
      phone,
      email: email.trim() || undefined,
      cpf: cpf.trim() || undefined,
      age,
      height,
      weight,
      goal,
      targetKcal,
      status
    });
    onClose();
  };

  const handleDelete = () => {
    if (onDeletePatient) {
      onDeletePatient(patient.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden my-auto">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm">
              {patient.avatarInitials}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Editar Cadastro de Paciente</h3>
              <p className="text-xs text-slate-500">Prontuário ID: <span className="font-mono">{patient.id}</span></p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nome Completo</label>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Telefone / WhatsApp</label>
              <input 
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">E-mail</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Idade (anos)</label>
              <input 
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">CPF</label>
              <input 
                type="text"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="000.000.000-00"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Peso (kg)</label>
              <input 
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Altura (cm)</label>
              <input 
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Objetivo Clínico</label>
              <input 
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Meta Calórica (kcal)</label>
              <input 
                type="number"
                value={targetKcal}
                onChange={(e) => setTargetKcal(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-blue-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status do Paciente</label>
              <input 
                type="text"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                placeholder="Ex: Em acompanhamento, Retorno 30d, Na Sala de Espera"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-blue-400"
              />
            </div>
          </div>

          {/* Delete Danger Zone */}
          {onDeletePatient && (
            <div className="pt-4 border-t border-slate-100">
              {!confirmDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1.5 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Excluir paciente da base</span>
                </button>
              ) : (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 flex items-center justify-between">
                  <span className="text-xs text-rose-800 font-medium">Tem certeza? Esta ação removerá o prontuário.</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="text-xs text-slate-600 px-3 py-1 rounded-lg bg-white border border-slate-200 font-semibold"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="text-xs text-white px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 font-semibold"
                    >
                      Confirmar Exclusão
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full border border-slate-300 text-slate-600 hover:bg-slate-200/60 text-xs font-bold transition"
          >
            Cancelar
          </button>
          <button 
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Alterações</span>
          </button>
        </div>

      </div>
    </div>
  );
};
