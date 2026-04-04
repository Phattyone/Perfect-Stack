"use client";

const STEPS = ["Profile", "Medications", "Stack"];

interface ProgressBarProps {
  currentStep: number;
}

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div className="flex items-center justify-center gap-0">
      {STEPS.map((label, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <div key={label} className="flex items-center">
            {i > 0 && (
              <div
                className={`h-0.5 w-10 sm:w-16 ${
                  isCompleted || isActive ? "bg-yellow-600" : "bg-zinc-700"
                }`}
              />
            )}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  isActive || isCompleted
                    ? "bg-yellow-600 text-black"
                    : "bg-zinc-700 text-zinc-400"
                }`}
              >
                {stepNum}
              </div>
              <span
                className={`text-xs ${
                  isActive ? "text-yellow-600 font-medium" : "text-zinc-500"
                }`}
              >
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
