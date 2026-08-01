"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBagOpen,
  Star,
} from "@phosphor-icons/react";
import { useStore } from "./app-provider";
import { ProductCard } from "./product-card";
import { ProductImage } from "./product-image";
import { categoryLabels, formatPrice } from "@/lib/utils";

export function ProductDetail({ slug }: { slug: string }) {
  const { products, reviews, hydrated, addToCart, toggleWishlist, wishlist } = useStore();
  const product = products.find((item) => item.slug === slug && item.active);
  const [imageIndex, setImageIndex] = useState(0);
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 2400);
    return () => clearTimeout(timer);
  }, [added]);

  const productReviews = useMemo(
    () => reviews.filter((review) => review.productId === product?.id && review.status === "approved"),
    [product?.id, reviews],
  );

  if (!hydrated) {
    return <div className="min-h-[80dvh] animate-pulse bg-paper-strong" />;
  }

  if (!product) {
    return (
      <div className="mx-auto flex min-h-[70dvh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <h1 className="display-type text-6xl text-ink">PRODUCT NOT FOUND.</h1>
        <p className="mt-4 text-ink-soft">This product may have been archived or the link may be incorrect.</p>
        <Link href="/shop" className="button-press mt-7 inline-flex min-h-12 items-center gap-2 bg-ink px-5 font-extrabold text-paper hover:bg-cobalt">
          <ArrowLeft size={19} weight="bold" /> Back to shop
        </Link>
      </div>
    );
  }

  const wished = wishlist.includes(product.id);
  const related = products
    .filter((item) => item.active && item.category === product.category && item.id !== product.id)
    .slice(0, 2);

  function handleAdd() {
    if (!product) return;
    const selectedSize = size || product.sizes[0] || "One size";
    addToCart(product, selectedSize, quantity);
    setAdded(true);
  }

  return (
    <div>
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <Link href="/shop" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-ink hover:text-cobalt">
          <ArrowLeft size={18} weight="bold" /> Back to shop
        </Link>

        <div className="mt-3 grid gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:gap-14">
          <div>
            <div className="relative aspect-[4/3] overflow-hidden bg-paper-strong">
              <ProductImage
                src={product.images[imageIndex] ?? product.images[0]}
                alt={product.name}
                priority
                sizes="(max-width: 1023px) 100vw, 58vw"
                className="h-full w-full object-cover"
              />
            </div>
            {product.images.length > 1 ? (
              <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setImageIndex(index)}
                    className={`relative aspect-square w-20 shrink-0 overflow-hidden border ${
                      imageIndex === index ? "border-ink" : "border-line"
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <ProductImage src={image} alt="" sizes="80px" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="lg:pt-6">
            <p className="text-sm font-bold text-cobalt">{categoryLabels[product.category]}</p>
            <h1 className="display-type mt-3 max-w-[11ch] text-6xl leading-[0.9] text-ink sm:text-7xl">
              {product.name.toUpperCase()}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
              <p className="text-2xl font-extrabold text-ink">{formatPrice(product.price)}</p>
              {product.compareAtPrice ? (
                <p className="text-base font-semibold text-muted line-through">{formatPrice(product.compareAtPrice)}</p>
              ) : null}
              <div className="flex items-center gap-1 text-action">
                <Star size={17} weight="fill" />
                <span className="text-sm font-bold text-ink">{productReviews.length ? "Verified reviews" : "New product"}</span>
              </div>
            </div>
            <p className="mt-2 text-xs font-bold text-warning">Demo product and price for presentation only.</p>
            <p className="mt-6 max-w-xl text-base leading-7 text-ink-soft">{product.description}</p>

            <div className="mt-8">
              <div className="flex items-center justify-between">
                <label className="text-sm font-extrabold text-ink" htmlFor="product-size">Choose size</label>
                <span className="text-xs font-bold text-muted">{product.stock} in stock</span>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6" id="product-size">
                {product.sizes.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setSize(item);
                      setAdded(false);
                    }}
                    className={`button-press min-h-12 border text-sm font-extrabold ${
                      (size || product.sizes[0]) === item
                        ? "border-ink bg-ink text-paper"
                        : "border-line bg-surface text-ink hover:border-ink"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-[118px_1fr_52px] gap-3">
              <div className="flex min-h-13 items-center justify-between border border-line bg-surface">
                <button
                  type="button"
                  onClick={() => {
                    setQuantity((value) => Math.max(1, value - 1));
                    setAdded(false);
                  }}
                  className="flex size-11 items-center justify-center"
                  aria-label="Decrease quantity"
                >
                  <Minus size={17} weight="bold" />
                </button>
                <span className="font-extrabold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => {
                    setQuantity((value) => Math.min(product.stock, value + 1));
                    setAdded(false);
                  }}
                  className="flex size-11 items-center justify-center"
                  aria-label="Increase quantity"
                >
                  <Plus size={17} weight="bold" />
                </button>
              </div>
              <button
                type="button"
                onClick={handleAdd}
                disabled={product.stock < 1}
                className={`button-press flex min-h-13 items-center justify-center gap-3 px-4 font-extrabold text-[#f7f7f4] ${
                  added ? "bg-success" : "bg-action hover:bg-action-hover"
                }`}
                aria-label={added ? `${product.name} added to bag` : `Add ${product.name} to bag`}
              >
                {added ? <CheckCircle size={21} weight="fill" /> : <ShoppingBagOpen size={21} weight="bold" />}
                {added ? "Added to bag" : "Add to bag"}
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className="button-press flex size-[52px] items-center justify-center border border-line bg-surface hover:border-ink"
                aria-label={wished ? "Remove from favourites" : "Save to favourites"}
                aria-pressed={wished}
              >
                <Heart size={21} weight={wished ? "fill" : "bold"} />
              </button>
            </div>

            <div className="mt-8 grid gap-4 border-t border-line pt-6 sm:grid-cols-2">
              <div className="flex gap-3">
                <CheckCircle size={22} weight="bold" className="shrink-0 text-cobalt" />
                <div>
                  <p className="text-sm font-extrabold text-ink">Stock-aware checkout</p>
                  <p className="mt-1 text-xs leading-5 text-muted">Your bag respects the available product quantity.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <ShieldCheck size={22} weight="bold" className="shrink-0 text-cobalt" />
                <div>
                  <p className="text-sm font-extrabold text-ink">Secure data path</p>
                  <p className="mt-1 text-xs leading-5 text-muted">Supabase row policies protect production catalog changes.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {productReviews.length ? (
        <section className="border-y border-line bg-surface">
          <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-8">
            <h2 className="display-type text-5xl text-ink">PLAYER REVIEWS.</h2>
            <div className="mt-7 grid gap-5 md:grid-cols-2">
              {productReviews.slice(0, 2).map((review) => (
                <blockquote key={review.id} className="border-t-2 border-cobalt pt-5">
                  <p className="text-base leading-7 text-ink-soft">“{review.body}”</p>
                  <footer className="mt-4 text-sm font-extrabold text-ink">{review.author}</footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {related.length ? (
        <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="display-type text-5xl text-ink">MORE IN {categoryLabels[product.category].toUpperCase()}.</h2>
          <div className="mt-8 grid grid-cols-2 gap-3 lg:max-w-[700px] lg:gap-5">
            {related.map((item) => <ProductCard key={item.id} product={item} />)}
          </div>
        </section>
      ) : null}
    </div>
  );
}
