import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type TimeCommitment = {
  sessionLength: number;
  daysPerWeek: number;
  preferredTime: string | null;
};

type GoalsState = {
  domain: string | null;
  timeline: string | null;
};

export type OnboardingState = {
  language: string | null;
  level: string | null;
  voiceSampleRecorded: boolean;
  assessmentChoice: "accept" | "adjust" | null;
  timeCommitment: TimeCommitment;
  goals: GoalsState;
  planIntensity: "light" | "standard" | "intense" | null;
  setLanguage: (language: string) => void;
  setLevel: (level: string) => void;
  setVoiceSampleRecorded: (recorded: boolean) => void;
  setAssessmentChoice: (choice: "accept" | "adjust") => void;
  setTimeCommitment: (data: Partial<TimeCommitment>) => void;
  setGoals: (data: Partial<GoalsState>) => void;
  setPlanIntensity: (intensity: "light" | "standard" | "intense") => void;
  reset: () => void;
};

const initialState = {
  language: null,
  level: null,
  voiceSampleRecorded: false,
  assessmentChoice: null,
  timeCommitment: {
    sessionLength: 30,
    daysPerWeek: 4,
    preferredTime: null,
  },
  goals: {
    domain: null,
    timeline: null,
  },
  planIntensity: null,
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...initialState,
      setLanguage: (language) => set({ language }),
      setLevel: (level) => set({ level }),
      setVoiceSampleRecorded: (recorded) =>
        set({ voiceSampleRecorded: recorded }),
      setAssessmentChoice: (choice) => set({ assessmentChoice: choice }),
      setTimeCommitment: (data) =>
        set((state) => ({
          timeCommitment: { ...state.timeCommitment, ...data },
        })),
      setGoals: (data) =>
        set((state) => ({
          goals: { ...state.goals, ...data },
        })),
      setPlanIntensity: (intensity) => set({ planIntensity: intensity }),
      reset: () => set(initialState),
    }),
    {
      name: "lc-onboarding-v1",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        language: state.language,
        level: state.level,
        voiceSampleRecorded: state.voiceSampleRecorded,
        assessmentChoice: state.assessmentChoice,
        timeCommitment: state.timeCommitment,
        goals: state.goals,
        planIntensity: state.planIntensity,
      }),
    }
  )
);
