import type { OrderedProduct, User } from "@prisma/client";
import { useContext, useState } from "react";
import type { Product } from "~/models/products.server";
import { Context } from "~/root";
import type { PCategory } from "~/routes";

export type COrderedProduct = {
  name: string;
  quantity: number;
  id: number;
  permanent: boolean;
  price: number;
  value: number;
};

export function addToStockk(oldstock: PCategory[], product: Product) {
  if (oldstock.length !== 0) {
    const added = oldstock.every((old, i) => {
      if (old.name === product!.categoryName) {
        let products = old.products;
        products = products.concat([product!]);
        old.products = products;
        oldstock[i] = old;
        oldstock = [...oldstock];
        return false;
      } else return true;
    });
    if (added)
      oldstock = [
        ...oldstock,
        {
          name: product!.categoryName,
          products: [product!],
        },
      ];
  } else {
    oldstock = [
      {
        name: product!.categoryName,
        products: [product!],
      },
    ];
  }
  return oldstock;
}

export function NewProduct(prop: {
  product: Product | undefined;
  setState: (state: string) => void;
  addToStock: (stock: PCategory[]) => void;
  stock: PCategory[];
  isAdded?: (added: boolean) => void;
  setProduct: (product: Product) => void
}) {
  const { product, addToStock, stock, setState, isAdded, setProduct } = prop;
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="name">
          Enter name of Product
          <div className="mt-1">
            <input
              id="name"
              className="w-full rounded border bg-slate-400 px-2 py-1 text-black"
              type="text"
              name="name"
              value={product ? product.name : ""}
              onChange={(e) => {
                product!.name = e.target.value;
              }}
            />
          </div>
        </label>
      </div>
      <div>
        <label htmlFor="category">
          Category
          <div className="mt-1">
            <input
              id="category"
              type="text"
              className="w-full rounded border bg-slate-400 px-2 py-1 text-black"
              value={product ? product.categoryName : ""}
              name="categoryName"
              onChange={(e) => {
                product!.categoryName = e.target.value;
              }}
            />
          </div>
        </label>
      </div>
      <div>
        <label htmlFor="quantity">
          Quantity
          <div className="mt-1">
            <input
              type="number"
              id="quantity"
              className="w-full rounded border bg-slate-400 px-2 py-1 text-black"
              value={product ? product.quantity : 0}
              name="quantity"
              onChange={(e) => (product!.quantity = e.target.valueAsNumber)}
            />
          </div>
        </label>
      </div>
      <div>
        <label htmlFor="price">
          Price
          <div className="mt-1">
            <input
              type="number"
              id="price"
              className="w-full rounded border bg-slate-400 px-2 py-1 text-black"
              value={product ? product.price : 0}
              name="price"
              onChange={(e) => (product!.price = e.target.valueAsNumber)}
            />
          </div>
        </label>
      </div>
      <div className="flex justify-center">
        <div>
          <button
            onClick={(e) => {
              if (isAdded) isAdded(true);
              setState("");
              addToStock(addToStockk(stock, product!));
              setProduct(Object.create({}))
            }}
            className="rounded bg-red-500 py-2 px-4 text-white hover:bg-red-600 focus:bg-red-400"
          >
            Create Product
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProductComponent(prop: {
  products: Product[];
  addToCart: (cart: COrderedProduct[]) => void;
  cart: COrderedProduct[];
  setError: (oldState: string) => void;
}) {
  const user = JSON.parse(useContext(Context).data.user) as User;
  const { products, cart, addToCart, setError } = prop;
  const [priceChanged, isPriceChanged] = useState(false);
  const [state, setState] = useState({
    oldQuantity: -1,
    id: 0,
    price: 0,
    name: "",
    quantity: 0,
  });
  return (
    <div className="space-y-4">
      <div className="w-full">
        <label htmlFor="products">Choose product to buy</label>
        <div className="mt-1">
          <select
            id="products"
            className="w-full rounded border bg-slate-400 px-2 py-1"
            onChange={(e) => {
              const value = e.target.value;
              const index = e.target.selectedIndex - 1;
              const product = products[index];
              if (value !== "choose") {
                setState({
                  oldQuantity: product.quantity,
                  id: product.id,
                  price: product.price,
                  name: product.name,
                  quantity: product.quantity,
                });
              }
            }}
          >
            <option value="choose">Choose your product</option>
            {products?.map((prod, i) => (
              <option key={i} value={prod.name}>
                {prod.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {state.name !== "" && (
        <div className="space-y-2">
          <div>
            <input
              type="number"
              className="w-full rounded border bg-slate-400 px-2 py-1"
              value={state.quantity}
              onChange={(e) => {
                setState({ ...state, quantity: e.target.valueAsNumber });
              }}
            />
          </div>
          {priceChanged && (
            <div>
              <input
                type="number"
                className="w-full rounded border bg-slate-400 px-2 py-1"
                value={state.price}
                onChange={(e) => {
                  setState({ ...state, price: e.target.valueAsNumber });
                }}
              />
            </div>
          )}
          {user.type === "admin" && (
            <div>
              <input
                type="checkbox"
                value=""
                id="price"
                onChange={(e) => {
                  if (e.target.checked) isPriceChanged(true);
                  else isPriceChanged(false);
                }}
              />
              <label htmlFor="price">Check to set a new price</label>
            </div>
          )}
        </div>
      )}
      <div>
        <button
          className="rounded bg-zinc-800 py-2 px-4 text-white hover:bg-zinc-600 focus:bg-zinc-900"
          onClick={(e) => {
            if (state.quantity > state.oldQuantity)
              setError("We don't have up to that right now");
            else {
              let permanent = false;
              if (priceChanged) {
                permanent = confirm(
                  "Is this price change one-off or permanent?\n Press Ok if Permanent, Cancel if one-off"
                );
              }
              setError("");
              addToCart([
                ...cart,
                {
                  name: state.name,
                  quantity: state.quantity,
                  id: state.id,
                  permanent,
                  price: state.price,
                  value: state.price * state.quantity,
                },
              ]);
            }
            e.preventDefault();
          }}
        >
          Add to Order
        </button>
      </div>
    </div>
  );
}

export const SelectProduct = (prop: {
  product: Product | undefined;
  setState: (state: string) => void;
  setProduct: (product: Product) => void;
  products: Product[] | undefined | null;
  message: string;
}) => {
  const { setState, setProduct, products, message } = prop;
  return (
    <select
      className="w-full rounded border bg-slate-400 px-2 py-1"
      id="prod"
      name="prod"
      onChange={async (e) => {
        if (e.target.value === "create") {
          setState("new");
          setProduct(Object.create({}))
        } else {
          setState("update");
          const selected = JSON.parse(e.target.value) as Product;
          setProduct(selected);
        }
      }}
    >
      <option>-------------</option>
      <option value="create">{message}</option>
      {products &&
        products?.map((product) => (
          <option value={JSON.stringify(product)} key={product.id}>
            {product.name}
          </option>
        ))}
    </select>
  );
};

export const ProductComp = (prop: {
  products: (Product | OrderedProduct | COrderedProduct)[];
}) => {
  const { products } = prop;
  return (
    <table>
      <thead>
        <tr>
          <th className="p-1">Product Name</th>
          <th className="p-1">Quantity</th>
          <th className="p-1">Price</th>
          <th className="p-1">Value</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, i) => (
          <tr key={i}>
            <td className="p-1 text-center capitalize">{product.name}</td>
            <td className="p-1 text-center">{product.quantity}</td>
            <td className="p-1 text-center">{product.price}</td>
            <td className="p-1 text-center">
              {product.price * product.quantity}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
