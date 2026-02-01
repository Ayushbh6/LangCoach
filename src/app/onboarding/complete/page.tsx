"use client";

import { useRouter } from "next/navigation";
import { OnboardingStepLayout } from "@/app/onboarding/_components/onboarding-step-layout";
import { useOnboardingStore } from "@/lib/onboarding/store";

export default function CompletePage() {
  const router = useRouter();
  const reset = useOnboardingStore((state) => state.reset);

  const handleStart = () => {
    reset();
    router.push("/chat/new");
  };

  return (
    <OnboardingStepLayout
      stepSlug="complete"
      title="You&apos;re ready to start"
      subtitle="Your plan is queued and the first session is waiting."
      backHref="/onboarding/plan"
      nextHref={undefined}
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border-2 border-slate-900 bg-white/80 p-6 shadow-[4px_4px_0px_rgba(15,23,42,0.7)]">
          <h3 className="text-2xl font-semibold">🎉 Onboarding complete</h3>
          <p className="mt-2 text-sm text-slate-600">
            You&apos;ll land in a new chat session where we start your first
            guided conversation and practice plan.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleStart}
              className="rounded-2xl border-2 border-slate-900 bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-[5px_5px_0px_rgba(15,23,42,0.8)]"
            >
              Start session
            </button>
            <button
              type="button"
              onClick={() => router.push("/home")}
              className="rounded-2xl border-2 border-slate-900 bg-white/70 px-6 py-3 text-sm font-semibold text-slate-900 shadow-[5px_5px_0px_rgba(15,23,42,0.7)]"
            >
              Back to home
            </button>
          </div>
        </div>

        <div className="rounded-3xl border-2 border-slate-900 bg-white/70 p-6 shadow-[4px_4px_0px_rgba(15,23,42,0.7)]">
          <p className="text-sm font-semibold">Next up</p>
          <ul className="mt-3 space-y-3 text-sm text-slate-600">
            <li>✓ Personal plan saved</li>
            <li>✓ Voice baseline captured</li>
            <li>✓ First session generated</li>
          </ul>
          <div className="mt-6 rounded-2xl border-2 border-dashed border-slate-400 bg-white/60 p-4 text-sm text-slate-600">
            You can always restart onboarding from the home page.
          </div>
        </div>
      </div>
    </OnboardingStepLayout>
  );
}
