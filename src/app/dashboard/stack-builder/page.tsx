import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signout } from "@/app/(auth)/actions";
import { calculateStack } from "@/lib/stack-builder/calculator";
import type { ProfileFormData } from "@/lib/types/profile";
import { PROTOCOL_NAMES } from "@/lib/types/profile";
import StackBuilderView from "./_components/stack-builder-view";

export default async function StackBuilderPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Load profile  -  redirect to profile setup if none exists
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/dashboard/profile");
  }

  const profileData: ProfileFormData = {
    age_group: profile.age_group,
    primary_goal: profile.primary_goal,
    training_style: profile.training_style,
    health_status: Array.isArray(profile.health_status) ? profile.health_status : [profile.health_status].filter(Boolean),
    pde5_inhibitor: profile.pde5_inhibitor,
    pde5_dose: profile.pde5_dose ?? "",
    pde5_frequency: profile.pde5_frequency ?? "",
    bp_meds: profile.bp_meds,
    nitrate_meds: profile.nitrate_meds,
    alpha_blockers: profile.alpha_blockers,
    diabetes_meds: profile.diabetes_meds,
    trt_hrt: profile.trt_hrt,
    thyroid_meds: profile.thyroid_meds,
    blood_thinners: profile.blood_thinners,
    other_ed_meds: profile.other_ed_meds,
    stack_selection: profile.stack_selection,
    nitrate_warning_acknowledged: profile.nitrate_warning_acknowledged,
    blood_thinner_warning_acknowledged:
      profile.blood_thinner_warning_acknowledged,
    trt_warning_acknowledged: profile.trt_warning_acknowledged,
    pde5_warning_acknowledged: profile.pde5_warning_acknowledged,
  };

  const result = calculateStack(profileData);

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Navigation */}
      <nav className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-bold text-yellow-600 hover:text-yellow-500 transition">
            Perfect Stack
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-zinc-400 sm:inline">{user.email}</span>
            <form action={signout}>
              <button
                type="submit"
                className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition hover:border-yellow-600 hover:text-white"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-400 transition hover:text-zinc-300"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-white">Stack Builder</h1>
        <p className="mt-1 text-zinc-400">
          {PROTOCOL_NAMES[profileData.stack_selection] ?? "Your personalized supplement protocol"}{" "}
           -  based on your health profile.
        </p>

        {/* Medical disclaimer */}
        <div className="mt-4 rounded-lg bg-zinc-800 px-4 py-3">
          <p className="text-xs leading-relaxed text-zinc-400">
            <span className="mr-1">⚠️</span>
            <strong className="text-zinc-300">These statements have not been evaluated by the Food and Drug Administration.</strong>{" "}
            This product is not intended to diagnose, treat, cure, or prevent any disease. The supplement
            recommendations on this page are personalized based on your health profile and are for informational
            purposes only. Always consult your healthcare provider before starting any new supplement regimen,
            especially if you have a medical condition or are taking prescription medications.
          </p>
        </div>

        <div className="mt-6">
          <StackBuilderView profile={profileData} result={result} />
        </div>
      </main>
    </div>
  );
}
