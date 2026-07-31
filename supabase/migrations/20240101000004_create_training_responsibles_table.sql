-- Migration: 20240101000004_create_training_responsibles_table.sql
-- Create training_responsibles table

create table training_responsibles (
  id uuid primary key default uuid_generate_v4(),
  training_id uuid not null references trainings(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(training_id, profile_id)
);

-- Enable RLS
alter table training_responsibles enable row level security;

-- Policies
create policy "Anyone can view training responsibles"
  on training_responsibles for select
  using (true);

create policy "Admins can insert training responsibles"
  on training_responsibles for insert
  with check (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can delete training responsibles"
  on training_responsibles for delete
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Indexes
create index idx_training_responsibles_training_id on training_responsibles(training_id);
create index idx_training_responsibles_profile_id on training_responsibles(profile_id);