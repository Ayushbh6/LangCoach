"use client";

import { OnboardingStepLayout } from "@/app/onboarding/_components/onboarding-step-layout";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { cn } from "@/lib/utils";

export default function AssessmentPage() {
  const assessmentChoice = useOnboardingStore(
    (state) => state.assessmentChoice
  );
  const setAssessmentChoice = useOnboardingStore(
    (state) => state.setAssessmentChoice
  );

  return (
    <OnboardingStepLayout
      stepSlug="assessment"
      title="Review your assessment"
      subtitle="Here is a preview of what the analysis will return."
      backHref="/onboarding/voice-sample"
      nextHref="/onboarding/time"
      nextLabel="Continue to schedule"
      canProceed={Boolean(assessmentChoice)}
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border-2 border-slate-900 bg-white/80 p-5 shadow-[4px_4px_0px_rgba(15,23,42,0.7)]">
          <p className="text-sm font-semibold">Suggested level</p>
          <h3 className="mt-2 text-3xl font-semibold">A2 — Elementary</h3>
          <p className="mt-2 text-sm text-slate-600">
            Clear sentence structure with steady pacing. Pronunciation is strong
            on vowels, and vocabulary is consistent for everyday topics.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { label: "Pronunciation", value: "4.2 / 5" },
              { label: "Fluency", value: "92 wpm" },
              { label: "Grammar", value: "Solid patterns" },
              { label: "Vocab range", value: "Everyday + travel" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border-2 border-slate-900 bg-white/70 p-3 text-sm shadow-[3px_3px_0px_rgba(15,23,42,0.7)]"
              >
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                  {item.label}
                </p>
                <p className="mt-1 font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border-2 border-slate-900 bg-white/70 p-5 shadow-[4px_4px_0px_rgba(15,23,42,0.7)]">
          <p className="text-sm font-semibold">Is this accurate?</p>
          <button
            type="button"
            onClick={() => setAssessmentChoice("accept")}
            className={cn(
              "w-full rounded-2xl border-2 border-slate-900 px-4 py-3 text-left text-sm font-semibold shadow-[4px_4px_0px_rgba(15,23,42,0.7)]",
              assessmentChoice === "accept"
                ? "bg-slate-900 text-white"
                : "bg-white/70 text-slate-900"
            )}
          >
            Accept the recommendation
            <p className="mt-1 text-xs font-normal text-slate-500">
              We&apos;ll tailor the plan to this level.
            </p>
          </button>
          <button
            type="button"
            onClick={() => setAssessmentChoice("adjust")}
            className={cn(
              "w-full rounded-2xl border-2 border-slate-900 px-4 py-3 text-left text-sm font-semibold shadow-[4px_4px_0px_rgba(15,23,42,0.7)]",
              assessmentChoice === "adjust"
                ? "bg-slate-900 text-white"
                : "bg-white/70 text-slate-900"
            )}
          >
            I want to adjust it
            <p className="mt-1 text-xs font-normal text-slate-500">
              We&apos;ll ask for a quick correction later.
            </p>
          </button>
        </div>
      </div>
    </OnboardingStepLayout>
  );
}
