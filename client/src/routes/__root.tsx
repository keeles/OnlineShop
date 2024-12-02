import {createRootRoute, Link, Outlet} from "@tanstack/react-router";

export const Route = createRootRoute({
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
    <div className="p-2 flex gap-2">
      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>{" "}
      <Link to="/about" className="[&.active]:font-bold">
        About
      </Link>
      <Link to="/create-product" className="[&.active]:font-bold">
        Create
      </Link>
    </div>
  );
}
