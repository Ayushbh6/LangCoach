"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getOnboardingStepIndex,
  onboardingSteps,
} from "@/lib/onboarding/steps";
import { cn } from "@/lib/utils";

export function OnboardingStepper() {
  const pathname = usePathname();
  const slug = pathname.split("/").pop() ?? onboardingSteps[0].slug;
  const activeIndex = getOnboardingStepIndex(slug);
  const stepNumber = activeIndex === -1 ? 1 : activeIndex + 1;

  return (
    <div className="rounded-[2rem] border-2 border-slate-900 bg-white/60 p-5 shadow-[5px_5px_0px_rgba(15,23,42,0.8)] backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-600">
            Step {stepNumber} of {onboardingSteps.length}
          </p>
          <h2 className="mt-2 text-lg font-semibold">
            {onboardingSteps[Math.max(activeIndex, 0)]?.title ??
              "Onboarding"}
          </h2>
        </div>
        <span className="rounded-full border-2 border-slate-900 bg-[#ffe08a] px-3 py-1 text-xs font-semibold shadow-[3px_3px_0px_rgba(15,23,42,0.7)]">
          Deep-link ready
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        {onboardingSteps.map((step, index) => {
          const status =
            index < activeIndex
              ? "complete"
              : index === activeIndex
                ? "active"
                : "upcoming";

          return (
            <Link
              key={step.slug}
              href={`/onboarding/${step.slug}`}
              className={cn(
                "flex items-center gap-3 rounded-2xl border-2 border-slate-900 px-3 py-2 text-sm font-semibold shadow-[3px_3px_0px_rgba(15,23,42,0.7)] transition",
                status === "active" && "bg-slate-900 text-white",
                status === "complete" &&
                  "bg-emerald-100 text-emerald-900",
                status === "upcoming" && "bg-white/70 text-slate-700"
              )}
            >
              <span
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-xl border-2 border-slate-900 text-xs",
                  status === "active" && "bg-white text-slate-900",
                  status === "complete" && "bg-emerald-200 text-emerald-900",
                  status === "upcoming" && "bg-white text-slate-900"
                )}
              >
                {index + 1}
              </span>
              <span className="truncate">{step.shortTitle}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
