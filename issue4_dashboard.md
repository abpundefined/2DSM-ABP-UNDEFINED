# Issue #4: Evolução do Dashboard (UI Pro, Novos Gráficos e Dados Reais)

## Objetivo
Refatorar a tela de Dashboard Administrativa gerada na Issue 3. O layout atual está engessado, com botões duplicados e dados fixos (mock). O novo requisito exige um painel de nível profissional, com múltiplos gráficos (Barras e Pizza), filtros de BI e integração total com o banco de dados PostgreSQL.

## Especificações Técnicas - Backend (`dashboard.controller.ts` e `dashboard.routes.ts`)
1. **Remoção do Mock:** O controlador DEVE parar de retornar dados fixos. Ele deve importar o pool de conexão do banco de dados e executar consultas SQL reais.
2. **Consultas SQL necessárias (com base na estrutura do sistema de chat da Fatec):**
   * Total de usuários (tabela `users`).
   * Total de dúvidas pendentes e resolvidas (tabela de logs ou perguntas do chat).
   * Contagem de dúvidas agrupadas por data (para o gráfico de barras).
   * Contagem de usuários ou interações por tipo (ex: Aluno vs Visitante) para o gráfico de pizza.
3. **Filtros Dinâmicos (Parâmetros de Query):** A rota `GET /admin/dashboard/stats` deve aceitar query params (`?period=all|30d|7d&course=id&role=type`). O SQL deve adicionar blocos `WHERE` dinamicamente baseados nesses filtros.

## Especificações Técnicas - Frontend (`Dashboard.tsx`)
1. **Correção de Layout:** Remover a redundância de botões de "Atualizar". O cabeçalho deve ser limpo e profissional.
2. **Interatividade:** Os `StatCards` (Usuários, Pendentes, Resolvidas) devem ser clicáveis e possuir um efeito de `hover`. Ao clicar, devem mudar a aba ativa do painel administrativo (ex: ir para a aba de 'Dúvidas' filtrando pelo status).
3. **Barra de Filtros (Nova):** Abaixo dos cards e acima dos gráficos, implementar uma barra horizontal contendo selects HTML para os filtros: Período (Últimos 7 dias, Mês atual, Todo o período), Perfil (Todos, Alunos, Não-alunos). Ao mudar o filtro, a função `fetchStats` deve ser chamada novamente.
4. **Novos Gráficos (Recharts):**
   * Manter o `BarChart` atualizado com o design da Fatec (cores vermelhas e cinzas limpas).
   * Adicionar um componente `PieChart` (Gráfico de Pizza) ao lado ou abaixo do gráfico de barras para mostrar a distribuição de tipos de usuários ou status das dúvidas.
5. **Tratamento de Estado Vazio:** Se o banco de dados retornar arrays vazios, exibir um *Empty State* visualmente agradável ("Nenhum dado encontrado para o período selecionado") no lugar dos gráficos.