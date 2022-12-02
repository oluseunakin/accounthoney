import type { OrderedProduct } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { useEffect } from "react";
import { OrderComponent } from "~/components/Order";
import type { Order } from "~/models/order.server";
import { getOrderByIdWithOrders } from "~/models/order.server";
import { addBadge, SendNotification } from "~/utils/client/pwa-utils.client";

export const loader: LoaderFunction = async ({ params }) => {
  const order = await getOrderByIdWithOrders(Number(params.slug));
  return json(order);
};

export default function PrintSlug() {
 const order = useLoaderData<(Order & {
  orderedProducts: OrderedProduct[];
}) | null>();
  useEffect(() => {
    async function notify(){
      await addBadge(4)
      await SendNotification("An Order was made", {body: `${order?.customerName} made an Order`, silent: false})
    }
    notify()
  })
  
  return (
    <div className="flex justify-center">
      <OrderComponent order={order!} />
    </div>
  );
}
