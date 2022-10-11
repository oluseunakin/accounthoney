import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import ReactDOMServer from "react-dom/server";
import { OrderComponent } from "~/components/Order";
import { sendEmail } from "~/models/email.server";
import { getOrderByIdWithOrders } from "~/models/order.server";

export const loader: LoaderFunction = async ({ params }) => {
  const order = await getOrderByIdWithOrders(Number(params.slug));
  const ret = ReactDOMServer.renderToStaticMarkup(
    <div className="flex justify-center">
      <OrderComponent order={order!} />
    </div>
  );
  sendEmail("sexyjenny955@gmail.com", ret);
  return json(order);
};

export default function PrintSlug() {
  const order = useLoaderData();
  return (
    <div className="flex justify-center">
      <OrderComponent order={order!} />
    </div>
  );
}
