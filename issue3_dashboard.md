# Issue #3: Criação do Dashboard de Estatísticas (Painel Administrativo)

## Arquivos Alvo
* `backend/src/controllers/dashboard.controller.ts` (Novo)
* `backend/src/routes/dashboard.routes.ts` (Novo)
* `frontend/src/components/admin/Dashboard.tsx` (Novo)
* `frontend/src/services/dashboardService.ts` (Novo)

## Objetivo
Criar a tela inicial (Dashboard) da Área Administrativa, exibindo cards de resumo rápido e um gráfico visual das interações dos alunos. A rota do backend deve ser estritamente protegida pelo middleware de autenticação (JWT).

## Especificações Técnicas - Backend
1. **`dashboard.routes.ts`**: Criar a rota `GET /admin/dashboard/stats`. Aplicar o middleware de verificação de JWT.
2. **`dashboard.controller.ts`**: 
   * Como a tabela de 'dúvidas' ainda está sendo estruturada, o endpoint deve retornar uma estrutura de dados com valores reais (ex: total de usuários do banco) mesclados com dados simulados (mock) para os gráficos.
   * **Payload esperado:**
     ```json
     {
       "summary": { "totalUsers": 2, "pendingQuestions": 14, "resolvedQuestions": 45 },
       "chartData": [
         { "day": "Segunda", "questions": 5 },
         { "day": "Terça", "questions": 12 },
         { "day": "Quarta", "questions": 8 }
       ]
     }
     ```

## Especificações Técnicas - Frontend
1. **Instalação:** Utilizar a biblioteca `recharts` para o gráfico (`npm install recharts`).
2. **`dashboardService.ts`**: Criar função `getStats()` que faz a requisição `GET` para a API, passando o JWT no header `Authorization: Bearer <token>`.
3. **`Dashboard.tsx`**:
   * Layout em Grid.
   * **Topo:** Header com o logo da Fatec e o botão de "Sair" (Logout).
   * **Meio (Cards):** Três cards lado a lado exibindo os dados do "summary" retornado pela API.
   * **Base (Gráfico):** Um gráfico de linhas ou barras usando o `recharts` lendo o "chartData".
   * **Visual:** Manter estritamente a identidade visual do `Login.tsx` (tons de cinza, branco e o vermelho Fatec).