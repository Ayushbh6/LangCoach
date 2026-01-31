import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { users } from "./users";
import { sessions } from "./sessions";

export const errorJournalEntries = sqliteTable("error_journal_entries", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  sessionId: text("session_id").references(() => sessions.id, { onDelete: "set null" }),
  
  // Error Classification (Universal)
  errorType: text("error_type").notNull(), // grammar, word_order, agreement, article, tense, pronunciation, vocabulary_choice, register, spelling
  
  // Language-Specific Subtype
  subtype: text("subtype"), // e.g., "verb_second", "ser_estar", "gender_agreement", "dative_case"
  
  // Error Examples
  exampleWrong: text("example_wrong").notNull(),
  correctedVersion: text("corrected_version").notNull(),
  ruleHint: text("rule_hint"), // 1-2 line explanation
  
  // Context
  context: text("context"), // sentence/scenario context
  language: text("language").notNull(), // de, fr, es
  
  // Tracking
  recurrenceCount: integer("recurrence_count").default(1),
  lastSeenAt: text("last_seen_at").default(sql`(datetime('now'))`),
  
  // Mastery (0.0 - 1.0, higher = mastered)
  masteryScore: real("mastery_score").default(0),
  
  // Drill Templates (JSON array)
  drillTemplates: text("drill_templates"), // JSON: ["Fill in the blank: ___", "Translate: ..."]
  
  // Priority Weight (higher = more important to review)
  priorityWeight: real("priority_weight").default(1.0),
  
  // Status
  status: text("status").default("active"), // active, mastered, pruned
  
  // Timestamps
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

export type ErrorJournalEntry = typeof errorJournalEntries.$inferSelect;
export type NewErrorJournalEntry = typeof errorJournalEntries.$inferInsert;
