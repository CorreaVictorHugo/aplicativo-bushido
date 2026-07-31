# Story 11 — Dashboard administrativo

**ID:** STORY-3.4 / 3.5 / 3.6  
**Fase:** 3 — Graduação e indicadores  
**Status:** Implemented  
**Prioridade:** P0

---

## Descrição

Como **administrador**, quero consultar indicadores da academia em um dashboard com filtro por período (mês ou intervalo de datas), para que eu possa acompanhar alunos, presenças e graduações.

## Acceptance Criteria

- [ ] **AC1:** `/admin/dashboard` exibe indicadores gerais
- [ ] **AC2:** Cards: alunos ativos, alunos novos (data de entrada no período)
- [ ] **AC3:** Cards: total de check-ins no período, confirmados, recusados, pendentes
- [ ] **AC4:** Card: graduações no período
- [ ] **AC5:** Distribuição de alunos por faixa (lista ou gráfico simples)
- [ ] **AC6:** Filtro por mês (input month) ou intervalo de datas (date start/end)
- [ ] **AC7:** Indicadores atualizam conforme o período selecionado
- [ ] **AC8:** Estados de loading/erro/vazio

## Arquivos envolvidos

```
src/app/admin/dashboard/page.tsx   # MODIFICAR — placeholder → dashboard

src/components/admin/
└── DashboardCards.tsx   # NOVO — cards de indicadores

src/hooks/
└── useAdminDashboard.ts # NOVO — queries de indicadores por período
```

## Dependências

- **Migration 12** (RLS admin) — para consultar dados de todas as tabelas
- **Story 5** — Layout admin

## Stack técnica

| Aspecto | Decisão |
|---------|---------|
| Período | Estado local (month | start/end) → filtro nas queries |
| Alunos ativos | `students` status='active' |
| Alunos novos | `students` entry_date no período |
| Check-ins | `checkins` com `class_date` no período |
| Graduações | `graduations` com `date` no período |
| Faixas | `students` agrupado por belt (client-side) |
| Gráficos | Sem lib externa no MVP — cards + listas |

## Regras de negócio

- Aluno novo = data de entrada dentro do período selecionado
- Treino realizado = check-in confirmado
- Frequência/faltas NÃO são exibidas (denominador indefinido no MVP — decisão do PRD)
- Somente check-ins confirmados entram nas métricas de presença (quando aplicável)

## Checklist de implementação

- [X] Criar hook `useAdminDashboard.ts`
- [X] Criar `DashboardCards`
- [X] Implementar filtro de período (mês + intervalo)
- [X] Implementar cards e distribuição por faixa
- [X] Estados de loading/erro/vazio
- [X] Build + lint
