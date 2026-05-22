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
  LogOut
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
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { CartSheet } from "./cart-sheet";

const mainLinks = [
  { label: "Skin Quiz", href: "#" },
  { label: "About Us", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Sale", href: "#" },
];

export function SiteHeader() {
  const [user, setUser] = React.useState<SupabaseUser | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

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

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="flex h-[var(--primary-nav-height)] items-center gap-3 bg-primary px-6 py-4 text-primary-foreground">
        <Link
          href="/"
          className="flex max-h-8 shrink-0 items-center gap-2 p-2"
        >
          <Image alt="Blorp Atelier" className="block size-8" src={logo} />
          <span className="hidden text-lg font-medium tracking-tighter text-primary-foreground md:flex">
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
               <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <Button
                   variant="ghost"
                   className="h-9 gap-1.5 px-2.5 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground data-[state=open]:bg-primary-foreground/10 data-[state=open]:text-primary-foreground"
                 >
                   <User className="size-4" />
                   {user.email}
                   <ChevronDown className="size-4" />
                 </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end">
                 <DropdownMenuItem>My Account</DropdownMenuItem>
                 <DropdownMenuItem>My Orders</DropdownMenuItem>
                 <DropdownMenuItem onClick={handleSignOut} className="text-red-500">
                    <LogOut className="size-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
               </DropdownMenuContent>
             </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                className="h-9 gap-1.5 px-2.5 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                asChild
              >
                <Link href="/login">
                  <User className="size-4" />
                  Account
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
                    <LayoutGrid className="size-4" />
                    Categories
                  </Button>
                  <div className="flex flex-col gap-2">
                    <Button variant="ghost" className="justify-start">
                      <Heart className="size-4" />
                      Wishlist
                    </Button>
                    {user ? (
                      <Button variant="ghost" className="justify-start text-red-500" onClick={handleSignOut}>
                        <LogOut className="size-4 mr-2" />
                        Sign out
                      </Button>
                    ) : (
                      <Button variant="ghost" className="justify-start" asChild>
                        <Link href="/login">
                          <User className="size-4 mr-2" />
                          Account
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
      <div className="h-[var(--secondary-nav-height)]">
        <div className="bg-accent px-6 py-2">
          <div className="hidden lg:contents">
            <NavigationMenu className="relative flex max-w-max flex-1 items-center justify-start">
              <NavigationMenuList className="flex flex-1 items-center justify-center gap-3.5">
                <NavigationMenuItem>
                  <Link href="/products" legacyBehavior passHref>
                    <NavigationMenuLink className="inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-all hover:bg-accent-foreground/10 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
                      Shop All
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="px-4">
                    Collections
                  </NavigationMenuTrigger>
                </NavigationMenuItem>
                {mainLinks.map((link) => (
                  <NavigationMenuItem key={link.label}>
                    <NavigationMenuLink
                      href={link.href}
                      className="inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-all hover:bg-accent-foreground/10 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
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
