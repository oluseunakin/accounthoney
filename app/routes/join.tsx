import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import * as React from "react";
import { createUserSession } from "~/session.server";
import { createUser, verifyLogin } from "~/models/user.server";
import { safeRedirect } from "~/utils";

export interface ActionData {
  errors?: {
    name?: string;
    password?: string;
  };
  message?: string;
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");

  if (typeof password !== "string") {
    return json<ActionData>(
      { errors: { password: "Password is required" } },
      { status: 400 }
    );
  }

  const existingUser = await verifyLogin(name, password);
  if (existingUser) {
    return json<ActionData>(
      { errors: { name: "Can't create user, try with a different name" } },
      { status: 400 }
    );
  }

  const user = await createUser(name, password, "admin");

  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo,
  });
};

export const meta: MetaFunction = () => {
  return {
    title: "Sign Up",
  };
};

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
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
            required
            autoFocus={true}
            name="name"
            aria-invalid={actionData?.errors?.name ? true : undefined}
            aria-describedby="name-error"
            className="w-full rounded border px-2 py-1 text-lg text-black bg-slate-400"
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
            autoComplete="new-password"
            aria-invalid={actionData?.errors?.password ? true : undefined}
            aria-describedby="password-error"
            className="w-full rounded border px-2 py-1 text-lg text-black bg-slate-400"
          />
          {actionData?.errors?.password && (
            <div className="pt-1 text-red-700" id="password-error">
              {actionData.errors.password}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center">
        <div className="space-y-3">
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <div className="flex justify-center">
            <button
              type="submit"
              className="rounded bg-red-500 py-2 px-4 hover:bg-red-600 focus:bg-red-400"
            >
              Create Account
            </button>
          </div>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link
              className="text-blue-300 underline"
              to={{
                pathname: "/login",
                search: searchParams.toString(),
              }}
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </Form>
  );
}
