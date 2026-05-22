import Image from "next/image";
import Link from "next/link";
import logo from "@/public/blorb.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
          <div className="px-6 py-8 md:p-12 lg:px-20 lg:pt-8 lg:pb-20">
            <div className="space-y-12">
              <div className="mt-12 max-w-125">
                <div className="space-y-6">
                  <h2 className="text-xl font-light">
                    Get updates on offers and products and save 20% on your
                    first order
                  </h2>
                  <form>
                    <div
                      role="group"
                      data-slot="field"
                      data-orientation="vertical"
                      className="data-[invalid=true]:text-destructive gap-3 group/field flex w-full flex-col *:w-full [&>.sr-only]:w-auto"
                      data-invalid="false"
                    >
                      <div
                        data-slot="input-group"
                        role="group"
                        className="dark:bg-input/30 has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[[data-slot][aria-invalid=true]]:border-destructive dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40 group/input-group relative flex h-9 w-full min-w-0 items-center border transition-[color,box-shadow] outline-none rounded-none border-x-0 border-t-0 !border-b border-foreground shadow-none"
                        aria-invalid="false"
                      >
                        <Input
                          aria-invalid="false"
                          placeholder="Email Address"
                          name="email"
                          className="border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0"
                        />
                        <div
                          role="group"
                          data-slot="input-group-addon"
                          data-align="inline-end"
                          className="text-muted-foreground h-auto gap-2 py-1.5 text-sm font-medium flex cursor-text items-center justify-center select-none pr-2 order-last"
                        >
                          <Button
                            data-slot="button"
                            variant="ghost"
                            size="icon"
                            className="size-6 rounded-[calc(var(--radius)-5px)] p-0 shadow-none flex items-center"
                            type="submit"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-arrow-right"
                              aria-hidden="true"
                            >
                              <path d="M5 12h14"></path>
                              <path d="m12 5 7 7-7 7"></path>
                            </svg>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="space-y-6">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-[42px] font-medium"
                >
                  <Image className="h-12 w-auto" alt="Logo" src={logo} />
                  <span>Blorp Atelier</span>
                </Link>
                <div className="space-y-1">
                  <h3 className="font-bold">
                    Where Modern Fashion Meets Comfort
                  </h3>
                  <p className="leading-relaxed text-balance">
                    We design clothing that empowers women to express their
                    individuality through thoughtful details, flattering fits,
                    and beautifully crafted essentials.
                  </p>
                </div>
              </div>
              <ul className="flex flex-wrap gap-4">
                <li>
                  <Link
                    href="#"
                    className="inline-flex items-center justify-center rounded-full p-2"
                  >
                    <img
                      className="size-6 dark:invert"
                      alt="Facebook"
                      src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/facebook-icon.svg"
                    />
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="inline-flex items-center justify-center rounded-full p-2"
                  >
                    <img
                      className="size-6 dark:invert"
                      alt="X"
                      src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/x.svg"
                    />
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="inline-flex items-center justify-center rounded-full p-2"
                  >
                    <img
                      className="size-6 dark:invert"
                      alt="Instagram"
                      src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/instagram-icon.svg"
                    />
                  </a>
                </li>
              </ul>
              <Separator className="max-lg:hidden" />
              <Accordion
                type="multiple"
                defaultValue={["Collections", "Help", "Information"]}
                className="w-full flex-col grid grid-cols-3 gap-4"
              >
                <AccordionItem
                  value="Collections"
                  className="not-last:border-b border-b lg:border-transparent"
                >
                  <AccordionTrigger className="cursor-auto rounded-none pt-0 pb-2 text-base leading-normal font-bold hover:no-underline max-lg:py-4">
                    Collections
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-4 lg:space-y-2">
                      <li className="text-sm leading-tight font-light">
                        <a
                          href="#"
                          className="hover:underline hover:underline-offset-3"
                        >
                          New Arrivals
                        </a>
                      </li>
                      <li className="text-sm leading-tight font-light">
                        <a
                          href="#"
                          className="hover:underline hover:underline-offset-3"
                        >
                          Best Sellers
                        </a>
                      </li>
                      <li className="text-sm leading-tight font-light">
                        <a
                          href="#"
                          className="hover:underline hover:underline-offset-3"
                        >
                          Seasonal Edits
                        </a>
                      </li>
                      <li className="text-sm leading-tight font-light">
                        <a
                          href="#"
                          className="hover:underline hover:underline-offset-3"
                        >
                          Wardrobe Essentials
                        </a>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  value="Help"
                  className="not-last:border-b border-b lg:border-transparent"
                >
                  <AccordionTrigger className="cursor-auto rounded-none pt-0 pb-2 text-base leading-normal font-bold hover:no-underline max-lg:py-4">
                    Help
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-4 lg:space-y-2">
                      <li className="text-sm leading-tight font-light">
                        <a
                          href="#"
                          className="hover:underline hover:underline-offset-3"
                        >
                          Contact Us
                        </a>
                      </li>
                      <li className="text-sm leading-tight font-light">
                        <a
                          href="#"
                          className="hover:underline hover:underline-offset-3"
                        >
                          FAQs
                        </a>
                      </li>
                      <li className="text-sm leading-tight font-light">
                        <a
                          href="#"
                          className="hover:underline hover:underline-offset-3"
                        >
                          Shipping &amp; Tracking
                        </a>
                      </li>
                      <li className="text-sm leading-tight font-light">
                        <a
                          href="#"
                          className="hover:underline hover:underline-offset-3"
                        >
                          Returns &amp; Exchanges
                        </a>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  value="Information"
                  className="not-last:border-b border-b lg:border-transparent"
                >
                  <AccordionTrigger className="cursor-auto rounded-none pt-0 pb-2 text-base leading-normal font-bold hover:no-underline max-lg:py-4">
                    Information
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-4 lg:space-y-2">
                      <li className="text-sm leading-tight font-light">
                        <a
                          href="#"
                          className="hover:underline hover:underline-offset-3"
                        >
                          Terms and Conditions
                        </a>
                      </li>
                      <li className="text-sm leading-tight font-light">
                        <a
                          href="#"
                          className="hover:underline hover:underline-offset-3"
                        >
                          Privacy Policy
                        </a>
                      </li>
                      <li className="text-sm leading-tight font-light">
                        <a
                          href="#"
                          className="hover:underline hover:underline-offset-3"
                        >
                          Warranty Policy
                        </a>
                      </li>
                      <li className="text-sm leading-tight font-light">
                        <a
                          href="#"
                          className="hover:underline hover:underline-offset-3"
                        >
                          Terms of Service
                        </a>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Separator />
              <ul className="flex flex-wrap items-center gap-3">
                <li>
                  <img
                    className="w-9.5"
                    alt="card"
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/payment-methods/amazonpay.svg"
                  />
                </li>
                <li>
                  <img
                    className="w-9.5"
                    alt="card"
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/payment-methods/applepay.svg"
                  />
                </li>
                <li>
                  <img
                    className="w-9.5"
                    alt="card"
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/payment-methods/mastercard.svg"
                  />
                </li>
                <li>
                  <img
                    className="w-9.5"
                    alt="card"
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/payment-methods/paypal.svg"
                  />
                </li>
                <li>
                  <img
                    className="w-9.5"
                    alt="card"
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/payment-methods/visa.svg"
                  />
                </li>
                <li>
                  <img
                    className="w-9.5"
                    alt="card"
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/payment-methods/discover.svg"
                  />
                </li>
              </ul>
              <Separator />
              <div className="space-y-8">
                <ul className="flex flex-wrap gap-x-6 gap-y-4">
                  <li>
                    <a href="#" className="text-sm font-light">
                      Shipping Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm font-light">
                      Returns Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm font-light">
                      Terms Of Service
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm font-light">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm font-light">
                      Sustainability
                    </a>
                  </li>
                </ul>
                <p className="text-sm font-light">© 2026 Blorp Atelier</p>
              </div>
            </div>
          </div>
          <div className="px-6 py-10 lg:px-20 flex items-center gap-2 text-[80px] font-medium">
            <Image className="h-full max-h-24 w-auto" alt="Logo" src={logo} />
            <span>Blorp Atelier</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
