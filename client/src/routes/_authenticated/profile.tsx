import {createFileRoute} from "@tanstack/react-router";
import {userProductQuery, userQuery} from "@/lib/api";
import {useQuery} from "@tanstack/react-query";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import {HoverEffect} from "@/components/ui/card-hover-effect";
import {Login} from "../_authenticated";

export const Route = createFileRoute("/_authenticated/profile")({
  component: Profile,
});

function Profile() {
  const user = useQuery(userQuery);
  const userProducts = useQuery(userProductQuery);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  if (user.isPending) return <h1>Loading...</h1>;
  if (user.error) return <Login />;

  return (
    <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-lg">
      <div className="flex items-center space-x-6">
        <img
          src={user.data.picture || "/default-avatar.png"}
          alt="Profile Picture"
          className="w-32 h-32 rounded-full object-cover border-4 border-foreground"
        />
        <div>
          <h1 className="text-3xl font-semibold ">{`${user.data.given_name} ${user.data.family_name}`}</h1>
          <p className="">Username</p>
        </div>
        <div className="mt-6 flex justify-center">
          <Button onClick={toggleModal} className="">
            Edit Profile
          </Button>
        </div>
      </div>

      {userProducts.data ? <HoverEffect items={userProducts.data} /> : <h1>No Listings</h1>}

      <div className="mt-6 flex justify-center">
        <Button className="">
          <a href="/api/logout">Logout</a>
        </Button>
      </div>
      {isModalOpen && (
        <div className="mt-6 p-4 bg-background rounded-lg shadow-inner border border-foreground">
          <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <Label htmlFor="username" className="">
                Username
              </Label>
              <Input id="username" type="text" defaultValue="username" className="" />
            </div>
            <div>
              <Label htmlFor="picture" className="">
                Profile Picture
              </Label>
              <Input id="picture" type="file" className="" />
            </div>
            <Button type="submit" className="">
              Save Changes
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
