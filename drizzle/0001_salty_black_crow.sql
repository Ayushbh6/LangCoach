CREATE TABLE `learning_events` (
	`user_id` text NOT NULL,
	`id` text NOT NULL,
	`kind` text NOT NULL,
	`body` text NOT NULL,
	`created_at` integer NOT NULL,
	PRIMARY KEY(`user_id`, `id`)
);
--> statement-breakpoint
CREATE INDEX `learning_events_user_time` ON `learning_events` (`user_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `learning_state` (
	`user_id` text PRIMARY KEY NOT NULL,
	`version` integer NOT NULL,
	`body` text NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `preparation_binding` (
	`slot` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`enabled` integer NOT NULL
);
