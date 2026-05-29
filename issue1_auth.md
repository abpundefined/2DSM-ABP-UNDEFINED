# Issue #1: Melhorias de Segurança e Autenticação (Épico 4)

## Arquivos Alvo
* `frontend/src/components/admin/Login.tsx`
* `frontend/src/hooks/useAuth.ts`
* `frontend/src/services/authService.ts`

## Objetivo
Aprimorar a experiência de autenticação do usuário no painel administrativo, implementando Logout seguro, Visualização de Senha (toggle) e o fluxo visual de Recuperação de Senha.

## Alterações de Lógica
1. **`useAuth.ts`**: Atualizar ou criar a função de `logout` para garantir a remoção do token JWT do `localStorage` e a atualização do estado global/local.
2. **`authService.ts`**: Adicionar um método estático `recoverPassword(email: string)` que retorne uma Promise simulando o envio de um e-mail de recuperação (use um delay de 1 segundo para simular o backend).
3. **`Login.tsx`**:
   * Criar o estado `showPassword` (boolean) para alternar o atributo `type` do input de senha entre `password` e `text`.
   * Criar o estado `isForgotPassword` (boolean) para gerenciar a transição entre o formulário de login e o formulário de recuperação.

## Alterações de Interface
* **Olhinho da Senha**: Inserir um botão limpo dentro (ou ao lado) do input de senha para alternar a visibilidade.
* **Link de Recuperação**: Adicionar o texto clicável "Esqueceu sua senha?" abaixo do botão principal de login.
* **Transição de Tela**: Quando `isForgotPassword` for `true`, o componente deve ocultar o campo de senha e exibir apenas: um input de E-mail, um botão "Enviar Instruções" e um link "Voltar ao Login".
* **Regra Estrita**: Proibido utilizar CSS inline. Todas as novas estilizações devem ser feitas utilizando classes no arquivo CSS global ou do componente.