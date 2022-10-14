import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div className="space-y-6">
      <h2 className="flex justify-center text-2xl">
        Take Audit of your business
      </h2>

      <div className=" text-blue-800 flex">
        <div className="flex space-x-3 justify-items-center">
        <div className="">
          <Link to="/audit/daily" className="hover:underline">
            Daily Audit
          </Link>
        </div>
        <div>
          {" "}
          <Link to="/audit/weekly" className="hover:underline">
            Weekly Audit
          </Link>
        </div>
        <div>
          {" "}
          <Link to="/audit/monthly" className="hover:underline">
            Monthly Audit
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
}
