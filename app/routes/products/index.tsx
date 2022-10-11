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
    <table className="space-y-3" cellPadding={5}>
      <thead>
        <tr>
          <th className="px-5">Product Name</th>
          <th className="px-5">Quantity</th>
          <th className="px-5">Price</th>
          <th className="px-5">Value</th>
        </tr>
      </thead>
      <ProductComp products={allProducts} />
    </table>
  );
}
