import {Hono} from "hono";
import {logger} from "hono/logger";
import {productsRoute} from "./routes/products";

const app = new Hono();

app.use("*", logger());

app.get("/test", (c) => {
  return c.json({message: "test"});
});

app.route("/api/products", productsRoute);

export default app;
