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

drop policy if exists "Equipe pode ver lançamentos" on public.entries;
drop policy if exists "Equipe pode adicionar lançamentos" on public.entries;
drop policy if exists "Equipe pode excluir lançamentos" on public.entries;
drop policy if exists "Usuário vê apenas seus lançamentos" on public.entries;
drop policy if exists "Usuário adiciona seus lançamentos" on public.entries;
drop policy if exists "Usuário exclui seus lançamentos" on public.entries;

-- Cada usuário só vê os próprios lançamentos.
create policy "Usuário vê apenas seus lançamentos"
  on public.entries for select
  to authenticated
  using (auth.uid() = created_by);

-- Cada usuário só pode adicionar lançamentos em seu próprio nome.
create policy "Usuário adiciona seus lançamentos"
  on public.entries for insert
  to authenticated
  with check (auth.uid() = created_by);

-- Cada usuário só pode excluir os próprios lançamentos.
create policy "Usuário exclui seus lançamentos"
  on public.entries for delete
  to authenticated
  using (auth.uid() = created_by);
