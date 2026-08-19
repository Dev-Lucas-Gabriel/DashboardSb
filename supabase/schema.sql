-- Rode isto no Supabase: Painel do projeto → SQL Editor → New query → colar e clicar em "Run".

create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  entrada numeric(12,2) not null default 0,
  saida numeric(12,2) not null default 0,
  nota text default '',
  created_by uuid references auth.users(id) default auth.uid(),
  created_at timestamptz not null default now()
);

alter table public.entries enable row level security;

-- Qualquer pessoa logada da equipe pode ver todos os lançamentos da loja.
create policy "Equipe pode ver lançamentos"
  on public.entries for select
  to authenticated
  using (true);

-- Qualquer pessoa logada pode adicionar lançamentos.
create policy "Equipe pode adicionar lançamentos"
  on public.entries for insert
  to authenticated
  with check (true);

-- Qualquer pessoa logada pode excluir lançamentos.
create policy "Equipe pode excluir lançamentos"
  on public.entries for delete
  to authenticated
  using (true);
