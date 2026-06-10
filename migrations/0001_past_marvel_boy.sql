CREATE TABLE `alert_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`alert_type` text NOT NULL,
	`severity` text NOT NULL,
	`subject` text NOT NULL,
	`body` text NOT NULL,
	`channel` text NOT NULL,
	`delivered` integer DEFAULT false NOT NULL,
	`error_message` text,
	`created_at` integer DEFAULT '"2026-06-10T18:23:06.913Z"' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `session_anomalies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`anomaly_type` text NOT NULL,
	`severity` text NOT NULL,
	`plan_id` text,
	`price_id` text,
	`ip_address` text,
	`user_agent` text,
	`error_message` text,
	`stripe_session_id` text,
	`resolved` integer DEFAULT false NOT NULL,
	`alert_sent` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT '"2026-06-10T18:23:06.911Z"' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `webhook_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`stripe_event_id` text NOT NULL,
	`event_type` text NOT NULL,
	`status` text NOT NULL,
	`processing_ms` integer,
	`error_message` text,
	`raw_payload` text,
	`stripe_session_id` text,
	`plan_id` text,
	`customer_email` text,
	`received_at` integer DEFAULT '"2026-06-10T18:23:06.908Z"' NOT NULL,
	`processed_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `webhook_events_stripe_event_id_unique` ON `webhook_events` (`stripe_event_id`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_payments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`stripe_session_id` text NOT NULL,
	`stripe_customer_id` text,
	`amount` integer NOT NULL,
	`currency` text NOT NULL,
	`status` text NOT NULL,
	`plan_id` text NOT NULL,
	`customer_email` text,
	`created_at` integer DEFAULT '"2026-06-10T18:23:06.902Z"' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_payments`("id", "stripe_session_id", "stripe_customer_id", "amount", "currency", "status", "plan_id", "customer_email", "created_at") SELECT "id", "stripe_session_id", "stripe_customer_id", "amount", "currency", "status", "plan_id", "customer_email", "created_at" FROM `payments`;--> statement-breakpoint
DROP TABLE `payments`;--> statement-breakpoint
ALTER TABLE `__new_payments` RENAME TO `payments`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `payments_stripe_session_id_unique` ON `payments` (`stripe_session_id`);