# Bushido — Gestão de Academia de Jiu-Jitsu

Sistema web responsivo (mobile-first) para gestão de academias de Jiu-Jitsu, com áreas distintas para **alunos** e **administradores**: controle de alunos, treinos, check-ins, presenças, graduações, financeiro, comunicação e notificações.

**Status:** MVP operacional completo (RFs 001–015) · deploy em Vercel

---

## Stack

| Camada | Tecnologia |
|--------|------------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Linguagem | TypeScript 5 (strict) |
| Estilo | Tailwind CSS v4 (modo claro/escuro) |
| Banco | PostgreSQL (via Supabase) |
| Autenticação | Supabase Auth (email/senha + confirmação) |
| Cliente | supabase-js + @supabase/ssr |
| Formulários | React Hook Form + Zod |
| Cache/Estado | TanStack Query + Zustand |
| Datas | date-fns |
| Testes | Vitest + React Testing Library + Playwright |
| Deploy | Vercel + GitHub Actions (CI) |

## Funcionalidades

### Aluno
- Cadastro, login, recuperação e reenvio de e-mail de confirmação
- **Perfil** — visualização e edição (nome, telefone, peso, nascimento, foto)
- **Check-in** — treinos de hoje (com botão) + agenda da semana (Seg–Dom)
- **Frequência** — histórico de presenças confirmadas
- **Graduação** — faixa atual, tempo na faixa e histórico completo
- **Financeiro** — situação e histórico de pagamentos
- **Mural** — avisos, notícias, fotos e vídeos do YouTube
- **Notificações** — central com badge de não lidas (sino no app)

### Administrador
- Dashboard com indicadores por período (alunos, presenças, graduações)
- Gestão de alunos (CRUD, inativar/excluir com confirmação)
- Gestão de treinos (criar, editar, ativar/desativar)
- Validação de check-ins (confirmar/recusar com auditoria)
- Registro de graduações (preserva histórico)
- Financeiro (situação e registro de pagamentos)
- Comunicação (publicações + envio de notificações)
- Logout na sidebar

## Estrutura do projeto

```
src/
├── app/                     # App Router
│   ├── cadastro|login|recuperar-senha|redefinir-senha   # Auth
│   ├── (student)/           # Área do aluno (bottom nav 7 abas)
│   │   ├── page.tsx         # Home (próximo treino)
│   │   ├── checkin|frequencia|graduacao|financeiro|mural|notificacoes
│   │   └── perfil(+editar)
│   ├── admin/               # Área administrativa (sidebar)
│   │   ├── dashboard|alunos|treinos|checkins|graduacoes|financeiro|comunicacao
│   │   └── configuracoes
│   └── layout.tsx
├── components/
│   ├── auth/                # Forms + PasswordField + ResendConfirmation
│   ├── student/             # Perfil, check-in, frequência, graduação, mural, notificações
│   ├── admin/               # Tabelas, forms, badges, modais
│   └── ThemeToggle.tsx
├── hooks/                   # TanStack Query hooks (alunos, treinos, check-ins, ...)
├── lib/
│   ├── supabase/            # client.ts, server.ts, types.ts
│   ├── schemas/             # Schemas Zod
│   └── belt.ts | dates.ts
└── middleware.ts            # Proteção de rotas + redirect por role
supabase/
└── migrations/              # 15 migrations versionadas
tests/
└── e2e/                     # Playwright
```

## Como rodar localmente

```bash
# Instale as dependências
npm install

# Configure as variáveis de ambiente (.env.local)
NEXT_PUBLIC_SUPABASE_URL=sua_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
SERVICE_ROLE_KEY=sua_chave_service_role   # opcional, para o admin criar alunos

# Dev server
npm run dev          # http://localhost:3000
```

## Comandos

```bash
npm run dev          # Dev server
npm run build        # Production build
npm run lint         # ESLint (src/)
npm run typecheck    # tsc --noEmit
npm test             # Testes unitários/componentes (Vitest)
npm run test:watch   # Vitest watch
npm run test:e2e     # Playwright (inicia o dev server automaticamente)
```

## Testes

- **Vitest + RTL** — 99 testes: schemas Zod, utilidades (`belt.ts`, `dates.ts`) e componentes
- **Playwright E2E** — smoke + cadastro passam sem configuração; fluxos de check-in/notificações exigem credenciais via env:
  ```env
  E2E_ADMIN_EMAIL=...
  E2E_ADMIN_PASSWORD=...
  E2E_STUDENT_EMAIL=...
  E2E_STUDENT_PASSWORD=...
  ```
- **CI (GitHub Actions)** — roda lint + typecheck + test + build em todo push/PR para `main`

## Banco de dados

Migrations em `supabase/migrations/` (aplicar no SQL Editor em ordem numérica). Tabelas principais:

- **profiles** — estende `auth.users` (role: student/admin, status)
- **students** — dados do aluno (faixa, grau, data de entrada, status)
- **trainings** — treinos (modalidade, dia, horário, local, capacidade)
- **checkins** — presença (pending/confirmed/rejected, com auditoria)
- **graduations** — histórico de graduações
- **payments** — controle financeiro
- **publications** — mural
- **notifications** — central de notificações

## Segurança

- **RLS** em todas as tabelas — aluno acessa apenas os próprios dados; admin tem visão geral
- **`is_admin()`** (SECURITY DEFINER) — evita recursão e padroniza checagem de admin
- **Triggers de proteção** — bloqueiam aluno de alterar `role` (profiles) e `belt/degree/entry_date/status` (students); admin e migrations passam
- **Triggers de criação** — perfil + aluno criados atomicamente no cadastro
- **Auditoria** — check-ins (`decided_by`/`decided_at`), pagamentos (`registered_by`), publicações (`author_id`)
- Segredos (`service_role`, senhas) apenas no servidor (`.env.local` / env da Vercel), nunca no frontend

## Deploy

- **Vercel** — importar o repo GitHub, configurar env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SERVICE_ROLE_KEY`)
- **Supabase Auth** — adicionar o domínio de produção em *Redirect URLs* (confirmação de e-mail / recuperação de senha)
- Redeploy automático a cada push para `main`

## Licença

MIT
