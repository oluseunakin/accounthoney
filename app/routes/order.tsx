import { Outlet } from "@remix-run/react";

export default function OrderHome() {
  return (
    <div className="flex justify-center">
      <div className="md:w-2/5">
        <Outlet />
      </div>
    </div>
  );
}
