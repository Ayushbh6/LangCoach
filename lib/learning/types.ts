export type Skill =
  | "recognition"
  | "production"
  | "grammar"
  | "reading"
  | "listening"
  | "writing"
  | "speaking";
export type Block =
  | "recall"
  | "scenario"
  | "reading"
  | "listening"
  | "writing"
  | "later"
  | "conversation";
export type Exercise = {
  id: string;
  version: number;
  target: string;
  skill: Skill;
  prompt: string;
  answer: string[];
  explanation: string;
  hint: string;
  context?: string;
  transcript?: string;
  audio?: string;
  fresh?: boolean;
  transfer?: boolean;
  kind?: "constrained" | "open";
  model?: string;
};
export type Lesson = {
  id: string;
  version: number;
  title: string;
  germanTitle: string;
  outcome: string;
  scene: string;
  dialogue: string[];
  pattern: string;
  examples: string[];
  words: { german: string; english: string; note?: string }[];
  exercises: Exercise[];
  mission: string;
};
export type Settings = {
  minutes: number;
  audio: "silent" | "headphones";
  order: Block[];
  newLimit: number;
  goal: string;
  preparation: boolean;
};
export type StoredCard = {
  data: Record<string, unknown>;
  due: number;
  history: "complete" | "partial" | "new";
  introduced: string;
};
export type Task = Exercise & {
  block: Block;
  cardId?: string;
  cardVersion?: number;
  scheduled?: boolean;
  repair?: boolean;
  supports: string[];
  audioPlayed?: boolean;
  attemptNumber: number;
};
export type Session = {
  id: string;
  createdAt: number;
  lesson: Lesson;
  minutes: number;
  audio: Settings["audio"];
  tasks: Task[];
  index: number;
  failures: Record<string, number>;
  complete: boolean;
  lastFeedback?: Feedback;
  blockOrder: Block[];
};
export type Feedback = {
  result: "correct" | "incorrect" | "pending" | "self-rated";
  answer: string;
  explanation: string;
  independent: boolean;
  nextDue?: number;
  replayed?: boolean;
  recorded: true;
};
export type State = {
  settings: Settings;
  cards: Record<string, StoredCard>;
  session?: Session;
  pausedSessions?: Session[];
  priorities: string[];
  lesson?: Lesson;
  lessonDate?: string;
  migrated: boolean;
  version: number;
  updatedAt: number;
  introduced: Record<string, string[]>;
};
export type Evidence = {
  id: string;
  sessionId: string;
  exerciseId: string;
  exerciseVersion: number;
  target: string;
  skill: Skill;
  answer: string;
  result: Feedback["result"];
  independent: boolean;
  supports: string[];
  audioPlayed: boolean;
  time: number;
  intervalMs: number | null;
  fresh: boolean;
  transfer: boolean;
  repair: boolean;
  source: string;
  rating?: string;
  cardId?: string;
  scheduled?: boolean;
  feedback: Feedback;
};
export type Observation = {
  sessionId: string;
  baseVersion: number;
  occurredAt: string;
  summary: string;
  observations: {
    skill: Skill;
    target: string;
    observation: string;
    support: string;
  }[];
  nextTargets: string[];
  source: "conversation observation" | "learner report";
  pronunciationAssessed?: false;
};
export const defaultSettings: Settings = {
  minutes: 10,
  audio: "headphones",
  order: [
    "recall",
    "scenario",
    "reading",
    "listening",
    "writing",
    "later",
    "conversation",
  ],
  newLimit: 5,
  goal: "Independent everyday German, then Goethe B1. Target: March–April 2027; readiness depends on evidence.",
  preparation: false,
};
export function studyDate(time = Date.now()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Vienna",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(time);
}
