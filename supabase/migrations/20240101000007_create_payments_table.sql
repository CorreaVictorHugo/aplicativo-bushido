-- Migration: 20240101000007_create_payments_table.sql
-- Create payments table

create table payments (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references students(id) on delete cascade,
  reference text not null,
  amount numeric(10,2),
  date date not null default current_date,
  status text not null check (status in ('paid', 'pending', 'overdue')) default 'pending',
  notes text,
  registered_by uuid not null references profiles(id) on delete restrict,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table payments enable row level security;

-- Policies
create policy "Students can view own payments"
  on payments for select
  using (student_id in (select id from students where profile_id = auth.uid()));

create policy "Admins can view all payments"
  on payments for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can insert payments"
  on payments for insert
  with check (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
    and registered_by = auth.uid()
  );

create policy "Admins can update payments"
  on payments for update
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can delete payments"
  on payments for delete
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Indexes
create index idx_payments_student_id on payments(student_id);
create index idx_payments_date on payments(date);
create index idx_payments_status on payments(status);
create index idx_payments_reference on payments(reference);