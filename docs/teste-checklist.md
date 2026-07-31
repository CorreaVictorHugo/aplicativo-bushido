# Checklist de Teste Manual — MVP Bushido

**Data de início:** 31/07/2026
**Ambiente:** http://localhost:3000 · **Usar janela anônima** (extensões quebram os forms na janela normal)
**Credenciais:** admin → `admin@bushido.com` / `1234` · aluno → contas criadas no cadastro

---

## 1. Auth
- [ ] **Cadastro** de novo aluno → aparece "Confirme seu e-mail" + botão reenviar
- [ ] **Login aluno** → cai na home do aluno
- [ ] **Login admin** → cai no `/admin/dashboard`
- [ ] **Sair da conta** (no `/perfil`) → volta pro login

## 2. Admin — base
- [ ] **Treinos** → criar 1 treino **para hoje** e 1 para outro dia
- [ ] **Alunos** → **Novo aluno** (criar com e-mail/senha) → deve salvar
- [ ] **Alunos** → editar aluno (trocar faixa) → salvar
- [ ] **Graduações** → registrar graduação → aluno fica com a faixa nova
- [ ] **Financeiro** → registrar pagamento → badge "Em dia"
- [ ] **Comunicação** → publicar 1 aviso + 1 vídeo do YouTube → enviar 1 notificação

## 3. Fluxo principal — check-in
- [ ] **Aluno** em `/checkin` → faz check-in no treino de hoje → "Aguardando confirmação"
- [ ] **Aluno** tenta de novo → não deixa duplicar
- [ ] **Admin** em `/admin/checkins` → confirma o check-in
- [ ] **Aluno** vê "Confirmado" em `/checkin` **e** recebe notificação
- [ ] **Aluno** em `/frequencia` → vê a presença contada

## 4. Aluno — telas
- [ ] `/perfil` mostra dados + foto/avatar
- [ ] `/perfil/editar` → salvar alteração + upload de foto
- [ ] `/mural` mostra só publicações publicadas (vídeo incorporado)
- [ ] `/notificacoes` → sino com badge → clicar marca como lida
- [ ] `/financeiro` mostra situação + histórico
- [ ] `/graduacao` mostra faixa, tempo na faixa e histórico

## 5. Segurança
- [ ] Aluno acessando `/admin` → redirecionado para home
- [ ] Aluno A não vê dados do aluno B

## 6. Qualidade
- [ ] Testar em **janela anônima** (extensão quebra os forms na janela normal)
- [ ] Testar no **mobile** (largura de celular) e **desktop**

---

## Ordem recomendada
2 (Treinos) → 3 (check-in, fluxo central) → 4 → 5 → 1 por último

---

## Registro de problemas encontrados

| # | Local | O que esperava | O que aconteceu | Severidade |
|---|-------|----------------|-----------------|------------|
|   |       |                |                 |            |
|   |       |                |                 |            |

Severidade: 🔴 Bloqueante / 🟠 Alto / 🟡 Médio / 🟢 Baixo
