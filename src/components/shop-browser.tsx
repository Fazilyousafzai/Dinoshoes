"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CaretDown, MagnifyingGlass, SlidersHorizontal, X } from "@phosphor-icons/react";
import { useStore } from "./app-provider";
import { ProductCard } from "./product-card";
import type { Category } from "@/lib/types";
import { formatCategory } from "@/lib/utils";

type Sort = "newest" | "price-low" | "price-high" | "name";

export function ShopBrowser() {
  const params = useSearchParams();
  const searchRef = useRef<HTMLInputElement>(null);
  const { products, hydrated } = useStore();
  const initialCategory = params.get("category") as Category | null;
  const [category, setCategory] = useState<Category | "all">(
    initialCategory && products.some((p) => p.category === initialCategory) ? initialCategory : "all",
  );
  const [query, setQuery] = useState("");
  const [sizeFilter, setSizeFilter] = useState<string>("all");
  const [sort, setSort] = useState<Sort>("newest");

  const allSizes = useMemo(() => {
    const sizes = new Set<string>();
    products.forEach((p) => {
      if (p.active) p.sizes.forEach((s) => sizes.add(s));
    });
    return Array.from(sizes).sort((a, b) => {
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.localeCompare(b);
    });
  }, [products]);

  useEffect(() => {
    if (params.get("focus") === "search") searchRef.current?.focus();
  }, [params]);

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const filtered = products.filter(
      (product) =>
        product.active &&
        (category === "all" || product.category === category) &&
        (sizeFilter === "all" || product.sizes.includes(sizeFilter)) &&
        (!normalized ||
          product.name.toLowerCase().includes(normalized) ||
          product.description.toLowerCase().includes(normalized)),
    );

    return [...filtered].sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "name") return a.name.localeCompare(b.name);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [category, products, query, sort, sizeFilter]);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="max-w-2xl">
        <h1 className="display-type text-6xl leading-[0.9] text-ink sm:text-7xl">SHOP THE WHOLE PITCH.</h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-ink-soft">
          Search the catalog, narrow by category, and check stock before adding your size.
        </p>

      </div>

      <div className="mt-10 grid gap-4 border-y border-line py-5 md:grid-cols-[1fr_auto_auto]">
        <label className="relative block">
          <span className="sr-only">Search products</span>
          <MagnifyingGlass
            size={21}
            weight="bold"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search boots, socks, balls"
            className="field-input field-input-leading field-input-trailing"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-1 top-1 flex size-11 items-center justify-center text-muted hover:text-ink"
              aria-label="Clear search"
            >
              <X size={18} weight="bold" />
            </button>
          ) : null}
        </label>
        <label className="relative flex min-w-[140px] items-center">
          <span className="sr-only">Filter by size</span>
          <select
            value={sizeFilter}
            onChange={(event) => setSizeFilter(event.target.value)}
            className="field-input field-input-trailing cursor-pointer appearance-none pl-4"
          >
            <option value="all">All sizes</option>
            {allSizes.map((size) => (
              <option key={size} value={size}>
                Size {size}
              </option>
            ))}
          </select>
          <CaretDown
            size={17}
            weight="bold"
            className="pointer-events-none absolute right-4 text-muted"
            aria-hidden="true"
          />
        </label>
        <label className="relative flex min-w-[220px] items-center">
          <SlidersHorizontal
            size={20}
            weight="bold"
            className="pointer-events-none absolute left-4 text-muted"
          />
          <span className="sr-only">Sort products</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as Sort)}
            className="field-input field-input-leading field-input-trailing cursor-pointer appearance-none"
          >
            <option value="newest">Newest first</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="name">Name</option>
          </select>
          <CaretDown
            size={17}
            weight="bold"
            className="pointer-events-none absolute right-4 text-muted"
            aria-hidden="true"
          />
        </label>
      </div>

      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-6 sm:-mx-6 sm:px-6 md:mx-0 md:flex-wrap md:px-0">
        <button
          type="button"
          onClick={() => setCategory("all")}
          className={`button-press min-h-11 shrink-0 border px-4 text-sm font-bold ${
            category === "all" ? "border-ink bg-ink text-paper" : "border-line bg-surface text-ink hover:border-ink"
          }`}
        >
          All gear
        </button>
        {Array.from(new Set(products.map(p => p.category))).map((key) => (
          <button
            key={key}
            type="button"
            className={`button-press min-h-11 shrink-0 border px-4 text-sm font-bold ${
              category === key ? "border-ink bg-ink text-paper" : "border-line bg-surface text-ink hover:border-ink"
            }`}
            onClick={() => setCategory(key)}
          >
            {formatCategory(key)}
          </button>
        ))}
      </div>

      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-sm font-bold text-ink">
          {hydrated ? `${visible.length} ${visible.length === 1 ? "product" : "products"}` : "Loading catalog"}
        </p>
        {(category !== "all" || query || sizeFilter !== "all") && (
          <button
            type="button"
            onClick={() => {
              setCategory("all");
              setQuery("");
              setSizeFilter("all");
            }}
            className="button-press inline-flex h-9 items-center gap-1.5 border border-line px-3 text-xs font-bold text-ink hover:border-ink"
          >
            <X size={13} weight="bold" />
            Clear filters
          </button>
        )}
      </div>

      {!hydrated ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-[4/3] bg-paper-strong" />
              <div className="mt-4 h-4 w-3/4 bg-paper-strong" />
              <div className="mt-3 h-4 w-1/3 bg-paper-strong" />
            </div>
          ))}
        </div>
      ) : visible.length ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-9 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-12">
          {visible.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 4} />
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-line bg-surface px-5 py-16 text-center">
          <h2 className="display-type text-4xl text-ink">NO GEAR FOUND.</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
            Try a shorter search or clear the current category filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setCategory("all");
              setQuery("");
            }}
            className="button-press mt-6 min-h-12 bg-ink px-5 text-sm font-extrabold text-paper hover:bg-cobalt"
          >
            Show all gear
          </button>
        </div>
      )}
    </div>
  );
}
