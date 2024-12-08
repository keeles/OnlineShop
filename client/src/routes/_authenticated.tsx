import {Button} from "@/components/ui/button";
import {userQuery} from "@/lib/api";
import {createFileRoute, Outlet} from "@tanstack/react-router";

export const Login = () => {
  return (
    <>
      <div>
        <h3>Not logged in</h3>
        <a href="/api/login">
          <Button>Login</Button>
        </a>
      </div>
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
