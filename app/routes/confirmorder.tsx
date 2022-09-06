import type { ActionFunction} from "@remix-run/node";
import { redirect } from "@remix-run/node"
import type { OrderedProduct } from "~/components/Products";
import { createOrder } from "~/models/order.server";

let cart: OrderedProduct[]

export const action: ActionFunction = async ({ request }) => {
}

export default function ConfirmOrder() {
    console.log(cart)
    return (<div>Welcome to orders</div>)
}