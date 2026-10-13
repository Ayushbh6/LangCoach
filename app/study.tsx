"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  ChevronUp,
  ChevronDown,
  Headphones,
  VolumeX,
  Settings2,
  X,
  BookOpen,
  RotateCcw,
  MessageCircle,
  Copy,
  Download,
  Pause,
  Flag,
  WifiOff,
} from "lucide-react";
import { RecallCard, CardDetails } from "./recall-card";
import { ActivityTracker } from "./activity-tracker";
import type { Activity } from "../lib/learning/activity";
import { curriculum } from "../data/curriculum";
import type {
  Session,
  Settings,
  Feedback,
  Task,
  Block,
} from "../lib/learning/types";
type LibraryCard = { id: string; german: string; english: string; level: string };
type RecallDeck = "daily" | "a1" | "a2" | "b1" | "cases";
type Home = {
  version: number;
  updatedAt: number;
  settings: Settings;
  priorities: string[];
  lesson: Session["lesson"];
  session: Session | null;
  due: number;
  listeningAvailable: boolean;
  bank: { id: string; title: string; germanTitle: string; outcome: string }[];
};
type Progress = {
  activity: Activity;
  skills: {
    skill: string;
    attempts: number;
    checked: number;
    independent: number;
    pending: number;
    delayed: number;
  }[];
  targets: {
    target: string;
    status: string;
    count: number;
    independent: number;
  }[];
  observations: {
    summary: string;
    occurredAt: string;
    nextTargets: string[];
    source: string;
  }[];
  cards: { enrolled: number; due: number; partialHistory: number };
  recent: {
    id: string;
    answer: string;
    result: string;
    independent: boolean;
    target: string;
    flagged: boolean;
    time: number;
  }[];
};
type Brief = {
  text: string;
  version: number;
  sessionId: string;
  summaryTemplate: Record<string, unknown>;
  lesson: { mission: string };
};
const labels: Record<Block, string> = {
  recall: "Recall",
  scenario: "Scenario",
  reading: "Reading",
  listening: "Listening",
  writing: "Writing",
  later: "Later recall",
  conversation: "Conversation",
};
const uid = () => crypto.randomUUID();
async function api<T = Home>(view = ""): Promise<T> {
  const r = await fetch(`/api/learning${view ? `?view=${view}` : ""}`, {
    cache: "no-store",
  });
  const data = (await r.json()) as T & { error?: string };
  if (!r.ok) throw new Error(data.error);
  return data;
}
async function post(data: unknown) {
  const r = await fetch("/api/learning", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = (await r.json()) as {
    error: string;
    session: Session;
    feedback: Feedback;
    text: string;
    historical: boolean;
  };
  if (!r.ok) {
    const e = new Error(result.error) as Error & { status: number };
    e.status = r.status;
    throw e;
  }
  return result;
}
export default function Study({ userKey }: { userKey: string }) {
  const [home, setHome] = useState<Home | null>(null),
    [view, setView] = useState<"today" | "practice" | "progress">("today"),
    [focused, setFocused] = useState(false),
    [settings, setSettings] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [answer, setAnswer] = useState(""),
    [feedback, setFeedback] = useState<Feedback | null>(null),
    [support, setSupport] = useState(""),
    [report, setReport] = useState<Progress | null>(null),
    [brief, setBrief] = useState<Brief | null>(null),
    [importText, setImportText] = useState(""),
    [pending, setPending] = useState<Record<string, unknown> | null>(null),
    [online, setOnline] = useState(true),
    [lastAttempt, setLastAttempt] = useState(""),
    [search, setSearch] = useState(""),
    [library, setLibrary] = useState<
      LibraryCard[] | null
    >(null);
  const [libraryLevel, setLibraryLevel] = useState("all");
  const [librarySearch, setLibrarySearch] = useState("");
  const [libraryVisible, setLibraryVisible] = useState(40);
  const libraryMatches = library?.filter(c => (libraryLevel === "all" || c.level === libraryLevel) && `${c.german} ${c.english}`.toLowerCase().includes(librarySearch.toLowerCase())) ?? [];
  const input = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null),
    audio = useRef<HTMLAudioElement | null>(null);
  const storage = `german-me:${userKey}:`;
  const mainScroll = useRef<HTMLElement>(null);
  const [handoffCopied, setHandoffCopied] = useState("");
  const session = home?.session,
    task = session?.tasks[session.index];
  useEffect(() => {
    mainScroll.current?.scrollTo({ top: 0 });
  }, [view, focused, session?.index]);
  const refresh = useCallback(async () => {
    setHome(await api());
  }, []);
  useEffect(() => {
    refresh().catch((e) => setError(e.message));
    const on = () => setOnline(navigator.onLine);
    on();
    window.addEventListener("online", on);
    window.addEventListener("offline", on);
    try {
      const value = localStorage.getItem(storage + "pending");
      if (value) setPending(JSON.parse(value));
    } catch {}
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", on);
    };
  }, [refresh, storage]);
  useEffect(() => {
    if (!session || !task) return;
    try {
      setAnswer(
        localStorage.getItem(
          `${storage}draft:${session.id}:${session.index}`,
        ) ?? "",
      );
    } catch {}
    setSupport("");
    audio.current?.pause();
  }, [session?.id, session?.index, storage]);
  useEffect(() => {
    if (!settings && !brief && !library) return;
    const previous = document.activeElement as HTMLElement | null;
    const dialog = document.querySelector<HTMLElement>("[role=dialog]");
    const focusables = () =>
      Array.from(
        dialog?.querySelectorAll<HTMLElement>(
          "button:not(:disabled),input,textarea,select,summary,a[href]",
        ) ?? [],
      ).filter(element => element.getClientRects().length > 0);
    focusables()[0]?.focus();
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSettings(false);
        setBrief(null);
        setLibrary(null);
      }
      if (e.key === "Tab") {
        const items = focusables();
        const first = items[0],
          last = items.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", handle);
    return () => {
      document.removeEventListener("keydown", handle);
      previous?.focus();
    };
  }, [settings, !!brief, !!library]);
  async function run(fn: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await fn();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function begin(
    blocks?: Block[],
    lessonId?: string,
    extra = false,
    options: { weekly?: boolean; cardId?: string; deck?: RecallDeck } = {},
  ) {
    await run(async () => {
      const continuing =
        !!home?.session && !home.session.complete && !blocks && !lessonId;
      const res = await post({
        action: "start",
        requestId: uid(),
        ...(blocks ? { blocks, restart: true } : {}),
        ...(lessonId ? { lessonId, restart: true } : {}),
        extra,
        ...options,
      });
      await refresh();
      setFeedback(null);
      setFocused(true);
      setSupport("");
      if (continuing) setNotice("Right where you left off.");
      if (res.session.complete) {
        setFocused(false);
        setNotice(
          "Nothing due in this block right now. Try a scenario, or come back later.",
        );
      }
    });
  }
  async function submit(rating?: string, retry?: Record<string, unknown>, flashcard = false) {
    if (!session || !task) return;
    const payload = retry ?? {
      action: "attempt",
      requestId: uid(),
      sessionId: session.id,
      index: session.index,
      answer: flashcard ? "" : answer,
      rating,
      ...(flashcard ? { flashcard: true } : {}),
    };
    await run(async () => {
      try {
        localStorage.setItem(storage + "pending", JSON.stringify(payload));
      } catch {}
      setPending(payload);
      const res = await post(payload);
      setHome((h) => (h ? { ...h, session: res.session } : h));
      setFeedback(payload.flashcard ? null : res.feedback);
      setLastAttempt(String(payload.requestId));
      setPending(null);
      try {
        localStorage.removeItem(storage + "pending");
        localStorage.removeItem(
          `${storage}draft:${payload.sessionId}:${payload.index}`,
        );
      } catch {}
      setAnswer("");
      setSupport("");
    });
  }
  async function retryPending() {
    if (!pending) return;
    await run(async () => {
      const res = await post(pending);
      setFeedback(pending.flashcard ? null : res.feedback);
      setLastAttempt(String(pending.requestId));
      setPending(null);
      localStorage.removeItem(storage + "pending");
      await refresh();
      setFocused(true);
    });
  }
  async function help(
    kind: "hint" | "answer" | "transcript" | "example" | "audio" | "flip",
  ) {
    if (!session || !task) return;
    await run(async () => {
      const res = await post({
        action: "support",
        requestId: uid(),
        sessionId: session.id,
        index: session.index,
        kind,
      });
      setHome((h) => (h ? { ...h, session: res.session } : h));
      if (kind !== "audio") setSupport(res.text);
    });
  }
  async function savePrefs(value: Settings) {
    await run(async () => {
      await post({ action: "settings", requestId: uid(), settings: value });
      await refresh();
      setNotice(
        "Preferences saved. Your current session keeps its original plan.",
      );
    });
  }
  async function loadBrief() {
    setHandoffCopied("");
    const b = await api<Brief>("brief");
    setBrief(b);
  }
  async function copyBrief() {
    if (!brief) return;
    await navigator.clipboard.writeText(
      brief.text +
        "\n\nSave the session using this JSON structure:\n" +
        JSON.stringify(brief.summaryTemplate, null, 2),
    );
    setNotice(
      "Learning Brief copied. Paste it into your German ChatGPT project.",
    );
  }
  useEffect(() => {
    if (view !== "progress") return;
    let active = true;
    const update = () => {
      if (document.visibilityState !== "visible") return;
      api<Progress>("progress").then(data => {
        if (active) setReport(data);
      }).catch(() => { /* Keep the last confirmed record while offline. */ });
    };
    window.addEventListener("focus", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      active = false;
      window.removeEventListener("focus", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, [view]);
  async function changeView(v: typeof view) {
    setView(v);
    setError("");
    if (v === "progress")
      await run(async () => setReport(await api<Progress>("progress")));
  }
  function draft(value: string) {
    setAnswer(value);
    if (session)
      try {
        localStorage.setItem(
          `${storage}draft:${session.id}:${session.index}`,
          value,
        );
      } catch {}
  }
  function next() {
    setFeedback(null);
    setSupport("");
    if (session?.complete) {
      setFocused(false);
      refresh();
      setNotice("Session saved. Come back later for a short recall.");
    } else setTimeout(() => input.current?.focus(), 50);
  }
  async function flagAnswer() {
    await run(async () => {
      await post({
        action: "flag",
        requestId: uid(),
        attemptId: lastAttempt,
        reason: "Learner requested review of this correction.",
      });
      setNotice(
        "Flagged for review. This answer is excluded from progress claims.",
      );
    });
  }
  if (!home)
    return (
      <main className="loading">
        <span className="wordmark">
          german me<span>↗</span>
        </span>
        <p role="status">{error || "Opening your learning space…"}</p>
        {error && <button onClick={() => run(refresh)}>Try again</button>}
      </main>
    );
  const pref = home.settings;
  return (
    <div className={focused ? "app focus-mode" : "app"}>
      <a className="skip" href="#main">
        Skip to learning
      </a>
      <header className="header" inert={!!(settings || brief || library)}>
        <button
          className="wordmark plain"
          onClick={() => {
            setFocused(false);
            setView("today");
          }}
        >
          german me<span>↗</span>
        </button>
        {!focused ? (
          <>
            <nav aria-label="Main navigation">
              {(["today", "practice", "progress"] as const).map((v) => (
                <button
                  key={v}
                  aria-current={view === v ? "page" : undefined}
                  className={view === v ? "active" : ""}
                  onClick={() => changeView(v)}
                >
                  {v[0].toUpperCase() + v.slice(1)}
                </button>
              ))}
            </nav>
            <button
              className="text-button settings-button"
              aria-label="Settings"
              onClick={() => setSettings(true)}
            >
              <Settings2 size={20} />
              <span>Settings</span>
            </button>
          </>
        ) : (
          <button
            className="text-button"
            disabled={busy}
            onClick={() => {
              audio.current?.pause();
              setFocused(false);
            }}
          >
            <Pause size={16} /> Save & leave
          </button>
        )}
      </header>
      <main id="main" ref={mainScroll} tabIndex={0} inert={!!(settings || brief || library)}>
      <div className="messages" aria-live="polite">
        {!online && (
          <p className="notice">
            <WifiOff size={16} /> Offline for a moment. Your draft stays on this
            device.
          </p>
        )}
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        {notice && <p className="notice">{notice}</p>}
        {pending && (
          <div className="notice">
            <span>An answer is waiting for confirmation.</span>
            <button onClick={retryPending} disabled={busy}>
              Retry save
            </button>
            <button
              className="text-button"
              onClick={() => {
                localStorage.removeItem(storage + "pending");
                setPending(null);
                setError("");
                refresh();
              }}
            >
              Reload current session
            </button>
          </div>
        )}
      </div>
        {focused && session ? (
          <section className="player" aria-label="Learning session">
            <div className="session-top">
              <span className="eyebrow">
                {feedback
                  ? "A moment to learn"
                  : task
                    ? labels[task.block]
                    : "Session complete"}
              </span>
              <span>
                {Math.min(
                  session.index + (!feedback ? 1 : 0),
                  session.tasks.length,
                )}{" "}
                / {session.tasks.length}
              </span>
            </div>
            <div className="progress-line">
              <span
                style={{
                  width: `${session.tasks.length ? (session.index / session.tasks.length) * 100 : 100}%`,
                }}
              />
            </div>
            {feedback ? (
              <div className="feedback" key={session.index}>
                <span className="feedback-mark">
                  {feedback.result === "incorrect" ? (
                    <RotateCcw size={28} />
                  ) : (
                    <Check size={28} />
                  )}
                </span>
                <p className="eyebrow">
                  {feedback.result === "correct"
                    ? feedback.independent
                      ? "Recalled without help"
                      : "Useful supported practice"
                    : feedback.result === "pending"
                      ? "Saved for coaching"
                      : feedback.result === "self-rated"
                        ? "Self-rated recall"
                        : "Let’s try that again later"}
                </p>
                <h1>{feedback.answer}</h1>
                <p className="explanation">{feedback.explanation}</p>
                {feedback.result === "pending" && (
                  <p className="muted">
                    This is one possible answer. Your writing is saved, with no
                    automatic right/wrong score.
                  </p>
                )}
                {feedback.nextDue && (
                  <p className="muted">
                    Scheduled recall:{" "}
                    {new Date(feedback.nextDue).toLocaleString(undefined, {
                      weekday: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
                <button className="primary" onClick={next}>
                  {session.complete ? "Finish this session" : "Continue"}
                  <ArrowRight size={19} />
                </button>
                <button
                  className="text-button"
                  onClick={flagAnswer}
                  disabled={busy}
                >
                  <Flag size={15} /> Flag correction
                </button>
              </div>
            ) : task?.cardId ? (
              <>
                <RecallCard key={`${session.id}-${session.index}`} task={task} busy={busy} pending={!!pending}
                  onFlip={() => help("flip")} onRate={(rating) => submit(rating, undefined, true)} />
                {session.index > 0 && session.tasks[session.index-1]?.flashcard && (
                  <details className="previous-card" key={`previous-${session.index}`}>
                    <summary>Previous card · look back</summary>
                    <p className="small muted">Review only. Your previous rating stays saved.</p>
                    <h3>{session.tasks[session.index-1].flashcard!.german}</h3>
                    <p>{session.tasks[session.index-1].flashcard!.english}</p>
                    <CardDetails card={session.tasks[session.index-1].flashcard!}/>
                  </details>
                )}
              </>
            ) : task ? (
              <div className="question" key={`${session.id}-${session.index}`}>
                <p className="context-label">
                  {session.lesson.germanTitle}
                  {task.repair ? " · repair practice" : ""}
                </p>
                {task.context && (
                  <blockquote lang="de">{task.context}</blockquote>
                )}
                {task.audio && (
                  <div className="audio-wrap">
                    <audio
                      key={task.audio}
                      ref={audio}
                      controls
                      preload="none"
                      src={task.audio}
                      onEnded={() => help("audio")}
                      aria-label="German practice recording"
                    />
                    <small>
                      Original synthetic practice audio. Listen to the end
                      before answering.
                    </small>
                    <button
                      className="text-button"
                      onClick={() => help("transcript")}
                      disabled={busy}
                    >
                      Read transcript · supported practice
                    </button>
                  </div>
                )}
                <h1 lang={task.skill === "recognition" ? "de" : undefined}>
                  {task.prompt}
                </h1>
                <p className="muted">
                  {task.cardId
                    ? task.skill === "production"
                      ? "Recall the German, including the article."
                      : "Recall the meaning in English."
                    : task.supports.includes("initial teaching")
                      ? "Read the short example, then try the response. This first step is supported practice."
                      : "Try it before asking for a hint."}
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submit();
                  }}
                >
                  {task.kind === "open" ? (
                    <textarea
                      ref={(e) => {
                        input.current = e;
                      }}
                      aria-label="Your answer"
                      placeholder="Your words. A few sentences is enough."
                      value={answer}
                      onChange={(e) => draft(e.target.value)}
                      rows={5}
                      autoCapitalize="sentences"
                    />
                  ) : (
                    <input
                      ref={(e) => {
                        input.current = e;
                      }}
                      aria-label="Your answer"
                      placeholder="Your answer…"
                      value={answer}
                      onChange={(e) => draft(e.target.value)}
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck={false}
                      autoCapitalize="off"
                    />
                  )}
                  {support && (
                    <aside className="support" role="status">
                      {support.split("\n").map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </aside>
                  )}
                  <div className="answer-actions">
                    <button
                      className="primary"
                      disabled={
                        busy ||
                        !!pending ||
                        !answer.trim() ||
                        (!!task.audio &&
                          !task.audioPlayed &&
                          !task.supports.includes("transcript"))
                      }
                      type="submit"
                    >
                      {busy
                        ? "Saving…"
                        : task.kind === "open"
                          ? "Save for coaching"
                          : "Check answer"}
                      <ArrowRight size={18} />
                    </button>
                    <button
                      type="button"
                      className="text-button"
                      onClick={() => help("hint")}
                      disabled={busy}
                    >
                      A small hint
                    </button>
                  </div>
                  {task.cardId && (
                    <div className="ratings" aria-label="Recall rating">
                      <span>How did recall feel?</span>
                      <button
                        type="button"
                        disabled={busy || !!pending}
                        onClick={() => submit("again")}
                      >
                        Forgot
                      </button>
                      <button
                        type="button"
                        disabled={busy || !!pending || !answer.trim()}
                        onClick={() => submit("hard")}
                      >
                        Correct, but hard
                      </button>
                      <button
                        type="button"
                        disabled={busy || !!pending || !answer.trim()}
                        onClick={() => submit("easy")}
                      >
                        Easy
                      </button>
                      <small>
                        If unsure, check your answer first. Different
                        translations are saved as self-ratings.
                      </small>
                    </div>
                  )}
                  {!task.cardId && task.kind !== "open" && (
                    <button
                      type="button"
                      className="text-button"
                      disabled={busy || !!pending}
                      onClick={() => submit("again")}
                    >
                      I don’t know yet
                    </button>
                  )}
                </form>
                <div className="quiet-tools">
                  <button
                    className="text-button"
                    disabled={busy}
                    onClick={() => help("example")}
                  >
                    <BookOpen size={15} /> Explain the pattern
                  </button>
                  <span>Answers and support are saved separately.</span>
                </div>
              </div>
            ) : (
              <div className="empty">
                <h1>A useful pause.</h1>
                <p>Your session is saved.</p>
                <button className="primary" onClick={() => setFocused(false)}>
                  Back to Today
                </button>
              </div>
            )}
          </section>
        ) : (
          <>
            {view === "today" && (
              <>
                <section className="today-hero">
                  <div className="hero-copy">
                    <p className="eyebrow">A little German. More often.</p>
                    <h1>{home.lesson.title}</h1>
                    <p className="lead">{home.lesson.outcome}</p>
                    <div className="session-choices">
                      <fieldset>
                        <legend>Time for yourself</legend>
                        <div className="segmented">
                          {[5, 10, 15, 25].map((n) => (
                            <button
                              key={n}
                              aria-pressed={pref.minutes === n}
                              onClick={() => savePrefs({ ...pref, minutes: n })}
                              disabled={busy}
                            >
                              {n} min
                            </button>
                          ))}
                          <button onClick={() => setSettings(true)}>
                            Custom
                          </button>
                        </div>
                      </fieldset>
                      <button
                        className="audio-choice"
                        onClick={() =>
                          savePrefs({
                            ...pref,
                            audio:
                              pref.audio === "headphones"
                                ? "silent"
                                : "headphones",
                          })
                        }
                      >
                        {pref.audio === "headphones" ? (
                          <Headphones size={18} />
                        ) : (
                          <VolumeX size={18} />
                        )}{" "}
                        {pref.audio === "headphones" ? "Headphones" : "Silent"}
                      </button>
                    </div>
                    <button
                      className="primary large"
                      onClick={() => begin()}
                      disabled={busy}
                    >
                      {session && !session.complete
                        ? "Continue learning"
                        : "Begin today"}
                      <ArrowRight size={20} />
                    </button>
                    <p className="small muted">
                      {session && !session.complete
                        ? "Your place is saved. Pick up where you paused."
                        : "One task at a time. Leave whenever you need to."}
                    </p>
                  </div>
                  <div className="scenario-art" aria-hidden="true">
                    <span className="art-top">DE / ALLTAG</span>
                    <div className="art-circle">
                      <span>
                        Guten
                        <br />
                        <em>Tag.</em>
                      </span>
                    </div>
                    <div className="art-caption">
                      <span>{home.lesson.germanTitle}</span>
                      <span>01 — ∞</span>
                    </div>
                  </div>
                </section>
                <section className="daily-route">
                  <div className="section-heading">
                    <div>
                      <p className="eyebrow">Your rhythm</p>
                      <h2>Small sessions. Lasting recall.</h2>
                    </div>
                    <button
                      className="text-button"
                      onClick={() => setSettings(true)}
                    >
                      Arrange your day <ArrowRight size={16} />
                    </button>
                  </div>
                  <div className="route-list">
                    {pref.order.map((b, i) => (
                      <button
                        key={b}
                        className="route-row"
                        onClick={() =>
                          b === "conversation" ? run(loadBrief) : begin([b])
                        }
                        disabled={
                          busy ||
                          (b === "listening" &&
                            (pref.audio === "silent" ||
                              !home.listeningAvailable))
                        }
                      >
                        <span className="row-number">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <h3>{labels[b]}</h3>
                          <p>
                            {b === "recall"
                              ? `${home.due} due · up to ${pref.newLimit} new words or phrases per day`
                              : b === "scenario"
                                ? home.lesson.germanTitle
                                : b === "later"
                                  ? "Return to a pattern in a different sentence"
                                  : b === "conversation"
                                    ? "Take today’s situation into your German ChatGPT project"
                                    : b === "listening"
                                      ? pref.audio === "silent"
                                        ? "Available when you switch to headphones"
                                        : "A short recording, then one useful detail"
                                      : b === "writing"
                                        ? "A short message in your own words"
                                        : "Read a little. Retrieve the meaning."}
                          </p>
                        </div>
                        <ArrowRight size={18} />
                      </button>
                    ))}
                  </div>
                  <p className="small muted">
                    Aim for 45–60 minutes across your day. Five useful minutes
                    still count as practice.
                  </p>
                </section>
              </>
            )}
            {view === "practice" && (
              <section className="practice-page">
                <p className="eyebrow">Everyday German</p>
                <h1>Something you can use.</h1>
                <p className="lead">
                  Choose a situation. Practise it in small steps.
                </p>
                <input
                  className="search"
                  aria-label="Search scenarios"
                  placeholder="Find a situation…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="practice-tools">
                  <button
                    className="text-button"
                    onClick={() =>
                      begin(["later"], undefined, false, { weekly: true })
                    }
                  >
                    Try a fresh mixed check <ArrowRight size={16} />
                  </button>
                  <button
                    className="text-button"
                    onClick={() =>
                      run(async () =>
                        setLibrary(
                          await api<
                            LibraryCard[]
                          >("library"),
                        ),
                      )
                    }
                  >
                    Browse flashcards · A1, A2, B1 & cases <BookOpen size={16} />
                  </button>
                </div>
                <div className="scenario-list">
                  {home.bank
                    .filter((l) =>
                      `${l.title} ${l.germanTitle} ${l.outcome}`
                        .toLowerCase()
                        .includes(search.toLowerCase()),
                    )
                    .map((l, i) => (
                      <button
                        className="scenario-row"
                        key={l.id}
                        onClick={() =>
                          begin(
                            [
                              "scenario",
                              "reading",
                              ...(pref.audio === "headphones"
                                ? ["listening" as Block]
                                : []),
                              "writing",
                              "later",
                            ],
                            l.id,
                          )
                        }
                        disabled={busy}
                      >
                        <span className="row-number">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <h2>{l.germanTitle}</h2>
                          <p>{l.outcome}</p>
                        </div>
                        <ArrowRight size={20} />
                      </button>
                    ))}
                </div>
                <section className="note-panel">
                  <RotateCcw size={24} />
                  <div>
                    <h2>Just a little more recall?</h2>
                    <p>Extra practice is separate from scheduled reviews.</p>
                    <button
                      className="text-button"
                      onClick={() => begin(["recall"], undefined, true)}
                    >
                      Practise again <ArrowRight size={16} />
                    </button>
                  </div>
                </section>
              </section>
            )}
            {view === "progress" && (
              <section className="progress-page">
                <p className="eyebrow">Evidence, over time</p>
                <h1>See what’s staying.</h1>
                <p className="lead">
                  What you can retrieve and use without help.
                </p>
                {report ? (
                  <>
                    <ActivityTracker activity={report.activity} />
                    <h2>Your learning evidence</h2>
                    <div className="evidence-table">
                      {report.skills.map((s) => (
                        <div key={s.skill} className="evidence-row">
                          <h3>{s.skill}</h3>
                          <div>
                            <strong>
                              {s.checked
                                ? `${s.independent} / ${s.checked}`
                                : "Not assessed"}
                            </strong>
                            <p>
                              {s.checked
                                ? "checked attempts recalled without help"
                                : "Independent evidence is still needed."}
                              {s.delayed > 0
                                ? ` · ${s.delayed} after at least a day`
                                : ""}
                              {s.pending > 0
                                ? ` · ${s.pending} awaiting coaching`
                                : ""}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="small muted">
                      Hints and repairs are supported practice. Self-ratings and
                      conversation observations are labelled separately. These
                      are not Goethe scores.
                    </p>
                    <section className="subsection">
                      <h2>What needs another visit</h2>
                      {report.targets.length ? (
                        report.targets.map((t) => (
                          <div className="target-row" key={t.target}>
                            <span>{t.target.replaceAll("-", " ")}</span>
                            <span className="status">{t.status}</span>
                            <small>
                              {t.independent}/{t.count} fresh checks
                            </small>
                          </div>
                        ))
                      ) : (
                        <p className="muted">
                          Your first independent attempts will build this
                          picture.
                        </p>
                      )}
                    </section>
                    <section className="subsection">
                      <h2>From your conversations</h2>
                      {report.observations.length ? (
                        report.observations.map((o, i) => (
                          <article className="observation" key={i}>
                            <small>
                              {new Date(o.occurredAt).toLocaleDateString()} ·{" "}
                              {o.source}
                            </small>
                            <p>{o.summary}</p>
                            <p className="muted">
                              Next:{" "}
                              {o.nextTargets.join(", ") ||
                                "Continue current targets."}
                            </p>
                          </article>
                        ))
                      ) : (
                        <p className="muted">
                          Bring back a session summary from your German ChatGPT
                          project to keep practice connected.
                        </p>
                      )}
                      <button
                        className="text-button"
                        onClick={() => run(loadBrief)}
                      >
                        Open shared Learning Brief <ArrowRight size={16} />
                      </button>
                    </section>
                    <section className="subsection">
                      <h2>Your route toward B1</h2>
                      {curriculum.map((c) => (
                        <div className="curriculum-row" key={c.weeks}>
                          <span>Weeks {c.weeks}</span>
                          <div>
                            <h3>{c.title}</h3>
                            <p>{c.focus}</p>
                          </div>
                        </div>
                      ))}
                      <p className="muted">
                        A flexible 20-week route. Fresh weekly checks set the
                        pace; weeks do not certify completion.
                      </p>
                      <a
                        className="text-button"
                        href="https://www.goethe.de/ins/de/en/m/prf/gzb1/ueb.html"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Official Goethe B1 practice <ArrowRight size={16} />
                      </a>
                    </section>
                    <p className="small muted">
                      {report.cards.enrolled} recall directions enrolled ·{" "}
                      {report.cards.partialHistory} with incomplete legacy
                      history. Original review history and due dates are
                      preserved.
                    </p>
                  </>
                ) : (
                  <p>Loading your evidence…</p>
                )}
              </section>
            )}
          </>
        )}
      </main>
      <footer className="app-footer" inert={!!(settings || brief || library)}>
        <span>Little by little. In your own words.</span>
        <button className="text-button" onClick={() => run(loadBrief)}>
          <MessageCircle size={16} /> ChatGPT practice
        </button>
      </footer>
      {library && (
        <div className="modal-backdrop">
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label="Vocabulary library"
          >
            <button
              className="close icon-button"
              aria-label="Close library"
              onClick={() => setLibrary(null)}
            >
              <X />
            </button>
            <h2>Your flashcard library</h2>
            <p className="muted">{library.filter(c => c.level !== "cases").length} vocabulary cards · {library.filter(c => c.level === "cases").length} case cards. This is a growing selection, not the complete Goethe word lists.</p>
            <div className="deck-filters" aria-label="Flashcard deck">
              {[["all","All"],["a1","A1"],["a2","A2"],["b1","B1"],["cases","Cases"]].map(([value,label]) => <button key={value} aria-pressed={libraryLevel===value} onClick={()=>{setLibraryLevel(value);setLibraryVisible(40);}}>{label} · {library.filter(c=>value==="all" || c.level===value).length}</button>)}
            </div>
            {libraryLevel !== "all" && <div className="deck-actions">
              <button className="primary" onClick={()=>{setLibrary(null);begin(["recall"],undefined,false,{deck:libraryLevel as RecallDeck});}}>Study this deck <ArrowRight size={16}/></button>
              <button className="text-button" onClick={()=>{setLibrary(null);begin(["recall"],undefined,true,{deck:libraryLevel as RecallDeck});}}>Extra practice · no schedule changes</button>
            </div>}
            <input aria-label="Search vocabulary" placeholder="Search German or English…" value={librarySearch} onChange={e=>{setLibrarySearch(e.target.value);setLibraryVisible(40);}}/>
            <p className="small muted">New cards enter gradually. Daily Recall collects due cards across your decks. Existing reverse cards keep their own schedules.</p>
            {libraryMatches.slice(0,libraryVisible).map((c) => (
              <div className="library-row" key={c.id}>
                <strong lang="de">{c.german}</strong>
                <p>{c.english}</p>

                <button
                  className="text-button"
                  onClick={() => {
                    setLibrary(null);
                    begin(["recall"], undefined, false, {
                      cardId: `${c.id}:de`,
                    });
                  }}
                >
                  Study flashcard
                </button>
                <button
                  className="text-button"
                  onClick={() => {
                    setLibrary(null);
                    begin(["recall"], undefined, true, {
                      cardId: `${c.id}:de`,
                    });
                  }}
                >
                  Extra practice
                </button>
              </div>
            ))}
            {libraryMatches.length > libraryVisible && <button className="text-button" onClick={()=>setLibraryVisible(n=>n+40)}>Show more cards · {Math.min(libraryVisible,libraryMatches.length)} of {libraryMatches.length}</button>}
            <details className="vocabulary-sources"><summary>Vocabulary sources & coverage</summary><p>Goethe word lists guide the vocabulary selection. English meanings, practice examples and case cards are our teaching material, not an official Goethe deck. A1 labels use matched A1 headwords; other level labels are teaching bands. Full official-list coverage is not yet complete.</p>
              <a href="https://www.goethe.de/pro/relaunch/prf/sr/A1_SD1_Wortliste_02.pdf" target="_blank" rel="noreferrer">Goethe A1 list</a>{" · "}
              <a href="https://www.goethe.de/pro/relaunch/prf/en/Goethe-Zertifikat_A2_Wortliste.pdf" target="_blank" rel="noreferrer">Goethe A2 list</a>{" · "}
              <a href="https://www.goethe.de/pro/relaunch/prf/en/Goethe-Zertifikat_B1_Wortliste.pdf" target="_blank" rel="noreferrer">Goethe B1 list</a>
            </details>
          </section>
        </div>
      )}
      {settings && (
        <div className="modal-backdrop">
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
          >
            <button
              className="close icon-button"
              aria-label="Close settings"
              onClick={() => setSettings(false)}
            >
              <X />
            </button>
            <p className="eyebrow">Make room for learning</p>
            <h2 id="settings-title">Your preferences</h2>
            <label>
              Session length · minutes
              <input
                type="number"
                min="1"
                max="120"
                defaultValue={pref.minutes}
                onBlur={(e) => {
                  const n = Number(e.target.value);
                  if (n >= 1 && n <= 120 && n !== pref.minutes)
                    savePrefs({ ...pref, minutes: n });
                }}
              />
            </label>
            <label>
              New words or phrases per day
              <select
                value={pref.newLimit}
                onChange={(e) =>
                  savePrefs({ ...pref, newLimit: Number(e.target.value) })
                }
              >
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </label>
            <p className="small muted">
              Well-retained cards move to longer intervals. Desired retention:
              90% with FSRS.
            </p>
            <fieldset>
              <legend>Block order</legend>
              {pref.order.map((b, i) => (
                <div className="order-row" key={b}>
                  <span>{labels[b]}</span>
                  <button
                    className="icon-button"
                    aria-label={`Move ${labels[b]} up`}
                    disabled={i === 0 || busy}
                    onClick={() => {
                      const order = [...pref.order];
                      [order[i - 1], order[i]] = [order[i], order[i - 1]];
                      savePrefs({ ...pref, order });
                    }}
                  >
                    <ChevronUp size={17} />
                  </button>
                  <button
                    className="icon-button"
                    aria-label={`Move ${labels[b]} down`}
                    disabled={i === pref.order.length - 1 || busy}
                    onClick={() => {
                      const order = [...pref.order];
                      [order[i + 1], order[i]] = [order[i], order[i + 1]];
                      savePrefs({ ...pref, order });
                    }}
                  >
                    <ChevronDown size={17} />
                  </button>
                </div>
              ))}
            </fieldset>
            <label className="check-label">
              <input
                type="checkbox"
                checked={pref.preparation}
                onChange={(e) =>
                  savePrefs({ ...pref, preparation: e.target.checked })
                }
              />{" "}
              Allow the private daily preparation task to use this learning
              record
            </label>
            <p className="small muted">
              This grants record access to the owner-private preparation
              endpoint. A hosted schedule must also be configured.
            </p>
            <button
              className="text-button"
              onClick={() =>
                run(async () => {
                  const data = await api("export");
                  const url = URL.createObjectURL(
                    new Blob([JSON.stringify(data, null, 2)], {
                      type: "application/json",
                    }),
                  );
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "german-me-private-learning-export.json";
                  a.click();
                  URL.revokeObjectURL(url);
                })
              }
            >
              <Download size={17} /> Export my private learning record
            </button>
            <p className="small muted">
              System fonts. No autoplay. Reduced motion follows your device
              preference.
            </p>
            <button className="primary" onClick={() => setSettings(false)}>
              Done <Check size={17} />
            </button>
          </section>
        </div>
      )}
      {brief && (
        <div className="modal-backdrop">
          <section
            className="modal wide"
            role="dialog"
            aria-modal="true"
            aria-labelledby="brief-title"
          >
            <button
              className="close icon-button"
              aria-label="Close Learning Brief"
              onClick={() => setBrief(null)}
            >
              <X />
            </button>
            <p className="eyebrow">Practise together</p>
            <h2 id="brief-title">Your ChatGPT practice</h2>
            <p>Open your German project in ChatGPT. Use the same chat for both steps.</p>
            <div className="handoff-step">
              <h3>1. Before practice</h3>
              <p>Send this message in ChatGPT. Wait for it to load your record, then start voice or text practice.</p>
              <blockquote>Use German Me to load my latest Learning Brief. Help me practise today’s situation one question at a time.</blockquote>
              <button className="text-button" onClick={() => run(async () => {
                await navigator.clipboard.writeText("Use German Me to load my latest Learning Brief. Help me practise today’s situation one question at a time.");
                setHandoffCopied("Before-practice message copied. Paste it into ChatGPT.");
              })}><Copy size={16} /> Copy starting message</button>
            </div>
            <div className="handoff-step">
              <h3>2. After practice</h3>
              <p>Finish voice, then send this message in the same chat. Wait for a successful save confirmation.</p>
              <blockquote>Save this practice to German Me using the Learning Brief you loaded. Include my mistakes, hints and what to practise next. Confirm when saved.</blockquote>
              <button className="text-button" onClick={() => run(async () => {
                await navigator.clipboard.writeText("Save this practice to German Me using the Learning Brief you loaded. Include my mistakes, hints and what to practise next. Confirm when saved.");
                setHandoffCopied("After-practice message copied. Paste it into the same ChatGPT chat.");
              })}><Copy size={16} /> Copy saving message</button>
            </div>
            <p className="small muted">Then return to Progress to see your saved conversation and practice day.</p>
            <p className="handoff-status" role="status">{handoffCopied}</p>
            <details className="manual-handoff">
              <summary>Plugin not working? Copy practice manually</summary>
              <p><strong>Before practice:</strong> copy your learning notes below and paste them into your German ChatGPT chat.</p>
              <button className="text-button" onClick={() => run(async () => {
                await copyBrief();
                setHandoffCopied("Learning notes copied. Paste them into ChatGPT before practice.");
              })}>
                <Copy size={16} /> Copy learning notes
              </button>
              <p><strong>After practice:</strong> ask ChatGPT: “Give me the completed session-summary JSON using the template I pasted. Include only practice you observed.”</p>
              <p>Copy its reply into the box below and save. You don’t need to write or edit the JSON yourself.</p>
            <label>
              Import a session summary
              <textarea
                rows={5}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Paste the JSON session summary here"
              />
            </label>
            <button
              className="primary"
              disabled={busy || !importText.trim()}
              onClick={() =>
                run(async () => {
                  let payload;
                  try {
                    payload = JSON.parse(
                      importText
                        .replace(/^```(?:json)?\s*/, "")
                        .replace(/\s*```$/, ""),
                    );
                  } catch {
                    throw Error("Please paste a valid JSON summary.");
                  }
                  const r = await post({ action: "summary", ...payload });
                  setImportText("");
                  setNotice(
                    r.historical
                      ? "Saved as historical evidence. Newer priorities were preserved."
                      : "Session saved. Your next targets are updated.",
                  );
                  await refresh();
                  setBrief(null);
                  if (view === "progress")
                    setReport(await api<Progress>("progress"));
                })
              }
            >
              Save session summary <ArrowRight size={16} />
            </button>
            <p className="small muted">
              Importing the same summary twice won’t duplicate your practice.
            </p>
            </details>
            {error && <p className="error" role="alert">{error}</p>}
          </section>
        </div>
      )}
    </div>
  );
}
