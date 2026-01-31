import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { users } from "./users";

export const plans = sqliteTable("plans", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  
  // Plan Metadata
  language: text("language").notNull(), // de, fr, es
  startLevel: text("start_level").notNull(), // A0, A1, A2, B1
  targetLevel: text("target_level").notNull(),
  
  // Timeline
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  totalDays: integer("total_days").notNull(),
  
  // Current Cycle (7-day rolling)
  currentCycleNumber: integer("current_cycle_number").default(1),
  currentCycleStartDate: text("current_cycle_start_date"),
  
  // Focus Areas (JSON array of error subtypes)
  focusErrors: text("focus_errors"), // JSON: ["verb_conjugation", "article_gender"]
  
  // Scaffolding Level (1-5, lower = more guided)
  scaffoldingLevel: integer("scaffolding_level").default(3),
  
  // Review vs New Content Ratio (0.0 - 1.0)
  reviewRatio: real("review_ratio").default(0.3),
  
  // Status
  status: text("status").default("active"), // active, paused, completed
  
  // Timestamps
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

export type Plan = typeof plans.$inferSelect;
export type NewPlan = typeof plans.$inferInsert;
