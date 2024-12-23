import {Hono} from "hono";
import {kindeClient} from "../kinde";
import {sessionManager} from "../kinde";
import {getUser} from "../kinde";
import {db} from "../db";
import {users as usersTable} from "../db/schema/users";

export const authRoute = new Hono()
  .get("/login", async (c) => {
    const loginUrl = await kindeClient.login(sessionManager(c));
    return c.redirect(loginUrl.toString());
  })
  .get("/register", async (c) => {
    const registerUrl = await kindeClient.register(sessionManager(c));
    return c.redirect(registerUrl.toString());
  })
  .get("/callback", async (c) => {
    const url = new URL(c.req.url);
    await kindeClient.handleRedirectToApp(sessionManager(c), url);
    const user = await kindeClient.getUser(sessionManager(c));
    if (user) {
      try {
        await db.insert(usersTable).values({
          ...user,
        });
        return c.redirect("/");
      } catch (err) {
        console.log(err);
        return c.redirect("/");
      }
    }
    return c.redirect("/");
  })
  .get("/logout", async (c) => {
    const logoutUrl = await kindeClient.logout(sessionManager(c));
    return c.redirect(logoutUrl.toString());
  })
  .get("/me", getUser, async (c) => {
    const user = c.var.user;
    return c.json(user);
  });
