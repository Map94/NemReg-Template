CREATE TABLE `_master_table` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`table_name` text NOT NULL,
	`description` text,
	`columns` text NOT NULL,
	`inserted` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text,
	`user_id` text NOT NULL,
	`client_id` text NOT NULL,
	`is_favorite` integer DEFAULT false,
	`is_archived` integer DEFAULT false,
	`record_count` integer DEFAULT 0
);
--> statement-breakpoint
CREATE UNIQUE INDEX `_master_table_table_name_unique` ON `_master_table` (`table_name`);--> statement-breakpoint
CREATE TABLE `table_activity` (
	`id` text PRIMARY KEY NOT NULL,
	`table_id` text,
	`user_id` text NOT NULL,
	`action` text NOT NULL,
	`details` text,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`table_id`) REFERENCES `_master_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `table_records` (
	`id` text PRIMARY KEY NOT NULL,
	`table_id` text NOT NULL,
	`record_data` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`table_id`) REFERENCES `_master_table`(`id`) ON UPDATE no action ON DELETE cascade
);
