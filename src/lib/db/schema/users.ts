import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  
  // Profile
  displayName: text("display_name"),
  targetLanguage: text("target_language"), // de, fr, es
  nativeLanguage: text("native_language"),
  
  // CEFR Level (A0, A1, A2, B1, B2)
  selfAssessedLevel: text("self_assessed_level"),
  placementLevel: text("placement_level"),
  currentLevel: text("current_level"),
  
  // Goals & Preferences
  goalDomain: text("goal_domain"), // daily_life, work, exam, travel, move
  targetDays: integer("target_days").default(30),
  minutesPerDay: integer("minutes_per_day").default(30),
  daysPerWeek: integer("days_per_week").default(5),
  preferredMode: text("preferred_mode").default("voice"), // voice, text, mixed
  
  // Onboarding Status
  onboardingComplete: integer("onboarding_complete", { mode: "boolean" }).default(false),
  baselineCaptured: integer("baseline_captured", { mode: "boolean" }).default(false),
  
  // Timestamps
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
