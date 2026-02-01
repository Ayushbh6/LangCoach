"use client";

import { OnboardingStepLayout } from "@/app/onboarding/_components/onboarding-step-layout";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { cn } from "@/lib/utils";

const languages = [
  {
    id: "german",
    label: "German",
    description: "Great for work, relocation, and EU travel.",
    badge: "🇩🇪",
  },
  {
    id: "french",
    label: "French",
    description: "Perfect for global work and culture.",
    badge: "🇫🇷",
  },
  {
    id: "spanish",
    label: "Spanish",
    description: "Essential for travel and daily conversation.",
    badge: "🇪🇸",
  },
];

export default function LanguagePage() {
  const language = useOnboardingStore((state) => state.language);
  const setLanguage = useOnboardingStore((state) => state.setLanguage);

  return (
    <OnboardingStepLayout
      stepSlug="language"
      title="Choose your target language"
      subtitle="Pick the language you want to speak confidently every day."
      backHref="/home"
      nextHref="/onboarding/level"
      nextLabel="Continue to level"
      canProceed={Boolean(language)}
    >
      <div className="grid gap-4 md:grid-cols-3">
        {languages.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setLanguage(item.id)}
            className={cn(
              "flex h-full flex-col rounded-3xl border-2 border-slate-900 p-4 text-left shadow-[4px_4px_0px_rgba(15,23,42,0.7)] transition",
              language === item.id
                ? "bg-slate-900 text-white"
                : "bg-white/70 text-slate-900"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">{item.label}</span>
              <span className="text-xl">{item.badge}</span>
            </div>
            <p
              className={cn(
                "mt-3 text-sm",
                language === item.id ? "text-white/80" : "text-slate-600"
              )}
            >
              {item.description}
            </p>
            <span
              className={cn(
                "mt-4 inline-flex w-fit rounded-full border-2 border-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]",
                language === item.id
                  ? "bg-white text-slate-900"
                  : "bg-[#ffe08a]"
              )}
            >
              Select
            </span>
          </button>
        ))}
      </div>
    </OnboardingStepLayout>
  );
}
