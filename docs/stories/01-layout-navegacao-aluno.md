# Story 1 — Layout base de navegação do aluno

**ID:** STORY-1.5  
**Fase:** 1.5 — Navegação — Área do Aluno  
**Status:** Implemented  
**Prioridade:** P0 (pré-requisito para stories de perfil, check-in, etc.)

---

## Descrição

Como **aluno**, quero um layout de navegação inferior com abas para acessar as principais funcionalidades do aplicativo, para que eu possa navegar facilmente entre as telas.

## Acceptance Criteria

- [ ] **AC1:** Criar grupo de rotas `(student)` no App Router com layout compartilhado
- [ ] **AC2:** Bottom navigation fixa com ícones + rótulos para: Início, Check-in, Frequência, Graduação, Financeiro, Mural, Perfil
- [ ] **AC3:** Aba ativa destacada visualmente (cor primária + ícone preenchido)
- [ ] **AC4:** Navegação funciona com toque em mobile (touch target ≥44px)
- [ ] **AC5:** Layout responsivo: bottom nav em mobile, sidebar em desktop (opcional)
- [ ] **AC6:** Página inicial do aluno (rota `/`) redirecionada para home do student
- [ ] **AC7:** Conteúdo de cada aba é carregado via Server Component (RSC) por padrão
- [ ] **AC8:** Loading states e Suspense boundaries em cada aba

## Arquivos envolvidos

```
src/app/(student)/
├── layout.tsx          # NOVO — Layout com bottom navigation
├── page.tsx            # NOVO — Home do aluno
├── checkin/page.tsx    # NOVO — Placeholder
├── frequencia/page.tsx # NOVO — Placeholder
├── graduacao/page.tsx  # NOVO — Placeholder
├── financeiro/page.tsx # NOVO — Placeholder
├── mural/page.tsx      # NOVO — Placeholder
└── perfil/page.tsx     # NOVO — Placeholder (conteúdo na Story 2)

src/app/page.tsx        # MODIFICAR — Redirecionar para / perfil do aluno se logado
src/middleware.ts        # REVISAR — Garantir que rotas (student) não sejam bloqueadas
```

## Dependências

- **Nenhuma** — pode ser implementada imediatamente

## Stack técnica

| Aspecto | Decisão |
|---------|---------|
| Navegação | Botton navigation nativa com `<Link>` do Next.js |
| Ícones | SVG inline ou lucide-react (a decidir) |
| Estado de aba ativa | `usePathname()` do Next.js |
| Layout | Tailwind CSS v4 com `position: fixed` no mobile |
| Grupo de rotas | Parênteses `(student)` para rota sem prefixo |

## Regras de negócio

- Alunos autenticados veem o layout do aluno
- Admins veem layout diferente (não esta story)
- Rotas protegidas pelo middleware existente (não autenticados → /login)

## Checklist de implementação

- [X] Criar diretório `src/app/(student)/`
- [X] Criar `layout.tsx` com bottom navigation fixa
- [X] Criar `page.tsx` (home do aluno)
- [X] Criar páginas placeholder para cada aba
- [X] Modificar `src/app/page.tsx` para redirecionar conforme perfil
- [X] Testar navegação em viewport mobile (375px)
- [X] Testar que todas as abas funcionam
- [X] Verificar touch targets ≥44px
- [X] Verificar que middleware não bloqueia rotas (student)
