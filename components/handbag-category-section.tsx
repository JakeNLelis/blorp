export function HandbagCategorySection() {
  return (
    <section className="py-32">
      <div
        className="relative bg-cover bg-center bg-no-repeat before:absolute before:inset-0 before:bg-black/30 px-20"
        style={{
          backgroundImage:
            'url("https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/Luxurious-Handbag-Display-2.png")',
        }}
      >
        <div className="relative z-10 container flex min-h-80 flex-col py-4">
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
                  <a
                    data-slot="breadcrumb-link"
                    className="transition-colors cursor-pointer text-white/70 hover:text-white"
                  >
                    Home
                  </a>
                </li>
                <li
                  data-slot="breadcrumb-separator"
                  role="presentation"
                  aria-hidden="true"
                  className="[&>svg]:size-3.5 text-white/70"
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
                    className="font-normal text-white/70"
                  >
                    Handbags
                  </span>
                </li>
              </ol>
            </nav>
          </div>
          <div className="flex flex-1 items-center">
            <div className="space-y-4">
              <h1 className="text-2xl leading-tight font-medium text-white sm:text-3xl md:text-4xl lg:text-5xl">
                Handbags
              </h1>
              <p className="max-w-100 text-balance text-white/80">
                Explore our collection of handbags, designed for style and
                practicality to complement every occasion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
