# Story 8 — Gestão de check-ins (admin) + Frequência do aluno

**ID:** STORY-2.5 / 2.6 / 2.7 / 2.8  
**Fase:** 2 — Operação esportiva (parte 2)  
**Status:** Implemented  
**Prioridade:** P0

---

## Descrição

Como **responsável autorizado/admin**, quero confirmar ou recusar check-ins pendentes e consultar o histórico, e como **aluno**, quero acompanhar o status do meu check-in e consultar meu histórico de presença.

## Acceptance Criteria

- [ ] **AC1:** `/admin/checkins` lista check-ins pendentes (aluno, treino, data, horário, local)
- [ ] **AC2:** Botões "Confirmar" e "Recusar" por check-in
- [ ] **AC3:** Confirmação/recusa registra `decided_by` e `decided_at` (auditoria — exigido pela RLS)
- [ ] **AC4:** Somente check-ins confirmados contam como presença
- [ ] **AC5:** Filtros no histórico: período, treino, aluno, status
- [ ] **AC6:** Métricas na tela: total, confirmados, recusados, pendentes
- [ ] **AC7:** Aluno vê o status do check-in do dia (pendente/confirmado/recusado) em `/checkin`
- [ ] **AC8:** `/frequencia` lista presenças confirmadas com filtro por período
- [ ] **AC9:** Exibir contagem de treinos realizados
- [ ] **AC10:** RLS: admin pode atualizar qualquer check-in; aluno pode ver os próprios

## Arquivos envolvidos

```
src/app/admin/checkins/
└── page.tsx               # NOVO — Pendentes + histórico (abas ou seções)

src/app/(student)/frequencia/page.tsx  # MODIFICAR — placeholder → histórico de presença

src/components/admin/
├── PendingCheckinList.tsx # NOVO — Pendentes com Confirmar/Recusar
├── CheckinHistory.tsx     # NOVO — Histórico com filtros e métricas
└── CheckinStatusBadge.tsx # NOVO — Badge pendente/confirmado/recusado

src/components/student/
└── FrequencyHistory.tsx   # NOVO — Histórico de presenças do aluno

src/hooks/
├── useAdminCheckins.ts    # NOVO — Pendentes + histórico + confirmar/recusar
└── useStudentCheckins.ts  # NOVO — Check-ins do aluno logado
```

## Dependências

- **Story 7** — Treinos e check-in do aluno (dados existentes para gerenciar)
- Tabela `checkins` + RLS já existem (migration 05)

## Stack técnica

| Aspecto | Decisão |
|---------|---------|
| Confirmação | `update checkins set status='confirmed', decided_by=auth.uid(), decided_at=now()` |
| Recusa | `update checkins set status='rejected', decided_by=..., decided_at=now()` |
| Filtros período | date-fns + inputs date |
| Métricas | Counts client-side ou query agregada |
| Frequência aluno | `checkins` com `status='confirmed'` do aluno logado |

## Regras de negócio

- Apenas admin (ou responsável autorizado de treino) confirma/recusa
- Confirmação/recusa é irreversível no MVP (decisão pendente do PRD — reverter fica para depois)
- Recusado NÃO entra na frequência
- A frequência é a soma de check-ins confirmados
- Auditoria: `decided_by` e `decided_at` obrigatórios (constraint na RLS)

## Checklist de implementação

- [X] Criar hook `useAdminCheckins.ts`
- [X] Criar `PendingCheckinList`, `CheckinHistory`, `CheckinStatusBadge`
- [X] Criar `/admin/checkins`
- [X] Implementar confirmar/recusar com auditoria
- [X] Implementar filtros e métricas
- [X] Criar hook `useStudentCheckins.ts`
- [X] Exibir status do dia em `/checkin`
- [X] Implementar `/frequencia` do aluno
- [X] Testar que só confirmado conta na frequência
- [X] Build + lint
