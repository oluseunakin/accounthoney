import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { DailyAudit } from "~/components/Audit";
import { audit } from "~/models/audit.server";
import { convertDate, getYesterday } from "~/utils";

export const loader: LoaderFunction = async ({ params }) => {
  const today = new Date();
  const openDate = convertDate(today);
  let closeDate: string = "";
  const slug = params.slug;
  let aud: Array<string> = [];
  let end: number;
  let yesterday: number = getYesterday(today.getTime());
  if (slug === "daily") {
    end = 1;
  } else if (slug === "weekly") {
    end = 6;
  } else end = 28;
  for (let i = 0; i < end; i++) {
    if (i !== 0) yesterday = getYesterday(yesterday);
    closeDate = convertDate(new Date(yesterday));
    const ret = await audit(openDate, closeDate);
    if(!ret) break
    aud.push(ret);
  }
  return json({ audit: aud });
};

export default function AuditSlug() {
  const { audit } = useLoaderData<{ audit: string[] }>();
  return (
    <div className="space-y-4 lg:w-3/5">
      <div>
        <Link to="/audit" className="text-blue-700 hover:underline">Back</Link>
      </div>
      <DailyAudit audits={audit} />
    </div>
  );
}
