import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { users } from "./users";
import { plans } from "./plans";
import { sessions } from "./sessions";

export const checkpoints = sqliteTable("checkpoints", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  planId: text("plan_id").references(() => plans.id, { onDelete: "set null" }),
  sessionId: text("session_id").references(() => sessions.id, { onDelete: "set null" }),
  
  // Checkpoint Type
  checkpointType: text("checkpoint_type").notNull(), // baseline, day_7, day_14, day_21, day_30
  dayNumber: integer("day_number").notNull(), // 1, 7, 14, 21, 30
  
  // Prompts Used (for replay comparison)
  speakingPromptId: text("speaking_prompt_id"),
  writingPromptId: text("writing_prompt_id"),
  
  // Recordings/Transcripts
  speakingTranscript: text("speaking_transcript"),
  writingResponse: text("writing_response"),
  
  // Scores
  fluencyScore: real("fluency_score"),
  accuracyScore: real("accuracy_score"),
  comprehensibilityScore: real("comprehensibility_score"),
  taskSuccessScore: real("task_success_score"),
  replayScore: real("replay_score"),
  
  // Comparison to Baseline
  baselineCheckpointId: text("baseline_checkpoint_id"),
  fluencyChange: real("fluency_change"),
  accuracyChange: real("accuracy_change"),
  comprehensibilityChange: real("comprehensibility_change"),
  taskSuccessChange: real("task_success_change"),
  replayScoreChange: real("replay_score_change"),
  
  // Insights (JSON)
  improvements: text("improvements"), // JSON: ["fewer article errors", "better verb conjugation"]
  focusAreas: text("focus_areas"), // JSON: ["word order", "pronunciation"]
  
  // Plan Updates Triggered
  planUpdated: integer("plan_updated", { mode: "boolean" }).default(false),
  
  // Timestamps
  completedAt: text("completed_at"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

export type Checkpoint = typeof checkpoints.$inferSelect;
export type NewCheckpoint = typeof checkpoints.$inferInsert;
