import {CardDescription, CardTitle} from "@/components/ui/card-hover-effect";
import {api} from "@/lib/api";
import {useQuery} from "@tanstack/react-query";
import {createFileRoute} from "@tanstack/react-router";

export const Route = createFileRoute("/product/$productId")({
  component: Product,
});
// const {productId} = Route.useParams();

// async function getProductById(id: string) {
//   const navigate = useNavigate();
//   const res = await api.products[":id{[0-9]+}"].$get({param: {id}});
//   if (!res.ok) navigate({to: "/"});
//   const product = await res.json();
//   console.log(product);
//   return product;
// }

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
  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error loading product.</div>;
  if (!data) return <div>Product not found</div>;
  console.log(data);
  return (
    <div className="p-2 max-w-3xl gap-y-4 flex flex-col items-center justify-center border border-1 rounded-md w-full">
      <CardTitle>{data.title}</CardTitle>
      <div className="flex flex-col justify-between space-x-10">
        <CardDescription>{data.description}</CardDescription>
        <CardDescription>${data.price}</CardDescription>
        <div className="w-96 h-vh">
          {data.images
            ? data.images.map((i) => {
                return (
                  <CardDescription className="rounded-md overflow-hidden" key={i.id}>
                    <img src={i.url} alt="" />
                  </CardDescription>
                );
              })
            : ""}
        </div>
      </div>
    </div>
  );
}
