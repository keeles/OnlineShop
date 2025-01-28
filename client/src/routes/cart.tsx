import {Button} from "@/components/ui/button";
import {api} from "@/lib/api";
import {useQuery} from "@tanstack/react-query";
import {createFileRoute} from "@tanstack/react-router";

export const Route = createFileRoute("/cart")({
  component: Cart,
});

async function getCartProducts() {
  const res = await api.cart.$get();
  if (!res.ok) throw new Error("Server Error");
  const data = await res.json();
  return data;
}

function Cart() {
  const {isPending, error, data} = useQuery({queryKey: ["get-cart-products"], queryFn: getCartProducts});
  if (error) return <div>An error has occurred: {error.message}</div>;
  if (isPending) return <div>Loading...</div>;
  const cartProducts = data.productsWithImages;

  return (
    <div className="p-2 max-w-4xl mx-auto my-2 w-full border border-1 rounded-md">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Goodie</th>
            <th className="p-2 text-left">Price</th>
            <th className="p-2 text-left">Quantity</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {cartProducts.map((product) => (
            <tr>
              <td className="p-2">{product.title}</td>
              <td className="p-2">{product.price}</td>
              <td className="p-2 pl-14">1</td>
              <td className="p-2 flex justify-center">
                <img src={product.images[0]?.url} alt={product.title} className="w-32 h-32 object-cover rounded-sm" />
              </td>
            </tr>
          ))}
          <tr className="border-t">
            <td className="p-2">Total</td>
            <td className="p-2">{cartProducts.reduce((acc, nextVal) => acc + Number(nextVal.price), 0)}.00</td>
            <td className="p-2 pl-14">{cartProducts.length}</td>
            <td className="p-2 pt-4 flex justify-center">
              <Button>Checkout</Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
