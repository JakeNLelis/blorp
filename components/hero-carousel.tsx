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
      if (api.selectedScrollSnap() !== current) {
        setCurrent(api.selectedScrollSnap());
      }
    }, 1);

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);

    return () => {
      clearTimeout(timer);
      api.off("select", onSelect);
    };
  }, [api, current]);

  return (
    <section className="pt-4 lg:px-12">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          <CarouselItem>
            <div className="flex flex-col-reverse bg-muted lg:flex-row lg:rounded-2xl lg:overflow-hidden">
              <div className="flex flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16 lg:py-24">
                <p className="mb-4 text-sm font-medium tracking-wider uppercase text-muted-foreground">
                  New Collection
                </p>
                <h1 className="mb-6 text-4xl font-semibold tracking-tight md:text-5xl lg:text-7xl">
                  Summer Essentials
                </h1>
                <p className="mb-8 max-w-md text-lg text-muted-foreground">
                  Discover the perfect pieces to elevate your warm-weather
                  wardrobe. Effortless style meets uncompromising quality.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="rounded-full">
                    Shop Women&apos;s
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-full">
                    Shop Men&apos;s
                  </Button>
                </div>
              </div>
              <div className="relative min-h-[400px] w-full lg:w-1/2">
                <Image
                  alt="Summer Collection"
                  className="object-cover"
                  src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2000&auto=format&fit=crop"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  priority
                />
              </div>
            </div>
          </CarouselItem>

          <CarouselItem>
            <div className="flex flex-col-reverse bg-muted lg:flex-row lg:rounded-2xl lg:overflow-hidden">
              <div className="flex flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16 lg:py-24">
                <p className="mb-4 text-sm font-medium tracking-wider uppercase text-muted-foreground">
                  Featured
                </p>
                <h1 className="mb-6 text-4xl font-semibold tracking-tight md:text-5xl lg:text-7xl">
                  The Signature Series
                </h1>
                <p className="mb-8 max-w-md text-lg text-muted-foreground">
                  Iconic silhouettes reimagined for the modern era. Crafted from
                  premium materials with meticulous attention to detail.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="rounded-full">
                    Explore Collection
                  </Button>
                </div>
              </div>
              <div className="relative min-h-[400px] w-full lg:w-1/2">
                <Image
                  alt="Signature Series"
                  className="object-cover"
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  priority
                />
              </div>
            </div>
          </CarouselItem>
        </CarouselContent>
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-all ${
                current === index ? "bg-primary w-6" : "bg-primary/20"
              }`}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </section>
  );
}
