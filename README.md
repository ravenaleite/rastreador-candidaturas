# Rastreador de candidaturas

![testes](https://github.com/ravenaleite/rastreador-candidaturas/actions/workflows/testes.yml/badge.svg)

Quem está procurando vaga perde o fio: não lembra onde aplicou, quem
respondeu, nem quando cobrar retorno. Este app resolve isso num quadro
estilo Kanban, com cada pessoa vendo apenas as próprias candidaturas.

**Em construção.** Entrega prevista para 18/10/2026.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript |
| Banco e login | Supabase (Postgres + Auth) |
| Arrastar e soltar | dnd-kit |
| Testes | Vitest |
| CI | GitHub Actions |

## Rodando

```bash
npm install
cp .env.example .env.local   # preencha com os dados do seu Supabase
npm run dev                  # localhost:3000
npm test                     # 23 testes das regras e das métricas
```

## Duas decisões técnicas

### 1. O isolamento entre usuários fica no banco, não na tela

O filtro por usuário poderia ficar só no front-end. Mas o front roda na
máquina da outra pessoa, e qualquer um pode chamar a API do Supabase
diretamente, fora do app.

Por isso a tabela usa **Row Level Security**: quatro políticas que
comparam `auth.uid()` com a coluna `usuario_id`. A regra está no banco.
Mesmo que alguém chame a API por fora, só recebe as próprias linhas.

### 2. As regras de negócio não conhecem o React

As transições de status e o cálculo das métricas ficam em `lib/`, em
arquivos sem nenhum import de React. São funções puras: recebem dados,
devolvem dados, não olham relógio nem consultam banco.

Duas consequências práticas:

- `estaAtrasado(followUp, hoje, status)` recebe a data de hoje como
  parâmetro. Se chamasse `new Date()` por dentro, o resultado mudaria a
  cada execução e o teste não teria o que afirmar.
- A suíte roda em cerca de 300 ms, sem navegador. É isso que torna
  viável rodar os testes a cada push no CI.

## Estrutura

```
app/              telas
lib/
  tipos.ts        os cinco status e o formato de uma candidatura
  status.ts       regras de transição e de follow-up atrasado
  metricas.ts     total, taxa de resposta e contagem por etapa
  *.test.ts       os testes dessas duas últimas
.github/workflows/testes.yml
```

---

Projeto da mentoria DevVagas, por [Ravena Leite](https://www.linkedin.com/in/ravena-leite-3a5804399/).
