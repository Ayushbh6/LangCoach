import { OnboardingShell } from "@/app/onboarding/_components/onboarding-shell";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OnboardingShell>{children}</OnboardingShell>;
}
