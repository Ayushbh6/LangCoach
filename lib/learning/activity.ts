import { studyDate, type Evidence, type Observation, type Session } from "./types";

export type ActivityDay = {
  date: string;
  attempts: number;
  reviews: number;
  conversations: number;
  skills: string[];
  targets: string[];
  scenarios: string[];
  summaries: string[];
};
export type Activity = {
  timezone: "Europe/Vienna";
  today: string;
  activeDays: number;
  currentStreak: number;
  bestStreak: number;
  weekDays: number;
  days: ActivityDay[];
};
type ActivityEvent = {
  evidence?: Evidence;
  observation?: Observation;
  session?: Session;
};
type LegacyReview = { request_id: string; reviewed_at: number };
// Calendar arithmetic uses UTC dates, never elapsed local 24-hour periods (DST).
export function shiftDate(date: string, offset: number) {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + offset);
  return value.toISOString().slice(0, 10);
}
export function buildActivity(events: ActivityEvent[], reviews: LegacyReview[], now = Date.now()): Activity {
  const today = studyDate(now);
  const days = new Map<string, ActivityDay>();
  const sessions = new Map(events.filter(e => e.session).map(e => [e.session!.id, e.session!]));
  function day(time: number) {
    if (!Number.isFinite(time) || time > now) return null;
    const date = studyDate(time);
    if (!days.has(date)) days.set(date, {
      date, attempts: 0, reviews: 0, conversations: 0,
      skills: [], targets: [], scenarios: [], summaries: [],
    });
    return days.get(date)!;
  }
  function add(list: string[], value: string) {
    if (value && !list.includes(value)) list.push(value);
  }
  const seen = new Set<string>();
  for (const event of events) {
    const e = event.evidence;
    if (e && !seen.has(`attempt:${e.id}`)) {
      seen.add(`attempt:${e.id}`);
      const d = day(e.time);
      if (d) {
        d.attempts++;
        if (e.cardId) d.reviews++;
        add(d.skills, e.skill);
        add(d.targets, e.target);
        const session = sessions.get(e.sessionId);
        if (session) add(d.scenarios, session.lesson.germanTitle);
      }
    }
    const o = event.observation;
    if (o?.source === "conversation observation" && o.observations.length && !seen.has(`conversation:${o.sessionId}`)) {
      seen.add(`conversation:${o.sessionId}`);
      const d = day(Date.parse(o.occurredAt));
      if (d) {
        d.conversations++;
        add(d.summaries, o.summary);
        for (const item of o.observations) {
          add(d.skills, item.skill);
          add(d.targets, item.target);
        }
      }
    }
  }
  for (const review of reviews) {
    if (seen.has(`legacy:${review.request_id}`)) continue;
    seen.add(`legacy:${review.request_id}`);
    const d = day(Number(review.reviewed_at));
    if (d) {
      d.attempts++;
      d.reviews++;
      add(d.scenarios, "Earlier flashcard practice");
    }
  }
  const sorted = [...days.values()].sort((a, b) => a.date.localeCompare(b.date));
  let bestStreak = 0, run = 0, previous = "";
  for (const d of sorted) {
    run = previous && shiftDate(previous, 1) === d.date ? run + 1 : 1;
    bestStreak = Math.max(bestStreak, run);
    previous = d.date;
  }
  let cursor = days.has(today) ? today : shiftDate(today, -1);
  let currentStreak = 0;
  while (days.has(cursor)) { currentStreak++; cursor = shiftDate(cursor, -1); }
  const weekday = new Date(`${today}T12:00:00Z`).getUTCDay();
  const monday = shiftDate(today, -((weekday + 6) % 7));
  return {
    timezone: "Europe/Vienna", today, activeDays: sorted.length, currentStreak, bestStreak,
    weekDays: sorted.filter(d => d.date >= monday).length, days: sorted,
  };
}
