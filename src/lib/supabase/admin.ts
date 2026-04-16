/**
 * Supabase admin client — uses the service role key to bypass RLS.
 * ONLY import this in server-side code (Server Components, Route Handlers, Server Actions).
 * Never expose SUPABASE_SERVICE_ROLE_KEY to the browser.
 *
 * Required .env.local entry:
 *   SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
 * (Find it in Supabase Dashboard → Project Settings → API → service_role key)
 */

import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars."
    );
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
