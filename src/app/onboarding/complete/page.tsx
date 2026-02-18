"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { OnboardingStepLayout } from "@/app/onboarding/_components/onboarding-step-layout";
import {
  useOnboardingStore,
  areAllStepsValid,
  isStepValid,
} from "@/lib/onboarding/store";
import { onboardingSteps } from "@/lib/onboarding/steps";
import { useEffect, useState } from "react";

export default function CompletePage() {
  const router = useRouter();
  const state = useOnboardingStore();
  const reset = useOnboardingStore((state) => state.reset);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStart = () => {
    reset();
    router.push("/chat/new");
  };

  if (!mounted) {
    return null;
  }

  const allValid = areAllStepsValid(state);
  const missingSteps = onboardingSteps.filter(
    (s) => s.slug !== "complete" && !isStepValid(s.slug, state)
  );

  return (
    <OnboardingStepLayout
      stepSlug="complete"
      title={allValid ? "You're ready to start" : "Almost there"}
      subtitle={
        allValid
          ? "Your plan is queued and the first session is waiting."
          : "Please complete the missing steps to generate your plan."
      }
      backHref="/onboarding/plan"
      nextHref={undefined}
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div
          className={`rounded-3xl border-2 p-6 shadow-[4px_4px_0px_rgba(15,23,42,0.7)] ${
            allValid
              ? "border-slate-900 bg-white/80 dark:border-slate-100 dark:bg-slate-900/80 dark:shadow-[4px_4px_0px_rgba(255,255,255,0.7)]"
              : "border-red-900 bg-red-50 dark:border-red-400 dark:bg-red-900/20"
          }`}
        >
          {allValid ? (
            <>
              <h3 className="text-2xl font-semibold">🎉 Onboarding complete</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                You&apos;ll land in a new chat session where we start your first
                guided conversation and practice plan.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleStart}
                  className="rounded-2xl border-2 border-slate-900 bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-[5px_5px_0px_rgba(15,23,42,0.8)] dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900 dark:shadow-[5px_5px_0px_rgba(255,255,255,0.8)]"
                >
                  Start session
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/home")}
                  className="rounded-2xl border-2 border-slate-900 bg-white/70 px-6 py-3 text-sm font-semibold text-slate-900 shadow-[5px_5px_0px_rgba(15,23,42,0.7)] dark:border-slate-100 dark:bg-slate-900/70 dark:text-slate-100 dark:shadow-[5px_5px_0px_rgba(255,255,255,0.7)]"
                >
                  Back to home
                </button>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-xl font-semibold text-red-900 dark:text-red-100">
                Incomplete steps
              </h3>
              <p className="mt-2 text-sm text-red-800 dark:text-red-200">
                We need a bit more info to build your plan. Please check:
              </p>
              <ul className="mt-4 space-y-3">
                {missingSteps.map((step) => (
                  <li key={step.slug}>
                    <Link
                      href={`/onboarding/${step.slug}`}
                      className="flex items-center gap-2 font-semibold text-red-800 underline underline-offset-4 hover:text-red-950 dark:text-red-200 dark:hover:text-red-100"
                    >
                      <span>→</span>
                      <span>Go to {step.shortTitle}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <button
                  type="button"
                  disabled
                  className="cursor-not-allowed rounded-2xl border-2 border-slate-300 bg-white/50 px-6 py-3 text-sm font-semibold text-slate-400 opacity-70 shadow-none dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-600"
                >
                  Start session
                </button>
              </div>
            </>
          )}
        </div>

        <div className="rounded-3xl border-2 border-slate-900 bg-white/70 p-6 shadow-[4px_4px_0px_rgba(15,23,42,0.7)] dark:border-slate-100 dark:bg-slate-900/70 dark:shadow-[4px_4px_0px_rgba(255,255,255,0.7)]">
          <p className="text-sm font-semibold">Next up</p>
          <ul className="mt-3 space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <li className={allValid ? "opacity-100" : "opacity-50"}>
              ✓ Personal plan saved
            </li>
            <li className={allValid ? "opacity-100" : "opacity-50"}>
              ✓ Voice baseline captured
            </li>
            <li className={allValid ? "opacity-100" : "opacity-50"}>
              ✓ First session generated
            </li>
          </ul>
          <div className="mt-6 rounded-2xl border-2 border-dashed border-slate-400 bg-white/60 p-4 text-sm text-slate-600 dark:border-slate-600 dark:bg-slate-900/40 dark:text-slate-400">
            You can always restart onboarding from the home page.
          </div>
        </div>
      </div>
    </OnboardingStepLayout>
  );
}
