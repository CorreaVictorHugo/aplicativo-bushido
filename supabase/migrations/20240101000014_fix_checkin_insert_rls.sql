-- Migration: 20240101000014_fix_checkin_insert_rls.sql
-- Fix: check-ins não eram criados (RLS bloqueava o insert).
-- A política antiga exigia `class_date = current_date` (data UTC do banco).
-- Isso falhava quando a data local do aluno (fuso) difere da data UTC,
-- e também se a política não existisse no banco.
-- Nova política: tolera ±1 dia (drift de fuso) e mantém status='pending'.

drop policy if exists "Students can insert own checkins (pending only)" on checkins;

create policy "Students can insert own checkins (pending only)"
  on checkins for insert
  to authenticated
  with check (
    student_id in (
      select id from public.students
      where profile_id = auth.uid()
    )
    and status = 'pending'
    and class_date >= (current_date - interval '1 day')
    and class_date <= (current_date + interval '1 day')
  );
