🧬 SaaS Nutrição 2.0: Service-as-a-Software e Arquitetura Conversacional

📖 1. Visão Geral e Proposta de Valor
O ecossistema de saúde digital apoiou-se por muito tempo no modelo clássico de Software-as-a-Service (SaaS 1.0), que atua meramente como banco de dados reativo e receituário digitalizado. Esse modelo sobrecarrega o nutricionista, transformando-o em um digitador de anamneses e calculador manual de dietas, drenando a atenção da escuta clínica.

Este projeto materializa o paradigma do Service-as-a-Software (SaaS 2.0) na nutrição clínica e esportiva. O sistema deixa de ser uma tela esperando inputs passivos para atuar como um orquestrador agêntico executando trabalho cognitivo e braçal. A arquitetura central é focada em quatro pilares:

Ambient Clinical Scribing: Escuta ativa da consulta e estruturação automática do prontuário via IA.

Separação Cognitivo/Determinística: Uso de LLMs apenas para intenção semântica; todo cálculo metabólico é roteado para um motor determinístico de otimização matemática (MIGP).

Human-in-the-Loop Obrigatório: O sistema acelera o processo, mas a IA atua estritamente como coadjuvante (em conformidade com a Resolução CFN nº 856/2026). Nenhuma dieta é gerada ou disparada sem validação clínica e assinatura digital.

Ecossistema Zero-App: Adoção de uma jornada B2C 100% ancorada no WhatsApp Business, eliminando a fricção de download de aplicativos e maximizando a adesão do paciente.

🎯 2. Jornadas e Funcionalidades Core
👩‍⚕️ Visão do Nutricionista (Workspace B2B)
A interface B2B adota um modelo Dual-Pane (Canvas Clínico à esquerda e Copiloto Conversacional à direita), unificados por um HUD (Head-Up Display) Metabólico.

Transcrição e Extração em Tempo Real: Via microfone, a plataforma ouve o diálogo clínico, transcreve e aloca queixas, rotinas e restrições diretamente nos campos estruturados do prontuário (Formato JSON).

Ingestão Óptica (OCR) de Exames: Upload de PDFs de hemogramas e laudos de bioimpedância (ex: InBody). A IA extrai biomarcadores, alerta desvios funcionais e plota o histórico de composição corporal (MLG, Gordura, etc.).

Guia Visual de Antropometria: Interface interativa para inserção e validação de dobras cutâneas com aplicação imediata de protocolos (Jackson & Pollock, Faulkner, etc.).

Copiloto Dietético e Motor MIGP: O profissional solicita a refeição por prompt de texto ou voz (ex: "Sugira almoço com 40g PTN usando frango, arroz e azeite"). O Motor Solver calcula em <100ms as gramaturas exatas para atingir a meta em medidas caseiras, com base na TACO/TBCA.

Monitoramento do Gatilho da Leucina: O HUD avalia instantaneamente a saturação da via mTORC1 (2,5g a 3,0g de leucina) por refeição para dietas focadas em hipertrofia e performance.

Validação e Disparo Digital: Painel unificado para revisão (Compliance), assinatura digital (Token 2FA) e disparo instantâneo do PDF diagramado para o WhatsApp do paciente.

📱 Visão do Paciente (Jornada Zero-App B2C)
O paciente interage com a clínica exclusivamente pelo WhatsApp, orquestrado por um esquadrão de Agentes de IA.

Recepção Imediata: Entrega do plano alimentar, lista de compras e guias em PDF diagramado e humanizado diretamente no chat.

Agente de Substituições em Tempo Real: Se faltar um alimento em casa, o paciente envia um áudio (ex: "Não tenho batata hoje"). A IA consulta o Motor de Otimização e a Matriz Nutricional para devolver, em 2 segundos, substitutos com a mesma equivalência calórica e proteica.

Diário Fotográfico com Visão Computacional: O paciente envia a foto do prato de comida; a plataforma identifica os alimentos, cruza com a refeição prescrita e registra a adesão no painel do nutricionista.

Micro-Check-ins: Alertas de baixo atrito para incentivar a hidratação e o consumo de suplementação (ex: creatina, vitaminas) nos horários corretos.

🛠️ 3. Stack Tecnológico e Arquitetura
O sistema é modular e fortemente desacoplado, separando fluxos síncronos de alta criticidade numérica de fluxos assíncronos de processamento cognitivo (áudio/visão).

Frontend (B2B Client)
Framework: React.js / Next.js ou Vue.js.

Estilização: Tailwind CSS (foco em Material Design 3 e ergonomia clínica limpa).

Gestão de Estado: Zustand ou Redux (para gerenciar o fluxo complexo do Canvas B2B).

Streaming de Áudio: WebRTC / MediaRecorder API para chunking contínuo de áudio para o backend.

Backend, API e Orquestração (Gateway Layer)
API REST/GraphQL: Node.js (NestJS) ou Python (FastAPI). Responsável por CRUD de usuários, autenticação, controle de Tenants e regras de Compliance.

Comunicação Tempo Real: Servidor WebSocket acoplado para empurrar o JSON extraído do áudio e atualizar o HUD metabólico instantaneamente.

Orquestrador Agêntico: Framework de LLM (LangChain / LlamaIndex) para gerenciar o estado da conversa e invocar Tools (Function Calling).

Pipeline Cognitivo e Workers (Assíncrono)
Message Broker: RabbitMQ ou Apache Kafka para lidar com a ingestão massiva de áudio (Ambient Scribing) e filas de processamento sem bloquear a UI.

Modelos IA:

Whisper (OpenAI) via gRPC para Speech-to-Text.

GPT-4o / Claude 3.5 Sonnet para extração semântica e Agente Conversacional.

Modelos de Visão (ex: GPT-4-Vision) para OCR e diário fotográfico.

Core Determinístico e Matemática (Tool Layer)
Motor Otimizador (MIGP): Escrito em Python ou C++ utilizando o solver de alta performance HiGHS. Constrói a Matriz de Otimização Inteira Mista em tempo de execução garantindo gramaturas viáveis e precisão metabólica.

Geração Documental: Módulo interno para compilar metadados e emitir PDFs diagramados com assinatura eletrônica acoplada.

Camada de Persistência (Data Layer)
Banco Relacional: PostgreSQL. Armazena Cadastros, Tenants, Prontuários e, crucialmente, as Tabelas de Composição de Alimentos (TACO, TBCA).

Banco de Cache/Estado: Redis. Retém sessões WebSocket, tokens, rate limits e gerencia o buffer local do Editor Dietético.

Banco Vetorial (RAG): pgvector, Qdrant ou Pinecone. Para armazenar embeddings de históricos de pacientes e protocolos clínicos para recuperação semântica rápida pela IA.

Object Storage: AWS S3 para guarda segura (criptografada) de áudios em RAW, exames laboratoriais em PDF e fotos posturais.

🗺️ 4. Arquitetura Funcional (Agentic Workflow)
O diagrama abaixo consolida a topologia de produto e engenharia. Ele ilustra como a IA atua como o Cérebro Roteador, delegando demandas para o Esquadrão de Agentes, que por sua vez, utilizam as Ferramentas Determinísticas (Tools) para evitar alucinações de cálculo.


flowchart TD
    classDef front fill:#bbdefb,stroke:#1565c0,stroke-width:2px,color:#000
    classDef aiBrain fill:#f3e5f5,stroke:#8e24aa,stroke-width:3px,color:#000
    classDef agent fill:#e1bee7,stroke:#6a1b9a,stroke-width:2px,color:#000
    classDef tool fill:#e8f5e9,stroke:#43a047,stroke-width:2px,color:#000
    classDef db fill:#eceff1,stroke:#546e7a,stroke-width:2px,color:#000

    %% ==========================================
    %% 1. JORNADA UI B2B E B2C
    %% ==========================================
    subgraph UI [1. Canais e Interfaces da Jornada]
        direction LR
        W_B2B["🖥️ Interface Consultorio B2B\nCanvas Clinico e Microfone\nEditor Dietetico Conversacional"]:::front
        W_B2C["📱 Interface Zero App B2C\nRecepcao via WhatsApp API\nMicro-check-ins e Diarios"]:::front
    end

    %% ==========================================
    %% 2. ORQUESTRADOR IA (O CÉREBRO)
    %% ==========================================
    subgraph Gateway [2. Gateway e Roteamento de Intencoes]
        direction TB
        API_GW["🔌 API Gateway e WebSockets"]:::aiBrain
        Brain["🧠 Cerebro LLM Roteador\nOrquestrador Agentico (LangChain)"]:::aiBrain
    end

    %% ==========================================
    %% 3. AGENTES IA (TRABALHADORES FUNCIONAIS)
    %% ==========================================
    subgraph Agentes [3. Esquadrao de Agentes IA - Service Layer]
        direction TB
        Ag_Scribing["🎙️ Agente Scribing\nOuve consulta passivamente\nEstrutura Queixas em JSON"]:::agent
        Ag_Vision["👁️ Agente Analista Visual\nExtrai Dados de Hemogramas\nAvalia Foto do Prato B2C"]:::agent
        Ag_Copilot["🤖 Agente Copiloto Dietetico\nTraduz comando do Nutricionista\nPrepara variaveis p/ Calculo"]:::agent
        Ag_Patient["💬 Agente Paciente (WhatsApp)\nAcolhe duvidas e gerencia\nintencao de substituicao"]:::agent
    end

    %% ==========================================
    %% 4. MOTORES DETERMINÍSTICOS (AS TOOLS DA IA)
    %% ==========================================
    subgraph Tools [4. Motores Deterministicos - Tools]
        direction TB
        Calc_Fisico["🧬 Calculadora de Fisiologia\nProcessa TMB (Cunningham)\nMetas Calolicas e Leucina"]:::tool
        Solver_MIGP["⚙️ Motor Otimizador HiGHS\nCalcula fracoes matematicas TACO\nGarante Macros Exatos (<100ms)"]:::tool
        Compliance["📝 Motor de Compliance\nAssinatura 2FA e Selo CFN 856\nEmissao Segura do PDF"]:::tool
    end

    %% ==========================================
    %% 5. PERSISTÊNCIA E MEMÓRIA
    %% ==========================================
    subgraph Dados [5. Camada de Dados e Memoria]
        direction LR
        DB_SQL[("🗄️ PostgreSQL\nTabelas de Alimentos TACO\nMatriz de Substituicoes\nDados Cadastrais")]:::db
        DB_Vector[("📈 Banco Vetorial\nMemoria Clinica e RAG")]:::db
        S3_Storage[("☁️ AWS S3 Storage\nUploads Criptografados\n(Zero-Data Retention)")]:::db
    end

    %% ==========================================
    %% MAPEAMENTO DOS FLUXOS DE EXECUÇÃO
    %% ==========================================

    %% Conexoes da UI para o Cérebro
    W_B2B <--> API_GW
    W_B2C <--> API_GW
    API_GW <--> Brain

    %% O Cerebro delega aos Agentes
    Brain -->|Fluxo de Audio / Consulta| Ag_Scribing
    Brain -->|Laudo, InBody ou Foto| Ag_Vision
    Brain -->|Comando de Montagem de Dieta| Ag_Copilot
    Brain -->|Mensagem Recebida via Whats| Ag_Patient

    %% Agentes usam Tools (Function Calling)
    Ag_Vision -->|Envia Bioimpedancia para calculo| Calc_Fisico
    Ag_Copilot -->|Envia macros e alimentos para| Solver_MIGP
    Ag_Patient -->|Verifica viabilidade de troca| Solver_MIGP
    Brain -->|Finalizacao e Disparo| Compliance

    %% Tools comunicam com a base e geram compliance
    Solver_MIGP <--> DB_SQL
    Calc_Fisico --> DB_SQL
    Compliance --> DB_SQL
    Ag_Vision --> S3_Storage
    Brain <--> DB_Vector
    Ag_Scribing -.-> S3_Storage
