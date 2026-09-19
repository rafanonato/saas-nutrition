import React from 'react';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  Clock, 
  CheckCheck, 
  Share2, 
  ShieldCheck,
  Send,
  Eye,
  Sparkles
} from 'lucide-react';
import { MealPlanPdfExport } from '../../types';

interface SendHistoryCardProps {
  historyRecords: MealPlanPdfExport[];
  onOpenPdfModal: () => void;
  onResendWhatsApp?: (recordId: string) => void;
  onDownloadRecord?: (record: MealPlanPdfExport) => void;
}

export const SendHistoryCard: React.FC<SendHistoryCardProps> = ({
  historyRecords,
  onOpenPdfModal,
  onResendWhatsApp,
  onDownloadRecord
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-slate-900">Histórico de Envios & Versões do PDF</h3>
            <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
              Zero-App WhatsApp Ativo
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Documentos oficiais com hash de integridade consultáveis pela Nutricionista e pelo Paciente
          </p>
        </div>

        <button
          onClick={onOpenPdfModal}
          className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition self-start sm:self-auto cursor-pointer shadow-2xs"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Abrir Gerador de PDF</span>
        </button>
      </div>

      {/* Lista de Envios */}
      <div className="space-y-3">
        {historyRecords.map((record) => (
          <div
            key={record.id}
            className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0 mt-0.5">
                <FileText className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-slate-900">{record.title}</span>
                  <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                    {record.version}
                  </span>
                  {record.status === 'visualizado_paciente' ? (
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCheck className="w-3 h-3 text-blue-600" />
                      Visualizado pelo Paciente
                    </span>
                  ) : record.status === 'enviado_whatsapp' ? (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCheck className="w-3 h-3 text-emerald-600" />
                      Entregue via WhatsApp
                    </span>
                  ) : (
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Gerado no Prontuário
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                  <span>Enviado às {record.generatedAt}</span>
                  <span>•</span>
                  <span>{record.targetKcal} kcal</span>
                  <span>•</span>
                  <span>{record.mealsCount} refeições</span>
                  <span>•</span>
                  <span>{(record.fileSizeKb / 1024).toFixed(1)} MB</span>
                  <span>•</span>
                  <span className="font-mono text-[10px] text-slate-400">Assinado: {record.signedBy} ({record.crn})</span>
                </div>
              </div>
            </div>

            {/* Ações do Registro */}
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                onClick={onOpenPdfModal}
                className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition cursor-pointer shadow-2xs"
                title="Visualizar documento em tela cheia"
              >
                <Eye className="w-3.5 h-3.5 text-blue-600" />
                <span>Visualizar</span>
              </button>

              <button
                onClick={() => onDownloadRecord ? onDownloadRecord(record) : onOpenPdfModal()}
                className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition cursor-pointer shadow-2xs"
                title="Baixar arquivo PDF"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Baixar</span>
              </button>

              {onResendWhatsApp && (
                <button
                  onClick={() => onResendWhatsApp(record.id)}
                  className="bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition cursor-pointer shadow-2xs"
                  title="Reenviar arquivo para o WhatsApp da paciente"
                >
                  <Send className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Reenviar</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
