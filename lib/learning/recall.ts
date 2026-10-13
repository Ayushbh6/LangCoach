import { fsrs, createEmptyCard, Rating, type Card, type Grade } from "ts-fsrs";
import type { StoredCard } from "./types";
export const engine = fsrs({
  request_retention: 0.9,
  enable_short_term: true,
  learning_steps: ["1m", "10m"],
  relearning_steps: ["10m"],
  enable_fuzz: false,
});
export const ratings = {
  again: Rating.Again,
  hard: Rating.Hard,
  good: Rating.Good,
  easy: Rating.Easy,
};
export function hydrate(stored?: StoredCard, now = Date.now()): Card {
  if (!stored) return createEmptyCard(new Date(now));
  const c = stored.data;
  return {
    ...c,
    due: new Date(stored.due),
    last_review: c.last_review ? new Date(String(c.last_review)) : undefined,
  } as Card;
}
export function review(
  stored: StoredCard | undefined,
  rating: keyof typeof ratings,
  now: number,
  date: string,
): StoredCard {
  const next = engine.next(
    hydrate(stored, now),
    new Date(now),
    ratings[rating] as Grade,
  ).card;
  return {
    data: JSON.parse(JSON.stringify(next)),
    due: next.due.getTime(),
    history: stored?.history ?? "new",
    introduced: stored?.introduced ?? date,
  };
}
// Replay observed ratings only. Legacy dates remain unchanged until the next genuine review.
export function migrateCard(
  row: Record<string, unknown>,
  history: Record<string, unknown>[],
  date: string,
): StoredCard {
  let card = createEmptyCard(new Date(Number(row.updated_at)));
  let usable = 0;
  for (const e of history) {
    if (
      !(String(e.rating) in ratings) ||
      !Number.isFinite(Number(e.reviewed_at))
    )
      continue;
    const when = Number(e.reviewed_at);
    if (card.last_review && when < card.last_review.getTime()) continue;
    card = engine.next(
      card,
      new Date(when),
      ratings[String(e.rating) as keyof typeof ratings] as Grade,
    ).card;
    usable++;
  }
  return {
    data: JSON.parse(JSON.stringify(card)),
    due: Number(row.due),
    history:
      usable > 0 && usable === Number(row.reps) + Number(row.lapses)
        ? "complete"
        : "partial",
    introduced: date,
  };
}
export function normalise(value: string) {
  return value
    .normalize("NFC")
    .trim()
    .toLocaleLowerCase("de-DE")
    .replace(/[.!?,;:]+$/g, "")
    .replace(/\s+/g, " ");
}
export function check(answer: string, expected: string[]) {
  return expected.some((x) => normalise(x) === normalise(answer));
}
