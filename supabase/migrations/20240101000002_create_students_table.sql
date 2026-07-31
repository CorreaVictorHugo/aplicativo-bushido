-- Migration: 20240101000002_create_students_table.sql
-- Create students table

create table students (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null unique references profiles(id) on delete cascade,
  name text not null,
  photo_url text,
  birth_date date,
  phone text,
  weight numeric(5,2),
  belt text not null check (belt in ('white', 'blue', 'purple', 'brown', 'black', 'red', 'coral')) default 'white',
  degree int not null check (degree >= 0 and degree <= 4) default 0,
  entry_date date not null default current_date,
  status text not null check (status in ('active', 'inactive')) default 'active',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table students enable row level security;

-- Policies
create policy "Students can view own data"
  on students for select
  using (profile_id = auth.uid());

create policy "Admins can view all students"
  on students for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can insert students"
  on students for insert
  with check (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update students"
  on students for update
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can delete students"
  on students for delete
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Updated at trigger
create or replace function update_updated_at_column()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger update_students_updated_at
  before update on students
  for each row execute procedure update_updated_at_column();

-- Indexes
create index idx_students_profile_id on students(profile_id);
create index idx_students_status on students(status);
create index idx_students_belt on students(belt);