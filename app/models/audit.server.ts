import { getAllProductsByStockId, Product } from "./products.server";
import { getStockByDate, getStockByDateWithProducts } from "./stock.server";

export async function totalStockQuantity(date: string) {
  const dailyStockId = await getStockByDate(date);
  let sum = 0;
  if (dailyStockId) {
    const allProductsByStockId = await getAllProductsByStockId(dailyStockId.id);
    allProductsByStockId.forEach((product) => {
      sum += product.quantity;
    });
  }
  return sum;
}

export async function totalStockPrice(date: string) {
  const dailyStockId = await getStockByDate(date);
  let sum = 0;
  if (dailyStockId) {
    const allProductsByStockId = await getAllProductsByStockId(dailyStockId.id);
    allProductsByStockId.forEach((product) => {
      sum += product.price;
    });
  }
  return sum;
}

export async function totalStockValue(date: string) {
  const dailyStockId = await getStockByDate(date);
  let value = 0;
  if (dailyStockId) {
    const allProductsByStockId = await getAllProductsByStockId(dailyStockId.id);
    allProductsByStockId.forEach((product) => {
      value += product.price * product.quantity;
    });
  }
  return value;
}

export async function audit(openDate: string, closeDate: string) {
  const todayStock = await getStockByDateWithProducts(openDate);
  const audit : Array<{"old" : Product, "new": Product}> = []
  if (todayStock) {
    const tProducts = todayStock.products
    const yProducts = (await getStockByDateWithProducts(closeDate))?.products;
    tProducts.forEach(tProduct => {
        const find = yProducts?.find(yProduct => yProduct.name === tProduct.name)
        if(find) audit.push({
            "old" : find,
            "new": tProduct,
        }) 
    })
    return audit
  }

}
