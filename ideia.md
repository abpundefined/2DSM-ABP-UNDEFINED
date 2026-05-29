# ideia.md - Documento de Visão Geral: Secretaria Digital - Fatec Jacareí

## 1. Visão Geral e Desafio
A Secretaria Acadêmica da Fatec Jacareí sofre com sobrecarga operacional devido a dúvidas recorrentes de alunos e externos[cite: 4]. 
A solução é uma aplicação web de autoatendimento, baseada em um modelo de chatbot conversacional, que conduz o usuário por uma árvore de navegação para fornecer respostas objetivas e evidências documentais extraídas de regulamentos e calendários oficiais[cite: 4].

## 2. Perfis de Usuário
O sistema possui controle de acesso baseado em papéis (RBAC)[cite: 4]:
* **Aluno / Visitante:** Acesso público e sem autenticação. Interage com o chatbot e avalia o atendimento[cite: 4].
* **Secretária Acadêmica:** Acesso autenticado. Pode visualizar logs de navegação, listar perguntas enviadas pelos usuários e atualizar o status dessas perguntas[cite: 4].
* **Administrador:** Acesso autenticado. Pode criar, editar e excluir nós de navegação, gerenciar documentos e gerenciar usuários do perfil Secretaria[cite: 4].

## 3. Core Features (Escopo do MVP)
* **Navegação Conversacional (RF01):** Fluxos condicionados baseados em escolhas de menus armazenados no banco[cite: 4].
* **Repositório de Conhecimento (RF02):** Respostas padronizadas vinculadas a trechos indexados de documentos oficiais[cite: 4].
* **Envio de Dúvidas (RF05):** Ao final do fluxo, o usuário pode enviar uma pergunta detalhada informando seu e-mail institucional[cite: 4].
* **Avaliação e Logs (RF07, RF08):** Registro do nível de satisfação ("Gostei" / "Não gostei") e rastreabilidade completa de toda a interação de navegação e horários[cite: 4].

## 3. Requisitos Funcionais e Status de Desenvolvimento (Sprint 3)

Para manter a integridade do código, a IA deve respeitar estritamente o status de cada módulo. Módulos concluídos só devem ser alterados se explicitamente solicitado via arquivo de `issue`.

### 3.1. Funcionalidades Já Implementadas (Núcleo Estável - NÃO RECRIAR)
* **Navegação Conversacional (RF01):** O chat público do Aluno já está renderizando na tela com base de menus armazenados no banco.
* **Repositório de Conhecimento (RF02):** A estrutura de perguntas e respostas com indexação documental já foi modelada no PostgreSQL.
* **Autenticação Base (RF09):** O formulário de login foi criado, o token JWT está sendo gerado pelo backend e o acesso à área administrativa inicial foi construído.
* **Infraestrutura (RNF05/RNF06):** O projeto já roda via Docker e Docker Compose com Frontend, Backend e PostgreSQL conectados.

### 3.2. Backlog Ativo e Melhorias (Foco Atual da Sprint 3)
* **Segurança de Interface:** Inserir opções de visualização de senha (olhinho), fluxo de "Esqueceu sua senha" e logout seguro limpando o localStorage.
* **Envio e Gestão de Dúvidas (RF05 / RF06):** Finalizar o fluxo onde o aluno envia uma dúvida por e-mail e o painel da Secretária Acadêmica lista e atualiza o status dessas perguntas.
* **Dashboard e Gestão de Conteúdo (RF04):** Construir a interface administrativa protegida (RBAC) para o Administrador gerenciar documentos, logs e usuários, e a Secretária gerenciar atendimentos.
* **Refinamento de UI/UX:** Garantir responsividade total, correções de acentuação e navegação fluida (ex: botão de voltar ao topo).