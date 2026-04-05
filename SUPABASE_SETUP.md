# Supabase Storage Setup

## Journal Photos Bucket

Create a storage bucket in the Supabase dashboard:

1. Go to **Storage** in the Supabase dashboard
2. Click **New Bucket**
3. Name: `journal-photos`
4. Set to **Private** (not public)
5. Enable **RLS**
6. Add these policies:

### Upload policy (INSERT)
- Name: `Users can upload to own folder`
- Target roles: `authenticated`
- Policy: `(bucket_id = 'journal-photos') AND ((storage.foldername(name))[1] = auth.uid()::text)`

### Read policy (SELECT)
- Name: `Users can read own photos`
- Target roles: `authenticated`
- Policy: `(bucket_id = 'journal-photos') AND ((storage.foldername(name))[1] = auth.uid()::text)`

### Delete policy (DELETE)
- Name: `Users can delete own photos`
- Target roles: `authenticated`
- Policy: `(bucket_id = 'journal-photos') AND ((storage.foldername(name))[1] = auth.uid()::text)`

Photos are stored at: `{user_id}/week-{week_number}/{filename}`
