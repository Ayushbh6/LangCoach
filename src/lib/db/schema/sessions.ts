import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { users } from "./users";
import { plans } from "./plans";

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  planId: text("plan_id").references(() => plans.id, { onDelete: "set null" }),
  
  // Session Type
  sessionType: text("session_type").notNull(), // regular, checkpoint, placement, baseline
  scenarioId: text("scenario_id"),
  scenarioVariant: text("scenario_variant"), // A1, A2, B1
  
  // Session Mode
  mode: text("mode").default("voice"), // voice, text, mixed
  
  // Duration & Timing
  startedAt: text("started_at"),
  completedAt: text("completed_at"),
  durationMinutes: integer("duration_minutes"),
  speakingTimeSeconds: integer("speaking_time_seconds"),
  
  // Transcript
  transcript: text("transcript"),
  
  // Scores (Replay Score components)
  fluencyScore: real("fluency_score"), // words per minute normalized
  accuracyScore: real("accuracy_score"), // errors per 100 words normalized
  comprehensibilityScore: real("comprehensibility_score"), // 1-5 scale
  taskSuccessScore: real("task_success_score"), // 1-5 scale
  replayScore: real("replay_score"), // composite score
  
  // Correction Summary
  correctionsCount: integer("corrections_count").default(0),
  redoAttempted: integer("redo_attempted", { mode: "boolean" }).default(false),
  redoSuccessful: integer("redo_successful", { mode: "boolean" }),
  
  // Status
  status: text("status").default("in_progress"), // in_progress, completed, abandoned
  
  // Phase Tracking
  currentPhase: text("current_phase"), // warmup, roleplay, correction, redo, wrap
  
  // Timestamps
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
