import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const payments = sqliteTable("payments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  stripeSessionId: text("stripe_session_id").notNull().unique(),
  stripeCustomerId: text("stripe_customer_id"),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull(),
  status: text("status").notNull(), // 'pending', 'completed', 'failed'
  planId: text("plan_id").notNull(),
  customerEmail: text("customer_email"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(new Date()),
});

export const insertPaymentSchema = createInsertSchema(payments);
export const selectPaymentSchema = createSelectSchema(payments);
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;
