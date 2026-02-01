export type OnboardingStep = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
};

export const onboardingSteps: OnboardingStep[] = [
  {
    slug: "language",
    title: "Choose your language",
    shortTitle: "Language",
    description: "Pick the language you want to master.",
  },
  {
    slug: "level",
    title: "Self-assess your level",
    shortTitle: "Level",
    description: "Tell us where you are right now.",
  },
  {
    slug: "voice-sample",
    title: "Record a voice sample",
    shortTitle: "Voice",
    description: "Capture a quick baseline clip.",
  },
  {
    slug: "assessment",
    title: "Review your assessment",
    shortTitle: "Assessment",
    description: "Confirm or adjust our recommendation.",
  },
  {
    slug: "time",
    title: "Set your weekly rhythm",
    shortTitle: "Time",
    description: "Pick session length and frequency.",
  },
  {
    slug: "goals",
    title: "Define your goals",
    shortTitle: "Goals",
    description: "Choose domains and timeline.",
  },
  {
    slug: "plan",
    title: "Preview your plan",
    shortTitle: "Plan",
    description: "Tune intensity before you start.",
  },
  {
    slug: "complete",
    title: "Onboarding complete",
    shortTitle: "Complete",
    description: "Jump into your first session.",
  },
];

export const getOnboardingStepIndex = (slug: string) =>
  onboardingSteps.findIndex((step) => step.slug === slug);

export const getOnboardingStepBySlug = (slug: string) =>
  onboardingSteps.find((step) => step.slug === slug);

export const getNextOnboardingStepSlug = (slug: string) => {
  const index = getOnboardingStepIndex(slug);
  if (index === -1 || index >= onboardingSteps.length - 1) {
    return null;
  }
  return onboardingSteps[index + 1].slug;
};

export const getPrevOnboardingStepSlug = (slug: string) => {
  const index = getOnboardingStepIndex(slug);
  if (index <= 0) {
    return null;
  }
  return onboardingSteps[index - 1].slug;
};
