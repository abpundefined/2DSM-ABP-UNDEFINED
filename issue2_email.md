# Issue #2: Integração de E-mail Real e Fluxo de Recuperação de Senha (Épico 2)

## Arquivos Alvo
* `backend/src/services/emailService.ts` (Novo)
* `backend/src/routes/auth.routes.ts`
* `backend/src/controllers/auth.controller.ts`
* `frontend/src/services/authService.ts`

## Objetivo
Implementar um serviço real de disparo de e-mails usando Nodemailer no backend, conectando o formulário frontend de "Esqueceu sua senha?" a um fluxo seguro de geração de token e redefinição de senha no banco de dados.

## Especificações Técnicas - Backend
1. **`emailService.ts`**: Criar um serviço utilizando `nodemailer`. Configurar o transportador (Transporter) utilizando variáveis de ambiente para `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER` e `SMTP_PASS`.
2. **Rota `/auth/forgot-password`**: 
   * Receber o e-mail do usuário.
   * Verificar se o usuário existe na base PostgreSQL.
   * Se existir, gerar um token numérico aleatório de 6 dígitos e salvar no banco com uma expiração de 15 minutos.
   * Disparar um e-mail contendo o código de verificação para o usuário.
3. **Rota `/auth/reset-password`**:
   * Receber o e-mail, o código de 6 dígitos e a nova senha.
   * Validar o código e a expiração.
   * Gerar o hash seguro da nova senha usando `bcrypt` e atualizar no banco de dados.

## Especificações Técnicas - Frontend
1. **`authService.ts`**: Substituir o método mockado por chamadas reais de `POST` usando o `apiClient` para os novos endpoints de esqueci a senha e redefinir senha.
2. **Interface**: Garantir que após o usuário digitar o e-mail e clicar em "Enviar", a tela exiba o campo para ele digitar o código de 6 dígitos recebido e a nova senha desejada.