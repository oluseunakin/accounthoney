import type { Product } from "@prisma/client";
import { prisma } from "~/db.server";


export type { Product } from "@prisma/client"

export async function createProduct(product: Product, stockId: number) {
    await prisma.product.create({
        data: {
          name: product.name ,
          category: {
            connectOrCreate: {
              where: {
                name: product.categoryName,
              },
              create: {
                name: product.categoryName,
              },
            },
          },
          quantity: product.quantity,
          price: product.price,
          stock: {
            connect: {
              id: stockId
            },
          },
        },
      });      
}

export async function getProduct(id: number) {
    return await prisma.product.findUnique({where: {id}})
}

export async function getProductByName(name: string) {
    return await prisma.product.findFirst({where: {name}})
}

export async function updateQuantity(newQuantity: number, id: number) {
    await prisma.product.update({data: {quantity: newQuantity}, where: {id}})
}

export async function updatePrice(newPrice: number, id: number) {
  await prisma.product.update({data: {price: newPrice}, where: {id}})
}

export async function getAllProducts() {
    return await prisma.product.findMany()
}

export async function getAllProductsByStockId (stockId: number) {
  return await prisma.product.findMany({where: {
    stockId
  }})
}