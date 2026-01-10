import { createContext, useContext } from "react";
import { useUser } from "@clerk/clerk-react";

type UserContextType = {
  user: ReturnType<typeof useUser>["user"];
  isLoaded: boolean;
  isSignedIn: boolean | undefined;
};

export const UserContext = createContext<UserContextType | null>(null);

export function useAppUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useAppUser must be used inside UserProvider");
  return ctx;
}