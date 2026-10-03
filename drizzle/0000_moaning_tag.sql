CREATE TABLE `progress` (
	`user_id` text NOT NULL,
	`card_id` text NOT NULL,
	`due` integer NOT NULL,
	`interval` real NOT NULL,
	`ease` real NOT NULL,
	`reps` integer NOT NULL,
	`lapses` integer NOT NULL,
	`state` text NOT NULL,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`user_id`, `card_id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`request_id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`card_id` text NOT NULL,
	`rating` text NOT NULL,
	`reviewed_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_reviews_user_time` ON `reviews` (`user_id`,`reviewed_at`);