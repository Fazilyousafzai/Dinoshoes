"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { useStore } from "@/components/app-provider";
import { ProductImage } from "@/components/product-image";

export function DynamicCategories() {
  const { categories } = useStore();

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-line bg-[#0d1117] py-18 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="display-type text-5xl uppercase text-ink sm:text-6xl">
              Explore Categories.
            </h2>
          </div>
          <Link
            href="/shop"
            className="group mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-cobalt hover:text-cobalt-light sm:mt-0"
          >
            Shop all <ArrowRight size={18} weight="bold" className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="scroll-area hide-scrollbar mt-10 -mx-4 overflow-x-auto px-4 pb-8 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="flex w-max gap-5">
            {categories.map((category) => (
              <div key={category.id} className="w-[280px] shrink-0 sm:w-[320px] md:w-[360px]">
                <Link
                  href={`/shop?category=${category.slug}`}
                  className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden bg-surface p-6 shadow-court outline-none ring-cobalt transition hover:shadow-hover focus-visible:ring-2"
                >
                  <div className="absolute inset-0 z-0">
                    <ProductImage
                      src={category.image}
                      alt={category.name}
                      sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, 360px"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117]/90 via-[#0d1117]/20 to-transparent" />
                  </div>
                  <div className="relative z-10 flex items-center justify-between border-t border-white/20 pt-4">
                    <h3 className="text-xl font-extrabold text-[#f3f4f2]">{category.name}</h3>
                    <div className="flex size-10 items-center justify-center bg-white/10 text-white backdrop-blur-md transition-colors group-hover:bg-cobalt">
                      <ArrowRight size={20} weight="bold" />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
