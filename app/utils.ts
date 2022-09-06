import type { Category, Product } from "@prisma/client";
import { useMatches } from "@remix-run/react";
import { useMemo } from "react";
import type { User } from "~/models/user.server";

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */

export type SortedProducts = {
  categoryId?: number;
  categoryName?: string;
  products?: Product[]
}

export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data;
}

function isUser(user: any): user is User {
  return user && typeof user === "object" && typeof user.email === "string";
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): User {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  }
  return maybeUser;
}

export function validateName(name: unknown): name is string {
  return typeof name === "string" && name.length > 3;
}

export function convertDate(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toDateString()
}

export function getYesterday(today: number) {
  const interval = 1000 * 60 * 60 * 24;
  return today - interval;
}

export function getMonth(date: string) {
  return date.substring(date.indexOf("-") + 1, date.indexOf("/"));
}

export async function fileProducts(categories: Category[], products: Product[]) {
  const sorted = new Map<string, Product[]>()
  categories.forEach(c => sorted.set(c.name, []))
  await Promise.all(products.map(async product => {
    const categoryName = product.categoryName
    const oldProducts = sorted.get(categoryName)!
    oldProducts.push(product)
    sorted.set(categoryName, oldProducts)
  }))
  return sorted
}
