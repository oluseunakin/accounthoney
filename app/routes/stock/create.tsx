import type { Product } from "@prisma/client";
import {
  useSubmit,
  useActionData,
  Form,
  useLoaderData,
  Link,
} from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import type { Ref } from "react";
import { useRef, useState } from "react";
import {
  addToStockk,
  NewProduct,
  ProductComp,
  SelectProduct,
} from "~/components/Products";
import { getAllProducts } from "~/models/products.server";
import { createStock } from "~/models/stock.server";
import type { AuditResponse, PCategory } from "..";

export const loader: LoaderFunction = async () => {
  const allProducts = await getAllProducts();
  return json(allProducts);
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const prod = form.get("prod");
  const products = JSON.parse(prod as any) as Product[];
  try {
    await createStock(products);
    return redirect("/");
  } catch (e) {
    throw new Error();
  }
};

export default function StockHome() {
  const submit = useSubmit();
  const products = useLoaderData<Product[]>();
  const actionData = useActionData<AuditResponse>();
  if (actionData) var { error } = actionData;
  const f = useRef() as any as Ref<HTMLFormElement>;
  const [state, setState] = useState("");
  const [prod, addToStock] = useState<PCategory[]>([]);
  const [product, setProduct] = useState<Product>();

  return (
    <div className="p-3 lg:flex lg:justify-center">
      <div className="space-y-4 lg:w-2/5">
        <div>
          <Link to="/stock/" className="text-blue-700 hover:underline">
            Back
          </Link>
          <h1 className="flex justify-center text-2xl">
            Create Stock for Today
          </h1>
        </div>
        {state === "new" ? (
          <NewProduct
            isAdded={() => undefined}
            stock={prod}
            addToStock={addToStock}
            setProduct={setProduct}
            product={product}
            setState={setState}
          />
        ) : (
          <Form method="post" ref={f} className="space-y-4">
            <div className="space-y-2">
              <div>
                <label htmlFor="prod">Select or Create a new Product</label>
                <div className="mt-1">
                  <SelectProduct
                    message="Create a New Product"
                    setState={setState}
                    product={product}
                    setProduct={setProduct}
                    products={products}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="quantity" className="text-base">
                  Enter quantity
                </label>
                <div className="mt-1">
                  <input
                    className="w-full rounded border border-gray-500 px-2 py-1"
                    type="number"
                    name="quantity"
                    id="quantity"
                    value={product ? product.quantity : 0}
                    onChange={(e) =>
                      setProduct({
                        ...product!,
                        quantity: e.target.valueAsNumber,
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <button
                  className="rounded bg-zinc-800 py-2 px-4 text-white hover:bg-zinc-600 focus:bg-zinc-900"
                  type="button"
                  onClick={(e) => {
                    addToStock((oldstock) => addToStockk(oldstock, product!));
                    e.preventDefault();
                  }}
                >
                  Add to Stock
                </button>
                {prod.length !== 0 && (
                  <div>
                    {prod!.map((p, i) => (
                      <div key={i} className="space-y-1 ">
                        <p className="flex justify-center">{p.name}</p>
                        <ProductComp products={p.products} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="grid justify-items-center ">
                <button
                  className="w-full rounded bg-red-500 py-2 px-4 text-white hover:bg-red-400 focus:bg-red-600"
                  type="submit"
                  onClick={(e) => {
                    const formdata = new FormData();
                    if (prod) {
                      const products = prod.map((p) => p.products).flat();
                      formdata.set("prod", JSON.stringify(products));
                    }
                    submit(formdata, { method: "post" });
                    e.preventDefault();
                  }}
                >
                  Create Stock
                </button>
              </div>
            </div>
            {error && <div className="text-base text-red-400">{error}</div>}
          </Form>
        )}
      </div>
    </div>
  );
}
