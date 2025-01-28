import {Button} from "@/components/ui/button";
import {CardDescription, CardTitle} from "@/components/ui/card-hover-effect";
import {api} from "@/lib/api";
import {useMutation, useQuery} from "@tanstack/react-query";
import {createFileRoute} from "@tanstack/react-router";

export const Route = createFileRoute("/product/$productId")({
  component: Product,
});

function Product() {
  const {productId} = Route.useParams();
  const {isPending, error, data} = useQuery({
    queryKey: ["get-product"],
    queryFn: async () => {
      const res = await api.products[":id{[0-9]+}"].$get({param: {id: productId}});
      if (!res.ok) {
        throw new Error("Server Error");
      }
      return (await res.json()) as {
        id: number;
        title: string;
        description: string;
        price: string;
        images: {
          id: number;
          name: string;
          productId: number;
          url: string;
        }[];
      };
    },
  });

  const addToCart = useMutation({
    mutationFn: async (productId: number) => {
      return await api.cart[":id{[0-9]+}"].$post({param: {id: String(productId)}});
    },
  });

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error loading product.</div>;
  if (!data) return <div>Product not found</div>;

  return (
    <div className="p-2 max-w-4xl flex items-center justify-evenly border border-1 rounded-md w-full">
      <div className="w-11/12 mx-4">
        {data.images
          ? data.images.map((i) => {
              return (
                <CardDescription className="rounded-md overflow-hidden mb-8" key={i.id}>
                  <img src={i.url} alt="" className="" />
                </CardDescription>
              );
            })
          : ""}
      </div>
      <div className="space-y-5">
        <CardTitle>{data.title}</CardTitle>
        <CardDescription>{data.description}</CardDescription>
        <CardDescription>${data.price}</CardDescription>
        <div>
          <Button
            onClick={(e) => {
              e.preventDefault();
              if (addToCart.isSuccess) return;
              addToCart.mutate(data.id);
            }}
          >
            {addToCart.isSuccess ? <>Added to cart</> : <>Add to Cart</>}
          </Button>
        </div>
      </div>
    </div>
  );
}
