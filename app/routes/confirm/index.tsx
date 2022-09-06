import { Link, Outlet } from "@remix-run/react";

export default function Index() {
  return (
    <main>
      <Link to="/">Home</Link>
      <Outlet />
    </main>
  );
}
