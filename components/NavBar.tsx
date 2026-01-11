"use client";
import {
  SignInButton,
  SignOutButton,
  useUser,
  UserButton,
} from "@clerk/nextjs";

import { ModeToggle } from "./theme/toggleButton";
import { Button } from "./ui/button";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

const menuItems = [
  { label: "Home", href: "/" },
  { label: "Chats", href: "/chats" },
  { label: "Settings", href: "/settings" },
];

export default function NavBar() {
  const { isSignedIn } = useUser();
  const pathname = usePathname();
  return (
    <div className="fixed left-0 right-0 z-10  bg-accent/50 border-b border-primary/5 backdrop-blur-sm ">
      <div className="max-w-6xl   mx-auto flex items-center justify-between px-4 py-2">
        <div className="inline-flex items-center space-x-2">
          <Image src="/logo.png" alt="Logo" width={32} height={32} />
          <span>AI Course</span>
        </div>
        <div className="space-x-2">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={pathname === item.href ? "font-bold text-primary" : ""}
            >
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
        <div className="space-x-2 flex items-center ">
          <ModeToggle />
          {isSignedIn ? (
            <>
              <UserButton />
              <SignOutButton>
                <Button variant="ghost">Sign Out</Button>
              </SignOutButton>
            </>
          ) : (
            <SignInButton mode="modal">
              <Button variant="secondary">Get Started</Button>
            </SignInButton>
          )}
        </div>
      </div>
    </div>
  );
}
