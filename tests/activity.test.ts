import { test } from "node:test";
import assert from "node:assert/strict";
import { buildActivity, shiftDate } from "../lib/learning/activity";
import type { Evidence, Observation } from "../lib/learning/types";
const now = Date.parse("2026-10-13T12:00:00Z");
function attempt(id: string, time: string) {
  return { evidence: { id, time: Date.parse(time), skill: "grammar", target: "articles", result: "incorrect", independent: false, supports: ["hint"] } as Evidence };
}
function conversation(source: Observation["source"], date: string, observations = true) {
  return { observation: { sessionId: "talk-1", baseVersion: 0, occurredAt: date, summary: "Practised shopping", observations: observations ? [{ skill: "speaking", target: "shopping", observation: "Needed a hint", support: "hint" }] : [], nextTargets: [], source } as Observation };
}
test("Vienna midnight, supported attempts and duplicate retries", () => {
  const e = attempt("one", "2026-10-12T22:10:00Z");
  const a = buildActivity([e, e], [], now);
  assert.equal(a.days[0].date, "2026-10-13");
  assert.equal(a.days[0].attempts, 1);
  assert.equal(a.currentStreak, 1);
});
test("yesterday keeps current streak alive; gaps reset it but preserve best", () => {
  const events = [8,9,10,12].map(d => attempt(`${d}`, `2026-10-${d.toString().padStart(2,"0")}T12:00:00Z`));
  const a = buildActivity(events, [], now);
  assert.equal(a.activeDays, 4);
  assert.equal(a.currentStreak, 1);
  assert.equal(a.bestStreak, 3);
  assert.equal(a.weekDays, 1);
  assert.equal(buildActivity(events, [], Date.parse("2026-10-14T12:00:00Z")).currentStreak, 0);
});
test("conversation uses occurrence day, excludes profile reports and empty summaries", () => {
  const talk = conversation("conversation observation", "2026-10-11T12:00:00Z");
  const a = buildActivity([{}, conversation("learner report", "2026-10-13T10:00:00Z"), conversation("conversation observation", "2026-10-13T10:00:00Z", false), talk, talk], [], now);
  assert.equal(a.activeDays, 1);
  assert.equal(a.days[0].date, "2026-10-11");
  assert.equal(a.days[0].conversations, 1);
  assert.equal(a.days[0].attempts, 0);
  assert.equal(a.currentStreak, 0);
});
test("legacy history counts without inventing skills or scenarios, future timestamps ignored", () => {
  const review = {request_id: "old", reviewed_at: Date.parse("2024-02-29T12:00:00Z")};
  const a = buildActivity([attempt("future", "2027-01-01T00:00:00Z")], [review, review], now);
  assert.equal(a.activeDays, 1);
  assert.equal(a.days[0].reviews, 1);
  assert.deepEqual(a.days[0].skills, []);
});
test("streaks cross month, year and both daylight-saving boundaries", () => {
  for (const dates of [["2026-03-28", "2026-03-29", "2026-03-30"], ["2026-10-24", "2026-10-25", "2026-10-26"], ["2026-12-31", "2027-01-01", "2027-01-02"]]) {
    const events = dates.map(d => attempt(d, `${d}T12:00:00Z`));
    const a = buildActivity(events, [], Date.parse(`${dates[2]}T13:00:00Z`));
    assert.equal(a.currentStreak, 3);
    assert.equal(a.bestStreak, 3);
    assert.equal(shiftDate(dates[0], 2), dates[2]);
  }
});
test("empty history has zero counts", () => {
  const a = buildActivity([], [], now);
  assert.equal(a.activeDays, 0);
  assert.equal(a.bestStreak, 0);
  assert.equal(a.currentStreak, 0);
});
