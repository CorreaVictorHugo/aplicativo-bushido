-- Migration: 20240101000015_protect_privileged_fields.sql
-- Corrige 2 vulnerabilidades RLS críticas:
-- 1. Aluno podia alterar o próprio `role` (escalada para admin) via profiles
-- 2. Aluno podia alterar belt/degree/entry_date/status (RF-003) via students
-- Solução: triggers BEFORE UPDATE que bloqueiam essas colunas para não-admins.

-- Bloqueia alteração de role/status em profiles por não-admin
create or replace function public.prevent_profile_role_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Superuser (migrations/seed) e admin passam
  if auth.uid() is null then
    return new;
  end if;
  if public.is_admin() then
    return new;
  end if;
  if new.role is distinct from old.role
     or new.status is distinct from old.status
  then
    raise exception 'Nao e permitido alterar role ou status sem permissao de administrador.';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_privileged_update on profiles;
create trigger protect_profile_privileged_update
  before update on profiles
  for each row
  execute procedure public.prevent_profile_role_update();

-- Bloqueia alteração de belt/degree/entry_date/status em students por não-admin
create or replace function public.prevent_student_protected_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Superuser (migrations/seed) e admin passam
  if auth.uid() is null then
    return new;
  end if;
  if public.is_admin() then
    return new;
  end if;
  if new.belt is distinct from old.belt
     or new.degree is distinct from old.degree
     or new.entry_date is distinct from old.entry_date
     or new.status is distinct from old.status
  then
    raise exception 'Nao e permitido alterar faixa, grau, data de entrada ou status sem permissao de administrador.';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_student_privileged_update on students;
create trigger protect_student_privileged_update
  before update on students
  for each row
  execute procedure public.prevent_student_protected_update();
