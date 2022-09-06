import type { Customer } from "~/models/customer.server";
import type { Order } from "~/models/order.server";
import type { OrderedProduct } from "./Products";
import { ProductComp } from "./Products";

export function CustomerComp(prop: {
  customers: (Customer & {
    order: (Order & { orderedProducts: OrderedProduct[] })[];
  })[];
}) {
  const { customers } = prop;
  return (
    <div>
      {customers.map((customer, i) => (
        <div key={i} id="print">
          <div className="flex justify-center">
            <h3 className="2xl font-semibold">{customer.name}</h3>
          </div>
          {customer.order.map((order, i) => (
            <div key={i}>
              <ProductComp products={order.orderedProducts} />
            </div>
          ))}
        </div>
      ))}
      <div className="mt-4 flex justify-end">
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
