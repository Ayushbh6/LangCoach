"use client";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { shiftDate, type Activity } from "../lib/learning/activity";

function displayDate(date: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-GB", { ...options, timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
}
function moveMonth(month: string, offset: number) {
  const date = new Date(`${month}-01T12:00:00Z`);
  date.setUTCMonth(date.getUTCMonth() + offset);
  return date.toISOString().slice(0, 7);
}
export function ActivityTracker({ activity }: { activity: Activity }) {
  const [month, setMonth] = useState(activity.today.slice(0, 7));
  const [selected, setSelected] = useState(activity.today);
  const first = `${month}-01`;
  const offset = (new Date(`${first}T12:00:00Z`).getUTCDay() + 6) % 7;
  const count = new Date(`${moveMonth(month, 1)}-01T12:00:00Z`).getTime() - new Date(`${first}T12:00:00Z`).getTime();
  const dates = Array.from({ length: count / 86400000 }, (_, i) => shiftDate(first, i));
  const byDate = new Map(activity.days.map(day => [day.date, day]));
  const detail = byDate.get(selected);
  function navigate(offset: number) {
    const next = moveMonth(month, offset);
    setMonth(next);
    setSelected(next === activity.today.slice(0, 7) ? activity.today : `${next}-01`);
  }
  return <section className="activity-tracker" aria-labelledby="activity-heading">
    <p className="eyebrow">Your consistency</p>
    <h2 id="activity-heading">Every return counts.</h2>
    <p className="muted">A short practice counts. Your learning evidence below shows what’s staying.</p>
    <dl className="activity-stats">
      {[ [activity.currentStreak, "Current streak"], [activity.bestStreak, "Best streak"], [activity.activeDays, "Active days"], [`${activity.weekDays} / 7`, "This week"] ].map(([value, label]) => <div key={label}><dt>{label}</dt><dd>{value}<span>{label === "Current streak" || label === "Best streak" ? (value === 1 ? " day" : " days") : ""}</span></dd></div>)}
    </dl>
    <div className="activity-layout">
      <div className="practice-calendar">
        <div className="calendar-heading">
          <h3 aria-live="polite">{displayDate(first, { month: "long", year: "numeric" })}</h3>
          <div>
            <button className="icon-button" aria-label="Previous month" onClick={() => navigate(-1)}><ArrowLeft size={18}/></button>
            <button className="icon-button" aria-label="Next month" disabled={month >= activity.today.slice(0, 7)} onClick={() => navigate(1)}><ArrowRight size={18}/></button>
          </div>
        </div>
        <div className="calendar-grid" aria-label="Practice calendar">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => <span className="calendar-weekday" key={d}>{d}</span>)}
          {Array.from({ length: offset }, (_, i) => <span aria-hidden="true" key={`empty-${i}`}/>)}
          {dates.map(date => <button key={date}
            className={`calendar-day ${byDate.has(date) ? "practised" : ""} ${selected === date ? "selected" : ""}`}
            disabled={date > activity.today} aria-pressed={selected === date}
            aria-current={date === activity.today ? "date" : undefined}
            aria-label={`${displayDate(date, { day: "numeric", month: "long", year: "numeric" })}, ${byDate.has(date) ? "practice recorded" : "no recorded practice"}${date === activity.today ? ", today" : ""}`}
            onClick={() => setSelected(date)}>{Number(date.slice(-2))}{byDate.has(date) && <span className="practice-dot" aria-hidden="true"/>}</button>)}
        </div>
        <p className="calendar-legend small muted"><span className="practice-dot"/> Practice recorded · Vienna time</p>
        <button className="text-button" onClick={() => { setMonth(activity.today.slice(0, 7)); setSelected(activity.today); }}>Back to today</button>
      </div>
      <div className="activity-detail" aria-live="polite" aria-atomic="true">
        <p className="eyebrow">{selected === activity.today ? "Today" : "Your practice"}</p>
        <h3>{displayDate(selected, { weekday: "long", day: "numeric", month: "long" })}</h3>
        {detail ? <>
          <p>{detail.attempts} submitted {detail.attempts === 1 ? "attempt" : "attempts"}{detail.reviews ? ` · ${detail.reviews} flashcard ${detail.reviews === 1 ? "review" : "reviews"}` : ""}{detail.conversations ? ` · ${detail.conversations} saved ${detail.conversations === 1 ? "conversation" : "conversations"}` : ""}</p>
          {detail.scenarios.length > 0 && <div><h4>Situations</h4><ul>{detail.scenarios.map(s => <li key={s}>{s}</li>)}</ul></div>}
          {detail.skills.length > 0 && <div><h4>Practice</h4><p className="activity-skills">{detail.skills.join(" · ")}</p></div>}
          {detail.targets.length > 0 && <div><h4>What you worked on</h4><ul>{detail.targets.map(t => <li key={t}>{t.replaceAll("-", " ")}</li>)}</ul></div>}
          {detail.summaries.map(s => <p className="observation" key={s}>{s}</p>)}
        </> : <p className="muted">{selected === activity.today ? "No practice recorded yet today. Even a few answers are a useful start." : "No practice recorded for this day. You can return at your own pace."}</p>}
      </div>
    </div>
    <details className="activity-explainer"><summary>What counts toward my streak?</summary><p>Submitting an answer or flashcard review counts, including mistakes, hints and repairs. A saved conversation with concrete observations counts on the day it happened. Opening the app, preparing lessons and adding profile notes do not count. Unsynced answers appear after they are saved.</p><p>Your current streak stays available throughout today if you practised yesterday. This week runs Monday to Sunday in Europe/Vienna. A streak measures consistency, not mastery.</p></details>
  </section>;
}
