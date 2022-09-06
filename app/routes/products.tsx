import { Outlet } from "@remix-run/react";

export default function Products() {
  return (
    <div className="flex justify-center">
      <Outlet />
    </div>
  );
}
