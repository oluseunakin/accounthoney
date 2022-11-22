import type { OrderedProduct } from "@prisma/client";
import type { Order } from "~/models/order.server";
import { ProductComp } from "./Products";

export const OrderComponent = (prop: {
  order: Order & {
    orderedProducts: OrderedProduct[];
  };
}) => {
  const { order } = prop;
  return (
    <div className="space-y-10 lg:w-3/5">
      <div id="print" className="space-y-6">
        <h1 className="mb-3 text-2xl font-semibold">{order.customerName}</h1>
        <p>{order.date}</p>
        <ProductComp products={order.orderedProducts} />
      </div>
      <div className="flex justify-end px-3">
        <button
          type="button"
          onClick={(e) => window.print()}
          className="rounded bg-red-500 py-2 px-4 text-white hover:bg-red-400 focus:bg-red-600"
        >
          Print
        </button>
      </div>
    </div>
  );
};
