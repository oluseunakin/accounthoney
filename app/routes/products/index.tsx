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
    <div className="border p-2 lg:w-4/5">
      <ProductComp products={allProducts} />
    </div>
  );
}
