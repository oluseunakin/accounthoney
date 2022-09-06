import { Outlet } from "@remix-run/react";

export default function Customer() {
  return (
    <div className="flex justify-center">
      <Outlet />
    </div>
  );
}
