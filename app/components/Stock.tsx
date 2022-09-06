import { useContext } from "react";
import type { Product } from "~/models/products.server";
import { Context } from "~/root";
import { ProductComp } from "./Products";

export function StockComp() {
  const context = useContext(Context);
  let sorted = null;
  const user = context.data.user;
  const sort = context.data.sorted;
  if (user !== "" && sort !== undefined)
    sorted = JSON.parse(sort) as { [k: string]: Product[] };

  return (
    <div className="space-y-4 divide-y divide-dashed">
      {sorted &&
        Object.entries(sorted).map((o, i) => {
          const name = o[0];
          const products = o[1];
          return (
            <div className="space-y-5" key={i}>
              <div className="flex justify-center">
                <h2 className="flex justify-self-center font-bold">{name}</h2>
              </div>
              <div className="flex justify-center">
              <ProductComp products={products} /></div>
            </div>
          );
        })}
    </div>
  );
}
