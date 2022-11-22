import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { getUser } from "~/session.server";
import { Link, useCatch, useLoaderData, useNavigate } from "@remix-run/react";
import { getStockForTheDay } from "~/models/stock.server";
import { fileProducts } from "~/utils";
import type { Category } from "~/models/category.server";
import { getCategory } from "~/models/category.server";
import type { Product } from "~/models/products.server";
import { useContext, useEffect } from "react";
import { StockComp } from "~/components/Stock";
import { Context } from "~/root";

export type LoaderData = {
  user?: Awaited<ReturnType<typeof getUser>>;
  stock?: Awaited<ReturnType<typeof getStockForTheDay>>;
  sorted?: { [k: string]: Product[] };
  customer?: string;
};
export type AuditResponse = {
  error?: string;
  message?: any;
};

export type PCategory = {
  name: string;
  products: Product[];
};

export function CatchBoundary() {
  const caught = useCatch();
  console.log(caught.data);
  return <div>{caught.data}</div>;
}

export function ErrorBoundary() {
  return (
    <div className="flex justify-center">
      <div className="lg:w-3/5">Error has occured</div>
    </div>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  if (!user) return redirect("/login");
  const stock = await getStockForTheDay();
  if (stock) {
    const { products } = stock;
    const categories = (await Promise.all(
      products.map((product) => getCategory(product.categoryName))
    )) as Category[];
    const s = await fileProducts(categories, products);
    const sorted = Object.fromEntries(s.entries());
    return json<LoaderData>({ sorted, user, stock });
  } else {
    return json<LoaderData>({ user });
  }
};

export default function Index() {
  const context = useContext(Context);
  const { sorted, stock, user } = useLoaderData<LoaderData>();
  const search = useNavigate();
  useEffect(() => {
    context.getSorted(JSON.stringify(sorted));
    context.getStock(JSON.stringify(stock));
    context.getUser(JSON.stringify(user))
  }, []);
  return (
    <div className="space-y-7">
      <div className="flex flex-wrap justify-center space-x-3 md:justify-end">
        <div className="flex space-x-3 text-blue-300">
          <div>
            <Link to="/stock" className="hover:underline">
              Stock
            </Link>
          </div>
          <div>
            <Link to="/audit" className="hover:underline">
              Audit
            </Link>
          </div>
          <div>
            <Link to="/customer" className="hover:underline">
              Customers
            </Link>
          </div>
        </div>
        <div>
          <input
            placeholder="Search for Customer"
            type="search"
            className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                const name = e.currentTarget.value;
                const to = `/customer/${name}`;
                search(to);
              }
            }}
          />
        </div>
      </div>
      <StockComp />
    </div>
  );
}
