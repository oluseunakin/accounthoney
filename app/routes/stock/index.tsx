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
    <div className="p-2">
      <div className="mt-3 mb-5 flex justify-center text-base text-blue-800 lg:justify-end">
        <div className="flex space-x-3">
          <Link to="/stock/create" className="hover:underline">
            Take Daily Stock
          </Link>
          <Link to="/stock/update" className="hover:underline">
            Update Daily Stock
          </Link>
        </div>
      </div>
      <div className="space-y-4">
        {stocks.map((stock, i) => (
          <div key={i} className="lg:flex lg:justify-center">
            <div className="lg:w-4/5 border p-2">
              <h2 className="flex justify-center text-2xl font-bold">
                {stock.date}
              </h2>
              <ProductComp products={stock.products} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
