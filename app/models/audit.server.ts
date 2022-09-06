import { getAllProductsByStockId } from "./products.server"
import { getStockByDate, } from "./stock.server"

export async function totalStockQuantity(date: string) {
    const dailyStockId = await getStockByDate(date)
    let sum = 0
    if(dailyStockId) {
        const allProductsByStockId = await getAllProductsByStockId(dailyStockId.id)
        allProductsByStockId.forEach(product => {
            sum += product.quantity
        })
    }
    return sum
}

export async function totalStockPrice(date: string) {
    const dailyStockId = await getStockByDate(date)
    let sum = 0
    if(dailyStockId) {
        const allProductsByStockId = await getAllProductsByStockId(dailyStockId.id)
        allProductsByStockId.forEach(product => {
            
            sum += product.price
        })
    }
    return sum
}

export async function totalStockValue(date: string) {
    const dailyStockId = await getStockByDate(date)
    let value = 0
    if(dailyStockId) {
        const allProductsByStockId = await getAllProductsByStockId(dailyStockId.id)
        allProductsByStockId.forEach(product => {
            value += product.price * product.quantity
        })
    }
    return value
}

export async function audit(openDate: string, closeDate: string) {
    const closingValue = await totalStockValue(closeDate)
    const openingValue = await totalStockValue(openDate)
    if(openingValue === 0) return "Take Stock before Audit"
    if(closingValue === 0) return null
    const difference = openingValue - closingValue
    if(difference < 0) {
        return `${openDate} - Account is in negative ${difference}`
    }
    else if(difference > 0) return `${openDate} - Account is in positive ${difference}`
    else return "No change"
}