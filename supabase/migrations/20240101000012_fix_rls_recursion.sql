-- Migration: 20240101000012_fix_rls_recursion.sql
-- Fix infinite recursion in RLS policies (error 42P17)
-- Cause: policies used `exists (select 1 from profiles where role = 'admin')`.
-- Since `profiles` has RLS with a self-referencing admin policy, the subquery
-- re-triggers RLS on profiles -> infinite recursion.
-- Fix: introduce a SECURITY DEFINER helper `is_admin()` that bypasses RLS.

-- 1. Helper function (security definer bypasses RLS, breaking the recursion)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- SECURITY DEFINER functions receive EXECUTE from PUBLIC by default.
-- Keep this helper available only to authenticated requests, since it exists
-- exclusively for authorization checks inside RLS policies.
revoke all on function public.is_admin() from public;
revoke all on function public.is_admin() from anon;
grant execute on function public.is_admin() to authenticated;

-- 2. profiles
drop policy if exists "Admins can view all profiles" on profiles;
create policy "Admins can view all profiles"
  on profiles for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can insert profiles" on profiles;
create policy "Admins can insert profiles"
  on profiles for insert
  to authenticated
  with check (public.is_admin());

-- 3. students
drop policy if exists "Admins can view all students" on students;
create policy "Admins can view all students"
  on students for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can insert students" on students;
create policy "Admins can insert students"
  on students for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update students" on students;
create policy "Admins can update students"
  on students for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete students" on students;
create policy "Admins can delete students"
  on students for delete
  to authenticated
  using (public.is_admin());

-- 4. trainings
drop policy if exists "Admins can view all trainings" on trainings;
create policy "Admins can view all trainings"
  on trainings for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can insert trainings" on trainings;
create policy "Admins can insert trainings"
  on trainings for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update trainings" on trainings;
create policy "Admins can update trainings"
  on trainings for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete trainings" on trainings;
create policy "Admins can delete trainings"
  on trainings for delete
  to authenticated
  using (public.is_admin());

-- 5. training_responsibles
drop policy if exists "Admins can insert training responsibles" on training_responsibles;
create policy "Admins can insert training responsibles"
  on training_responsibles for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can delete training responsibles" on training_responsibles;
create policy "Admins can delete training responsibles"
  on training_responsibles for delete
  to authenticated
  using (public.is_admin());

-- 6. checkins
drop policy if exists "Admins can view all checkins" on checkins;
create policy "Admins can view all checkins"
  on checkins for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can update any checkin" on checkins;
create policy "Admins can update any checkin"
  on checkins for update
  to authenticated
  using (public.is_admin())
  with check (decided_by = auth.uid() and decided_at is not null);

-- 7. graduations
drop policy if exists "Admins can view all graduations" on graduations;
create policy "Admins can view all graduations"
  on graduations for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can insert graduations" on graduations;
create policy "Admins can insert graduations"
  on graduations for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update graduations" on graduations;
create policy "Admins can update graduations"
  on graduations for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete graduations" on graduations;
create policy "Admins can delete graduations"
  on graduations for delete
  to authenticated
  using (public.is_admin());

-- 8. payments
drop policy if exists "Admins can view all payments" on payments;
create policy "Admins can view all payments"
  on payments for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can insert payments" on payments;
create policy "Admins can insert payments"
  on payments for insert
  to authenticated
  with check (public.is_admin() and registered_by = auth.uid());

drop policy if exists "Admins can update payments" on payments;
create policy "Admins can update payments"
  on payments for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete payments" on payments;
create policy "Admins can delete payments"
  on payments for delete
  to authenticated
  using (public.is_admin());

-- 9. publications
drop policy if exists "Admins can view all publications" on publications;
create policy "Admins can view all publications"
  on publications for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can insert publications" on publications;
create policy "Admins can insert publications"
  on publications for insert
  to authenticated
  with check (public.is_admin() and author_id = auth.uid());

drop policy if exists "Admins can update own publications" on publications;
create policy "Admins can update own publications"
  on publications for update
  to authenticated
  using (author_id = auth.uid() and public.is_admin())
  with check (author_id = auth.uid() and public.is_admin());

drop policy if exists "Admins can delete own publications" on publications;
create policy "Admins can delete own publications"
  on publications for delete
  to authenticated
  using (author_id = auth.uid() and public.is_admin());

-- 10. notifications
drop policy if exists "Admins can view all notifications" on notifications;
create policy "Admins can view all notifications"
  on notifications for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can insert notifications" on notifications;
create policy "Admins can insert notifications"
  on notifications for insert
  to authenticated
  with check (public.is_admin());

-- 11. storage.objects (publication images and uploads)
drop policy if exists "Admins can upload publication images" on storage.objects;
create policy "Admins can upload publication images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'publications' and public.is_admin());

drop policy if exists "Admins can update publication images" on storage.objects;
create policy "Admins can update publication images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'publications' and public.is_admin());

drop policy if exists "Admins can delete publication images" on storage.objects;
create policy "Admins can delete publication images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'publications' and public.is_admin());

drop policy if exists "Admins can view all uploads" on storage.objects;
create policy "Admins can view all uploads"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'uploads' and public.is_admin());
