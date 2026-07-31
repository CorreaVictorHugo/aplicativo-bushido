# Story 7 — Treinos (admin) + Check-in do aluno

**ID:** STORY-2.1 / 2.3 / 2.4  
**Fase:** 2 — Operação esportiva (parte 1)  
**Status:** Implemented  
**Prioridade:** P0

---

## Descrição

Como **administrador**, quero criar e gerenciar treinos (modalidade, dia, horário, local, capacidade, status), e como **aluno**, quero ver os treinos do dia e fazer check-in.

## Acceptance Criteria

- [ ] **AC1:** `/admin/treinos` lista treinos com status (ativo/inativo)
- [ ] **AC2:** `/admin/treinos/novo` e `/admin/treinos/[id]/editar` — formulário (modalidade, dia da semana, horário, local, capacidade, status)
- [ ] **AC3:** Ações: editar, ativar/desativar
- [ ] **AC4:** Validação Zod no formulário
- [ ] **AC5:** Página do aluno `/checkin` exibe os treinos do dia (modalidade, horário, local)
- [ ] **AC6:** Botão "Fazer check-in" cria registro com status `pending`
- [ ] **AC7:** Impedir check-in duplicado (mesmo aluno + mesmo treino + mesmo dia) — mostra "Já feito"
- [ ] **AC8:** Impedir check-in de aluno inativo
- [ ] **AC9:** Capacidade é apenas informativa (SEM bloqueio de aluno por lotação)
- [ ] **AC10:** Feedback visual após o check-in ("Aguardando confirmação")
- [ ] **AC11:** RLS permite aluno inserir check-in próprio (pending, class_date = hoje)

## Arquivos envolvidos

```
src/app/admin/treinos/
├── page.tsx               # NOVO — Lista de treinos
├── novo/page.tsx          # NOVO — Formulário
└── [id]/editar/page.tsx   # NOVO — Formulário

src/app/(student)/checkin/page.tsx   # MODIFICAR — placeholder → tela de check-in

src/components/admin/
├── TrainingList.tsx       # NOVO — Lista de treinos com ações
├── TrainingForm.tsx       # NOVO — Form RHF + Zod
└── TrainingStatusToggle.tsx # NOVO — Ativar/desativar

src/components/student/
├── CheckinList.tsx        # NOVO — Treinos do dia
└── CheckinButton.tsx      # NOVO — Botão de check-in + estados

src/lib/schemas/
└── trainingSchema.ts      # NOVO — Zod schema

src/hooks/
├── useAdminTrainings.ts   # NOVO — CRUD de treinos
└── useTodayTrainings.ts   # NOVO — Treinos do dia (com check-in do aluno)
```

## Dependências

- **Story 5** — Navegação admin
- **Story 6** — CRUD de alunos (padrão de forms/lista)
- Tabela `trainings` + `checkins` já existem (migrations 03 e 05)
- Constraint `unique(student_id, training_id, class_date)` já existe (migration 05)

## Stack técnica

| Aspecto | Decisão |
|---------|---------|
| Dia da semana | Select (0=Dom … 6=Sáb) |
| Horário | `<input type="time">` |
| Treinos do dia | Query filtrando `weekday = dow(today)` e `status = 'active'` |
| Check-in do aluno | Query `checkins` por `class_date = today` para saber quais já fez |
| Check-in duplicado | Tratar erro PGRST (constraint unique) + verificação client |
| Capacidade | Apenas exibida, sem bloqueio |

## Regras de negócio

- Todo aluno **ativo** pode fazer check-in em qualquer treino ativo do dia
- Capacidade máxima é informativa nesta versão (decisão do PO)
- Aluno só vê treinos do dia atual
- Check-in inicia como `pending` (precisa confirmação do admin)

## Checklist de implementação

- [X] Criar schema `trainingSchema.ts`
- [X] Criar hook `useAdminTrainings.ts` (CRUD)
- [X] Criar `TrainingList`, `TrainingForm`, `TrainingStatusToggle`
- [X] Criar páginas admin de treinos
- [X] Criar hook `useTodayTrainings.ts`
- [X] Implementar tela `/checkin` do aluno
- [X] Implementar botão de check-in com estados
- [X] Testar check-in duplicado (deve impedir — constraint unique)
- [X] Testar aluno inativo (deve impedir)
- [X] Build + lint
