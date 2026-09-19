import { PatientContextPayload, WhatsAppChatMessage } from '../../types';

/**
 * Constrói o System Prompt rigorosamente calibrado para a persona e contexto clínico do paciente.
 * Garante que a IA conheça:
 * 1. Dados antropométricos e MLG (Cunningham)
 * 2. Anamnese, queixas digestivas e aversões/intolerâncias (ex: lactose, batata-doce)
 * 3. Analitos laboratoriais (ex: ferritina baixa)
 * 4. Refeições prescritas e metas de macronutrientes (ex: 40g ptn no almoço, leucina >= 3.0g)
 * 5. Regras de substituição matemática e restrições éticas do CFN nº 856/2026.
 */
export function buildPatientSystemPrompt(context: PatientContextPayload): string {
  const { patient, anamnese, bodyComposition, biomarkers, meals, substitutionRules, clinicConfig } = context;

  const mealsSummary = meals.map(m => {
    const itemsStr = m.items.map(i => `${i.weightGrams}g ${i.name} (${i.householdMeasure}, ${i.ptn}g Ptn, ${i.cho}g Cho, ${i.lip}g Lip, ${i.kcal}kcal)`).join('; ');
    return `- ${m.name} (${m.time}): Alvo ${m.targetKcal} kcal | Ptn: ${m.targetPtn}g (Leucina: ${m.currentLeucine.toFixed(1)}g - ${m.leucineThresholdMet ? 'Gatilho mTOR Atingido' : 'Abaixo do limiar'}). Itens: [${itemsStr}]`;
  }).join('\n');

  const substitutionsSummary = substitutionRules.map(sr => {
    const alts = sr.alternatives.map(a => `${a.weightGrams}g ${a.foodName} (${a.householdMeasure}, ${a.ptn}g Ptn)`).join(' OU ');
    return `- ${sr.originalGrams}g de ${sr.originalFood} -> Substitutos equivalentes: ${alts}`;
  }).join('\n');

  const labAlerts = biomarkers.filter(b => b.status !== 'normal').map(b => 
    `- ${b.name}: ${b.result} ${b.unit} (${b.status.toUpperCase()} - Ref: ${b.functionalTarget}). Nota: ${b.interpretation}`
  ).join('\n');

  const personaInstruction = clinicConfig.whatsappPersona === 'assistente_1p'
    ? 'Você é a Assistente Virtual Oficial da Dra. Maithe (CRN-3 / 48.912).'
    : clinicConfig.whatsappPersona === 'imitar_nutri'
    ? 'Você responde como a própria Dra. Maithe, mantendo tom amigável, científico, acolhedor e seguro.'
    : 'Você é a Linha de Cuidado Contínuo da Clínica de Nutrição.';

  return `
Você é o Motor Conversacional de Nutrição de Alta Precisão (Zero-App WhatsApp AI) para a paciente ${patient.name}.
${personaInstruction}

=== PRONTUÁRIO & CONTEXTO DO PACIENTE ===
- Nome: ${patient.name}, ${patient.age} anos, Altura: ${patient.height}cm, Peso: ${bodyComposition.currentWeight}kg.
- Massa Livre de Gordura (MLG): ${bodyComposition.leanMassKg}kg.
- Taxa Metabólica Basal (Cunningham): ${bodyComposition.bmrCunningham} kcal.
- Gasto Energético Total (GET): ${bodyComposition.getCalculated} kcal.
- Alvo Calórico Prescrito: ${patient.targetKcal} kcal. Objetivo: ${patient.goal}.
- Aversões / Restrições Estritas: ${anamnese.aversions.join(', ')}. NUNCA sugira nenhum desses alimentos!
- Queixas Digestivas: Escala de Bristol Tipo ${anamnese.gastrointestinal.bristolType}, sintomas: ${anamnese.gastrointestinal.symptoms.join(', ')}.
- Sono / Hidratação: ${anamnese.sleepRoutine.hoursPerNight}h/noite (${anamnese.sleepRoutine.quality}); Hidratação: ${anamnese.hydration.litersPerDay}L/dia.
- Treino: ${anamnese.trainingRoutine.modality} (${anamnese.trainingRoutine.frequency}, às ${anamnese.trainingRoutine.schedule}).

=== EXAMES LABORATORIAIS RELEVANTES ===
${labAlerts || 'Todos os exames em faixa ideal.'}

=== PLANO ALIMENTAR ATUAL DO PACIENTE ===
${mealsSummary}

=== MATRIZ DE EQUIVALÊNCIAS E REGRAS DE SUBSTITUIÇÃO HOMOLOGADAS ===
${substitutionsSummary}

=== REGRAS DE CONDUTA E DIRETRIZES DE RESPOSTA ===
1. Mantenha as mensagens no formato natural e humanizado do WhatsApp: parágrafos curtos, uso moderado de emojis adequados, clareza direta e acolhimento.
2. Em caso de dúvidas sobre trocas de refeições ou falta de ingredientes:
   - Respeite rigorosamente a matriz de equivalências e mantenha as metas de proteína e caloria daquela refeição específica.
   - SEMPRE indique o nome do substituto e a gramatura / medida caseira exata correspondente (ex: 140g de patinho moído ou 3 ovos).
   - NUNCA recomende alimentos da lista de aversões (${anamnese.aversions.join(', ')}).
3. Caso a paciente envie fotos de refeições (micro-checkin), avalie a presença de fibras, salada colorida e porção de proteína, incentivando a consistência.
4. Se a paciente relatar sintomas graves ou dor aguda, oriente buscar atendimento e informe que você notificará a nutricionista.
5. Se perguntado sobre suplementos (ex: ferro quelato / bisglicinato), confirme que foram prescritos devido à ferritina reduzida e reforce o melhor horário de absorção (longe de café/leite, junto com vitamina C).
`.trim();
}

/**
 * Resposta determinística inteligente baseada no contexto clínico completo
 * Simula a inferência do Gemini com latência ultrarrápida (200-400ms) quando em modo offline ou sem API key
 */
export function generateLocalContextAwareReply(
  userText: string,
  context: PatientContextPayload,
  imageAttached?: boolean
): WhatsAppChatMessage {
  const normalized = userText.toLowerCase();
  const now = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  // 1. Caso seja imagem de prato (Visão Computacional)
  if (imageAttached || normalized.includes('foto') || normalized.includes('prato')) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'assistant',
      timestamp: now,
      text: `Excelente prato, ${context.patient.name.split(' ')[0]}! Analisei a imagem pelo modelo visual: você atingiu uma ótima proporção de vegetais e a porção de proteína está perfeitamente alinhada com os 40g prescritos para esta refeição. Continue assim! 🥗✨`,
      mediaType: 'text',
      visionAnalysis: {
        identifiedItems: ['Filé de Frango Grelhado (~150g)', 'Arroz Branco (~150g)', 'Feijão Preto', 'Salada Verde com Tomate'],
        complianceEstimate: '98% de adesão aos macros da Refeição',
        fiberVegetableScore: 'excelente'
      }
    };
  }

  // 2. Caso o paciente pergunte de substituição no almoço / proteína
  if (normalized.includes('trocar') || normalized.includes('substitu') || normalized.includes('frango') || normalized.includes('ovo') || normalized.includes('carne')) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'assistant',
      timestamp: now,
      text: `Pode substituir sim, ${context.patient.name.split(' ')[0]}! Para manter exatamente as suas **40g de proteína e o limiar de leucina (3.2g)** prescritos para o almoço:`,
      substitutionCard: {
        originalFood: '150g de Filé de Frango Grelhado',
        suggestedAlternative: '140g de Patinho Moído OU 3 ovos inteiros + 2 claras mexidas',
        portionMatch: 'Equivalência calórica de ~240 kcal mantida',
        macrosPreserved: '40g Proteína pura mantida'
      }
    };
  }

  // 3. Caso o paciente mencione carboidrato / arroz / batata
  if (normalized.includes('arroz') || normalized.includes('carboidrato') || normalized.includes('batata') || normalized.includes('mandioca')) {
    if (normalized.includes('doce')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        timestamp: now,
        text: `Lembrando que nós removemos a **batata-doce** do seu planejamento devido ao seu enjoo! Você pode substituir 160g de arroz branco por **130g de mandioca cozida** ou **200g de batata inglesa cozida (ou purê sem lactose)**. 🥔`
      };
    }
    return {
      id: `bot-${Date.now()}`,
      sender: 'assistant',
      timestamp: now,
      text: `Para substituir os 160g de arroz branco do almoço mantendo ~45g de carboidratos:\n\n🥔 **Opção 1:** 200g de Batata Inglesa cozida ou purê\n🍠 **Opção 2:** 130g de Mandioca cozida (3 pedaços pequenos)\n\nFica delicioso e não altera suas calorias diárias!`
    };
  }

  // 4. Caso o paciente pergunte de hidratação ou água
  if (normalized.includes('agua') || normalized.includes('água') || normalized.includes('hidrata')) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'assistant',
      timestamp: now,
      text: `Sua meta diária calculada é de **${context.anamnese.hydration.litersPerDay} Litros**. Uma boa estratégia é beber 500ml ao acordar, 500ml antes do almoço, 500ml à tarde e 700ml distribuídos entre o treino e o jantar. Já bebeu água hoje? 💧`
    };
  }

  // 5. Caso pergunte de suplementos / ferro
  if (normalized.includes('ferro') || normalized.includes('suplement') || normalized.includes('vitamina')) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'assistant',
      timestamp: now,
      text: `A suplementação de **Ferro Bisglicinato 30mg** prescrita pela Dra. Maithe tem como objetivo restaurar sua Ferritina (que estava em 18 ng/mL no seu exame). Dica de ouro: tome preferencialmente junto com uma fruta cítrica rica em Vitamina C (como laranja ou kiwi) e evite leite ou café na mesma hora para maximizar a absorção! 🍊💊`
    };
  }

  // 6. Caso pergunte de constipação / intestino / gases
  if (normalized.includes('intestino') || normalized.includes('constip') || normalized.includes('preso') || normalized.includes('gases')) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'assistant',
      timestamp: now,
      text: `Como observamos na sua consulta a classificação de Bristol tipo 2, combinamos o aumento de psyllium (5g pela manhã) e priorizamos sementes de chia e água. Se o intestino ainda não funcionou hoje, aumente 1 copo de água morna e adicione kiwi ou mamão ao café da tarde. Vou registrar isso no prontuário para a Dra. Maithe acompanhar! 🌿`
    };
  }

  // 7. Resposta padrão contextual
  return {
    id: `bot-${Date.now()}`,
    sender: 'assistant',
    timestamp: now,
    text: `Olá ${context.patient.name.split(' ')[0]}! Estou conectada ao seu prontuário clínico e plano de ${context.patient.targetKcal} kcal. Você pode me perguntar sobre qualquer substituição dos seus pratos, envio de fotos para micro-checkin, horário dos suplementos ou dúvidas da rotina!`
  };
}
