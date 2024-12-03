import {pgTable, serial, text, numeric, index, timestamp} from "drizzle-orm/pg-core";
import {createInsertSchema, createSelectSchema} from "drizzle-zod";
import {z} from "zod";

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    price: numeric("price", {precision: 12, scale: 2}).notNull(),
    userId: text("user_id").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (products) => {
    return {
      userIdIndex: index("user_id_idx").on(products.userId),
    };
  }
);

export const insertProductSchema = createInsertSchema(products, {
  title: z
    .string()
    .min(3, {message: "Title must be at least 3 characters"})
    .max(40, {message: "Title cannot be more than 40 characters"}),
  description: z
    .string()
    .min(3, {message: "Description must be at least 3 characters"})
    .max(350, {message: "Description cannot be more than 350 characters"}),
  price: z.string().regex(/^[+-]?[0-9]{1,3}(?:,?[0-9]{3})*\.[0-9]{2}$/, {message: "Invalid Price"}),
});
export const selectProductSchema = createSelectSchema(products, {
  title: z
    .string()
    .min(3, {message: "Title must be at least 3 characters"})
    .max(40, {message: "Title cannot be more than 40 characters"}),
  description: z
    .string()
    .min(3, {message: "Description must be at least 3 characters"})
    .max(350, {message: "Description cannot be more than 350 characters"}),
  price: z.string().regex(/^[+-]?[0-9]{1,3}(?:,?[0-9]{3})*\.[0-9]{2}$/, {message: "Invalid Price"}),
});
