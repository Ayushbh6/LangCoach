"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { OnboardingStepper } from "@/app/onboarding/_components/onboarding-stepper";

export function OnboardingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fff3db] text-slate-900">
      <div className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute -left-24 -top-16 h-56 w-56 rounded-full bg-[#ff8a5b]/50 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-8 h-72 w-72 rounded-full bg-[#7a7dff]/40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#6ee7b7]/30 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-slate-900 bg-[#fff4e8] shadow-[4px_4px_0px_rgba(15,23,42,0.8)]">
              <span className="text-lg">🧠</span>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-600">
                Language Coach
              </p>
              <h1 className="text-xl font-semibold">Onboarding</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/home"
              className="rounded-full border-2 border-slate-900 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] shadow-[3px_3px_0px_rgba(15,23,42,0.7)] backdrop-blur"
            >
              Back home
            </Link>
            <ThemeToggle />
          </div>
        </header>

        <div className="mt-8">
          <OnboardingStepper />
        </div>

        <main className="mt-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
