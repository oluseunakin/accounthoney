import type { User } from "@prisma/client";
import { useContext, useState } from "react";
import type { Product } from "~/models/products.server";
import { Context } from "~/root";
import type { PCategory } from "~/routes";

export type OrderedProduct = {
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
  setProduct: (product?: Product) => void;
  setUpdate: ((update: boolean) => void) | undefined;
  product: Product | undefined;
  isNewProduct: (newProduct: boolean) => void;
  addToStock: (stock: PCategory[]) => void;
  stock: PCategory[];
}) {
  const { setProduct, product, isNewProduct, addToStock, stock, setUpdate } =
    prop;
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="name">Enter name of Product</label>
        <div className="mt-1">
          <input
            id="name"
            className="w-full rounded border border-gray-500 px-2 py-1"
            type="text"
            name="name"
            value={product ? product.name : ""}
            onChange={(e) => {
              setProduct({ ...product!, name: e.target.value });
            }}
          />
        </div>
      </div>
      <div>
        <label htmlFor="category">Category</label>
        <div className="mt-1">
          <input
            id="category"
            type="text"
            className="w-full rounded border border-gray-500 px-2 py-1"
            value={product ? product.categoryName : ""}
            name="categoryName"
            onChange={(e) => {
              setProduct({ ...product!, categoryName: e.target.value });
            }}
          />
        </div>
      </div>
      <div>
        <label htmlFor="quantity">Quantity</label>
        <div className="mt-1">
          <input
            type="number"
            id="quantity"
            className="w-full rounded border border-gray-500 px-2 py-1"
            value={product ? product.quantity : 0}
            name="quantity"
            onChange={(e) =>
              setProduct({ ...product!, quantity: e.target.valueAsNumber })
            }
          />
        </div>
      </div>
      <div>
        <label htmlFor="price">Price</label>
        <div className="mt-1">
          <input
            type="number"
            id="price"
            className="w-full rounded border border-gray-500 px-2 py-1"
            value={product ? product.price : 0}
            name="price"
            onChange={(e) =>
              setProduct({ ...product!, price: e.target.valueAsNumber })
            }
          />
        </div>
      </div>
      <div className="flex justify-center">
        <div>
          <button
            onClick={(e) => {
              isNewProduct(false);
              if (setUpdate) {
                setUpdate!(false);
                setProduct()
              }
              addToStock(addToStockk(stock, product!));
            }}
            className="rounded bg-stone-800 py-2 px-4 text-white hover:bg-stone-700 focus:bg-stone-700"
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
  addToCart: (cart: OrderedProduct[]) => void;
  cart: OrderedProduct[];
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
            className="w-full rounded border border-gray-500 px-2 py-1"
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
              className="w-full rounded border border-gray-500 px-2 py-1"
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
                className="w-full rounded border border-gray-500 px-2 py-1"
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
                  "Is this price change one-off or permanent?"
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
  isNewProduct: (newProduct: boolean) => void;
  setProduct: (product: Product) => void;
  products: Product[] | undefined | null;
  message: string;
}) => {
  const { product, isNewProduct, setProduct, products, message } = prop;
  return (
    <select
      className="w-full rounded border border-gray-500 px-2 py-1 "
      //value={product ? product.name : ""}
      id="prod"
      name="prod"
      onChange={async (e) => {
        if (e.target.value === "create") {
          isNewProduct(true);
        } else {
          const selected = JSON.parse(e.target.value) as Product;

          setProduct(selected);
        }
      }}
    >
      <option defaultValue={product ? product.name : ""}>-------------</option>
      <option value="create">{message}</option>
      {products &&
        products?.map((product) => (
          <option value={JSON.stringify(product)} key={product.name}>
            {product.name}
          </option>
        ))}
    </select>
  );
};

export const ProductComp = (prop: {
  products: (Product | OrderedProduct)[];
}) => {
  const { products } = prop;
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
      <tbody>
        {products.map((product, i) => (
          <tr key={i} >
            <td className="px-5">{product.name}</td>
            <td className="px-5">{product.quantity}</td>
            <td className="px-5">{product.price}</td>
            <td className="px-5">{product.price * product.quantity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
