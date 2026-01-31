import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { users } from "./users";
import { conversations } from "./conversations";
import { messages } from "./messages";

export const memories = sqliteTable("memories", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Source (where was this memory extracted from?)
  sourceConversationId: text("source_conversation_id").references(() => conversations.id, { onDelete: "set null" }),
  sourceMessageId: text("source_message_id").references(() => messages.id, { onDelete: "set null" }),
  
  // Memory Content
  type: text("type").notNull(), // preference, fact, goal, constraint, learning_style, strength, weakness
  category: text("category"), // language, schedule, motivation, personal, skill
  
  // The actual memory
  content: text("content").notNull(), // "User prefers morning sessions"
  
  // Structured data (optional, for specific memory types)
  key: text("key"), // e.g., "preferred_session_time"
  value: text("value"), // e.g., "morning"
  
  // Context about the memory
  language: text("language"), // If language-specific (de, fr, es)
  cefrLevel: text("cefr_level"), // If level-specific
  
  // Memory importance and usage
  importance: real("importance").default(1.0), // Higher = more likely to be retrieved
  accessCount: integer("access_count").default(0), // How often this memory was used
  lastAccessedAt: text("last_accessed_at"),
  
  // Confidence (how sure are we this memory is correct?)
  confidence: real("confidence").default(1.0), // 0.0 - 1.0
  
  // Status
  status: text("status").default("active"), // active, archived, contradicted
  
  // If this memory was superseded by a newer one
  supersededBy: text("superseded_by"),
  
  // For potential vector search (future enhancement)
  embedding: text("embedding"), // JSON array of floats, or null if not computed
  
  // Timestamps
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

export type Memory = typeof memories.$inferSelect;
export type NewMemory = typeof memories.$inferInsert;
