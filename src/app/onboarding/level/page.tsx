"use client";

import { OnboardingStepLayout } from "@/app/onboarding/_components/onboarding-step-layout";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { cn } from "@/lib/utils";

const levels = [
  {
    id: "a0",
    label: "A0",
    description: "Complete beginner. No prior exposure.",
  },
  {
    id: "a1",
    label: "A1",
    description: "Basic phrases and introductions.",
  },
  {
    id: "a2",
    label: "A2",
    description: "Everyday topics with short sentences.",
  },
  {
    id: "b1",
    label: "B1",
    description: "Intermediate. Can handle common situations.",
  },
  {
    id: "not-sure",
    label: "Not sure",
    description: "Let the voice assessment guide me.",
  },
];

export default function LevelPage() {
  const level = useOnboardingStore((state) => state.level);
  const setLevel = useOnboardingStore((state) => state.setLevel);

  return (
    <OnboardingStepLayout
      stepSlug="level"
      title="Where are you starting from?"
      subtitle="Pick the level that feels closest to today."
      backHref="/onboarding/language"
      nextHref="/onboarding/voice-sample"
      nextLabel="Continue to voice sample"
      canProceed={Boolean(level)}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {levels.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setLevel(item.id)}
            className={cn(
              "flex flex-col rounded-3xl border-2 border-slate-900 p-4 text-left shadow-[4px_4px_0px_rgba(15,23,42,0.7)] transition",
              level === item.id
                ? "bg-slate-900 text-white"
                : "bg-white/70 text-slate-900"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">{item.label}</span>
              <span className="rounded-full border-2 border-slate-900 bg-[#ffe08a] px-3 py-1 text-xs font-semibold">
                CEFR
              </span>
            </div>
            <p
              className={cn(
                "mt-3 text-sm",
                level === item.id ? "text-white/80" : "text-slate-600"
              )}
            >
              {item.description}
            </p>
          </button>
        ))}
      </div>
    </OnboardingStepLayout>
  );
}
