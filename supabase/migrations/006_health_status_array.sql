-- Convert health_status from text to text array
-- Existing single values are wrapped in an array
ALTER TABLE public.profiles
  ALTER COLUMN health_status TYPE text[]
  USING ARRAY[health_status];

-- Update default
ALTER TABLE public.profiles
  ALTER COLUMN health_status SET DEFAULT '{}';
