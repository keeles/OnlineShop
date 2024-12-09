import {createFileRoute} from "@tanstack/react-router";
import {HoverEffect} from "@/components/ui/card-hover-effect";
import {api} from "../lib/api";
import {useQuery} from "@tanstack/react-query";

export const Route = createFileRoute("/")({
  component: Index,
});

async function getAllProducts() {
  const res = await api.products.$get();
  if (!res.ok) throw new Error("Server Error");
  const data = await res.json();
  return data.productsWithImages;
}

function Index() {
  const {isPending, error, data} = useQuery({queryKey: ["get-all-products"], queryFn: getAllProducts});

  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      <div className="max-w-5xl mx-auto px-8">
        {isPending ? <h1>Loading...</h1> : <HoverEffect items={data} profile={false} />}
      </div>
    </>
  );
}
