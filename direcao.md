# direcao.md - Diretrizes de Desenvolvimento (2DSM-ABP-UNDEFINED)

Este documento serve como guia arquitetural estrito para o Antigravity no projeto da Secretaria Digital da Fatec. 

## 1. Stack Tecnológica
* **Frontend:** React + Vite + TypeScript.
* **Estilização:** CSS modular e global padronizado (Proibido o uso de estilos inline extensos ou bibliotecas de UI pesadas sem autorização prévia).
* **Backend:** Node.js com Express e banco de dados PostgreSQL.

## 2. Princípios de Arquitetura Front-end
* **Separação de Lógica (SoC):** Toda a lógica de chamadas à API (fetch) DEVE ficar isolada na pasta `src/services/`.
* **Gerenciamento de Estado:** A lógica complexa de estado DEVE ser abstraída em Custom Hooks na pasta `src/hooks/` (ex: `useAuth.ts`, `useChat.ts`).
* **Componentes Burros (Dumb Components):** Os componentes visuais (arquivos `.tsx` na pasta `components/`) devem se limitar a renderizar o visual e receber dados dos Hooks.

## 3. Segurança e Padrões de Código
* Nenhuma rota administrativa pode ser exposta sem validação de Token JWT.
* Evite o uso indiscriminado do tipo `any` no TypeScript. Tipagens genéricas ou tratamento seguro de erros (`as Error`) são obrigatórios.

## 4. UI/UX e Design System (Padrão Fatec Jacareí)
* **Cores Principais:** O vermelho escuro institucional (ex: `#b30000` ou `#a00000`), branco, cinza claro para fundos (`#f5f5f5`) e textos em cinza escuro/preto (`#333333`).
* **Estilo de Botões Primários:** Sem bordas, fundo vermelho institucional, texto branco, cantos levemente arredondados (`border-radius: 4px` a `8px`) e efeito de `hover` escurecendo o tom.
* **Proibições Visuais:** É estritamente proibido o uso da tag `<button>` padrão do HTML sem estilização CSS. 
* **Links e Ações Secundárias:** Elementos como "Esqueceu sua senha?" devem ser estilizados como hiperlinks (texto limpo, sem caixas em volta, com `text-decoration: underline` ao passar o mouse) ou texto clicável discreto.
* **Ícones (UX):** Para ações em inputs (como o olhinho de revelar senha), NÃO use botões externos. Crie um `wrapper` (container relativo) ao redor do input e posicione o ícone de forma absoluta (`position: absolute`) no canto direito de dentro do campo de texto. Utilize SVGs inline limpos para ícones.