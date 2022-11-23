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
    <div className="mx-3 space-y-3 border bg-slate-700 p-3 opacity-70 shadow-lg shadow-slate-200 md:mx-auto my-5 md:w-4/5 md:max-w-2xl lg:w-3/5">
      <div id="print" className="flex justify-center flex-col">
        <h1 className="mb-3 text-2xl font-semibold flex justify-center">{order.customerName}</h1>
        <p className="mb-6 flex justify-center">{order.date}</p>
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
