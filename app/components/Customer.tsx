import type { OrderedProduct } from "@prisma/client";
import type { Customer } from "~/models/customer.server";
import type { Order } from "~/models/order.server";
import { ProductComp } from "./Products";

export function CustomerComp(prop: {
  customers: (Customer & {
    order: (Order & { orderedProducts: OrderedProduct[] })[];
  })[];
}) {
  const { customers } = prop;
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
      {customers.map((customer, i) => (
        <div key={i} className="border bg-slate-700 p-3 opacity-70 shadow-md shadow-slate-200">
          <h1 className="flex justify-center capitalize font-semibold 2xl">
            {customer.name}
          </h1>
          {customer.order.map((order, i) => (
            <div key={i}>
              <ProductComp products={order.orderedProducts} />
            </div>
          ))}
        </div>
      ))}
      <div className="lg:col-span-3 md:col-span-2 flex justify-end self-end">
        <button
          className="rounded bg-red-500 py-2 px-4 text-white hover:bg-red-400 focus:bg-red-600"
          type="button"
          onClick={(e) => window.print()}
        >
          Print
        </button>
      </div>
    </div>
  );
}
