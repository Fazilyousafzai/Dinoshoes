"use client";

import { useMemo, useState } from "react";
import { ArrowClockwise, Check, ShoppingBagOpen } from "@phosphor-icons/react";
import { useStore } from "@/components/app-provider";
import { ProductImage } from "@/components/product-image";
import type { Category, Product } from "@/lib/types";
import { categoryLabels, formatPrice } from "@/lib/utils";

const categories: Category[] = ["studs", "grippers", "socks", "footballs"];

export function KitBuilder() {
  const { products, addToCart } = useStore();
  const active = useMemo(() => products.filter((product) => product.active && product.stock > 0), [products]);
  const [indices, setIndices] = useState<Record<Category, number>>({
    studs: 0,
    grippers: 0,
    socks: 0,
    footballs: 0,
  });
  const [added, setAdded] = useState(false);

  const selected = categories
    .map((category) => {
      const options = active.filter((product) => product.category === category);
      return options[indices[category] % Math.max(options.length, 1)];
    })
    .filter(Boolean) as Product[];

  const total = selected.reduce((sum, product) => sum + product.price, 0);

  function cycle(category: Category) {
    setAdded(false);
    setIndices((current) => ({ ...current, [category]: current[category] + 1 }));
  }

  function addKit() {
    selected.forEach((product) => addToCart(product, product.sizes[0] ?? "One size"));
    setAdded(true);
  }

  return (
    <section id="kit-builder" className="court-texture bg-cobalt py-18 text-[#f2f4f5] lg:py-24">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-8">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="display-type max-w-[9ch] text-6xl leading-[0.88] text-[#f2f4f5] sm:text-7xl">
            BUILD THE FULL KIT.
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-[#dbe5f2]">
            Cycle each position, check your total, then send the complete loadout to your bag.
          </p>
          <div className="mt-8 flex items-end justify-between border-t border-[#f2f4f5]/28 pt-6 lg:block">
            <div>
              <p className="text-sm font-bold text-[#c6d5e8]">Kit total</p>
              <p className="display-type mt-1 text-5xl text-[#f2f4f5]">{formatPrice(total)}</p>
            </div>
            <button
              type="button"
              onClick={addKit}
              disabled={selected.length !== 4}
              className="button-press mt-6 inline-flex min-h-13 items-center justify-center gap-3 bg-action px-6 font-extrabold text-[#f7f7f4] hover:bg-action-hover disabled:bg-[#6e7781]"
            >
              {added ? <Check size={20} weight="bold" /> : <ShoppingBagOpen size={20} weight="bold" />}
              {added ? "Kit added" : "Add full kit"}
            </button>
          </div>
        </div>

        <div className="border-y border-[#f2f4f5]/24">
          {categories.map((category) => {
            const options = active.filter((product) => product.category === category);
            const product = options[indices[category] % Math.max(options.length, 1)];
            return (
              <div
                key={category}
                className="grid grid-cols-[84px_1fr_auto] items-center gap-4 border-b border-[#f2f4f5]/24 py-4 last:border-b-0 sm:grid-cols-[112px_1fr_auto]"
              >
                <div className="relative aspect-square overflow-hidden bg-[#0d3478]">
                  {product ? (
                    <ProductImage
                      src={product.images[0]}
                      alt=""
                      sizes="112px"
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#c6d5e8]">{categoryLabels[category]}</p>
                  <h3 className="mt-1 truncate text-base font-extrabold text-[#f2f4f5] sm:text-lg">
                    {product?.name ?? "Add a product in admin"}
                  </h3>
                  <p className="mt-1 text-sm text-[#dbe5f2]">{product ? formatPrice(product.price) : "Not available"}</p>
                </div>
                <button
                  type="button"
                  onClick={() => cycle(category)}
                  disabled={options.length < 2}
                  className="button-press flex size-11 items-center justify-center border border-[#f2f4f5]/42 text-[#f2f4f5] hover:bg-[#f2f4f5] hover:text-cobalt disabled:opacity-30"
                  aria-label={`Change ${categoryLabels[category]} selection`}
                >
                  <ArrowClockwise size={19} weight="bold" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
