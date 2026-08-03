"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { useStore } from "@/components/app-provider";
import { ProductCard } from "@/components/product-card";

export function FeaturedProducts() {
  const { products, categories, hydrated } = useStore();

  if (!hydrated) {
    return (
      <section className="border-y border-line bg-surface py-18 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-12 w-1/3 bg-paper-strong" />
            <div className="mt-4 h-6 w-1/4 bg-paper-strong" />
          </div>
          <div className="mt-10 grid grid-cols-[repeat(4,minmax(250px,1fr))] gap-5 overflow-hidden">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="animate-pulse">
                <div className="aspect-[4/3] bg-paper-strong" />
                <div className="mt-4 h-4 w-2/3 bg-paper-strong" />
                <div className="mt-3 h-4 w-1/3 bg-paper-strong" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const activeCategories = categories.map((cat) => ({
    ...cat,
    products: products.filter((p) => p.active && p.featured && p.category === cat.slug),
  })).filter((cat) => cat.products.length > 0);

  if (!activeCategories.length) {
    return (
      <section className="border-y border-line bg-surface py-18 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="border border-dashed border-line p-8">
            <h3 className="text-lg font-extrabold text-ink">The drop is being prepared.</h3>
            <p className="mt-2 text-sm text-muted">Mark active products as featured in the admin panel to fill these sections.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="border-y border-line bg-surface py-18 lg:py-24">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-24 px-4 sm:px-6 lg:px-8">
        {activeCategories.map((category) => (
          <section key={category.id}>
            <div className="flex items-end justify-between gap-6">
              <div>
                <h2 className="display-type text-5xl uppercase leading-[0.92] text-ink sm:text-6xl">{category.name}</h2>
              </div>
              <Link
                href={`/shop?category=${category.slug}`}
                className="button-press hidden min-h-12 items-center gap-3 border border-ink px-5 text-sm font-extrabold text-ink hover:bg-ink hover:text-paper sm:inline-flex"
              >
                View all <ArrowRight size={18} weight="bold" />
              </Link>
            </div>

            <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible lg:grid-cols-4 lg:gap-5">
              {category.products.slice(0, 4).map((product, index) => (
                <div key={product.id} className="w-[82vw] max-w-[350px] shrink-0 snap-start md:w-auto md:max-w-none">
                  <ProductCard product={product} priority={index < 2} />
                </div>
              ))}
            </div>

            <Link
              href={`/shop?category=${category.slug}`}
              className="button-press mt-7 inline-flex min-h-12 w-full items-center justify-center gap-3 border border-ink px-5 text-sm font-extrabold text-ink hover:bg-ink hover:text-paper sm:hidden"
            >
              View all <ArrowRight size={18} weight="bold" />
            </Link>
          </section>
        ))}
      </div>
    </div>
  );
}
