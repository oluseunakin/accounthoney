import { prisma } from "~/db.server"

export type { Customer } from "@prisma/client"

const customerSchema = prisma.customer

export const createOrGetCustomer  = async (name: string) => {
    let customer = customerSchema.findUnique({where: {name}})
    if(!customer) customer = customerSchema.create({data: {
        name,
    }})
    return customer
}

export const getAllCustomers = async () => {
    return await customerSchema.findMany({include: {order: {include: {orderedProducts: true}}}})
}