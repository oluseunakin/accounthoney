import type { Product } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { Mine } from "~/models/audit.server";
import { audit } from "~/models/audit.server";
import { convertDate, getYesterday } from "~/utils";

export const loader: LoaderFunction = async ({ params }) => {
  const today = convertDate(new Date());
  const yesterday = getYesterday(new Date().getTime());
  const auditt = await audit(today, convertDate(new Date(yesterday)));
  return json({ auditt });
};

export default function Index() {

  const { auditt } = useLoaderData<{
    auditt: { old: Mine; new: Product }[] | undefined;
  }>();
  return (
    <div className="">
      <h2 className="flex justify-center text-2xl">
        Take Audit of your business
      </h2>
      {auditt && auditt?.length != 0 ? (
        <table className="">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Yesterday's Quantity</th>
              <th>Today's Quantity</th>
              <th>Yesterday's Price</th>
              <th>Today's Price</th>
              <th>Difference in Value</th>
            </tr>
          </thead>
          <tbody>
            {auditt.map((a, i) => (
              <tr key={i}  className="">
                <td className="capitalize text-center">{a.new.name}</td>
                <td className="capitalize text-center">{a.new.categoryName}</td>
                <td className="text-center" >{a.old.total + a.new.quantity}</td>
                <td className="text-center" >{a.new.quantity}</td>
                <td className="text-center">{a.old.price}</td>
                <td className="text-center">{a.new.price}</td>
                <td className="text-center">
                  {a.old.price * (a.old.total + a.new.quantity) - a.new.price * a.new.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <h1>Take Stock first</h1>
      )}
    </div>
  );
}
