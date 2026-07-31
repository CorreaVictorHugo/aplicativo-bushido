-- Migration: 20240101000011_update_auth_trigger.sql
-- Update handle_new_user trigger to also create student record
-- Update RLS policies for students table

-- Drop old function (cascade drops the trigger too)
drop function if exists public.handle_new_user() cascade;

-- Create updated function that creates profile + student atomically
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role, status)
  values (new.id, new.email, 'student', 'active')
  on conflict (id) do nothing;

  if new.raw_user_meta_data ? 'name' then
    insert into public.students (profile_id, name, birth_date, phone)
    values (
      new.id,
      new.raw_user_meta_data ->> 'name',
      (new.raw_user_meta_data ->> 'birth_date')::date,
      new.raw_user_meta_data ->> 'phone'
    );
  end if;

  return new;
end;
$$;

-- Recreate trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();

-- Drop old student insert policy that only allows admins
drop policy if exists "Admins can insert students" on students;

-- Allow students to insert their own record (in case trigger misses or needs to complete)
create policy "Students can insert own record"
  on students for insert
  to authenticated
  with check (profile_id = auth.uid());

-- Allow students to update their own record
drop policy if exists "Admins can update students" on students;

create policy "Students can update own record"
  on students for update
  to authenticated
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

-- Recreate admin update policy with explicit name
create policy "Admins can update students"
  on students for update
  to authenticated
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Recreate admin insert policy with explicit name
create policy "Admins can insert students"
  on students for insert
  to authenticated
  with check (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );
