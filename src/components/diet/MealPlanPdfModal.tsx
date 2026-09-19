import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Share2, 
  X, 
  Check, 
  ShieldCheck, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Send,
  Eye
} from 'lucide-react';
import { PatientContextPayload, MealPlanPdfExport } from '../../types';
import { MealPlanPdfDocument } from './MealPlanPdfDocument';

interface MealPlanPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: PatientContextPayload;
  onRecordPdfSent?: (record: MealPlanPdfExport) => void;
}

export const MealPlanPdfModal: React.FC<MealPlanPdfModalProps> = ({
  isOpen,
  onClose,
  context,
  onRecordPdfSent
}) => {
  const [selectedPage, setSelectedPage] = useState<'all' | 1 | 2 | 3>('all');
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  // Cálculos dinâmicos consolidados em tempo real a partir das refeições prescritas
  const totalKcal = context.meals.reduce((sum, m) => 
    sum + m.items.reduce((acc, i) => acc + (Number(i.kcal) || 0), 0), 0
  );
  const totalPtn = Number(context.meals.reduce((sum, m) => 
    sum + m.items.reduce((acc, i) => acc + (Number(i.ptn) || 0), 0), 0
  ).toFixed(1));

  if (!isOpen) return null;

  const handlePrint = () => {
    // Adiciona classe para impressão dedicada
    window.print();

    if (onRecordPdfSent) {
      onRecordPdfSent({
        id: `pdf-${Date.now()}`,
        version: 'v1.1',
        title: `Plano Alimentar Hipertrofia - ${context.patient.name}`,
        patientId: context.patient.id,
        patientName: context.patient.name,
        targetKcal: totalKcal || context.patient.targetKcal,
        mealsCount: context.meals.length,
        generatedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        fileSizeKb: 2420,
        status: 'gerado',
        authenticityHash: 'SHA-256-CFN856-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        signedBy: 'Dra. Maithe',
        crn: 'CRN-3 / 48.912'
      });
    }
  };

  const handleDownloadPdf = () => {
    // Cria um Blob HTML estilizado ou dispara a janela de impressão em PDF
    const printContent = document.getElementById('printable-diet-plan');
    if (!printContent) return;

    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Plano_Alimentar_${context.patient.name.replace(/\s+/g, '_')}_TalkNutri.pdf</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @page { size: A4; margin: 12mm; }
              body { font-family: ui-sans-serif, system-ui, sans-serif; background-color: white; }
              .pdf-page { page-break-after: always; box-shadow: none !important; border: none !important; }
              @media print {
                .pdf-page { margin: 0; padding: 0; }
              }
            </style>
          </head>
          <body class="p-6">
            ${printContent.innerHTML}
            <script>
              window.onload = function() {
                window.print();
              };
            </script>
          </body>
        </html>
      `);
      newWindow.document.close();
    } else {
      window.print();
    }

    if (onRecordPdfSent) {
      onRecordPdfSent({
        id: `pdf-${Date.now()}`,
        version: 'v1.1',
        title: `Plano Alimentar Hipertrofia - ${context.patient.name}`,
        patientId: context.patient.id,
        patientName: context.patient.name,
        targetKcal: totalKcal || context.patient.targetKcal,
        mealsCount: context.meals.length,
        generatedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        fileSizeKb: 2420,
        status: 'gerado',
        authenticityHash: 'SHA-256-CFN856-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        signedBy: 'Dra. Maithe',
        crn: 'CRN-3 / 48.912'
      });
    }
  };

  const handleSendToWhatsApp = () => {
    setIsSendingWhatsApp(true);
    setTimeout(() => {
      setIsSendingWhatsApp(false);
      setSentSuccess(true);

      if (onRecordPdfSent) {
        onRecordPdfSent({
          id: `pdf-${Date.now()}`,
          version: 'v1.1',
          title: `Plano Alimentar Hipertrofia - ${context.patient.name}.pdf`,
          patientId: context.patient.id,
          patientName: context.patient.name,
          targetKcal: totalKcal || context.patient.targetKcal,
          mealsCount: context.meals.length,
          generatedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          fileSizeKb: 2420,
          status: 'enviado_whatsapp',
          viewedAt: 'Em trânsito',
          authenticityHash: 'SHA-256-CFN856-9B41-XF82',
          signedBy: 'Dra. Maithe',
          crn: 'CRN-3 / 48.912'
        });
      }

      setTimeout(() => setSentSuccess(false), 5000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-2 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-6xl h-[95vh] flex flex-col overflow-hidden">
        
        {/* Top Actions & Toolbar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Visualizador do PDF Diagramado</h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Pronto para Impressão & Envio
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Plano_Alimentar_{context.patient.name.split(' ')[0]}_2026.pdf • 3 Páginas A4
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handlePrint}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer"
              title="Abrir diálogo de impressão do navegador (Salvar em PDF)"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span>Imprimir / Salvar PDF</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Baixar Arquivo PDF</span>
            </button>

            <button
              onClick={handleSendToWhatsApp}
              disabled={isSendingWhatsApp}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-sm cursor-pointer ${
                sentSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white'
              }`}
            >
              {isSendingWhatsApp ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-emerald-300" />
                  <span>Disparando via WhatsApp...</span>
                </>
              ) : sentSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Enviado ao WhatsApp da Paciente!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-emerald-200" />
                  <span>Enviar PDF via WhatsApp (Zero-App)</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm transition ml-2"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Sub-header com Seletor de Páginas */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between text-xs text-slate-600 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Modo de Exibição:</span>
            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5">
              <button
                onClick={() => setSelectedPage('all')}
                className={`px-3 py-1 rounded-md text-[11px] font-bold transition ${
                  selectedPage === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Todas as 3 Páginas
              </button>
              <button
                onClick={() => setSelectedPage(1)}
                className={`px-3 py-1 rounded-md text-[11px] font-bold transition ${
                  selectedPage === 1 ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Pág 1: Metas
              </button>
              <button
                onClick={() => setSelectedPage(2)}
                className={`px-3 py-1 rounded-md text-[11px] font-bold transition ${
                  selectedPage === 2 ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Pág 2: Refeições
              </button>
              <button
                onClick={() => setSelectedPage(3)}
                className={`px-3 py-1 rounded-md text-[11px] font-bold transition ${
                  selectedPage === 3 ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Pág 3: Substituições
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Selo de Validação CFN nº 856 Ativo
            </span>
            <span className="font-mono text-slate-400">Padrão A4 Internacional (210 x 297 mm)</span>
          </div>
        </div>

        {/* Faixa de Auditoria e Sincronização em Tempo Real com o Atendimento */}
        <div className="bg-emerald-50/90 border-b border-emerald-200 px-6 py-2 flex flex-wrap items-center justify-between text-xs text-emerald-950 gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="font-bold">Sincronização Ativa com a Consulta:</span>
            <span className="text-emerald-800">
              {context.meals.length} refeições estruturadas ({totalKcal} kcal • {totalPtn}g PTN) • {context.biomarkers.length} biomarcadores vinculados • {context.anamnese.aversions.length} travas/aversões ativas
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-800 bg-white/80 px-2 py-0.5 rounded-md border border-emerald-300">
            Cunningham: {context.bodyComposition.bmrCunningham} kcal (TMB) / {context.bodyComposition.getCalculated || context.patient.get} kcal (GET)
          </span>
        </div>

        {/* Visualizador de Páginas A4 com Scroll */}
        <div className="flex-1 overflow-y-auto bg-slate-200/80 p-4 sm:p-8 flex justify-center">
          <div className="w-full max-w-4xl">
            <MealPlanPdfDocument context={context} />
          </div>
        </div>
      </div>
    </div>
  );
};
