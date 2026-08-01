"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Minus, Plus, Trash } from "@phosphor-icons/react";
import { useStore } from "./app-provider";
import { ProductImage } from "./product-image";
import { formatPrice } from "@/lib/utils";

export function CartView() {
  const { cart, cartCount, cartTotal, hydrated, setCartQuantity, removeFromCart } = useStore();

  if (!hydrated) return <div className="min-h-[70dvh] animate-pulse bg-paper-strong" />;

  if (cart.length === 0) {
    return (
      <div className="mx-auto flex min-h-[70dvh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <h1 className="display-type text-6xl text-ink sm:text-7xl">YOUR BAG IS OPEN.</h1>
        <p className="mt-4 max-w-md text-base leading-7 text-ink-soft">
          Start with a category or use the kit builder to add all four positions at once.
        </p>
        <Link href="/shop" className="button-press mt-7 inline-flex min-h-12 items-center gap-3 bg-action px-5 font-extrabold text-[#f7f7f4] hover:bg-action-hover">
          Shop gear <ArrowRight size={19} weight="bold" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <Link href="/shop" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-ink hover:text-cobalt">
        <ArrowLeft size={18} weight="bold" /> Continue shopping
      </Link>
      <h1 className="display-type mt-4 text-6xl text-ink sm:text-7xl">YOUR BAG.</h1>
      <p className="mt-3 text-sm font-bold text-muted">{cartCount} {cartCount === 1 ? "item" : "items"}</p>

      <div className="mt-9 grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
        <div className="border-t border-line">
          {cart.map((line) => (
            <article key={line.key} className="grid grid-cols-[96px_1fr] gap-4 border-b border-line py-5 sm:grid-cols-[136px_1fr_auto] sm:gap-6">
              <Link href={`/product/${line.product.slug}`} className="relative aspect-square overflow-hidden bg-paper-strong">
                <ProductImage src={line.product.images[0]} alt={line.product.name} sizes="136px" className="h-full w-full object-cover" />
              </Link>
              <div className="min-w-0">
                <h2 className="truncate text-base font-extrabold text-ink">
                  <Link href={`/product/${line.product.slug}`} className="hover:text-cobalt">{line.product.name}</Link>
                </h2>
                <p className="mt-1 text-sm text-muted">Size {line.size}</p>
                <p className="mt-3 font-extrabold text-ink">{formatPrice(line.product.price)}</p>
                <div className="mt-4 flex items-center gap-3 sm:hidden">
                  <QuantityControl
                    quantity={line.quantity}
                    onDecrease={() => setCartQuantity(line.key, line.quantity - 1)}
                    onIncrease={() => setCartQuantity(line.key, line.quantity + 1)}
                  />
                  <button
                    type="button"
                    onClick={() => removeFromCart(line.key)}
                    className="flex size-11 items-center justify-center border border-line text-danger"
                    aria-label={`Remove ${line.product.name}`}
                  >
                    <Trash size={19} weight="bold" />
                  </button>
                </div>
              </div>
              <div className="hidden items-end justify-between gap-4 sm:flex sm:flex-col">
                <button
                  type="button"
                  onClick={() => removeFromCart(line.key)}
                  className="flex size-11 items-center justify-center text-muted hover:text-danger"
                  aria-label={`Remove ${line.product.name}`}
                >
                  <Trash size={19} weight="bold" />
                </button>
                <QuantityControl
                  quantity={line.quantity}
                  onDecrease={() => setCartQuantity(line.key, line.quantity - 1)}
                  onIncrease={() => setCartQuantity(line.key, line.quantity + 1)}
                />
              </div>
            </article>
          ))}
        </div>

        <aside className="self-start bg-surface p-5 shadow-court sm:p-7 lg:sticky lg:top-24">
          <h2 className="display-type text-4xl text-ink">ORDER TOTAL.</h2>
          <dl className="mt-6 grid gap-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Subtotal</dt>
              <dd className="font-bold text-ink">{formatPrice(cartTotal)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Shipping</dt>
              <dd className="font-bold text-ink">Calculated next</dd>
            </div>
          </dl>
          <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
            <span className="font-extrabold text-ink">Due now</span>
            <span className="text-xl font-extrabold text-ink">{formatPrice(cartTotal)}</span>
          </div>
          <Link
            href="/checkout"
            className="button-press mt-6 flex min-h-13 w-full items-center justify-center gap-3 bg-action px-5 font-extrabold text-[#f7f7f4] hover:bg-action-hover"
          >
            Continue to details <ArrowRight size={19} weight="bold" />
          </Link>
          <p className="mt-4 text-xs leading-5 text-muted">
            Demo checkout creates a pending order. Connect a payment provider and final shipping rules before launch.
          </p>
        </aside>
      </div>
    </div>
  );
}

function QuantityControl({
  quantity,
  onDecrease,
  onIncrease,
}: {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div className="flex h-11 items-center border border-line bg-surface">
      <button type="button" onClick={onDecrease} className="flex size-10 items-center justify-center" aria-label="Decrease quantity">
        <Minus size={16} weight="bold" />
      </button>
      <span className="min-w-8 text-center text-sm font-extrabold">{quantity}</span>
      <button type="button" onClick={onIncrease} className="flex size-10 items-center justify-center" aria-label="Increase quantity">
        <Plus size={16} weight="bold" />
      </button>
    </div>
  );
}
