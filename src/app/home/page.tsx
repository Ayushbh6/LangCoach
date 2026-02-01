import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const highlights = [
  {
    title: "Guided onboarding",
    description:
      "A multi-step setup that blends quick choices with deeper voice analysis.",
  },
  {
    title: "Personalized plans",
    description:
      "A weekly path tuned to your level, time, and goals once onboarding ends.",
  },
  {
    title: "Progress that feels good",
    description:
      "Soft neo-brutal visuals with glassy depth to keep focus high.",
  },
];

const quickStats = [
  { label: "Avg session", value: "25–35 min" },
  { label: "Skill focus", value: "Speaking + fluency" },
  { label: "Plan cadence", value: "3–6 days/week" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fef2da] text-slate-900">
      <div className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute -left-32 -top-24 h-64 w-64 rounded-full bg-[#ff8a5b]/60 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-[#7a7dff]/40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#6ee7b7]/40 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-slate-900 bg-[#fff4e8] shadow-[4px_4px_0px_rgba(15,23,42,0.8)]">
              <span className="text-xl">🗣️</span>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-600">
                Language Coach
              </p>
              <h1 className="text-2xl font-semibold">Speaking-first coaching</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/settings"
              className="rounded-full border-2 border-slate-900 bg-white/70 px-4 py-2 text-sm font-semibold shadow-[3px_3px_0px_rgba(15,23,42,0.7)] backdrop-blur"
            >
              Provider settings
            </Link>
            <ThemeToggle />
          </div>
        </header>

        <section className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-700 shadow-[3px_3px_0px_rgba(15,23,42,0.7)] backdrop-blur">
              2026-ready onboarding
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-semibold leading-tight md:text-5xl">
                Start with a smooth setup, then jump into real conversation.
              </h2>
              <p className="text-base text-slate-700 md:text-lg">
                Blend bold neo-brutal shapes with soft glass layers so every
                step feels tactile, clear, and premium — from first tap to your
                first session.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/onboarding/language"
                className="rounded-2xl border-2 border-slate-900 bg-[#111827] px-6 py-3 text-sm font-semibold text-white shadow-[5px_5px_0px_rgba(15,23,42,0.8)]"
              >
                Start onboarding
              </Link>
              <Link
                href="/chat/new"
                className="rounded-2xl border-2 border-slate-900 bg-white/70 px-6 py-3 text-sm font-semibold text-slate-900 shadow-[5px_5px_0px_rgba(15,23,42,0.8)] backdrop-blur"
              >
                Continue plan
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {quickStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border-2 border-slate-900 bg-white/70 px-4 py-3 shadow-[4px_4px_0px_rgba(15,23,42,0.7)] backdrop-blur"
                >
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-600">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-[2.5rem] border-2 border-slate-900 bg-white/60 p-6 shadow-[6px_6px_0px_rgba(15,23,42,0.8)] backdrop-blur">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">What you&apos;ll build</h3>
              <span className="rounded-full border-2 border-slate-900 bg-[#ffe08a] px-3 py-1 text-xs font-semibold shadow-[3px_3px_0px_rgba(15,23,42,0.7)]">
                Live MVP
              </span>
            </div>
            <div className="grid gap-4">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border-2 border-slate-900 bg-white/80 p-4 shadow-[4px_4px_0px_rgba(15,23,42,0.7)]"
                >
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="mt-2 text-sm text-slate-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
