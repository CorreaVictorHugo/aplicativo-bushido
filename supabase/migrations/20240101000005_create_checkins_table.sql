-- Migration: 20240101000005_create_checkins_table.sql
-- Create checkins table

create table checkins (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references students(id) on delete cascade,
  training_id uuid not null references trainings(id) on delete cascade,
  class_date date not null default current_date,
  checkin_at timestamptz not null default now(),
  status text not null check (status in ('pending', 'confirmed', 'rejected')) default 'pending',
  decided_by uuid references profiles(id) on delete set null,
  decided_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(student_id, training_id, class_date)
);

-- Enable RLS
alter table checkins enable row level security;

-- Policies
create policy "Students can view own checkins"
  on checkins for select
  using (student_id in (select id from students where profile_id = auth.uid()));

create policy "Students can insert own checkins (pending only)"
  on checkins for insert
  with check (
    student_id in (select id from students where profile_id = auth.uid())
    and status = 'pending'
    and class_date = current_date
  );

create policy "Responsibles can view checkins for their trainings"
  on checkins for select
  using (
    exists (
      select 1 from training_responsibles tr
      where tr.training_id = checkins.training_id
      and tr.profile_id = auth.uid()
    )
  );

create policy "Admins can view all checkins"
  on checkins for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Responsibles can update checkin status (confirm/reject)"
  on checkins for update
  using (
    exists (
      select 1 from training_responsibles tr
      where tr.training_id = checkins.training_id
      and tr.profile_id = auth.uid()
    )
  )
  with check (
    status in ('confirmed', 'rejected')
    and decided_by = auth.uid()
    and decided_at is not null
  );

create policy "Admins can update any checkin"
  on checkins for update
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  )
  with check (
    decided_by = auth.uid()
    and decided_at is not null
  );

-- Updated at trigger
create trigger update_checkins_updated_at
  before update on checkins
  for each row execute procedure update_updated_at_column();

-- Indexes
create index idx_checkins_student_id on checkins(student_id);
create index idx_checkins_training_id on checkins(training_id);
create index idx_checkins_class_date on checkins(class_date);
create index idx_checkins_status on checkins(status);
create index idx_checkins_student_training_date on checkins(student_id, training_id, class_date);