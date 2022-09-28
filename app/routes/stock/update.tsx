import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useSubmit,
} from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { useRef, useState } from "react";
import { NewProduct, ProductComp, SelectProduct } from "~/components/Products";
import type { Product } from "~/models/products.server";
import { getAllProducts } from "~/models/products.server";
import { getStockId, updateStock } from "~/models/stock.server";
import type { AuditResponse, PCategory } from "~/routes";
import { convertDate } from "~/utils";

export const loader: LoaderFunction = async () => {
  const products = await getAllProducts();
  const stockId = await getStockId(convertDate(new Date()));
  return json({ products, stockId });
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const newProd = form.get("ns");
  const oldProd = form.get("update");
  const oldProducts = JSON.parse(oldProd as any) as Product[];
  const newProducts = JSON.parse(newProd as any) as Product[];
  const stockId = Number(form.get("stockId"));
  try {
    updateStock(newProducts, oldProducts, stockId);
    return redirect("/");
  } catch (e) {
    throw new Error();
  }
};

export default function UpdateStock() {
  const submit = useSubmit();
  const { products, stockId } = useLoaderData<{
    products: Product[];
    stockId: { id: number };
  }>();
  const actionData = useActionData<AuditResponse>();
  if (actionData) var { error, message } = actionData;
  const f = useRef<HTMLFormElement>(null);
  const [newProduct, isNewProduct] = useState(false);
  const [newQuantity, setNewQuantity] = useState(0);
  const [newPrice, setNewPrice] = useState(0);
  const [prod, oldStock] = useState<Product[]>([]);
  const [ns, newStock] = useState<Product[]>([]);
  const [added, isAdded] = useState(false);
  const [update, setUpdate] = useState(true);
  const [product, setProduct] = useState<Product>();
  const [nprod, addToStock] = useState<PCategory[]>([
    {
      name: "",
      products: [],
    },
  ]);

  return (
    <div className="flex justify-center">
      <div className="space-y-4 lg:w-2/5">
        <div>
          <Link to="/stock/" className="text-blue-700 hover:underline">
            Back
          </Link>
          <h1 className="flex justify-center text-2xl">Update Stock</h1>
        </div>
        {newProduct ? (
          <NewProduct
            setUpdate={setUpdate}
            stock={nprod}
            addToStock={addToStock}
            setProduct={setProduct}
            product={product}
            isNewProduct={isNewProduct}
          />
        ) : (
          <Form method="post" ref={f} className="space-y-4">
            <div className="space-y-2">
              <div>
                <label htmlFor="prod">Update or Add a new Product</label>
                <div className="mt-1">
                  <SelectProduct
                    message="Add a New Product"
                    isNewProduct={isNewProduct}
                    product={product}
                    setProduct={setProduct}
                    products={products}
                  />
                </div>
              </div>
              {product?.name && (
                <div>
                  <ProductComp products={[product]} />
                  {update && (
                    <>
                      <div>
                        <label htmlFor="quantity">New quantity</label>
                        <div className="mt-1">
                          <input
                            className="w-full rounded border border-gray-500 px-2 py-1 "
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
                            className="w-full rounded border border-gray-500 px-2 py-1 "
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
                  if (product?.categoryName === "") {
                    const products = nprod.map((p) => p.products).flat();
                    isNewProduct(false);
                    newStock(products);
                  } else oldStock([...prod, product!]);
                  isAdded(true);
                  e.preventDefault();
                }}
              >
                Add to Stock
              </button>
              {added && (
                <div className="text-sm ">
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
                  formdata.set("stockId", stockId.id.toString());
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
    </div>
  );
}
