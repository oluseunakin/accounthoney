import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import type { OrderedProduct } from "~/components/Products";
import { ProductComp } from "~/components/Products";
import type { Customer } from "~/models/customer.server";
import { getCustomer } from "~/models/customer.server";
import type { Order } from "~/models/order.server";

export const loader: LoaderFunction = async ({ params }) => {
  const customer = await getCustomer(params.slug as string);
  return json(customer);
};

export default function Index() {
  const customer = useLoaderData<
    Customer & { order: (Order & { orderedProducts: OrderedProduct[] })[] }
  >();
  return (
    <div id="print">
      <div className="flex justify-center">
        <h3 className="2xl font-semibold">{customer.name}</h3>
      </div>
      <table className="space-y-3" cellPadding={5}>
        <thead>
          <tr>
            <th className="px-5">Product Name</th>
            <th className="px-5">Quantity</th>
            <th className="px-5">Price</th>
            <th className="px-5">Value</th>
          </tr>
        </thead>
        {customer.order.map((order, i) => (
          <ProductComp key={i} products={order.orderedProducts} />
        ))}
      </table>
    </div>
  );
}
