# Story 2 — Página de visualização do perfil do aluno

**ID:** STORY-1.7  
**Fase:** 1.4 — Perfil do Aluno (visualização)  
**Status:** Implemented  
**Prioridade:** P0

---

## Descrição

Como **aluno**, quero visualizar meus dados de perfil (nome, foto, faixa, grau, data de entrada, peso, status) em uma tela organizada, para que eu possa conferir minhas informações.

## Acceptance Criteria

- [ ] **AC1:** Página `/perfil` dentro do grupo `(student)` com layout do aluno (bottom nav)
- [ ] **AC2:** Exibir foto do aluno (ou avatar fallback com iniciais)
- [ ] **AC3:** Exibir nome completo
- [ ] **AC4:** Exibir faixa e grau atuais (ex.: "Faixa Azul — 2º Grau")
- [ ] **AC5:** Exibir data de entrada na academia
- [ ] **AC6:** Exibir peso (se cadastrado)
- [ ] **AC7:** Exibir status (ativo/inativo) com badge visual
- [ ] **AC8:** Exibir tempo na faixa (calculado a partir da data da graduação atual)
- [ ] **AC9:** Botão "Editar perfil" que leva à página de edição (Story 3)
- [ ] **AC10:** Dados carregados via Server Component (query direta no Supabase)
- [ ] **AC11:** Loading state com skeleton enquanto carrega
- [ ] **AC12:** Tratamento de erro caso dados não sejam encontrados

## Arquivos envolvidos

```
src/app/(student)/perfil/
├── page.tsx           # NOVO — Server Component que busca dados e renderiza
└── loading.tsx        # NOVO — Skeleton loading

src/components/student/
├── ProfileView.tsx    # NOVO — Componente de exibição do perfil
├── ProfilePhoto.tsx   # NOVO — Avatar/foto com fallback
├── ProfileInfo.tsx    # NOVO — Lista de informações (faixa, peso, etc.)
└── StatusBadge.tsx    # NOVO — Badge ativo/inativo

src/hooks/
└── useStudent.ts      # NOVO — Hook para buscar dados do aluno logado
```

## Dependências

- **Story 1** — Layout de navegação do aluno (grupo `(student)`)

## Stack técnica

| Aspecto | Decisão |
|---------|---------|
| Busca de dados | Server Component com `createClient()` do server |
| Query | `supabase.from('students').select('*, graduations(...)').eq('profile_id', userId).single()` |
| Fallback de foto | Avatar SVG com iniciais do nome (bg + cor) |
| Badge status | Badge verde "Ativo" / vermelho "Inativo" |
| Tempo na faixa | Calcular com date-fns (`differenceInMonths` / `differenceInYears`) |
| Layout | Card style, mobile-first, uma coluna |

## Dados a exibir

| Campo | Origem | Formato |
|-------|--------|---------|
| Foto | `students.photo_url` | Imagem circular ou fallback |
| Nome | `students.name` | Texto |
| Faixa | `students.belt` | Texto traduzido (white→Branca, etc.) |
| Grau | `students.degree` | "Nº Grau" |
| Data de entrada | `students.entry_date` | dd/mm/aaaa |
| Peso | `students.weight` | "XX kg" ou "—" |
| Status | `students.status` | Badge |
| Tempo na faixa | Calculado da última graduation | "X anos e Y meses" |

## Mapa de faixas (tradução)

```typescript
const beltMap: Record<string, string> = {
  white: 'Branca',
  blue: 'Azul',
  purple: 'Roxa',
  brown: 'Marrom',
  black: 'Preta',
  red: 'Vermelha',
  coral: 'Coral',
}
```

## Regras de negócio

- Apenas o próprio aluno (ou admin) pode ver o perfil
- Aluno não pode alterar faixa, grau, data de entrada ou status (admin apenas)
- Se o aluno estiver inativo, exibir badge "Inativo" e impedir check-in (já feito no RLS)

## Checklist de implementação

- [X] Criar `src/app/(student)/perfil/page.tsx` (Server Component)
- [X] Criar `src/app/(student)/perfil/loading.tsx` (skeleton)
- [X] Criar `src/components/student/ProfileView.tsx`
- [X] Criar `src/components/student/ProfilePhoto.tsx`
- [X] Criar `src/components/student/ProfileInfo.tsx`
- [X] Criar `src/components/student/StatusBadge.tsx`
- [X] Criar hook `src/hooks/useStudent.ts`
- [X] Buscar dados do servidor e renderizar
- [X] Calcular tempo na faixa com date-fns
- [X] Exibir fallback quando foto não existir
- [X] Testar em viewport mobile (375px)
- [X] Testar com aluno ativo e inativo
- [X] Verificar RLS: aluno só vê seus próprios dados
