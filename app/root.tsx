import { useLocation, useMatches } from "@remix-run/react";
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
import mycss from "./styles/media.css";
import tailwindStylesheetUrl from "./styles/tailwind.css";

import { convertDate } from "./utils";
let isMount = true;
export function ErrorBoundary() {
  let location = useLocation();
  let matches = useMatches();

  React.useEffect(() => {
    let mounted = isMount;
    isMount = false;
    if ("serviceWorker" in navigator) {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller?.postMessage({
          type: "REMIX_NAVIGATION",
          isMount: mounted,
          location,
          matches,
          manifest: window.__remixManifest,
        });
      } else {
        let listener = async () => {
          await navigator.serviceWorker.ready;
          navigator.serviceWorker.controller?.postMessage({
            type: "REMIX_NAVIGATION",
            isMount: mounted,
            location,
            matches,
            manifest: window.__remixManifest,
          });
        };
        navigator.serviceWorker.addEventListener("controllerchange", listener);
        return () => {
          navigator.serviceWorker.removeEventListener(
            "controllerchange",
            listener
          );
        };
      }
    }
  }, [location]);

  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <link rel="manifest" href="/resources/manifest.webmanifest" />
        <Links />
      </head>
      <body>
        <div className=" grid h-full place-content-center text-2xl font-semibold">
          <div>An error has occured</div> <div>Reload this page</div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
export const Context = React.createContext({
  data: { user: "", stock: "", sorted: "" },
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
    data: { user: "", stock: "", sorted: "" },
    getUser,
    getSorted,
    getStock,
  });
  const user = state.data.user;
  const context = useContext(Context);
  let userr: User | null = null;
  if (user.length != 0) userr = JSON.parse(user) as User;
  return (
    <html lang="en">
      <head>
        <Meta />
        <link rel="manifest" href="/resources/manifest.webmanifest" />
        <Links />
      </head>
      <Context.Provider value={state}>
        <body className="space-y-6 bg-gradient-to-br from-slate-800 to-slate-500 bg-no-repeat p-2 text-slate-50">
          <div className="justify-around space-y-2 md:flex md:flex-wrap">
            <div className="flex justify-center text-2xl text-blue-300 hover:underline lg:text-3xl">
              <Link to="/">HoneyHero Nigeria Limited</Link>
            </div>
            <div className="flex flex-wrap justify-center space-x-2 lg:justify-end">
              <div className="justify-center capitalize">
                Welcome {userr === null ? "Guest" : userr!.name}
              </div>
              {userr && (
                <div>
                  <Link
                    to="/logout"
                    className="text-blue-300 hover:underline"
                    onClick={(e) => {
                      context.getUser("");
                      context.getSorted("");
                      context.getStock("");
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
          <div className="space-y-3 md:flex md:space-x-3 md:space-y-0">
            <div className="flex justify-center space-x-3 text-blue-300 md:h-max md:flex-col md:space-y-5 md:space-x-0">
              <div className="">
                <Link to="/order" className="hover:underline">
                  Order
                </Link>
              </div>
              <div className="">
                <Link to="/products" className="hover:underline">
                  Products
                </Link>
              </div>
              {/* <div className=""> <Link to="/about" className="hover:underline"> About </Link> </div> */}
            </div>
            <div className="flex-grow">
              <Outlet />
            </div>
          </div>
          <ScrollRestoration />
          <script
            src="https://kit.fontawesome.com/084c19ceda.js"
            crossOrigin="anonymous"
          ></script>
          <Scripts /> <LiveReload />
        </body>
      </Context.Provider>
    </html>
  );
}
