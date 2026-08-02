"use client";

import Link from "next/link";
import { ArrowUpRight, CheckCircle, Heart, ShoppingBagOpen } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/types";
import { formatCategory, formatPrice } from "@/lib/utils";
import { useStore } from "./app-provider";
import { ProductImage } from "./product-image";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const wished = wishlist.includes(product.id);
  const defaultSize = product.sizes[0] ?? "One size";
  const [added, setAdded] = useState(false);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
    },
    [],
  );

  function handleAdd() {
    addToCart(product, defaultSize);
    setAdded(true);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(false), 2400);
  }

  return (
    <article className="group min-w-0">
      <div className="relative aspect-[4/3] overflow-hidden bg-paper-strong">
        <Link href={`/product/${product.slug}`} aria-label={`View ${product.name}`}>
          <ProductImage
            src={product.images[0] ?? "/images/category-studs.png"}
            alt={product.name}
            priority={priority}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
          />
        </Link>
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className="button-press absolute right-3 top-3 flex size-11 items-center justify-center bg-surface/94 text-ink shadow-sm hover:bg-surface"
          aria-label={wished ? `Remove ${product.name} from favourites` : `Save ${product.name}`}
          aria-pressed={wished}
        >
          <Heart size={20} weight={wished ? "fill" : "bold"} />
        </button>
      </div>
      <div className="pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold text-muted">{formatCategory(product.category)}</p>
            <h3 className="mt-1 truncate text-base font-bold text-ink">
              <Link href={`/product/${product.slug}`} className="hover:text-cobalt">
                {product.name}
              </Link>
            </h3>
          </div>
          <Link
            href={`/product/${product.slug}`}
            className="button-press flex size-10 shrink-0 items-center justify-center border border-line text-ink hover:border-ink"
            aria-label={`Open ${product.name}`}
          >
            <ArrowUpRight size={18} weight="bold" />
          </Link>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="font-extrabold text-ink">
            {formatPrice(product.price)}
            {product.compareAtPrice ? (
              <span className="ml-2 text-sm font-medium text-muted line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            ) : null}
          </p>
          <button
            type="button"
            onClick={handleAdd}
            disabled={product.stock < 1}
            className={`button-press flex min-h-11 items-center gap-1.5 px-2 text-xs font-bold transition-colors disabled:bg-muted ${
              added ? "bg-success text-paper" : "bg-ink text-paper hover:bg-cobalt"
            }`}
            aria-label={added ? `${product.name} added to bag` : `Add ${product.name} to bag`}
          >
            {added ? <CheckCircle size={17} weight="fill" /> : <ShoppingBagOpen size={17} weight="bold" />}
            {product.stock > 0 ? (added ? "Added" : "Add") : "Sold out"}
          </button>
        </div>
      </div>
    </article>
  );
}
