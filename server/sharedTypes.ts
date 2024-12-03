import {selectProductSchema} from "./db/schema/products";
import {selectUserSchema} from "./db/schema/users";

export const productSchema = selectProductSchema;

export const createProductSchema = selectProductSchema.omit({id: true, userId: true, createdAt: true});

export const userSchema = selectUserSchema;
