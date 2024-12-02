import {userQuery} from "@/lib/api";
import {createFileRoute, Outlet} from "@tanstack/react-router";

const Login = () => {
  return (
    <>
      <div>Not logged in</div>
      <a href="/api/login">Login</a>
    </>
  );
};

const Component = () => {
  const {user} = Route.useRouteContext();
  if (!user) {
    return <Login />;
  }
  return <Outlet />;
};

// src/routes/_authenticated.tsx
export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({context}) => {
    const queryClient = context.queryClient;
    try {
      const user = queryClient.fetchQuery(userQuery);
      return {user};
    } catch (err) {
      console.error(err);
      return {user: null};
    }
  },
  component: Component,
});
