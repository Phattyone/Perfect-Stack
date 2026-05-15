import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Auto-create a profile row if the user doesn't have one yet.
      // This handles first-time email confirmation where no profile exists.
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single();

        if (!profile) {
          const { error: insertError } = await supabase.from("profiles").insert({
            id: user.id,
            subscription_status: "free",
            age_group: "30-39",
            primary_goal: "Hormone and Sexual Health",
            training_style: "Moderate (3-4x per week)",
            health_status: ["No significant conditions"],
            stack_selection: {},
          });

          if (insertError) {
            console.error("Failed to create profile for user:", user.id, insertError);
          }
        }
      }

      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  // If there's no code or an error occurred, redirect to login
  return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent("Could not authenticate user")}`);
}
