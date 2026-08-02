"use client";

import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";
import { useStore } from "@/components/app-provider";
import { ProductImage } from "@/components/product-image";

export function DynamicCategories() {
  const { categories } = useStore();

  if (categories.length === 0) {
    return null;
  }

  const getBentoClass = (index: number) => {
    switch (index) {
      case 0:
        return "md:col-span-6 md:row-span-2";
      case 1:
        return "md:col-span-3";
      case 2:
        return "md:col-span-3";
      case 3:
        return "md:col-span-6";
      default:
        return "md:col-span-3";
    }
  };

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-18 sm:px-6 lg:px-8 lg:py-24">
      <h2 className="display-type max-w-[12ch] text-5xl leading-[0.92] text-ink sm:text-6xl uppercase">
        START WITH YOUR POSITION.
      </h2>
      <p className="mt-4 max-w-xl text-base leading-7 text-ink-soft">
        Browse the essentials separately, or bring them together in the kit builder.
      </p>

      <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 md:mx-0 md:grid md:grid-cols-12 md:grid-rows-2 md:overflow-visible lg:gap-5">
        {categories.map((category, index) => (
          <article
            key={category.id}
            className={`w-[82vw] max-w-[360px] shrink-0 snap-start md:w-auto md:max-w-none ${getBentoClass(
              index,
            )}`}
          >
            <Link href={`/shop?category=${category.slug}`} className="group flex h-full flex-col bg-surface">
              <div className="relative aspect-[4/3] overflow-hidden bg-paper-strong md:min-h-[250px] md:flex-1 md:aspect-auto">
                <ProductImage
                  src={category.image}
                  alt={category.name}
                  sizes="(max-width: 767px) 100vw, 50vw"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                />
              </div>
              <div className="grid min-h-[106px] grid-cols-[minmax(0,1fr)_44px] items-center gap-4 border border-t-0 border-line px-4 py-4 sm:px-5">
                <div className="min-w-0">
                  <h3 className="text-lg font-extrabold text-ink">{category.name}</h3>
                </div>
                <span className="flex size-11 shrink-0 items-center justify-center bg-ink text-paper transition-colors group-hover:bg-cobalt">
                  <ArrowUpRight size={20} weight="bold" />
                </span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
