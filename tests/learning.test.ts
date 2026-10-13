import { test } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { readFileSync, readdirSync } from "node:fs";
import * as service from "../lib/learning/service";
import { defaultSettings, studyDate, type State } from "../lib/learning/types";
import { lessons } from "../data/lessons";
import { review, migrateCard } from "../lib/learning/recall";
function fixture() {
  const sqlite = new DatabaseSync(":memory:");
  for (const file of readdirSync("drizzle")
    .filter((x) => x.endsWith(".sql"))
    .sort())
    sqlite.exec(readFileSync(`drizzle/${file}`, "utf8"));
  const wrap = (sql: string, args: unknown[] = []) => ({
    bind(...values: unknown[]) {
      return wrap(sql, values);
    },
    async first() {
      return sqlite.prepare(sql).get(...(args as never[])) ?? null;
    },
    async all() {
      return { results: sqlite.prepare(sql).all(...(args as never[])) };
    },
    async run() {
      const st = sqlite.prepare(sql);
      if (/^SELECT/i.test(sql))
        return { results: st.all(...(args as never[])), meta: { changes: 0 } };
      const r = st.run(...(args as never[]));
      return { results: [], meta: { changes: Number(r.changes) } };
    },
  });
  const db = {
    prepare: wrap,
    async batch(stmts: { run: () => Promise<unknown> }[]) {
      sqlite.exec("BEGIN");
      try {
        const results = [];
        for (const s of stmts) results.push(await s.run());
        sqlite.exec("COMMIT");
        return results;
      } catch (e) {
        sqlite.exec("ROLLBACK");
        throw e;
      }
    },
  } as unknown as D1Database;
  return { db, sqlite };
}
const user = "test-learner";
const requestId = () => crypto.randomUUID();
async function start(
  db: D1Database,
  blocks = ["scenario", "reading", "later"],
  lessonId = "groceries",
) {
  await service.start(db, user, {
    requestId: requestId(),
    blocks,
    lessonId,
    restart: true,
  });
  return (await service.state(db, user)).session!;
}
async function answer(db: D1Database, value: string, rating?: string) {
  const s = (await service.state(db, user)).session!;
  return (await service.attempt(db, user, {
    requestId: requestId(),
    sessionId: s.id,
    index: s.index,
    answer: value,
    ...(rating ? { rating } : {}),
  })) as {
    feedback: { independent: boolean; result: string };
    session: { index: number };
  };
}
test("migration preserves due dates and original rows; sparse history is marked", async () => {
  const { db, sqlite } = fixture();
  sqlite
    .prepare("INSERT INTO progress VALUES(?,?,?,?,?,?,?,?,?)")
    .run(user, "legacy:en", 123456, 4, 2.5, 4, 1, "review", 100000);
  await start(db);
  const s = await service.state(db, user);
  assert.equal(s.cards["legacy:en"].due, 123456);
  assert.equal(s.cards["legacy:en"].history, "partial");
  assert.equal(
    sqlite.prepare("SELECT COUNT(*) AS n FROM progress").get()!.n,
    1,
  );
});
test("attempts are atomic, idempotent and account isolated", async () => {
  const { db } = fixture();
  const s = await start(db);
  const payload = {
    requestId: requestId(),
    sessionId: s.id,
    index: 0,
    answer: "einen",
  };
  const first = await service.attempt(db, user, payload);
  assert.equal(
    JSON.stringify(await service.attempt(db, user, payload)),
    JSON.stringify(first),
  );
  assert.equal((await service.events(db, user, "attempt")).length, 1);
  await assert.rejects(
    service.attempt(db, user, { ...payload, answer: "einem" }),
    /different content/,
  );
  await assert.rejects(
    service.attempt(db, "other", { ...payload, requestId: requestId() }),
    /session moved/,
  );
  assert.equal((await service.progress(db, "other")).recent.length, 0);
});
test("incorrect answers return after intervening tasks; max three failures; originals retained", async () => {
  const { db } = fixture();
  await start(db);
  await answer(db, "der");
  let s = (await service.state(db, user)).session!;
  assert.equal(s.tasks[3].repair, true);
  while (!s.complete) {
    await answer(db, "wrong");
    s = (await service.state(db, user)).session!;
  }
  const evidence = (await service.events(db, user, "attempt")).map(
    (e) => e.evidence!,
  );
  assert.equal(evidence[0].answer, "der");
  assert.ok(
    evidence.filter((e) => e.target === "accusative-articles").length <= 3,
  );
  assert.ok(evidence.filter((e) => e.repair).every((e) => !e.independent));
});
test("hints, shown answers and immediate repairs never count as independent", async () => {
  const { db } = fixture();
  const s = await start(db);
  await service.support(db, user, {
    requestId: requestId(),
    sessionId: s.id,
    index: 0,
    kind: "hint",
  });
  assert.equal((await answer(db, "einen")).feedback.independent, false);
  const p = await service.progress(db, user);
  assert.equal(p.skills.find((x) => x.skill === "grammar")!.independent, 0);
});
test("listening requires audio; transcript results become supported reading", async () => {
  const { db } = fixture();
  let s = await start(db, ["listening"]);
  await service.support(db, user, {
    requestId: requestId(),
    sessionId: s.id,
    index: 0,
    kind: "transcript",
  });
  await answer(db, "rechts");
  let p = await service.progress(db, user);
  assert.equal(p.skills.find((x) => x.skill === "listening")!.attempts, 0);
  assert.equal(p.skills.find((x) => x.skill === "reading")!.independent, 0);
  s = await start(db, ["listening"], "cafe");
  await service.support(db, user, {
    requestId: requestId(),
    sessionId: s.id,
    index: 0,
    kind: "audio",
  });
  assert.equal((await answer(db, "3")).feedback.independent, true);
});
test("silent sessions omit listening; open writing remains pending", async () => {
  const { db } = fixture();
  await service.saveSettings(db, user, {
    requestId: requestId(),
    settings: { ...defaultSettings, audio: "silent" },
  });
  const s = await start(db, ["listening", "writing"]);
  assert.equal(s.tasks.length, 1);
  assert.equal(
    (await answer(db, "A different valid answer")).feedback.result,
    "pending",
  );
});
test("switching blocks preserves unfinished session and index", async () => {
  const { db } = fixture();
  const initial = await start(db);
  await answer(db, "einen");
  await start(db, ["writing"], "cafe");
  const resumed = await start(db);
  assert.equal(resumed.id, initial.id);
  assert.equal(resumed.index, 1);
});
test("summary save/readback, duplicate rejection and stale priorities", async () => {
  const { db } = fixture();
  await start(db);
  let s = await service.state(db, user);
  const summary = {
    sessionId: requestId(),
    baseVersion: s.version,
    occurredAt: new Date(Date.now() + 50).toISOString(),
    summary: "Needed one hint for an article.",
    observations: [
      {
        skill: "speaking",
        target: "articles",
        observation: "One correct phrase after a hint.",
        support: "one hint",
      },
    ],
    nextTargets: ["articles"],
    source: "conversation observation",
    pronunciationAssessed: false,
  };
  await service.saveSummary(db, user, summary);
  await service.saveSummary(db, user, summary);
  assert.deepEqual((await service.state(db, user)).priorities, ["articles"]);
  const stale = {
    ...summary,
    sessionId: requestId(),
    nextTargets: ["stale target"],
  };
  assert.equal(
    ((await service.saveSummary(db, user, stale)) as { historical: boolean })
      .historical,
    true,
  );
  assert.deepEqual((await service.state(db, user)).priorities, ["articles"]);
  assert.equal((await service.progress(db, user)).observations.length, 2);
});
test("lesson publication preserves active session and validates version/date", async () => {
  const { db } = fixture();
  const session = await start(db);
  const s = await service.state(db, user);
  await service.publish(db, user, {
    requestId: requestId(),
    date: studyDate(),
    lessonId: "cafe",
    baseVersion: s.version,
  });
  assert.equal((await service.state(db, user)).session!.id, session.id);
  assert.equal((await service.home(db, user)).lesson.id, "cafe");
  await assert.rejects(
    service.publish(db, user, {
      requestId: requestId(),
      date: studyDate(),
      lessonId: "plans",
      baseVersion: 0,
    }),
    /latest brief/,
  );
});
test("daily writer requires binding and survives retry with no duplicate publication", async () => {
  const { db } = fixture();
  await assert.rejects(service.prepare(db), /Enable daily/);
  await service.saveSettings(db, user, {
    requestId: requestId(),
    settings: { ...defaultSettings, preparation: true },
  });
  assert.equal((await service.prepare(db)).published, true);
  assert.equal((await service.prepare(db)).unchanged, true);
  assert.equal((await service.events(db, user, "publication")).length, 1);
});
test("flagged answers no longer contribute to progress", async () => {
  const { db } = fixture();
  await start(db);
  await answer(db, "einen");
  const e = (await service.events(db, user, "attempt"))[0].evidence!;
  await service.flag(db, user, {
    requestId: requestId(),
    attemptId: e.id,
    reason: "Review this answer.",
  });
  assert.equal(
    (await service.progress(db, user)).skills.find(
      (x) => x.skill === "grammar",
    )!.independent,
    0,
  );
});
test("FSRS uses separate directions, keeps short steps, and replays usable history", () => {
  const now = Date.now();
  const a = review(undefined, "again", now, studyDate());
  assert.equal(a.due, now + 60000);
  const good = review(undefined, "good", now, studyDate());
  assert.ok(good.due > now);
  const old = migrateCard(
    { due: 123, reps: 1, lapses: 0, updated_at: now },
    [{ rating: "good", reviewed_at: now }],
    studyDate(),
  );
  assert.equal(old.due, 123);
  assert.equal(old.history, "complete");
});
test("all two-week lessons have five phrases, valid answers, audio and no duplicated IDs", () => {
  assert.equal(lessons.length, 14);
  const ids = new Set();
  for (const lesson of lessons) {
    assert.equal(lesson.words.length, 5);
    assert.ok(lesson.dialogue.length >= 3);
    for (const e of lesson.exercises) {
      assert.ok(!ids.has(e.id));
      ids.add(e.id);
      assert.ok(e.kind === "open" || e.answer.every((a) => a.length > 0));
      if (e.audio) assert.ok(readFileSync(`public${e.audio}`).length > 1000);
    }
  }
});

test("a new phrase is introduced before recall and is not unaided evidence", async () => {
  const { db } = fixture();
  const s = await start(db, ["recall"]);
  const first = s.tasks[0];
  assert.ok(first.context);
  assert.ok(first.supports.includes("initial teaching"));
  const result = await answer(db, first.answer[0]);
  assert.equal(result.feedback.independent, false);
  assert.equal(Object.keys((await service.state(db, user)).cards).length, 1);
});
test("repeated check prompts are not fresh evidence; no stable claim without a week", async () => {
  const { db } = fixture();
  for (let pass = 0; pass < 2; pass++) {
    await service.start(db, user, {
      requestId: requestId(),
      blocks: ["later"],
      weekly: true,
      restart: true,
    });
    let s = (await service.state(db, user)).session!;
    while (!s.complete) {
      await answer(db, s.tasks[s.index].answer[0]);
      s = (await service.state(db, user)).session!;
    }
  }
  const p = await service.progress(db, user);
  assert.ok(p.targets.every((t) => !t.stable));
});
test("listening cannot be submitted without playback or transcript support", async () => {
  const { db } = fixture();
  await start(db, ["listening"]);
  await assert.rejects(answer(db, "rechts"), /Listen to the recording/);
  assert.equal((await service.events(db, user, "attempt")).length, 0);
});
test("extra recall does not enroll or reschedule cards", async () => {
  const { db } = fixture();
  await service.start(db, user, {
    requestId: requestId(),
    blocks: ["recall"],
    extra: true,
  });
  let s = (await service.state(db, user)).session!;
  await answer(db, s.tasks[0].answer[0]);
  assert.equal(Object.keys((await service.state(db, user)).cards).length, 0);
});

test("validated lesson publication supports new curriculum without deployment", async () => {
  const { db } = fixture();
  const lesson = structuredClone(lessons[0]);
  lesson.id = "new-shop";
  lesson.title = "A new shop visit";
  lesson.exercises.forEach(
    (e) => (e.id = e.id.replace("groceries-", "new-shop-")),
  );
  await service.publish(db, user, {
    requestId: requestId(),
    date: studyDate(),
    lesson,
    baseVersion: 0,
  });
  assert.equal((await service.home(db, user)).lesson.id, "new-shop");
  const s = await start(db, ["recall"], "new-shop");
  assert.equal(s.tasks[0].answer[0], lesson.words[0].german);
  const invalid = structuredClone(lesson);
  invalid.version = 2;
  invalid.exercises[0].answer = [];
  await assert.rejects(
    service.publish(db, user, {
      requestId: requestId(),
      date: studyDate(),
      lesson: invalid,
      baseVersion: (await service.state(db, user)).version,
    }),
    /answer keys/,
  );
  assert.equal((await service.home(db, user)).lesson.version, 1);
});
test("published prompts cannot change under existing recall IDs", async () => {
  const { db } = fixture();
  const lesson = structuredClone(lessons[0]);
  lesson.version = 2;
  lesson.words[0].german = "a changed prompt";
  await assert.rejects(
    service.publish(db, user, {
      requestId: requestId(),
      date: studyDate(),
      lesson,
      baseVersion: 0,
    }),
    /prompts stable/,
  );
  assert.equal((await service.state(db, user)).version, 0);
});
