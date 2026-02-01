"use client";

import { OnboardingStepLayout } from "@/app/onboarding/_components/onboarding-step-layout";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { cn } from "@/lib/utils";

const daysOptions = [3, 4, 5, 6];
const timeOptions = ["Morning", "Afternoon", "Evening"];

export default function TimePage() {
  const timeCommitment = useOnboardingStore((state) => state.timeCommitment);
  const setTimeCommitment = useOnboardingStore(
    (state) => state.setTimeCommitment
  );

  return (
    <OnboardingStepLayout
      stepSlug="time"
      title="Set your weekly rhythm"
      subtitle="Choose how long and how often you want to train."
      backHref="/onboarding/assessment"
      nextHref="/onboarding/goals"
      nextLabel="Continue to goals"
      canProceed={Boolean(timeCommitment.daysPerWeek)}
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border-2 border-slate-900 bg-white/80 p-5 shadow-[4px_4px_0px_rgba(15,23,42,0.7)]">
          <p className="text-sm font-semibold">Session length</p>
          <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
            <span>20 min</span>
            <span className="rounded-full border-2 border-slate-900 bg-white px-3 py-1 text-xs font-semibold">
              {timeCommitment.sessionLength} min
            </span>
            <span>45 min</span>
          </div>
          <input
            type="range"
            min={20}
            max={45}
            step={5}
            value={timeCommitment.sessionLength}
            onChange={(event) =>
              setTimeCommitment({
                sessionLength: Number(event.target.value),
              })
            }
            className="mt-3 w-full accent-slate-900"
          />

          <div className="mt-6">
            <p className="text-sm font-semibold">Days per week</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {daysOptions.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setTimeCommitment({ daysPerWeek: day })}
                  className={cn(
                    "rounded-2xl border-2 border-slate-900 px-4 py-2 text-sm font-semibold shadow-[4px_4px_0px_rgba(15,23,42,0.7)]",
                    timeCommitment.daysPerWeek === day
                      ? "bg-slate-900 text-white"
                      : "bg-white/70 text-slate-900"
                  )}
                >
                  {day} days
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border-2 border-slate-900 bg-white/70 p-5 shadow-[4px_4px_0px_rgba(15,23,42,0.7)]">
          <p className="text-sm font-semibold">Preferred time (optional)</p>
          <div className="grid gap-3">
            {timeOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setTimeCommitment({ preferredTime: option })}
                className={cn(
                  "rounded-2xl border-2 border-slate-900 px-4 py-3 text-left text-sm font-semibold shadow-[4px_4px_0px_rgba(15,23,42,0.7)]",
                  timeCommitment.preferredTime === option
                    ? "bg-slate-900 text-white"
                    : "bg-white/70 text-slate-900"
                )}
              >
                {option}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setTimeCommitment({ preferredTime: null })}
              className="rounded-2xl border-2 border-dashed border-slate-400 bg-white/50 px-4 py-3 text-left text-sm font-semibold text-slate-600"
            >
              No preference
            </button>
          </div>

          <div className="rounded-2xl border-2 border-slate-900 bg-white/70 p-4 text-sm shadow-[3px_3px_0px_rgba(15,23,42,0.7)]">
            Weekly commitment:{" "}
            <span className="font-semibold">
              {timeCommitment.sessionLength * timeCommitment.daysPerWeek} min
            </span>
          </div>
        </div>
      </div>
    </OnboardingStepLayout>
  );
}
