import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type MethodError = {
  method: "GET" | "POST" | "UPDATE" | "DELETE";
  path: string;
  action?: never;
};

type ActionError = {
  action: string;
  method?: never;
  path?: never;
};

type GetErrorMessageProps = {
  error: unknown;
} & (MethodError | ActionError);

export function getErrorMessage({
  error,
  method,
  path,
  action,
}: GetErrorMessageProps) {
  if (method) {
    console.error(`${method} ${path} error:`, error);
  } else {
    console.error(`${action} error:`, error);
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong";
}
