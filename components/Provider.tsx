"use client";
import { useEffect, useState, useTransition } from "react";

import { createUser } from "@/app/action/user";
import { ThemeProvider } from "./theme/theme-provider";
import { User } from "@/prisma_client/client";
import { UserContext } from "./context/userContext";

function Provider({ children }: { children: React.ReactNode }) {

  const [user, setUser] = useState<User | null>(null);
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    getUser();
  }, []);

  const getUser = () => {
    startTransition(async () => {
      try {
        const user = await createUser();
        setUser(user)
      } catch (error) {
        console.log(error);
      }
    })
  };


  return (
    <ThemeProvider
      enableSystem
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
    >
      <UserContext value={{ user, isPending }}>
        {children}
      </UserContext>
    </ThemeProvider>
  );
}

export default Provider;
