import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function HandbagCategorySection() {
  return (
    <section className="py-32">
      <div
        className="relative bg-cover bg-center bg-no-repeat before:absolute before:inset-0 before:bg-black/30"
        style={{
          backgroundImage:
            "url(https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/Luxurious-Handbag-Display-2.png)",
        }}
      >
        <div className="relative z-10 container flex min-h-80 flex-col px-6 py-4">
          <div>
            <Breadcrumb>
              <BreadcrumbList className="text-white/70">
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-white/70 hover:text-white">
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-white/70" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-normal text-white/70">
                    Handbags
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex flex-1 items-center">
            <div className="space-y-4">
              <h1 className="text-2xl font-medium leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
                Handbags
              </h1>
              <p className="max-w-[400px] text-balance text-white/80">
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
