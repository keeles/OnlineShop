import {Hono} from "hono";
import {zValidator} from "@hono/zod-validator";
import z from "zod";

const productSchema = z.object({
  id: z.number().int().positive().min(1),
  title: z.string().min(3).max(40),
  description: z.string().min(3).max(350),
  price: z.number().positive(),
});

const createProductSchema = productSchema.omit({id: true});

type Product = z.infer<typeof productSchema>;

export const productsRoute = new Hono()
  .get("/", async (c) => {
    return c.json({products: fakeProducts});
  })
  .post("/", zValidator("json", createProductSchema), async (c) => {
    const product = c.req.valid("json");
    fakeProducts.push({...product, id: fakeProducts.length + 1});
    return c.json(product);
  })
  .get("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const product = fakeProducts.find((product) => product.id === id);
    if (!product) return c.notFound();
    return c.json(product);
  })
  .delete("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const index = fakeProducts.findIndex((product) => product.id === id);
    if (!index) return c.notFound();
    const deleted = fakeProducts.splice(index, 1)[0];
    return c.json(deleted);
  });

const fakeProducts: Product[] = [
  {
    id: 1,
    title: "Cozy Winter Beanie",
    description:
      "A snug and warm crochet beanie made with thick wool. Perfect for cold weather and stylish enough for any occasion.",
    price: 25,
  },
  {
    id: 2,
    title: "Fluffy Pom-Pom Hat",
    description:
      "This crochet hat features a cute fluffy pom-pom on top and a soft, stretchy design. A playful addition to your winter wardrobe.",
    price: 22,
  },
  {
    id: 3,
    title: "Boho Chic Slouchy Hat",
    description:
      "A laid-back slouchy crochet hat with intricate patterns and a relaxed fit. Great for adding a bohemian touch to your outfit.",
    price: 30,
  },
  {
    id: 4,
    title: "Classic Chunky Knit Cap",
    description:
      "Made with chunky yarn, this crochet cap provides maximum warmth without compromising style. A classic winter essential.",
    price: 28,
  },
  {
    id: 5,
    title: "Sunshine Straw Fedora",
    description:
      "Lightweight and breathable, this crochet fedora is perfect for sunny days. The perfect accessory for summer outings.",
    price: 18,
  },
  {
    id: 6,
    title: "Snowflake Winter Beanie",
    description:
      "This beanie features a beautiful snowflake design, crocheted with soft acrylic yarn for a comfortable fit and extra warmth.",
    price: 27,
  },
  {
    id: 7,
    title: "Vintage Crochet Cloche Hat",
    description:
      "Inspired by vintage styles, this cloche hat is crocheted with delicate detail and a soft, structured design. Ideal for dressing up or down.",
    price: 33,
  },
  {
    id: 8,
    title: "Striped Summer Visor",
    description:
      "A lightweight crochet visor hat with a striped pattern. Perfect for days at the beach or outdoor adventures.",
    price: 19,
  },
  {
    id: 9,
    title: "Patchwork Crochet Beanie",
    description:
      "This colorful crochet beanie features a patchwork design with a mix of vibrant yarns. A fun, cozy, and unique accessory.",
    price: 26,
  },
  {
    id: 10,
    title: "Lavender Crochet Headband Hat",
    description:
      "Combining the best of a headband and a beanie, this lavender crochet hat is perfect for keeping your ears warm in style.",
    price: 21,
  },
];
