import { z } from "zod";
import { checks } from "../../data/checks";
import { lessons } from "../../data/lessons";
import { allVocabulary } from "../../data/vocabulary";
import { cases } from "../../data/cases";
import { check, migrateCard, review } from "./recall";
import {
  defaultSettings,
  studyDate,
  type State,
  type Task,
  type Session,
  type Evidence,
  type Feedback,
  type Lesson,
  type Observation,
  type Skill,
  type Block,
} from "./types";
export class LearningError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
const id = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[\w:.-]+$/);
const short = z.string().trim().min(1).max(1000);
const skill = z.enum([
  "recognition",
  "production",
  "grammar",
  "reading",
  "listening",
  "writing",
  "speaking",
]);
const block = z.enum([
  "recall",
  "scenario",
  "reading",
  "listening",
  "writing",
  "later",
  "conversation",
]);
export const summarySchema = z
  .object({
    sessionId: id,
    baseVersion: z.number().int().min(0),
    occurredAt: z.string().datetime(),
    summary: short,
    observations: z
      .array(
        z.object({ skill, target: short, observation: short, support: short }),
      )
      .max(30),
    nextTargets: z.array(short).max(10),
    source: z.enum(["conversation observation", "learner report"]),
    pronunciationAssessed: z.literal(false).optional(),
  })
  .strict();
export const settingsSchema = z
  .object({
    minutes: z.number().int().min(1).max(120),
    audio: z.enum(["silent", "headphones"]),
    order: z
      .array(block)
      .min(1)
      .max(7)
      .refine((x) => new Set(x).size === x.length),
    newLimit: z.number().int().min(0).max(5),
    goal: z.string().min(1).max(1000),
    preparation: z.boolean(),
  })
  .strict();
export const publishSchema = z
  .object({
    requestId: id,
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    lessonId: z.enum(lessons.map((x) => x.id) as [string, ...string[]]),
    baseVersion: z.number().int().min(0),
  })
  .strict();
type Event = {
  request: unknown;
  result: unknown;
  evidence?: Evidence;
  observation?: Observation;
  session?: Session;
  flag?: unknown;
};
const initial = (): State => ({
  settings: structuredClone(defaultSettings),
  cards: {},
  priorities: ["Build a baseline with short unaided attempts."],
  migrated: false,
  version: 0,
  updatedAt: Date.now(),
  introduced: {},
});
export async function state(db: D1Database, user: string): Promise<State> {
  const row = await db
    .prepare(
      "SELECT body,version,updated_at FROM learning_state WHERE user_id=?",
    )
    .bind(user)
    .first<{ body: string; version: number; updated_at: number }>();
  return row
    ? {
        ...JSON.parse(row.body),
        version: row.version,
        updatedAt: row.updated_at,
      }
    : initial();
}
export async function events(
  db: D1Database,
  user: string,
  kind?: string,
): Promise<Event[]> {
  const sql = kind
    ? "SELECT body FROM learning_events WHERE user_id=? AND kind=? ORDER BY created_at"
    : "SELECT body FROM learning_events WHERE user_id=? ORDER BY created_at";
  const result = await db
    .prepare(sql)
    .bind(...(kind ? [user, kind] : [user]))
    .all<{ body: string }>();
  return result.results.map((x) => JSON.parse(x.body));
}
async function mutate(
  db: D1Database,
  user: string,
  eventId: string,
  kind: string,
  request: unknown,
  fn: (s: State) => Promise<Omit<Event, "request">> | Omit<Event, "request">,
): Promise<unknown> {
  for (let n = 0; n < 6; n++) {
    const prev = await db
      .prepare("SELECT body FROM learning_events WHERE user_id=? AND id=?")
      .bind(user, eventId)
      .first<{ body: string }>();
    if (prev) {
      const e: Event = JSON.parse(prev.body);
      if (JSON.stringify(e.request) !== JSON.stringify(request))
        throw new LearningError(
          "This request ID was already used for different content.",
          409,
        );
      return e.result;
    }
    const s = await state(db, user),
      version = s.version;
    const e = await fn(s);
    s.version = version + 1;
    s.updatedAt = Date.now();
    // Both statements run atomically; the event is inserted only when the compare-and-swap won.
    try {
      const results = await db.batch([
        db
          .prepare(
            "INSERT INTO learning_state(user_id,version,body,updated_at) VALUES(?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET version=excluded.version,body=excluded.body,updated_at=excluded.updated_at WHERE learning_state.version=?",
          )
          .bind(user, s.version, JSON.stringify(s), s.updatedAt, version),
        db
          .prepare(
            "INSERT INTO learning_events(user_id,id,kind,body,created_at) SELECT ?,?,?,?,? WHERE changes()=1",
          )
          .bind(
            user,
            eventId,
            kind,
            JSON.stringify({ request, ...e }),
            s.updatedAt,
          ),
      ]);
      if (results[0].meta.changes) return e.result;
    } catch (error) {
      if (n === 5) throw error;
    }
  }
  throw new LearningError(
    "Your learning record changed on another device. Please retry.",
    409,
  );
}
async function migrate(db: D1Database, user: string, s: State) {
  if (s.migrated) return;
  const [p, r] = await db.batch<Record<string, unknown>>([
    db.prepare("SELECT * FROM progress WHERE user_id=?").bind(user),
    db
      .prepare("SELECT * FROM reviews WHERE user_id=? ORDER BY reviewed_at")
      .bind(user),
  ]);
  for (const row of p.results) {
    s.cards[String(row.card_id)] = migrateCard(
      row,
      r.results.filter((e) => e.card_id === row.card_id),
      studyDate(Number(row.updated_at)),
    );
  }
  s.migrated = true;
}
function currentLesson(s: State): Lesson {
  if (s.lesson && s.lessonDate === studyDate()) return s.lesson;
  const days = Object.keys(s.introduced).filter((d) => d < studyDate()).length;
  return lessons[days % lessons.length];
}
function cardTask(cardId: string, s: State): Task | undefined {
  const direction = cardId.endsWith(":de") ? "recognition" : "production";
  const bare = cardId.replace(/:(de|en)$/, "");
  let german = "",
    english = "",
    note = "";
  if (bare.startsWith("phrase-")) {
    for (const lesson of lessons) {
      const index = lesson.words.findIndex(
        (_, i) => `phrase-${lesson.id}-${i}` === bare,
      );
      if (index >= 0) {
        ({ german, english, note = "" } = lesson.words[index]);
        break;
      }
    }
  } else {
    const c = [...allVocabulary, ...cases].find((c) => c.id === bare);
    if (c) {
      german = c.german;
      english = c.english;
      note = [c.note, c.plural ? `Plural: ${c.plural}` : ""]
        .filter(Boolean)
        .join(" · ");
    }
  }
  if (!german) return;
  return {
    id: `card-${cardId}`,
    version: 1,
    target: bare,
    skill: direction,
    prompt: direction === "production" ? english : german,
    answer: [direction === "production" ? german : english],
    hint: note || "Try a word or phrase before revealing the answer.",
    explanation: note || `${german} — ${english}`,
    block: "recall",
    cardId,
    cardVersion: Number(
      s.cards[cardId]?.data.last_review
        ? new Date(String(s.cards[cardId].data.last_review)).getTime()
        : 0,
    ),
    scheduled: true,
    supports: [],
    attemptNumber: 0,
  };
}
function makeSession(
  s: State,
  lesson: Lesson,
  sessionId: string,
  blocks: Block[],
  extra = false,
): Session {
  const today = studyDate();
  const introduced = s.introduced[today] ?? [];
  const newIds = lesson.words
    .map((_, i) => `phrase-${lesson.id}-${i}:en`)
    .filter((id) => !s.cards[id] && !introduced.includes(id))
    .slice(0, Math.max(0, s.settings.newLimit - introduced.length));
  const due = Object.keys(s.cards)
    .filter((id) => s.cards[id].due <= Date.now())
    .sort((a, b) => s.cards[a].due - s.cards[b].due);
  const recall = [...due, ...newIds]
    .slice(0, Math.max(3, Math.min(20, s.settings.minutes * 2)))
    .map((x) => cardTask(x, s))
    .filter((x): x is Task => !!x);
  const t = (e: Lesson["exercises"][number], b: Block): Task => ({
    ...structuredClone(e),
    block: b,
    supports: [],
    attemptNumber: 0,
  });
  const all: Record<Block, Task[]> = {
    recall,
    scenario: lesson.exercises
      .filter((x) => x.skill === "grammar" && !x.fresh)
      .map((x) => t(x, "scenario")),
    reading: lesson.exercises
      .filter((x) => x.skill === "reading")
      .map((x) => t(x, "reading")),
    listening:
      s.settings.audio === "headphones"
        ? lesson.exercises
            .filter((x) => x.skill === "listening")
            .map((x) => t(x, "listening"))
        : [],
    writing: lesson.exercises
      .filter((x) => x.skill === "writing")
      .map((x) => t(x, "writing")),
    later: lesson.exercises.filter((x) => x.fresh).map((x) => t(x, "later")),
    conversation: [],
  };
  for (const task of recall) {
    if (task.cardId && !s.cards[task.cardId]) {
      task.context = `${task.answer[0]} — ${task.prompt}. ${task.explanation}`;
      task.supports = ["initial teaching"];
    }
  }
  for (const task of all.scenario) {
    task.context = [lesson.scene, ...lesson.dialogue].join("\n");
    task.supports = ["initial teaching"];
  }
  const tasks = blocks.flatMap((b) => all[b]);
  if (extra)
    tasks.forEach((t) => {
      t.scheduled = false;
    });
  return {
    id: sessionId,
    createdAt: Date.now(),
    lesson: structuredClone(lesson),
    minutes: s.settings.minutes,
    audio: s.settings.audio,
    tasks,
    index: 0,
    failures: {},
    complete: tasks.length === 0,
    blockOrder: blocks,
  };
}
function safeSession(session?: Session) {
  if (!session) return null;
  return {
    ...session,
    tasks: session.tasks.map(
      ({ answer, model, transcript, explanation, hint, ...t }) => ({
        ...t,
        answer: undefined,
        model: undefined,
        transcript: undefined,
        explanation: undefined,
        hint: undefined,
      }),
    ),
    lesson: { ...session.lesson, exercises: undefined },
  };
}
export async function home(db: D1Database, user: string) {
  const s = await state(db, user);
  return {
    version: s.version,
    updatedAt: s.updatedAt,
    settings: s.settings,
    priorities: s.priorities,
    lesson: { ...currentLesson(s), exercises: undefined },
    session: safeSession(s.session),
    due: Object.values(s.cards).filter((c) => c.due <= Date.now()).length,
    bank: lessons.map(({ id, title, germanTitle, outcome }) => ({
      id,
      title,
      germanTitle,
      outcome,
    })),
  };
}
export async function start(db: D1Database, user: string, raw: unknown) {
  const p = z
    .object({
      requestId: id,
      lessonId: z.string().optional(),
      blocks: z.array(block).min(1).max(7).optional(),
      extra: z.boolean().optional(),
      restart: z.boolean().optional(),
      weekly: z.boolean().optional(),
      cardId: z.string().optional(),
    })
    .strict()
    .parse(raw);
  return mutate(db, user, p.requestId, "session", p, async (s) => {
    await migrate(db, user, s);
    if (s.session && !s.session.complete && !p.restart)
      return { result: { session: safeSession(s.session) } };
    const lesson = p.lessonId
      ? lessons.find((l) => l.id === p.lessonId)
      : currentLesson(s);
    if (!lesson) throw new LearningError("Unknown lesson.");
    const blocks = p.blocks ?? s.settings.order;
    const paused = s.pausedSessions ?? [];
    const resume = paused.findIndex(
      (x) =>
        !x.complete &&
        x.lesson.id === lesson.id &&
        JSON.stringify(x.blockOrder) === JSON.stringify(blocks),
    );
    const next =
      resume >= 0 && !p.weekly && !p.cardId
        ? paused.splice(resume, 1)[0]
        : makeSession(s, lesson, p.requestId, blocks, p.extra);
    if (p.weekly) {
      const seen = new Set(
        (await events(db, user, "attempt")).map((e) => e.evidence?.exerciseId),
      );
      const selected = [...new Set(checks.map((x) => x.target))].flatMap(
        (target) =>
          checks
            .filter((e) => e.target === target && !seen.has(e.id))
            .slice(0, 2),
      );
      const pool = selected.length ? selected : checks.slice(0, 8);
      next.tasks = pool.map((e) => ({
        ...structuredClone(e),
        block: "later",
        supports: [],
        attemptNumber: 0,
      }));
      next.complete = false;
    }
    if (p.cardId) {
      const task = cardTask(p.cardId, s);
      if (!task) throw new LearningError("Unknown recall card.");
      if (
        !s.cards[p.cardId] &&
        (s.introduced[studyDate()]?.length ?? 0) >= s.settings.newLimit &&
        !p.extra
      )
        throw new LearningError(
          "Today’s new-item limit is reached. Choose extra practice or return tomorrow.",
        );
      task.scheduled = !p.extra;
      next.tasks = [task];
      next.complete = false;
    }
    if (s.session && !s.session.complete) paused.push(s.session);
    s.pausedSessions = paused;
    s.session = next;
    return {
      result: { session: safeSession(s.session) },
      session: structuredClone(s.session),
    };
  });
}
function active(s: State, sessionId: string, index: number) {
  if (
    !s.session ||
    s.session.id !== sessionId ||
    s.session.complete ||
    s.session.index !== index
  )
    throw new LearningError(
      "This session moved forward. Reload to resume.",
      409,
    );
  return { session: s.session, task: s.session.tasks[index] };
}
export async function support(db: D1Database, user: string, raw: unknown) {
  const p = z
    .object({
      requestId: id,
      sessionId: id,
      index: z.number().int().min(0),
      kind: z.enum(["hint", "answer", "transcript", "audio", "example"]),
    })
    .strict()
    .parse(raw);
  return mutate(db, user, p.requestId, "support", p, (s) => {
    const { session, task } = active(s, p.sessionId, p.index);
    let text = "";
    if (p.kind === "audio") {
      if (!task.audio) throw new LearningError("This task has no audio.");
      task.audioPlayed = true;
    } else {
      if (!task.supports.includes(p.kind)) task.supports.push(p.kind);
      if (p.kind === "hint") text = task.hint;
      if (p.kind === "answer") text = task.model ?? task.answer.join(" / ");
      if (p.kind === "transcript") text = task.transcript ?? "";
      if (p.kind === "example") {
        text = [session.lesson.pattern, ...session.lesson.examples].join("\n");
        task.supports.push("example");
      }
    }
    return { result: { text, session: safeSession(session) } };
  });
}
export async function attempt(db: D1Database, user: string, raw: unknown) {
  const p = z
    .object({
      requestId: id,
      sessionId: id,
      index: z.number().int().min(0),
      answer: z.string().max(3000),
      rating: z.enum(["again", "hard", "good", "easy"]).optional(),
    })
    .strict()
    .parse(raw);
  return mutate(db, user, p.requestId, "attempt", p, async (s) => {
    const { session, task } = active(s, p.sessionId, p.index);
    if (!p.answer.trim() && !p.rating)
      throw new LearningError("Try an answer, or choose I don’t know.");
    const now = Date.now();
    const all = await events(db, user, "attempt");
    const previous = all
      .map((e) => e.evidence)
      .filter((e): e is Evidence => !!e && e.target === task.target)
      .at(-1);
    const unaided = !task.supports.length && !task.repair;
    const listening = task.skill === "listening";
    const audioOK =
      !listening ||
      (task.audioPlayed === true && session.audio === "headphones");
    if (listening && !audioOK && !task.supports.includes("transcript"))
      throw new LearningError(
        "Listen to the recording or open the transcript before answering.",
      );
    let result: Feedback["result"] =
      task.kind === "open"
        ? "pending"
        : check(p.answer, task.answer)
          ? "correct"
          : "incorrect";
    // Lexical recall is self-rated when spelling/translation differs; preserve the first answer and label the source.
    if (task.cardId && p.rating && p.rating !== "again" && result !== "correct")
      result = "self-rated";
    const feedback: Feedback = {
      result,
      answer: task.model ?? task.answer.join(" / "),
      explanation: task.explanation,
      independent: unaided && audioOK && result === "correct",
      recorded: true,
    };
    if (task.cardId && task.scheduled && !task.repair) {
      const old = s.cards[task.cardId];
      const oldVersion = Number(
        old?.data.last_review
          ? new Date(String(old.data.last_review)).getTime()
          : 0,
      );
      if (oldVersion !== task.cardVersion)
        throw new LearningError(
          "This card was reviewed elsewhere. Start a fresh recall block.",
          409,
        );
      const rating =
        !unaided || result === "incorrect" || p.rating === "again"
          ? "again"
          : (p.rating ?? "good");
      const next = review(old, rating, now, studyDate(now));
      s.cards[task.cardId] = next;
      feedback.nextDue = next.due;
      if (!old) {
        const list = s.introduced[studyDate()] ?? [];
        if (!list.includes(task.cardId)) list.push(task.cardId);
        s.introduced[studyDate()] = list;
      }
    }
    const evidence: Evidence = {
      id: p.requestId,
      sessionId: session.id,
      exerciseId: task.id,
      exerciseVersion: task.version,
      target: task.target,
      skill:
        (listening && !audioOK) ||
        (listening && task.supports.includes("transcript"))
          ? "reading"
          : task.skill,
      answer: p.answer,
      result,
      independent: feedback.independent,
      supports: [...task.supports],
      audioPlayed: !!task.audioPlayed,
      time: now,
      intervalMs: previous ? now - previous.time : null,
      fresh:
        !!task.fresh &&
        !all.some(
          (e) =>
            e.evidence?.exerciseId === task.id &&
            e.evidence?.exerciseVersion === task.version,
        ),
      transfer: !!task.transfer,
      repair: !!task.repair,
      source: task.cardId
        ? result === "self-rated"
          ? "self-rating"
          : "checked exercise with recall rating"
        : task.kind === "open"
          ? "learner writing — pending coaching"
          : "checked exercise",
      rating: p.rating,
      cardId: task.cardId,
      scheduled: task.scheduled,
      feedback,
    };
    if (result === "incorrect") {
      const failures = (session.failures[task.target] ?? 0) + 1;
      session.failures[task.target] = failures;
      s.priorities = [
        task.target,
        ...s.priorities.filter((t) => t !== task.target),
      ].slice(0, 8);
      if (failures < 3 && session.tasks.length - session.index > 2) {
        const retry: Task = {
          ...structuredClone(task),
          id: `${task.id}-repair-${failures}`,
          repair: true,
          scheduled: false,
          supports: ["correction shown"],
          attemptNumber: failures,
        };
        session.tasks.splice(
          Math.min(session.tasks.length, session.index + 3),
          0,
          retry,
        );
      } else {
        feedback.explanation +=
          " Let’s revisit this gently in another session.";
        if (failures >= 3)
          session.tasks = session.tasks.filter(
            (t, i) => i <= session.index || t.target !== task.target,
          );
      }
    }
    session.index++;
    session.complete = session.index >= session.tasks.length;
    session.lastFeedback = feedback;
    return {
      result: { feedback, session: safeSession(session) },
      evidence,
      ...(session.complete ? { session: structuredClone(session) } : {}),
    };
  });
}
export async function saveSettings(db: D1Database, user: string, raw: unknown) {
  const p = z
    .object({ requestId: id, settings: settingsSchema })
    .strict()
    .parse(raw);
  const result = await mutate(db, user, p.requestId, "settings", p, (s) => {
    s.settings = p.settings;
    return { result: { saved: true } };
  });
  // Explicit owner opt-in binds unattended preparation to this account. The endpoint never accepts a caller-selected user ID.
  if (p.settings.preparation) {
    await db
      .prepare(
        "INSERT INTO preparation_binding(slot,user_id,enabled) VALUES('owner',?,1) ON CONFLICT(slot) DO UPDATE SET enabled=1 WHERE preparation_binding.user_id=excluded.user_id",
      )
      .bind(user)
      .run();
  } else {
    await db
      .prepare("UPDATE preparation_binding SET enabled=0 WHERE user_id=?")
      .bind(user)
      .run();
  }
  return result;
}
export async function saveSummary(db: D1Database, user: string, raw: unknown) {
  const p = summarySchema.parse(raw);
  if (new Date(p.occurredAt).getTime() > Date.now() + 300000)
    throw new LearningError("Session time cannot be in the future.");
  return mutate(db, user, `summary:${p.sessionId}`, "summary", p, (s) => {
    if (p.baseVersion > s.version)
      throw new LearningError(
        "This summary refers to a future record version.",
        409,
      );
    const historical =
      p.baseVersion < s.version ||
      (s.version > 0 && new Date(p.occurredAt).getTime() < s.updatedAt);
    if (!historical && p.nextTargets.length) s.priorities = p.nextTargets;
    return {
      result: {
        saved: true,
        sessionId: p.sessionId,
        version: s.version + 1,
        historical,
        prioritiesUpdated: !historical,
      },
      observation: p,
    };
  });
}
export async function publish(db: D1Database, user: string, raw: unknown) {
  const p = publishSchema.parse(raw);
  return mutate(db, user, `publish:${p.requestId}`, "publication", p, (s) => {
    if (p.baseVersion !== s.version)
      throw new LearningError("Read the latest brief before publishing.", 409);
    if (p.date !== studyDate())
      throw new LearningError("Publish for the current Vienna study date.");
    const lesson = lessons.find((l) => l.id === p.lessonId)!;
    s.lesson = structuredClone(lesson);
    s.lessonDate = p.date;
    return {
      result: {
        published: true,
        lessonId: lesson.id,
        date: p.date,
        version: s.version + 1,
        activeSessionPreserved: true,
      },
    };
  });
}
export async function flag(db: D1Database, user: string, raw: unknown) {
  const p = z
    .object({ requestId: id, attemptId: id, reason: short })
    .strict()
    .parse(raw);
  const e = await db
    .prepare(
      "SELECT body FROM learning_events WHERE user_id=? AND id=? AND kind='attempt'",
    )
    .bind(user, p.attemptId)
    .first();
  if (!e) throw new LearningError("Attempt not found.", 404);
  return mutate(db, user, p.requestId, "flag", p, () => ({
    result: { saved: true, pending: true },
    flag: p,
  }));
}
export async function progress(db: D1Database, user: string) {
  const s = await state(db, user),
    all = await events(db, user);
  const flagged = new Set(
    all
      .filter((e) => e.flag)
      .map((e) => (e.flag as { attemptId: string }).attemptId),
  );
  const evidence = all.map((e) => e.evidence).filter((e): e is Evidence => !!e);
  const skills: Skill[] = [
    "recognition",
    "production",
    "grammar",
    "reading",
    "listening",
    "writing",
    "speaking",
  ];
  return {
    version: s.version,
    skills: skills.map((skill) => {
      const rows = evidence.filter(
        (e) => e.skill === skill && !flagged.has(e.id),
      );
      const checks = rows.filter(
        (e) =>
          !e.repair &&
          !e.supports.length &&
          e.result !== "pending" &&
          e.result !== "self-rated",
      );
      const wins = checks.filter((e) => e.independent);
      return {
        skill,
        attempts: rows.length,
        checked: checks.length,
        independent: wins.length,
        pending: rows.filter((e) => e.result === "pending").length,
        delayed: wins.filter((e) => (e.intervalMs ?? 0) >= 86400000).length,
      };
    }),
    targets: [...new Set(evidence.map((e) => e.target))].map((target) => {
      const rows = evidence.filter(
        (e) => e.target === target && !flagged.has(e.id),
      );
      const checks = rows.filter(
        (e) =>
          e.fresh &&
          !e.repair &&
          !e.supports.length &&
          ["correct", "incorrect"].includes(e.result),
      );
      const byDay = new Map<string, Evidence[]>();
      checks.forEach((e) => {
        const d = studyDate(e.time);
        byDay.set(d, [...(byDay.get(d) ?? []), e]);
      });
      const passing = [...byDay.values()].filter(
        (r) =>
          r.length >= 2 &&
          r.filter((e) => e.independent).length / r.length >= 0.8,
      );
      const stable =
        passing.length >= 2 &&
        Math.max(...passing.flat().map((e) => e.time)) -
          Math.min(...passing.flat().map((e) => e.time)) >=
          7 * 86400000 &&
        checks.some((e) => e.transfer && e.independent);
      const last = rows.at(-1);
      const retained = rows.filter(
        (e) => e.independent && (e.intervalMs ?? 0) >= 86400000,
      );
      return {
        target,
        status:
          last?.result === "incorrect"
            ? "Needs review"
            : stable
              ? "Used independently"
              : retained.length >= 2
                ? "Retained"
                : rows.length
                  ? "Practising"
                  : "New",
        count: checks.length,
        independent: checks.filter((e) => e.independent).length,
        stable,
      };
    }),
    recent: evidence
      .slice(-15)
      .reverse()
      .map((e) => ({ ...e, flagged: flagged.has(e.id) })),
    observations: all
      .filter((e) => e.observation)
      .map((e) => e.observation)
      .slice(-10)
      .reverse(),
    cards: {
      enrolled: Object.keys(s.cards).length,
      due: Object.values(s.cards).filter((c) => c.due <= Date.now()).length,
      partialHistory: Object.values(s.cards).filter(
        (c) => c.history === "partial",
      ).length,
    },
    priorities: s.priorities,
  };
}
export async function brief(db: D1Database, user: string) {
  const s = await state(db, user),
    p = await progress(db, user);
  const lesson = currentLesson(s);
  const missionId = crypto.randomUUID();
  return {
    version: s.version,
    updatedAt: new Date(s.updatedAt).toISOString(),
    sessionId: missionId,
    goal: s.settings.goal,
    preferences: s.settings,
    priorities: s.priorities,
    lesson: { id: lesson.id, outcome: lesson.outcome, mission: lesson.mission },
    progress: p,
    summaryTemplate: {
      sessionId: missionId,
      baseVersion: s.version,
      occurredAt: new Date().toISOString(),
      source: "conversation observation",
      summary: "Replace with concrete observations.",
      observations: [],
      nextTargets: [],
      pronunciationAssessed: false,
    },
    text: `GERMAN ME · PRIVATE LEARNING BRIEF\nRecord version ${s.version} · ${new Date(s.updatedAt).toISOString()}\nGoal: ${s.settings.goal}\nNext targets: ${s.priorities.join("; ")}\nScenario: ${lesson.germanTitle}. ${lesson.outcome}\nMission: ${lesson.mission}\nTeach one question at a time. Use scenarios and retrieval. Preserve the first answer and support used. A transcript cannot establish pronunciation. Save only observed facts using this record version and session ID ${missionId}.\nEvidence: ${p.skills.map((x) => `${x.skill}: ${x.independent}/${x.checked} checked independent successes, ${x.pending} pending`).join("; ")}. These are coaching observations, not exam scores.`,
  };
}
export async function exportRecord(db: D1Database, user: string) {
  return {
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    state: await state(db, user),
    events: await events(db, user),
    legacy: await db
      .prepare("SELECT * FROM reviews WHERE user_id=? ORDER BY reviewed_at")
      .bind(user)
      .all(),
  };
}
export async function prepare(db: D1Database) {
  const binding = await db
    .prepare(
      "SELECT user_id FROM preparation_binding WHERE slot='owner' AND enabled=1",
    )
    .first<{ user_id: string }>();
  if (!binding)
    throw new LearningError(
      "Enable daily preparation in the owner’s settings first.",
      403,
    );
  const user = binding.user_id,
    s = await state(db, user);
  if (!s.settings.preparation)
    throw new LearningError("Preparation is disabled.", 403);
  const today = studyDate();
  if (s.lessonDate === today)
    return {
      published: true,
      unchanged: true,
      date: today,
      lessonId: s.lesson?.id,
    };
  const report = await progress(db, user);
  const weak = report.targets
    .filter((t) => t.status === "Needs review")
    .map((t) => t.target);
  const relevant = lessons.find((l) =>
    l.exercises.some((e) => weak.includes(e.target)),
  );
  const lesson = relevant ?? currentLesson(s);
  await publish(db, user, {
    requestId: `daily-${today}`,
    date: today,
    lessonId: lesson.id,
    baseVersion: s.version,
  });
  const after = await state(db, user);
  if (after.lessonDate !== today || after.lesson?.id !== lesson.id)
    throw new LearningError("Publication readback failed.", 503);
  return {
    published: true,
    verified: true,
    date: today,
    lessonId: lesson.id,
    version: after.version,
  };
}

export function library(query: string) {
  const q = query.toLocaleLowerCase();
  return allVocabulary
    .filter((c) =>
      `${c.german} ${c.english} ${c.topic}`.toLocaleLowerCase().includes(q),
    )
    .slice(0, 40)
    .map((c) => ({
      id: c.id,
      german: c.german,
      english: c.english,
      note: c.note,
      plural: c.plural,
    }));
}
