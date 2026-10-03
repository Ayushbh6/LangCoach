export type Rating = "again" | "hard" | "good" | "easy";
export type Progress = { cardId: string; due: number; interval: number; ease: number; reps: number; lapses: number; state: string; updatedAt: number };
export const DAY = 86400000;
// A small, transparent SM-2-inspired scheduler, not Anki's FSRS implementation.
export function schedule(previous: Progress | undefined, rating: Rating, now: number): Omit<Progress, "cardId"> {
  const p = previous ?? { interval: 0, ease: 2.5, reps: 0, lapses: 0, state: "new" };
  let interval = p.interval, ease = p.ease, reps = p.reps, lapses = p.lapses, state = "review", delay = 0;
  if (rating === "again") {
    interval = 0; ease = Math.max(1.3, ease - .2); reps = 0;
    lapses += previous ? 1 : 0; state = "learning"; delay = 60000;
  } else if (rating === "hard") {
    ease = Math.max(1.3, ease - .15);
    if (p.interval < 1) { state = "learning"; interval = 0; delay = 360000; }
    else { interval = Math.max(1, p.interval * 1.2); delay = interval * DAY; reps += 1; }
  } else if (rating === "good") {
    interval = p.interval < 1 ? 1 : p.reps < 2 ? 6 : Math.max(1, p.interval * ease);
    reps += 1; delay = interval * DAY;
  } else {
    interval = p.interval < 1 ? 4 : Math.max(4, p.interval * ease * 1.3);
    ease += .15; reps += 1; delay = interval * DAY;
  }
  return { due: now + Math.round(delay), interval, ease, reps, lapses, state, updatedAt: now };
}
export function intervalLabel(previous: Progress | undefined, rating: Rating, now: number) {
  const delta = schedule(previous, rating, now).due - now;
  if (delta < 3600000) return `${Math.round(delta / 60000)} min`;
  const days = Math.round(delta / DAY);
  return days === 1 ? "1 day" : `${days} days`;
}
