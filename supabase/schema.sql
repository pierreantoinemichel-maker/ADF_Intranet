-- ADF Intranet — Supabase schema

-- Profiles (auto-créé à l'inscription)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  role text,
  department text,
  location text,
  phone text,
  avatar_url text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view all profiles"
  on public.profiles for select
  using (auth.role() = 'authenticated');

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Trigger: créer un profil à chaque nouvel utilisateur
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Documents
create table public.documents (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text not null,
  file_path text,
  file_size bigint,
  file_type text,
  uploaded_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.documents enable row level security;

create policy "Authenticated users can view documents"
  on public.documents for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can insert documents"
  on public.documents for insert
  with check (auth.role() = 'authenticated');

-- News / Actualités
create table public.news (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  excerpt text,
  content text,
  category text,
  author_id uuid references public.profiles(id),
  published_at timestamptz default now(),
  created_at timestamptz default now()
);

alter table public.news enable row level security;

create policy "Authenticated users can view news"
  on public.news for select
  using (auth.role() = 'authenticated');

-- Events
create table public.events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  event_date date not null,
  location text,
  created_at timestamptz default now()
);

alter table public.events enable row level security;

create policy "Authenticated users can view events"
  on public.events for select
  using (auth.role() = 'authenticated');
