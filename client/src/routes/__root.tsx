import {Button} from "@/components/ui/button";
import {type QueryClient} from "@tanstack/react-query";
import {userQuery} from "@/lib/api";
import {createRootRouteWithContext, Link, Outlet} from "@tanstack/react-router";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root,
  beforeLoad: async ({context}) => {
    const queryClient = context.queryClient;
    try {
      const user = await queryClient.fetchQuery(userQuery);
      return {user};
    } catch (err) {
      console.log(err);
      return {user: null};
    }
  },
});

function Root() {
  const {user} = Route.useRouteContext();
  return (
    <div className="flex flex-col items-center justify-center">
      <NavBar user={user ? true : false} />
      <hr />
      <Outlet />
    </div>
  );
}

function NavBar({user}: {user: boolean}) {
  return (
    <div className="p-2 flex justify-between gap-8 max-w-4xl items-center border border-1 rounded-md my-2 w-full">
      <div className="flex justify-evenly w-full">
        <Link to="/" className="[&.active]:font-bold">
          Shop
        </Link>{" "}
        <Link to="/create-product" className="[&.active]:font-bold">
          List
        </Link>
        <Link to="/profile" className="[&.active]:font-bold">
          Profile
        </Link>
      </div>
      {user ? (
        <a href="/api/logout">
          <Button>Logout</Button>
        </a>
      ) : (
        <a href="/api/login">
          <Button>Login</Button>
        </a>
      )}
    </div>
  );
}
