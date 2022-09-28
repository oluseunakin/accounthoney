import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { CustomerComp } from "~/components/Customer";
import type { OrderedProduct } from "~/components/Products";
import type { Customer} from "~/models/customer.server";
import { getCustomer} from "~/models/customer.server";
import type { Order } from "~/models/order.server";

export const loader: LoaderFunction = async ({params}) => {
    const customer = await getCustomer(params.slug as string)
    return json(customer)
}

export default function Index() {
    const customer = useLoaderData<(Customer & {order: (Order & {orderedProducts: OrderedProduct[]})[]})[]>()
    return <CustomerComp customers={customer}/>
}