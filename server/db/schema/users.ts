import {pgTable, text} from "drizzle-orm/pg-core";
import {createInsertSchema, createSelectSchema} from "drizzle-zod";

export const users = pgTable("users", {
  id: text("id").primaryKey().notNull(),
  given_name: text("first_name").notNull(),
  family_name: text("family_name"),
  picture: text("profile_pic"),
  email: text("email").notNull().unique(),
});

export const selectUserSchema = createSelectSchema(users);
