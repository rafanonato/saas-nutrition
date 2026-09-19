import { ConsultationRecordingRecord, AudioTranscriptionSegment } from '../types';

const STORAGE_KEY_PREFIX = 'talknutri_recordings_';

export const INITIAL_CONSULTATION_RECORDINGS: ConsultationRecordingRecord[] = [
  {
    id: 'rec-manu-1',
    patientId: 'pat-1',
    patientName: 'Manuela Silveira',
    date: '18/09/2026 às 12:00',
    durationSeconds: 1122,
    formattedDuration: '18:42',
    status: 'processado',
    audioQualityScore: 97,
    audioSource: 'microphone_live',
    notes: 'Primeira consulta de recomposição corporal e hipertrofia. Fala nítida com diarização ativa.',
    cfnComplianceEncrypted: true,
    storageKey: 'talknutri_rec_pat-1_18092026',
    segments: [
      {
        id: 'seg-init-1',
        timestamp: '00:00:15',
        secondsOffset: 15,
        speaker: 'nutritionist',
        text: 'Olá Manuela! Seja muito bem-vinda. Vamos repassar seus hábitos e rotina de treinos hoje. A que horas você costuma treinar?',
        confidenceScore: 98
      },
      {
        id: 'seg-init-2',
        timestamp: '00:00:32',
        secondsOffset: 32,
        speaker: 'patient',
        text: 'Dra. Maithe, mudei meus treinos para as 06h45 da manhã agora! Faço musculação pesada 5 vezes na semana e depois faço 20 minutinhos de esteira moderada.',
        confidenceScore: 97,
        detectedEntities: [
          { type: 'treino', label: 'Musculação 06h45 (5x/sem)', field: 'trainingSchedule' }
        ]
      },
      {
        id: 'seg-init-3',
        timestamp: '00:01:05',
        secondsOffset: 65,
        speaker: 'nutritionist',
        text: 'Excelente, já registrei o horário metabólico de força às 06h45. E em relação à comida: algum alimento que você não tolere, sinta náusea ou aversão severa?',
        confidenceScore: 99
      },
      {
        id: 'seg-init-4',
        timestamp: '00:01:24',
        secondsOffset: 84,
        speaker: 'patient',
        text: 'Dra., por favor, não coloque batata-doce! Tenho uma aversão e enjoo horrível desde a gravidez. E leite comum me causa uma distensão e estufamento forte.',
        confidenceScore: 96,
        detectedEntities: [
          { type: 'aversao', label: 'Batata-Doce (Enjoo Severo)', field: 'aversions' },
          { type: 'aversao', label: 'Lactose / Leite (Distensão)', field: 'aversions' }
        ]
      },
      {
        id: 'seg-init-5',
        timestamp: '00:01:58',
        secondsOffset: 118,
        speaker: 'nutritionist',
        text: 'Batata-doce e leite tradicional estão formalmente bloqueados na matriz de escolhas. E como está a função intestinal e o volume de água?',
        confidenceScore: 98
      },
      {
        id: 'seg-init-6',
        timestamp: '00:02:15',
        secondsOffset: 135,
        speaker: 'patient',
        text: 'Meu intestino continua muito ressecado, fezes em bolinhas tipo 2 encaroçadas, fico 3 dias sem evacuar. Bebo em média 2.2 litros de água por dia.',
        confidenceScore: 97,
        detectedEntities: [
          { type: 'bristol', label: 'Escala Bristol Tipo 2 (Constipação)', field: 'bristolType' },
          { type: 'agua', label: '2.2 L / dia atual', field: 'hydrationLiters' }
        ]
      }
    ],
    summaryExtracted: {
      mainComplaints: 'Constipação intestinal severa (Bristol 2) e sonolência pós-prandial.',
      training: '06:45 às 08:00 (Musculação Força 5x/sem + Cárdio Zona 2)',
      sleep: '6h30 / noite (sono fragmentado, acorda cansada)',
      hydration: '2.8 L / dia (Calculado: 35ml/kg)',
      bristolType: 2,
      aversions: ['Batata-Doce (Náusea gustativa)', 'Lactose (Distensão abdominal)']
    }
  }
];

/**
 * Carrega a lista de gravações persistidas para um paciente específico
 */
export function getPatientRecordings(patientId: string): ConsultationRecordingRecord[] {
  if (typeof window === 'undefined') {
    return INITIAL_CONSULTATION_RECORDINGS.filter(r => r.patientId === patientId);
  }

  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${patientId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('[AudioStorage] Falha ao ler localStorage:', e);
  }

  // Se não encontrar, retorna do mock e salva no storage
  const defaults = INITIAL_CONSULTATION_RECORDINGS.filter(r => r.patientId === patientId);
  if (defaults.length > 0) {
    savePatientRecordings(patientId, defaults);
  }
  return defaults;
}

/**
 * Salva a lista de gravações persistidas para um paciente
 */
export function savePatientRecordings(patientId: string, recordings: ConsultationRecordingRecord[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${patientId}`, JSON.stringify(recordings));
  } catch (e) {
    console.warn('[AudioStorage] Erro ao salvar no localStorage:', e);
  }
}

/**
 * Adiciona ou atualiza uma gravação no histórico do paciente
 */
export function upsertPatientRecording(recording: ConsultationRecordingRecord): ConsultationRecordingRecord[] {
  const current = getPatientRecordings(recording.patientId);
  const index = current.findIndex(r => r.id === recording.id);

  let updated: ConsultationRecordingRecord[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = recording;
  } else {
    updated = [recording, ...current];
  }

  savePatientRecordings(recording.patientId, updated);
  return updated;
}

/**
 * Deleta uma gravação do histórico
 */
export function deletePatientRecording(patientId: string, recordingId: string): ConsultationRecordingRecord[] {
  const current = getPatientRecordings(patientId);
  const updated = current.filter(r => r.id !== recordingId);
  savePatientRecordings(patientId, updated);
  return updated;
}

/**
 * Converte Blob de áudio para DataURL base64 para persistência segura
 */
export function audioBlobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Falha ao converter áudio'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
