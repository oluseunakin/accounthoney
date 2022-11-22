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

  if (sorted)
    return (
      <div className="space-y-4 ">
        {Object.entries(sorted).map((o, i) => {
          const name = o[0];
          const products = o[1];
          return (
            <div className="space-y-5 py-3 m-auto flex flex-col justify-center border bg-slate-700 opacity-70 shadow-md shadow-slate-200 lg:max-w-2xl" key={i}>
              <h2 className="font-bold uppercase m-auto">
                {name}
              </h2>
              <ProductComp products={products} />
            </div>
          );
        })}
      </div>
    );
  return null;
}
