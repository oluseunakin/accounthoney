import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime"
import { OrderComponent } from "~/components/Order";
import type { OrderedProduct } from "~/components/Products";
import type { Order } from "~/models/order.server";
import { getOrderByIdWithOrders } from "~/models/order.server";

export const loader: LoaderFunction = async ({params}) => {
    const order = await getOrderByIdWithOrders(Number(params.slug)) 
    return json(order)  
}

export default function PrintSlug() {
    const order = useLoaderData() as Order & {
        orderedProducts: OrderedProduct[]
    }
    return <OrderComponent order={order}/>
}