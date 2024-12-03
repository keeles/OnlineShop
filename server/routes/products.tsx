import {Hono} from "hono";
import {zValidator} from "@hono/zod-validator";
import {getUser} from "../kinde";
import {db} from "../db";
import {products as productsTable, insertProductSchema} from "../db/schema/products";
import {and, desc, eq} from "drizzle-orm";
import {createProductSchema} from "../sharedTypes";

export const productsRoute = new Hono()
  .get("/", async (c) => {
    const products = await db.select().from(productsTable).orderBy(desc(productsTable.createdAt));
    return c.json({products});
  })
  .post("/", getUser, zValidator("json", createProductSchema), async (c) => {
    const product = c.req.valid("json");
    const user = c.var.user;
    const validatedProduct = insertProductSchema.parse({
      ...product,
      userId: user.id,
    });
    const newProduct = await db
      .insert(productsTable)
      .values(validatedProduct)
      .returning()
      .then((res) => res[0]);
    return c.json(newProduct);
  })
  .get("/:id{[0-9]+}", async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const product = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id))
      .then((res) => res[0]);
    if (!product) return c.notFound();
    return c.json(product);
  })
  .get("/user-products", getUser, async (c) => {
    const user = c.var.user;
    const products = await db.select().from(productsTable).where(eq(productsTable.userId, user.id));
    return c.json(products);
  })
  .delete("/:id{[0-9]+}", getUser, async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const user = c.var.user;
    const product = await db
      .delete(productsTable)
      .where(and(eq(productsTable.id, id), eq(productsTable.userId, user.id)))
      .returning({id: productsTable.id})
      .then((res) => res[0]);
    if (!product) return c.notFound();
    return c.json(product);
  });
