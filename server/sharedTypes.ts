import {z} from "zod";
import {selectProductSchema} from "./db/schema/products";
import {selectUserSchema} from "./db/schema/users";

export const productSchema = selectProductSchema;

export const createProductSchema = selectProductSchema.omit({id: true, userId: true, createdAt: true});

export const requestCreateProductSchema = createProductSchema.extend({
  images: z.array(
    z.object({
      fileName: z.string(),
      url: z.string(),
    })
  ),
});

export const getImageUrlSchema = z.object({
  fileName: z.string(),
  fileType: z.string(),
  fileSize: z.number().int().positive(),
});

export const userSchema = selectUserSchema;
