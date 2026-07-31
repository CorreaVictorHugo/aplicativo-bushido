-- Migration: 20240101000013_seed_admin.sql
-- Conta admin padrão de TESTE.
-- ATENÇÃO: trocar a senha após o primeiro acesso (via /recuperar-senha).
-- Login: admin@bushido.com / 1234

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
