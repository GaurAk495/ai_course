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
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const menuItems = [
  { label: "Home", href: "/" },
  { label: "Your Courses", href: "/create" },
  { label: "Pricing", href: "/pricing" },
];

export default function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  return (
    <div className="fixed top-0 w-full z-1 bg-accent/50 backdrop-blur-sm">
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
            <AuthMenu />
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden flex flex-col gap-2 p-4">
          <MenuItems closeMobileMenu={closeMobileMenu} />
        </div>
      )}
    </div>
  );
}

function AuthMenu() {
  const { isSignedIn } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <>
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
          className={`flex items-center space-x-2 px-4 py-2 rounded-xs hover:bg-foreground/3 ${
            pathname === item.href ? "font-bold text-primary" : ""
          }`}
          onClick={closeMobileMenu}
        >
          <span>{item.label}</span>
        </Link>
      ))}
    </>
  );
}
