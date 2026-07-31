-- Migration: 20240101000006_create_graduations_table.sql
-- Create graduations table

create table graduations (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references students(id) on delete cascade,
  belt text not null check (belt in ('white', 'blue', 'purple', 'brown', 'black', 'red', 'coral')),
  degree int not null check (degree >= 0 and degree <= 4),
  date date not null default current_date,
  responsible_name text,
  notes text,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table graduations enable row level security;

-- Policies
create policy "Students can view own graduations"
  on graduations for select
  using (student_id in (select id from students where profile_id = auth.uid()));

create policy "Admins can view all graduations"
  on graduations for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can insert graduations"
  on graduations for insert
  with check (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update graduations"
  on graduations for update
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can delete graduations"
  on graduations for delete
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Indexes
create index idx_graduations_student_id on graduations(student_id);
create index idx_graduations_date on graduations(date);