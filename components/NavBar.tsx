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
import { useState } from "react";
import { Menu, X } from "lucide-react";

const menuItems = [
  { label: "Home", href: "/" },
  { label: "Chats", href: "/chats" },
  { label: "Settings", href: "/settings" },
];

export default function NavBar() {
  const { isSignedIn } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  return (
    <>
      <div className="fixed left-0 right-0 z-10 bg-accent/50 backdrop-blur-sm">
        <div className="border border-foreground/10">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-2">
            <div className="inline-flex items-center space-x-2">
              {!isMobileMenuOpen ? (
                <button
                  className="md:hidden"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu />
                </button>
              ) : (
                <button className="md:hidden" onClick={closeMobileMenu}>
                  <X />
                </button>
              )}
              <Link href="/" className="flex items-center space-x-2">
                <Image src="/logo.png" alt="Logo" width={32} height={32} />
                <span className="text-lg font-bold">AI Course</span>
              </Link>
            </div>
            <div className="hidden md:flex space-x-2">
              <MenuItems closeMobileMenu={closeMobileMenu} />
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

        {isMobileMenuOpen && (
          <div className="md:hidden flex flex-col gap-2 p-4">
            <MenuItems closeMobileMenu={closeMobileMenu} />
          </div>
        )}
      </div>
    </>
  );
}

function MenuItems({ closeMobileMenu }: { closeMobileMenu: () => void }) {
  const pathname = usePathname();
  return (
    <>
      {menuItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={pathname === item.href ? "font-bold text-primary" : ""}
          onClick={closeMobileMenu}
        >
          <span>{item.label}</span>
        </Link>
      ))}
    </>
  );
}
