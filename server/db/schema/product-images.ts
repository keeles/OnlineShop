import {index, serial, text} from "drizzle-orm/pg-core";
import {integer, pgTable} from "drizzle-orm/pg-core";
import {products} from "./products";
import {createInsertSchema} from "drizzle-zod";
import {z} from "zod";

export const productImages = pgTable(
  "product_images",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id),
    url: text("url").notNull(),
    name: text("name").notNull(),
  },
  (productImages) => {
    return {
      productIdIndex: index("product_id_idx").on(productImages.productId),
    };
  }
);

export const insertProductImageSchema = createInsertSchema(productImages, {
  productId: z.number().int().positive(),
  url: z.string().min(10, {message: "Url Error"}),
  name: z.string().min(3, {message: "File must have a name"}),
});
