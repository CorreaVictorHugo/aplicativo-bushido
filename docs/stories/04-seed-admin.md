# Story 4 — Seed da conta administrativa

**ID:** STORY-1.12  
**Fase:** 1.12 — Conta administrativa — seed  
**Status:** Implemented (migration criada; aguardando aplicação no SQL Editor)  
**Prioridade:** P0 (pré-requisito para testar toda a área admin)

---

## Descrição

Como **administrador**, quero uma conta administrativa inicial criada, para que eu possa acessar a área administrativa e testar as funcionalidades.

## Acceptance Criteria

- [ ] **AC1:** Migration `13_seed_admin.sql` cria a conta admin padrão de teste
- [ ] **AC2:** Conta criada com email `admin@bushido.com` e senha `1234`
- [ ] **AC3:** `email_confirmed_at` preenchido (não precisa confirmar e-mail)
- [ ] **AC4:** O trigger `handle_new_user` cria o profile automaticamente
- [ ] **AC5:** Profile da conta tem `role = 'admin'`
- [ ] **AC6:** Nenhum registro é criado em `students` (admin não é aluno)
- [ ] **AC7:** Admin consegue logar em `/login` e é redirecionado para `/admin`

## Arquivos envolvidos

```
supabase/migrations/
└── 20240101000013_seed_admin.sql   # NOVO — Seed da conta admin
```

## Dependências

- **Migration 12** (is_admin) — já aplicada
- **Nenhuma outra story** — pode ser executada em paralelo à Story 5

## Stack técnica

| Aspecto | Decisão |
|---------|---------|
| Criação do usuário | Insert direto em `auth.users` (bypassa signUp) |
| Hash da senha | `extensions.crypt(password, gen_salt('bf'))` |
| Extensão | `pgcrypto` (create extension if not exists) |
| Confirmação | `email_confirmed_at = now()` |
| Role | `update profiles set role = 'admin'` após o trigger |

## SQL (migration 13)

```sql
-- Migration: 20240101000013_seed_admin.sql
-- Conta admin padrão de TESTE. Trocar senha após o primeiro acesso.
create extension if not exists "pgcrypto";

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token,
  email_change_token_new, email_change
)
values (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@bushido.com',
  extensions.crypt('1234', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(), now(),
  '', '', '', '', ''
);

update public.profiles
set role = 'admin'
where email = 'admin@bushido.com';
```

## Regras de negócio

- A conta admin é **exclusivamente para teste/MVP**
- A senha `1234` deve ser trocada após o primeiro acesso (via `/recuperar-senha`)
- Não deve haver registro em `students` para o admin (não é aluno)

## Checklist de implementação

- [X] Criar migration `13_seed_admin.sql`
- [X] Aplicar no Supabase SQL Editor
- [X] Verificar que o profile tem role='admin'
- [X] Verificar que NÃO há registro em students
- [X] Logar com admin@bushido.com / 1234 → deve ir para /admin
- [X] Documentar credenciais de teste no AGENTS.md
- [X] SERVICE_ROLE_KEY configurada (validada no backend com 200)
