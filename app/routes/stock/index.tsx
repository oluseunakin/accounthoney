import type { Product, Stock } from "@prisma/client";
import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { ProductComp } from "~/components/Products";
import { getAllStocks } from "~/models/stock.server";

export const loader: LoaderFunction = async () => {
  const stocks = await getAllStocks();
  return json(stocks.reverse());
};

export default function Index() {
  const stocks = useLoaderData<(Stock & { products: Product[] })[]>();
  return (
    <div className="space-y-5 p-2">
      <div className="flex justify-center space-x-3 text-blue-300 md:justify-end">
        <div>
          <Link to="/stock/create" className="hover:underline">
            Take Daily Stock
          </Link>
        </div>
        <div>
          <Link to="/stock/update" className="hover:underline">
            Update Daily Stock
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {stocks.map((stock, i) => (
          <div
            key={i}
            className="border flex flex-col justify-center bg-slate-700 opacity-70 shadow-md shadow-slate-200"
          >
            <h2 className="flex justify-center text-2xl font-bold">
              {stock.date}
            </h2>
            <ProductComp products={stock.products} />
          </div>
        ))}
      </div>
    </div>
  );
}
