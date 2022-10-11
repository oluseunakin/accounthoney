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
    <div className="space-y-10">
      <div id="print" className="space-y-6">
        <div className="grid justify-items-center">
          <h1 className=" mb-3 text-2xl font-semibold">{order.customerName}</h1>
          <p>{order.date}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <ProductComp products={order.orderedProducts} />
        </table>
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
