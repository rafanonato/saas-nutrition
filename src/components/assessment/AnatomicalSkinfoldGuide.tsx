import React, { useState } from 'react';
import { 
  Scissors, 
  CheckCircle2, 
  HelpCircle, 
  Mic, 
  RotateCcw, 
  Sparkles, 
  ChevronRight,
  Info
} from 'lucide-react';
import { Skinfolds, SkinfoldProtocol } from '../../types';

interface AnatomicalSkinfoldGuideProps {
  skinfolds: Skinfolds;
  protocol: SkinfoldProtocol;
  onChangeProtocol: (protocol: SkinfoldProtocol) => void;
  onUpdateSkinfold: (key: keyof Skinfolds, value: number) => void;
  onVoiceDictateAll: () => void;
}

interface AnatomicalPoint {
  id: keyof Skinfolds;
  name: string;
  shortName: string;
  orientation: 'Vertical' | 'Oblíqua' | 'Horizontal';
  location: string;
  technique: string;
  isKeyPointWomen: boolean; // Usada em JP 3
  svgX: number; // Porcentagem no diagrama
  svgY: number;
}

const ANATOMICAL_POINTS: AnatomicalPoint[] = [
  {
    id: 'triceps',
    name: 'Tricipital (TR)',
    shortName: 'Tríceps',
    orientation: 'Vertical',
    location: 'Face posterior do braço direito, paralela ao eixo longitudinal.',
    technique: 'Ponto médio entre a borda súpero-lateral do acrômio e o ápice do olécrano. Braço relaxado e solto.',
    isKeyPointWomen: true,
    svgX: 18,
    svgY: 28
  },
  {
    id: 'subscapular',
    name: 'Subescapular (SE)',
    shortName: 'Subescap.',
    orientation: 'Oblíqua',
    location: '2 cm abaixo do ângulo inferior da escápula direita.',
    technique: 'Dobra destacada obliquamente a 45º para baixo e para fora, seguindo as linhas de tensão cutânea.',
    isKeyPointWomen: false,
    svgX: 30,
    svgY: 34
  },
  {
    id: 'axillary',
    name: 'Axilar Média (AM)',
    shortName: 'Axilar Média',
    orientation: 'Horizontal',
    location: 'Intersecção da linha axilar média com o nível da apófise xifoide do esterno.',
    technique: 'Braço direito ligeiramente abduzido ou apoiado sobre o ombro do avaliador para facilitar a pega.',
    isKeyPointWomen: false,
    svgX: 35,
    svgY: 42
  },
  {
    id: 'suprailiac',
    name: 'Suprailíaca (SI)',
    shortName: 'Suprailíaca',
    orientation: 'Oblíqua',
    location: 'Linha axilar anterior, imediatamente acima da crista ilíaca.',
    technique: 'Dobra destacada com inclinação anteroinferior (ângulo de 45º em direção à sínfise púbica).',
    isKeyPointWomen: true,
    svgX: 37,
    svgY: 53
  },
  {
    id: 'abdominal',
    name: 'Abdominal (AB)',
    shortName: 'Abdominal',
    orientation: 'Vertical',
    location: '2 cm à direita da borda lateral da cicatriz umbilical.',
    technique: 'Dobra estritamente vertical pinçada com o polegar e indicador esquerdos. Abdômen relaxado sem apneia.',
    isKeyPointWomen: false,
    svgX: 49,
    svgY: 52
  },
  {
    id: 'pectoral',
    name: 'Peitoral / Torácica (PE)',
    shortName: 'Peitoral',
    orientation: 'Oblíqua',
    location: 'Entre a prega axilar anterior e o mamilo.',
    technique: 'Para mulheres: destacada a 1/3 da distância da linha axilar anterior. Para homens: a meia distância.',
    isKeyPointWomen: false,
    svgX: 43,
    svgY: 33
  },
  {
    id: 'thigh',
    name: 'Coxa Medial (CX)',
    shortName: 'Coxa Med.',
    orientation: 'Vertical',
    location: 'Face anterior da coxa, paralela ao eixo longitudinal.',
    technique: 'Ponto médio entre a dobra inguinal e a borda proximal da patela. Peso corporal apoiado na perna contralateral.',
    isKeyPointWomen: true,
    svgX: 46,
    svgY: 72
  }
];

export const AnatomicalSkinfoldGuide: React.FC<AnatomicalSkinfoldGuideProps> = ({
  skinfolds,
  protocol,
  onChangeProtocol,
  onUpdateSkinfold,
  onVoiceDictateAll
}) => {
  const [selectedPointId, setSelectedPointId] = useState<keyof Skinfolds>('suprailiac');
  const [isDictating, setIsDictating] = useState(false);

  const selectedPoint = ANATOMICAL_POINTS.find(p => p.id === selectedPointId) || ANATOMICAL_POINTS[0];

  const handleStartVoice = () => {
    setIsDictating(true);
    setTimeout(() => {
      onVoiceDictateAll();
      setIsDictating(false);
    }, 800);
  };

  const isPointInProtocol = (point: AnatomicalPoint): boolean => {
    if (protocol === 'jp7') return true;
    if (protocol === 'jp3') return point.isKeyPointWomen;
    if (protocol === 'faulkner') return ['triceps', 'subscapular', 'suprailiac', 'abdominal'].includes(point.id);
    return true;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
      {/* Header & Seletor de Protocolo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Scissors className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Guia Anatômico & Protocolos de Dobras Cutâneas
            </h3>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
              Plicômetro Clínico
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Clique nos pontos anatômicos para instruções de pinçamento e ajuste milimétrico em tempo real.
          </p>
        </div>

        {/* Protocol Selector Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => onChangeProtocol('jp7')}
            className={`px-2.5 py-1 rounded-lg transition text-[11px] ${
              protocol === 'jp7' 
                ? 'bg-white text-emerald-800 shadow-2xs font-bold' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Jackson & Pollock 7D
          </button>
          <button
            type="button"
            onClick={() => onChangeProtocol('jp3')}
            className={`px-2.5 py-1 rounded-lg transition text-[11px] ${
              protocol === 'jp3' 
                ? 'bg-white text-emerald-800 shadow-2xs font-bold' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            J&P 3D (Mulheres)
          </button>
          <button
            type="button"
            onClick={() => onChangeProtocol('faulkner')}
            className={`px-2.5 py-1 rounded-lg transition text-[11px] ${
              protocol === 'faulkner' 
                ? 'bg-white text-emerald-800 shadow-2xs font-bold' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Faulkner (4D)
          </button>
        </div>
      </div>

      {/* Main Grid: Mapa Anatômico Esquemático + Card de Pinçamento Detalhado */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        {/* Lado Esquerdo: Representação Esquemática Anatômica (5 colunas) */}
        <div className="md:col-span-5 bg-slate-900 rounded-2xl p-4 text-white relative min-h-[340px] flex flex-col justify-between overflow-hidden border border-slate-800">
          <div className="flex items-center justify-between text-[11px] text-slate-400 z-10">
            <span>Mapa Corporal 2D</span>
            <span className="font-mono text-emerald-400 font-bold">Lado Direito Padrão ISAK</span>
          </div>

          {/* SVG Silhouette do Corpo Humano com Pontos de Pinçamento */}
          <div className="relative w-full h-64 my-auto flex items-center justify-center">
            {/* Silhueta esquemática estilizada em SVG */}
            <svg 
              viewBox="0 0 200 320" 
              className="w-full h-full max-h-60 opacity-25 text-slate-400"
              fill="currentColor"
            >
              {/* Cabeça */}
              <circle cx="100" cy="25" r="16" />
              {/* Pescoço e Tronco */}
              <path d="M92 42 h16 l6 12 l24 14 l-6 70 l-10 40 l-18 6 l-18 -6 l-10 -40 l-6 -70 l24 -14 z" />
              {/* Braço Direito (do avaliado) */}
              <path d="M68 68 l-18 45 l-10 50 l6 6 l14 -44 l14 -45 z" />
              {/* Braço Esquerdo */}
              <path d="M132 68 l18 45 l10 50 l-6 6 l-14 -44 l-14 -45 z" />
              {/* Pernas */}
              <path d="M84 180 l-8 65 l-6 60 h16 l12 -65 l6 -60 z" />
              <path d="M116 180 l8 65 l6 60 h-16 l-12 -65 l-6 -60 z" />
            </svg>

            {/* Marcadores Interativos Clicáveis */}
            {ANATOMICAL_POINTS.map((pt) => {
              const inProtocol = isPointInProtocol(pt);
              const isSelected = selectedPointId === pt.id;
              const val = skinfolds[pt.id];

              return (
                <button
                  key={pt.id}
                  type="button"
                  onClick={() => setSelectedPointId(pt.id)}
                  style={{ left: `${pt.svgX}%`, top: `${pt.svgY}%` }}
                  title={`${pt.name}: ${val} mm`}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-all duration-200 z-20 ${
                    !inProtocol 
                      ? 'opacity-30 cursor-not-allowed w-4 h-4 bg-slate-700 text-slate-400 text-[8px]' 
                      : isSelected 
                      ? 'w-7 h-7 bg-emerald-500 text-slate-950 font-bold ring-4 ring-emerald-400/40 shadow-lg scale-110' 
                      : 'w-5 h-5 bg-slate-800 text-emerald-400 border border-emerald-500/50 hover:scale-110 hover:bg-emerald-600 hover:text-white'
                  }`}
                >
                  <span className="text-[9px] font-bold">
                    {pt.shortName.substring(0, 2).toUpperCase()}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 z-10 pt-2 border-t border-slate-800">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Ativa no protocolo
            </span>
            <span>Protocolo: {protocol.toUpperCase()}</span>
          </div>
        </div>

        {/* Lado Direito: Instrução Técnica de Pinçamento + Input Rápido (7 colunas) */}
        <div className="md:col-span-7 space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100/60 px-2 py-0.5 rounded-md">
                  Dobra Selecionada: {selectedPoint.orientation}
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-1">
                  {selectedPoint.name}
                </h4>
              </div>

              {/* Input Direto de Medida */}
              <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-xl px-3 py-1.5 shadow-2xs">
                <span className="text-xs font-semibold text-slate-500">Medida:</span>
                <input 
                  type="number" 
                  step="0.1" 
                  min="2" 
                  max="60"
                  value={skinfolds[selectedPoint.id]} 
                  onChange={(e) => onUpdateSkinfold(selectedPoint.id, parseFloat(e.target.value) || 0)}
                  className="w-16 text-center font-bold text-base text-slate-900 outline-none focus:text-emerald-700"
                />
                <span className="text-xs font-bold text-slate-400">mm</span>
              </div>
            </div>

            {/* Detalhes Técnicos de Execução */}
            <div className="space-y-2 text-xs text-slate-700">
              <div>
                <span className="font-bold text-slate-900 block text-[11px] mb-0.5">Localização Anatômica:</span>
                <p className="bg-white p-2.5 rounded-xl border border-slate-200 leading-relaxed text-slate-600">
                  {selectedPoint.location}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-900 block text-[11px] mb-0.5">Técnica de Pinçamento com Adipômetro:</span>
                <p className="bg-white p-2.5 rounded-xl border border-slate-200 leading-relaxed text-slate-600">
                  {selectedPoint.technique}
                </p>
              </div>
            </div>

            {/* Dica Clínica de Precisão */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-2.5 text-xs text-blue-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span className="leading-tight">
                Aplique a pressão das hastes por 2 segundos antes da leitura para dissipar o fluido intersticial, 
                mantendo a prega sustentada pela mão esquerda a 1 cm do ponto de medição.
              </span>
            </div>
          </div>

          {/* Barra de Ação Rápida: Ditado por Voz em Tempo Real */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleStartVoice}
                disabled={isDictating}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs transition shadow-2xs ${
                  isDictating
                    ? 'bg-emerald-600 text-white animate-pulse'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{isDictating ? 'Captando Ditado...' : 'Simular Ditado das 7 Dobras'}</span>
              </button>
              <span className="text-[11px] text-emerald-900 font-medium hidden sm:inline">
                "Suprailíaca 16.2, abdominal 18.0, tríceps 14..."
              </span>
            </div>

            <span className="text-xs font-bold text-emerald-900 bg-white border border-emerald-200 px-3 py-1 rounded-xl">
              Soma: {skinfolds.sum7.toFixed(1)} mm
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
