import {Hono} from "hono";
import {logger} from "hono/logger";
import {serveStatic} from "hono/bun";
import {productsRoute} from "./routes/products";
import {authRoute} from "./routes/auth";
import {cartRoute} from "./routes/cart";

const app = new Hono();

app.use("*", logger());

const apiRoutes = app
  .basePath("/api")
  .route("/products", productsRoute)
  .route("/", authRoute)
  .route("/cart", cartRoute);

app.get("*", serveStatic({root: "./client/dist"}));
app.get("*", serveStatic({path: "./client/dist/index.html"}));

export default app;
export type ApiRoutes = typeof apiRoutes;
