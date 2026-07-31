-- Migration: 20240101000008_create_publications_table.sql
-- Create publications table

create table publications (
  id uuid primary key default uuid_generate_v4(),
  type text not null check (type in ('notice', 'news', 'event', 'photo', 'video')),
  title text not null,
  content text,
  media_url text,
  author_id uuid not null references profiles(id) on delete restrict,
  published_at timestamptz,
  status text not null check (status in ('draft', 'published', 'archived')) default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table publications enable row level security;

-- Policies
create policy "Anyone can view published publications"
  on publications for select
  using (status = 'published');

create policy "Admins can view all publications"
  on publications for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can insert publications"
  on publications for insert
  with check (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
    and author_id = auth.uid()
  );

create policy "Admins can update own publications"
  on publications for update
  using (
    author_id = auth.uid()
    and exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can delete own publications"
  on publications for delete
  using (
    author_id = auth.uid()
    and exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Updated at trigger
create trigger update_publications_updated_at
  before update on publications
  for each row execute procedure update_updated_at_column();

-- Indexes
create index idx_publications_status on publications(status);
create index idx_publications_type on publications(type);
create index idx_publications_published_at on publications(published_at);
create index idx_publications_author_id on publications(author_id);