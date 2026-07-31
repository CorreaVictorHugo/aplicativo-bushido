# Story 5 — Navegação da área do administrador

**ID:** STORY-1.6  
**Fase:** 1.6 — Navegação — Área do Administrador  
**Status:** Implemented  
**Prioridade:** P0 (base para todas as telas admin)

---

## Descrição

Como **administrador**, quero uma navegação lateral (sidebar) com as seções da área administrativa, para que eu possa acessar Dashboard, Alunos, Treinos, Check-ins, Graduações, Financeiro, Comunicação e Configurações.

## Acceptance Criteria

- [ ] **AC1:** Criar `src/app/admin/layout.tsx` com sidebar de navegação
- [ ] **AC2:** Seções: Dashboard, Alunos, Treinos, Check-ins, Graduações, Financeiro, Comunicação, Configurações
- [ ] **AC3:** Seção ativa destacada via `usePathname()` + `aria-current`
- [ ] **AC4:** Sidebar visível em desktop; em mobile, menu compacto (ícones) ou drawer
- [ ] **AC5:** `src/app/admin/page.tsx` redireciona para `/admin/dashboard`
- [ ] **AC6:** Páginas placeholder criadas para todas as seções
- [ ] **AC7:** Middleware existente já protege `/admin` (apenas role admin acessa)
- [ ] **AC8:** Acessível por teclado (foco visível, navegação sem mouse)

## Arquivos envolvidos

```
src/app/admin/
├── layout.tsx               # NOVO — Sidebar (client component)
├── page.tsx                 # NOVO — redirect para /admin/dashboard
├── dashboard/page.tsx       # NOVO — Placeholder
├── alunos/page.tsx          # NOVO — Placeholder (vira CRUD na Story 6)
├── treinos/page.tsx         # NOVO — Placeholder (vira CRUD na Story 7)
├── checkins/page.tsx        # NOVO — Placeholder (vira gestão na Story 8)
├── graduacoes/page.tsx      # NOVO — Placeholder
├── financeiro/page.tsx      # NOVO — Placeholder
├── comunicacao/page.tsx     # NOVO — Placeholder
└── configuracoes/page.tsx   # NOVO — Placeholder
```

## Dependências

- **Story 4** (seed admin) — para poder testar a área
- Middleware já protege `/admin`

## Stack técnica

| Aspecto | Decisão |
|---------|---------|
| Layout | Client component com `usePathname()` |
| Navegação | `<Link>` do Next.js (sem reload) |
| Ícones | SVG inline (mesmo padrão da bottom nav do aluno) |
| Responsivo | Sidebar fixa no desktop; menu compacto no mobile |

## Regras de negócio

- Apenas usuários com `role='admin'` acessam `/admin` (middleware)
- Alunos redirecionados para `/` (já implementado no middleware)

## Checklist de implementação

- [X] Criar `src/app/admin/layout.tsx` com sidebar
- [X] Criar `src/app/admin/page.tsx` com redirect
- [X] Criar páginas placeholder para as 8 seções
- [ ] Testar navegação entre seções (admin logado) — pendente (aguarda seed admin)
- [X] Testar que aluno acessando /admin é redirecionado
- [X] Testar acessibilidade por teclado
- [X] Build + lint
