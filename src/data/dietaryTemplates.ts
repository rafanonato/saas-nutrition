import { FoodItem } from '../types';

export type TemplateGoal = 
  | 'Hipertrofia' 
  | 'Emagrecimento' 
  | 'Performance' 
  | 'Low-Carb' 
  | 'Vegetariano' 
  | 'Sem Lactose' 
  | 'Prático/Marmita' 
  | 'Personalizado';

export type TemplateMealType = 
  | 'desjejum' 
  | 'almoco' 
  | 'pre_treino' 
  | 'pos_treino' 
  | 'jantar' 
  | 'ceia' 
  | 'qualquer';

export interface DietaryTemplate {
  id: string;
  title: string;
  description: string;
  goal: TemplateGoal;
  mealType: TemplateMealType;
  tags: string[];
  targetKcal: number;
  targetPtn: number;
  targetCho: number;
  targetLip: number;
  targetLeucine: number;
  items: FoodItem[];
  isBlankTemplate?: boolean;
}

export const BLANK_TEMPLATE: DietaryTemplate = {
  id: 'template-blank',
  title: 'Template em Branco (Criar do Zero)',
  description: 'Canvas vazio para formular uma nova refeição personalizada com cálculo dinâmico de calorias, proteínas, carboidratos e lipídios.',
  goal: 'Personalizado',
  mealType: 'qualquer',
  tags: ['Em Branco', 'Customizado', 'Base Livre'],
  targetKcal: 500,
  targetPtn: 35,
  targetCho: 50,
  targetLip: 15,
  targetLeucine: 3.0,
  items: [],
  isBlankTemplate: true
};

export const DIETARY_TEMPLATES: DietaryTemplate[] = [
  // 1. HIPERTROFIA - ALMOÇOS E JANTARES
  {
    id: 'tmpl-01',
    title: 'Almoço Hipertrófico Clássico (45g PTN • mTORC1)',
    description: 'Frango grelhado macio com arroz branco soltinho, feijão carioca e azeite extravirgem para estímulo anabólico máximo.',
    goal: 'Hipertrofia',
    mealType: 'almoco',
    tags: ['Hipertrofia', 'Arroz & Feijão', 'Clássico'],
    targetKcal: 620,
    targetPtn: 46.5,
    targetCho: 75.0,
    targetLip: 14.5,
    targetLeucine: 3.2,
    items: [
      { id: 't1-1', name: 'Peito de Frango Grelhado', householdMeasure: '1 filé médio (150g)', weightGrams: 150, ptn: 46.5, cho: 0.0, lip: 3.8, kcal: 238, leucineGrams: 2.7, sourceTable: 'TACO' },
      { id: 't1-2', name: 'Arroz Branco Cozido', householdMeasure: '5 colheres de sopa cheias (160g)', weightGrams: 160, ptn: 4.0, cho: 44.8, lip: 0.4, kcal: 205, leucineGrams: 0.3, sourceTable: 'TACO' },
      { id: 't1-3', name: 'Feijão Carioca Cozido (Caldo Médio)', householdMeasure: '1 concha média (100g)', weightGrams: 100, ptn: 4.8, cho: 13.6, lip: 0.5, kcal: 76, leucineGrams: 0.4, sourceTable: 'TACO' },
      { id: 't1-4', name: 'Azeite de Oliva Extravirgem', householdMeasure: '1 colher de sobremesa (8g)', weightGrams: 8, ptn: 0.0, cho: 0.0, lip: 8.0, kcal: 72, leucineGrams: 0.0, sourceTable: 'TACO' }
    ]
  },
  {
    id: 'tmpl-02',
    title: 'Patinho com Mandioca e Brócolis',
    description: 'Carne bovina magra rica em ferro heme e zinco com carboidrato denso de lenta absorção.',
    goal: 'Hipertrofia',
    mealType: 'almoco',
    tags: ['Hipertrofia', 'Ferro Heme', 'Sem Glúten'],
    targetKcal: 580,
    targetPtn: 45.0,
    targetCho: 62.0,
    targetLip: 13.0,
    targetLeucine: 3.1,
    items: [
      { id: 't2-1', name: 'Patinho Bovino Moído Grelhado', householdMeasure: '1 porção média (130g)', weightGrams: 130, ptn: 42.5, cho: 0.0, lip: 7.2, kcal: 236, leucineGrams: 2.8, sourceTable: 'TACO' },
      { id: 't2-2', name: 'Mandioca Cozida', householdMeasure: '3 pedaços médios (130g)', weightGrams: 130, ptn: 1.5, cho: 47.0, lip: 0.4, kcal: 203, leucineGrams: 0.1, sourceTable: 'TACO' },
      { id: 't2-3', name: 'Azeite de Oliva Extravirgem', householdMeasure: '1 colher de chá (6g)', weightGrams: 6, ptn: 0.0, cho: 0.0, lip: 6.0, kcal: 54, leucineGrams: 0.0, sourceTable: 'TACO' }
    ]
  },
  {
    id: 'tmpl-03',
    title: 'Tilápia Grelhada com Batatas Rústicas ao Alecrim',
    description: 'Proteína de altíssima digestibilidade gastrointestinal combinada com batatas douradas.',
    goal: 'Hipertrofia',
    mealType: 'almoco',
    tags: ['Leveza Gástrica', 'Fácil Digestão', 'Hipertrofia'],
    targetKcal: 510,
    targetPtn: 44.0,
    targetCho: 58.0,
    targetLip: 9.5,
    targetLeucine: 2.9,
    items: [
      { id: 't3-1', name: 'Filé de Tilápia Grelhado', householdMeasure: '1 filé grande (180g)', weightGrams: 180, ptn: 42.0, cho: 0.0, lip: 3.5, kcal: 205, leucineGrams: 2.6, sourceTable: 'TACO' },
      { id: 't3-2', name: 'Batata Inglesa Cozida / Dourada', householdMeasure: '2 batatas médias (200g)', weightGrams: 200, ptn: 2.8, cho: 44.0, lip: 0.2, kcal: 194, leucineGrams: 0.2, sourceTable: 'TACO' },
      { id: 't3-3', name: 'Azeite de Oliva Extravirgem', householdMeasure: '1 colher de sobremesa (8g)', weightGrams: 8, ptn: 0.0, cho: 0.0, lip: 8.0, kcal: 72, leucineGrams: 0.0, sourceTable: 'TACO' }
    ]
  },
  {
    id: 'tmpl-04',
    title: 'Salmão Grelhado com Arroz Integral e Aspargos',
    description: 'Rico em ácidos graxos ômega-3 anti-inflamatórios (EPA/DHA) para reparação celular.',
    goal: 'Hipertrofia',
    mealType: 'jantar',
    tags: ['Ômega-3', 'Anti-inflamatório', 'Longevidade'],
    targetKcal: 590,
    targetPtn: 38.0,
    targetCho: 48.0,
    targetLip: 22.0,
    targetLeucine: 2.8,
    items: [
      { id: 't4-1', name: 'Filé de Salmão Grelhado', householdMeasure: '1 filé médio (150g)', weightGrams: 150, ptn: 36.0, cho: 0.0, lip: 18.0, kcal: 315, leucineGrams: 2.7, sourceTable: 'TBCA' },
      { id: 't4-2', name: 'Arroz Integral Cozido', householdMeasure: '4 colheres de sopa cheias (140g)', weightGrams: 140, ptn: 3.6, cho: 36.0, lip: 1.4, kcal: 174, leucineGrams: 0.3, sourceTable: 'TACO' }
    ]
  },
  {
    id: 'tmpl-05',
    title: 'Bowl Hipertrófico de Frango Desfiado com Grão-de-Bico',
    description: 'Combinação sinérgica de proteína animal com leguminosa fibrosa sacietogênica.',
    goal: 'Hipertrofia',
    mealType: 'almoco',
    tags: ['Fibras', 'Hipertrofia', 'Prebiótico'],
    targetKcal: 560,
    targetPtn: 46.0,
    targetCho: 54.0,
    targetLip: 12.0,
    targetLeucine: 3.0,
    items: [
      { id: 't5-1', name: 'Peito de Frango Grelhado Desfiado', householdMeasure: '1 xícara cheia (140g)', weightGrams: 140, ptn: 43.4, cho: 0.0, lip: 3.5, kcal: 222, leucineGrams: 2.6, sourceTable: 'TACO' },
      { id: 't5-2', name: 'Grão-de-Bico Cozido', householdMeasure: '4 colheres de sopa (120g)', weightGrams: 120, ptn: 10.0, cho: 31.4, lip: 3.1, kcal: 192, leucineGrams: 0.7, sourceTable: 'TACO' },
      { id: 't5-3', name: 'Azeite de Oliva Extravirgem', householdMeasure: '1 colher de sobremesa (8g)', weightGrams: 8, ptn: 0.0, cho: 0.0, lip: 8.0, kcal: 72, leucineGrams: 0.0, sourceTable: 'TACO' }
    ]
  },

  // 2. HIPERTROFIA - DESJEJUM E CAFÉ DA MANHÃ
  {
    id: 'tmpl-06',
    title: 'Desjejum Anabólico: Ovos Mexidos, Torradas & Mamão',
    description: 'Clássico café matinal proteico equilibrando colina, carotenoides e leucina rápida.',
    goal: 'Hipertrofia',
    mealType: 'desjejum',
    tags: ['Café da Manhã', 'Colina', 'mTORC1'],
    targetKcal: 460,
    targetPtn: 32.0,
    targetCho: 45.0,
    targetLip: 16.0,
    targetLeucine: 2.8,
    items: [
      { id: 't6-1', name: 'Ovo de Galinha Inteiro Cozido/Mexido', householdMeasure: '2 unidades médias (100g)', weightGrams: 100, ptn: 13.0, cho: 0.8, lip: 9.5, kcal: 146, leucineGrams: 1.1, sourceTable: 'TACO' },
      { id: 't6-2', name: 'Clara de Ovo Cozida/Mexida', householdMeasure: '3 claras (90g)', weightGrams: 90, ptn: 10.8, cho: 0.7, lip: 0.1, kcal: 48, leucineGrams: 0.9, sourceTable: 'TACO' },
      { id: 't6-3', name: 'Pão de Forma 100% Integral', householdMeasure: '2 fatias (50g)', weightGrams: 50, ptn: 5.2, cho: 22.0, lip: 1.8, kcal: 122, leucineGrams: 0.3, sourceTable: 'TBCA' },
      { id: 't6-4', name: 'Mamão Papaia', householdMeasure: '1/2 unidade (140g)', weightGrams: 140, ptn: 0.7, cho: 14.5, lip: 0.1, kcal: 56, leucineGrams: 0.1, sourceTable: 'TACO' }
    ]
  },
  {
    id: 'tmpl-07',
    title: 'Panqueca de Aveia, Ovos & Banana com Canela',
    description: 'Carboidrato de índice glicêmico equilibrado e sabor reconfortante para café matinal.',
    goal: 'Hipertrofia',
    mealType: 'desjejum',
    tags: ['Panqueca', 'Sem Açúcar', 'Matinal'],
    targetKcal: 440,
    targetPtn: 26.0,
    targetCho: 52.0,
    targetLip: 12.0,
    targetLeucine: 2.4,
    items: [
      { id: 't7-1', name: 'Ovo de Galinha Inteiro Cozido', householdMeasure: '2 unidades médias (100g)', weightGrams: 100, ptn: 13.0, cho: 0.8, lip: 9.5, kcal: 146, leucineGrams: 1.1, sourceTable: 'TACO' },
      { id: 't7-2', name: 'Aveia em Flocos Finos', householdMeasure: '3 colheres de sopa cheias (45g)', weightGrams: 45, ptn: 6.2, cho: 30.0, lip: 3.8, kcal: 177, leucineGrams: 0.4, sourceTable: 'TACO' },
      { id: 't7-3', name: 'Banana Prata', householdMeasure: '1 unidade média (85g)', weightGrams: 85, ptn: 1.1, cho: 22.0, lip: 0.1, kcal: 83, leucineGrams: 0.1, sourceTable: 'TACO' }
    ]
  },
  {
    id: 'tmpl-08',
    title: 'Crepioca Recheada com Frango & Queijo Cottage',
    description: 'Receita brasileira hiperproteica com goma de tapioca hidratada e recheio cremoso.',
    goal: 'Hipertrofia',
    mealType: 'desjejum',
    tags: ['Crepioca', 'Sem Glúten', '35g Proteína'],
    targetKcal: 410,
    targetPtn: 36.0,
    targetCho: 38.0,
    targetLip: 10.0,
    targetLeucine: 2.9,
    items: [
      { id: 't8-1', name: 'Ovo de Galinha Inteiro Cozido', householdMeasure: '1 unidade média (50g)', weightGrams: 50, ptn: 6.5, cho: 0.4, lip: 4.8, kcal: 73, leucineGrams: 0.6, sourceTable: 'TACO' },
      { id: 't8-2', name: 'Peito de Frango Grelhado Desfiado', householdMeasure: '3 colheres de sopa cheias (80g)', weightGrams: 80, ptn: 24.8, cho: 0.0, lip: 2.0, kcal: 127, leucineGrams: 1.8, sourceTable: 'TACO' },
      { id: 't8-3', name: 'Queijo Cottage 0% Gordura', householdMeasure: '1 colher de sopa (40g)', weightGrams: 40, ptn: 5.8, cho: 1.2, lip: 0.2, kcal: 30, leucineGrams: 0.6, sourceTable: 'TBCA' }
    ]
  },
  {
    id: 'tmpl-09',
    title: 'Cuscuz Nordestino com Ovos Mexidos & Queijo Minas',
    description: 'Tradição brasileira energizante com farinha de milho flocada, ovos caipiras e queijo magro.',
    goal: 'Hipertrofia',
    mealType: 'desjejum',
    tags: ['Regional', 'Cuscuz', 'Energia'],
    targetKcal: 425,
    targetPtn: 27.0,
    targetCho: 48.0,
    targetLip: 12.5,
    targetLeucine: 2.3,
    items: [
      { id: 't9-1', name: 'Cuscuz Nordestino Cozido (Milharina)', householdMeasure: '1 pedaço médio (120g)', weightGrams: 120, ptn: 2.6, cho: 30.5, lip: 0.8, kcal: 136, leucineGrams: 0.2, sourceTable: 'TACO' },
      { id: 't9-2', name: 'Ovo de Galinha Inteiro Cozido', householdMeasure: '2 unidades médias (100g)', weightGrams: 100, ptn: 13.0, cho: 0.8, lip: 9.5, kcal: 146, leucineGrams: 1.1, sourceTable: 'TACO' },
      { id: 't9-3', name: 'Clara de Ovo Cozida/Mexida', householdMeasure: '2 claras (60g)', weightGrams: 60, ptn: 6.5, cho: 0.4, lip: 0.1, kcal: 29, leucineGrams: 0.5, sourceTable: 'TACO' },
      { id: 't9-4', name: 'Queijo Minas Frescal Light', householdMeasure: '1 fatia fina (30g)', weightGrams: 30, ptn: 5.2, cho: 0.8, lip: 3.4, kcal: 54, leucineGrams: 0.5, sourceTable: 'TACO' }
    ]
  },

  // 3. PRÉ-TREINO & PÓS-TREINO DE ALTA PERFORMANCE
  {
    id: 'tmpl-10',
    title: 'Pré-Treino Energético: Iogurte, Aveia, Banana & Whey',
    description: 'Absorção escalonada de glicose para suporte glicêmico intra-treino sem pico de rebote.',
    goal: 'Performance',
    mealType: 'pre_treino',
    tags: ['Pré-Treino', 'Glicogênio', 'Digestão Leve'],
    targetKcal: 420,
    targetPtn: 28.0,
    targetCho: 62.0,
    targetLip: 4.5,
    targetLeucine: 2.8,
    items: [
      { id: 't10-1', name: 'Iogurte Natural Desnatado', householdMeasure: '1 pote (160g)', weightGrams: 160, ptn: 6.5, cho: 9.0, lip: 0.5, kcal: 68, leucineGrams: 0.7, sourceTable: 'TBCA' },
      { id: 't10-2', name: 'Aveia em Flocos Finos', householdMeasure: '3 colheres de sopa (40g)', weightGrams: 40, ptn: 5.5, cho: 26.5, lip: 3.4, kcal: 158, leucineGrams: 0.4, sourceTable: 'TACO' },
      { id: 't10-3', name: 'Banana Prata', householdMeasure: '1 unidade média (85g)', weightGrams: 85, ptn: 1.1, cho: 22.0, lip: 0.1, kcal: 83, leucineGrams: 0.1, sourceTable: 'TACO' },
      { id: 't10-4', name: 'Whey Protein Isolado 90%', householdMeasure: '1/2 scoop (15g)', weightGrams: 15, ptn: 13.5, cho: 0.3, lip: 0.1, kcal: 56, leucineGrams: 1.4, sourceTable: 'USDA' }
    ]
  },
  {
    id: 'tmpl-11',
    title: 'Shake Anabólico Pós-Treino (Whey + Frutas Vermelhas)',
    description: 'Gatilho anabólico imediato para reposição proteica muscular em janela de 45 minutos.',
    goal: 'Hipertrofia',
    mealType: 'pos_treino',
    tags: ['Pós-Treino', 'mTORC1', 'Whey Isolado'],
    targetKcal: 310,
    targetPtn: 34.0,
    targetCho: 35.0,
    targetLip: 2.0,
    targetLeucine: 3.4,
    items: [
      { id: 't11-1', name: 'Whey Protein Isolado 90%', householdMeasure: '1 scoop cheio (30g)', weightGrams: 30, ptn: 27.0, cho: 0.6, lip: 0.3, kcal: 113, leucineGrams: 2.9, sourceTable: 'USDA' },
      { id: 't11-2', name: 'Banana Prata Congelada', householdMeasure: '1 unidade média (85g)', weightGrams: 85, ptn: 1.1, cho: 22.0, lip: 0.1, kcal: 83, leucineGrams: 0.1, sourceTable: 'TACO' },
      { id: 't11-3', name: 'Morangos Frescos', householdMeasure: '1 xícara (120g)', weightGrams: 120, ptn: 1.1, cho: 8.2, lip: 0.4, kcal: 36, leucineGrams: 0.1, sourceTable: 'TACO' }
    ]
  },
  {
    id: 'tmpl-12',
    title: 'Vitamina de Aveia, Pasta de Amendoim e Frutas',
    description: 'Densidade calórica para atletas com dificuldade de ingestão em grande volume sólido.',
    goal: 'Performance',
    mealType: 'pre_treino',
    tags: ['Calórico', 'Atleta', 'Endurance'],
    targetKcal: 490,
    targetPtn: 24.0,
    targetCho: 65.0,
    targetLip: 15.0,
    targetLeucine: 2.1,
    items: [
      { id: 't12-1', name: 'Bebida Vegetal de Amêndoas Sem Açúcar', householdMeasure: '1 copo (200ml)', weightGrams: 200, ptn: 1.2, cho: 0.6, lip: 2.4, kcal: 30, leucineGrams: 0.1, sourceTable: 'USDA' },
      { id: 't12-2', name: 'Aveia em Flocos Finos', householdMeasure: '4 colheres de sopa cheias (50g)', weightGrams: 50, ptn: 6.9, cho: 33.3, lip: 4.2, kcal: 197, leucineGrams: 0.5, sourceTable: 'TACO' },
      { id: 't12-3', name: 'Banana Prata', householdMeasure: '1 unidade média (85g)', weightGrams: 85, ptn: 1.1, cho: 22.0, lip: 0.1, kcal: 83, leucineGrams: 0.1, sourceTable: 'TACO' },
      { id: 't12-4', name: 'Pasta de Amendoim Integral 100%', householdMeasure: '1 colher de sopa (20g)', weightGrams: 20, ptn: 5.5, cho: 2.4, lip: 9.8, kcal: 119, leucineGrams: 0.4, sourceTable: 'TBCA' }
    ]
  },

  // 4. EMAGRECIMENTO & DEFINIÇÃO (CUTTING - ALTA SACIEDADE)
  {
    id: 'tmpl-13',
    title: 'Cutting: Frango Grelhado, Salada de Folhas & Batata Inglesa',
    description: 'Volume alimentar volumoso com baixo impacto calórico para máxima saciedade.',
    goal: 'Emagrecimento',
    mealType: 'almoco',
    tags: ['Cutting', 'Alta Saciedade', 'Baixa Densidade'],
    targetKcal: 380,
    targetPtn: 44.0,
    targetCho: 32.0,
    targetLip: 5.0,
    targetLeucine: 2.8,
    items: [
      { id: 't13-1', name: 'Peito de Frango Grelhado', householdMeasure: '1 filé médio (140g)', weightGrams: 140, ptn: 43.4, cho: 0.0, lip: 3.5, kcal: 222, leucineGrams: 2.6, sourceTable: 'TACO' },
      { id: 't13-2', name: 'Batata Inglesa Cozida', householdMeasure: '1 batata média (150g)', weightGrams: 150, ptn: 2.1, cho: 22.0, lip: 0.1, kcal: 96, leucineGrams: 0.1, sourceTable: 'TACO' },
      { id: 't13-3', name: 'Azeite de Oliva Extravirgem', householdMeasure: '1 colher de chá (5g)', weightGrams: 5, ptn: 0.0, cho: 0.0, lip: 5.0, kcal: 45, leucineGrams: 0.0, sourceTable: 'TACO' }
    ]
  },
  {
    id: 'tmpl-14',
    title: 'Cutting: Omelete de Claras com Espinafre & Tomate',
    description: 'Refeição de altíssima densidade proteica com calorias mínimas para janela noturna.',
    goal: 'Emagrecimento',
    mealType: 'jantar',
    tags: ['Cutting', 'Poucas Calorias', 'Noturno'],
    targetKcal: 230,
    targetPtn: 28.0,
    targetCho: 6.0,
    targetLip: 9.5,
    targetLeucine: 2.2,
    items: [
      { id: 't14-1', name: 'Ovo de Galinha Inteiro Cozido', householdMeasure: '1 unidade média (50g)', weightGrams: 50, ptn: 6.5, cho: 0.4, lip: 4.8, kcal: 73, leucineGrams: 0.6, sourceTable: 'TACO' },
      { id: 't14-2', name: 'Clara de Ovo Cozida/Mexida', householdMeasure: '4 claras (120g)', weightGrams: 120, ptn: 14.4, cho: 0.9, lip: 0.1, kcal: 64, leucineGrams: 1.2, sourceTable: 'TACO' },
      { id: 't14-3', name: 'Azeite de Oliva Extravirgem', householdMeasure: '1 colher de chá (5g)', weightGrams: 5, ptn: 0.0, cho: 0.0, lip: 5.0, kcal: 45, leucineGrams: 0.0, sourceTable: 'TACO' }
    ]
  },
  {
    id: 'tmpl-15',
    title: 'Cutting: Tilápia Grelhada com Brócolis e Cenoura Cozida',
    description: 'Peixe branco magro acompanhado de vegetais fibrosos para manutenção da leptina.',
    goal: 'Emagrecimento',
    mealType: 'jantar',
    tags: ['Cutting', 'Peixe Branco', 'Fibras'],
    targetKcal: 290,
    targetPtn: 40.0,
    targetCho: 18.0,
    targetLip: 6.0,
    targetLeucine: 2.6,
    items: [
      { id: 't15-1', name: 'Filé de Tilápia Grelhado', householdMeasure: '1 filé grande (160g)', weightGrams: 160, ptn: 37.5, cho: 0.0, lip: 3.1, kcal: 182, leucineGrams: 2.3, sourceTable: 'TACO' },
      { id: 't15-2', name: 'Azeite de Oliva Extravirgem', householdMeasure: '1 colher de chá (5g)', weightGrams: 5, ptn: 0.0, cho: 0.0, lip: 5.0, kcal: 45, leucineGrams: 0.0, sourceTable: 'TACO' }
    ]
  },
  {
    id: 'tmpl-16',
    title: 'Cutting: Salada Tropical de Atum Sólido & Morangos',
    description: 'Atum conservado em água, morangos antioxidantes e azeite para saciedade prolongada.',
    goal: 'Emagrecimento',
    mealType: 'almoco',
    tags: ['Prático', 'Atum', 'Refrescante'],
    targetKcal: 310,
    targetPtn: 34.0,
    targetCho: 15.0,
    targetLip: 12.0,
    targetLeucine: 2.4,
    items: [
      { id: 't16-1', name: 'Atum Sólido em Água (Drenado)', householdMeasure: '1 lata drenada (120g)', weightGrams: 120, ptn: 31.2, cho: 0.0, lip: 1.2, kcal: 138, leucineGrams: 2.6, sourceTable: 'TACO' },
      { id: 't16-2', name: 'Morangos Frescos', householdMeasure: '1 xícara (120g)', weightGrams: 120, ptn: 1.1, cho: 8.2, lip: 0.4, kcal: 36, leucineGrams: 0.1, sourceTable: 'TACO' },
      { id: 't16-3', name: 'Azeite de Oliva Extravirgem', householdMeasure: '1 colher de sopa rasa (10g)', weightGrams: 10, ptn: 0.0, cho: 0.0, lip: 10.0, kcal: 90, leucineGrams: 0.0, sourceTable: 'TACO' }
    ]
  },

  // 5. LOW-CARB E CETOGÊNICA CONTROLADA
  {
    id: 'tmpl-17',
    title: 'Low-Carb: Omelete de 3 Ovos com Queijo Meia Cura & Abacate',
    description: 'Gorduras boas monoinsaturadas com perfil lipídico antiaterogênico e baixo carboidrato.',
    goal: 'Low-Carb',
    mealType: 'desjejum',
    tags: ['Low-Carb', 'Gorduras Boas', 'Cetogênico'],
    targetKcal: 480,
    targetPtn: 26.0,
    targetCho: 8.0,
    targetLip: 38.0,
    targetLeucine: 2.1,
    items: [
      { id: 't17-1', name: 'Ovo de Galinha Inteiro Cozido', householdMeasure: '3 unidades médias (150g)', weightGrams: 150, ptn: 19.5, cho: 1.2, lip: 14.2, kcal: 219, leucineGrams: 1.6, sourceTable: 'TACO' },
      { id: 't17-2', name: 'Abacate Hass / Manteiga', householdMeasure: '2 colheres de sopa cheias (60g)', weightGrams: 60, ptn: 0.7, cho: 3.6, lip: 5.0, kcal: 58, leucineGrams: 0.05, sourceTable: 'TACO' },
      { id: 't17-3', name: 'Queijo Minas Frescal Light', householdMeasure: '1 fatia média (40g)', weightGrams: 40, ptn: 7.0, cho: 1.1, lip: 4.5, kcal: 72, leucineGrams: 0.6, sourceTable: 'TACO' }
    ]
  },
  {
    id: 'tmpl-18',
    title: 'Low-Carb: Salmão Crocante com Salada Verde & Nozes',
    description: 'Rico em ácidos graxos essenciais e minerais para saciedade sustentada sem picos de insulina.',
    goal: 'Low-Carb',
    mealType: 'jantar',
    tags: ['Low-Carb', 'Ômega-3', 'Sem Açúcar'],
    targetKcal: 520,
    targetPtn: 38.0,
    targetCho: 6.0,
    targetLip: 38.0,
    targetLeucine: 2.8,
    items: [
      { id: 't18-1', name: 'Filé de Salmão Grelhado', householdMeasure: '1 filé grande (160g)', weightGrams: 160, ptn: 38.4, cho: 0.0, lip: 20.0, kcal: 336, leucineGrams: 2.9, sourceTable: 'TBCA' },
      { id: 't18-2', name: 'Castanha-do-Pará (Brasil)', householdMeasure: '2 unidades (10g)', weightGrams: 10, ptn: 1.5, cho: 1.2, lip: 6.6, kcal: 65, leucineGrams: 0.1, sourceTable: 'TACO' },
      { id: 't18-3', name: 'Azeite de Oliva Extravirgem', householdMeasure: '1 colher de sobremesa (8g)', weightGrams: 8, ptn: 0.0, cho: 0.0, lip: 8.0, kcal: 72, leucineGrams: 0.0, sourceTable: 'TACO' }
    ]
  },
  {
    id: 'tmpl-19',
    title: 'Low-Carb: Frango com Abobrinha Gratinada & Azeite',
    description: 'Densidade proteica moderada com carboidratos reduzidos a menos de 10g na refeição.',
    goal: 'Low-Carb',
    mealType: 'almoco',
    tags: ['Low-Carb', 'Leveza', 'Sem Glúten'],
    targetKcal: 420,
    targetPtn: 46.0,
    targetCho: 7.0,
    targetLip: 22.0,
    targetLeucine: 3.1,
    items: [
      { id: 't19-1', name: 'Peito de Frango Grelhado', householdMeasure: '1 filé grande (150g)', weightGrams: 150, ptn: 46.5, cho: 0.0, lip: 3.8, kcal: 238, leucineGrams: 2.7, sourceTable: 'TACO' },
      { id: 't19-2', name: 'Azeite de Oliva Extravirgem', householdMeasure: '2 colheres de sobremesa (15g)', weightGrams: 15, ptn: 0.0, cho: 0.0, lip: 15.0, kcal: 135, leucineGrams: 0.0, sourceTable: 'TACO' }
    ]
  },

  // 6. VEGETARIANO & VEGANO ESPORTIVO
  {
    id: 'tmpl-20',
    title: 'Vegano: Tofu Grelhado com Grão-de-Bico & Arroz Integral',
    description: 'Combinação clássica de leguminosa com cereal para complementação de aminoácidos essenciais.',
    goal: 'Vegetariano',
    mealType: 'almoco',
    tags: ['Vegano', 'Tofu Orgânico', 'Plant-Based'],
    targetKcal: 560,
    targetPtn: 34.0,
    targetCho: 72.0,
    targetLip: 15.0,
    targetLeucine: 2.4,
    items: [
      { id: 't20-1', name: 'Tofu Firme Orgânico', householdMeasure: '2 fatias grossas (150g)', weightGrams: 150, ptn: 21.0, cho: 3.8, lip: 12.0, kcal: 207, leucineGrams: 1.7, sourceTable: 'USDA' },
      { id: 't20-2', name: 'Arroz Integral Cozido', householdMeasure: '4 colheres de sopa cheias (140g)', weightGrams: 140, ptn: 3.6, cho: 36.0, lip: 1.4, kcal: 174, leucineGrams: 0.3, sourceTable: 'TACO' },
      { id: 't20-3', name: 'Grão-de-Bico Cozido', householdMeasure: '3 colheres de sopa cheias (90g)', weightGrams: 90, ptn: 7.6, cho: 23.6, lip: 2.3, kcal: 144, leucineGrams: 0.5, sourceTable: 'TACO' }
    ]
  },
  {
    id: 'tmpl-21',
    title: 'Vegano: Shake Proteico de Ervilha, Arroz & Pasta de Amendoim',
    description: 'Proteína vegetal isolada com excelente biodisponibilidade para bater leucina pré-sono.',
    goal: 'Vegetariano',
    mealType: 'pos_treino',
    tags: ['Vegano', 'Sem Lactose', 'Proteína Vegetal'],
    targetKcal: 390,
    targetPtn: 32.0,
    targetCho: 34.0,
    targetLip: 13.0,
    targetLeucine: 2.8,
    items: [
      { id: 't21-1', name: 'Proteína Vegetal Isolada (Ervilha + Arroz)', householdMeasure: '1 scoop medidor (30g)', weightGrams: 30, ptn: 24.0, cho: 1.2, lip: 1.1, kcal: 110, leucineGrams: 2.2, sourceTable: 'USDA' },
      { id: 't21-2', name: 'Bebida Vegetal de Amêndoas Sem Açúcar', householdMeasure: '1 copo (200ml)', weightGrams: 200, ptn: 1.2, cho: 0.6, lip: 2.4, kcal: 30, leucineGrams: 0.1, sourceTable: 'USDA' },
      { id: 't21-3', name: 'Banana Prata', householdMeasure: '1 unidade média (85g)', weightGrams: 85, ptn: 1.1, cho: 22.0, lip: 0.1, kcal: 83, leucineGrams: 0.1, sourceTable: 'TACO' },
      { id: 't21-4', name: 'Pasta de Amendoim Integral 100%', householdMeasure: '1 colher de sopa rasa (20g)', weightGrams: 20, ptn: 5.5, cho: 2.4, lip: 9.8, kcal: 119, leucineGrams: 0.4, sourceTable: 'TBCA' }
    ]
  },
  {
    id: 'tmpl-22',
    title: 'Ovolactovegetariano: Omelete de Queijo Minas & Lentilha',
    description: 'Ovos caipiras ricos em albumina combinados com lentilha cozida aromática.',
    goal: 'Vegetariano',
    mealType: 'jantar',
    tags: ['Ovolacto', 'Lentilha', 'Fibras'],
    targetKcal: 440,
    targetPtn: 31.0,
    targetCho: 36.0,
    targetLip: 17.5,
    targetLeucine: 2.3,
    items: [
      { id: 't22-1', name: 'Ovo de Galinha Inteiro Cozido', householdMeasure: '2 unidades médias (100g)', weightGrams: 100, ptn: 13.0, cho: 0.8, lip: 9.5, kcal: 146, leucineGrams: 1.1, sourceTable: 'TACO' },
      { id: 't22-2', name: 'Lentilha Cozida', householdMeasure: '1 concha média (120g)', weightGrams: 120, ptn: 7.6, cho: 19.6, lip: 0.6, kcal: 112, leucineGrams: 0.6, sourceTable: 'TACO' },
      { id: 't22-3', name: 'Queijo Minas Frescal Light', householdMeasure: '1 fatia média (40g)', weightGrams: 40, ptn: 7.0, cho: 1.1, lip: 4.5, kcal: 72, leucineGrams: 0.6, sourceTable: 'TACO' },
      { id: 't22-4', name: 'Azeite de Oliva Extravirgem', householdMeasure: '1 colher de chá (5g)', weightGrams: 5, ptn: 0.0, cho: 0.0, lip: 5.0, kcal: 45, leucineGrams: 0.0, sourceTable: 'TACO' }
    ]
  },

  // 7. SEM LACTOSE & GASTRO-AMIGÁVEL (CONFORMIDADE ANAMNESE RF-01/02)
  {
    id: 'tmpl-23',
    title: 'Sem Lactose: Frango Desfiado com Mandioca e Abobrinha',
    description: '100% livre de lactose e sem batata-doce, respeitando rigorosamente as aversões da anamnese.',
    goal: 'Sem Lactose',
    mealType: 'almoco',
    tags: ['Sem Lactose', 'FODMAP Baixo', 'Zero Batata-Doce'],
    targetKcal: 520,
    targetPtn: 44.0,
    targetCho: 58.0,
    targetLip: 12.0,
    targetLeucine: 3.1,
    items: [
      { id: 't23-1', name: 'Peito de Frango Grelhado', householdMeasure: '1 filé médio (140g)', weightGrams: 140, ptn: 43.4, cho: 0.0, lip: 3.5, kcal: 222, leucineGrams: 2.6, sourceTable: 'TACO' },
      { id: 't23-2', name: 'Mandioca Cozida', householdMeasure: '3 pedaços médios (130g)', weightGrams: 130, ptn: 1.5, cho: 47.0, lip: 0.4, kcal: 203, leucineGrams: 0.1, sourceTable: 'TACO' },
      { id: 't23-3', name: 'Azeite de Oliva Extravirgem', householdMeasure: '1 colher de sobremesa (8g)', weightGrams: 8, ptn: 0.0, cho: 0.0, lip: 8.0, kcal: 72, leucineGrams: 0.0, sourceTable: 'TACO' }
    ]
  },
  {
    id: 'tmpl-24',
    title: 'Sem Lactose: Mingau de Aveia com Whey Isolado & Morangos',
    description: 'Preparo quentinho utilizando água ou bebida vegetal de amêndoas sem resíduo de lactose.',
    goal: 'Sem Lactose',
    mealType: 'desjejum',
    tags: ['Sem Lactose', 'Conforto', 'Mingau'],
    targetKcal: 370,
    targetPtn: 32.0,
    targetCho: 46.0,
    targetLip: 6.5,
    targetLeucine: 3.0,
    items: [
      { id: 't24-1', name: 'Aveia em Flocos Finos', householdMeasure: '3 colheres de sopa cheias (45g)', weightGrams: 45, ptn: 6.2, cho: 30.0, lip: 3.8, kcal: 177, leucineGrams: 0.4, sourceTable: 'TACO' },
      { id: 't24-2', name: 'Whey Protein Isolado 90%', householdMeasure: '1 scoop medidor (30g)', weightGrams: 30, ptn: 27.0, cho: 0.6, lip: 0.3, kcal: 113, leucineGrams: 2.9, sourceTable: 'USDA' },
      { id: 't24-3', name: 'Morangos Frescos', householdMeasure: '1 xícara (120g)', weightGrams: 120, ptn: 1.1, cho: 8.2, lip: 0.4, kcal: 36, leucineGrams: 0.1, sourceTable: 'TACO' }
    ]
  },
  {
    id: 'tmpl-25',
    title: 'Sem Lactose: Iogurte Grego Zero Lactose com Chia e Kiwi',
    description: 'Enzima lactase adicionada para digestão confortável sem gases ou fermentação intestinal.',
    goal: 'Sem Lactose',
    mealType: 'pre_treino',
    tags: ['Zero Lactose', 'Intestino Livre', 'Gastro'],
    targetKcal: 260,
    targetPtn: 16.0,
    targetCho: 22.0,
    targetLip: 11.0,
    targetLeucine: 1.6,
    items: [
      { id: 't25-1', name: 'Iogurte Grego Tradicional Zero Lactose', householdMeasure: '1 pote (120g)', weightGrams: 120, ptn: 9.0, cho: 5.4, lip: 2.4, kcal: 82, leucineGrams: 0.9, sourceTable: 'TBCA' },
      { id: 't25-2', name: 'Sementes de Chia', householdMeasure: '1 colher de sopa (15g)', weightGrams: 15, ptn: 2.5, cho: 6.3, lip: 4.6, kcal: 73, leucineGrams: 0.15, sourceTable: 'USDA' },
      { id: 't25-3', name: 'Banana Prata', householdMeasure: '1 unidade média (85g)', weightGrams: 85, ptn: 1.1, cho: 22.0, lip: 0.1, kcal: 83, leucineGrams: 0.1, sourceTable: 'TACO' }
    ]
  },

  // 8. PRÁTICO / MARMITAS & PREPARAÇÃO SEMANAL
  {
    id: 'tmpl-26',
    title: 'Marmita Congelável: Frango Cubos, Arroz & Feijão Preto',
    description: 'Congelamento seguro por 30 dias sem perda de textura ou alteração de macronutrientes.',
    goal: 'Prático/Marmita',
    mealType: 'almoco',
    tags: ['Marmita Fit', 'Congelável', 'Prático'],
    targetKcal: 560,
    targetPtn: 45.0,
    targetCho: 68.0,
    targetLip: 11.0,
    targetLeucine: 3.1,
    items: [
      { id: 't26-1', name: 'Peito de Frango Grelhado', householdMeasure: '1 porção em cubos (140g)', weightGrams: 140, ptn: 43.4, cho: 0.0, lip: 3.5, kcal: 222, leucineGrams: 2.6, sourceTable: 'TACO' },
      { id: 't26-2', name: 'Arroz Branco Cozido', householdMeasure: '4 colheres de sopa (130g)', weightGrams: 130, ptn: 3.2, cho: 36.5, lip: 0.3, kcal: 166, leucineGrams: 0.2, sourceTable: 'TACO' },
      { id: 't26-3', name: 'Feijão Preto Cozido', householdMeasure: '1 concha média (100g)', weightGrams: 100, ptn: 4.5, cho: 14.0, lip: 0.5, kcal: 77, leucineGrams: 0.4, sourceTable: 'TACO' },
      { id: 't26-4', name: 'Azeite de Oliva Extravirgem', householdMeasure: '1 colher de sobremesa (8g)', weightGrams: 8, ptn: 0.0, cho: 0.0, lip: 8.0, kcal: 72, leucineGrams: 0.0, sourceTable: 'TACO' }
    ]
  },
  {
    id: 'tmpl-27',
    title: 'Marmita Congelável: Patinho Moído com Mandioca Cozida',
    description: 'Sabor acentuado com temperos naturais que se preservam no descongelamento.',
    goal: 'Prático/Marmita',
    mealType: 'almoco',
    tags: ['Marmita Fit', 'Patinho', 'Sem Glúten'],
    targetKcal: 510,
    targetPtn: 42.0,
    targetCho: 52.0,
    targetLip: 13.5,
    targetLeucine: 3.0,
    items: [
      { id: 't27-1', name: 'Patinho Bovino Moído Grelhado', householdMeasure: '1 porção média (120g)', weightGrams: 120, ptn: 39.2, cho: 0.0, lip: 6.6, kcal: 218, leucineGrams: 2.6, sourceTable: 'TACO' },
      { id: 't27-2', name: 'Mandioca Cozida', householdMeasure: '3 pedaços médios (120g)', weightGrams: 120, ptn: 1.3, cho: 36.1, lip: 0.4, kcal: 150, leucineGrams: 0.1, sourceTable: 'TACO' },
      { id: 't27-3', name: 'Azeite de Oliva Extravirgem', householdMeasure: '1 colher de sobremesa (8g)', weightGrams: 8, ptn: 0.0, cho: 0.0, lip: 8.0, kcal: 72, leucineGrams: 0.0, sourceTable: 'TACO' }
    ]
  },
  {
    id: 'tmpl-28',
    title: 'Lanche Rápido de Mochila: Sanduíche de Atum com Pão Integral',
    description: 'Montagem em 2 minutos para pacientes com rotina externa e corporativa intensa.',
    goal: 'Prático/Marmita',
    mealType: 'pre_treino',
    tags: ['Mochila', 'Sem Geladeira', 'Rápido'],
    targetKcal: 380,
    targetPtn: 34.0,
    targetCho: 38.0,
    targetLip: 9.0,
    targetLeucine: 2.6,
    items: [
      { id: 't28-1', name: 'Pão de Forma 100% Integral', householdMeasure: '2 fatias (50g)', weightGrams: 50, ptn: 5.2, cho: 22.0, lip: 1.8, kcal: 122, leucineGrams: 0.3, sourceTable: 'TBCA' },
      { id: 't28-2', name: 'Atum Sólido em Água (Drenado)', householdMeasure: '1 lata drenada (110g)', weightGrams: 110, ptn: 28.6, cho: 0.0, lip: 1.1, kcal: 126, leucineGrams: 2.4, sourceTable: 'TACO' },
      { id: 't28-3', name: 'Azeite de Oliva Extravirgem', householdMeasure: '1 colher de sobremesa (8g)', weightGrams: 8, ptn: 0.0, cho: 0.0, lip: 8.0, kcal: 72, leucineGrams: 0.0, sourceTable: 'TACO' }
    ]
  },

  // 9. CEIAS ANTICATABÓLICAS (SUPORTE NOTURNO E SONO)
  {
    id: 'tmpl-29',
    title: 'Ceia Anticatólica: Queijo Cottage & Castanhas-do-Pará',
    description: 'Caseína de liberação lenta combinada com selênio e magnésio para síntese noturna de GH.',
    goal: 'Hipertrofia',
    mealType: 'ceia',
    tags: ['Ceia', 'Sono Reparador', 'Caseína'],
    targetKcal: 175,
    targetPtn: 16.0,
    targetCho: 4.0,
    targetLip: 10.0,
    targetLeucine: 1.5,
    items: [
      { id: 't29-1', name: 'Queijo Cottage 0% Gordura', householdMeasure: '2 colheres de sopa cheias (90g)', weightGrams: 90, ptn: 13.0, cho: 2.7, lip: 0.5, kcal: 67, leucineGrams: 1.3, sourceTable: 'TBCA' },
      { id: 't29-2', name: 'Castanha-do-Pará (Brasil)', householdMeasure: '2 unidades (12g)', weightGrams: 12, ptn: 1.7, cho: 1.4, lip: 7.9, kcal: 77, leucineGrams: 0.1, sourceTable: 'TACO' }
    ]
  },
  {
    id: 'tmpl-30',
    title: 'Ceia Relaxante: Iogurte com Maracujá & Sementes de Abóbora',
    description: 'Indutor suave de triptofano para precursores de serotonina e melatonina.',
    goal: 'Performance',
    mealType: 'ceia',
    tags: ['Melatonina', 'Indutor de Sono', 'Leve'],
    targetKcal: 150,
    targetPtn: 11.0,
    targetCho: 14.0,
    targetLip: 5.0,
    targetLeucine: 1.0,
    items: [
      { id: 't30-1', name: 'Iogurte Natural Desnatado', householdMeasure: '1 pote (160g)', weightGrams: 160, ptn: 6.5, cho: 9.0, lip: 0.5, kcal: 68, leucineGrams: 0.7, sourceTable: 'TBCA' },
      { id: 't30-2', name: 'Sementes de Chia', householdMeasure: '1 colher de sobremesa (10g)', weightGrams: 10, ptn: 1.7, cho: 4.2, lip: 3.1, kcal: 49, leucineGrams: 0.1, sourceTable: 'USDA' }
    ]
  },
  {
    id: 'tmpl-31',
    title: 'Ceia Cetogênica: Abacate Batido com Whey Isolado e Cacau 100%',
    description: 'Mousse aveludada sem açúcar com magnésio, potássio e gorduras saudáveis.',
    goal: 'Low-Carb',
    mealType: 'ceia',
    tags: ['Ceia Low-Carb', 'Mousse Fit', 'Sem Açúcar'],
    targetKcal: 230,
    targetPtn: 22.0,
    targetCho: 8.0,
    targetLip: 12.0,
    targetLeucine: 2.2,
    items: [
      { id: 't31-1', name: 'Abacate Hass / Manteiga', householdMeasure: '3 colheres de sopa cheias (70g)', weightGrams: 70, ptn: 0.8, cho: 4.2, lip: 5.9, kcal: 67, leucineGrams: 0.05, sourceTable: 'TACO' },
      { id: 't31-2', name: 'Whey Protein Isolado 90%', householdMeasure: '2/3 scoop (20g)', weightGrams: 20, ptn: 18.0, cho: 0.4, lip: 0.2, kcal: 75, leucineGrams: 1.9, sourceTable: 'USDA' }
    ]
  },
  {
    id: 'tmpl-32',
    title: 'Ceia Proteica Zero Carbo: Ovos Cozidos com Orégano e Fio de Azeite',
    description: 'Proteína pura e biodisponível para pacientes em jejum intermitente noturno.',
    goal: 'Emagrecimento',
    mealType: 'ceia',
    tags: ['Zero Carbo', 'Simples', 'Rápido'],
    targetKcal: 190,
    targetPtn: 13.0,
    targetCho: 0.8,
    targetLip: 14.5,
    targetLeucine: 1.1,
    items: [
      { id: 't32-1', name: 'Ovo de Galinha Inteiro Cozido', householdMeasure: '2 unidades médias (100g)', weightGrams: 100, ptn: 13.0, cho: 0.8, lip: 9.5, kcal: 146, leucineGrams: 1.1, sourceTable: 'TACO' },
      { id: 't32-2', name: 'Azeite de Oliva Extravirgem', householdMeasure: '1 colher de chá (5g)', weightGrams: 5, ptn: 0.0, cho: 0.0, lip: 5.0, kcal: 45, leucineGrams: 0.0, sourceTable: 'TACO' }
    ]
  },

  // 10. REFEIÇÕES ESPECIAIS / METABÓLICAS
  {
    id: 'tmpl-33',
    title: 'Refeição de Refeed Glicêmico (Carb-Up Controlado)',
    description: 'Elevação estratégica de carboidratos complexos sem gorduras para repletar glicogênio muscular.',
    goal: 'Performance',
    mealType: 'almoco',
    tags: ['Refeed', 'Carb-Up', 'Glicogênio'],
    targetKcal: 680,
    targetPtn: 38.0,
    targetCho: 115.0,
    targetLip: 5.0,
    targetLeucine: 2.7,
    items: [
      { id: 't33-1', name: 'Peito de Frango Grelhado', householdMeasure: '1 filé médio (130g)', weightGrams: 130, ptn: 40.3, cho: 0.0, lip: 3.2, kcal: 206, leucineGrams: 2.5, sourceTable: 'TACO' },
      { id: 't33-2', name: 'Arroz Branco Cozido', householdMeasure: '8 colheres de sopa cheias (240g)', weightGrams: 240, ptn: 6.0, cho: 67.4, lip: 0.5, kcal: 307, leucineGrams: 0.4, sourceTable: 'TACO' },
      { id: 't33-3', name: 'Feijão Carioca Cozido', householdMeasure: '1 concha média (100g)', weightGrams: 100, ptn: 4.8, cho: 13.6, lip: 0.5, kcal: 76, leucineGrams: 0.4, sourceTable: 'TACO' },
      { id: 't33-4', name: 'Banana Prata Fatiada', householdMeasure: '1 unidade média (85g)', weightGrams: 85, ptn: 1.1, cho: 22.0, lip: 0.1, kcal: 83, leucineGrams: 0.1, sourceTable: 'TACO' }
    ]
  },
  {
    id: 'tmpl-34',
    title: 'Macarrão com Frango em Tiras e Molho Fresco',
    description: 'Ótima palatabilidade pré-competição ou treino de alta intensidade em dias de volume.',
    goal: 'Performance',
    mealType: 'almoco',
    tags: ['Massa', 'Energia Rápida', 'Palatável'],
    targetKcal: 620,
    targetPtn: 48.0,
    targetCho: 82.0,
    targetLip: 10.0,
    targetLeucine: 3.1,
    items: [
      { id: 't34-1', name: 'Peito de Frango Grelhado', householdMeasure: '1 filé grande (150g)', weightGrams: 150, ptn: 46.5, cho: 0.0, lip: 3.8, kcal: 238, leucineGrams: 2.7, sourceTable: 'TACO' },
      { id: 't34-2', name: 'Macarrão de Sêmola Cozido', householdMeasure: '1 prato raso cheio (220g)', weightGrams: 220, ptn: 9.2, cho: 67.1, lip: 1.1, kcal: 319, leucineGrams: 0.6, sourceTable: 'TACO' },
      { id: 't34-3', name: 'Azeite de Oliva Extravirgem', householdMeasure: '1 colher de chá (6g)', weightGrams: 6, ptn: 0.0, cho: 0.0, lip: 6.0, kcal: 54, leucineGrams: 0.0, sourceTable: 'TACO' }
    ]
  },
  {
    id: 'tmpl-35',
    title: 'Bowl Pós-Treino Anti-inflamatório (Salmão, Quinoa & Azeite)',
    description: 'Repleto de flavonoides e ácidos graxos poli-insaturados para redução de CK e dor tardia.',
    goal: 'Performance',
    mealType: 'jantar',
    tags: ['Anti-inflamatório', 'Recuperação', 'Ômega-3'],
    targetKcal: 540,
    targetPtn: 40.0,
    targetCho: 42.0,
    targetLip: 22.0,
    targetLeucine: 3.0,
    items: [
      { id: 't35-1', name: 'Filé de Salmão Grelhado', householdMeasure: '1 filé médio (150g)', weightGrams: 150, ptn: 36.0, cho: 0.0, lip: 18.0, kcal: 315, leucineGrams: 2.7, sourceTable: 'TBCA' },
      { id: 't35-2', name: 'Mandioca Cozida', householdMeasure: '2 pedaços médios (100g)', weightGrams: 100, ptn: 1.1, cho: 30.1, lip: 0.3, kcal: 125, leucineGrams: 0.1, sourceTable: 'TACO' },
      { id: 't35-3', name: 'Azeite de Oliva Extravirgem', householdMeasure: '1 colher de sobremesa (8g)', weightGrams: 8, ptn: 0.0, cho: 0.0, lip: 8.0, kcal: 72, leucineGrams: 0.0, sourceTable: 'TACO' }
    ]
  }
];
