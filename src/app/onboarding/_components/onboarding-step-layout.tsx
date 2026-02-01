"use client";

import Link from "next/link";
import {
  getOnboardingStepIndex,
  onboardingSteps,
} from "@/lib/onboarding/steps";
import { cn } from "@/lib/utils";

type OnboardingStepLayoutProps = {
  stepSlug: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  backHref?: string;
  nextHref?: string;
  nextLabel?: string;
  canProceed?: boolean;
};

export function OnboardingStepLayout({
  stepSlug,
  title,
  subtitle,
  children,
  backHref,
  nextHref,
  nextLabel = "Next step",
  canProceed = true,
}: OnboardingStepLayoutProps) {
  const index = getOnboardingStepIndex(stepSlug);
  const stepNumber = index === -1 ? 1 : index + 1;

  return (
    <section className="space-y-6">
      <div className="rounded-[2.5rem] border-2 border-slate-900 bg-white/70 p-6 shadow-[6px_6px_0px_rgba(15,23,42,0.8)] backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-600">
              Step {stepNumber} of {onboardingSteps.length}
            </p>
            <h2 className="mt-3 text-2xl font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
          </div>
          <span className="rounded-full border-2 border-slate-900 bg-[#f1f5f9] px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] shadow-[3px_3px_0px_rgba(15,23,42,0.7)]">
            {onboardingSteps[index]?.shortTitle ?? "Onboarding"}
          </span>
        </div>

        <div className="mt-6 space-y-6">{children}</div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        {backHref ? (
          <Link
            href={backHref}
            className="rounded-2xl border-2 border-slate-900 bg-white/70 px-5 py-2 text-sm font-semibold shadow-[4px_4px_0px_rgba(15,23,42,0.7)] backdrop-blur"
          >
            Back
          </Link>
        ) : (
          <span />
        )}
        {nextHref ? (
          canProceed ? (
            <Link
              href={nextHref}
              className="rounded-2xl border-2 border-slate-900 bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-[5px_5px_0px_rgba(15,23,42,0.8)]"
            >
              {nextLabel}
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className={cn(
                "rounded-2xl border-2 border-slate-900 bg-white/60 px-6 py-3 text-sm font-semibold text-slate-500 shadow-[5px_5px_0px_rgba(15,23,42,0.5)]",
                "cursor-not-allowed"
              )}
            >
              Complete this step
            </button>
          )
        ) : null}
      </div>
    </section>
  );
}
