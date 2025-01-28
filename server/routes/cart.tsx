import {Hono} from "hono";
import {db} from "../db";
import {products as productsTable} from "../db/schema/products";
import {productImages as productImagesTable} from "../db/schema/product-images";
import {getSignedCookie, setSignedCookie} from "hono/cookie";
import {eq} from "drizzle-orm";

export const cartRoute = new Hono()
  .get("/", async (c) => {
    const secret = "secret-key";
    const cookie = await getSignedCookie(c, secret);
    console.log(cookie);
    try {
      const products = await db.select({products: productsTable, images: productImagesTable}).from(productsTable);
      return c.json({});
    } catch (err) {
      console.log(err);
      return c.json({}, 500);
    }
  })
  .post("/:id{[0-9]+}", async (c) => {
    console.log("adding to cart");
    const id = Number.parseInt(c.req.param("id"));
    try {
      const productExists = await db.select({id: productsTable.id}).from(productsTable).where(eq(productsTable.id, id));
      if (!productExists[0].id) throw new Error("Product does not exist");
      await setSignedCookie(c, "cart", String(productExists[0].id), "secret-key");
      return c.json({}, 200);
    } catch (err) {
      console.log(err);
      return c.json({}, 500);
    }
  });
