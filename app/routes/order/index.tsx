import type { Product, Stock, User } from "@prisma/client";
import { Link, useSubmit } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { useContext, useState } from "react";
import type { COrderedProduct } from "~/components/Products";
import { ProductComp } from "~/components/Products";
import { ProductComponent } from "~/components/Products";
import { createOrder } from "~/models/order.server";
import { Context } from "~/root";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const cart = form.get("cart");
  const userId = form.get("userId") as string;
  const orders = JSON.parse(cart as any) as COrderedProduct[];
  try {
    const order = await createOrder(orders, userId);
    return redirect("/order/print/" + order);
  } catch (e) {
    throw new Error();
  }
};

export default function Index() {
  const context = useContext(Context);
  const userr = context.data.user;
  let user: User | null = null;
  let stock:
    | (Stock & {
        products: Product[];
      })
    | null = null;
  if (userr) {
    user = JSON.parse(userr);
    const stockk = context.data.stock;
    if (stockk) stock = JSON.parse(stockk);
  }
  const [name, setName] = useState("");
  const [cart, addToCart] = useState<COrderedProduct[]>([]);
  const [error, setError] = useState("");
  const [orderMade, isOrderMade] = useState(false);
  const submit = useSubmit();
  let total = 0;
  cart.forEach((order) => {
    total = total + order.value;
  });
  let render;
  if (!user)
    render = (
      <div className="space-x-3 lg:flex lg:justify-center">
        <Link to="/join" className="text-blue-300 hover:underline">
          Sign Up
        </Link>{" "}
        or{" "}
        <Link to="/login" className="text-blue-300 hover:underline">
          Login
        </Link>{" "}
        first
      </div>
    );
  else if (stock)
    render = (
      <div className="m-2 space-y-3 border bg-slate-700 p-3 opacity-70 shadow-lg shadow-slate-200 md:mx-auto md:my-5 md:w-4/5 md:max-w-2xl lg:w-3/5">
        <h1 className="flex justify-center text-2xl">Make your order</h1>
        <div className="space-y-2">
          {user?.type !== "customer" && (
            <div className="mt-1">
              <label htmlFor="name">
                Name of buyer
                <input
                  className="w-full rounded border bg-slate-400 px-2 py-1 text-black"
                  id="name"
                  onBlur={async (e) => {
                    setName(e.target.value);
                  }}
                  defaultValue={name}
                />
              </label>
            </div>
          )}
          <ProductComponent
            products={stock?.products!}
            addToCart={addToCart}
            cart={cart}
            setError={setError}
          />
          {error && <p className="text-red-700">{error}</p>}
          {cart.length !== 0 && (
            <div className="flex justify-center">
              <ProductComp products={cart} />
            </div>
          )}
          <div className="mt-5">
            <button
              className="w-full rounded bg-red-500 py-2 px-4 text-white hover:bg-red-400 focus:bg-red-600"
              disabled={Boolean(error)}
              onClick={(e) => {
                isOrderMade(true);
              }}
            >
              Create Order
            </button>
          </div>
        </div>
      </div>
    );
  else
    render = (
      <div className="lg:flex lg:justify-center">No products in Stock</div>
    );
  if (orderMade)
    render = (
      <div className="m-2 space-y-3 border bg-slate-700 p-3 opacity-70 shadow-lg shadow-slate-200 md:mx-auto md:my-5 md:w-4/5 md:max-w-2xl lg:w-3/5">
        <h1 className="flex justify-center font-bold">Confirm Order</h1>
        <div className="flex justify-center"><ProductComp products={cart} /></div>
        <p className="p-4">Total: {total}</p>
        <div className="p-3">
          <button
            onClick={(e) => {
              const formdata = new FormData();
              let userId = user?.name;
              if (cart.length !== 0) {
                formdata.set("cart", JSON.stringify(cart));
                if (name !== "") userId = name;
                formdata.set("userId", userId!);
              }
              submit(formdata, { method: "post" });
            }}
            className="w-full rounded bg-red-500 py-2 px-4 text-white hover:bg-red-400 focus:bg-red-600"
          >
            Confirm
          </button>
        </div>
      </div>
    );
  return render;
}
