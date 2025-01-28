import {type QueryClient} from "@tanstack/react-query";
import {userQuery} from "@/lib/api";
import {createRootRouteWithContext, Outlet} from "@tanstack/react-router";
import NavBar from "@/components/custom/nav-bar";

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
