# Story 14 — Notificações

**ID:** STORY-4.7 / 4.8  
**Fase:** 4 — Administração e comunicação  
**Status:** Implemented  
**Prioridade:** P1

---

## Descrição

Como **administrador**, quero enviar notificações para os alunos, e como **aluno**, quero receber, visualizar e marcar notificações como lidas, incluindo avisos automáticos de check-in confirmado/recusado e novas publicações.

## Acceptance Criteria

- [ ] **AC1:** Central de notificações para o aluno (página `/notificacoes`)
- [ ] **AC2:** Badge de notificações não lidas (sino no layout do aluno)
- [ ] **AC3:** Marcar notificação como lida ao visualizar
- [ ] **AC4:** Admin pode enviar notificação (título, mensagem, público: todos/estudantes/admin)
- [ ] **AC5:** Notificação automática quando check-in é confirmado ou recusado (para o aluno específico)
- [ ] **AC6:** Notificação automática quando publicação é publicada (para todos)
- [ ] **AC7:** RLS: aluno vê suas notificações e marca como lida; admin insere/consulta todas
- [ ] **AC8:** Ordenação por data (mais recente primeiro)

## Arquivos envolvidos

```
src/app/(student)/notificacoes/page.tsx   # NOVO — central de notificações
src/app/(student)/layout.tsx               # MODIFICAR — sino com badge de não lidas

src/app/admin/comunicacao/page.tsx        # MODIFICAR — botão "Nova notificação"

src/components/student/
├── NotificationCenter.tsx # NOVO — lista + marcar lida
└── NotificationBell.tsx   # NOVO — sino com badge (usa useNotifications)

src/components/admin/
└── NotificationForm.tsx   # NOVO — enviar notificação (RHF + Zod)

src/lib/schemas/
└── notificationSchema.ts  # NOVO — Zod schema

src/hooks/
├── useNotifications.ts    # NOVO — notificações do aluno (lista, unread, marcar lida)
└── useAdminNotifications.ts # NOVO — enviar notificação (admin)
```

## Dependências

- **Migration 09** (tabela `notifications`) e **Migration 12** (RLS admin)
- **Story 8** (check-ins) e **Story 13** (mural) — para notificações automáticas

## Stack técnica

| Aspecto | Decisão |
|---------|---------|
| Público | `target_profile`: all / students / admins / specific |
| Aluno específico | `target_student_id` (check-in confirmado/recusado) |
| Não lida | `read_at IS NULL` |
| Notificação automática | Insert no client após confirmar/recusar check-in e após publicar (MVP) |
| Badge | Contagem de não lidas no sino (query dedicada) |

## Regras de negócio

- Aluno vê: `target_profile in ('all','students')` OU específica para ele
- Apenas admin envia notificações (RLS insert)
- Marcar lida: `update read_at = now()` (RLS permite para destinatário)

## Checklist de implementação

- [X] Criar schema `notificationSchema.ts`
- [X] Criar hooks `useNotifications` e `useAdminNotifications`
- [X] Criar `NotificationCenter`, `NotificationBell`, `NotificationForm`
- [X] Criar `/notificacoes` e sino no layout
- [X] Notificação automática de check-in (confirmar/recusar)
- [X] Notificação automática de nova publicação
- [X] Marcar como lida
- [X] Build + lint
