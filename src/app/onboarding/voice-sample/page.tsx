"use client";

import { OnboardingStepLayout } from "@/app/onboarding/_components/onboarding-step-layout";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { cn } from "@/lib/utils";

export default function VoiceSamplePage() {
  const voiceSampleRecorded = useOnboardingStore(
    (state) => state.voiceSampleRecorded
  );
  const setVoiceSampleRecorded = useOnboardingStore(
    (state) => state.setVoiceSampleRecorded
  );

  return (
    <OnboardingStepLayout
      stepSlug="voice-sample"
      title="Record a quick voice sample"
      subtitle="We use a short clip to tune your plan and speaking feedback."
      backHref="/onboarding/level"
      nextHref="/onboarding/assessment"
      nextLabel="Analyze sample"
      canProceed={voiceSampleRecorded}
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border-2 border-slate-900 bg-white/80 p-5 shadow-[4px_4px_0px_rgba(15,23,42,0.7)]">
          <p className="text-sm font-semibold">Prompt</p>
          <p className="mt-2 text-sm text-slate-600">
            Speak for 60–90 seconds about your day, your goals, or a recent
            experience. Natural speech helps us estimate pronunciation,
            fluency, and vocabulary range.
          </p>
          <div className="mt-4 rounded-2xl border-2 border-dashed border-slate-400 bg-white/60 p-4 text-sm text-slate-600">
            Recording UI will live here (waveform + timer + playback).
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border-2 border-slate-900 bg-white/70 p-5 shadow-[4px_4px_0px_rgba(15,23,42,0.7)]">
          <p className="text-sm font-semibold">Recording status</p>
          <div
            className={cn(
              "rounded-2xl border-2 border-slate-900 p-4 text-sm font-semibold shadow-[3px_3px_0px_rgba(15,23,42,0.7)]",
              voiceSampleRecorded
                ? "bg-emerald-100 text-emerald-900"
                : "bg-[#ffe08a] text-slate-900"
            )}
          >
            {voiceSampleRecorded
              ? "Sample captured — ready to analyze."
              : "No sample yet. Tap record to continue."}
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setVoiceSampleRecorded(true)}
              className="rounded-2xl border-2 border-slate-900 bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-[4px_4px_0px_rgba(15,23,42,0.8)]"
            >
              Mark sample recorded
            </button>
            <button
              type="button"
              onClick={() => setVoiceSampleRecorded(false)}
              className="rounded-2xl border-2 border-slate-900 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 shadow-[4px_4px_0px_rgba(15,23,42,0.7)]"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </OnboardingStepLayout>
  );
}
