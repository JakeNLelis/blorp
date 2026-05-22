export function CallToActionSection() {
  return (
    <section>
      <div className="relative h-[400px] overflow-hidden md:h-[600px]">
        <img
          alt="Model showcasing Blorp accessories"
          className="h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-1 bg-[radial-gradient(ellipse_86%_80%_at_50%_50%,rgb(0_0_0/0.56),rgb(0_0_0/0.24)_44%,rgb(0_0_0/0.1)_58%,transparent_84%),linear-gradient(rgb(0_0_0/0.1),rgb(0_0_0/0.1))]"
        />
        <div className="absolute inset-0 z-2 mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-6 p-6 text-center text-white">
          <h2 className="mx-auto max-w-3xl text-2xl font-semibold tracking-tight text-balance md:text-5xl">
            Elevate Your Everyday Style
          </h2>
          <p className="max-w-5xl text-base font-medium text-white/90 md:text-lg">
            Discover our latest collection of premium accessories designed for
            the modern aesthetic. Crafted with precision and uncompromising
            quality.
          </p>
          <a
            href="/products"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 md:h-10 md:px-5 md:py-2.5"
          >
            Shop New Arrivals
          </a>
        </div>
      </div>
    </section>
  );
}
