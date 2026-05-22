import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-primary px-6 py-12 text-primary-foreground lg:px-12 lg:py-24">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="relative size-8">
              <Image
                alt="Blorp Logo"
                className="object-contain"
                src="/blorbA.png"
                fill
              />
            </div>
            <span className="text-xl font-medium tracking-tight">Blorp</span>
          </div>
          <p className="text-sm text-primary-foreground/80">
            Elevating everyday style with premium accessories crafted for the
            modern aesthetic. Uncompromising quality meets timeless design.
          </p>
        </div>
        <div className="space-y-6">
          <h3 className="text-sm font-medium uppercase tracking-wider text-primary-foreground/60">
            Shop
          </h3>
          <ul className="space-y-4 text-sm">
            <li>
              <Link
                href="/products?category=handbags"
                className="transition-colors hover:text-primary-foreground/80"
              >
                Handbags
              </Link>
            </li>
            <li>
              <Link
                href="/products?category=watches"
                className="transition-colors hover:text-primary-foreground/80"
              >
                Watches
              </Link>
            </li>
            <li>
              <Link
                href="/products?category=jewelry"
                className="transition-colors hover:text-primary-foreground/80"
              >
                Jewelry
              </Link>
            </li>
            <li>
              <Link
                href="/products?category=accessories"
                className="transition-colors hover:text-primary-foreground/80"
              >
                Accessories
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className="transition-colors hover:text-primary-foreground/80"
              >
                All Products
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-6">
          <h3 className="text-sm font-medium uppercase tracking-wider text-primary-foreground/60">
            Support
          </h3>
          <ul className="space-y-4 text-sm">
            <li>
              <a
                href="#"
                className="transition-colors hover:text-primary-foreground/80"
              >
                Contact Us
              </a>
            </li>
            <li>
              <a
                href="#"
                className="transition-colors hover:text-primary-foreground/80"
              >
                Shipping & Returns
              </a>
            </li>
            <li>
              <a
                href="#"
                className="transition-colors hover:text-primary-foreground/80"
              >
                FAQ
              </a>
            </li>
            <li>
              <a
                href="#"
                className="transition-colors hover:text-primary-foreground/80"
              >
                Size Guide
              </a>
            </li>
          </ul>
        </div>
        <div className="space-y-6">
          <h3 className="text-sm font-medium uppercase tracking-wider text-primary-foreground/60">
            Legal
          </h3>
          <ul className="space-y-4 text-sm">
            <li>
              <a
                href="#"
                className="transition-colors hover:text-primary-foreground/80"
              >
                Terms of Service
              </a>
            </li>
            <li>
              <a
                href="#"
                className="transition-colors hover:text-primary-foreground/80"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="#"
                className="transition-colors hover:text-primary-foreground/80"
              >
                Cookie Policy
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-primary-foreground/20 pt-8 sm:flex-row">
        <p className="text-sm text-primary-foreground/60">
          © {new Date().getFullYear()} Blorp. All rights reserved.
        </p>
        <div className="flex gap-4">
          <a
            href="#"
            className="text-primary-foreground/60 transition-colors hover:text-primary-foreground"
            aria-label="Instagram"
          >
            <svg
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <rect height="20" rx="5" ry="5" width="20" x="2" y="2" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
          </a>
          <a
            href="#"
            className="text-primary-foreground/60 transition-colors hover:text-primary-foreground"
            aria-label="Twitter"
          >
            <svg
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
