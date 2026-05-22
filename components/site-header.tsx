"use client";

import Link from "next/link";
import * as React from "react";
import logo from "@/public/blorbA.png";
import {
  HeartHandshake,
  Heart,
  User,
  Search,
  Menu,
  LayoutGrid,
  ChevronDown,
  Sun,
  Moon,
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import { CartSheet } from "./cart-sheet";
import { NotificationsDropdown } from "./notifications-dropdown";
import { createClient } from "@/utils/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useEffect, useState, useMemo } from "react";

export function SiteHeader() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        setRole(profile?.role || "user");
      } else {
        setUser(null);
        setRole(null);
      }
    }
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single();
          setRole(profile?.role || "user");
        } else {
          setUser(null);
          setRole(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

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
        <Link
          href="/"
          className="flex max-h-8 items-center gap-2 shrink-0 p-2"
        >
          <Image alt="Shadcnblocks.com" className="block size-8" src={logo} />
          <span className="hidden text-lg tracking-tighter md:flex font-medium text-primary-foreground">
            Blorp Atelier
          </span>
        </Link>
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
                    <User className="size-4 mr-1.5" />
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
                  <User className="size-4 mr-1.5" />
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
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <Sun className="size-4 dark:hidden" />
            <Moon className="hidden size-4 dark:block" />
          </Button>

          <NotificationsDropdown />
          <CartSheet />

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
                <div className="flex flex-col gap-4">
                  <Button variant="secondary" className="w-full justify-start">
                    <LayoutGrid className="size-4 text-foreground/70" />
                    Categories
                  </Button>
                  <div className="flex flex-col gap-2">
                    <Button variant="ghost" className="justify-start">
                      <Heart className="size-4" />
                      Wishlist
                    </Button>
                    {user ? (
                      <>
                        {role === "admin" && (
                          <Button variant="ghost" className="justify-start font-sans" asChild>
                            <Link href="/admin">
                              <LayoutGrid className="size-4 mr-2" />
                              Admin Panel
                            </Link>
                          </Button>
                        )}
                        <Button variant="ghost" className="justify-start font-sans" asChild>
                          <Link href="/profile">
                            <User className="size-4 mr-2" />
                            Account
                          </Link>
                        </Button>
                      </>
                    ) : (
                      <Button variant="ghost" className="justify-start font-sans" asChild>
                        <Link href="/login">
                          <User className="size-4 mr-2" />
                          Log in
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      <div className="h-(--secondary-nav-height)">
        <div className="bg-accent px-6 py-2">
          <div className="hidden lg:contents">
            <NavigationMenu className="relative flex max-w-max flex-1 items-center justify-start">
              <NavigationMenuList className="flex flex-1 items-center justify-center gap-3.5">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/products" className="inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-all hover:bg-accent-foreground/10 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 cursor-pointer">
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
    </header>
  );
}
