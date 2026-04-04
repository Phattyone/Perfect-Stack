"use client";

import type { ProfileFormData } from "@/lib/types/profile";

interface ProfileSummaryProps {
  profile: ProfileFormData;
}

function Badge({
  label,
  color,
}: {
  label: string;
  color: "gold" | "red" | "orange" | "blue";
}) {
  const styles = {
    gold: "border-yellow-600/40 bg-yellow-600/10 text-yellow-500",
    red: "border-red-500/40 bg-red-500/10 text-red-400",
    orange: "border-orange-500/40 bg-orange-500/10 text-orange-400",
    blue: "border-blue-500/40 bg-blue-500/10 text-blue-400",
  };
  return (
    <span
      className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${styles[color]}`}
    >
      {label}
    </span>
  );
}

export default function ProfileSummary({ profile }: ProfileSummaryProps) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Your Profile
      </h3>
      <div className="flex flex-wrap gap-2">
        <Badge label={profile.age_group} color="gold" />
        <Badge label={profile.primary_goal} color="gold" />
        <Badge label={profile.training_style} color="gold" />
        {profile.nitrate_meds && <Badge label="Nitrate Meds" color="red" />}
        {profile.blood_thinners && <Badge label="Blood Thinners" color="orange" />}
        {profile.pde5_inhibitor !== "None" && (
          <Badge label={profile.pde5_inhibitor} color="blue" />
        )}
        {profile.trt_hrt && <Badge label="TRT / HRT" color="blue" />}
        {profile.bp_meds && <Badge label="BP Meds" color="orange" />}
        {profile.alpha_blockers && <Badge label="Alpha-Blockers" color="orange" />}
        {profile.diabetes_meds && <Badge label="Diabetes Meds" color="orange" />}
        {profile.thyroid_meds && <Badge label="Thyroid Meds" color="blue" />}
      </div>
    </div>
  );
}
