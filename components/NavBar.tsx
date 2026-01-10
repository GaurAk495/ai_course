"use client";

import {
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

import { ModeToggle } from "./theme/toggleButton";
import { Button } from "./ui/button";

export function NavBar() {
  const { isSignedIn } = useUser();

  return (
    <div className="z-10 fixed left-0 right-0 flex max-w-6xl mx-auto px-4 py-2 items-center justify-between">
      <div>LOGO</div>
      <div className="space-x-2 flex items-center ">
        <ModeToggle />
        {isSignedIn ? (
          <>
            <UserButton />
            <SignOutButton />
          </>
        ) : (
          <SignInButton>
            <Button variant="link">Sign In</Button>
          </SignInButton>
        )}
      </div>
    </div>
  );
}
