"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export function HeroCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    const timer = setTimeout(() => {
      setCurrent(prev => {
        const snap = api.selectedScrollSnap();
        return prev !== snap ? snap : prev;
      });
    }, 1);

    const onSelect = () => {
      setCurrent(prev => {
        const snap = api.selectedScrollSnap();
        return snap;
      });
    };

    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      clearTimeout(timer);
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api) {
      return;
    }

    const interval = window.setInterval(() => {
      api.scrollNext();
    }, 4500);

    return () => window.clearInterval(interval);
  }, [api]);

  const slides = [
    {
      title: "Effortless Hair Elegance",
      description:
        "Refined hair accessories designed to elevate everyday looks with a subtle golden touch.",
      button: "Shop Hair Accessories",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/accessories/Elegant-Blonde-Hairstyle-2.png",
    },
    {
      title: "Timeless Street Style",
      description:
        "Classic silhouettes and neutral tones for confident, modern styling.",
      button: "Shop Hats",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/accessories/Fashionable-Pose-2.png",
    },
    {
      title: "Statement Details",
      description:
        "Elegant jewelry that adds character and confidence to every outfit.",
      button: "Explore Jewelry",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/accessories/Stylish-Seated-Portrait-2.png",
    },
    {
      title: "Bold & Polished",
      description:
        "Sleek sunglasses crafted for sharp looks and everyday protection.",
      button: "Shop Sunglasses",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/accessories/Stylish-Woman-Portrait-2.png",
    },
    {
      title: "Modern Casual Wear",
      description:
        "Relaxed fits and clean lines for effortless everyday dressing.",
      button: "Shop Apparel",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/Modern-Casual-Style-m-2.png",
    },
  ];

  return (
    <section>
      <div className="relative space-y-5">
        <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
          <CarouselContent>
            {slides.map((slide) => (
              <CarouselItem
                key={slide.title}
                className="h-dvh min-h-150 bg-muted p-0"
              >
                <div
                  className="group relative size-full bg-cover bg-center bg-no-repeat after:absolute px-20 after:inset-0 after:bg-black/40"
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  <div className="relative z-10 flex size-full flex-col justify-end px-5 pb-50 lg:py-15">
                    <div className="flex">
                      <div className="space-y-7.5 lg:basis-[calc(100%-620px)]">
                        <h2 className="max-w-100 font-serif text-6xl text-white delay-500 duration-600 group-data-[state=active]:animate-in group-data-[state=active]:slide-in-from-bottom-30 group-data-[state=active]:fade-in group-data-[state=inactive]:opacity-0">
                          {slide.title}
                        </h2>
                        <p className="max-w-100 text-lg text-balance text-white duration-800 group-data-[state=active]:animate-in group-data-[state=active]:slide-in-from-bottom-60 group-data-[state=active]:fade-in">
                          {slide.description}
                        </p>
                        <div className="duration-1000 group-data-[state=active]:animate-in group-data-[state=active]:slide-in-from-bottom-80 group-data-[state=active]:fade-in">
                          <Button
                            variant="outline"
                            size="lg"
                            className="bg-background text-sm font-medium"
                          >
                            {slide.button}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-8 flex justify-center gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.title}
                className={`h-2 w-2 rounded-full transition-all ${
                  current === index ? "bg-primary w-6" : "bg-primary/20"
                }`}
                onClick={() => api?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          <div className="lg:absolute lg:right-0 lg:bottom-5">
            <div className="space-y-4.5 pl-5">
              <h3 className="font-light uppercase lg:text-white">
                Discover Our Collection
              </h3>
              <div
                className="relative lg:max-w-150"
                role="region"
                aria-roledescription="carousel"
                data-slot="carousel"
              >
                <div className="overflow-hidden" data-slot="carousel-content">
                  <div className="flex -ml-4">
                    {[
                      {
                        title: "Golden Hair Clip",
                        image:
                          "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/accessories/Golden-Hair-Clip-Close-Up-2.png",
                      },
                      {
                        title: "Beige Fedora Hat",
                        image:
                          "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/accessories/Stylish-Beige-Fedora-1.png",
                      },
                      {
                        title: "Hand Chain Jewelry",
                        image:
                          "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/accessories/Elegant-Hand-Jewelry-1.png",
                      },
                      {
                        title: "Modern Sunglasses",
                        image:
                          "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/accessories/Stylish-Sunglasses-Close-Up-2.png",
                      },
                      {
                        title: "Casual Style Outfit",
                        image:
                          "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/Modern-Casual-Style-2.png",
                      },
                    ].map((item, index) => (
                      <div
                        key={item.title}
                        role="group"
                        aria-roledescription="slide"
                        data-slot="carousel-item"
                        className={`min-w-0 shrink-0 grow-0 pl-4 basis-[75%] lg:basis-[60%] ${index === 4 ? "" : ""}`}
                      >
                        <a
                          href="#"
                          className="group relative block aspect-[1.4] overflow-hidden p-3 after:absolute after:inset-0 after:bg-black/30"
                        >
                          <div className="relative z-10 flex size-full flex-col justify-end">
                            <h3 className="font-serif text-xl font-semibold text-white sm:text-2xl">
                              {item.title}
                            </h3>
                          </div>
                          <div className="absolute inset-0">
                            <img
                              alt={item.title}
                              className="block size-full origin-center object-cover object-center transition-transform duration-500 group-hover:scale-110"
                              src={item.image}
                            />
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Carousel>
      </div>
    </section>
  );
}
