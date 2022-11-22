import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { ProductComp } from "~/components/Products";
import type { Product } from "~/models/products.server";
import { getAllProducts } from "~/models/products.server";

export const loader: LoaderFunction = async () => {
  const allProducts = await getAllProducts();
  return json(allProducts);
};

export default function Index() {
  const allProducts = useLoaderData<Product[]>();
  return (
    <div className="space-y-3 flex justify-center border bg-slate-700 opacity-70 shadow-lg shadow-slate-200 md:mx-auto p-3 lg:w-3/5 md:w-4/5 md:max-w-2xl m-2 md:my-5">
      <ProductComp products={allProducts} />
    </div>
  );
}
