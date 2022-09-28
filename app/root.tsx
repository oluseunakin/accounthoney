import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import React, { useContext } from "react";
import { useState } from "react";
import type { User } from "./models/user.server";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import mycss from "./styles/media.css";
import { convertDate } from "./utils";

export const Context = React.createContext({
  data: {
    user: "",
    stock: "",
    sorted: "",
  },
  getUser: (user: string) => {},
  getStock: (stock: string) => {},
  getSorted: (sorted: string) => {},
});

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: "stylesheet", href: mycss },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Account and Audit",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  const getUser = (user: string) => {
    setState((oldState) => {
      const { data } = oldState;
      return { ...oldState, data: { ...data, user } };
    });
  };

  const getStock = (stock: string) => {
    setState((oldState) => {
      const { data } = oldState;
      return { ...oldState, data: { ...data, stock } };
    });
  };

  const getSorted = (sorted: string) => {
    setState((oldState) => {
      const { data } = oldState;
      return { ...oldState, data: { ...data, sorted } };
    });
  };

  const [state, setState] = useState({
    data: {
      user: "",
      stock: "",
      sorted: "",
    },
    getUser,
    getSorted,
    getStock,
  });

  const user = state.data.user;
  const context = useContext(Context);
  let userr: User | null = null;
  if (user.length != 0) userr = JSON.parse(user) as User;
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <Context.Provider value={state}>
        <body className="h-full max-w-screen-2xl space-y-2 text-lg">
          <div className="columns-1 space-y-1 p-3 lg:columns-2">
            <div className="flex justify-center text-3xl font-bold text-blue-700 hover:underline ">
              <div>
                <Link to="/">HoneyHero Nigeria Limited</Link>
              </div>
            </div>
            <div className="lg:flex lg:justify-end">
              <div className="space-y-1 lg:flex lg:space-x-3 lg:space-y-0">
                <div className="flex justify-center font-semibold">
                  <div>Welcome {userr === null ? "Guest" : userr!.name}</div>
                </div>
                <div className="flex justify-center space-x-3">
                  {userr && (
                    <div>
                      <Link
                        to="/logout"
                        className="text-blue-800 hover:underline"
                        onClick={(e) => {
                          context.data = { user: "", sorted: "", stock: "" };
                          setState({
                            ...state,
                            data: { user: "", stock: "", sorted: "" },
                          });
                        }}
                      >
                        Logout
                      </Link>
                    </div>
                  )}
                  <div>{convertDate(new Date())}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-x-3 p-3 lg:flex ">
            <div className="flex justify-center lg:flex-none ">
              <div className="space-y-2 text-blue-800">
                <div className="flex justify-center">
                  <Link to="/order" className="hover:underline">
                    Order
                  </Link>
                </div>
                <div className="flex justify-center">
                  <Link to="/products" className="hover:underline">
                    Products
                  </Link>
                </div>
                <div className="flex justify-center">
                  <Link to="/about" className="hover:underline">
                    About
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex-grow">
              <Outlet />
            </div>
          </div>
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </Context.Provider>
    </html>
  );
}
