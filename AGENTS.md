<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Bushido — Memória do Projeto

## Stack

- **Next.js** 16.2.12 (App Router, Turbopack)
- **React** 19.2.4
- **TypeScript** 5.x
- **Tailwind CSS** v4
- **Supabase** (PostgreSQL, Auth, Storage, RLS)
- **supabase-js** ^2.111.0 + **@supabase/ssr** ^0.12.4
- **React Hook Form** ^7.83.0 + **@hookform/resolvers** ^5.5.7
- **Zod** ^4.4.3
- **TanStack Query** ^5.101.4
- **Zustand** ^5.0.14
- **date-fns** ^4.4.0

## Estrutura do projeto

```
src/
  app/              # App Router
    cadastro/       # Página de cadastro de aluno
    login/          # Página de login
    recuperar-senha/ # Solicitação de recuperação de senha
    redefinir-senha/ # Redefinição de senha (callback)
    (student)/      # Grupo de rotas da área do aluno
      layout.tsx    # Bottom navigation com 7 abas (client component)
      page.tsx      # Home do aluno (guest → /login, admin → /admin)
      checkin/      # Treinos do dia + check-in (CheckinList)
      frequencia/   # Histórico de presenças (FrequencyHistory)
      graduacao/    # Graduação atual + histórico (GraduationView)
      financeiro/   # Situação financeira do aluno (FinanceView)
      mural/        # Publicações publicadas (MuralList + YoutubeEmbed)
      notificacoes/ # Central de notificações (NotificationCenter)
      perfil/       # Visualização do perfil (ProfileView)
      perfil/editar/ # Edição do perfil (ProfileEdit)
    admin/          # Área administrativa (sidebar)
      layout.tsx    # Sidebar desktop + nav horizontal mobile
      page.tsx      # Redirect para /admin/dashboard
      dashboard/    # Indicadores por período (DashboardCards)
      alunos/       # CRUD de alunos (lista, novo, [id]/editar, actions.ts)
      treinos/      # CRUD de treinos
      checkins/     # Pendentes + histórico
      graduacoes/   # Gestão de graduações (lista, nova)
      financeiro/   # Situação financeira dos alunos (lista, [id])
      comunicacao/  # Publicações (lista, nova, [id]/editar) + envio de notificação
      configuracoes/ # Placeholder
    layout.tsx      # Layout raiz com Providers e fontes Geist
  components/
    auth/
      CadastroForm.tsx       # Formulário de cadastro (client component)
      LoginForm.tsx          # Formulário de login (client component)
      RecuperarSenhaForm.tsx # Formulário de solicitação de reset
      RedefinirSenhaForm.tsx # Formulário de nova senha
      ResendConfirmation.tsx # Reenvio de e-mail de confirmação (compartilhado)
      PasswordField.tsx      # Campo de senha com botão mostrar/ocultar
    student/
      ProfileView.tsx        # Exibição do perfil do aluno
      ProfilePhoto.tsx       # Avatar/foto com fallback por iniciais
      ProfileInfo.tsx        # Lista de informações (faixa, peso, tempo na faixa)
      StatusBadge.tsx        # Badge ativo/inativo
      ProfileEdit.tsx        # Formulário de edição (RHF + Zod)
      ProfilePhotoUpload.tsx # Upload com preview + seleção de arquivo
      CheckinList.tsx        # Treinos do dia + botão de check-in
      FrequencyHistory.tsx   # Histórico de presenças do aluno
      GraduationView.tsx     # Graduação atual + tempo na faixa
      GraduationTimeline.tsx # Timeline do histórico de graduações
      WeekSchedule.tsx       # Agenda da semana (Seg–Dom) com check-in do aluno
      NextTrainingCard.tsx   # Próximo treino (home do aluno)
      FinanceView.tsx        # Situação + histórico de pagamentos
      MuralList.tsx          # Publicações publicadas
      YoutubeEmbed.tsx       # iframe do YouTube a partir do link
      NotificationCenter.tsx # Central de notificações
      NotificationBell.tsx   # Sino com badge de não lidas
    admin/
      StudentTable.tsx       # Lista de alunos com ações
      StudentForm.tsx        # Form RHF + Zod (criar/editar)
      AdminStudentFilters.tsx # Filtros (nome, status, faixa)
      ConfirmModal.tsx       # Modal de confirmação reutilizável
      TrainingForm.tsx       # Form de treinos
      TrainingList.tsx       # Lista de treinos com ações
      PendingCheckinList.tsx # Check-ins pendentes (confirmar/recusar)
      CheckinHistory.tsx     # Histórico com filtros e métricas
      CheckinStatusBadge.tsx # Badge pendente/confirmado/recusado
      GraduationForm.tsx     # Form de graduação (admin)
      GraduationList.tsx     # Lista de graduações (admin)
      DashboardCards.tsx     # Cards de indicadores
      PaymentStatusBadge.tsx # Em dia / atrasado / sem registro
      PaymentForm.tsx        # Registrar pagamento
      PublicationList.tsx    # Lista de publicações com ações
      PublicationForm.tsx    # Form de publicação
      NotificationForm.tsx   # Enviar notificação
    Providers.tsx            # TanStack Query provider
  hooks/
    useSupabase.ts           # Hook memoizado para criar client Supabase
    useStudent.ts            # Query TanStack do aluno logado (com graduations)
    useProfilePhoto.ts       # Upload de foto: compressão Canvas + Storage
    useAdminStudents.ts      # CRUD de alunos (admin)
    useAdminTrainings.ts     # CRUD de treinos (admin)
    useAdminCheckins.ts      # Check-ins pendentes + histórico (admin)
    useTodayTrainings.ts     # Treinos do dia + check-in do aluno
    useWeekTrainings.ts      # Agenda da semana (Seg–Dom) + check-ins do aluno
    useNextTraining.ts       # Próximo treino a partir de agora
    useStudentCheckins.ts    # Presenças confirmadas do aluno
    useAdminGraduations.ts   # Lista + registro de graduações (admin)
    useAdminDashboard.ts     # Indicadores por período (admin)
    useAdminPayments.ts      # CRUD de pagamentos (admin)
    useStudentPayments.ts    # Pagamentos do aluno logado
    useAdminPublications.ts  # CRUD de publicações (admin)
    usePublications.ts       # Publicações publicadas (aluno)
    useNotifications.ts      # Notificações do aluno (lista, unread, marcar lida)
    useAdminNotifications.ts # Enviar notificação (admin)
  lib/
    belt.ts                  # Labels/cores de faixas, tempo na faixa, datas
    supabase/
      client.ts              # createBrowserClient
      server.ts              # createServerClient (com cookies)
      types.ts               # Tipos: Profile, Student, StudentWithGraduations, etc.
    schemas/
      cadastroSchema.ts      # Zod schema para cadastro
      loginSchema.ts         # Zod schema para login
      recuperarSenhaSchema.ts # Zod schema para solicitação de reset
      redefinirSenhaSchema.ts # Zod schema para nova senha
      perfilSchema.ts        # Zod schema para edição de perfil
      studentSchema.ts       # Zod schema para aluno (admin)
      trainingSchema.ts      # Zod schema para treinos (admin)
      graduationSchema.ts    # Zod schema para graduações (admin)
      paymentSchema.ts       # Zod schema para pagamentos (admin)
      publicationSchema.ts   # Zod schema para publicações (admin)
      notificationSchema.ts  # Zod schema para notificações (admin)
  middleware.ts              # Proteção de rotas + redirect por role
supabase/
  migrations/
    01_create_profiles_table.sql
    02_create_students_table.sql
    03_create_trainings_table.sql
    04_create_training_responsibles_table.sql
    05_create_checkins_table.sql
    06_create_graduations_table.sql
    07_create_payments_table.sql
    08_create_publications_table.sql
    09_create_notifications_table.sql
    10_create_storage_buckets.sql
    11_update_auth_trigger.sql
    12_fix_rls_recursion.sql
    13_seed_admin.sql
    14_fix_checkin_insert_rls.sql
```

## Variáveis de ambiente

```
NEXT_PUBLIC_SUPABASE_URL=https://ruhqttnqviwdtnxjygwo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_4EctKCh8bosKszKYFlJ5KQ_9SiDddL0
```

## O que já foi implementado

### Fase 0 — Setup e infraestrutura (completa)

- Projeto Next.js inicializado com TypeScript, App Router e Tailwind
- Projeto Supabase criado, Auth email/senha configurado
- Clientes Supabase server-side e client-side criados
- Hook `useSupabase` para acesso ao client no frontend
- Middleware de proteção de rotas:
  - Redireciona não autenticados para `/login` em rotas `/admin`
  - Redireciona usuários autenticados para `/` ou `/admin` se tentarem acessar `/login` ou `/cadastro`
  - Verifica role admin para rotas `/admin`
- Todas as migrations de banco criadas (profiles, students, trainings, training_responsibles, checkins, graduations, payments, publications, notifications, storage_buckets)
- Migration 12: função `public.is_admin()` (SECURITY DEFINER) substitui subqueries auto-referentes em todas as políticas admin — corrige erro 42P17 (recursão infinita RLS)
- TanStack Query configurado com staleTime 60s
- Zustand instalado para estados globais
- React Hook Form + Zod instalados
- date-fns instalado
- Layout raiz com `suppressHydrationWarning` em `<html>` e `<body>` — suprime mismatch de hidratação causado por extensões de navegador que injetam atributos (ex.: `cz-shortcut-listen`)

### Fase 1.3 — Recuperação de Senha (completa)

Arquivos criados:
- `src/app/recuperar-senha/page.tsx` — página de solicitação
- `src/components/auth/RecuperarSenhaForm.tsx` — formulário client-side
- `src/lib/schemas/recuperarSenhaSchema.ts` — schema Zod (email)
- `src/app/redefinir-senha/page.tsx` — página de redefinição (callback)
- `src/components/auth/RedefinirSenhaForm.tsx` — formulário client-side
- `src/lib/schemas/redefinirSenhaSchema.ts` — schema Zod (senha + confirmação)

#### Funcionamento

1. Usuário clica em "Esqueci minha senha" → `/recuperar-senha`
2. Informa email → `supabase.auth.resetPasswordForEmail()` com redirectTo `/redefinir-senha`
3. Recebe email com link → acessa `/redefinir-senha?code=xxx`
4. Componente extrai código da URL (useSearchParams + hash fragment) e executa `exchangeCodeForSession`
5. Formulário de nova senha (password + confirmPassword, mesma validação do cadastro)
6. Submit → `supabase.auth.updateUser({ password })`
7. Sucesso → redirect para `/login` após 2s
8. Erro de token expirado → link para solicitar nova recuperação

#### Decisões de arquitetura

- Mensagem genérica no sucesso da solicitação ("Se o e-mail estiver cadastrado...") — segurança
- Código extraído tanto de query params (?code=) quanto de hash fragment (#access_token=)
- Suspense boundary necessário pois RedefinirSenhaForm usa useSearchParams
- Página /redefinir-senha estática (prerendered) mas usa Suspense para CSR bailout
- Mesmo padrão de loading, erros e validação das fases anteriores

### Fase 1.2 — Login (completa)

Arquivos criados:
- `src/app/login/page.tsx` — página com layout centralizado
- `src/components/auth/LoginForm.tsx` — formulário client-side
- `src/lib/schemas/loginSchema.ts` — schema Zod

#### Funcionamento do login

1. Usuário preenche formulário com: email, senha
2. Validação client-side com Zod (React Hook Form + zodResolver):
   - Email: formato válido, obrigatório
   - Senha: obrigatória
3. Submit chama `supabase.auth.signInWithPassword({ email, password })`
4. Middleware identifica role via `profiles.role` e redireciona:
   - Admin → `/admin`
   - Student → `/`
5. Em caso de erro:
   - Credenciais inválidas: mensagem geral ("Credenciais inválidas. Verifique seu e-mail e senha.")
   - Email não confirmado: mensagem específica ("Confirme seu e-mail antes de entrar.")
   - Falha de rede: mensagem geral
   - Erro inesperado: mensagem genérica
6. Loading: botão desabilitado com spinner SVG animado
7. Links: "Esqueci minha senha" → `/recuperar-senha`, "Cadastre-se" → `/cadastro`

#### Decisões de arquitetura

- Middleware já protege `/login` e `/cadastro`: autenticados são redirecionados
- Não expõe se email existe ou não (segurança)
- Mensagens de erro genéricas (não expõe detalhes internos)
- Botão duplamente protegido: `isSubmitting` (RHF) + `isSubmitted` (state manual)

### Fase 1.1 — Cadastro de aluno (completa)

Arquivos criados:
- `src/app/cadastro/page.tsx` — página com layout centralizado
- `src/components/auth/CadastroForm.tsx` — formulário client-side
- `src/lib/schemas/cadastroSchema.ts` — schema Zod
- `supabase/migrations/20240101000011_update_auth_trigger.sql` — migration

#### Funcionamento do cadastro

1. Usuário preenche formulário com: nome, email, senha, confirmação, data de nascimento, telefone
2. Validação client-side com Zod (React Hook Form + zodResolver):
   - Nome: mínimo 3 caracteres
   - Email: formato válido
   - Senha: mínimo 6 caracteres, 1 letra maiúscula, 1 número
   - Confirmação: deve ser igual à senha
   - Data de nascimento: deve ser uma data anterior a hoje
   - Telefone: entre 10 e 11 dígitos (permite formatação)
3. Submit chama `supabase.auth.signUp()` com `options.data` contendo `{ name, birth_date, phone }`
4. Trigger `handle_new_user` no banco (security definer) executa após insert em `auth.users`:
   - Cria registro em `profiles` (id, email, role='student', status='active')
   - Cria registro em `students` (profile_id, name, birth_date, phone) a partir de `raw_user_meta_data`
5. Em caso de erro:
   - Email duplicado: erro no campo email ("Este e-mail já está cadastrado")
   - Senha fraca: erro no campo senha
   - Falha de rede: mensagem geral
   - Erro inesperado: mensagem genérica (não expõe detalhes internos)
6. Loading: botão desabilitado com spinner SVG animado
7. Sucesso: `router.push('/')` + `router.refresh()`

#### Migration 11 — Alterações no banco

- Substitui a função `handle_new_user` para criar `profiles` + `students` atomicamente
- Lê dados de `raw_user_meta_data` (JSONB) usando operador `?` e `->>`
- Recreate trigger `on_auth_user_created` em `auth.users`
- RLS atualizado em `students`:
  - Remove política antiga "Admins can insert students"
  - Cria "Students can insert own record" (to authenticated, profile_id = auth.uid())
  - Remove política antiga "Admins can update students"
  - Cria "Students can update own record" (to authenticated, profile_id = auth.uid())
  - Recria "Admins can update students" (to authenticated, admin check)
  - Recria "Admins can insert students" (to authenticated, admin check)

#### Decisões de arquitetura

- Trigger no banco (security definer) garante atomicidade: profile + student são criados juntos ou nenhum é criado
- Não verifica email no frontend (segurança)
- Mensagens de erro genéricas (não expõem detalhes do sistema)
- Zod v4: `required_error` não é suportado como parâmetro de `z.string()`; usar `.min(1)` como fallback
- `.email()` de `z.string()` é deprecated no Zod v4 em favor de `z.email()`, mas ainda funciona
- Botão duplamente protegido: `isSubmitting` (RHF) + `isSubmitted` (state manual)

### Fase 1.5 — Navegação do Aluno (completa)

Arquivos criados:
- `src/app/(student)/layout.tsx` — layout com bottom navigation fixa (7 abas, client component)
- `src/app/(student)/page.tsx` — home do aluno
- `src/app/(student)/checkin/`, `frequencia/`, `graduacao/`, `financeiro/`, `mural/` — placeholders
- `src/app/(student)/perfil/page.tsx` — placeholder (substituído na Fase 1.7)
- `src/app/page.tsx` — removido: duplicava a rota `/` (causava loop de redirect); `/` é servido apenas por `(student)/page.tsx` (guest → /login, admin → /admin, student → home)

#### Decisões de arquitetura

- Grupo de rotas `(student)` sem prefixo na URL
- Aba ativa via `usePathname()` com `aria-current="page"`
- Ícones SVG inline (sem dependência de lib de ícones)
- Bottom nav visível em todas as larguras de tela (removido `md:hidden`) — sidebar no desktop fica para futuro
- Cada aba é Server Component por padrão

### Fase 1.7 — Perfil do Aluno — visualização (completa)

Arquivos criados:
- `src/app/(student)/perfil/page.tsx` — página com Suspense + ProfileView
- `src/app/(student)/perfil/loading.tsx` — skeleton loading
- `src/components/student/ProfileView.tsx` — client component com estados loading/erro/sucesso
- `src/components/student/ProfilePhoto.tsx` — foto ou avatar fallback com iniciais
- `src/components/student/ProfileInfo.tsx` — lista de informações (faixa, grau, data de entrada, tempo na faixa, peso, telefone, nascimento)
- `src/components/student/StatusBadge.tsx` — badge ativo (verde) / inativo (vermelho)
- `src/hooks/useStudent.ts` — TanStack Query que busca aluno + graduations
- `src/lib/supabase/types.ts` — adicionado tipo `StudentWithGraduations`
- Botão "Sair da conta" — `supabase.auth.signOut()` + redirect para `/login` (necessário para testar o login novamente)

#### Decisões de arquitetura

- Tempo na faixa calculado da graduation mais recente com date-fns
- Mapa de faixas traduzido (white→Branca, blue→Azul, etc.)
- Avatar fallback: iniciais + cor derivada do nome (hash)
- Query: `students` + `graduations(...)` via `.single()` filtrado por `profile_id`

### Fase 1.8 — Perfil do Aluno — edição (completa)

Arquivos criados:
- `src/app/(student)/perfil/editar/page.tsx` — página com Suspense + ProfileEdit
- `src/components/student/ProfileEdit.tsx` — formulário RHF + Zod (carrega dados com useEffect)
- `src/components/student/ProfilePhotoUpload.tsx` — seleção de arquivo + preview
- `src/hooks/useProfilePhoto.ts` — compressão Canvas (max 400x400, qualidade 0.8) + upload Storage
- `src/lib/schemas/perfilSchema.ts` — Zod schema (nome, telefone, peso, data de nascimento)

#### Funcionamento

1. Página `/perfil/editar` carrega dados atuais do aluno via `useEffect`
2. Usuário edita campos permitidos: nome, telefone, peso, data de nascimento
3. Opcional: seleciona foto → preview com `URL.createObjectURL`
4. Submit → se há foto nova, `uploadPhoto` comprime e envia ao Storage (`avatars/{userId}/avatar.{ext}`)
5. `students` é atualizado com os campos + `photo_url` (se foto nova)
6. Redireciona para `/perfil`

#### Decisões de arquitetura

- Upload de foto **automático no submit** (fluxo único de salvar, não botão separado)
- Campos controlados pelo admin (faixa, grau, data de entrada, status) exibidos como somente leitura
- Validação: arquivo ≤5MB, tipos jpeg/png/webp/gif, upsert no Storage
- Compressão client-side obrigatória antes do upload

### Reenvio de e-mail de confirmação (completa)

Arquivos criados:
- `src/components/auth/ResendConfirmation.tsx` — componente compartilhado (botão + estados)

Arquivos modificados:
- `src/components/auth/LoginForm.tsx` — exibe reenvio quando erro "email not confirmed"
- `src/components/auth/CadastroForm.tsx` — sem sessão após signUp, mostra aviso de confirmação + reenvio

#### Funcionamento

1. No login, erro de e-mail não confirmado → mensagem + botão "Reenviar e-mail de confirmação"
2. No cadastro, se `authData.session` é null (confirmação obrigatória) → não redireciona; mostra "Conta criada! Confirme seu e-mail para entrar." + botão reenviar
3. Reenvio chama `supabase.auth.resend({ type: 'signup', email, options: { emailRedirectTo } })`
4. Trata rate limit (429 / "rate limit") com mensagem específica

#### Decisões de arquitetura

- Componente compartilhado evita duplicação login/cadastro
- Mesmo padrão de spinner e mensagens dos demais forms
- `emailRedirectTo` = `window.location.origin` para retorno consistente

### Fase 1.6 — Navegação do Administrador (completa)

Arquivos criados:
- `src/app/admin/layout.tsx` — sidebar no desktop (8 seções) + nav horizontal no mobile
- `src/app/admin/page.tsx` — redirect para `/admin/dashboard`
- Placeholders: dashboard, alunos, treinos, checkins, graduacoes, financeiro, comunicacao, configuracoes

#### Decisões de arquitetura

- Mesmo padrão do aluno: client component + `usePathname()` + `aria-current`
- Sidebar `fixed` com `md:flex`; mobile usa nav horizontal scrollável no topo
- Middleware já protege `/admin` (role admin); aluno redirecionado para `/`

### Fase 1.9–1.11 — CRUD de Alunos (admin) (completa)

Arquivos criados:
- `src/app/admin/alunos/page.tsx` — lista com filtros (nome/status/faixa) + inativar/excluir
- `src/app/admin/alunos/novo/page.tsx` + `[id]/editar/page.tsx` — formulários
- `src/app/admin/alunos/actions.ts` — server action `createStudent` (usa `auth.admin.createUser` + `SERVICE_ROLE_KEY`)
- `src/components/admin/StudentTable.tsx`, `StudentForm.tsx`, `AdminStudentFilters.tsx`, `ConfirmModal.tsx`
- `src/hooks/useAdminStudents.ts` — listar/atualizar/excluir (TanStack Query)
- `src/lib/schemas/studentSchema.ts` — Zod (todos os campos, incl. faixa/grau/status)

#### Decisões de arquitetura

- RLS admin via `is_admin()` permite todas as operações
- "Novo aluno" cria conta via `auth.admin.createUser` (service role, server-side) — requer `SERVICE_ROLE_KEY` no `.env.local`
- Exclusão usa modal de confirmação com aviso de perda de histórico (FK cascade)
- Grau tratado como string no form (evita conflito coerce Zod) e convertido no submit

### Fase 1.12 — Conta administrativa (migration 13)

- `supabase/migrations/20240101000013_seed_admin.sql` — cria `admin@bushido.com` / `1234` (senha de TESTE)
- Insere direto em `auth.users` com `extensions.crypt` + `email_confirmed_at`; trigger cria profile; update role='admin'
- **Pendente:** trocar a senha `1234` após o primeiro acesso
- `SERVICE_ROLE_KEY` é usada na server action `createStudent` (backend); o Supabase bloqueia `sb_secret_...` em contexto de navegador (User-Agent) — o teste HTTP deve usar UA de backend

### Fase 2 — Operação esportiva: treinos, check-in, frequência (completa)

Arquivos criados:
- `src/app/admin/treinos/page.tsx`, `novo/`, `[id]/editar/` — CRUD de treinos
- `src/app/admin/checkins/page.tsx` — pendentes (confirmar/recusar) + histórico com métricas
- `src/app/(student)/checkin/page.tsx` — treinos de hoje (com botão) + agenda da semana (WeekSchedule)
- `src/app/(student)/frequencia/page.tsx` — presenças confirmadas com filtro por mês
- `src/app/(student)/page.tsx` — home com card "Próximo treino" (NextTrainingCard)
- `src/components/admin/TrainingForm.tsx`, `TrainingList.tsx`, `PendingCheckinList.tsx`, `CheckinHistory.tsx`, `CheckinStatusBadge.tsx`
- `src/components/student/CheckinList.tsx`, `FrequencyHistory.tsx`, `WeekSchedule.tsx`, `NextTrainingCard.tsx`
- `src/hooks/useAdminTrainings.ts`, `useAdminCheckins.ts`, `useTodayTrainings.ts`, `useStudentCheckins.ts`, `useWeekTrainings.ts`, `useNextTraining.ts`
- `src/lib/schemas/trainingSchema.ts`

#### Funcionamento

1. Admin cria treino (modalidade, dia da semana, horário, local, capacidade, status)
2. Aluno em `/checkin` vê os treinos ativos do dia e faz check-in (status `pending`); abaixo, a agenda da semana (Seg–Dom) mostra todos os treinos + status
3. Home do aluno mostra o **próximo treino** a partir de agora (com badge "Hoje" se for hoje)
4. Check-in duplicado é impedido pela constraint `unique(student_id, training_id, class_date)`
5. Aluno inativo não faz check-in (verificado no client + RLS)
6. Admin em `/admin/checkins` confirma/recusa; grava `decided_by` + `decided_at` (auditoria, exigida pela RLS)
7. Só check-ins confirmados aparecem em `/frequencia` (contagem + filtro por mês)

#### Decisões de arquitetura

- **Capacidade é informativa** no MVP (decisão do PO) — SEM bloqueio de aluno por lotação
- Confirmação/recusa é irreversível no MVP (reverter fica para depois)
- Métricas do histórico calculadas client-side sobre a query filtrada
- `useTodayTrainings` retorna treinos + check-in do aluno no mesmo payload
- `useWeekTrainings` retorna a semana (Seg–Dom) com treinos + check-ins do aluno
- `useNextTraining` calcula a próxima ocorrência semanal (weekday+time) a partir de agora
- **Mobile-first:** bottom nav com 7 abas sempre visíveis (flex-1 + truncate + safe-area), sem overflow
- Migration 14: política RLS de insert de check-in tolera ±1 dia de `current_date` (fuso horário) — antes `class_date = current_date` (UTC) bloqueava o insert

### Fase 3 — Graduação e dashboard (completa)

Arquivos criados:
- `src/app/(student)/graduacao/page.tsx` — graduação atual + histórico (GraduationView + GraduationTimeline)
- `src/app/admin/graduacoes/page.tsx` + `nova/page.tsx` — gestão de graduações (GraduationForm + GraduationList)
- `src/app/admin/dashboard/page.tsx` — indicadores por período (DashboardCards)
- `src/lib/belt.ts` — util compartilhada (labels, cores, tempo na faixa, formatação de data)
- `src/lib/schemas/graduationSchema.ts`, `src/hooks/useAdminGraduations.ts`, `src/hooks/useAdminDashboard.ts`
- `src/components/auth/PasswordField.tsx` — campo de senha com botão mostrar/ocultar (usado no cadastro e redefinição)

#### Funcionamento

1. Admin registra graduação → insere em `graduations` + atualiza `students.belt/degree` (histórico preservado)
2. Aluno vê em `/graduacao` a faixa atual, tempo na faixa e timeline completa
3. Dashboard consulta alunos ativos, alunos novos, check-ins e graduações filtrados por mês ou intervalo

#### Decisões de arquitetura

- Util `belt.ts` centraliza labels/cores/cálculos (evita duplicação com o perfil)
- Registro de graduação = 2 operações (insert + update) com tratamento de erro
- Dashboard sem lib de gráficos no MVP (cards + listas); frequência/faltas não exibidas (denominador indefinido)
- `PasswordField` padroniza o campo de senha (ícone olho) no cadastro e na redefinição; login mantém implementação inline

### Fase 4 — Administração e comunicação (completa)

Arquivos criados:
- `src/app/admin/financeiro/page.tsx` + `[id]/page.tsx` — situação financeira dos alunos + histórico + registrar pagamento
- `src/app/admin/comunicacao/page.tsx`, `nova/`, `[id]/editar/` — gestão de publicações + envio de notificação
- `src/app/(student)/financeiro/page.tsx` — situação + histórico do aluno (FinanceView)
- `src/app/(student)/mural/page.tsx` — mural (MuralList + YoutubeEmbed)
- `src/app/(student)/notificacoes/page.tsx` — central de notificações (NotificationCenter)
- `src/components/admin/PaymentStatusBadge.tsx`, `PaymentForm.tsx`, `PublicationList.tsx`, `PublicationForm.tsx`, `NotificationForm.tsx`
- `src/components/student/FinanceView.tsx`, `MuralList.tsx`, `YoutubeEmbed.tsx`, `NotificationCenter.tsx`, `NotificationBell.tsx`
- `src/hooks/useAdminPayments.ts`, `useStudentPayments.ts`, `useAdminPublications.ts`, `usePublications.ts`, `useNotifications.ts`, `useAdminNotifications.ts`
- `src/lib/schemas/paymentSchema.ts`, `publicationSchema.ts`, `notificationSchema.ts`

#### Decisões de arquitetura

- Situação financeira derivada do pagamento mais recente (paid → em dia; pending → pendente; overdue → atrasado; nenhum → sem registro)
- Valor do pagamento é opcional no MVP (PRD deixa em aberto)
- Mídia do mural usa URL (imagem ou link do YouTube); vídeo extrai o ID e incorpora com iframe
- Notificações automáticas: check-in confirmado/recusado → específica do aluno; publicação publicada → todos (inseridas no client após a ação)
- Sino com badge de não lidas no layout do aluno (link para `/notificacoes`)
- `useWatch` em vez de `watch` do RHF (evita warning do React Compiler)

## Próximos passos (pós-MVP)

- **MVP operacional completo** — RFs 001–015 implementados (conferir tasks.md)
- E2E Playwright (exige ambiente com Supabase + credenciais)
- Deploy (Vercel) e CI (GitHub Actions lint + typecheck + testes)
- Revisão de segurança/RLS e limpeza de arquivos soltos no repo
- Padronizar login para usar `PasswordField` (hoje inline)
- Upload de fotos no mural via Storage (hoje URL)

## Comandos úteis

```bash
npm run dev        # Dev server (http://localhost:3000)
npm run build      # Production build
npm run lint       # ESLint
npm run typecheck  # TypeScript check (tsc --noEmit)
npm test           # Testes unitários/componentes (Vitest + RTL)
npm run test:watch # Testes em modo watch
```

**Quality gates:** rodar `npm run lint`, `npm run typecheck` e `npm test` antes de concluir. CI (GitHub Actions) executa lint + typecheck + test + build em todo push/PR para `main` (`.github/workflows/ci.yml`).

## Testes

- **Vitest + React Testing Library** configurados (`vitest.config.mts` + `src/test/setup.ts`)
- 99 testes unitários/componentes: schemas Zod, util `belt.ts`/`timeInBelt`, `StatusBadge`, `CheckinStatusBadge`, `PaymentStatusBadge`, `PasswordField`, `ConfirmModal`, `YoutubeEmbed`, `GraduationTimeline`
- **Playwright E2E** configurado (`playwright.config.mjs` + `tests/e2e/`): smoke + cadastro passam; check-in/notificações exigem conta de aluno confirmada via env `E2E_STUDENT_EMAIL`/`E2E_STUDENT_PASSWORD` (admin padrão `admin@bushido.com`/`1234` ou `E2E_ADMIN_*`)
- Rodar: `npm test` (unit), `npm run test:e2e` (E2E — inicia `npm run dev` automaticamente); `test:e2e:headed`/`test:e2e:ui` para debug

---

<!-- AIOX-MANAGED SECTIONS -->
<!-- These sections are managed by AIOX. Edit content between markers carefully. -->
<!-- Your custom content above will be preserved during updates. -->

<!-- AIOX-MANAGED-START: core -->
## Core Rules

1. Siga a Constitution em `.aiox-core/constitution.md`
2. Priorize `CLI First -> Observability Second -> UI Third`
3. Trabalhe por stories em `docs/stories/`
4. Nao invente requisitos fora dos artefatos existentes
<!-- AIOX-MANAGED-END: core -->

<!-- AIOX-MANAGED-START: quality -->
## Quality Gates

- Rode `npm run lint`
- Rode `npm run typecheck`
- Rode `npm test`
- Atualize checklist e file list da story antes de concluir
<!-- AIOX-MANAGED-END: quality -->

<!-- AIOX-MANAGED-START: codebase -->
## Project Map

- Core framework: `.aiox-core/`
- CLI entrypoints: `bin/`
- Shared packages: `packages/`
- Tests: `tests/`
- Docs: `docs/`
<!-- AIOX-MANAGED-END: codebase -->

<!-- AIOX-MANAGED-START: commands -->
## Common Commands

- `npm run sync:ide`
- `npm run sync:ide:check`
- `npm run sync:skills:codex`
- `npm run sync:skills:codex:global` (opcional; neste repo o padrao e local-first)
- `npm run validate:structure`
- `npm run validate:agents`
<!-- AIOX-MANAGED-END: commands -->

<!-- AIOX-MANAGED-START: shortcuts -->
## Agent Shortcuts

Preferencia de ativacao no Codex CLI:
1. Use `/skills` e selecione `aiox-<agent-id>` vindo de `.codex/skills` (ex.: `aiox-architect`)
2. Se preferir, use os atalhos abaixo (`@architect`, `/architect`, etc.)

Interprete os atalhos abaixo carregando o arquivo correspondente em `.aiox-core/development/agents/` (fallback: `.codex/agents/`), renderize o greeting via `generate-greeting.js` e assuma a persona ate `*exit`:

- `@architect`, `/architect`, `/architect.md` -> `.aiox-core/development/agents/architect.md`
- `@dev`, `/dev`, `/dev.md` -> `.aiox-core/development/agents/dev.md`
- `@qa`, `/qa`, `/qa.md` -> `.aiox-core/development/agents/qa.md`
- `@pm`, `/pm`, `/pm.md` -> `.aiox-core/development/agents/pm.md`
- `@po`, `/po`, `/po.md` -> `.aiox-core/development/agents/po.md`
- `@sm`, `/sm`, `/sm.md` -> `.aiox-core/development/agents/sm.md`
- `@analyst`, `/analyst`, `/analyst.md` -> `.aiox-core/development/agents/analyst.md`
- `@devops`, `/devops`, `/devops.md` -> `.aiox-core/development/agents/devops.md`
- `@data-engineer`, `/data-engineer`, `/data-engineer.md` -> `.aiox-core/development/agents/data-engineer.md`
- `@ux-design-expert`, `/ux-design-expert`, `/ux-design-expert.md` -> `.aiox-core/development/agents/ux-design-expert.md`
- `@squad-creator`, `/squad-creator`, `/squad-creator.md` -> `.aiox-core/development/agents/squad-creator.md`
- `@aiox-master`, `/aiox-master`, `/aiox-master.md` -> `.aiox-core/development/agents/aiox-master.md`
<!-- AIOX-MANAGED-END: shortcuts -->
