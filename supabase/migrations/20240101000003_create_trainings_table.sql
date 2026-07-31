-- Migration: 20240101000003_create_trainings_table.sql
-- Create trainings table

create table trainings (
  id uuid primary key default uuid_generate_v4(),
  modality text not null default 'Jiu-Jitsu',
  weekday int not null check (weekday >= 0 and weekday <= 6),
  time time not null,
  location text not null,
  capacity int not null default 30,
  status text not null check (status in ('active', 'inactive')) default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table trainings enable row level security;

-- Policies
create policy "Anyone can view active trainings"
  on trainings for select
  using (status = 'active');

create policy "Admins can view all trainings"
  on trainings for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can insert trainings"
  on trainings for insert
  with check (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update trainings"
  on trainings for update
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can delete trainings"
  on trainings for delete
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Updated at trigger
create trigger update_trainings_updated_at
  before update on trainings
  for each row execute procedure update_updated_at_column();

-- Indexes
create index idx_trainings_weekday on trainings(weekday);
create index idx_trainings_status on trainings(status);