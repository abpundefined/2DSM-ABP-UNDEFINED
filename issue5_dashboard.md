# Issue #5: Redesign UI/UX e Expansão de Métricas (Top Perguntas e E-mails)

## Objetivo
1. Corrigir o bug de roteamento no Header ("Voltar para o chat" está deslogando o usuário).
2. Aplicar um redesign completo no Dashboard para remover a estética amadora, usando princípios modernos de UI (sombras suaves, cantos arredondados, espaçamento adequado).
3. Adicionar novos gráficos baseados no fluxo da árvore de decisões do chatbot e disparos de e-mail.

## Especificações Técnicas - Backend
No arquivo `dashboard.controller.ts`, adicione duas novas consultas SQL ao `Promise.all`:
1. **Top Perguntas do Chatbot:** Consultar a tabela responsável por registrar os cliques/acessos aos nós de navegação (`interaction_logs` ou `navigation_nodes`) para retornar o Top 5 categorias/perguntas mais acessadas.
2. **Volume de E-mails:** Consultar a tabela de logs de e-mail (ou interações de contato) para retornar a contagem de e-mails enviados para a secretaria nos últimos dias.
*Atualize a tipagem do payload de retorno para incluir `topQuestionsData` e `emailsData`.*

## Especificações Técnicas - Frontend
1. **Correção do Bug de Logout (`Header.tsx` ou equivalente):** O botão "Voltar para o chat" DEVE usar o hook `useNavigate()` do `react-router-dom` (ex: `Maps('/')`) em vez de tags `<a>` ou `window.location.href`, garantindo que o estado de autenticação (Context/Zustand) não seja perdido com um reload da página.
2. **Redesign Visual (`Dashboard.css` / `.tsx`):**
   * Melhorar o grid. Remover pílulas soltas (como o "Todo o período" ao lado do título).
   * Refinar os `StatCards`: usar um background branco ou cinza bem claro, com sombras muito sutis (`box-shadow: 0 2px 8px rgba(0,0,0,0.05)`), bordas arredondadas (8px) e tipografia moderna (pesos corretos para título e valor).
   * Estilizar os Empty States para parecerem intencionais e profissionais, sem ícones amadores.
3. **Novos Gráficos:**
   * Adicionar um `BarChart` com layout horizontal (`layout="vertical"`) para exibir o "Top 5 Perguntas Mais Acessadas" (facilita a leitura dos nomes das categorias).
   * Adicionar um gráfico (Linha ou Barra) para "E-mails Enviados".
   * Organizar os gráficos em um grid limpo (ex: 2x2 ou 1 linha com 3 menores e 1 destaque).