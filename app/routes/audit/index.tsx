import type { Product } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
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
    auditt: { old: Product; new: Product }[] | undefined;
  }>();
  return (
    <div className="space-y-6 border bg-slate-700 p-3 opacity-70 shadow-lg mx my-5 shadow-slate-200 md:mx-auto md:mt-6 md:w-4/5 md:max-w-2xl lg:w-3/5">
      <h2 className="flex justify-center text-2xl">
        Take Audit of your business
      </h2>
      {auditt && auditt?.length != 0 ? (
        <table>
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
              <tr key={i}>
                <th className="capitalize">{a.new.name}</th>
                <th className="capitalize">{a.new.categoryName}</th>
                <th>{a.old.quantity}</th>
                <th>{a.new.quantity}</th>
                <th>{a.old.price}</th>
                <th>{a.new.price}</th>
                <th>
                  {a.old.price * a.old.quantity - a.new.price * a.new.quantity}
                </th>
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
