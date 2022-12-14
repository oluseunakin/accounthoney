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
    <div
      id="print"
      className="m-2 space-y-3 border bg-slate-700 p-3 opacity-70 shadow-lg shadow-slate-200 md:mx-auto md:my-5 md:w-4/5 md:max-w-2xl lg:w-3/5"
    >
      <h1 className="flex justify-center text-xl">{customer.name}</h1>
      {customer.order.map((order, key) => (
        <div key={key} className="flex flex-col justify-center">
          <ProductComp products={order.orderedProducts} />
          <div className="text-lg font-bold text-red-500">on {order.date}</div>
        </div>
      ))}
    </div>
  );
}
