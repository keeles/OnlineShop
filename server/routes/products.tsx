import {Hono} from "hono";
import {zValidator} from "@hono/zod-validator";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {S3Client, PutObjectCommand, S3, GetObjectCommand} from "@aws-sdk/client-s3";
import {getUser} from "../kinde";
import {db} from "../db";
import {products as productsTable, insertProductSchema} from "../db/schema/products";
import {and, desc, eq} from "drizzle-orm";
import {createProductSchema, getImageUrlSchema, requestCreateProductSchema, productSchema} from "../sharedTypes";
import {insertProductImageSchema, productImages as productImagesTable} from "../db/schema/product-images";

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
  region: process.env.BUCKET_REGION!,
});

export const productsRoute = new Hono()
  .get("/", async (c) => {
    const products = await db
      .select({products: productsTable, images: productImagesTable})
      .from(productsTable)
      .leftJoin(productImagesTable, eq(productsTable.id, productImagesTable.productId))
      .orderBy(desc(productsTable.createdAt));

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
  })
  .post("/", getUser, zValidator("json", requestCreateProductSchema), async (c) => {
    const product = c.req.valid("json");
    const user = c.var.user;
    try {
      const validatedProduct = insertProductSchema.parse({
        title: product.title,
        description: product.description,
        price: product.price,
        userId: user.id,
      });
      if (!validatedProduct) return c.json({message: "Invalid"}, 400);
      const newProduct = await db
        .insert(productsTable)
        .values(validatedProduct)
        .returning()
        .then((res) => res[0]);
      const images = await Promise.all(
        product.images.map(async (image) => {
          await db
            .insert(productImagesTable)
            .values({
              name: image.fileName,
              productId: newProduct.id,
              url: image.url,
            })
            .returning()
            .then((res) => res[0]);
        })
      );
      return c.json(newProduct);
    } catch (err) {
      console.log(err);
      return c.json({}, 500);
    }
  })
  .get("/:id{[0-9]+}", async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const product = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id))
      .then((res) => res[0]);
    const productImages = await db.select().from(productImagesTable).where(eq(productImagesTable.productId, id));
    const imageWithUrls = await Promise.all(
      productImages.map(async (img) => {
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
    if (!product) return c.notFound();
    return c.json({...product, images: imageWithUrls});
  })
  .get("/user-products", getUser, async (c) => {
    const user = c.var.user;
    const products = await db
      .select({products: productsTable, images: productImagesTable})
      .from(productsTable)
      .where(eq(productsTable.userId, user.id))
      .leftJoin(productImagesTable, eq(productsTable.id, productImagesTable.productId))
      .orderBy(desc(productsTable.createdAt));

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
  })
  .post("/get-presigned-url", getUser, zValidator("json", getImageUrlSchema), async (c) => {
    const body = c.req.valid("json");
    const url = await generatePresignedUrl(body.fileName, body.fileType, body.fileSize);
    return c.json({url}, 200);
  })
  .delete("/:id{[0-9]+}", getUser, async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const user = c.var.user;
    try {
      await db
        .delete(productImagesTable)
        .where(eq(productImagesTable.productId, id))
        .returning({id: productsTable.id})
        .then((res) => res[0]);
      const product = await db
        .delete(productsTable)
        .where(and(eq(productsTable.id, id), eq(productsTable.userId, user.id)))
        .returning({id: productsTable.id})
        .then((res) => res[0]);
      if (!product) return c.notFound();
      return c.json(product);
    } catch (err) {
      return c.notFound();
    }
  });

async function generatePresignedUrl(fileName: string, fileType: string, fileSize: number) {
  const params = {
    Bucket: process.env.BUCKET_NAME!,
    Key: fileName,
    contentSize: fileSize,
    ContentType: fileType,
  };

  const command = new PutObjectCommand(params);
  const presignedUrl = await getSignedUrl(s3, command, {expiresIn: 60});
  return presignedUrl;
}
