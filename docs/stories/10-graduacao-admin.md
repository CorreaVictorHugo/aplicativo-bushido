# Story 10 — Gestão de graduações (área administrativa)

**ID:** STORY-3.2 / 3.3  
**Fase:** 3 — Graduação e indicadores  
**Status:** Implemented  
**Prioridade:** P0

---

## Descrição

Como **administrador**, quero registrar novas graduações dos alunos (faixa, grau, data, professor, observações) preservando o histórico, para que o perfil do aluno sempre reflita a graduação atual sem apagar registros anteriores.

## Acceptance Criteria

- [ ] **AC1:** `/admin/graduacoes` lista as graduações registradas
- [ ] **AC2:** Formulário para registrar nova graduação (aluno, faixa, grau, data, professor responsável, observações)
- [ ] **AC3:** Ao salvar, cria registro em `graduations` (histórico)
- [ ] **AC4:** Ao salvar, atualiza `students.belt` e `students.degree` (graduação atual)
- [ ] **AC5:** Registros anteriores nunca são sobrescritos
- [ ] **AC6:** Validação Zod no formulário
- [ ] **AC7:** Filtros por período, faixa ou aluno (básico)
- [ ] **AC8:** RLS admin autoriza (insert em graduations + update em students)
- [ ] **AC9:** Feedback de sucesso/erro

## Arquivos envolvidos

```
src/app/admin/graduacoes/
├── page.tsx            # NOVO — lista + filtros
├── nova/page.tsx       # NOVO — formulário de registro

src/components/admin/
├── GraduationForm.tsx   # NOVO — Form RHF + Zod
└── GraduationList.tsx   # NOVO — lista de graduações

src/lib/schemas/
└── graduationSchema.ts  # NOVO — Zod schema

src/hooks/
└── useAdminGraduations.ts # NOVO — listar + registrar (TanStack)
```

## Dependências

- **Migration 06** (tabela `graduations`) e **Migration 12** (RLS admin)
- **Story 6** — CRUD de alunos (padrão de forms/lista)

## Stack técnica

| Aspecto | Decisão |
|---------|---------|
| Registro | Insert em `graduations` + update em `students` (2 ops, com validação) |
| Aluno | Select de alunos (id + nome) |
| Faixa/Grau | Selects (7 faixas, grau 0–4) |
| Professor | Texto livre (sem entidade própria no MVP) |
| Lista | Ordenada por data, com nome do aluno (join) |

## Regras de negócio

- Toda alteração de faixa/grau gera um novo registro no histórico
- Registros anteriores NUNCA são apagados por uma atualização comum
- A graduação atual aparece no perfil do aluno automaticamente (via `students.belt/degree`)
- Sem cálculo automático de aptidão (decisão do PRD)

## Checklist de implementação

- [X] Criar schema `graduationSchema.ts`
- [X] Criar hook `useAdminGraduations.ts`
- [X] Criar `GraduationForm` + `GraduationList`
- [X] Criar páginas `/admin/graduacoes` e `/admin/graduacoes/nova`
- [X] Implementar insert + update atômico com tratamento de erro
- [X] Testar que histórico preserva registros anteriores
- [X] Build + lint
