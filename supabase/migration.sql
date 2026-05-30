-- Migration v2 — nouvelles tables uniquement (profiles déjà existante)

create table if not exists public.entreprises (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique,
  description text,
  long_description text,
  address text,
  city text,
  country text default 'France',
  zone text,
  region text,
  metier text,
  metier_label text,
  color text default '#A8894A',
  initials text,
  founded text,
  certifications text[] default '{}',
  email text,
  phone text,
  website text,
  adf_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.savoir_faire (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  created_at timestamptz default now()
);

create table if not exists public.entreprise_savoir_faire (
  entreprise_id uuid references public.entreprises(id) on delete cascade,
  savoir_faire_id uuid references public.savoir_faire(id) on delete cascade,
  primary key (entreprise_id, savoir_faire_id)
);

create table if not exists public.collaborateurs (
  id uuid default gen_random_uuid() primary key,
  entreprise_id uuid references public.entreprises(id) on delete set null,
  first_name text,
  last_name text not null,
  email text,
  phone text,
  poste text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.knowledge_base (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  type text not null check (type in ('rex', 'technique', 'bonnes_pratiques')),
  description text,
  content text,
  source text,
  entreprise_id uuid references public.entreprises(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.kb_savoir_faire (
  kb_id uuid references public.knowledge_base(id) on delete cascade,
  savoir_faire_id uuid references public.savoir_faire(id) on delete cascade,
  primary key (kb_id, savoir_faire_id)
);

-- RLS
alter table public.entreprises enable row level security;
alter table public.savoir_faire enable row level security;
alter table public.entreprise_savoir_faire enable row level security;
alter table public.collaborateurs enable row level security;
alter table public.knowledge_base enable row level security;
alter table public.kb_savoir_faire enable row level security;

-- Policies (drop si elles existent déjà puis recrée)
do $$ begin
  drop policy if exists "Authenticated users can view entreprises" on public.entreprises;
  drop policy if exists "Authenticated users can insert entreprises" on public.entreprises;
  drop policy if exists "Authenticated users can update entreprises" on public.entreprises;
  drop policy if exists "Authenticated users can view savoir_faire" on public.savoir_faire;
  drop policy if exists "Authenticated users can insert savoir_faire" on public.savoir_faire;
  drop policy if exists "Authenticated users can update savoir_faire" on public.savoir_faire;
  drop policy if exists "Authenticated users can view liens" on public.entreprise_savoir_faire;
  drop policy if exists "Authenticated users can insert liens" on public.entreprise_savoir_faire;
  drop policy if exists "Authenticated users can delete liens" on public.entreprise_savoir_faire;
  drop policy if exists "Authenticated users can view collaborateurs" on public.collaborateurs;
  drop policy if exists "Authenticated users can insert collaborateurs" on public.collaborateurs;
  drop policy if exists "Authenticated users can update collaborateurs" on public.collaborateurs;
  drop policy if exists "Authenticated users can view kb" on public.knowledge_base;
  drop policy if exists "Authenticated users can insert kb" on public.knowledge_base;
  drop policy if exists "Authenticated users can update kb" on public.knowledge_base;
  drop policy if exists "Authenticated users can view kb liens" on public.kb_savoir_faire;
  drop policy if exists "Authenticated users can insert kb liens" on public.kb_savoir_faire;
end $$;

create policy "Authenticated users can view entreprises" on public.entreprises for select using (auth.role() = 'authenticated');
create policy "Authenticated users can insert entreprises" on public.entreprises for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can update entreprises" on public.entreprises for update using (auth.role() = 'authenticated');
create policy "Authenticated users can view savoir_faire" on public.savoir_faire for select using (auth.role() = 'authenticated');
create policy "Authenticated users can insert savoir_faire" on public.savoir_faire for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can update savoir_faire" on public.savoir_faire for update using (auth.role() = 'authenticated');
create policy "Authenticated users can view liens" on public.entreprise_savoir_faire for select using (auth.role() = 'authenticated');
create policy "Authenticated users can insert liens" on public.entreprise_savoir_faire for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can delete liens" on public.entreprise_savoir_faire for delete using (auth.role() = 'authenticated');
create policy "Authenticated users can view collaborateurs" on public.collaborateurs for select using (auth.role() = 'authenticated');
create policy "Authenticated users can insert collaborateurs" on public.collaborateurs for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can update collaborateurs" on public.collaborateurs for update using (auth.role() = 'authenticated');
create policy "Authenticated users can view kb" on public.knowledge_base for select using (auth.role() = 'authenticated');
create policy "Authenticated users can insert kb" on public.knowledge_base for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can update kb" on public.knowledge_base for update using (auth.role() = 'authenticated');
create policy "Authenticated users can view kb liens" on public.kb_savoir_faire for select using (auth.role() = 'authenticated');
create policy "Authenticated users can insert kb liens" on public.kb_savoir_faire for insert with check (auth.role() = 'authenticated');
