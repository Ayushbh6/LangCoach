import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { users } from "./users";
import { sessions } from "./sessions";

export const conversations = sqliteTable("conversations", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  sessionId: text("session_id").references(() => sessions.id, { onDelete: "set null" }),
  
  // Conversation Metadata
  title: text("title"), // Auto-generated or user-set title
  type: text("type").default("session"), // session, onboarding, review, freeform
  
  // Current Phase (for session conversations)
  currentPhase: text("current_phase"), // warmup, roleplay, correction, redo, wrap
  
  // State
  status: text("status").default("active"), // active, completed, abandoned
  
  // Message Counts
  messageCount: integer("message_count").default(0),
  userMessageCount: integer("user_message_count").default(0),
  assistantMessageCount: integer("assistant_message_count").default(0),
  
  // Token Tracking (for context window management)
  totalTokens: integer("total_tokens").default(0),
  
  // Timestamps
  startedAt: text("started_at").default(sql`(datetime('now'))`),
  lastMessageAt: text("last_message_at"),
  completedAt: text("completed_at"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;
