import { Outlet } from "@remix-run/react";

export default function Customer() {
  return (
    <div className="lg:flex lg:justify-center">
      <Outlet />
    </div>
  );
}
