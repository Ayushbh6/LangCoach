import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { users } from "./users";
import { conversations } from "./conversations";

export const messages = sqliteTable("messages", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  conversationId: text("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  
  // Message Content
  role: text("role").notNull(), // system, user, assistant
  content: text("content").notNull(),
  
  // For voice messages
  audioUrl: text("audio_url"), // Path to audio file if voice input
  transcribedFrom: text("transcribed_from"), // "voice" if this was transcribed
  
  // Context about when this message was sent
  sessionPhase: text("session_phase"), // warmup, roleplay, correction, redo, wrap
  
  // Token counts (for context window tracking)
  tokenCount: integer("token_count"),
  
  // LLM metadata (useful for debugging/analysis)
  model: text("model"), // Which model generated this (for assistant messages)
  provider: text("provider"), // openai, gemini, openrouter, ollama
  
  // Response timing
  latencyMs: integer("latency_ms"), // How long the LLM took to respond
  
  // For tracking corrections/edits
  isEdited: integer("is_edited", { mode: "boolean" }).default(false),
  originalContent: text("original_content"), // If edited, store original
  
  // Sequence number within conversation
  sequenceNumber: integer("sequence_number").notNull(),
  
  // Timestamps
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
