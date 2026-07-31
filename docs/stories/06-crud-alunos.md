# Story 6 — CRUD de alunos (área administrativa)

**ID:** STORY-1.9  
**Fase:** 1.9–1.11 — Páginas administrativas de aluno  
**Status:** Implemented  
**Prioridade:** P0

---

## Descrição

Como **administrador**, quero listar, cadastrar, editar, inativar e excluir alunos, para que eu possa manter o cadastro da academia atualizado (incluindo faixa, grau, data de entrada e status).

## Acceptance Criteria

- [ ] **AC1:** Página `/admin/alunos` lista alunos (tabela responsiva / cards)
- [ ] **AC2:** Filtros por nome, status e faixa
- [ ] **AC3:** Ordenação e paginação simples
- [ ] **AC4:** Ações por aluno: editar, inativar/ativar, excluir
- [ ] **AC5:** Página `/admin/alunos/novo` — formulário completo (dados pessoais + faixa, grau, data de entrada, status)
- [ ] **AC6:** Página `/admin/alunos/[id]/editar` — formulário pré-preenchido
- [ ] **AC7:** Validação Zod em todos os formulários
- [ ] **AC8:** Modal de confirmação para inativação
- [ ] **AC9:** Modal de confirmação (duplo) para exclusão com aviso de perda de histórico
- [ ] **AC10:** Inativação impede novos check-ins, mantém dados e histórico
- [ ] **AC11:** Admin pode alterar faixa, grau, data de entrada e status (campos que o aluno não altera)
- [ ] **AC12:** Feedback de sucesso/erro após cada operação
- [ ] **AC13:** RLS admin autoriza todas as operações (via is_admin)

## Arquivos envolvidos

```
src/app/admin/alunos/
├── page.tsx               # NOVO — Lista com filtros (server component + client para filtros)
├── novo/page.tsx          # NOVO — Formulário de criação
└── [id]/editar/page.tsx   # NOVO — Formulário de edição

src/components/admin/
├── StudentTable.tsx       # NOVO — Lista de alunos com ações
├── StudentForm.tsx        # NOVO — Form RHF + Zod (criar/editar)
├── ConfirmModal.tsx       # NOVO — Modal de confirmação reutilizável
└── AdminStudentFilters.tsx # NOVO — Filtros (nome, status, faixa)

src/lib/schemas/
└── studentSchema.ts       # NOVO — Zod schema (todos os campos admin)

src/hooks/
└── useAdminStudents.ts    # NOVO — Queries + mutations (listar, criar, atualizar, inativar, excluir)
```

## Dependências

- **Story 5** — Navegação do admin (layout + rota /admin/alunos)
- **Migration 12** — RLS admin funcional

## Stack técnica

| Aspecto | Decisão |
|---------|---------|
| Lista | Server component + TanStack Query para ações |
| Formulário | React Hook Form + Zod resolver |
| Modal | Componente próprio (estado local) |
| Mutations | TanStack Query `useMutation` + invalidate |
| Faixas | Select com as 7 faixas (white→coral) |
| Grau | Select 0–4 |
| Status | Select ativo/inativo |

## Schema (studentSchema.ts)

```typescript
import { z } from 'zod'

export const studentSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').min(3, 'Mínimo 3 caracteres'),
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
  phone: z.string().optional().refine((v) => !v || /^\d{10,11}$/.test(v.replace(/\D/g, '')), 'Telefone inválido'),
  birth_date: z.string().optional(),
  weight: z.string().optional().refine((v) => !v || !isNaN(Number(v)), 'Peso deve ser número'),
  belt: z.enum(['white', 'blue', 'purple', 'brown', 'black', 'red', 'coral']),
  degree: z.coerce.number().min(0).max(4),
  entry_date: z.string().min(1, 'Data de entrada obrigatória'),
  status: z.enum(['active', 'inactive']),
  notes: z.string().optional(),
})
```

## Regras de negócio

- Apenas admin pode alterar faixa, grau, data de entrada e status
- Inativação: preserva todos os registros históricos, impede novo check-in
- Exclusão: só com confirmação extra; alertar sobre perda de histórico (check-ins, graduações, pagamentos em cascata)
- Email deve ser único (constraint no banco)

## Checklist de implementação

- [X] Criar schema `studentSchema.ts`
- [X] Criar hook `useAdminStudents.ts`
- [X] Criar `StudentTable`, `StudentForm`, `ConfirmModal`, filtros
- [X] Criar página de lista com filtros e paginação
- [X] Criar página de criação
- [X] Criar página de edição
- [X] Implementar inativação e exclusão com confirmação
- [X] Testar RLS (admin opera, aluno não)
- [X] Build + lint
- [ ] Observação: "Novo aluno" requer `SERVICE_ROLE_KEY` no `.env.local` (para `auth.admin.createUser`)
