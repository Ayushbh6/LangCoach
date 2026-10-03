import { sqliteTable, text, integer, real, primaryKey, index } from "drizzle-orm/sqlite-core";

export const progress = sqliteTable("progress", {
  userId: text("user_id").notNull(),
  cardId: text("card_id").notNull(),
  due: integer("due").notNull(),
  interval: real("interval").notNull(),
  ease: real("ease").notNull(),
  reps: integer("reps").notNull(),
  lapses: integer("lapses").notNull(),
  state: text("state").notNull(),
  updatedAt: integer("updated_at").notNull(),
}, table => [primaryKey({ columns: [table.userId, table.cardId] })]);

export const reviews = sqliteTable("reviews", {
  requestId: text("request_id").primaryKey(),
  userId: text("user_id").notNull(),
  cardId: text("card_id").notNull(),
  rating: text("rating").notNull(),
  reviewedAt: integer("reviewed_at").notNull(),
}, table => [index("idx_reviews_user_time").on(table.userId, table.reviewedAt)]);
