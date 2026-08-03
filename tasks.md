# Tasks — Aplicativo Bushido

**Stack:** Next.js + React + TypeScript + Tailwind CSS + Supabase (PostgreSQL, Auth, Storage, RLS)  
**Abordagem:** Mobile-first, web responsivo, PWA futura  
**Perfis:** Aluno | Administrador | Responsável autorizado

---

## Fase 0 — Setup e infraestrutura ✅

### 0.1 Inicializar o projeto Next.js
- [X] Criar app com `create-next-app` (TypeScript, App Router, Tailwind)
- [X] Configurar ESLint + Prettier
- [X] Configurar TypeScript strict mode (`"strict": true` no tsconfig)
- [X] Configurar variáveis de ambiente (`.env.local`)

### 0.2 Configurar Supabase
- [X] Criar projeto no Supabase
- [X] Configurar Supabase Auth (email/password)
- [X] Configurar Supabase Storage (bucket para fotos e mídias)
- [X] Configurar RLS (Row Level Security) policies template

### 0.3 Configurar cliente Supabase no frontend
- [X] Instalar `@supabase/supabase-js` e `@supabase/ssr`
- [X] Criar cliente Supabase server-side e client-side
- [X] Criar hook `useSupabase` ou utilitário de sessão

### 0.4 Configurar banco de dados — migrations iniciais
- [X] Criar migration `profiles` (id, email, role, status, created_at)
- [X] Criar migration `students` (id, profile_id, name, photo, birth_date, phone, weight, entry_date, status, notes)
- [X] Criar migration `trainings` (id, modality, weekday, time, location, capacity, status)
- [X] Criar migration `training_responsibles` (id, training_id, profile_id)
- [X] Criar migration `checkins` (id, student_id, training_id, class_date, checkin_at, status, decided_by, decided_at)
- [X] Criar migration `graduations` (id, student_id, belt, degree, date, responsable_name, notes)
- [X] Criar migration `payments` (id, student_id, reference, amount, date, status, notes, registered_by)
- [X] Criar migration `publications` (id, type, title, content, media_url, author_id, published_at, status)
- [X] Criar migration `notifications` (id, target_profile, title, message, sent_at, read_at)
- [X] Criar migration `storage_buckets` (avatars, publications, uploads + RLS policies)
- [X] Criar migration `12_fix_rls_recursion` (função `is_admin()` SECURITY DEFINER — corrige erro 42P17 de recursão infinita RLS)

### 0.5 Configurar design system e tema Tailwind
- [X] Definir paleta de cores (primária, secundária, background, texto)
- [X] Configurar tipografia (fontes, tamanhos, pesos)
- [X] Configurar espaçamento e breakpoints mobile-first
- [ ] Configurar componentes base (botões, inputs, cards, modais, navegação)
- [X] Configurar dark mode (opcional)

### 0.6 Configurar bibliotecas auxiliares
- [X] Instalar e configurar TanStack Query
- [X] Instalar e configurar React Hook Form + Zod
- [X] Instalar e configurar date-fns
- [X] Configurar Zustand (apenas estados globais simples)

### 0.7 Configurar deploy e CI
- [ ] Configurar Vercel para deploy do frontend
- [X] Configurar GitHub Actions para lint + type check + testes (`.github/workflows/ci.yml` — ativa em push/PR para main)
- [ ] Criar ambientes dev, homologação e produção
- [ ] Configurar domínio próprio com HTTPS

---

## Fase 1 — Fundação (autenticação, perfis, navegação)

### 1.1 Autenticação — Cadastro de aluno ✅
- [X] Criar página `/cadastro` com formulário (nome, email, senha, confirmação, data de nascimento, telefone)
- [X] Validar formulário com Zod (email único, senha com requisitos mínimos)
- [X] Implementar `signUp` do Supabase Auth
- [X] Criar perfil do aluno na tabela `profiles` após cadastro (trigger)
- [X] Criar registro na tabela `students` vinculado ao profile (trigger)
- [X] Tratar erros (email duplicado, senha fraca, rede)
- [X] Redirecionar para tela inicial após cadastro
- [X] Reenviar e-mail de confirmação (cadastro sem sessão exibe aviso + botão reenviar)

### 1.2 Autenticação — Login ✅
- [X] Criar página `/login` com formulário (email, senha)
- [X] Implementar `signIn` do Supabase Auth
- [X] Identificar perfil (aluno/admin) e redirecionar para tela correta
- [X] Tratar erros (credenciais inválidas, conta inativa)
- [X] Adicionar link "Esqueci minha senha"
- [X] Reenviar e-mail de confirmação no login (e-mail não confirmado)

### 1.3 Autenticação — Recuperação de senha ✅
- [X] Implementar fluxo de "Esqueci minha senha" com Supabase Auth
- [X] Criar página de redefinição de senha
- [X] Notificar aluno por email

### 1.4 Autenticação — Sessão e proteção de rotas ✅
- [X] Criar middleware Next.js para verificar sessão
- [X] Redirecionar não autenticados para `/login`
- [X] Redirecionar autenticados sem perfil para página correta (sem profile → student home; sem sessão → /login; admin → /admin)
- [X] Proteger rotas administrativas (redirecionar alunos)

### 1.5 Navegação — Área do aluno ✅
- [X] Criar layout base do aluno com navegação inferior (mobile-first)
- [X] Implementar tabs: Início, Check-in, Frequência, Graduação, Financeiro, Mural, Perfil
- [X] Garantir que navegação funcione com toque e seja acessível

### 1.6 Navegação — Área do administrador ✅
- [X] Criar layout base do administrador com navegação inferior/sidebar
- [X] Implementar tabs: Dashboard, Alunos, Treinos, Check-ins, Graduações, Financeiro, Comunicação, Configurações
- [X] Garantir que áreas administrativas sejam inacessíveis para alunos

### 1.7 Página — Perfil do aluno (visualização) ✅
- [X] Exibir dados do aluno (nome, foto, faixa, grau, data de entrada, peso)
- [X] Exibir status (ativo/inativo)
- [X] Botão "Editar perfil" para campos permitidos
- [X] Botão "Sair da conta" (signOut + redirect para /login)

### 1.8 Página — Perfil do aluno (edição) ✅
- [X] Permitir que aluno edite nome, foto, data de nascimento, telefone, peso
- [X] Upload de foto com preview e compressão antes do envio
- [X] Salvar foto no Supabase Storage
- [X] Validar dados antes de salvar

### 1.9 Página — Admin: listar alunos ✅
- [X] Criar página `/admin/alunos` com tabela/card list
- [X] Buscar alunos com filtros (por nome, status, faixa)
- [X] Ordenação e paginação (ordenação por nome; paginação simples)
- [X] Ações: editar, inativar, excluir

### 1.10 Página — Admin: cadastrar/editar aluno ✅
- [X] Formulário com todos os dados do aluno (incluindo faixa, grau, data de entrada, status)
- [X] Validação com Zod
- [ ] Upload de foto no cadastro admin (pendente — foto via Storage só no perfil do aluno)
- [X] Salvamento no banco

### 1.11 Página — Admin: inativar/excluir aluno ✅
- [X] Modal de confirmação para inativação
- [X] Modal de confirmação para exclusão (com aviso sobre perda de histórico)
- [X] Inativação: impedir novos check-ins, manter dados e histórico
- [X] Exclusão: remover fisicamente (com confirmação extra)

### 1.12 Conta administrativa — seed ✅
- [X] Criar script/migration para criar primeira conta admin (migration 13)
- [X] Garantir que apenas admins possam criar novos admins (via RLS is_admin)
- [ ] Aplicar migration 13 no SQL Editor + trocar senha padrão após 1º acesso

---

## Fase 2 — Operação esportiva (treinos, check-in, presença)

### 2.1 Página — Admin: criar/editar treino ✅
- [X] Formulário: modalidade, dia da semana, horário, local, capacidade máxima, status
- [ ] Vincular responsáveis autorizados (seleção de perfis admin) — pendente (decisão de escopo)
- [X] Validação e salvamento

### 2.2 Página — Admin: listar/gerenciar treinos ✅
- [X] Lista de treinos cadastrados com status
- [X] Ações: editar, ativar/desativar
- [ ] Visualizar check-ins de cada treino — pendente (decisão de escopo)

### 2.3 Página — Aluno: visualizar treinos do dia ✅
- [X] Na aba "Check-in", exibir treinos disponíveis no dia atual
- [X] Exibir modalidade, horário, local
- [X] Indicar se o aluno já fez check-in (com status)
- [X] Agenda da semana (Seg–Dom) na aba Check-in (WeekSchedule)
- [X] Home do aluno mostra o próximo treino a partir de agora (NextTrainingCard)

### 2.4 Funcionalidade — Check-in do aluno ✅
- [X] Botão "Fazer check-in" no treino desejado
- [X] Impedir check-in duplicado (mesmo aluno + mesmo treino + mesmo dia) — via constraint unique
- [X] Impedir check-in de aluno inativo
- [X] Criar registro com status "Pendente"
- [X] Mostrar feedback visual (check-in realizado, aguardando confirmação)

### 2.5 Página — Admin: gerenciar check-ins pendentes ✅
- [X] Listar check-ins pendentes com aluno, treino, data, horário, local
- [X] Botões "Confirmar" e "Recusar" para cada check-in
- [X] Registrar quem decidiu e quando (auditoria)
- [X] Atualizar status do check-in

### 2.6 Página — Admin: histórico de check-ins ✅
- [X] Listar check-ins por data e status (filtros)
- [X] Filtros por status (confirmado, recusado, pendente)
- [X] Exibir métricas: total, confirmados, recusados, pendentes

### 2.7 Página — Aluno: acompanhar status do check-in ✅
- [X] Exibir check-ins do dia com status (pendente/confirmado/recusado)
- [X] Notificar visualmente mudanças de status (badge atualiza após confirmação)

### 2.8 Página — Aluno: histórico de presença ✅
- [X] Listar presenças confirmadas (check-ins com status "confirmado")
- [X] Filtrar por período (mês)
- [X] Exibir contagem de treinos realizados

### 2.9 Regra de negócio — Capacidade máxima ✅
- [X] Decidir: capacidade é apenas informativa no MVP (decisão do PO) — SEM bloqueio de aluno por lotação
- [X] Implementar verificação de capacidade — N/A (decisão: não bloquear)
- [ ] Exibir vagas restantes na tela do aluno — pendente (decisão de escopo)

---

## Fase 3 — Graduação e indicadores ✅

### 3.1 Página — Aluno: consultar graduação ✅
- [X] Exibir faixa e grau atuais
- [X] Exibir data da graduação atual
- [X] Exibir tempo na faixa (calculado)
- [X] Exibir histórico completo de graduações (lista cronológica)
- [ ] Informação de próxima graduação (se preenchida pelo admin) — pendente (campo não implementado)

### 3.2 Página — Admin: gerenciar graduação do aluno ✅
- [X] Formulário para registrar nova graduação (faixa, grau, data, professor, observações) em `/admin/graduacoes/nova`
- [X] Ao salvar, criar novo registro no histórico (nunca sobrescrever)
- [X] Atualizar faixa/grau atual do aluno

### 3.3 Página — Admin: histórico de graduações (geral) ✅
- [X] Lista de todas as graduações realizadas
- [X] Filtro por mês

### 3.4 Dashboard — Alunos ativos e novos ✅
- [X] No admin, criar página `/admin/dashboard`
- [X] Card: total de alunos ativos
- [X] Card: alunos novos (data de entrada dentro do período)
- [X] Lista de alunos por faixa
- [ ] Alunos por categoria (se houver) — não há categorias no MVP

### 3.5 Dashboard — Presenças e graduações ✅
- [X] Card: total de check-ins no período
- [X] Card: confirmados, recusados, pendentes
- [X] Card: graduações no período
- [ ] Gráfico de evolução (opcional) — adiado

### 3.6 Dashboard — Filtro de período ✅
- [X] Seletor de mês
- [X] Seletor de intervalo de datas
- [X] Atualizar todos os indicadores conforme período selecionado

### 3.7 Dashboard — Indicadores individuais
- [ ] No perfil do aluno (admin), exibir treinos realizados no período
- [ ] Percentual de frequência (se denominador estiver definido)
- [ ] Histórico de presença individual
- Nota: dependem de definição de denominador (decisão pendente do PRD)

---

## Fase 4 — Administração e comunicação ✅

### 4.1 Página — Admin: gerenciar situação financeira do aluno ✅
- [X] `/admin/financeiro` lista alunos com situação (em dia/atrasado/sem registro)
- [X] Exibir situação atual (badge verde/vermelho/cinza)
- [X] Lista de registros de pagamento por aluno (`/admin/financeiro/[id]`)

### 4.2 Página — Admin: registrar pagamento ✅
- [X] Formulário: competência/referência, data de pagamento, valor (opcional), status, observação
- [X] Salvamento com registro do usuário que lançou (`registered_by`)
- [X] Atualizar situação financeira do aluno (derivada do último pagamento)

### 4.3 Página — Aluno: consultar situação financeira ✅
- [X] Exibir status (em dia/atrasado/sem registro)
- [X] Exibir histórico de pagamentos
- [X] Valores e datas

### 4.4 Página — Admin: publicar aviso/comunicado ✅
- [X] Formulário: título, conteúdo, tipo (aviso, notícia, evento, foto, vídeo)
- [ ] Upload de fotos (MVP usa URL de imagem no `media_url`)
- [X] Link de vídeo do YouTube (incorporado no mural)
- [X] Publicação com status (rascunho/publicado)

### 4.5 Página — Admin: gerenciar publicações ✅
- [X] Lista de publicações com status
- [X] Ações: editar, excluir, publicar/despublicar

### 4.6 Página — Aluno: mural ✅
- [X] Lista de publicações publicadas ordenadas por data
- [X] Exibir imagens (fotos via URL)
- [X] Exibir vídeos do YouTube incorporados
- [X] Visualização de avisos e notícias

### 4.7 Funcionalidade — Notificações ✅
- [X] Criar central de notificações (`/notificacoes`)
- [X] Admin pode enviar notificação (título, mensagem, público: todos/estudantes/admins/aluno específico)
- [X] Aluno recebe e visualiza notificações
- [X] Marcar como lida
- [X] Badge de notificações não lidas (sino no layout do aluno)

### 4.8 Funcionalidade — Notificações para eventos específicos ✅
- [X] Notificar aluno quando check-in for confirmado/recusado
- [X] Notificar quando novo aviso for publicado
- [ ] Notificar sobre novo evento (coberto pela notificação de publicação — evento é um tipo de publicação)

---

## Fase 5 — Refinamento e qualidade

### 5.1 Testes — Configuração ✅
- [X] Configurar Vitest (99 testes unitários/componentes passando)
- [X] Configurar React Testing Library (jsdom + jest-dom + cleanup automático)
- [X] Configurar Playwright E2E (`playwright.config.mjs` + `tests/e2e/`; smoke + cadastro passam; check-in/notificações dependem de contas confirmadas)
- [X] Comandos: `npm test` (vitest run), `npm run test:watch`, `npm run test:e2e`, `npm run test:e2e:headed`, `npm run test:e2e:ui`

### 5.1.1 Cobertura atual (unitários)
- Schemas Zod: cadastro, login, perfil, aluno (admin), treino, graduação, pagamento, publicação, notificação
- Util `belt.ts` (labels, cores, tempo na faixa, formatação de data)
- Componentes: StatusBadge, CheckinStatusBadge, PaymentStatusBadge, PasswordField, ConfirmModal, YoutubeEmbed, GraduationTimeline

### 5.1.2 Cobertura E2E (Playwright)
- `tests/e2e/smoke.spec.ts` — login carrega (funciona sem config)
- `tests/e2e/main.spec.ts` — cadastro (mostra confirmação de e-mail) + check-in (aluno→admin→frequência) + notificações
- Fluxos de check-in/notificações exigem: `E2E_STUDENT_EMAIL` + `E2E_STUDENT_PASSWORD` (conta de aluno **confirmada** no Supabase) e `E2E_ADMIN_EMAIL`/`E2E_ADMIN_PASSWORD` (padrão do seed admin)

### 5.2 Testes — Fluxos críticos
- [ ] Testar cadastro e login
- [ ] Testar bloqueio de aluno inativo
- [ ] Testar criação de treino
- [ ] Testar realização de check-in
- [ ] Testar confirmação e recusa
- [ ] Testar contabilização de presença
- [ ] Testar alteração de graduação com preservação do histórico
- [ ] Testar restrição de acesso por perfil

### 5.3 Testes — Responsividade
- [ ] Testar telas principais em viewport móvel (375px)
- [ ] Testar telas principais em tablet (768px)
- [ ] Testar telas principais em desktop (1280px)

### 5.4 Auditoria e segurança
- [ ] Verificar RLS policies no Supabase
- [ ] Verificar proteção de rotas administrativas
- [ ] Verificar registro de ações críticas (audit log)
- [ ] Verificar proteção contra acesso direto a dados de outros alunos

### 5.5 Performance
- [ ] Otimizar imagens (next/image, compressão no upload)
- [ ] Verificar carregamento das telas principais em rede 3G
- [ ] Implementar loading states e skeletons
- [ ] Verificar bundle size

### 5.6 Acessibilidade
- [ ] Verificar contraste de cores
- [ ] Verificar navegação por teclado
- [ ] Verificar labels e aria-labels em formulários
- [ ] Verificar touch targets em mobile

### 5.7 UX e design final
- [ ] Revisar todos os estados vazios (empty states)
- [ ] Revisar mensagens de erro e feedback
- [ ] Revisar fluxos de navegação
- [ ] Revisar consistência visual (cores, tipografia, espaçamentos)
- [ ] Testar em dispositivo físico (celular Android/iPhone)

### 5.8 Deploy final
- [ ] Deploy em produção (Vercel)
- [ ] Verificar variáveis de ambiente em produção
- [ ] Verificar domínio e HTTPS
- [ ] Configurar monitoramento de erros (Sentry)
- [ ] Backup do banco de dados

---

## Critérios de aceite do MVP

- [X] RF-001: Cadastro de aluno
- [X] RF-002: Gestão administrativa de aluno
- [X] RF-003: Controle de dados esportivos
- [X] RF-004: Agenda de treinos
- [X] RF-005: Gestão de treinos
- [X] RF-006: Check-in do aluno
- [X] RF-007: Validação de check-in
- [X] RF-008: Registro de presença
- [X] RF-009: Histórico de graduação
- [X] RF-010: Dashboard por período
- [X] RF-011: Situação financeira
- [X] RF-012: Comunicação
- [X] RF-013: Notificações
- [X] RF-014: Perfis de acesso
- [X] RF-015: Auditoria de presença