import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { users } from "./users";
import { sessions } from "./sessions";

export const vocabEntries = sqliteTable("vocab_entries", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  sessionId: text("session_id").references(() => sessions.id, { onDelete: "set null" }),
  
  // Word/Phrase
  term: text("term").notNull(),
  translation: text("translation"),
  language: text("language").notNull(), // de, fr, es
  
  // Usage Status
  usageStatus: text("usage_status").default("introduced"), // introduced, correct, misused
  
  // Context
  exampleSentence: text("example_sentence"),
  scenarioId: text("scenario_id"),
  cefrLevel: text("cefr_level"), // A1, A2, B1
  
  // Tracking
  correctUseCount: integer("correct_use_count").default(0),
  incorrectUseCount: integer("incorrect_use_count").default(0),
  lastUsedAt: text("last_used_at"),
  
  // Priority for Review
  priorityReview: integer("priority_review", { mode: "boolean" }).default(false),
  
  // Mastery Score (0.0 - 1.0)
  masteryScore: real("mastery_score").default(0),
  
  // Part of Speech
  partOfSpeech: text("part_of_speech"), // noun, verb, adjective, phrase, etc.
  
  // Timestamps
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

export type VocabEntry = typeof vocabEntries.$inferSelect;
export type NewVocabEntry = typeof vocabEntries.$inferInsert;
