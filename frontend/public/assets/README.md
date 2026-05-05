# Assets - Arquivos Públicos

Esta pasta contém todos os arquivos estáticos (imagens, PDFs, etc.) que são servidos pelo frontend.

## Estrutura

- `png/` - Imagens em formato PNG (ex: horários de aulas)
- `pdf/` - Documentos em PDF (calendários, regulamentos, etc.)

## Como adicionar arquivos

1. **Horários (PNG)**:
   - Coloque os arquivos de horários em `png/`
   - Exemplo: `horario-aula-1dsm.png`, `horario-aula-2geo.png`
   - Tamanho recomendado: até 2MB por arquivo

2. **Documentos (PDF)**:
   - Coloque os PDFs em `pdf/`
   - Exemplo: `DSM-PPC.pdf`, `Calendario_Academico_2026.pdf`

## Referências no Banco de Dados

No seed SQL (`backend/db/init/02_seed.sql`):
- Use `/assets/png/nome-do-arquivo.png` para imagens
- Use `/assets/pdf/nome-do-arquivo.pdf` para PDFs

Exemplo no banco:
```sql
SELECT upsert_navigation_node(
  'dsm-horario-aulas',
  '1º semestre',
  'dsm-horario-aulas-1-semestre',
  NULL,
  'Horário de aulas do 1º semestre.',
  NULL,
  'assets/png/horario-aula-1dsm.png',  -- <- arquivo será aberto em nova aba
  1,
  TRUE
);
```

## Nota sobre o Docker

Quando em Docker, os arquivos em `frontend/public/assets/` serão servidos automaticamente pela aplicação Vite em `http://localhost:5173/assets/`.

Ao reconstruir o container, certifique-se de que os arquivos estão presentes antes de fazer `docker-compose up --build`.
