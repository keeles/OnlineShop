import {type Config} from "drizzle-kit";

export default {
  schema: "./server/db/schema/*",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
  out: "./drizzle",
} satisfies Config;
