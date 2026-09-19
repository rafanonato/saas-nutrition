import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  Scan, 
  Sparkles, 
  ShieldCheck, 
  Info,
  ArrowRight,
  Eye
} from 'lucide-react';
import { Biomarker } from '../../types';

interface ExamOcrModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportBiomarkers: (importedBiomarkers: Biomarker[]) => void;
}

export const ExamOcrModal: React.FC<ExamOcrModalProps> = ({
  isOpen,
  onClose,
  onImportBiomarkers
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(true);
  const [activeTab, setActiveTab] = useState<'normal' | 'low_res_error' | 'extreme_outlier'>('normal');
  const [outlierConfirmed, setOutlierConfirmed] = useState(false);

  if (!isOpen) return null;

  const mockBiomarkersStandard: Biomarker[] = [
    {
      id: 'ocr-1',
      name: 'Ferritina Sérica',
      unit: 'ng/mL',
      result: 18,
      conventionalRef: '10 a 120 ng/mL',
      functionalTarget: '50 a 150 ng/mL',
      status: 'critico',
      interpretation: 'DEFICIÊNCIA FUNCIONAL: Reserva de ferro esgotada. Indicação de Ferro Bisglicinato 30mg + Vitamina C.',
      date: '10/09/2026',
      ocrConfidence: 99.2
    },
    {
      id: 'ocr-2',
      name: '25-Hidroxivitamina D (25-OH-D)',
      unit: 'ng/mL',
      result: 24,
      conventionalRef: '20 a 60 ng/mL',
      functionalTarget: '40 a 60 ng/mL',
      status: 'alerta',
      interpretation: 'SUBÓTIMA P/ HIPERTROFIA: Suporte imunometabólico defasado. Recomenda-se 3.000 UI/dia.',
      date: '10/09/2026',
      ocrConfidence: 98.7
    },
    {
      id: 'ocr-3',
      name: 'Glicemia de Jejum',
      unit: 'mg/dL',
      result: 92,
      conventionalRef: '70 a 99 mg/dL',
      functionalTarget: '75 a 85 mg/dL',
      status: 'normal',
      interpretation: 'EUGLEMICIDADE: Controle glicêmico preservado.',
      date: '10/09/2026',
      ocrConfidence: 99.8
    },
    {
      id: 'ocr-4',
      name: 'Proteína C-Reativa Ultrassensível (PCR-us)',
      unit: 'mg/L',
      result: 0.8,
      conventionalRef: '< 1.0 mg/L',
      functionalTarget: '< 0.5 mg/L',
      status: 'normal',
      interpretation: 'BAIXO RISCO INFLAMATÓRIO SISTÊMICO.',
      date: '10/09/2026',
      ocrConfidence: 97.4
    },
    {
      id: 'ocr-5',
      name: 'TSH Ultra Sensível',
      unit: 'μUI/mL',
      result: 2.1,
      conventionalRef: '0.4 a 4.5 μUI/mL',
      functionalTarget: '1.0 a 2.5 μUI/mL',
      status: 'normal',
      interpretation: 'EUTIREOIDISMO FUNCIONAL: Metabolismo basal sem restrição tireoidiana.',
      date: '10/09/2026',
      ocrConfidence: 99.0
    }
  ];

  const mockBiomarkersOutlier: Biomarker[] = [
    {
      id: 'ocr-outlier-1',
      name: 'Glicemia de Jejum (ALERTA OUTLIER)',
      unit: 'mg/dL',
      result: 950,
      conventionalRef: '70 a 99 mg/dL',
      functionalTarget: '75 a 85 mg/dL',
      status: 'critico',
      interpretation: 'DESVIO DE 950%: Suspeita de erro de digitação/OCR no laudo original (possível 95.0 mg/dL). Bloqueio preventivo.',
      date: '10/09/2026',
      isOutlier: true,
      ocrConfidence: 88.0
    },
    mockBiomarkersStandard[0],
    mockBiomarkersStandard[1]
  ];

  const handleSimulateScan = (mode: 'normal' | 'low_res_error' | 'extreme_outlier') => {
    setActiveTab(mode);
    setIsScanning(true);
    setScanComplete(false);
    setOutlierConfirmed(false);

    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 900);
  };

  const handleApply = () => {
    if (activeTab === 'extreme_outlier' && !outlierConfirmed) {
      alert('Atenção: Confirme a validação manual do valor aberrante antes de gravar no prontuário.');
      return;
    }
    const toImport = activeTab === 'extreme_outlier' ? mockBiomarkersOutlier : mockBiomarkersStandard;
    onImportBiomarkers(toImport);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold">Pipeline de Ingestão OCR & Analisador de Laudos</h3>
                <span className="text-[10px] uppercase font-bold bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded-md border border-blue-400/30">
                  RF-02 Normatizado
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Isolamento de analitos bioquímicos, normalização de unidades e mapeamento contra faixas funcionais
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white rounded-lg p-1.5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Simulator Selector Bar */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-bold text-slate-600 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Cenários de Teste RF-02:
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSimulateScan('normal')}
              className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer text-[11px] ${
                activeTab === 'normal' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              1. Laudo Nítido (98.4% Confiança)
            </button>
            <button
              onClick={() => handleSimulateScan('low_res_error')}
              className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer text-[11px] ${
                activeTab === 'low_res_error' 
                  ? 'bg-amber-600 text-white shadow-xs' 
                  : 'bg-white text-amber-900 hover:bg-amber-50 border border-amber-200'
              }`}
            >
              2. Exceção: Laudo &lt; 150 DPI (Ilegível)
            </button>
            <button
              onClick={() => handleSimulateScan('extreme_outlier')}
              className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer text-[11px] ${
                activeTab === 'extreme_outlier' 
                  ? 'bg-rose-600 text-white shadow-xs' 
                  : 'bg-white text-rose-900 hover:bg-rose-50 border border-rose-200'
              }`}
            >
              3. Exceção: Outlier Extremo (&gt;300%)
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* File Card & Scanner Visualizer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Visualizer da Imagem/PDF com Linha Laser */}
            <div className="md:col-span-1 bg-slate-900 rounded-2xl p-4 text-white relative overflow-hidden flex flex-col justify-between border border-slate-800">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px]">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  exame_manuela_fleury.pdf
                </span>
                <span className="text-[10px] text-slate-400">1.8 MB</span>
              </div>

              {/* Simulação de Folha de Laudo com laser de leitura */}
              <div className="my-4 relative bg-slate-800 rounded-lg p-3 text-[10px] font-mono leading-relaxed text-slate-300 border border-slate-700 shadow-inner">
                {isScanning && (
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] animate-pulse transition-all top-1/2" />
                )}
                <div className="text-slate-500 font-bold border-b border-slate-700 pb-1 mb-1">LAB FLEURY - PAINEL BIOQUÍMICO</div>
                <div>PACIENTE: MANUELA ROCCHETTO</div>
                <div>FERRITINA SÉRICA: <span className="text-rose-400 font-bold">18 ng/mL</span></div>
                <div>25-OH VITAMINA D: <span className="text-amber-400 font-bold">24 ng/mL</span></div>
                <div>GLICEMIA DE JEJUM: {activeTab === 'extreme_outlier' ? <span className="text-rose-500 font-bold">950 mg/dL (!)</span> : '92 mg/dL'}</div>
                <div>PCR-ULTRASSENSÍVEL: 0.8 mg/L</div>
                <div>TSH ULTRA SENSÍVEL: 2.1 μUI/mL</div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800">
                <span className="text-slate-400">Status OCR:</span>
                {activeTab === 'low_res_error' ? (
                  <span className="font-bold text-amber-400">112 DPI • Ilegível (&lt;150 DPI)</span>
                ) : (
                  <span className="font-bold text-emerald-400">300 DPI • Aprovado (98.4%)</span>
                )}
              </div>
            </div>

            {/* Explicação e Diagnóstico */}
            <div className="md:col-span-2 flex flex-col justify-between space-y-3">
              {activeTab === 'low_res_error' ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-900 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-amber-800">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    Regra de Exceção RF-02 Disparada: Laudo em Baixa Resolução (&lt; 150 DPI)
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    O laudo importado possui densidade óptica inferior ao limiar clínico seguro de 150 DPI (detectado: 112 DPI).
                    Para evitar erro de dosagem em biomarcadores críticos, o preenchimento automático está bloqueado.
                  </p>
                  <div className="bg-white/80 p-3 rounded-xl border border-amber-200 text-xs font-medium text-amber-950">
                    <strong>Ação Recomendada:</strong> Solicite à paciente o envio do arquivo PDF original exportado pelo laboratório ou insira manualmente as dosagens abaixo.
                  </div>
                </div>
              ) : activeTab === 'extreme_outlier' ? (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-900 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-rose-800">
                    <AlertOctagon className="w-5 h-5 text-rose-600" />
                    Regra de Exceção RF-02 Disparada: Desvio Extremo de Biomarcador (&gt; 300%)
                  </div>
                  <p className="text-xs text-rose-800 leading-relaxed">
                    Detectado valor de <strong>Glicemia de Jejum em 950 mg/dL</strong> (desvio superior a 950% da média biológica). 
                    O sistema bloqueia a gravação imediata para prevenir condutas iatrogênicas ou prescrições inadequadas.
                  </p>
                  <label className="flex items-center gap-2 text-xs font-bold text-rose-900 bg-white p-2.5 rounded-xl border border-rose-300 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={outlierConfirmed} 
                      onChange={(e) => setOutlierConfirmed(e.target.checked)}
                      className="rounded text-rose-600 w-4 h-4"
                    />
                    <span>Confirmo que verifiquei o laudo original (ou corrijo para 95.0 mg/dL antes de salvar)</span>
                  </label>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-950 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    Validação OCR Aprovada com Sucesso
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    5 analitos extraídos com confiança média de 98.4%. As unidades foram devidamente normalizadas (mg/dL e ng/mL)
                    e comparadas simultaneamente com as faixas de referência convencionais e as faixas funcionais esportivas.
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Ferritina baixa detectada: Copiloto alimentará sugestão de suplementação no módulo de finalização.</span>
                  </div>
                </div>
              )}

              {/* Badges de Metadados */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2">
                  <span className="text-[10px] text-slate-500 block">Laboratório</span>
                  <span className="font-bold text-slate-800">Grupo Fleury</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2">
                  <span className="text-[10px] text-slate-500 block">Data Coleta</span>
                  <span className="font-bold text-slate-800">10/09/2026</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2">
                  <span className="text-[10px] text-slate-500 block">Criptografia</span>
                  <span className="font-bold text-slate-800">AES-256 Cloud</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabela de Analitos com Comparativo de Faixas */}
          {activeTab !== 'low_res_error' && (
            <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 uppercase font-semibold text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Biomarcador Isolado</th>
                    <th className="py-2.5 px-3 text-center">Dosagem Extraída</th>
                    <th className="py-2.5 px-3 text-center">Faixa Convencional</th>
                    <th className="py-2.5 px-3 text-center">Alvo Funcional (Longevidade)</th>
                    <th className="py-2.5 px-3">Interpretação Clínica do Copiloto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(activeTab === 'extreme_outlier' ? mockBiomarkersOutlier : mockBiomarkersStandard).map((bio) => (
                    <tr key={bio.id} className="hover:bg-slate-50 transition">
                      <td className="py-2.5 px-3 font-semibold text-slate-800">
                        {bio.name}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          bio.isOutlier 
                            ? 'bg-rose-600 text-white animate-pulse' 
                            : bio.status === 'critico' 
                            ? 'bg-rose-100 text-rose-800 border border-rose-300' 
                            : bio.status === 'alerta'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-emerald-50 text-emerald-800'
                        }`}>
                          {bio.result} {bio.unit}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-500">{bio.conventionalRef}</td>
                      <td className="py-2.5 px-3 text-center font-medium text-blue-700 bg-blue-50/50">{bio.functionalTarget}</td>
                      <td className="py-2.5 px-3 text-slate-700 text-[11px]">
                        {bio.interpretation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            <span>Dados protegidos pelo sigilo profissional e pela LGPD Médica.</span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
            >
              Cancelar
            </button>
            <button 
              type="button"
              onClick={handleApply}
              disabled={activeTab === 'low_res_error' || (activeTab === 'extreme_outlier' && !outlierConfirmed)}
              className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-xs flex items-center gap-2 transition ${
                activeTab === 'low_res_error' || (activeTab === 'extreme_outlier' && !outlierConfirmed)
                  ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <span>Sincronizar Analitos com o Prontuário</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
