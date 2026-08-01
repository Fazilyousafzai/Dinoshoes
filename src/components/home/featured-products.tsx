"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { useStore } from "@/components/app-provider";
import { ProductCard } from "@/components/product-card";

export function FeaturedProducts() {
  const { products, hydrated } = useStore();
  const featured = products.filter((product) => product.active && product.featured).slice(0, 4);

  return (
    <section className="border-y border-line bg-surface py-18 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="display-type text-5xl leading-[0.92] text-ink sm:text-6xl">THE LATEST DROP.</h2>
            <p className="mt-4 max-w-lg text-base leading-7 text-ink-soft">
              Fresh additions across the pitch, selected for a complete match-day setup.
            </p>
            <p className="mt-2 text-xs font-bold text-warning">Demo catalog and prices for presentation only.</p>
          </div>
          <Link
            href="/shop"
            className="button-press hidden min-h-12 items-center gap-3 border border-ink px-5 text-sm font-extrabold text-ink hover:bg-ink hover:text-paper sm:inline-flex"
          >
            View all <ArrowRight size={18} weight="bold" />
          </Link>
        </div>

        {!hydrated ? (
          <div className="mt-10 grid grid-cols-[repeat(4,minmax(250px,1fr))] gap-5 overflow-hidden">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="animate-pulse">
                <div className="aspect-[4/3] bg-paper-strong" />
                <div className="mt-4 h-4 w-2/3 bg-paper-strong" />
                <div className="mt-3 h-4 w-1/3 bg-paper-strong" />
              </div>
            ))}
          </div>
        ) : featured.length ? (
          <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible lg:grid-cols-4 lg:gap-5">
            {featured.map((product, index) => (
              <div key={product.id} className="w-[82vw] max-w-[350px] shrink-0 snap-start md:w-auto md:max-w-none">
                <ProductCard product={product} priority={index < 2} />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 border border-dashed border-line p-8">
            <h3 className="text-lg font-extrabold text-ink">The drop is being prepared.</h3>
            <p className="mt-2 text-sm text-muted">Mark products as featured in the admin panel to fill this rail.</p>
          </div>
        )}

        <Link
          href="/shop"
          className="button-press mt-7 inline-flex min-h-12 w-full items-center justify-center gap-3 border border-ink px-5 text-sm font-extrabold text-ink hover:bg-ink hover:text-paper sm:hidden"
        >
          View all <ArrowRight size={18} weight="bold" />
        </Link>
      </div>
    </section>
  );
}
