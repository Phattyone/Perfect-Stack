-- Baseline checklist — one per user, recorded at start of protocol
create table public.baseline_checklists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  recorded_at date not null default current_date,

  -- Body measurements
  weight_lbs numeric not null,
  waist_inches numeric not null,
  hip_inches numeric,
  neck_inches numeric,

  -- Performance markers (1-10)
  energy_score integer not null check (energy_score between 1 and 10),
  libido_score integer not null check (libido_score between 1 and 10),
  erection_quality_score integer not null check (erection_quality_score between 1 and 10),
  sleep_quality_score integer not null check (sleep_quality_score between 1 and 10),
  mood_score integer not null check (mood_score between 1 and 10),
  strength_recovery_score integer not null check (strength_recovery_score between 1 and 10),

  -- Current habits
  sleep_hours numeric not null,
  alcohol_drinks_per_week integer not null default 0,
  training_days_per_week integer not null default 0,
  training_type text not null default '',

  -- Optional
  current_medications text,
  current_supplements text,
  notes text,

  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.baseline_checklists enable row level security;

create policy "Users can read own baseline"
  on public.baseline_checklists for select
  using (auth.uid() = user_id);

create policy "Users can insert own baseline"
  on public.baseline_checklists for insert
  with check (auth.uid() = user_id);

create policy "Users can update own baseline"
  on public.baseline_checklists for update
  using (auth.uid() = user_id);

create trigger on_baseline_updated
  before update on public.baseline_checklists
  for each row execute function public.handle_updated_at();
