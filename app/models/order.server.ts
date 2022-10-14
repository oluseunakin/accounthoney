import { prisma } from "~/db.server";
import { convertDate } from "~/utils";
import type { Product } from "./products.server";
import { updatePrice } from "./products.server";
import { getProduct } from "./products.server";
import { updateQuantity } from "./products.server";
import { Buffer } from "buffer";
import type { COrderedProduct } from "~/components/Products";

const orderSchema = prisma.order;

export type { Order } from "@prisma/client";

const transformOrder = (orders: COrderedProduct[]) => {
  return orders.map((order) => ({
    name: order.name,
    price: order.price,
    quantity: order.quantity,
    value: order.value
  }));
};

export const createOrder = async (orders: COrderedProduct[], buyer: string) => {
  const name = buyer.toUpperCase()
  try {
    const nam = Buffer.from(name, "ascii").toString()
    orders.forEach(async (order, i) => {
      const product = (await getProduct(order.id)) as Product;
      const remainingQuantity = product.quantity - order.quantity;
      if (product.price != order.price && order.permanent)
        await updatePrice(order.price, product.id);
      await updateQuantity(remainingQuantity, product.id);
    });
    const order = await orderSchema.create({
      data: {
        orderedProducts: {
          create: transformOrder(orders),
        },
        customer: {
          connectOrCreate: {
            where: {
              name: nam
            },
            create: {
              name,
              user: {
                connectOrCreate: {
                  where: {
                    name_password: {
                      name: nam,
                      password: "guest"
                    },               
                  }, 
                  create: {
                    name: nam
                  }
                }
              }
            },
          },
        },
        date: convertDate(new Date()),
      },
    });
    return order.id
  } catch (e) {
    throw new Error();
  }
};

export const getAllOrders = async () => {
  return await orderSchema.findMany({ include: { orderedProducts: true } });
};

export const getOrderByIdWithOrders = async (id: number) => {
  return await orderSchema.findUnique({
    where: { id },
    include: { orderedProducts: true },
  });
};

export const getOrderByADate = async (date: string) => {
  return await orderSchema.findMany({ where: { date }, take: 20 });
};

export const getOrdersInAMonth = async (date: string) => {
  return await orderSchema.findMany({
    take: 20,
    where: {
      date: {
        contains: date,
      },
    },
  });
};
