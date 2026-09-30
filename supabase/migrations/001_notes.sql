-- Shared public gallery notes for ข้อความแทนใจ
-- App field map: body = text, color = accent

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  nickname text default '',
  body text not null
    check (char_length(body) > 0 and char_length(body) <= 40),
  color text not null
    check (color in ('red', 'blue', 'green', 'purple')),
  created_at timestamptz not null default now()
);

alter table public.notes enable row level security;

-- Public read for anon + authenticated
create policy "notes_select_public"
  on public.notes
  for select
  to anon, authenticated
  using (true);

-- Insert for anon (+ authenticated) with body/color guards
create policy "notes_insert_anon"
  on public.notes
  for insert
  to anon, authenticated
  with check (
    char_length(trim(body)) > 0
    and char_length(body) <= 40
    and color in ('red', 'blue', 'green', 'purple')
  );
