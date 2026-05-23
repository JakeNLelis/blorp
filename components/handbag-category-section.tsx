import Link from "next/link";

export function HandbagCategorySection() {
  return (
    <section className="py-24 container mx-auto px-6">
      <Link href="/products?category=handbags" className="block group">
        <div className="relative bg-cover bg-center bg-no-repeat before:absolute before:inset-0 before:bg-black/45 overflow-hidden rounded-xl border border-white/5 transition-all duration-500 hover:border-primary/20">
          {/* Zoom effect on background */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat group-hover:scale-105 transition-transform duration-700"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=1600&auto=format&fit=crop")',
            }}
          />
          <div className="relative z-10 container mx-auto px-8 md:px-16 flex min-h-95 flex-col justify-between py-12">
            <div>
              <nav aria-label="breadcrumb" data-slot="breadcrumb" className="">
                <ol
                  data-slot="breadcrumb-list"
                  className="text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm wrap-break-word sm:gap-2.5"
                >
                  <li
                    data-slot="breadcrumb-item"
                    className="inline-flex items-center gap-1.5"
                  >
                    <span
                      data-slot="breadcrumb-link"
                      className="transition-colors cursor-pointer text-white/50 hover:text-white"
                    >
                      Collections
                    </span>
                  </li>
                  <li
                    data-slot="breadcrumb-separator"
                    role="presentation"
                    aria-hidden="true"
                    className="text-white/50"
                  >
                    /
                  </li>
                  <li
                    data-slot="breadcrumb-item"
                    className="inline-flex items-center gap-1.5"
                  >
                    <span
                      data-slot="breadcrumb-page"
                      role="link"
                      aria-disabled="true"
                      aria-current="page"
                      className="font-normal text-white/90 font-sans"
                    >
                      Handbags
                    </span>
                  </li>
                </ol>
              </nav>
            </div>
            <div className="flex flex-col items-start gap-4 max-w-xl">
              <span className="text-[10px] bg-white/10 text-white font-bold tracking-widest uppercase px-3 py-1 rounded-none border border-white/20">
                Signature Selection
              </span>
              <h2 className="text-3xl leading-tight font-semibold text-white sm:text-4xl md:text-5xl font-heading">
                Exquisite Handbags
              </h2>
              <p className="text-balance text-white/80 font-sans text-sm md:text-base leading-relaxed">
                Explore our signature collection of bespoke handbags, designed
                for bold sophistication and uncompromising practicality.
              </p>
              <div className="text-white font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-2 mt-2">
                Discover the Collection →
              </div>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
