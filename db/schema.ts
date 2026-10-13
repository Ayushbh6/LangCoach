import {
  sqliteTable,
  text,
  integer,
  real,
  primaryKey,
  index,
} from "drizzle-orm/sqlite-core";

export const progress = sqliteTable(
  "progress",
  {
    userId: text("user_id").notNull(),
    cardId: text("card_id").notNull(),
    due: integer("due").notNull(),
    interval: real("interval").notNull(),
    ease: real("ease").notNull(),
    reps: integer("reps").notNull(),
    lapses: integer("lapses").notNull(),
    state: text("state").notNull(),
    updatedAt: integer("updated_at").notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.cardId] })],
);

export const reviews = sqliteTable(
  "reviews",
  {
    requestId: text("request_id").primaryKey(),
    userId: text("user_id").notNull(),
    cardId: text("card_id").notNull(),
    rating: text("rating").notNull(),
    reviewedAt: integer("reviewed_at").notNull(),
  },
  (table) => [
    index("idx_reviews_user_time").on(table.userId, table.reviewedAt),
  ],
);

// Canonical private state plus an append-only evidence and idempotency ledger.
export const learningState = sqliteTable("learning_state", {
  userId: text("user_id").primaryKey(),
  version: integer("version").notNull(),
  body: text("body").notNull(),
  updatedAt: integer("updated_at").notNull(),
});
export const learningEvents = sqliteTable(
  "learning_events",
  {
    userId: text("user_id").notNull(),
    id: text("id").notNull(),
    kind: text("kind").notNull(),
    body: text("body").notNull(),
    createdAt: integer("created_at").notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.id] }),
    index("learning_events_user_time").on(t.userId, t.createdAt),
  ],
);
export const preparationBinding = sqliteTable("preparation_binding", {
  slot: text("slot").primaryKey(),
  userId: text("user_id").notNull(),
  enabled: integer("enabled").notNull(),
});
