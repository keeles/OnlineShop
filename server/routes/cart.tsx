import {Hono} from "hono";
import {db} from "../db";
import {products as productsTable} from "../db/schema/products";
import {productImages as productImagesTable} from "../db/schema/product-images";
import {getSignedCookie, setSignedCookie} from "hono/cookie";
import {eq, inArray} from "drizzle-orm";
import {GetObjectCommand} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {s3} from "./products";
import {randomUUIDv7} from "bun";

export const cartRoute = new Hono()
  .get("/", async (c) => {
    const secret = process.env.SECRET_COOKIE_KEY!;
    const cookie = await getSignedCookie(c, secret);
    const cookies = Object.values(cookie).map((c) => Number(c));
    try {
      const products = await db
        .select({products: productsTable, images: productImagesTable})
        .from(productsTable)
        .where(inArray(productsTable.id, cookies))
        .leftJoin(productImagesTable, eq(productsTable.id, productImagesTable.productId));
      const productsWithImages = await Promise.all(
        products.map(async (row) => {
          const product = row.products;
          const images = row.images ? [row.images] : [];

          const imagesWithUrl = await Promise.all(
            images.map(async (img) => {
              const getObjectParams = {
                Bucket: process.env.BUCKET_NAME!,
                Key: img.name,
              };
              const command = new GetObjectCommand(getObjectParams);
              const url = await getSignedUrl(s3, command);
              return {
                id: img.id,
                name: img.name,
                productId: img.productId,
                url: url,
              };
            })
          );
          return {
            id: product.id,
            title: product.title,
            description: product.description,
            price: product.price,
            userId: product.userId,
            createdAt: product.createdAt,
            images: imagesWithUrl,
          };
        })
      );
      return c.json({productsWithImages});
    } catch (err) {
      console.log(err);
      return c.json({}, 500);
    }
  })
  .post("/:id{[0-9]+}", async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    try {
      const productExists = await db.select({id: productsTable.id}).from(productsTable).where(eq(productsTable.id, id));
      if (!productExists[0].id) throw new Error("Product does not exist");
      await setSignedCookie(
        c,
        `${randomUUIDv7("base64url")}`,
        String(productExists[0].id),
        process.env.SECRET_COOKIE_KEY!
      );
      return c.json({}, 200);
    } catch (err) {
      console.log(err);
      return c.json({}, 500);
    }
  });
