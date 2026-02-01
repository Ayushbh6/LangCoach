"use client";

import { OnboardingStepLayout } from "@/app/onboarding/_components/onboarding-step-layout";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { cn } from "@/lib/utils";

const domains = [
  { id: "daily-life", label: "Daily life", description: "Everyday routines." },
  { id: "work", label: "Work", description: "Meetings and emails." },
  { id: "travel", label: "Travel", description: "Trips and exploration." },
  { id: "relocation", label: "Relocation", description: "New home setup." },
];

const timelines = [
  { id: "30", label: "30 days" },
  { id: "60", label: "60 days" },
  { id: "90", label: "90 days" },
  { id: "custom", label: "Custom" },
];

export default function GoalsPage() {
  const goals = useOnboardingStore((state) => state.goals);
  const setGoals = useOnboardingStore((state) => state.setGoals);

  const customDays = goals.timeline?.startsWith("custom:")
    ? goals.timeline.split(":")[1] ?? ""
    : "";

  return (
    <OnboardingStepLayout
      stepSlug="goals"
      title="Define your learning goals"
      subtitle="Pick the domain and timeline that motivate you most."
      backHref="/onboarding/time"
      nextHref="/onboarding/plan"
      nextLabel="Preview plan"
      canProceed={Boolean(goals.domain && goals.timeline)}
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border-2 border-slate-900 bg-white/80 p-5 shadow-[4px_4px_0px_rgba(15,23,42,0.7)]">
          <p className="text-sm font-semibold">Goal domain</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {domains.map((domain) => (
              <button
                key={domain.id}
                type="button"
                onClick={() => setGoals({ domain: domain.id })}
                className={cn(
                  "rounded-2xl border-2 border-slate-900 px-4 py-3 text-left text-sm font-semibold shadow-[4px_4px_0px_rgba(15,23,42,0.7)]",
                  goals.domain === domain.id
                    ? "bg-slate-900 text-white"
                    : "bg-white/70 text-slate-900"
                )}
              >
                {domain.label}
                <p className="mt-1 text-xs font-normal text-slate-500">
                  {domain.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border-2 border-slate-900 bg-white/70 p-5 shadow-[4px_4px_0px_rgba(15,23,42,0.7)]">
          <p className="text-sm font-semibold">Timeline</p>
          <div className="grid gap-3">
            {timelines.map((timeline) => (
              <button
                key={timeline.id}
                type="button"
                onClick={() =>
                  setGoals({
                    timeline:
                      timeline.id === "custom"
                        ? "custom:"
                        : timeline.id,
                  })
                }
                className={cn(
                  "rounded-2xl border-2 border-slate-900 px-4 py-3 text-left text-sm font-semibold shadow-[4px_4px_0px_rgba(15,23,42,0.7)]",
                  goals.timeline?.startsWith(timeline.id)
                    ? "bg-slate-900 text-white"
                    : "bg-white/70 text-slate-900"
                )}
              >
                {timeline.label}
              </button>
            ))}
          </div>

          {goals.timeline?.startsWith("custom") && (
            <div className="rounded-2xl border-2 border-dashed border-slate-400 bg-white/60 p-4">
              <label className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                Custom days
              </label>
              <input
                type="number"
                min={1}
                placeholder="e.g. 45"
                value={customDays}
                onChange={(event) =>
                  setGoals({ timeline: `custom:${event.target.value}` })
                }
                className="mt-2 w-full rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm font-semibold text-slate-900"
              />
            </div>
          )}
        </div>
      </div>
    </OnboardingStepLayout>
  );
}
