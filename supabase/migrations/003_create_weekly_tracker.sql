-- Weekly entries — one per week per user across the 8-week protocol
create table public.weekly_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_number integer not null check (week_number between 1 and 8),
  entry_date date not null default current_date,

  -- Measurements
  weight_lbs numeric,
  waist_inches numeric,

  -- Performance markers (1-10)
  energy_score integer check (energy_score between 1 and 10),
  libido_score integer check (libido_score between 1 and 10),
  erection_quality_score integer check (erection_quality_score between 1 and 10),
  sleep_quality_score integer check (sleep_quality_score between 1 and 10),
  mood_score integer check (mood_score between 1 and 10),
  strength_recovery_score integer check (strength_recovery_score between 1 and 10),

  -- Habits
  sleep_hours numeric,
  alcohol_drinks integer,
  training_days integer,

  -- Optional
  notes text,

  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- One entry per week per user
  unique (user_id, week_number)
);

alter table public.weekly_entries enable row level security;

create policy "Users can read own weekly entries"
  on public.weekly_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert own weekly entries"
  on public.weekly_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update own weekly entries"
  on public.weekly_entries for update
  using (auth.uid() = user_id);

create trigger on_weekly_entries_updated
  before update on public.weekly_entries
  for each row execute function public.handle_updated_at();
