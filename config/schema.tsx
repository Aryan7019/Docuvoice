import { integer, pgTable, varchar, text, json } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits: integer().default(0),
  clerkID: varchar({ length: 255 }).notNull().unique(),
});

export const SessionChatTable = pgTable('sessionChatTable', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  sessionId: varchar({ length: 255 }).notNull(),
  createdBy: varchar({ length: 255 }).references(() => usersTable.clerkID).notNull(),
  notes: text(),
  selectedDoctor: json(),
  report: json(),
  conversation: json(), 
  createdOn: varchar({ length: 255 }),
  consultationDuration: integer(),
  callStartedAt: varchar({ length: 255 }),
  callEndedAt: varchar({ length: 255 }), 
});