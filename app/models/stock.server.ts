import { prisma } from "~/db.server";
import { convertDate, getYesterday } from "~/utils";
import { getAllOrders } from "./order.server";
import type { Product } from "./products.server";
import { createProduct } from "./products.server";

export type { Stock } from "@prisma/client";

const stockSchema = prisma.stock;

export const transformStock = (products: Product[]) => {
  return products.map((prod) => {
    const { name, quantity, categoryName, price } = prod;
    return {
      name,
      quantity,
      price,
      category: {
        connectOrCreate: {
          where: {
            name: categoryName,
          },
          create: {
            name: categoryName,
          },
        },
      },
    };
  });
};

export const getStockId = async (date: string) => {
  return await stockSchema.findUnique({
    where: { date },
    select: { id: true },
  });
};

export const getStockForTheDay = async () => {
  const getLastStock = await getAllStocks()
  const yesterdayStock = await getStockByDateWithProducts(
    convertDate(new Date(getYesterday(Date.now())))
  );
  const stock = await stockSchema.findUnique({
    where: { date: convertDate(new Date()) },
    include: { products: true },
  });
  if(stock) return stock
  if (yesterdayStock && yesterdayStock.products.length != 0) return yesterdayStock;
  if(getLastStock) {
    const length = getLastStock.length
    const last = getLastStock[length-1]
    if(last && last.products.length != 0) return last
  }
};

export const updateStock = async (
  newProducts: Product[],
  oldProducts: Product[],
  stockId: number
) => {
  oldProducts.forEach(async (product, i) => {
    await prisma.product.update({
      where: { id: product.id },
      data: {
        quantity: product.quantity,
        name: product.name,
        price: product.price,
      },
    });
  });
  newProducts.forEach(async (product, i) => {
    await createProduct(product, stockId);
  });
  return;
};

export const getAllStocks = async () => {
  return await stockSchema.findMany({ include: { products: true } });
};

export const getStockByDate = async (date: string) => {
  return await stockSchema.findUnique({
    where: { date },
    select: { id: true },
  });
};

export const getStockById = async (id: number) => {
  return await stockSchema.findUnique({ where: { id } });
};

export const getStockByIdWithProducts = async (id: number) => {
  return await stockSchema.findUnique({
    where: { id },
    include: { products: true },
  });
};

export const getStockByDateWithProducts = async (date: string) => {
  return await stockSchema.findUnique({
    where: { date },
    include: { products: true },
  });
};

export const createStock = async (products: Product[]) => {
  const p = transformStock(products);
  try {
    return await stockSchema.create({
      data: {
        products: {
          create: p,
        },
        date: convertDate(new Date()),
      },
    });
  } catch (e) {
    console.log(e);
    throw new Error("Failed to create stock");
  }
};
