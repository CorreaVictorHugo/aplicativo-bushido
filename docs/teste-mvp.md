# Roteiro de Teste — MVP Bushido

**Objetivo:** validar todos os fluxos do MVP (RFs 001–015) de ponta a ponta.
**Ambiente:** `npm run dev` → http://localhost:3000 (usar **janela anônima** para evitar interferência de extensões)

---

## 0. Pré-requisitos (uma vez)

- [ ] Aplicar migration `13_seed_admin.sql` no Supabase SQL Editor
- [ ] Adicionar `SERVICE_ROLE_KEY` no `.env.local` (Supabase → Settings → API → service_role) e reiniciar `npm run dev`
- [ ] Ter 2 contas de teste (aluno A e aluno B) — já existem

Credenciais de teste:
- **Admin:** `admin@bushido.com` / `1234`
- **Aluno:** contas criadas no cadastro

---

## 1. Autenticação (Fase 1)

### 1.1 Cadastro
- [ ] `/cadastro` → criar conta com dados válidos → aparece "Conta criada! Confirme seu e-mail para entrar."
- [ ] Reenviar e-mail de confirmação funciona
- [ ] Email duplicado → erro no campo
- [ ] Senha fraca → erro no campo
- [ ] Botão "mostrar senha" (olho) funciona nos 2 campos de senha

### 1.2 Login
- [ ] `/login` → login com aluno → vai para home do aluno
- [ ] Login com admin → vai para `/admin/dashboard`
- [ ] Credenciais erradas → mensagem genérica
- [ ] E-mail não confirmado → mensagem + botão reenviar
- [ ] Botão "mostrar senha" funciona
- [ ] Link "Esqueci minha senha" → `/recuperar-senha`

### 1.3 Recuperação de senha
- [ ] `/recuperar-senha` → e-mail válido → mensagem genérica de sucesso
- [ ] Link do e-mail → `/redefinir-senha` → trocar senha → redireciona para login
- [ ] Link expirado → mensagem de erro

### 1.4 Logout
- [ ] `/perfil` → "Sair da conta" → volta para `/login`
- [ ] Depois de sair, `/` → redireciona para `/login`

---

## 2. Perfil do aluno (Fase 1.7/1.8)

- [ ] `/perfil` mostra foto/avatar, nome, faixa/grau, data de entrada, peso, status, tempo na faixa
- [ ] `/perfil/editar` → alterar nome/telefone/peso/nascimento → salvar → volta ao perfil atualizado
- [ ] Upload de foto (selecionar imagem) → salvar → foto aparece no perfil
- [ ] Foto > 5MB ou tipo inválido → erro claro

---

## 3. Navegação

- [ ] Aluno: bottom nav com 7 abas visível em todas as larguras
- [ ] Aba ativa destacada
- [ ] Admin: sidebar desktop + nav horizontal mobile
- [ ] Aluno acessando `/admin` → redirecionado para home

---

## 4. Área administrativa — Alunos (1.9–1.12)

- [ ] `/admin/alunos` lista os alunos (com e-mail e faixa)
- [ ] Filtros por nome/status/faixa funcionam
- [ ] Editar aluno → alterar faixa/grau/status → salvar
- [ ] Inativar aluno → modal confirma → status muda
- [ ] Ativar aluno → volta a ativo
- [ ] Excluir aluno → modal com aviso de perda de histórico → exclui
- [ ] `/admin/alunos/novo` → criar aluno com e-mail/senha → aparece na lista (requer SERVICE_ROLE_KEY)
- [ ] Aluno inativo não faz check-in (testar na aba Check-in)

---

## 5. Treinos + Check-in (Fase 2)

### Admin — Treinos
- [ ] `/admin/treinos/novo` → criar treino (hoje + outro dia)
- [ ] Editar treino → salvar
- [ ] Desativar/ativar treino

### Aluno — Check-in
- [ ] `/checkin` mostra os treinos ativos de hoje
- [ ] Fazer check-in → badge "Aguardando confirmação"
- [ ] Novo check-in no mesmo treino → botão não aparece de novo (já feito)
- [ ] Capacidade não bloqueia (informativa)
- [ ] Aluno inativo → mensagem "cadastro inativo"

### Admin — Check-ins
- [ ] `/admin/checkins` → aba Pendentes lista os check-ins
- [ ] Confirmar → some da lista de pendentes
- [ ] Aluno vê "Confirmado" em `/checkin` e recebe notificação
- [ ] Recusar outro → aluno vê "Recusado" + notificação

### Aluno — Frequência
- [ ] `/frequencia` lista só check-ins confirmados
- [ ] Contagem de treinos realizada
- [ ] Filtro por mês funciona

---

## 6. Graduação (Fase 3)

- [ ] `/admin/graduacoes/nova` → registrar graduação para aluno A (ex.: Branca → Azul 1º)
- [ ] Lista em `/admin/graduacoes` mostra o registro
- [ ] Perfil do aluno A mostra faixa Azul
- [ ] `/graduacao` (aluno A) mostra faixa Azul, tempo na faixa e timeline
- [ ] Registrar 2ª graduação → histórico preserva as duas (nunca sobrescreve)

---

## 7. Dashboard (Fase 3)

- [ ] `/admin/dashboard` mostra cards (alunos ativos, novos, check-ins, graduações)
- [ ] Distribuição por faixa lista
- [ ] Filtro por mês atualiza os números
- [ ] Filtro por intervalo de datas atualiza

---

## 8. Financeiro (Fase 4)

- [ ] `/admin/financeiro` lista alunos com situação
- [ ] `/admin/financeiro/[id]` → registrar pagamento (ex.: Pago, referência do mês atual)
- [ ] Situação do aluno muda para "Em dia"
- [ ] Registrar "Atrasado" para outro aluno → badge vermelho
- [ ] `/financeiro` (aluno) mostra situação + histórico

---

## 9. Mural / Comunicação (Fase 4)

- [ ] `/admin/comunicacao/nova` → criar aviso e **publicar** → aparece no mural
- [ ] Criar publicação com vídeo do YouTube → vídeo incorpora no mural
- [ ] Criar publicação com imagem (URL) → imagem aparece
- [ ] Publicar outra → notificação automática "todos"
- [ ] Despublicar → some do mural
- [ ] `/mural` (aluno) mostra só publicadas, ordenadas por data

---

## 10. Notificações (Fase 4)

- [ ] Sino no layout do aluno mostra badge de não lidas
- [ ] `/notificacoes` lista as notificações (confirmado/recusado, publicações)
- [ ] Clicar marca como lida (badge diminui)
- [ ] Admin: "Nova notificação" em Comunicação → enviar para "Todos" e para "Aluno específico"
- [ ] Aluno recebe as notificações enviadas

---

## 11. Segurança / RLS

- [ ] Aluno A acessa `/admin` → redirecionado para home
- [ ] Aluno A não vê dados do aluno B (perfil, financeiro, frequência)
- [ ] Consultas diretas via Network tab não retornam dados de outros alunos

---

## 12. Qualidade

- [ ] `npm run build` passa
- [ ] `npm test` (59 testes) passa
- [ ] `npm run lint` sem erros
- [ ] Testar em mobile (375px) e desktop

---

## Checklist de bugs (preencher se encontrar)

| # | Local | O que esperava | O que aconteceu | Severidade |
|---|-------|----------------|-----------------|------------|
|   |       |                |                 |            |
|   |       |                |                 |            |

Severidade: 🔴 Bloqueante / 🟠 Alto / 🟡 Médio / 🟢 Baixo
