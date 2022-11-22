import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import * as React from "react";
import { createUserSession } from "~/session.server";
import type { User } from "~/models/user.server";
import { createAnonymousUser, verifyLogin } from "~/models/user.server";

interface ActionData {
  errors?: {
    name?: string;
    password?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const redirectTo = "/";
  const remember = formData.get("remember");
  const name = formData.get("name") as string;
  const password = formData.get("password");
  let user: User;
  if (name === "") user = (await createAnonymousUser()) as User;
  else {
    if (typeof password !== "string") {
      return json<ActionData>(
        { errors: { password: "Password is required" } },
        { status: 400 }
      );
    }
    user = (await verifyLogin(name, password)) as User;
    if (!user) {
      return json<ActionData>(
        { errors: { name: "Invalid name or password" } },
        { status: 400 }
      );
    }
  }
  return createUserSession({
    request,
    userId: user.id,
    remember: remember === "on" ? true : false,
    redirectTo,
  });
};

export const meta: MetaFunction = () => {
  return {
    title: "Login",
  };
};

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const actionData = useActionData() as ActionData;
  const nameRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.name) {
      nameRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form method="post" className="space-y-3 border bg-slate-700 opacity-70 shadow-lg shadow-slate-200 md:mx-auto p-3 lg:w-3/5 md:w-4/5 md:max-w-2xl m-2 md:my-5">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium"
        >
          Name
        </label>
        <div className="mt-1">
          <input
            ref={nameRef}
            id="name"
            autoFocus={true}
            name="name"
            aria-invalid={actionData?.errors?.name ? true : undefined}
            aria-describedby="name-error"
            className="w-full rounded px-2 py-1 text-lg"
          />
          {actionData?.errors?.name && (
            <div className="pt-1 text-red-700" id="name-error">
              {actionData.errors.name}
            </div>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium"
        >
          Password
        </label>
        <div className="mt-1">
          <input
            id="password"
            ref={passwordRef}
            name="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={actionData?.errors?.password ? true : undefined}
            aria-describedby="password-error"
            className="w-full rounded border px-2 py-1 text-lg text-black"
          />
          {actionData?.errors?.password && (
            <div className="pt-1 text-red-700" id="password-error">
              {actionData.errors.password}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center space-x-4">
        <button
          type="submit"
          name="guest"
          className="rounded bg-red-500  py-2 px-4 text-white hover:bg-red-600 focus:bg-red-400"
        >
          Sign in as a Guest
        </button>
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Log in
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember"
            name="remember"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="remember"
            className="ml-2 block text-sm"
          >
            Remember me
          </label>
        </div>
        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Link
            className="text-blue-300 underline"
            to={{
              pathname: "/join",
              search: searchParams.toString(),
            }}
          >
            Sign up
          </Link>
        </div>
      </div>
    </Form>
  );
}
