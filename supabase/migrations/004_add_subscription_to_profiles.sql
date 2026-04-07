-- Add subscription fields to existing profiles table
alter table public.profiles
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists subscription_status text not null default 'free',
  add column if not exists subscription_period text,
  add column if not exists subscription_current_period_end timestamptz;

-- Add check constraint for subscription_status values
alter table public.profiles
  add constraint profiles_subscription_status_check
  check (subscription_status in ('free', 'foundation', 'complete', 'ultimate', 'active', 'canceled'));
