import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signout } from "@/app/(auth)/actions";
import { calculateStack } from "@/lib/stack-builder/calculator";
import { PROTOCOL_NAMES } from "@/lib/types/profile";
import type { ProfileFormData } from "@/lib/types/profile";
import ProtocolView from "./protocol-view";

export default async function ProtocolPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/dashboard/profile");

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
    blood_thinner_warning_acknowledged: profile.blood_thinner_warning_acknowledged,
    trt_warning_acknowledged: profile.trt_warning_acknowledged,
    pde5_warning_acknowledged: profile.pde5_warning_acknowledged,
  };

  const result = calculateStack(profileData);
  const protocolName = PROTOCOL_NAMES[profileData.stack_selection] ?? "Your Protocol";

  return (
    <div className="min-h-screen bg-zinc-950 print:bg-white print:text-black">
      <nav className="border-b border-zinc-800 print:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-bold text-yellow-600 transition hover:text-yellow-500">Perfect Stack</Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-zinc-400 sm:inline">{user.email}</span>
            <form action={signout}><button type="submit" className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition hover:border-yellow-600 hover:text-white">Sign Out</button></form>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <Link href="/dashboard/stack-builder" className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-400 transition hover:text-zinc-300 print:hidden">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Stack Builder
        </Link>
        <h1 className="text-2xl font-bold text-white print:text-black">My Protocol Summary</h1>
        <p className="mt-1 text-zinc-400 print:text-gray-600">{protocolName}</p>

        <ProtocolView profile={profileData} result={result} />
      </main>
    </div>
  );
}
