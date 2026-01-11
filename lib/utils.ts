import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage({
  error,
  method,
  path,
}: {
  error: unknown;
  method: "GET" | "POST" | "UPDATE" | "DELETE";
  path: string;
}) {
  console.error(`${method} ${path} error:`, error);
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong";
}
