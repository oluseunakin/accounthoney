import { prisma } from "~/db.server"

export type { Category } from "@prisma/client"

export const getProductsByCategory = async (name: string) => {
    return await prisma.category.findUnique({where: {name}, include: {products: true}})
}

export const getCategory = async (name: string) => {
    return await prisma.category.findUnique({where: {name}})
}

export const getAllCategories = async () => {
    return await prisma.category.findMany()
}

export const getCategoriesWithProducts = async () => {
    return await prisma.category.findMany({include: {products: true}})
}

export const getCategoriesWithoutProducts = async () => {
    return await prisma.category.findMany()
}