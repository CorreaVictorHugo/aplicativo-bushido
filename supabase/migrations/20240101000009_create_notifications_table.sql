-- Migration: 20240101000009_create_notifications_table.sql
-- Create notifications table

create table notifications (
  id uuid primary key default uuid_generate_v4(),
  target_profile text not null check (target_profile in ('all', 'students', 'admins', 'specific')),
  target_student_id uuid references students(id) on delete cascade,
  title text not null,
  message text not null,
  sent_at timestamptz not null default now(),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table notifications enable row level security;

-- Policies
create policy "Students can view own notifications"
  on notifications for select
  using (
    target_profile in ('all', 'students')
    or (target_profile = 'specific' and target_student_id in (
      select id from students where profile_id = auth.uid()
    ))
  );

create policy "Admins can view all notifications"
  on notifications for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can insert notifications"
  on notifications for insert
  with check (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Students can mark own notifications as read"
  on notifications for update
  using (
    target_profile in ('all', 'students')
    or (target_profile = 'specific' and target_student_id in (
      select id from students where profile_id = auth.uid()
    ))
  )
  with check (read_at is not null);

-- Indexes
create index idx_notifications_target_profile on notifications(target_profile);
create index idx_notifications_target_student_id on notifications(target_student_id);
create index idx_notifications_sent_at on notifications(sent_at);
create index idx_notifications_read_at on notifications(read_at);