"use client";

import Link from "next/link";
import * as React from "react";
import logo from "@/public/blorbA.png";
import {
  HeartHandshake,
  Heart,
  User as UserIcon,
  Search,
  Menu,
  LayoutGrid,
  ChevronDown,
  Sun,
  Moon,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import Image from "next/image";
import { CartSheet } from "./cart-sheet";
import { NotificationsDropdown } from "./notifications-dropdown";
import { useAuth } from "@/components/auth-context";
import type { User } from "@supabase/supabase-js";

export function SiteHeader() {
  const { user, role } = useAuth();

  React.useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const nextTheme = storedTheme ?? (prefersDark ? "dark" : "light");

    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");
    const nextTheme = isDark ? "light" : "dark";

    root.classList.toggle("dark", !isDark);
    window.localStorage.setItem("theme", nextTheme);
  };
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="flex h-(--primary-nav-height) items-center gap-3 bg-primary px-6 py-4 text-primary-foreground">
        <Link href="/" className="flex max-h-8 items-center gap-2 shrink-0 p-2">
          <Image alt="Shadcnblocks.com" className="block size-8" src={logo} />
          <span className="hidden text-lg tracking-tighter md:flex font-medium text-primary-foreground">
            Blorp Atelier
          </span>
        </Link>
        <HeaderActions user={user} role={role} onToggleTheme={toggleTheme} />
      </div>
      <SecondaryNav />
    </header>
  );
}

function HeaderActions({
  user,
  role,
  onToggleTheme,
}: {
  user: User | null;
  role: string | null;
  onToggleTheme: () => void;
}) {
  return (
    <div className="ml-auto flex items-center gap-3">
      <div className="hidden lg:contents">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-9 gap-1.5 px-2.5 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground data-[state=open]:bg-primary-foreground/10 data-[state=open]:text-primary-foreground"
            >
              <HeartHandshake className="size-4" />
              Help &amp; Support
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Contact us</DropdownMenuItem>
            <DropdownMenuItem>Shipping</DropdownMenuItem>
            <DropdownMenuItem>Returns</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="ghost"
          className="h-9 gap-1.5 px-2.5 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
        >
          <Heart className="size-4" />
          Wishlist
        </Button>
        {user ? (
          <>
            {role === "admin" && (
              <Button
                variant="ghost"
                className="h-9 gap-1.5 px-2.5 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground font-sans"
                asChild
              >
                <Link href="/admin">Admin Panel</Link>
              </Button>
            )}
            <Button
              variant="ghost"
              className="h-9 gap-1.5 px-2.5 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground font-sans"
              asChild
            >
              <Link href="/profile">
                <UserIcon className="size-4 mr-1.5" />
                Account
              </Link>
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            className="h-9 gap-1.5 px-2.5 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground font-sans"
            asChild
          >
            <Link href="/login">
              <UserIcon className="size-4 mr-1.5" />
              Log in
            </Link>
          </Button>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="size-9 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
      >
        <Search className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="size-9 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
        onClick={onToggleTheme}
        aria-label="Toggle theme"
      >
        <Sun className="size-4 dark:hidden" />
        <Moon className="hidden size-4 dark:block" />
      </Button>

      <NotificationsDropdown currentUser={user} />
      <CartSheet />

      <MobileMenuSheet user={user} role={role} />
    </div>
  );
}

function MobileMenuSheet({
  user,
  role,
}: {
  user: User | null;
  role: string | null;
}) {
  return (
    <div className="contents lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-9 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <Menu className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-5 py-2 overflow-y-auto max-h-[80vh] pr-1">
            {/* Main Pages */}
            <div className="flex flex-col gap-2">
              <Button variant="ghost" className="justify-start text-base font-semibold" asChild>
                <Link href="/products">
                  <LayoutGrid className="size-4 mr-2 text-foreground/75" />
                  Shop All Products
                </Link>
              </Button>
              <Button variant="ghost" className="justify-start text-base font-semibold text-destructive hover:text-destructive" asChild>
                <Link href="/products?sale=true">
                  <Tag className="size-4 mr-2" />
                  Sale 🏷️
                </Link>
              </Button>
            </div>

            <hr className="border-border/60" />

            {/* Quick Links */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase px-2.5 mb-1 block">
                Explore Blorp
              </label>
              <Button variant="ghost" className="justify-start text-sm h-9" asChild>
                <Link href="#">Skin Quiz</Link>
              </Button>
              <Button variant="ghost" className="justify-start text-sm h-9" asChild>
                <Link href="#">About Us</Link>
              </Button>
              <Button variant="ghost" className="justify-start text-sm h-9" asChild>
                <Link href="#">Blog</Link>
              </Button>
              <Button variant="ghost" className="justify-start text-sm h-9" asChild>
                <Link href="#">Help &amp; Support</Link>
              </Button>
            </div>

            <hr className="border-border/60" />

            {/* Account & Wishlist */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase px-2.5 mb-1 block">
                My Account
              </label>
              <Button variant="ghost" className="justify-start text-sm h-9" asChild>
                <Link href="#">
                  <Heart className="size-4 mr-2 text-muted-foreground" />
                  Wishlist
                </Link>
              </Button>
              {user ? (
                <>
                  {role === "admin" && (
                    <Button
                      variant="ghost"
                      className="justify-start text-sm h-9 font-sans"
                      asChild
                    >
                      <Link href="/admin">
                        <LayoutGrid className="size-4 mr-2 text-muted-foreground" />
                        Admin Panel
                      </Link>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    className="justify-start text-sm h-9 font-sans"
                    asChild
                  >
                    <Link href="/profile">
                      <UserIcon className="size-4 mr-2 text-muted-foreground" />
                      Account Details
                    </Link>
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  className="justify-start text-sm h-9 font-sans"
                  asChild
                >
                  <Link href="/login">
                    <UserIcon className="size-4 mr-2 text-muted-foreground" />
                    Log in
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function SecondaryNav() {
  return (
    <div className="h-(--secondary-nav-height)">
      <div className="bg-accent px-6 py-2">
        <div className="hidden lg:contents">
          <NavigationMenu className="relative flex max-w-max flex-1 items-center justify-start">
            <NavigationMenuList className="flex flex-1 items-center justify-center gap-3.5">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/products"
                    className="inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-all hover:bg-accent-foreground/10 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 cursor-pointer"
                  >
                    Shop
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="px-4">
                  Collections
                </NavigationMenuTrigger>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#"
                  className="inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-all hover:bg-accent-foreground/10 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  Skin Quiz
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#"
                  className="inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-all hover:bg-accent-foreground/10 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  About Us
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#"
                  className="inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-all hover:bg-accent-foreground/10 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  Blog
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/products?sale=true"
                    className="inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm transition-all hover:bg-accent-foreground/10 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 cursor-pointer text-destructive font-semibold"
                  >
                    Sale 🏷️
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="lg:hidden">
          <Button variant="secondary" className="gap-2">
            <LayoutGrid className="size-4" />
            Categories
          </Button>
        </div>
      </div>
    </div>
  );
}
