import {type QueryClient} from "@tanstack/react-query";
import {createRootRouteWithContext, Link, Outlet} from "@tanstack/react-router";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root,
});

function Root() {
  return (
    <div className="flex flex-col items-center justify-center">
      <NavBar />
      <hr />
      <Outlet />
    </div>
  );
}

function NavBar() {
  return (
    <div className="p-2 flex justify-between gap-8 max-w-3xl items-center">
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
  );
}
