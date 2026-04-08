"use client";

import type { ProfileFormData } from "@/lib/types/profile";

interface ProfileSummaryProps {
  profile: ProfileFormData;
}

function Badge({ label, color }: { label: string; color: "gold" | "red" | "orange" | "blue" }) {
  const styles = {
    gold: "border-yellow-600/40 bg-yellow-600/10 text-yellow-500",
    red: "border-red-500/40 bg-red-500/10 text-red-400",
    orange: "border-orange-500/40 bg-orange-500/10 text-orange-400",
    blue: "border-blue-500/40 bg-blue-500/10 text-blue-400",
  };
  return <span className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${styles[color]}`}>{label}</span>;
}

function AlertCard({ variant, title, body }: { variant: "red" | "orange" | "blue" | "green"; title: string; body: string }) {
  const styles = {
    red: "bg-red-950 border-red-500 text-red-400",
    orange: "bg-orange-950 border-orange-500 text-orange-400",
    blue: "bg-blue-950 border-blue-500 text-blue-400",
    green: "bg-green-950 border-green-700 text-green-400",
  };
  const icons = {
    red: "\u26A0\uFE0F",
    orange: "\u26A0\uFE0F",
    blue: "\u2139\uFE0F",
    green: "\u2705",
  };
  return (
    <div className={`mt-3 rounded-lg border p-3 ${styles[variant]}`}>
      <span className="text-xs font-bold">{icons[variant]} {title}</span>
      <p className="mt-1 text-[11px] leading-relaxed opacity-80">{body}</p>
    </div>
  );
}

export default function ProfileSummary({ profile }: ProfileSummaryProps) {
  const hasPDE5 = profile.pde5_inhibitor !== "None";
  const hasHighRisk = profile.bp_meds && profile.alpha_blockers && hasPDE5;
  const hasAnyFlag = profile.nitrate_meds || profile.blood_thinners || profile.trt_hrt || hasPDE5;

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Your Profile</h3>
      <div className="flex flex-wrap gap-2">
        <Badge label={profile.age_group} color="gold" />
        <Badge label={profile.primary_goal} color="gold" />
        <Badge label={profile.training_style} color="gold" />
        {profile.health_status.map((hs: string) => (
          <Badge key={hs} label={hs} color="gold" />
        ))}
        {profile.nitrate_meds && <Badge label="Nitrate Meds" color="red" />}
        {profile.blood_thinners && <Badge label="Blood Thinners" color="orange" />}
        {hasPDE5 && <Badge label={profile.pde5_inhibitor} color="blue" />}
        {profile.trt_hrt && <Badge label="TRT / HRT" color="blue" />}
        {profile.bp_meds && <Badge label="BP Meds" color="orange" />}
        {profile.alpha_blockers && <Badge label="Alpha-Blockers" color="orange" />}
        {profile.diabetes_meds && <Badge label="Diabetes Meds" color="orange" />}
        {profile.thyroid_meds && <Badge label="Thyroid Meds" color="blue" />}
      </div>

      {/* Medication alert cards */}
      {profile.nitrate_meds && (
        <AlertCard variant="red" title="Nitrate Medication Detected"
          body="Stack C (Nitric Performance) has been excluded from your protocol. Nitrates combined with NO-boosting supplements can cause life-threatening blood pressure drops." />
      )}
      {hasHighRisk && (
        <AlertCard variant="red" title="High Hypotension Risk"
          body="BP medication + alpha-blocker + PDE5 inhibitor combination detected. Stack C doses reduced by 70%. Monitor blood pressure carefully. Consult your prescriber." />
      )}
      {profile.blood_thinners && (
        <AlertCard variant="orange" title="Blood Thinner Interaction"
          body="Several supplements have mild interactions with blood thinners including Vitamin K2, Omega-3, Quercetin, Resveratrol, and Horny Goat Weed. Consult your prescriber before starting." />
      )}
      {profile.trt_hrt && (
        <AlertCard variant="blue" title="Hormone Therapy Active"
          body="Tongkat Ali, Fadogia Agrestis, and DHEA have been flagged or adjusted. Ashwagandha cortisol benefits remain fully applicable." />
      )}
      {hasPDE5 && !hasHighRisk && !profile.nitrate_meds && (
        <AlertCard variant="blue" title="PDE5 Inhibitor Detected"
          body="Stack C (Nitric Performance) doses have been reduced by 50% for safety. The combination is designed to work together but requires careful blood pressure monitoring. Start NO supplements at a reduced dose." />
      )}
      {!hasAnyFlag && (
        <AlertCard variant="green" title="No Critical Interactions Detected"
          body="Your medication profile shows no major supplement interactions. Your protocol has been optimized for your goals and health status." />
      )}
    </div>
  );
}
