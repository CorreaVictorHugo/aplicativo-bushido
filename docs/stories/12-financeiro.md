# Story 12 — Financeiro simplificado

**ID:** STORY-4.1 / 4.2 / 4.3  
**Fase:** 4 — Administração e comunicação  
**Status:** Implemented  
**Prioridade:** P1

---

## Descrição

Como **administrador**, quero registrar e consultar a situação financeira dos alunos (pagamentos, situação em dia/atrasado), e como **aluno**, quero consultar minha situação e histórico de pagamentos.

## Acceptance Criteria

- [ ] **AC1:** `/admin/financeiro` lista alunos com indicador de situação (em dia / atrasado / sem registro)
- [ ] **AC2:** Formulário para registrar pagamento (aluno, referência/competência, data, valor, status, observação)
- [ ] **AC3:** Registro guarda `registered_by` (usuário que lançou — auditoria)
- [ ] **AC4:** Histórico de pagamentos por aluno
- [ ] **AC5:** `/financeiro` (aluno) exibe situação e histórico de pagamentos
- [ ] **AC6:** Badge visual "Em dia" (verde) / "Atrasado" (vermelho) / "Sem registro" (cinza)
- [ ] **AC7:** RLS: admin CRUD; aluno vê apenas os próprios pagamentos
- [ ] **AC8:** Validação Zod

## Arquivos envolvidos

```
src/app/admin/financeiro/
├── page.tsx              # NOVO — lista de alunos com situação
└── [id]/page.tsx         # NOVO — pagamentos do aluno + form de registro

src/app/(student)/financeiro/page.tsx  # MODIFICAR — placeholder → situação + histórico

src/components/admin/
├── PaymentStatusBadge.tsx # NOVO — em dia / atrasado / sem registro
└── PaymentForm.tsx        # NOVO — registrar pagamento (RHF + Zod)

src/components/student/
└── FinanceView.tsx        # NOVO — situação + histórico do aluno

src/lib/schemas/
└── paymentSchema.ts       # NOVO — Zod schema

src/hooks/
├── useAdminPayments.ts    # NOVO — CRUD de pagamentos (admin)
└── useStudentPayments.ts  # NOVO — pagamentos do aluno logado
```

## Dependências

- **Migration 07** (tabela `payments`) e **Migration 12** (RLS admin)
- **Story 6** — CRUD de alunos (padrão de forms/lista)

## Stack técnica

| Aspecto | Decisão |
|---------|---------|
| Situação | Derivada do pagamento mais recente do aluno (paid → em dia; pending/overdue → atrasado; sem registro → sem registro) |
| Referência | Texto livre (ex.: "2026-08") |
| Valor | Opcional (decisão do PRD — confirmar com PO; MVP: opcional) |
| Auditoria | `registered_by = auth.uid()` no insert |

## Regras de negócio

- Situação do aluno = pagamento mais recente (paid/pending/overdue)
- Valor é opcional no MVP (PRD deixa em aberto)
- Aluno vê apenas os próprios pagamentos (RLS)

## Checklist de implementação

- [X] Criar schema `paymentSchema.ts`
- [X] Criar hooks `useAdminPayments` e `useStudentPayments`
- [X] Criar `PaymentStatusBadge`, `PaymentForm`, `FinanceView`
- [X] Criar páginas admin (lista + pagamentos do aluno)
- [X] Implementar `/financeiro` do aluno
- [X] Testar RLS (admin CRUD, aluno somente leitura própria)
- [X] Build + lint
