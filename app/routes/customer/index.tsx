import type { OrderedProduct } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { CustomerComp } from "~/components/Customer";
import type { Customer } from "~/models/customer.server";
import { getAllCustomers } from "~/models/customer.server";
import type { Order } from "~/models/order.server";

export const loader: LoaderFunction = async () => {
  const customers = await getAllCustomers();
  return json(customers);
};

export default function Index() {
  const customers =
    useLoaderData<
      (Customer & {
        order: (Order & { orderedProducts: OrderedProduct[] })[];
      })[]
    >();
  return (
    <div className="lg:w-4/5">
      <CustomerComp customers={customers} />
    </div>
  );
}
