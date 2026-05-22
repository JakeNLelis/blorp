import Link from "next/link";
import logo from "@/public/blorb.png";
import { ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";

const footerLinks = [
  {
    title: "Collections",
    items: [
      "New Arrivals",
      "Best Sellers",
      "Seasonal Edits",
      "Wardrobe Essentials",
    ],
  },
  {
    title: "Help",
    items: ["Contact Us", "FAQs", "Shipping & Tracking", "Returns & Exchanges"],
  },
  {
    title: "Information",
    items: [
      "Terms and Conditions",
      "Privacy Policy",
      "Warranty Policy",
      "Terms of Service",
    ],
  },
];

const legalLinks = [
  "Shipping Policy",
  "Returns Policy",
  "Terms Of Service",
  "Privacy Policy",
  "Sustainability",
];

const paymentLogos = [
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/payment-methods/amazonpay.svg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/payment-methods/applepay.svg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/payment-methods/mastercard.svg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/payment-methods/paypal.svg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/payment-methods/visa.svg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/payment-methods/discover.svg",
];

export function SiteFooter() {
  return (
    <footer className="bg-muted">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="overflow-hidden max-lg:aspect-square">
          <img
            className="block size-full object-cover object-center"
            alt=""
            src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/Modern-Portrait-of-a-Woman-and-Man-2.png"
          />
        </div>
        <div>
          <div className="px-6 py-8 md:p-12 lg:px-20 lg:pb-20 lg:pt-8">
            <div className="space-y-12">
              <div className="mt-12 max-w-[500px]">
                <div className="space-y-6">
                  <h2 className="text-xl font-light">
                    Get updates on offers and products and save 20% on your
                    first order
                  </h2>
                  <form>
                    <div className="flex w-full flex-col gap-3">
                      <div className="flex h-9 w-full items-center border-b border-foreground">
                        <Input
                          className="h-9 flex-1 rounded-none border-0 bg-transparent px-2.5 py-1 shadow-none focus-visible:ring-0"
                          placeholder="Email Address"
                          name="email"
                        />
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          type="submit"
                          className="-mr-1"
                        >
                          <ArrowRight />
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="space-y-6">
                <Link href="#" className="flex items-center gap-2">
                  <Image className="h-12 w-auto" alt="Logo" src={logo} />
                  <span className="text-[40px] font-medium tracking-tighter">
                    Blorp Atelier
                  </span>
                </Link>
                <div className="space-y-1">
                  <h3 className="font-bold">
                    Where Modern Fashion Meets Comfort
                  </h3>
                  <p className="text-balance leading-relaxed">
                    We design clothing that empowers women to express their
                    individuality through thoughtful details, flattering fits,
                    and beautifully crafted essentials.
                  </p>
                </div>
              </div>
              <ul className="flex flex-wrap gap-4">
                <li>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <img
                      className="size-6 dark:invert"
                      alt="Facebook"
                      src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/facebook-icon.svg"
                    />
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <img
                      className="size-6 dark:invert"
                      alt="X"
                      src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/x.svg"
                    />
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <img
                      className="size-6 dark:invert"
                      alt="Instagram"
                      src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/instagram-icon.svg"
                    />
                  </Button>
                </li>
              </ul>
              <Separator className="max-lg:hidden" />
              <Accordion
                type="multiple"
                defaultValue={["collections", "help", "information"]}
                className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3"
              >
                {footerLinks.map((group) => (
                  <AccordionItem
                    key={group.title}
                    value={group.title.toLowerCase()}
                    className="border-b lg:border-transparent"
                  >
                    <AccordionTrigger className="cursor-auto rounded-none pb-2 pt-0 text-base font-bold leading-normal hover:no-underline max-lg:py-4 [&>svg]:hidden">
                      {group.title}
                      <span className="lg:hidden">
                        <Plus className="size-5" />
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-1 pt-0 max-lg:py-4">
                      <ul className="space-y-4 text-sm font-light lg:space-y-2">
                        {group.items.map((item) => (
                          <li key={item} className="leading-tight">
                            <Link
                              href="#"
                              className="hover:underline hover:underline-offset-3"
                            >
                              {item}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <Separator className="max-lg:hidden" />
              <ul className="flex flex-wrap items-center gap-3">
                {paymentLogos.map((logo) => (
                  <li key={logo}>
                    <img className="w-9.5 dark:invert" alt="card" src={logo} />
                  </li>
                ))}
              </ul>
              <Separator />
              <div className="space-y-8">
                <ul className="flex flex-wrap gap-x-6 gap-y-4">
                  {legalLinks.map((link) => (
                    <li key={link}>
                      <Link href="#" className="text-sm font-light">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="text-sm font-light">© 2025 Shadcnblocks.com</p>
              </div>
            </div>
          </div>
          <div className="px-6 py-10 lg:px-20 flex items-center gap-2">
            <Image className="h-auto max-h-20 w-auto" alt="Logo" src={logo} />
            <span className="text-[80px] font-medium tracking-tighter">
              Blorp Atelier
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
