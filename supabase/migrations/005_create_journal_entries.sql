-- 8-week progress journal entries - one per week per user
create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_number integer not null check (week_number between 1 and 8),
  entry_date date not null default current_date,

  -- Performance scores (1-10)
  energy_score integer check (energy_score between 1 and 10),
  libido_score integer check (libido_score between 1 and 10),
  erection_quality_score integer check (erection_quality_score between 1 and 10),
  sleep_quality_score integer check (sleep_quality_score between 1 and 10),
  mood_score integer check (mood_score between 1 and 10),
  workout_performance_score integer check (workout_performance_score between 1 and 10),

  -- How I'm feeling
  wins_this_week text,
  challenges text,
  body_energy_notes text,
  sex_drive_notes text,

  -- Protocol notes
  supplements_consistent text,
  meals_diet_notes text,
  training_done text,
  sleep_details text,

  -- Measurements
  weight_lbs numeric,
  waist_inches numeric,
  body_fat_percent numeric,
  bench_press_max numeric,
  squat_max numeric,

  -- Free reflection
  free_reflection text,

  -- Progress photos (array of storage URLs)
  photo_urls text[] not null default '{}',

  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- One entry per week per user
  unique (user_id, week_number)
);

alter table public.journal_entries enable row level security;

create policy "Users can read own journal entries"
  on public.journal_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert own journal entries"
  on public.journal_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update own journal entries"
  on public.journal_entries for update
  using (auth.uid() = user_id);

create trigger on_journal_entries_updated
  before update on public.journal_entries
  for each row execute function public.handle_updated_at();

-- NOTE: You must also create a storage bucket named 'journal-photos' in the
-- Supabase dashboard. Set it to private with RLS enabled. Add a policy that
-- allows authenticated users to upload to their own folder (user_id/filename)
-- and read their own files.
