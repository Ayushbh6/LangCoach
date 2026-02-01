"use client";

import { OnboardingStepLayout } from "@/app/onboarding/_components/onboarding-step-layout";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { cn } from "@/lib/utils";

const intensityOptions = [
  { id: "light", label: "Light", description: "Keep it breezy." },
  { id: "standard", label: "Standard", description: "Balanced momentum." },
  { id: "intense", label: "Intense", description: "Move fast." },
];

export default function PlanPage() {
  const language = useOnboardingStore((state) => state.language);
  const level = useOnboardingStore((state) => state.level);
  const timeCommitment = useOnboardingStore((state) => state.timeCommitment);
  const goals = useOnboardingStore((state) => state.goals);
  const planIntensity = useOnboardingStore((state) => state.planIntensity);
  const setPlanIntensity = useOnboardingStore(
    (state) => state.setPlanIntensity
  );

  return (
    <OnboardingStepLayout
      stepSlug="plan"
      title="Preview your plan"
      subtitle="Adjust intensity before we lock it in."
      backHref="/onboarding/goals"
      nextHref="/onboarding/complete"
      nextLabel="Confirm and finish"
      canProceed={Boolean(planIntensity)}
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border-2 border-slate-900 bg-white/80 p-5 shadow-[4px_4px_0px_rgba(15,23,42,0.7)]">
          <p className="text-sm font-semibold">Your draft plan</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { label: "Language", value: language ?? "—" },
              { label: "Level", value: level ?? "—" },
              {
                label: "Weekly time",
                value: `${timeCommitment.sessionLength * timeCommitment.daysPerWeek} min`,
              },
              {
                label: "Goals",
                value: `${goals.domain ?? "—"} · ${goals.timeline ?? "—"}`,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border-2 border-slate-900 bg-white/70 p-3 text-sm shadow-[3px_3px_0px_rgba(15,23,42,0.7)]"
              >
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                  {item.label}
                </p>
                <p className="mt-1 font-semibold capitalize">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border-2 border-dashed border-slate-400 bg-white/60 p-4 text-sm text-slate-600">
            Plan generation will use your voice assessment to auto-fill weekly
            sessions and focus areas.
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border-2 border-slate-900 bg-white/70 p-5 shadow-[4px_4px_0px_rgba(15,23,42,0.7)]">
          <p className="text-sm font-semibold">Intensity</p>
          <div className="grid gap-3">
            {intensityOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() =>
                  setPlanIntensity(option.id as "light" | "standard" | "intense")
                }
                className={cn(
                  "rounded-2xl border-2 border-slate-900 px-4 py-3 text-left text-sm font-semibold shadow-[4px_4px_0px_rgba(15,23,42,0.7)]",
                  planIntensity === option.id
                    ? "bg-slate-900 text-white"
                    : "bg-white/70 text-slate-900"
                )}
              >
                {option.label}
                <p className="mt-1 text-xs font-normal text-slate-500">
                  {option.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </OnboardingStepLayout>
  );
}
