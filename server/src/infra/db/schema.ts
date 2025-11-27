import { pgTable, serial, text, varchar, integer, timestamp } from 'drizzle-orm/pg-core';

export const links = pgTable('links', {
  id: serial('id').primaryKey(),
  short_url: varchar('short_url', { length: 10 }).unique().notNull(),
  original_url: text('original_url').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  access_count: integer('access_count').default(0).notNull(),
});