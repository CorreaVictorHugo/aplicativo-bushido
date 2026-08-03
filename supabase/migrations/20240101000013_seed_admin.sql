-- Migration: 20240101000013_seed_admin.sql
-- Conta admin padrão de TESTE (EMAIL FICTÍCIO).
-- Login original: admin@bushido.com / 1234
--
-- ⛔ NÃO RE-EXECUTAR ESTA MIGRATION NO SQL EDITOR.
-- MOTIVO: a conta admin@bushido.com é fictícia e foi SUBSTITUÍDA por um admin real
-- (criado manualmente via Supabase Dashboard → Authentication → Users → Add user,
-- com role='admin' definido por UPDATE em profiles). O admin fictício foi EXCLUÍDO.
-- Como este script usa `where not exists (email = 'admin@bushido.com')`,
-- re-executá-lo RECRIARIA a conta fictícia admin@bushido.com / 1234,
-- que já não existe mais no banco — reintroduzindo uma conta admin de teste
-- com senha fraca e sem vínculo com o dono real do sistema.
--
-- Se precisar criar outro admin no futuro, use:
--   Supabase Dashboard → Authentication → Users → Add user (e-mail real + auto confirm)
--   SQL: update public.profiles set role = 'admin' where email = '<email-real>';
--
-- CREDENCIAIS REAIS DO ADMIN: NÃO devem ficar em migrations/código (segurança).

create extension if not exists "pgcrypto";

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
)
select
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@bushido.com',
  extensions.crypt('1234', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now(),
  '',
  '',
  '',
  ''
where not exists (
  select 1 from auth.users where email = 'admin@bushido.com'
);

-- O trigger handle_new_user cria o profile; aqui garantimos o role admin.
update public.profiles
set role = 'admin'
where email = 'admin@bushido.com';
