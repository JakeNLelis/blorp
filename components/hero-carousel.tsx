"use client";

import * as React from "react";
import Link from "next/link";
import type { CarouselApi } from "@/components/ui/carousel";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

const heroSlides = [
  {
    title: "Effortless Hair Elegance",
    description:
      "Refined hair accessories designed to elevate everyday looks with a subtle golden touch.",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/accessories/Elegant-Blonde-Hairstyle-2.png",
    cta: "Shop Hair Accessories",
    href: "#",
  },
  {
    title: "Timeless Street Style",
    description:
      "Classic silhouettes and neutral tones for confident, modern styling.",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/accessories/Fashionable-Pose-2.png",
    cta: "Shop Hats",
    href: "#",
  },
  {
    title: "Statement Details",
    description:
      "Elegant jewelry that adds character and confidence to every outfit.",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/accessories/Stylish-Seated-Portrait-2.png",
    cta: "Explore Jewelry",
    href: "#",
  },
  {
    title: "Bold & Polished",
    description:
      "Sleek sunglasses crafted for sharp looks and everyday protection.",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/accessories/Stylish-Woman-Portrait-2.png",
    cta: "Shop Sunglasses",
    href: "#",
  },
  {
    title: "Modern Casual Wear",
    description:
      "Relaxed fits and clean lines for effortless everyday dressing.",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/Modern-Casual-Style-m-2.png",
    cta: "Shop Apparel",
    href: "#",
  },
];

const productSlides = [
  {
    title: "Golden Hair Clip",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/accessories/Golden-Hair-Clip-Close-Up-2.png",
    href: "#",
  },
  {
    title: "Beige Fedora Hat",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/accessories/Stylish-Beige-Fedora-1.png",
    href: "#",
  },
  {
    title: "Hand Chain Jewelry",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/accessories/Elegant-Hand-Jewelry-1.png",
    href: "#",
  },
  {
    title: "Modern Sunglasses",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/accessories/Stylish-Sunglasses-Close-Up-2.png",
    href: "#",
  },
  {
    title: "Casual Style Outfit",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/Modern-Casual-Style-2.png",
    href: "#",
  },
];

export function HeroCarousel() {
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [productApi, setProductApi] = React.useState<CarouselApi | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const contentVariants = {
    inactive: { opacity: 0, y: 24 },
    active: { opacity: 1, y: 0 },
  };

  React.useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      setActiveIndex(api.selectedScrollSnap());
    };

    handleSelect();
    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  React.useEffect(() => {
    if (!api) return;

    const interval = window.setInterval(() => {
      api.scrollNext();
    }, 6000);

    return () => {
      window.clearInterval(interval);
    };
  }, [api]);

  const nextIndex = (activeIndex + 1) % heroSlides.length;

  React.useEffect(() => {
    if (!productApi) return;
    productApi.scrollTo(nextIndex);
  }, [productApi, nextIndex]);

  return (
    <section className="relative">
      <div className="relative space-y-5">
        <Carousel className="relative" opts={{ loop: true }} setApi={setApi}>
          <CarouselContent className="ml-0">
            {heroSlides.map((slide, index) => (
              <CarouselItem
                key={slide.title}
                className="min-w-0 shrink-0 grow-0 basis-full h-dvh min-h-[600px] bg-muted p-0 pl-0"
              >
                <div
                  data-state={index === activeIndex ? "active" : "inactive"}
                  className="group relative size-full bg-cover bg-center bg-no-repeat after:absolute after:inset-0 after:bg-black/40"
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  <motion.div
                    className="relative z-10 flex size-full flex-col justify-end px-5 pb-[200px] lg:py-[60px]"
                    variants={contentVariants}
                    initial="inactive"
                    animate={index === activeIndex ? "active" : "inactive"}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <div className="flex">
                      <div className="space-y-[30px] lg:basis-[calc(100%-620px)]">
                        <h2 className="max-w-[400px] font-heading text-5xl text-white lg:text-6xl">
                          {slide.title}
                        </h2>
                        <p className="max-w-[400px] text-lg text-balance text-white">
                          {slide.description}
                        </p>
                        <div>
                          <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="border-white/60 bg-transparent text-white hover:bg-white/10 hover:text-white"
                          >
                            <Link href={slide.href}>{slide.cta}</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="lg:absolute lg:right-0 lg:bottom-5">
          <div className="space-y-[18px] pl-5">
            <h3 className="font-light uppercase lg:text-white">
              Discover Our Collection
            </h3>
            <Carousel
              className="relative lg:max-w-[600px]"
              opts={{ align: "start", loop: true }}
              setApi={setProductApi}
            >
              <CarouselContent className="-ml-4">
                {productSlides.map((slide) => (
                  <CarouselItem
                    key={slide.title}
                    className="min-w-0 shrink-0 grow-0 pl-4 basis-[75%] lg:basis-[60%]"
                  >
                    <Link
                      href={slide.href}
                      className="group relative block aspect-[1.4] overflow-hidden p-3 after:absolute after:inset-0 after:bg-black/30"
                    >
                      <div className="relative z-10 flex size-full flex-col justify-end">
                        <h4 className="font-heading text-xl font-semibold text-white sm:text-2xl">
                          {slide.title}
                        </h4>
                      </div>
                      <div className="absolute inset-0">
                        <img
                          alt={slide.title}
                          className="block size-full origin-center object-cover object-center transition-transform duration-500 group-hover:scale-110"
                          src={slide.image}
                        />
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
}
