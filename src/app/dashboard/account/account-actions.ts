"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { stripe } from "@/lib/stripe/server";

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function updateEmail(
  newEmail: string,
  currentPassword: string
): Promise<{ error: string | null }> {
  if (!newEmail || !currentPassword) {
    return { error: "Email and current password are required" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return { error: "Not authenticated" };

  // Verify current password before allowing email change
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (signInError) return { error: "Current password is incorrect" };

  const { error } = await supabase.auth.updateUser({ email: newEmail });
  if (error) return { error: error.message };

  return { error: null };
}

export async function updatePassword(
  currentPassword: string,
  newPassword: string
): Promise<{ error: string | null }> {
  if (!currentPassword || !newPassword) {
    return { error: "All password fields are required" };
  }

  if (newPassword.length < 8) {
    return { error: "New password must be at least 8 characters" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return { error: "Not authenticated" };

  // Verify current password
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (signInError) return { error: "Current password is incorrect" };

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { error: error.message };

  return { error: null };
}

export async function deleteAccount(
  userId: string
): Promise<{ error: string | null }> {
  // Fetch profile for Stripe cleanup
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("stripe_subscription_id")
    .eq("id", userId)
    .single();

  // Cancel any active Stripe subscription
  if (profile?.stripe_subscription_id) {
    try {
      await stripe.subscriptions.cancel(profile.stripe_subscription_id);
    } catch (err) {
      console.error("Failed to cancel Stripe subscription during account deletion:", err);
      // Continue with deletion even if cancellation fails
    }
  }

  // Delete storage files
  try {
    const { data: files } = await supabaseAdmin.storage
      .from("digital-guides")
      .list(userId);

    if (files && files.length > 0) {
      const paths = files.map((f) => `${userId}/${f.name}`);
      await supabaseAdmin.storage.from("digital-guides").remove(paths);
    }
  } catch (err) {
    console.error("Failed to delete user storage files:", err);
  }

  // Delete profile row (cascade handles all related rows)
  await supabaseAdmin.from("profiles").delete().eq("id", userId);

  // Delete the auth user
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) return { error: error.message };

  return { error: null };
}
