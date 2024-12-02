import {createFileRoute} from "@tanstack/react-router";
import {userQuery} from "@/lib/api";
import {useQuery} from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/profile")({
  component: Profile,
});

function Profile() {
  const {isPending, error, data} = useQuery(userQuery);

  if (isPending) return <h1>Loading...</h1>;
  if (error) return <h1>Not Logged in</h1>;
  return (
    <div>
      <h1>{`${data.given_name} ${data.family_name}`}</h1>
      <a href="/api/logout">Logout</a>
    </div>
  );
}
