# Story Draft Checklist Report

**Data:** 31/07/2026
**Stories validadas:** 3 (01, 02, 03)

---

## Story 01 - Layout de navegação do aluno (STORY-1.5)

| Critério | Status | Observação |
|----------|--------|------------|
| ID único (STORY-X.Y) | ✅ | STORY-1.5 |
| Título descritivo | ✅ | "Layout base de navegação do aluno" |
| Descrição no formato padrão | ✅ | Como aluno, quero..., para que... |
| Acceptance Criteria (8 ACs) | ✅ | Todos numerados, testáveis, específicos |
| Arquivos envolvidos | ✅ | 10 arquivos listados com NOVO/MODIFICAR |
| Dependências | ✅ | "Nenhuma" declarado |
| Stack técnica | ✅ | 5 decisões documentadas |
| Regras de negócio | ✅ | 3 regras claras |
| Checklist implementação | ✅ | 10 itens ação-a-ação |
| ACs verificáveis | ✅ | Todos testáveis |
| Casos de erro/loading | ✅ | AC7, AC8 |
| Mobile-first | ✅ | AC4, AC5, AC7 |
| Acessibilidade | ⚠️ | Touch targets ≥44px (AC4), mas sem ARIA labels explícitos |
| Schema Zod | N/A | Sem formulário |
| Tipos TypeScript | ⚠️ | Não referenciados explicitamente |
| RLS considerado | ✅ | Middleware + regras de negócio |
| Rastreabilidade PRD/Arch | ✅ | Fase 1.5 tasks.md |

**Veredito:** PASS (um concern menor: ARIA labels)

---

## Story 02 - Visualização do perfil (STORY-1.7)

| Critério | Status | Observação |
|----------|--------|------------|
| ID único (STORY-X.Y) | ✅ | STORY-1.7 |
| Título descritivo | ✅ | "Página de visualização do perfil do aluno" |
| Descrição no formato padrão | ✅ | Como aluno, quero..., para que... |
| Acceptance Criteria (12 ACs) | ✅ | Todos numerados, testáveis, específicos |
| Arquivos envolvidos | ✅ | 10 arquivos listados com NOVO |
| Dependências | ✅ | Story 1 declarada |
| Stack técnica | ✅ | 6 decisões documentadas |
| Regras de negócio | ✅ | 3 regras claras |
| Checklist implementação | ✅ | 13 itens ação-a-ação |
| ACs verificáveis | ✅ | Todos testáveis |
| Casos de erro/loading | ✅ | AC11, AC12 |
| Mobile-first | ✅ | Layout card, uma coluna |
| Acessibilidade | ⚠️ | Sem menção a ARIA, contraste, navegação teclado |
| Schema Zod | N/A | Apenas exibição |
| Tipos TypeScript | ✅ | Mapa de faixas, tipos inferidos |
| RLS considerado | ✅ | "Aluno só vê seus próprios dados" |
| Rastreabilidade PRD/Arch | ✅ | Fase 1.7 tasks.md |

**Veredito:** PASS (concerns: ARIA, contraste)

---

## Story 03 - Edição do perfil + foto (STORY-1.8)

| Critério | Status | Observação |
|----------|--------|------------|
| ID único (STORY-X.Y) | ✅ | STORY-1.8 |
| Título descritivo | ✅ | "Página de edição do perfil + upload de foto" |
| Descrição no formato padrão | ✅ | Como aluno, quero..., para que... |
| Acceptance Criteria (13 ACs) | ✅ | Todos numerados, testáveis, específicos |
| Arquivos envolvidos | ✅ | 9 arquivos listados com NOVO |
| Dependências | ✅ | Stories 1 e 2 declaradas |
| Stack técnica | ✅ | 7 decisões documentadas |
| Regras de negócio | ✅ | 5 regras claras |
| Checklist implementação | ✅ | 14 itens ação-a-ação |
| ACs verificáveis | ✅ | Todos testáveis |
| Casos de erro/loading | ✅ | AC9, AC11, AC12 |
| Mobile-first | ✅ | Upload câmera/galeria testado |
| Acessibilidade | ⚠️ | Sem ARIA labels, focus management |
| Schema Zod | ✅ | `perfilSchema.ts` completo |
| Tipos TypeScript | ✅ | `PerfilData` inferido |
| RLS considerado | ✅ | "Aluno pode atualizar próprio registro" |
| Rastreabilidade PRD/Arch | ✅ | Fase 1.8 tasks.md |

**Veredito:** PASS (concerns: ARIA, focus management)

---

## Resumo Geral

| Story | Status | Concerns (não-bloqueantes) |
|-------|--------|---------------------------|
| 01 - Layout navegação | PASS | ARIA labels nos links de navegação |
| 02 - Perfil visualização | PASS | ARIA, contraste, navegação teclado |
| 03 - Perfil edição + foto | PASS | ARIA labels, focus management no form |

---

## Ações Recomendadas (opcional, pré-implementação)

1. **Story 01:** Adicionar `aria-label` e `aria-current="page"` nos links da bottom nav
2. **Story 02:** Definir cores de badge com contraste WCAG AA, adicionar `role="img"` no avatar fallback
3. **Story 03:** Adicionar `aria-describedby` nos campos com erro, `aria-live` na mensagem de sucesso, focus trap no modal de upload (se houver)

---

## Aprovação

Todas as 3 stories estão **APROVADAS** para implementação (PASS).

Os concerns listados são melhorias de acessibilidade que podem ser endereçadas durante a implementação sem bloquear o desenvolvimento.

---

**Próximo passo sugerido:** Ativar `@dev` para implementar Story 1 (layout navegação aluno)