import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CallToActionSection() {
  return (
    <section>
      <div className="relative h-[400px] overflow-hidden md:h-[600px]">
        <img
          alt="Sunlight through trees above a green forest valley"
          className="h-full w-full object-cover"
          src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/full-width-backgrounds/andrew-kliatskyi-uBg4k82xnI4-unsplash.jpg"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_86%_80%_at_50%_50%,rgb(0_0_0/0.56),rgb(0_0_0/0.24)_44%,rgb(0_0_0/0.1)_58%,transparent_84%),linear-gradient(rgb(0_0_0/0.1),rgb(0_0_0/0.1))]"
        />
        <div className="absolute inset-0 z-20 mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-6 p-6 text-center text-white">
          <h2 className="mx-auto max-w-3xl text-balance text-2xl font-semibold tracking-tight md:text-5xl">
            Call to Action
          </h2>
          <p className="max-w-5xl text-base font-medium text-white/90 md:text-lg">
            Try our service free for 7 days. No credit card required.
          </p>
          <Button asChild size="lg" className="gap-2">
            <a href="https://www.shadcnblocks.com">
              Start free trial
              <ArrowRight className="size-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
