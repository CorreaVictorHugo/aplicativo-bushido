# Briefing — Aplicativo Bushido

**Versão:** 1.0  
**Data:** 30/07/2026  
**Status:** Consolidado  
**Produto:** Aplicativo de gestão para academia de Jiu-Jitsu  
**Documento derivado:** `prd.md` (PRD do produto)

---

## 1. Visão geral do produto

Plataforma web responsiva (mobile-first) para gestão de academias de Jiu-Jitsu, utilizada por alunos e administradores no mesmo aplicativo, com interfaces e permissões diferentes conforme o perfil autenticado.

O produto centraliza: cadastro e acompanhamento de alunos, agenda de treinos, check-in e confirmação de presença, frequência, graduação e histórico de faixas, indicadores administrativos em dashboard, situação financeira simplificada, e comunicação (avisos, notícias, fotos, vídeos e notificações).

### 1.1 MVP — Escopo

A versão inicial foca na operação diária da academia. Não inclui pagamento online, integração com gateways, cadastro formal de professores, cálculo automático de graduação, ou contabilidade.

---

## 2. Problema

A academia precisa organizar informações esportivas e administrativas que atualmente estão dispersas entre planilhas, mensagens, registros manuais e ferramentas separadas.

**Problemas identificados:**

1. Dificuldade para manter cadastro e situação dos alunos atualizados
2. Ausência de fluxo padronizado de check-in e confirmação de presença
3. Dificuldade para acompanhar frequência e alunos ausentes
4. Falta de histórico estruturado de graduações
5. Baixa visibilidade sobre indicadores da academia
6. Comunicação descentralizada entre academia e alunos
7. Falta de visão simples da situação financeira de cada aluno

---

## 3. Público-alvo e stakeholders

### 3.1 Usuários

| Perfil | Descrição |
|--------|-----------|
| **Aluno** | Praticante de Jiu-Jitsu que cria conta, faz check-in, consulta presença, graduação, situação financeira e recebe comunicados |
| **Administrador** | Dono/gestor da academia que gerencia alunos, treinos, check-ins, graduações, finanças e comunicados |
| **Responsável autorizado** | Perfil administrativo com permissão restrita para confirmar/recusar check-ins de treinos específicos |

### 3.2 O que cada perfil pode fazer

**Aluno:** criar conta, login, ver/editar dados permitidos, ver treinos, fazer check-in, acompanhar status, consultar presença/frequência, consultar graduação, consultar situação financeira, visualizar avisos/mural, receber notificações.

**Administrador:** dashboard, CRUD de alunos, criar/gerenciar treinos, definir responsáveis, confirmar/recusar check-ins, gerenciar graduações, registrar finanças, publicar conteúdo, enviar notificações.

---

## 4. Stack de tecnologia

| Camada | Tecnologia |
|--------|------------|
| Framework | Next.js 16.2.12 (App Router, Turbopack) |
| Linguagem | TypeScript 5.x (strict mode) |
| Estilização | Tailwind CSS v4 |
| Banco de dados | PostgreSQL (via Supabase) |
| Autenticação | Supabase Auth (email/senha) |
| Cliente Supabase | supabase-js ^2.111.0 + @supabase/ssr ^0.12.4 |
| Formulários | React Hook Form ^7.83.0 + @hookform/resolvers ^5.5.7 |
| Validação | Zod ^4.4.3 |
| Cache/Estado | TanStack Query ^5.101.4 (staleTime 60s) + Zustand ^5.0.14 |
| Datas | date-fns ^4.4.0 |
| Fontes | Geist (Geist Sans + Geist Mono) |
| Deploy | Vercel (planejado) |

---

## 5. Arquitetura do sistema

### 5.1 Modelo

Aplicação web única (Next.js) que atende alunos e administradores. Após login, menus, telas e permissões são exibidos conforme o perfil. Backend via Supabase (PostgreSQL + Auth + Storage + RLS).

```
Usuário (navegador mobile/desktop)
        │
        ▼
Next.js + React + TypeScript + Tailwind
        │
        ├── Auth ───────────── Supabase Auth (email/senha)
        ├── Dados ──────────── PostgreSQL (RLS por perfil)
        ├── Fotos ──────────── Supabase Storage (avatars, publications, uploads)
        └── Regras críticas ── Triggers + RLS no banco
```

### 5.2 Banco de dados

9 tabelas principais com RLS em todas:

| Tabela | Propósito |
|--------|-----------|
| `profiles` | Estende `auth.users` com role (student/admin) e status |
| `students` | Dados específicos do aluno (faixa, grau, data de entrada, etc.) |
| `trainings` | Treinos cadastrados (modalidade, dia, horário, local, capacidade) |
| `training_responsibles` | Vincula responsáveis autorizados a treinos |
| `checkins` | Registro de presença (status: pending/confirmed/rejected) |
| `graduations` | Histórico completo de graduações (nunca sobrescreve) |
| `payments` | Registros financeiros do aluno |
| `publications` | Mural de comunicados, avisos, fotos, vídeos |
| `notifications` | Central de notificações |

3 buckets de storage: `avatars` (público, 5MB), `publications` (público, 10MB), `uploads` (privado, 20MB).

### 5.3 Decisões de arquitetura

- **Trigger no banco** (`handle_new_user`) cria profile + student atomicamente ao cadastrar usuário
- **RLS** em todas as tabelas — aluno vê só seus dados, admin vê tudo
- **Client components** para páginas interativas (forms), server components para páginas estáticas
- **Suspense boundary** em páginas que usam `useSearchParams` (redefinição de senha)
- **Mensagens de erro genéricas** por segurança (não expõe se email existe)
- **Botão duplamente protegido** contra double-submit (`isSubmitting` + `isSubmitted`)

---

## 6. O que já foi implementado

### Fase 0 — Setup e infraestrutura ✅

- Projeto Next.js inicializado (TypeScript, App Router, Tailwind CSS v4)
- Clientes Supabase: `src/lib/supabase/client.ts` (browser), `src/lib/supabase/server.ts` (server)
- Hook `useSupabase` para acesso ao client no frontend
- Middleware de proteção de rotas (`src/middleware.ts`)
- Todas as migrations do banco criadas e versionadas (11 migrations)
- TanStack Query configurado (staleTime 60s, refetchOnWindowFocus false)
- Providers (`src/components/Providers.tsx`)
- Design system no `globals.css` (cores, tipografia, dark mode, touch targets)
- Fontes Geist configuradas
- date-fns, Zustand instalados

### Fase 1.1 — Cadastro de aluno ✅

- Página `/cadastro` com formulário (nome, email, senha, confirmação, data de nascimento, telefone)
- Validação com Zod v4 (senha: 6+ chars, 1 maiúscula, 1 número; telefone: 10-11 dígitos)
- Trigger `handle_new_user` no banco cria profile + student atomicamente
- Tratamento de erros: email duplicado, senha fraca, rede, inesperado
- Redireciona para `/` após cadastro

### Fase 1.2 — Login ✅

- Página `/login` com formulário (email, senha)
- `signInWithPassword` do Supabase Auth
- Redireciona aluno para `/`, admin para `/admin`
- Mensagens de erro específicas (email não confirmado vs credenciais inválidas)

### Fase 1.3 — Recuperação de senha ✅

- `/recuperar-senha` — formulário de solicitação (email)
- `resetPasswordForEmail` com redirectTo `/redefinir-senha`
- `/redefinir-senha` — extrai código da URL (query + hash fragment), `exchangeCodeForSession`, `updateUser`
- Mensagem genérica de sucesso ("Se o e-mail estiver cadastrado...")
- Tratamento de token expirado

### Middleware de rotas ✅

- Redireciona não autenticados para `/login` em rotas `/admin`
- Redireciona autenticados que acessam `/login` ou `/cadastro` para `/` ou `/admin`
- Verifica role admin para rotas `/admin`

### Fase 1.5 — Navegação do Aluno ✅

- Grupo de rotas `(student)` com layout compartilhado
- Bottom navigation fixa com 7 abas (Início, Check-in, Frequência, Graduação, Financeiro, Mural, Perfil)
- Aba ativa via `usePathname()`, ícones SVG inline, `aria-current="page"`
- Páginas placeholder nas abas ainda não implementadas

### Fase 1.7 — Perfil do Aluno (visualização) ✅

- Página `/perfil` com foto/avatar fallback, nome, faixa/grau, data de entrada, peso, status
- Tempo na faixa calculado da graduation mais recente (date-fns)
- Componentes: `ProfileView`, `ProfilePhoto`, `ProfileInfo`, `StatusBadge`
- Hook `useStudent` (TanStack Query) com `StudentWithGraduations`

### Fase 1.8 — Perfil do Aluno (edição) ✅

- Página `/perfil/editar` com formulário RHF + Zod
- Campos editáveis: nome, telefone, peso, data de nascimento
- Upload de foto com compressão Canvas (max 400x400, qualidade 0.8) → Storage `avatars/{userId}/avatar.{ext}`
- Upload automático no submit (fluxo único de salvar)

### Reenvio de e-mail de confirmação ✅

- Componente compartilhado `ResendConfirmation`
- Login: exibe reenvio quando e-mail não confirmado
- Cadastro: sem sessão após signUp, mostra aviso de confirmação + reenvio
- Usa `supabase.auth.resend({ type: 'signup', email })` com tratamento de rate limit

---

## 7. Próximos passos (planejado)

### Fase 2 — Operação esportiva

- Página do aluno para visualizar treinos do dia e fazer check-in
- Gestão administrativa de check-ins pendentes (confirmar/recusar)
- Histórico de presença do aluno
- Gestão de treinos (CRUD pelo admin)
- Navegação do administrador (layout com sidebar)

### Pendências conhecidas

- Navegação do admin (layout com sidebar/tabs)
- CRUD completo de alunos (admin)
- Criação e gerenciamento de treinos
- Fluxo de check-in e confirmação
- Dashboard com indicadores
- Módulo financeiro simplificado
- Mural e notificações
- Conta admin seed
- Testes automatizados

---

## 8. Estrutura do projeto

```
src/
├── app/                    # App Router
│   ├── cadastro/           # Cadastro de aluno (server component)
│   ├── login/              # Login (server component)
│   ├── recuperar-senha/    # Solicitação de reset (server component)
│   ├── redefinir-senha/    # Redefinição com Suspense (server component)
│   ├── (student)/          # Grupo de rotas do aluno (bottom nav)
│   │   ├── layout.tsx      # Bottom navigation (7 abas)
│   │   ├── page.tsx        # Home do aluno (guest → /login, admin → /admin)
│   │   ├── checkin/        # Placeholder
│   │   ├── frequencia/     # Placeholder
│   │   ├── graduacao/      # Placeholder
│   │   ├── financeiro/     # Placeholder
│   │   ├── mural/          # Placeholder
│   │   └── perfil/         # Perfil (ProfileView)
│   │       └── editar/     # Edição de perfil (ProfileEdit)
│   └── layout.tsx          # Layout raiz com Providers
├── components/
│   ├── auth/
│   │   ├── CadastroForm.tsx
│   │   ├── LoginForm.tsx
│   │   ├── RecuperarSenhaForm.tsx
│   │   ├── RedefinirSenhaForm.tsx
│   │   └── ResendConfirmation.tsx
│   ├── student/
│   │   ├── ProfileView.tsx
│   │   ├── ProfilePhoto.tsx
│   │   ├── ProfileInfo.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── ProfileEdit.tsx
│   │   └── ProfilePhotoUpload.tsx
│   └── Providers.tsx       # TanStack Query Provider
├── hooks/
│   ├── useSupabase.ts      # Hook memoizado do client
│   ├── useStudent.ts       # Query do aluno + graduations
│   └── useProfilePhoto.ts  # Upload de foto (compressão + Storage)
├── lib/
│   ├── supabase/
│   │   ├── client.ts       # createBrowserClient
│   │   ├── server.ts       # createServerClient (cookies)
│   │   └── types.ts        # Tipos TypeScript (Profile, Student, etc.)
│   └── schemas/
│       ├── cadastroSchema.ts
│       ├── loginSchema.ts
│       ├── recuperarSenhaSchema.ts
│       ├── redefinirSenhaSchema.ts
│       └── perfilSchema.ts
└── middleware.ts            # Proteção de rotas + redirect por role

supabase/
└── migrations/             # 11 migrations versionadas
```

---

## 9. Variáveis de ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=https://ruhqttnqviwdtnxjygwo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_4EctKCh8bosKszKYFlJ5KQ_9SiDddL0
```

---

## 10. Riscos e pontos de atenção

1. **Frequência sem vínculo fixo** — como todo aluno ativo pode fazer check-in em qualquer treino, não há base clara para calcular frequência/faltas
2. **Professor sem entidade própria** — nome do professor armazenado como texto, sem vínculo formal
3. **Capacidade máxima** — não definido se check-in pendente reserva vaga
4. **Exclusão de aluno** — recomenda-se priorizar inativação sobre exclusão física
5. **Conta admin** — método de criação da primeira conta administrativa ainda não definido
6. **TypeScript strict mode** — configurado no `tsconfig.json` mas sem verificação regular via CI
7. **Sem testes automatizados** — nenhum framework de testes configurado ainda
