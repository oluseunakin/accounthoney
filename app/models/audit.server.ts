import { getOrderByADate } from "./order.server";
import type { Product } from "./products.server";
import { getAllProductsByStockId } from "./products.server";
import { getStockByDate, getStockForTheDay } from "./stock.server";

export type Mine = { name: string; total: number; price: number };

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
  const todayStock = await getStockForTheDay();
  const yesterdayOrders = await getOrderByADate(closeDate);
  const audit: Array<{ old: Mine; new: Product }> = [];
  if (todayStock) {
    if (yesterdayOrders) {
      const array: Mine[] = [];
      const reduced = yesterdayOrders.reduce<Mine[]>((pv, yo) => {
        const ops = yo.orderedProducts;
        ops.forEach((op) => {
          const find = pv.find(
            (val) => val.name === `${op.name} ${op.categoryName}`
          );
          if (find) {
            find.total += op.quantity;
          } else
            array.push({
              name: `${op.name} ${op.categoryName}`,
              total: op.quantity,
              price: op.price,
            });
        });
        return array;
      }, []);
      const tProducts = todayStock.products;
      tProducts.forEach((tProduct) => {
        const find = reduced?.find((yProduct) => {
          const newName = `${tProduct.name} ${tProduct.categoryName}`;
          return yProduct.name === newName;
        });
        if (find)
          audit.push({
            old: find,
            new: tProduct,
          });
      });
    }
    return audit;
  }
}
