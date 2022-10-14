import { prisma } from "~/db.server"

export type { Customer } from "@prisma/client"

const customerSchema = prisma.customer

export const createOrGetCustomer  = async (n: string) => {
    const name = n.toUpperCase()
    let customer = customerSchema.findUnique({where: {name}})
    if(!customer) customer = customerSchema.create({data: {
        name,
    }})
    return customer
}

export const getAllCustomers = async () => {
    return await customerSchema.findMany({include: {order: {include: {orderedProducts: true}}}})
}

export const getCustomer = async (n: string) => {
    const name = n.toUpperCase()
    return await customerSchema.findUnique({where : {name}, include: {order: {include: {orderedProducts: true}}}})
}