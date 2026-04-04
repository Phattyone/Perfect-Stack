-- Create profiles table linked to auth.users
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,

  -- Step 1: Basic Profile
  age_group text not null,
  primary_goal text not null,
  training_style text not null,
  health_status text not null,

  -- Step 2: Medications
  pde5_inhibitor text not null default 'none',
  pde5_dose text,
  pde5_frequency text,
  bp_meds boolean not null default false,
  nitrate_meds boolean not null default false,
  alpha_blockers boolean not null default false,
  diabetes_meds boolean not null default false,
  trt_hrt boolean not null default false,
  thyroid_meds boolean not null default false,
  blood_thinners boolean not null default false,
  other_ed_meds boolean not null default false,

  -- Step 3: Stack Selection
  stack_selection text not null,

  -- Safety acknowledgements
  nitrate_warning_acknowledged boolean not null default false,
  blood_thinner_warning_acknowledged boolean not null default false,
  trt_warning_acknowledged boolean not null default false,
  pde5_warning_acknowledged boolean not null default false,

  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Users can read their own profile
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can insert their own profile
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-update updated_at on row change
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_profiles_updated
  before update on public.profiles
  for each row execute function public.handle_updated_at();
