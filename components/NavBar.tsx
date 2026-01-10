"use client";

import { SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";

import { ModeToggle } from "./theme/toggleButton";
import { Button } from "./ui/button";
import { useUser } from "./context/userContext";
import { Skeleton } from "./ui/skeleton";

export function NavBar() {
  const { user, isPending } = useUser();
  console.log(user);
  return (
    <div className="z-10 fixed left-0 right-0 flex max-w-6xl mx-auto px-4 py-2 items-center justify-between">
      <div>LOGO</div>
      <div className="space-x-2 flex items-center ">
        <ModeToggle />
        {isPending ? (
          <>
            <Skeleton className="w-8 h-8" />
            <Skeleton className="w-8 h-8" />
          </>
        ) : user ? (
          <>
            <UserButton />
            <SignOutButton />
          </>
        ) : (
          <Button variant="link" asChild>
            <SignInButton />
          </Button>
        )}
      </div>
    </div>
  );
}
