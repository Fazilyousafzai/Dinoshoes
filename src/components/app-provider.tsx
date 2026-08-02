"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle } from "@phosphor-icons/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { demoProducts, demoReviews, demoCategories } from "@/lib/demo-data";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type {
  CartLine,
  OrderInput,
  Product,
  ProductDraft,
  Review,
  ReviewStatus,
  CategoryItem,
  CategoryDraft,
} from "@/lib/types";
import { slugify } from "@/lib/utils";

type NewReview = Pick<
  Review,
  "productId" | "productName" | "author" | "email" | "rating" | "title" | "body"
>;

type CartNotice = {
  id: number;
  productName: string;
  quantity: number;
  size: string;
};

type StoreContextValue = {
  products: Product[];
  categories: CategoryItem[];
  reviews: Review[];
  approvedReviews: Review[];
  cart: CartLine[];
  wishlist: string[];
  cartCount: number;
  cartTotal: number;
  hydrated: boolean;
  isLive: boolean;
  syncError: string | null;
  addToCart: (product: Product, size: string, quantity?: number) => void;
  setCartQuantity: (key: string, quantity: number) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  submitReview: (review: NewReview) => Promise<void>;
  saveProduct: (draft: ProductDraft, files: File[]) => Promise<Product>;
  removeProduct: (productId: string) => Promise<void>;
  saveCategory: (draft: CategoryDraft, file: File) => Promise<CategoryItem>;
  removeCategory: (categoryId: string) => Promise<void>;
  moderateReview: (reviewId: string, status: ReviewStatus) => Promise<void>;
  placeOrder: (input: OrderInput) => Promise<string>;
  resetDemoData: () => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

const STORAGE_KEYS = {
  products: "halfspace-products-v1",
  reviews: "halfspace-reviews-v1",
  cart: "halfspace-cart-v1",
  wishlist: "halfspace-wishlist-v1",
};

function fromProductRow(row: Record<string, unknown>): Product {
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    category: row.category as Product["category"],
    description: String(row.description ?? ""),
    price: Number(row.price),
    compareAtPrice: row.compare_at_price ? Number(row.compare_at_price) : undefined,
    images: Array.isArray(row.images) ? (row.images as string[]) : [],
    sizes: Array.isArray(row.sizes) ? (row.sizes as string[]) : [],
    stock: Number(row.stock ?? 0),
    featured: Boolean(row.featured),
    badge: row.badge ? String(row.badge) : undefined,
    active: Boolean(row.active),
    createdAt: String(row.created_at),
  };
}

function fromReviewRow(row: Record<string, unknown>): Review {
  return {
    id: String(row.id),
    productId: row.product_id ? String(row.product_id) : undefined,
    productName: String(row.product_name),
    author: String(row.author),
    email: row.email ? String(row.email) : undefined,
    rating: Number(row.rating),
    title: String(row.title),
    body: String(row.body),
    status: row.status as ReviewStatus,
    createdAt: String(row.created_at),
  };
}

function toProductRow(product: Product) {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    description: product.description,
    price: product.price,
    compare_at_price: product.compareAtPrice ?? null,
    images: product.images,
    sizes: product.sizes,
    stock: product.stock,
    featured: product.featured,
    badge: product.badge ?? null,
    active: product.active,
  };
}

function fromCategoryRow(row: Record<string, unknown>): CategoryItem {
  return {
    id: String(row.id),
    name: String(row.name),
    slug: String(row.slug),
    image: String(row.image),
    createdAt: String(row.created_at),
  };
}

function toCategoryRow(category: CategoryItem) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    image: category.image,
  };
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error(`Could not read ${file.name}.`));
    reader.readAsDataURL(file);
  });
}

function loadLocal<T>(key: string, fallback: T): T {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [categories, setCategories] = useState<CategoryItem[]>(demoCategories);
  const [reviews, setReviews] = useState<Review[]>(demoReviews);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [cartNotice, setCartNotice] = useState<CartNotice | null>(null);
  const cartNoticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (cartNoticeTimer.current) clearTimeout(cartNoticeTimer.current);
    },
    [],
  );

  useEffect(() => {
    let cancelled = false;

    async function hydrateStore() {
      await Promise.resolve();
      if (cancelled) return;
      setProducts(loadLocal(STORAGE_KEYS.products, demoProducts));
      setReviews(loadLocal(STORAGE_KEYS.reviews, demoReviews));
      setCart(loadLocal(STORAGE_KEYS.cart, []));
      setWishlist(loadLocal(STORAGE_KEYS.wishlist, []));
      setHydrated(true);

      if (!supabase) return;
      const [productResult, reviewResult, categoryResult] = await Promise.all([
        supabase.from("products").select("*").order("created_at", { ascending: false }),
        supabase.from("reviews").select("*").order("created_at", { ascending: false }),
        supabase.from("categories").select("*").order("name", { ascending: true }),
      ]);

      if (cancelled) return;

      if (productResult.error || reviewResult.error || categoryResult.error) {
        setSyncError(
          productResult.error?.message ??
            reviewResult.error?.message ??
            categoryResult.error?.message ??
            "Supabase sync failed. Demo data remains available.",
        );
        return;
      }

      setProducts((productResult.data ?? []).map((row) => fromProductRow(row)));
      setReviews((reviewResult.data ?? []).map((row) => fromReviewRow(row)));
      setCategories((categoryResult.data ?? []).map((row) => fromCategoryRow(row)));
      setSyncError(null);
    }

    void hydrateStore();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  useEffect(() => {
    if (!hydrated || isSupabaseConfigured) return;
    try {
      window.localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
      window.localStorage.setItem(STORAGE_KEYS.reviews, JSON.stringify(reviews));
      window.localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
      window.localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(wishlist));
    } catch {
      queueMicrotask(() =>
        setSyncError("Local demo storage is full. Large camera images may need Supabase Storage."),
      );
    }
  }, [cart, hydrated, products, reviews, wishlist]);

  const addToCart = useCallback((product: Product, size: string, quantity = 1) => {
    const key = `${product.id}:${size}`;
    setCart((current) => {
      const existing = current.find((line) => line.key === key);
      if (existing) {
        return current.map((line) =>
          line.key === key
            ? { ...line, quantity: Math.min(line.quantity + quantity, product.stock) }
            : line,
        );
      }
      return [...current, { key, product, size, quantity }];
    });

    setCartNotice({
      id: Date.now(),
      productName: product.name,
      quantity,
      size,
    });
    if (cartNoticeTimer.current) clearTimeout(cartNoticeTimer.current);
    cartNoticeTimer.current = setTimeout(() => setCartNotice(null), 3600);
  }, []);

  const setCartQuantity = useCallback((key: string, quantity: number) => {
    setCart((current) =>
      current
        .map((line) =>
          line.key === key
            ? { ...line, quantity: Math.min(Math.max(quantity, 0), line.product.stock) }
            : line,
        )
        .filter((line) => line.quantity > 0),
    );
  }, []);

  const removeFromCart = useCallback((key: string) => {
    setCart((current) => current.filter((line) => line.key !== key));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  }, []);

  const submitReview = useCallback(
    async (review: NewReview) => {
      const next: Review = {
        ...review,
        id: crypto.randomUUID(),
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      if (supabase) {
        const { data, error } = await supabase
          .from("reviews")
          .insert({
            product_id: next.productId ?? null,
            product_name: next.productName,
            author: next.author,
            email: next.email ?? null,
            rating: next.rating,
            title: next.title,
            body: next.body,
            status: "pending",
          })
          .select("*")
          .single();
        if (error) throw error;
        setReviews((current) => [fromReviewRow(data), ...current]);
        return;
      }

      setReviews((current) => [next, ...current]);
    },
    [supabase],
  );

  const saveProduct = useCallback(
    async (draft: ProductDraft, files: File[]) => {
      const id = draft.id ?? crypto.randomUUID();
      const newImages: string[] = [];

      for (const file of files) {
        if (supabase) {
          const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]+/g, "-");
          const path = `${id}/${crypto.randomUUID()}-${safeName}`;
          const { error } = await supabase.storage
            .from("product-media")
            .upload(path, file, { cacheControl: "3600", upsert: false });
          if (error) throw error;
          const { data } = supabase.storage.from("product-media").getPublicUrl(path);
          newImages.push(data.publicUrl);
        } else {
          newImages.push(await fileToDataUrl(file));
        }
      }

      const product: Product = {
        ...draft,
        id,
        slug: draft.slug || slugify(draft.name),
        images: [...draft.images, ...newImages],
        createdAt: draft.createdAt ?? new Date().toISOString(),
      };

      if (supabase) {
        const { error } = await supabase.from("products").upsert(toProductRow(product));
        if (error) throw error;
      }

      setProducts((current) => {
        const exists = current.some((item) => item.id === product.id);
        return exists
          ? current.map((item) => (item.id === product.id ? product : item))
          : [product, ...current];
      });
      return product;
    },
    [supabase],
  );

  const removeProduct = useCallback(
    async (productId: string) => {
      if (supabase) {
        const { error } = await supabase
          .from("products")
          .update({ active: false })
          .eq("id", productId);
        if (error) throw error;
      }
      setProducts((current) => current.filter((product) => product.id !== productId));
    },
    [supabase],
  );

  const saveCategory = useCallback(
    async (draft: CategoryDraft, file: File) => {
      const id = draft.id ?? crypto.randomUUID();
      let imageUrl = draft.image ?? "";

      if (file) {
        if (supabase) {
          const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]+/g, "-");
          const path = `${id}/${crypto.randomUUID()}-${safeName}`;
          const { error } = await supabase.storage
            .from("product-media")
            .upload(path, file, { cacheControl: "3600", upsert: false });
          if (error) throw error;
          const { data } = supabase.storage.from("product-media").getPublicUrl(path);
          imageUrl = data.publicUrl;
        } else {
          imageUrl = await fileToDataUrl(file);
        }
      }

      const category: CategoryItem = {
        ...draft,
        id,
        slug: draft.slug || slugify(draft.name),
        image: imageUrl,
        createdAt: draft.createdAt ?? new Date().toISOString(),
      };

      if (supabase) {
        const { error } = await supabase.from("categories").upsert(toCategoryRow(category));
        if (error) throw error;
      }

      setCategories((current) => {
        const exists = current.some((item) => item.id === category.id);
        return exists
          ? current.map((item) => (item.id === category.id ? category : item))
          : [category, ...current];
      });
      return category;
    },
    [supabase],
  );

  const removeCategory = useCallback(
    async (categoryId: string) => {
      if (supabase) {
        const { error } = await supabase.from("categories").delete().eq("id", categoryId);
        if (error) throw error;
      }
      setCategories((current) => current.filter((cat) => cat.id !== categoryId));
    },
    [supabase],
  );

  const moderateReview = useCallback(
    async (reviewId: string, status: ReviewStatus) => {
      if (supabase) {
        const { error } = await supabase.from("reviews").update({ status }).eq("id", reviewId);
        if (error) throw error;
      }
      setReviews((current) =>
        current.map((review) => (review.id === reviewId ? { ...review, status } : review)),
      );
    },
    [supabase],
  );

  const placeOrder = useCallback(
    async (input: OrderInput) => {
      if (cart.length === 0) throw new Error("Your bag is empty.");

      if (supabase) {
        const { data, error } = await supabase.rpc("place_order", {
          customer: input,
          items: cart.map((line) => ({
            product_id: line.product.id,
            quantity: line.quantity,
            size: line.size,
          })),
        });
        if (error) throw error;
        clearCart();
        return String(data);
      }

      const reference = `DEMO-${Date.now().toString().slice(-7)}`;
      clearCart();
      return reference;
    },
    [cart, clearCart, supabase],
  );

  const resetDemoData = useCallback(() => {
    if (isSupabaseConfigured) return;
    setProducts(demoProducts);
    setReviews(demoReviews);
    setCart([]);
    setWishlist([]);
    setCartNotice(null);
  }, []);

  const value = useMemo<StoreContextValue>(
    () => ({
      products,
      categories,
      reviews,
      approvedReviews: reviews.filter((review) => review.status === "approved"),
      cart,
      wishlist,
      cartCount: cart.reduce((sum, line) => sum + line.quantity, 0),
      cartTotal: cart.reduce((sum, line) => sum + line.quantity * line.product.price, 0),
      hydrated,
      isLive: isSupabaseConfigured,
      syncError,
      addToCart,
      setCartQuantity,
      removeFromCart,
      clearCart,
      toggleWishlist,
      submitReview,
      saveProduct,
      removeProduct,
      saveCategory,
      removeCategory,
      moderateReview,
      placeOrder,
      resetDemoData,
    }),
    [
      addToCart,
      cart,
      categories,
      clearCart,
      hydrated,
      moderateReview,
      placeOrder,
      products,
      removeFromCart,
      removeProduct,
      resetDemoData,
      reviews,
      saveCategory,
      removeCategory,
      saveProduct,
      setCartQuantity,
      submitReview,
      syncError,
      toggleWishlist,
      wishlist,
    ],
  );

  return (
    <StoreContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[70] flex justify-end sm:inset-x-6 sm:bottom-6"
        aria-live="polite"
        aria-atomic="true"
      >
        {cartNotice ? (
          <div
            key={cartNotice.id}
            role="status"
            className="cart-notice-enter pointer-events-auto w-full max-w-sm border border-white/15 bg-[#12161c] p-4 text-[#f3f4f2] shadow-court"
          >
            <div className="flex items-start gap-3">
              <CheckCircle size={24} weight="fill" className="mt-0.5 shrink-0 text-[#75c7a2]" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold">Added to bag</p>
                <p className="mt-1 truncate text-xs leading-5 text-[#c7cdd2]">
                  {cartNotice.quantity} × {cartNotice.productName} · {cartNotice.size}
                </p>
              </div>
            </div>
            <Link
              href="/cart"
              onClick={() => setCartNotice(null)}
              className="button-press mt-4 flex min-h-11 w-full items-center justify-center gap-2 bg-action px-4 text-sm font-extrabold text-[#f7f7f4] hover:bg-action-hover"
            >
              View bag <ArrowRight size={18} weight="bold" />
            </Link>
          </div>
        ) : null}
      </div>
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within AppProvider.");
  return context;
}
