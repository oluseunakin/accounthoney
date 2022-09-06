import { Link, Outlet } from "@remix-run/react";

export default function Stockk() {
  return (
    <div>
      <div className="mt-3 mb-5 flex justify-center text-base text-blue-800 lg:justify-end">
        <div className="flex space-x-3">
          <div>
            <Link to="/stock" className="hover:underline">
              Take Daily Stock
            </Link>
          </div>
          <div>
            <Link to="/stock/update" className="hover:underline">
              Update Daily Stock
            </Link>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="md:w-2/5">
        <Outlet /></div>
      </div>
    </div>
  );
}
