import { Outlet } from "@remix-run/react";

export default function Audit() {
  return (
    <div className="flex justify-center">
      <Outlet />
    </div>
  );
}
