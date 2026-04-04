"use client";

import type { SafetyModalConfig } from "@/lib/types/profile";

const variantStyles = {
  red: {
    border: "border-red-500",
    bg: "bg-red-950",
    title: "text-red-400",
    body: "text-red-200",
    button: "bg-red-600 hover:bg-red-500 focus:ring-red-600",
  },
  orange: {
    border: "border-orange-500",
    bg: "bg-orange-950",
    title: "text-orange-400",
    body: "text-orange-200",
    button: "bg-orange-600 hover:bg-orange-500 focus:ring-orange-600",
  },
  blue: {
    border: "border-blue-500",
    bg: "bg-blue-950",
    title: "text-blue-400",
    body: "text-blue-200",
    button: "bg-blue-600 hover:bg-blue-500 focus:ring-blue-600",
  },
};

interface SafetyModalProps {
  config: SafetyModalConfig;
  onAcknowledge: () => void;
}

export default function SafetyModal({ config, onAcknowledge }: SafetyModalProps) {
  const styles = variantStyles[config.variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div
        className={`mx-4 max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-lg border-2 p-6 ${styles.border} ${styles.bg}`}
      >
        <h2 className={`text-lg font-bold ${styles.title}`}>{config.title}</h2>
        <p className={`mt-4 text-sm leading-relaxed ${styles.body}`}>
          {config.body}
        </p>
        <button
          onClick={onAcknowledge}
          className={`mt-6 w-full rounded-md px-4 py-2.5 text-sm font-semibold text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950 ${styles.button}`}
        >
          {config.acknowledgeText}
        </button>
      </div>
    </div>
  );
}
