import type { OrderedProduct } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
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
    <div id="print" className="border lg:w-4/5 p-2 space-y-4">
      <div className="flex justify-center">
        <h3 className="2xl font-semibold">{customer.name}</h3>
      </div>
      <ProductComp products={(customer.order.map(cust => cust.orderedProducts).flat())} />
    </div>
  );
}
