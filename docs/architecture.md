# Arquitetura Full-Stack — Aplicativo Bushido

**Versão:** 1.0  
**Data:** 30/07/2026  
**Autor:** Aria (Architect)  
**Status:** Consolidado  
**Baseado em:** `docs/briefing.md`, `prd.md`, `tasks.md`, código-fonte

---

## 1. Visão geral da arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                        │
│                                                             │
│  Next.js 16 — App Router — React 19 — TypeScript 5         │
│  Tailwind CSS v4 — Geist Font                               │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│  │ Server   │ │ Client   │ │ Layouts  │ │ Middleware    │   │
│  │Components│ │Components│ │ (Root +  │ │ (auth guard)  │   │
│  │ (RSC)    │ │ (CSR)    │ │  Perfil) │ │              │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            Camada de Estado e Dados                   │   │
│  │  TanStack Query (server state) + Zustand (ui state)  │   │
│  │  React Hook Form + Zod (forms)                       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Clientes Supabase (server + browser)          │   │
│  │  @supabase/ssr → createServerClient / createBrowser  │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     SUPABASE                                 │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │  Auth    │  │PostgreSQL│  │ Storage  │  │ Edge Func  │  │
│  │(email/   │  │ (9 tabs) │  │(3 buck.) │  │ (futuro)   │  │
│  │  senha)  │  │  + RLS   │  │  + RLS   │  │            │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Triggers: handle_new_user (cria profile + student)   │   │
│  │  RLS: todas as tabelas protegidas por perfil          │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 1.1 Princípios arquiteturais

| Princípio | Aplicação |
|-----------|-----------|
| **Mobile-first** | Layout responsivo com prioridade 375px; touch targets ≥44px |
| **Server Components first** | RSC para páginas estáticas; Client Components apenas onde há interação |
| **Security by default** | RLS em todas as tabelas; mensagens de erro genéricas; sem secrets no client |
| **Data ownership** | Aluno vê apenas seus dados; admin vê tudo; RLS como camada única de verdade |
| **Progressive enhancement** | MVP funcional que evolui sem reescrita |
| **Cost-conscious** | Supabase free tier + Vercel Hobby para MVP |

---

## 2. Camadas da arquitetura

### 2.1 Camada de apresentação (Next.js App Router)

```
src/app/
├── (student)/                  # Grupo de rotas do aluno (futuro)
│   ├── layout.tsx              # Layout com navegação inferior
│   ├── page.tsx                # Home do aluno
│   ├── checkin/page.tsx
│   ├── frequencia/page.tsx
│   ├── graduacao/page.tsx
│   ├── financeiro/page.tsx
│   ├── mural/page.tsx
│   └── perfil/page.tsx
├── (admin)/                    # Grupo de rotas do admin (futuro)
│   ├── layout.tsx
│   ├── dashboard/page.tsx
│   ├── alunos/page.tsx
│   ├── treinos/page.tsx
│   ├── checkins/page.tsx
│   ├── graduacoes/page.tsx
│   ├── financeiro/page.tsx
│   ├── comunicacao/page.tsx
│   └── configuracoes/page.tsx
├── cadastro/                   # Público (guest)
│   └── page.tsx                # Server Component → CadastroForm (client)
├── login/                      # Público (guest)
│   └── page.tsx                # Server Component → LoginForm (client)
├── recuperar-senha/            # Público (guest)
│   └── page.tsx
├── redefinir-senha/            # Público (guest, com code)
│   └── page.tsx                # Suspense → RedefinirSenhaForm (client)
├── layout.tsx                  # Layout raiz (Providers + fontes)
└── page.tsx                    # Home (template padrão — será substituída)
```

**Regras de roteamento:**

| Padrão | Acesso | Redirecionamento |
|--------|--------|------------------|
| `/cadastro`, `/login`, `/recuperar-senha`, `/redefinir-senha` | Guest apenas | Se autenticado → `/` ou `/admin` |
| `/` (student) | Student + Admin | Se admin → `/admin` (via middleware) |
| `/admin/*` | Admin apenas | Se não autenticado → `/login`; se student → `/` |
| `/(student)/*` | Student + Admin | Middleware não bloqueia (proteção via RLS) |

### 2.2 Camada de componentes

```
src/components/
├── auth/                       # Componentes de autenticação
│   ├── CadastroForm.tsx        # Client Component (RHF + Zod)
│   ├── LoginForm.tsx           # Client Component
│   ├── RecuperarSenhaForm.tsx  # Client Component
│   └── RedefinirSenhaForm.tsx  # Client Component
├── ui/                         # Componentes base reutilizáveis (futuro)
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   └── Spinner.tsx
├── student/                    # Componentes específicos do aluno (futuro)
│   ├── ProfileCard.tsx
│   ├── CheckinList.tsx
│   └── GraduationTimeline.tsx
├── admin/                      # Componentes específicos do admin (futuro)
│   ├── StudentTable.tsx
│   ├── DashboardCard.tsx
│   └── CheckinManager.tsx
└── Providers.tsx               # TanStack Query Provider
```

**Critério de escolha Server vs Client Component:**

| É Server Component quando... | É Client Component quando... |
|------------------------------|------------------------------|
| Página estática ou semi-estática | Usa `useState`, `useEffect`, `useRouter` |
| Apenas renderiza conteúdo do banco | Usa `onSubmit`, `onClick` |
| Dados vindos de Server Action | Usa React Hook Form |
| Não precisa de interatividade | Usa `useSupabase()` hook |
| Não usa hooks de browser | Precisa de estado de UI |

### 2.3 Camada de dados e estado

```
TanStack Query (server state)
├── Queries: dados do Supabase (alunos, treinos, check-ins)
├── Mutations: create/update/delete via cliente Supabase
├── staleTime: 60s (configurado)
└── Cache: invalidação manual via queryClient.invalidateQueries

Zustand (UI state — uso restrito)
├── Apenas estados realmente globais (ex.: sidebar aberta/fechada)
├── NÃO duplicar dados que já estão no TanStack Query
└── Exemplo futuro: `useNavigationStore`, `useFilterStore`

React Hook Form + Zod (form state)
├── Estado do formulário isolado (não global)
├── Validação client-side com Zod antes do submit
└── Resolver: @hookform/resolvers/zodResolver
```

### 2.4 Camada de acesso ao Supabase

```
src/lib/supabase/
├── client.ts           # createBrowserClient (client-side)
│   └── Uso: hooks, client components, forms
├── server.ts           # createServerClient (server-side)
│   └── Uso: server components, server actions, middleware
└── types.ts            # Tipos TypeScript das tabelas
    ├── Profile, Student, Training, TrainingResponsible
    ├── CheckIn, CheckInStatus, Graduation
    ├── Payment, Publication, PublicationType
    └── Notification
```

**Padrão de acesso a dados:**

```
Server Component:
  const supabase = await createClient()   // src/lib/supabase/server.ts
  const { data } = await supabase.from('students').select('*')
  return <Component data={data} />        // dados serializados

Client Component:
  const supabase = useSupabase()          // src/hooks/useSupabase.ts
  const { data } = useQuery({             // TanStack Query
    queryKey: ['students'],
    queryFn: () => supabase.from('students').select('*')
  })
```

---

## 3. Fluxos de dados principais

### 3.1 Autenticação

```
[Browser]                    [Next.js]                    [Supabase]
    │                           │                            │
    ├── Cadastro ──────────────►│────────────────────────────►│ signUp()
    │                           │                            │ trigger: handle_new_user
    │                           │◄───────────────────────────│ profile + student criados
    │◄── redirect / ───────────│                            │
    │                           │                            │
    ├── Login ─────────────────►│────────────────────────────►│ signInWithPassword()
    │                           │◄──────── session ──────────│
    │                           ├── busca role do profile     │
    │◄── redirect / ou /admin ─│                            │
    │                           │                            │
    ├── Acessa /admin ────────►│ middleware                   │
    │                           ├── getSession()              │
    │                           ├── busca profile.role        │
    │◄── redirect /login ou / ─│                            │
```

### 3.2 Check-in (futuro — fluxo completo)

```
[Student Browser]          [Next.js]              [Supabase]
     │                        │                      │
     ├── GET /checkin ───────►│                      │
     │                        ├── query treinos do dia│
     │                        │◄── trainings ────────│
     │◄── exibe treinos ─────│                      │
     │                        │                      │
     ├── POST checkin ───────►│                      │
     │   (student_id,         ├── insert checkin      │
     │    training_id)        │   status: 'pending'   │
     │                        │◄── checkin_id ───────│
     │◄── "Aguardando conf." ─│                      │
     │                        │                      │
[Admin Browser]               │                      │
     │                        │                      │
     ├── GET /admin/checkins ►│                      │
     │                        ├── query pendentes     │
     │                        │◄── checkins ────────│
     │◄── exibe pendentes ───│                      │
     │                        │                      │
     ├── PATCH confirmar ────►│                      │
     │                        ├── update status       │
     │                        │   'confirmed'         │
     │                        │   decided_by, at      │
     │                        │◄── sucesso ─────────│
```

---

## 4. Banco de dados — Diagrama relacional

```
auth.users
    │
    ▼
profiles (id = auth.users.id)
    │
    ├── students (profile_id) ──┐
    │   ├── checkins (student_id)│
    │   ├── graduations (s_id)   │
    │   └── payments (student_id)│
    │                             │
    ├── training_responsibles     │
    │   (profile_id)              │
    │                             │
    └── publications (author_id)  │
                                  │
trainings ◄───────────────────────┘
    └── training_responsibles (training_id)
    └── checkins (training_id)

notifications (target_student_id → students.id)
```

**Políticas de RLS resumidas:**

| Tabela | Aluno | Admin |
|--------|-------|-------|
| profiles | SELECT próprio | SELECT all |
| students | SELECT próprio | CRUD |
| trainings | SELECT ativos | CRUD |
| training_responsibles | SELECT | INSERT/DELETE |
| checkins | SELECT próprio + INSERT pending | SELECT + UPDATE |
| graduations | SELECT próprio | CRUD |
| payments | SELECT próprio | CRUD |
| publications | SELECT published | CRUD |
| notifications | SELECT + UPDATE read | INSERT |

---

## 5. Segurança

### 5.1 Camadas de proteção

```
Camada 1 — Middleware Next.js
├── Verifica sessão em rotas /admin
├── Redireciona não autenticados → /login
└── Redireciona alunos → /

Camada 2 — RLS no PostgreSQL
├── Toda query passa pelas policies
├── Aluno: WHERE profile_id = auth.uid()
├── Admin: WHERE EXISTS (SELECT 1 FROM profiles WHERE role = 'admin')
└── Trigger security definer para criação de perfil

Camada 3 — Validação client-side
├── Zod schemas em todos os formulários
├── Tipos TypeScript restritos (belts, degrees, status)
└── Double-submit prevention (isSubmitting + isSubmitted)

Camada 4 — Mensagens de segurança
├── Genéricas em erro de login ("Credenciais inválidas")
├── Genéricas em recuperação de senha ("Se o e-mail estiver cadastrado...")
└── Nunca expõe se email existe ou não
```

### 5.2 Dados sensíveis

| O que | Onde | Proteção |
|-------|------|----------|
| Senha | Supabase Auth apenas | Hash bcrypt (Supabase gerencia) |
| Chave anon | .env.local + NEXT_PUBLIC_* | Exposta ao client (é publishable key) |
| Service role key | .env.local apenas | NUNCA no client |
| Dados pessoais | PostgreSQL | RLS + HTTPS |

---

## 6. Performance

### 6.1 Estratégias

| Técnica | Onde | Por que |
|---------|------|---------|
| RSC (Server Components) | Páginas estáticas | Menos JS no client, SSR nativo |
| TanStack Query cache | Dados remotos | Evita refetch desnecessário |
| staleTime: 60s | Queries | Dados da academia mudam pouco |
| Componentes Client isolados | Apenas forms interativos | Menor bundle de JS |
| Suspense | RedefinirSenhaForm | CSR bailout + loading state |

### 6.2 Otimizações futuras

- next/image para fotos (já disponível)
- Compressão de upload (client-side antes de enviar ao Storage)
- Paginação em listas grandes (alunos, check-ins)
- Infinite scroll ou paginação no mural
- Lazy loading de tabs não visíveis

---

## 7. Estrutura de diretórios — visão completa (futuro)

```
src/
├── app/                    # App Router
│   ├── (student)/          # Grupo do aluno
│   │   ├── layout.tsx      # Layout com Bottom Nav
│   │   ├── page.tsx        # Home do aluno
│   │   ├── perfil/
│   │   ├── checkin/
│   │   ├── frequencia/
│   │   ├── graduacao/
│   │   ├── financeiro/
│   │   └── mural/
│   ├── (admin)/            # Grupo do admin
│   │   ├── layout.tsx      # Layout com sidebar
│   │   ├── dashboard/
│   │   ├── alunos/
│   │   ├── treinos/
│   │   ├── checkins/
│   │   ├── graduacoes/
│   │   ├── financeiro/
│   │   ├── comunicacao/
│   │   └── configuracoes/
│   ├── cadastro/
│   ├── login/
│   ├── recuperar-senha/
│   ├── redefinir-senha/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/               # 4 forms de autenticação
│   ├── ui/                 # Button, Input, Card, Modal, Spinner
│   ├── student/            # ProfileCard, CheckinList, etc.
│   ├── admin/              # StudentTable, DashboardCard, etc.
│   ├── shared/             # Componentes usados por ambos
│   └── Providers.tsx
├── hooks/
│   ├── useSupabase.ts      # Cliente Supabase memoizado
│   ├── useStudent.ts       # (futuro) Query aluno logado
│   └── useTrainings.ts     # (futuro) Query treinos
├── lib/
│   ├── supabase/           # client, server, types
│   └── schemas/            # Zod schemas
├── styles/                 # (futuro) CSS modules se necessário
└── middleware.ts
```

---

## 8. Roadmap de implementação

### Fase atual — 1.4 Perfil do Aluno

```
src/app/perfil/
├── page.tsx              # Server Component → ProfileView (client)
└── (serão criados)

src/components/student/
├── ProfileView.tsx       # Exibição dos dados
├── ProfileEdit.tsx       # Formulário de edição
└── ProfilePhoto.tsx      # Upload com preview
```

**Dependências:** nenhuma (pode começar agora)

### Fase 2 — Operação esportiva

```
src/app/(student)/checkin/     # Check-in do aluno
src/app/(student)/frequencia/  # Histórico de presença
src/app/(admin)/checkins/      # Gestão de check-ins
src/app/(admin)/treinos/       # CRUD de treinos
```

**Dependências:** layout de navegação do aluno + admin

### Fase 3 — Graduação e dashboard

```
src/app/(student)/graduacao/   # Histórico do aluno
src/app/(admin)/graduacoes/    # Gestão admin
src/app/(admin)/dashboard/     # Indicadores
```

### Fase 4 — Comunicação e financeiro

```
src/app/(student)/financeiro/  # Situação do aluno
src/app/(student)/mural/       # Avisos e publicações
src/app/(admin)/financeiro/    # Gestão admin
src/app/(admin)/comunicacao/   # Publicações
```

---

## 9. Decisões arquiteturais registradas

| # | Decisão | Alternativa considerada | Motivo |
|---|---------|------------------------|--------|
| 1 | Supabase sobre backend próprio | Node.js + NestJS | Menor custo operacional, MVP mais rápido |
| 2 | Trigger no banco para criar profile | Server Action pós-signUp | Atomicidade garantida (tudo ou nada) |
| 3 | RLS como camada única de autorização | Middleware + API routes | Menos código, segurança no banco |
| 4 | TanStack Query sobre fetch direto | SWR, RTK Query | Cache + staleTime + mutations |
| 5 | Zod v4 sobre validação manual | Yup, Joi | Tipagem inferida, integração RHF |
| 6 | Zustand sobre Context API | Redux, Jotai | Leve, sem boilerplate |
| 7 | grupos de rotas (student)/(admin) | Rotas soltas | Clareza visual + layouts isolados |
| 8 | Mensagens de erro genéricas | Mensagens detalhadas | Segurança (LGPD, não expor dados) |

---

## 10. Riscos arquiteturais

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| RLS complexa pode ter brecha | Exposição de dados | Revisão periódica + testes |
| Trigger falha = aluno sem student | Perfil incompleto | Retry no client + fallback |
| Capacidade do Supabase free tier | Bloqueio em produção | Monitorar uso, plano upgrade |
| Sem testes automatizados | Regressão | Configurar Vitest + RTL antes da Fase 2 |
| Middleware + RLS duplicam auth checks | Overhead mínimo | Aceitável para segurança |
