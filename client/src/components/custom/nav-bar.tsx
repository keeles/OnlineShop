import {Link} from "@tanstack/react-router";
import {Button} from "../ui/button";

export default function NavBar({user}: {user: boolean}) {
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
        <Link to="/cart" className="[&.active]:font-bold">
          Cart
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
