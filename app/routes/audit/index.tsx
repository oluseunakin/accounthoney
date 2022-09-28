import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl flex justify-center">Take Audit of your business</h2>
      <div className="flex text-blue-800 space-x-5">
        <div>
          <Link to="/audit/daily" className="hover:underline">
            Daily Audit
          </Link>
        </div>
        <div>
          <Link to="/audit/weekly" className="hover:underline">
            Weekly Audit
          </Link>
        </div>
        <div>
          <Link to="/audit/monthly" className="hover:underline">
            Monthly Audit
          </Link>
        </div>
      </div>
    </div>
  );
}
