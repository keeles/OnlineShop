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
    <>
      <NavBar />
      <hr />
      <Outlet />
    </>
  );
}

function NavBar() {
  return (
    <div className="p-2 flex gap-2 max-w-md justify-center">
      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>{" "}
      <Link to="/about" className="[&.active]:font-bold">
        About
      </Link>
      <Link to="/create-product" className="[&.active]:font-bold">
        Create
      </Link>
      <Link to="/profile" className="[&.active]:font-bold">
        Profile
      </Link>
    </div>
  );
}
