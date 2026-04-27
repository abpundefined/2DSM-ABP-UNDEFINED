<h1>🚀 2DSM-ABP-UNDEFINED</h1>

<p>
Este repositório contém o desenvolvimento do projeto interdisciplinar da disciplina de
<strong>Aprendizagem Baseada em Problemas (ABP)</strong> do curso de
<strong>Desenvolvimento de Software Multiplataforma</strong> da FATEC Jacareí.
</p>

<hr>

<h2>📌 Sumário</h2>

<ul>
<li><a href="#sobre">📖 Sobre o Projeto</a></li>
<li><a href="#tecnologias">🛠️ Tecnologias Utilizadas</a></li>
<li><a href="#requisitos">📑 Requisitos</a></li>
<li><a href="#userstories">📝 User Stories</a></li>
<li><a href="#integrantes">🧑‍💻 Integrantes</a></li>
</ul>

<hr>

<h2>🚀 Planejamento de Sprints</h2>

<ul>
<li>
<a href="#sprint1">⏱️ Sprint 1</a>
<ul>
<li><a href="#backlogsprint1">📋 Backlog</a></li>
<li><a href="#burndownsprint1">📉 Burndown</a></li>
</ul>
</li>

<li>
<a href="#sprint2">⏱️ Sprint 2</a>
<ul>
<li><a href="#backlogsprint2">📋 Backlog</a></li>
<li><a href="#burndownsprint2">📉 Burndown</a></li>
</ul>
</li>

<li>
<a href="#sprint3">⏱️ Sprint 3</a>
<ul>
<li><a href="#backlogsprint3">📋 Backlog</a></li>
<li><a href="#burndownsprint3">📉 Burndown</a></li>
</ul>
</li>
</ul>

<hr>

<h2>📎 Links</h2>

<ul>
<li>
<strong>Trello:</strong>
<a href="https://trello.com/b/T7wMGhWx/2dsm-abp-undefined" target="_blank">
Acessar Trello
</a>
</li>

<li>
<strong>Figma:</strong>
<a href="#" target="_blank">
Acessar Figma
</a>
</li>

<li>
<strong>Sistema:</strong>
<a href="#" target="_blank">
Acessar sistema
</a>
</li>
</ul>

<hr>

<h2 id="sobre">📖 Sobre o Projeto</h2>

<p>...</p>

<hr>

<h2 id="tecnologias">🛠️ Tecnologias Utilizadas</h2>

<p>
O desenvolvimento será realizado com as seguintes tecnologias, visando garantir performance e acessibilidade na aplicação.
</p>

<h3>🔧 Stack Principal</h3>

<ul>
<li>
<img src="./public/static/React-icon.svg.png" alt="React" width="20">
React
</li>

<li>
<img src="./public/static/ts-logo-128.png" alt="TypeScript" width="20">
TypeScript
</li>

<li>
<img src="./public/static/css-3.png" alt="CSS" width="20">
CSS
</li>

<li>
<img src="./public/static/postgresql.webp" alt="PostgreSQL" width="20">
PostgreSQL
</li>
</ul>

<hr>
<h2 id="requisitos">📑 Requisitos</h2>

<h3>✅ Requisitos Funcionais</h3>

<table>
<tr>
<th>Código</th>
<th>Descrição</th>
</tr>

<tr>
<td>RF01</td>
<td>Navegação conversacional por menus e submenus hierárquicos em formato de chatbot, com fluxo condicionado às escolhas do usuário e baseado em dados armazenados no banco.</td>
</tr>

<tr>
<td>RF02</td>
<td>Repositório estruturado contendo nós de navegação, perguntas e respostas, documentos oficiais, trechos indexados (chunks) e metadados da fonte.</td>
</tr>

<tr>
<td>RF03</td>
<td>Perfis de usuário: Aluno (público), Secretária Acadêmica (autenticado) e Administrador (autenticado).</td>
</tr>

<tr>
<td>RF04</td>
<td>Administrador pode gerenciar conteúdo (criar, editar, excluir nós), documentos, usuários e visualizar logs.</td>
</tr>

<tr>
<td>RF05</td>
<td>Envio de perguntas à Secretaria Acadêmica com texto da dúvida e e-mail institucional.</td>
</tr>

<tr>
<td>RF06</td>
<td>Secretária Acadêmica pode listar perguntas e atualizar status (ex.: em aberto, respondida).</td>
</tr>

<tr>
<td>RF07</td>
<td>Registro de avaliação de satisfação do usuário (Gostei / Não gostei).</td>
</tr>

<tr>
<td>RF08</td>
<td>Registro de logs contendo fluxo de navegação, perguntas enviadas, avaliação e data/hora.</td>
</tr>

<tr>
<td>RF09</td>
<td>Autenticação por login e senha para Secretária Acadêmica e Administrador.</td>
</tr>

<tr>
<td>RF10</td>
<td>Controle de acesso baseado em papéis (RBAC), restringindo funcionalidades conforme perfil.</td>
</tr>

<tr>
<td>RF11</td>
<td>Proteção de rotas administrativas com middleware e validação de token.</td>
</tr>

</table>

<hr>

<h3>⚙️ Requisitos Não Funcionais</h3>

<table>
<tr>
<th>Código</th>
<th>Descrição</th>
</tr>

<tr>
<td>RNF01</td>
<td>Interface simples, clara, responsiva e adaptada para dispositivos móveis.</td>
</tr>

<tr>
<td>RNF02</td>
<td>Tempo de resposta adequado para uso interativo e consultas ao banco de dados.</td>
</tr>

<tr>
<td>RNF03</td>
<td>Documentação técnica contendo visão geral, modelo de dados, arquitetura, instruções de execução e endpoints da API.</td>
</tr>

<tr>
<td>RNF04</td>
<td>Modelagem UML com diagramas de casos de uso, classes, sequência e componentes.</td>
</tr>

<tr>
<td>RNF05</td>
<td>Execução containerizada com Docker (PostgreSQL, Backend e Frontend).</td>
</tr>

<tr>
<td>RNF06</td>
<td>Orquestração com Docker Compose permitindo inicialização com comando único.</td>
</tr>

<tr>
<td>RNF07</td>
<td>Repositório com documentação completa (README, estrutura, funcionalidades e diagramas).</td>
</tr>

<tr>
<td>RNF08</td>
<td>Autenticação via JWT contendo ID, papel (role) e tempo de expiração, enviado via header Authorization.</td>
</tr>

<tr>
<td>RNF09</td>
<td>Segurança com uso de hash de senha (bcrypt), variáveis de ambiente e proteção de dados sensíveis.</td>
</tr>

<tr>
<td>RNF10</td>
<td>O sistema deve incluir um diagrama de casos de uso representando as interações entre os atores (Aluno, Secretária Acadêmica e Administrador) e as funcionalidades do sistema.</td>
</tr>

</table>

<hr>

<h3>🚧 Restrições de Projeto</h3>

<table>
<tr>
<th>Código</th>
<th>Descrição</th>
</tr>

<tr>
<td>RP01</td>
<td>Frontend obrigatório em React com TypeScript.</td>
</tr>

<tr>
<td>RP02</td>
<td>Backend obrigatório em Node.js com TypeScript.</td>
</tr>

<tr>
<td>RP03</td>
<td>Banco de dados PostgreSQL com uso de DDL e DML.</td>
</tr>

<tr>
<td>RP04</td>
<td>Execução exclusivamente via containers Docker.</td>
</tr>

<tr>
<td>RP05</td>
<td>Escopo compatível com MVP funcional (navegação, respostas estruturadas e evidências documentais).</td>
</tr>

<tr>
<td>RP06</td>
<td>Implementação obrigatória de autenticação com JWT no backend.</td>
</tr>

</table>

<hr>
<h2 id="userstories">📝 User Stories</h2>

<table>
<tr>
<th>ID</th>
<th>User Story</th>
<th>DoR (Definition of Ready)</th>
<th>DoD (Definition of Done)</th>
</tr>

<tr>
<td>RF01</td>
<td>Como usuário, quero navegar por menus no chatbot para encontrar informações da secretaria.</td>
<td>Estrutura de menus definida | Fluxo de navegação mapeado | Dados cadastrados</td>
<td>Navegação funcionando corretamente com menus e submenus respondendo conforme escolha do usuário</td>
</tr>

<tr>
<td>RF02</td>
<td>Como sistema, quero manter um repositório de conhecimento estruturado para responder usuários.</td>
<td>Modelagem do banco definida | Estrutura de dados planejada | Conteúdo inicial disponível</td>
<td>Repositório armazena perguntas, respostas, documentos e metadados corretamente</td>
</tr>

<tr>
<td>RF03</td>
<td>Como sistema, quero diferenciar perfis de usuário para controlar acessos.</td>
<td>Perfis definidos (Aluno, Secretária, Admin) | Regras de acesso mapeadas</td>
<td>Acesso controlado corretamente conforme perfil</td>
</tr>

<tr>
<td>RF04</td>
<td>Como administrador, quero gerenciar conteúdos para manter o chatbot atualizado.</td>
<td>Estrutura CRUD definida | Permissões configuradas</td>
<td>Administrador consegue criar, editar e excluir conteúdos corretamente</td>
</tr>

<tr>
<td>RF05</td>
<td>Como usuário, quero enviar perguntas para a secretaria quando não encontrar resposta.</td>
<td>Formulário definido | Campo de email validado | Integração pronta</td>
<td>Pergunta registrada corretamente no sistema</td>
</tr>

<tr>
<td>RF06</td>
<td>Como secretária, quero gerenciar perguntas enviadas para responder alunos.</td>
<td>Listagem de perguntas definida | Status de atendimento definido</td>
<td>Secretária visualiza perguntas e atualiza status</td>
</tr>

<tr>
<td>RF07</td>
<td>Como usuário, quero avaliar o atendimento para ajudar na melhoria do sistema.</td>
<td>Estrutura de avaliação definida | Opções de feedback criadas</td>
<td>Avaliação registrada corretamente</td>
</tr>

<tr>
<td>RF08</td>
<td>Como sistema, quero registrar logs de interação para análise e auditoria.</td>
<td>Eventos definidos | Estrutura de logs implementada</td>
<td>Logs armazenam interações com data e hora</td>
</tr>

<tr>
<td>RF09</td>
<td>Como usuário autenticado, quero fazer login para acessar áreas restritas.</td>
<td>Tela de login definida | Backend com JWT implementado</td>
<td>Usuário autenticado com sucesso e acesso liberado</td>
</tr>

<tr>
<td>RF10</td>
<td>Como sistema, quero controlar acesso por papéis (RBAC) para garantir segurança.</td>
<td>Regras de autorização definidas | Middleware implementado</td>
<td>Acesso restrito corretamente conforme papel do usuário</td>
</tr>

<tr>
<td>RF11</td>
<td>Como sistema, quero proteger rotas administrativas para evitar acesso indevido.</td>
<td>Middleware de autenticação configurado | Validação de token implementada</td>
<td>Rotas protegidas exigem autenticação válida</td>
</tr>

<tr>
<td>RNF10</td>
<td>Como professor de Engenharia de Software, quero que o sistema possua um diagrama de casos de uso para validar as interações entre os atores e as funcionalidades.</td>
<td>Atores definidos (Aluno, Secretária, Administrador) | Funcionalidades mapeadas | Escopo do sistema definido</td>
<td>Diagrama de casos de uso criado, validado e documentado no projeto</td>
</tr>

</table>

<hr>

<h2>🚀 Planejamento de Sprints</h2>

<h3 id="sprint1">⏱️ Sprint 1</h3>

<h4 id="backlogsprint1">📋 Backlog Sprint 1</h4>

<p><em>A definir</em></p>

<h4 id="burndownsprint1">📉 Burndown Sprint 1</h4>

<p><em>A definir</em></p>

<hr>

<h3 id="sprint2">⏱️ Sprint 2</h3>

<h4 id="backlogsprint2">📋 Backlog Sprint 2</h4>

<p><em>A definir</em></p>

<h4 id="burndownsprint2">📉 Burndown Sprint 2</h4>

<p><em>A definir</em></p>

<hr>

<h3 id="sprint3">⏱️ Sprint 3</h3>

<h4 id="backlogsprint3">📋 Backlog Sprint 3</h4>

<p><em>A definir</em></p>

<h4 id="burndownsprint3">📉 Burndown Sprint 3</h4>

<p><em>A definir</em></p>

<hr>

<h2 id="integrantes">🧑‍💻 Integrantes</h2>

<table>
<tr>
<th>Foto</th>
<th>Nome Completo</th>
<th>Papel</th>
<th>LinkedIn</th>
<th>GitHub</th>
</tr>

<tr>
<td><img src="./public/static/undefined/Marcus.jpg" width="80"></td>
<td>Marcus Vinicius Ribeiro do Nascimento</td>
<td>Product Owner</td>
<td><a href="https://www.linkedin.com/in/marcus-nascimento-50a0ba1b5">LinkedIn</a></td>
<td><a href="https://github.com/MarcusVRDN">GitHub</a></td>
</tr>

<tr>
<td><img src="./public/static/undefined/Pedro.jpg" width="80"></td>
<td>Pedro Augusto Gomes</td>
<td>Scrum Master</td>
<td><a href="https://www.linkedin.com/in/pedro-augusto-gomes">LinkedIn</a></td>
<td><a href="https://github.com/PedrinhoDBR">GitHub</a></td>
</tr>

<tr>
<td><img src="./public/static/undefined/Israel.jpg" width="80"></td>
<td>Israel da Silva Lemes</td>
<td>Dev</td>
<td><a href="https://www.linkedin.com/in/israel-lemes/">LinkedIn</a></td>
<td><a href="https://github.com/Israelisl">GitHub</a></td>
</tr>

<tr>
<td><img src="./public/static/undefined/Lorena.jpg" width="80"></td>
<td>João Paulo Lorena Dias da Silva</td>
<td>Dev</td>
<td><a href="https://www.linkedin.com/in/jo%C3%A3o-lorena-056b95271">LinkedIn</a></td>
<td><a href="https://github.com/Jonnaes">GitHub</a></td>
</tr>

<tr>
<td><img src="./public/static/undefined/Nadla.jpg" width="80"></td>
<td>Nadla Fernandes Ferreira</td>
<td>Dev</td>
<td><a href="https://www.linkedin.com/in/nadla-ferreira-4646433a8/">LinkedIn</a></td>
<td><a href="https://github.com/NadlaFernandes">GitHub</a></td>
</tr>

<tr>
<td><img src="./public/static/undefined/Rainan.jpg" width="80"></td>
<td>Rainan de Oliveira Reis</td>
<td>Dev</td>
<td><a href="https://www.linkedin.com/in/rainan-reis-757384365/">LinkedIn</a></td>
<td><a href="https://github.com/RainanKaneka">GitHub</a></td>
</tr>

<tr>
<td><img src="./public/static/undefined/Thales.jpg" width="80"></td>
<td>Thales Cambraia Dias</td>
<td>Dev</td>
<td><a href="https://www.linkedin.com/in/thales-tcd/">LinkedIn</a></td>
<td><a href="https://github.com/thalestcd">GitHub</a></td>
</tr>

</table>