# Story 9 — Página de graduação do aluno

**ID:** STORY-3.1  
**Fase:** 3 — Graduação e indicadores  
**Status:** Implemented  
**Prioridade:** P0

---

## Descrição

Como **aluno**, quero consultar minha graduação atual (faixa, grau, tempo na faixa) e o histórico completo de graduações, para que eu possa acompanhar minha evolução.

## Acceptance Criteria

- [ ] **AC1:** Página `/graduacao` dentro do grupo `(student)`
- [ ] **AC2:** Exibir faixa e grau atuais
- [ ] **AC3:** Exibir data da graduação atual
- [ ] **AC4:** Exibir tempo na faixa (calculado a partir da data da graduação atual)
- [ ] **AC5:** Exibir histórico completo de graduações (lista cronológica)
- [ ] **AC6:** Informação de próxima graduação (se preenchida pelo admin)
- [ ] **AC7:** Estado de loading (skeleton) e de erro
- [ ] **AC8:** Reutilizar dados do hook `useStudent` (já traz graduations)

## Arquivos envolvidos

```
src/app/(student)/graduacao/page.tsx   # NOVO — página com Suspense
src/components/student/
├── GraduationView.tsx    # NOVO — exibição da graduação atual + histórico
└── GraduationTimeline.tsx # NOVO — timeline do histórico
```

## Dependências

- **Story 1** — Layout de navegação do aluno
- Hook `useStudent` (já existente)

## Stack técnica

| Aspecto | Decisão |
|---------|---------|
| Dados | `useStudent` (students + graduations) |
| Tempo na faixa | date-fns (mesmo cálculo do perfil) |
| Faixa atual | `students.belt` + `students.degree` |
| Histórico | `graduations` ordenado por data |
| Próxima graduação | `students.next_belt?/next_degree?` — se não existir, oculto |

## Regras de negócio

- Graduação atual = última graduação registrada (ou `students.belt/degree`)
- O histórico não pode ser editado pelo aluno
- Se não houver graduações registradas, exibir a faixa atual com tempo desde a data de entrada

## Checklist de implementação

- [X] Criar `GraduationView` + `GraduationTimeline`
- [X] Criar página `/graduacao`
- [X] Calcular tempo na faixa (util `src/lib/belt.ts`)
- [X] Exibir histórico cronológico
- [X] Estados de loading/erro
- [X] Build + lint
