import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { users } from "./users";
import { errorJournalEntries } from "./errors";
import { vocabEntries } from "./vocab";

export const microReviews = sqliteTable("micro_reviews", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Review Content Type
  contentType: text("content_type").notNull(), // error, vocab
  errorEntryId: text("error_entry_id").references(() => errorJournalEntries.id, { onDelete: "cascade" }),
  vocabEntryId: text("vocab_entry_id").references(() => vocabEntries.id, { onDelete: "cascade" }),
  
  // Review Details
  reviewType: text("review_type").notNull(), // drill, flashcard, fill_blank, translate
  prompt: text("prompt").notNull(),
  expectedAnswer: text("expected_answer"),
  
  // Scheduling (Spaced Repetition)
  scheduledFor: text("scheduled_for").notNull(),
  dueDate: text("due_date").notNull(),
  intervalDays: integer("interval_days").default(1),
  easeFactor: real("ease_factor").default(2.5), // SM-2 algorithm
  repetitionNumber: integer("repetition_number").default(0),
  
  // Completion
  completed: integer("completed", { mode: "boolean" }).default(false),
  completedAt: text("completed_at"),
  userAnswer: text("user_answer"),
  wasCorrect: integer("was_correct", { mode: "boolean" }),
  
  // Priority
  priority: real("priority").default(1.0),
  
  // Timestamps
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

export type MicroReview = typeof microReviews.$inferSelect;
export type NewMicroReview = typeof microReviews.$inferInsert;
