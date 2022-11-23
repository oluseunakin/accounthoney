import { Form, Link, useActionData, useSubmit } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { useContext, useRef, useState } from "react";
import { NewProduct, ProductComp, SelectProduct } from "~/components/Products";
import type { Product } from "~/models/products.server";
import type { Stock } from "~/models/stock.server";
import { updateStock } from "~/models/stock.server";
import { Context } from "~/root";
import type { AuditResponse, PCategory } from "~/routes";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const newProd = form.get("ns");
  const oldProd = form.get("update");
  const oldProducts = JSON.parse(oldProd as any) as Product[];
  const newProducts = JSON.parse(newProd as any) as Product[];
  const stockId = Number(form.get("stockId"));
  try {
    await updateStock(newProducts, oldProducts, stockId);
    return redirect("/");
  } catch (e) {
    throw new Error();
  }
};

export default function UpdateStock() {
  const submit = useSubmit();
  const context = useContext(Context);
  const stock: Stock & { products: Product[] } = JSON.parse(context.data.stock);
  const actionData = useActionData<AuditResponse>();
  if (actionData) var { error } = actionData;
  const f = useRef<HTMLFormElement>(null);
  const [newQuantity, setNewQuantity] = useState(0);
  const [newPrice, setNewPrice] = useState(0);
  const [prod, oldStock] = useState<Product[]>([]);
  const [ns, newStock] = useState<Product[]>([]);
  const [added, isAdded] = useState(false);
  const [state, setState] = useState("");
  const [product, setProduct] = useState<Product>(() => Object.create({}));
  const [nprod, addToStock] = useState<PCategory[]>([]);

  const getProducts = (products: PCategory[] | Product) => {
    if ("name" in products) return [products];
    return products.map((p) => p.products).flat();
  };

  return (
    <div className="mx-3 space-y-3 border bg-slate-700 p-3 opacity-70 shadow-lg shadow-slate-200 my-10 md:mx-auto md:w-4/5 md:max-w-2xl lg:w-3/5">
      <div>
        <Link to="/stock/" className="text-blue-300 hover:underline">
          Back
        </Link>
        <h1 className="flex justify-center text-2xl">Update Stock</h1>
      </div>
      {state === "new" ? (
        <NewProduct
          setProduct={setProduct}
          isAdded={undefined}
          stock={nprod}
          addToStock={addToStock}
          product={product}
          setState={setState}
        />
      ) : (
        <Form method="post" ref={f} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="prod">
              Update or Add a new Product
              <div className="mt-1">
                <SelectProduct
                  message="Add a New Product"
                  setState={setState}
                  product={product}
                  setProduct={setProduct}
                  products={stock.products}
                />
              </div>
            </label>
            {Object.keys(product).length !== 0 && (
              <div>
                <div className="flex justify-center">
                  {(nprod.length != 0 || product) && nprod.length != 0 ? (
                    <ProductComp products={getProducts(nprod)} />
                  ) : (
                    <ProductComp products={getProducts(product)} />
                  )}
                </div>
                {state === "update" && (
                  <>
                    <div>
                      <label htmlFor="quantity">New quantity</label>
                      <div className="mt-1">
                        <input
                          className="w-full rounded border bg-slate-400 px-2 py-1 text-black"
                          type="number"
                          name="quantity"
                          id="quantity"
                          value={newQuantity}
                          onChange={(e) => {
                            const quantity = e.target.valueAsNumber;
                            setNewQuantity(quantity);
                            setProduct({ ...product!, quantity });
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="price">New Price</label>
                      <div className="mt-1">
                        <input
                          className="w-full rounded border bg-slate-400 px-2 py-1 text-black "
                          type="number"
                          name="price"
                          id="price"
                          value={newPrice}
                          onChange={(e) => {
                            const price = e.target.valueAsNumber;
                            setNewPrice(price);
                            setProduct({ ...product!, price });
                          }}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          <div>
            <button
              className="rounded bg-zinc-800 py-2 px-4 text-white hover:bg-zinc-600 focus:bg-zinc-900"
              type="button"
              onClick={(e) => {
                if (nprod.length > 0) {
                  const products = getProducts(nprod);
                  setState("");
                  newStock(products);
                } else oldStock([...prod, product!]);
                isAdded(true);
                addToStock([]);
                setProduct(Object.create({}));
                e.preventDefault();
              }}
            >
              Add to Stock
            </button>
            {added && (
              <div className="flex justify-center">
                <ProductComp products={[...prod, ...ns]} />
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
                  formdata.set("update", JSON.stringify(prod));
                }
                if (ns) {
                  formdata.set("ns", JSON.stringify(ns));
                }
                formdata.set("stockId", stock.id.toString());
                submit(formdata, { method: "post" });
                e.preventDefault();
              }}
            >
              Update
            </button>
          </div>
          {error && <div className="text-base text-red-400">{error}</div>}
        </Form>
      )}
    </div>
  );
}
