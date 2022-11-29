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
  const [neww, isNew] = useState(false);
  const [prod, addToStock] = useState<PCategory[]>([]);
  const [product, setProduct] = useState<Product>(Object.create({}));
  return (
    <div className="mx-3 my-10 space-y-3 border bg-slate-700 p-3 opacity-70 shadow-lg shadow-slate-200 md:mx-auto md:w-4/5 md:max-w-2xl lg:w-3/5">
      <div>
        <Link to="/stock/" className="text-blue-300 hover:underline">
          Back
        </Link>
        <h1 className="flex justify-center text-2xl">Create Stock for Today</h1>
      </div>
      {neww ? (
        <NewProduct
          isAdded={() => undefined}
          stock={prod}
          addToStock={addToStock}
          product={product}
          isNew={isNew}
          setUpdate={undefined}
          setProduct={setProduct}
        />
      ) : (
        <Form method="post" ref={f} className="space-y-4">
          <div className="space-y-2">
            <div className="mt-1">
              <label htmlFor="prod">
                Select or Create a new Product
                <SelectProduct
                  message="Create a New Product"
                  isNew={isNew}
                  product={product}
                  setProduct={setProduct}
                  products={products}
                />
              </label>
            </div>
            {product && Object.keys(product).length != 0 && (
              <div>
                <div className="mt-1">
                  <label>
                    Category
                    <input
                      value={product.categoryName}
                      className="w-full rounded border bg-slate-400 px-2 py-1 text-black"
                      onChange={(e) => {
                        setProduct({
                          ...product,
                          categoryName: e.target.value,
                        });
                      }}
                    />
                  </label>
                </div>
                <div className="mt-1">
                  <label htmlFor="quantity">
                    Enter quantity
                    <input
                      className="w-full rounded border bg-slate-400 px-2 py-1 text-black"
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
                  </label>
                </div>
                <div className="mt-1">
                  <label>
                    Price
                    <input
                      type="number"
                      value={product.price}
                      className="w-full rounded border bg-slate-400 px-2 py-1 text-black"
                      onChange={(e) => {
                        setProduct({
                          ...product,
                          price: e.target.valueAsNumber,
                        });
                      }}
                    />
                  </label>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <div>
                <button
                  className="rounded bg-zinc-800 py-2 px-4 text-white hover:bg-zinc-600 focus:bg-zinc-900"
                  type="button"
                  onClick={(e) => {
                    addToStock((oldstock) => addToStockk(oldstock, product!));
                    setProduct(Object.create({}))
                    e.preventDefault();
                  }}
                >
                  Add to Stock
                </button>
              </div>
              {prod.length !== 0 && (
                <div>
                  {prod!.map((p, i) => (
                    <div
                      key={i}
                      className="flex flex-col justify-center space-y-1"
                    >
                      <p className="flex justify-center text-lg uppercase">
                        {p.name}
                      </p>
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
            {error && <div className="text-base text-red-400">{error}</div>}
          </div>
        </Form>
      )}
    </div>
  );
}
