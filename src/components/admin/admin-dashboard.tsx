"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Camera,
  Check,
  CheckCircle,
  Eye,
  GearSix,
  Images,
  Package,
  PencilSimple,
  Plus,
  SignOut,
  Star,
  Storefront,
  Trash,
  UploadSimple,
  X,
  XCircle,
} from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";
import type { Category, Product, ProductDraft, ReviewStatus } from "@/lib/types";
import { categoryLabels, formatPrice, slugify } from "@/lib/utils";
import { useStore } from "../app-provider";
import { ProductImage } from "../product-image";

type Tab = "overview" | "products" | "reviews" | "settings";

const tabs: { id: Tab; label: string; icon: typeof Storefront }[] = [
  { id: "overview", label: "Overview", icon: Storefront },
  { id: "products", label: "Products", icon: Package },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "settings", label: "Setup", icon: GearSix },
];

export function AdminDashboard() {
  const store = useStore();
  const [tab, setTab] = useState<Tab>("overview");
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const activeProducts = store.products.filter((product) => product.active);
  const pending = store.reviews.filter((review) => review.status === "pending");
  const lowStock = activeProducts.filter((product) => product.stock > 0 && product.stock <= 10);

  async function handleDelete(product: Product) {
    if (confirmDelete !== product.id) {
      setConfirmDelete(product.id);
      return;
    }
    setBusyId(product.id);
    try {
      await store.removeProduct(product.id);
      setNotice(`${product.name} was archived.`);
      setConfirmDelete(null);
    } catch (cause) {
      setNotice(cause instanceof Error ? cause.message : "The product could not be archived.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleModeration(id: string, status: ReviewStatus) {
    setBusyId(id);
    try {
      await store.moderateReview(id, status);
      setNotice(status === "approved" ? "Review published." : "Review rejected.");
    } catch (cause) {
      setNotice(cause instanceof Error ? cause.message : "The review could not be updated.");
    } finally {
      setBusyId(null);
    }
  }

  async function signOut() {
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    window.location.assign("/admin/login");
  }

  return (
    <div className="min-h-[100dvh] bg-paper text-ink lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-line bg-[#12161c] text-[#f2f4f5] lg:sticky lg:top-0 lg:h-[100dvh] lg:border-b-0 lg:border-r lg:border-white/10">
        <div className="flex h-[68px] items-center justify-between px-4 lg:px-5">
          <Link href="/" className="display-type text-2xl text-[#f2f4f5]">HALFSPACE</Link>
          <Link href="/" className="flex size-11 items-center justify-center border border-white/15 lg:hidden" aria-label="View store">
            <Eye size={21} weight="bold" />
          </Link>
        </div>
        <nav className="no-scrollbar flex gap-2 overflow-x-auto border-t border-white/10 px-4 py-3 lg:grid lg:gap-1 lg:px-3 lg:py-5" aria-label="Admin sections">
          {tabs.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`button-press flex min-h-11 shrink-0 items-center gap-3 px-3 text-sm font-bold lg:w-full ${
                  tab === item.id ? "bg-action text-[#f7f7f4]" : "text-[#aeb7c2] hover:bg-white/8 hover:text-white"
                }`}
              >
                <Icon size={20} weight="bold" /> {item.label}
                {item.id === "reviews" && pending.length ? (
                  <span className="ml-auto bg-[#f2f4f5] px-1.5 py-0.5 text-[10px] font-extrabold text-[#12161c]">{pending.length}</span>
                ) : null}
              </button>
            );
          })}
        </nav>
        <div className="hidden border-t border-white/10 p-3 lg:absolute lg:inset-x-0 lg:bottom-0 lg:block">
          <Link href="/" className="button-press flex min-h-11 items-center gap-3 px-3 text-sm font-bold text-[#aeb7c2] hover:bg-white/8 hover:text-white">
            <ArrowLeft size={19} weight="bold" /> View store
          </Link>
          {store.isLive ? (
            <button type="button" onClick={signOut} className="button-press flex min-h-11 w-full items-center gap-3 px-3 text-sm font-bold text-[#aeb7c2] hover:bg-white/8 hover:text-white">
              <SignOut size={19} weight="bold" /> Sign out
            </button>
          ) : null}
        </div>
      </aside>

      <main className="min-w-0">
        <header className="border-b border-line bg-surface px-4 py-5 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-5">
            <div>
              <p className="text-xs font-bold text-muted">Admin panel</p>
              <h1 className="mt-1 text-xl font-extrabold text-ink">{tabs.find((item) => item.id === tab)?.label}</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className={`hidden px-3 py-2 text-xs font-extrabold sm:inline-flex ${store.isLive ? "bg-success/12 text-success" : "bg-warning/12 text-warning"}`}>
                {store.isLive ? "Supabase connected" : "Local demo mode"}
              </span>
              {tab === "products" ? (
                <button type="button" onClick={() => setEditing("new")} className="button-press flex min-h-11 items-center gap-2 bg-action px-4 text-sm font-extrabold text-[#f7f7f4] hover:bg-action-hover">
                  <Plus size={19} weight="bold" /> Add product
                </button>
              ) : null}
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8 lg:py-9">
          {store.syncError ? (
            <div className="mb-6 border border-warning bg-warning/8 p-4 text-sm font-semibold text-warning">
              {store.syncError}
            </div>
          ) : null}
          {notice ? (
            <div className="mb-6 flex items-center justify-between gap-4 border border-line bg-surface p-4 text-sm font-semibold text-ink" role="status">
              {notice}
              <button type="button" onClick={() => setNotice(null)} className="flex size-9 items-center justify-center" aria-label="Dismiss notification">
                <X size={18} weight="bold" />
              </button>
            </div>
          ) : null}

          {tab === "overview" ? (
            <Overview products={activeProducts.length} pending={pending.length} lowStock={lowStock.length} onOpenProducts={() => setTab("products")} onOpenReviews={() => setTab("reviews")} />
          ) : null}

          {tab === "products" ? (
            <div>
              {editing ? (
                <ProductForm
                  product={editing === "new" ? undefined : editing}
                  onClose={() => setEditing(null)}
                  onSaved={(name) => {
                    setEditing(null);
                    setNotice(`${name} was saved.`);
                  }}
                />
              ) : null}

              <div className="mt-6 overflow-hidden border border-line bg-surface">
                <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-4 sm:px-5">
                  <div>
                    <h2 className="font-extrabold text-ink">Catalog</h2>
                    <p className="mt-1 text-xs text-muted">{activeProducts.length} active products</p>
                  </div>
                </div>

                {activeProducts.length ? (
                  <div className="divide-y divide-line">
                    {activeProducts.map((product) => (
                      <article key={product.id} className="grid grid-cols-[76px_1fr] gap-4 p-4 sm:grid-cols-[76px_1fr_auto] sm:items-center sm:px-5">
                        <div className="relative aspect-square overflow-hidden bg-paper-strong">
                          <ProductImage src={product.images[0] ?? "/images/category-studs.png"} alt="" sizes="76px" className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-extrabold text-ink">{product.name}</h3>
                          <p className="mt-1 text-xs text-muted">{categoryLabels[product.category]} | {formatPrice(product.price)}</p>
                          <p className={`mt-2 text-xs font-bold ${product.stock <= 10 ? "text-warning" : "text-success"}`}>{product.stock} in stock</p>
                        </div>
                        <div className="col-span-2 flex gap-2 sm:col-span-1">
                          <button type="button" onClick={() => setEditing(product)} className="button-press flex min-h-11 flex-1 items-center justify-center gap-2 border border-line px-3 text-xs font-bold text-ink hover:border-ink sm:flex-none">
                            <PencilSimple size={17} weight="bold" /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(product)}
                            disabled={busyId === product.id}
                            className={`button-press flex min-h-11 flex-1 items-center justify-center gap-2 border px-3 text-xs font-bold sm:flex-none ${
                              confirmDelete === product.id ? "border-danger bg-danger text-[#f7f7f4]" : "border-line text-danger hover:border-danger"
                            }`}
                          >
                            <Trash size={17} weight="bold" />
                            {busyId === product.id ? "Archiving" : confirmDelete === product.id ? "Confirm" : "Archive"}
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Package size={40} weight="duotone" className="mx-auto text-muted" />
                    <h3 className="mt-4 font-extrabold text-ink">No active products.</h3>
                    <p className="mt-2 text-sm text-muted">Add the first product to populate the storefront.</p>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {tab === "reviews" ? (
            <ReviewsAdmin reviews={store.reviews} busyId={busyId} onModerate={handleModeration} />
          ) : null}

          {tab === "settings" ? (
            <SetupPanel isLive={store.isLive} onReset={() => { store.resetDemoData(); setNotice("Demo data was restored."); }} />
          ) : null}
        </div>
      </main>
    </div>
  );
}

function Overview({
  products,
  pending,
  lowStock,
  onOpenProducts,
  onOpenReviews,
}: {
  products: number;
  pending: number;
  lowStock: number;
  onOpenProducts: () => void;
  onOpenReviews: () => void;
}) {
  const metrics = [
    { label: "Active products", value: products, action: onOpenProducts },
    { label: "Reviews to moderate", value: pending, action: onOpenReviews },
    { label: "Low-stock products", value: lowStock, action: onOpenProducts },
  ];

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
        <section className="court-texture bg-cobalt p-6 text-[#f2f4f5] sm:p-8">
          <h2 className="display-type max-w-[12ch] text-5xl leading-[0.92]">CATALOG CONTROL, ANYWHERE.</h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-[#dbe5f2]">Add products and capture photos directly from a phone without touching the codebase.</p>
          <button type="button" onClick={onOpenProducts} className="button-press mt-7 inline-flex min-h-11 items-center gap-2 bg-action px-4 text-sm font-extrabold text-[#f7f7f4] hover:bg-action-hover">
            <Plus size={18} weight="bold" /> Add product
          </button>
        </section>
        <section className="border border-line bg-surface p-6 sm:p-8">
          <h2 className="text-base font-extrabold text-ink">Today&apos;s attention</h2>
          <div className="mt-5 grid gap-5">
            {metrics.map((metric) => (
              <button key={metric.label} type="button" onClick={metric.action} className="group flex items-end justify-between border-b border-line pb-4 text-left last:border-b-0 last:pb-0">
                <span className="text-sm font-semibold text-muted group-hover:text-ink">{metric.label}</span>
                <span className="display-type text-4xl text-ink">{metric.value}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
      <section className="mt-6 border border-line bg-surface p-6 sm:p-8">
        <h2 className="text-base font-extrabold text-ink">Launch checklist</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {["Connect Supabase environment variables", "Run the SQL migration", "Promote one user to admin", "Replace demo products and policies"].map((item) => (
            <div key={item} className="flex gap-3 text-sm text-ink-soft">
              <CheckCircle size={20} weight="bold" className="shrink-0 text-cobalt" /> {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

type PreviewFile = { file: File; url: string };

function ProductForm({ product, onClose, onSaved }: { product?: Product; onClose: () => void; onSaved: (name: string) => void }) {
  const { saveProduct } = useStore();
  const [draft, setDraft] = useState<ProductDraft>(() => ({
    id: product?.id,
    createdAt: product?.createdAt,
    slug: product?.slug ?? "",
    name: product?.name ?? "",
    category: product?.category ?? "studs",
    description: product?.description ?? "",
    price: product?.price ?? 0,
    compareAtPrice: product?.compareAtPrice,
    images: product?.images ?? [],
    sizes: product?.sizes ?? [],
    stock: product?.stock ?? 0,
    featured: product?.featured ?? false,
    badge: product?.badge,
    active: product?.active ?? true,
  }));
  const [sizeInput, setSizeInput] = useState(product?.sizes.join(", ") ?? "");
  const [previews, setPreviews] = useState<PreviewFile[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => () => previews.forEach((preview) => URL.revokeObjectURL(preview.url)), [previews]);

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;
    const images = Array.from(fileList).filter((file) => file.type.startsWith("image/"));
    setPreviews((current) => [
      ...current,
      ...images.map((file) => ({ file, url: URL.createObjectURL(file) })),
    ]);
  }

  function removePreview(index: number) {
    setPreviews((current) => {
      URL.revokeObjectURL(current[index].url);
      return current.filter((_, itemIndex) => itemIndex !== index);
    });
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.images.length && !previews.length) {
      setError("Add at least one product image.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const saved = await saveProduct(
        {
          ...draft,
          slug: draft.slug || slugify(draft.name),
          sizes: sizeInput.split(",").map((size) => size.trim()).filter(Boolean),
        },
        previews.map((preview) => preview.file),
      );
      onSaved(saved.name);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The product could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="border-t-4 border-cobalt bg-surface p-5 shadow-court sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-ink">{product ? "Edit product" : "Add product"}</h2>
          <p className="mt-1 text-xs text-muted">All fields marked by the browser are required.</p>
        </div>
        <button type="button" onClick={onClose} className="flex size-11 items-center justify-center border border-line" aria-label="Close product form">
          <X size={19} weight="bold" />
        </button>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <AdminField label="Product name"><input required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} className="field-input" maxLength={120} /></AdminField>
        <AdminField label="URL slug"><input value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: slugify(event.target.value) })} className="field-input" placeholder="Generated from product name" maxLength={140} /></AdminField>
        <AdminField label="Category">
          <select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value as Category })} className="field-input">
            {(Object.keys(categoryLabels) as Category[]).map((category) => <option key={category} value={category}>{categoryLabels[category]}</option>)}
          </select>
        </AdminField>
        <AdminField label="Sizes" helper="Separate options with commas."><input required value={sizeInput} onChange={(event) => setSizeInput(event.target.value)} className="field-input" placeholder="6, 7, 8, 9" /></AdminField>
        <AdminField label="Price"><input required type="number" min="0" step="0.01" value={draft.price} onChange={(event) => setDraft({ ...draft, price: Number(event.target.value) })} className="field-input" /></AdminField>
        <AdminField label="Compare-at price" helper="Optional."><input type="number" min="0" step="0.01" value={draft.compareAtPrice ?? ""} onChange={(event) => setDraft({ ...draft, compareAtPrice: event.target.value ? Number(event.target.value) : undefined })} className="field-input" /></AdminField>
        <AdminField label="Stock quantity"><input required type="number" min="0" step="1" value={draft.stock} onChange={(event) => setDraft({ ...draft, stock: Number(event.target.value) })} className="field-input" /></AdminField>
        <AdminField label="Badge" helper="Optional short label shown near product copy."><input value={draft.badge ?? ""} onChange={(event) => setDraft({ ...draft, badge: event.target.value || undefined })} className="field-input" maxLength={40} /></AdminField>
        <div className="sm:col-span-2"><AdminField label="Description"><textarea required value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} className="field-input min-h-28 resize-y" minLength={20} maxLength={1000} /></AdminField></div>

        <fieldset className="sm:col-span-2">
          <legend className="text-sm font-extrabold text-ink">Product images</legend>
          <p className="mt-1 text-xs text-muted">Select several images from the library or take new photos. JPG, PNG, and WebP work best.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="button-press flex min-h-28 cursor-pointer flex-col items-center justify-center gap-3 border border-dashed border-cobalt bg-cobalt/6 p-4 text-center text-sm font-extrabold text-cobalt hover:bg-cobalt/10">
              <Images size={28} weight="duotone" /> Choose from library
              <input type="file" accept="image/*" multiple className="sr-only" onChange={(event) => { addFiles(event.target.files); event.target.value = ""; }} />
            </label>
            <label className="button-press flex min-h-28 cursor-pointer flex-col items-center justify-center gap-3 border border-dashed border-action bg-action/6 p-4 text-center text-sm font-extrabold text-action hover:bg-action/10">
              <Camera size={28} weight="duotone" /> Take product photos
              <input type="file" accept="image/*" capture="environment" multiple className="sr-only" onChange={(event) => { addFiles(event.target.files); event.target.value = ""; }} />
            </label>
          </div>

          {(draft.images.length || previews.length) ? (
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
              {draft.images.map((image, index) => (
                <div key={`${image}-${index}`} className="relative aspect-square overflow-hidden bg-paper-strong">
                  <ProductImage src={image} alt={`Existing product image ${index + 1}`} sizes="140px" className="h-full w-full object-cover" />
                  <button type="button" onClick={() => setDraft({ ...draft, images: draft.images.filter((_, itemIndex) => itemIndex !== index) })} className="absolute right-1 top-1 flex size-9 items-center justify-center bg-[#12161c] text-[#f2f4f5]" aria-label="Remove existing image"><X size={16} weight="bold" /></button>
                </div>
              ))}
              {previews.map((preview, index) => (
                <div key={preview.url} className="relative aspect-square overflow-hidden bg-paper-strong">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview.url} alt={`New image ${index + 1}`} className="h-full w-full object-cover" />
                  <button type="button" onClick={() => removePreview(index)} className="absolute right-1 top-1 flex size-9 items-center justify-center bg-[#12161c] text-[#f2f4f5]" aria-label="Remove new image"><X size={16} weight="bold" /></button>
                </div>
              ))}
            </div>
          ) : null}
        </fieldset>

        <div className="flex flex-wrap gap-5 sm:col-span-2">
          <label className="flex min-h-11 items-center gap-3 text-sm font-bold text-ink"><input type="checkbox" checked={draft.featured} onChange={(event) => setDraft({ ...draft, featured: event.target.checked })} className="size-5 accent-cobalt" /> Feature on homepage</label>
          <label className="flex min-h-11 items-center gap-3 text-sm font-bold text-ink"><input type="checkbox" checked={draft.active} onChange={(event) => setDraft({ ...draft, active: event.target.checked })} className="size-5 accent-cobalt" /> Product is active</label>
        </div>
      </div>

      {error ? <p role="alert" className="mt-5 border border-danger bg-danger/8 p-4 text-sm font-semibold text-danger">{error}</p> : null}
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" onClick={onClose} className="button-press min-h-12 border border-line px-5 text-sm font-extrabold text-ink hover:border-ink">Cancel</button>
        <button type="submit" disabled={saving} className="button-press flex min-h-12 items-center justify-center gap-2 bg-action px-5 text-sm font-extrabold text-[#f7f7f4] hover:bg-action-hover">
          <UploadSimple size={19} weight="bold" /> {saving ? "Saving and uploading..." : "Save product"}
        </button>
      </div>
    </form>
  );
}

function AdminField({ label, helper, children }: { label: string; helper?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-extrabold text-ink">{label}</span>
      {children}
      {helper ? <span className="text-xs text-muted">{helper}</span> : null}
    </label>
  );
}

function ReviewsAdmin({
  reviews,
  busyId,
  onModerate,
}: {
  reviews: ReturnType<typeof useStore>["reviews"];
  busyId: string | null;
  onModerate: (id: string, status: ReviewStatus) => void;
}) {
  const [filter, setFilter] = useState<ReviewStatus | "all">("pending");
  const visible = useMemo(() => reviews.filter((review) => filter === "all" || review.status === filter), [filter, reviews]);

  return (
    <section>
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-5">
        {(["pending", "approved", "rejected", "all"] as const).map((status) => (
          <button key={status} type="button" onClick={() => setFilter(status)} className={`button-press min-h-11 shrink-0 border px-4 text-sm font-bold capitalize ${filter === status ? "border-ink bg-ink text-paper" : "border-line bg-surface text-ink hover:border-ink"}`}>{status}</button>
        ))}
      </div>
      {visible.length ? (
        <div className="grid gap-4">
          {visible.map((review) => (
            <article key={review.id} className="border border-line bg-surface p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex gap-1 text-action" aria-label={`${review.rating} stars`}>{[1, 2, 3, 4, 5].map((value) => <Star key={value} size={16} weight={value <= review.rating ? "fill" : "regular"} />)}</div>
                  <h2 className="mt-3 text-lg font-extrabold text-ink">{review.title}</h2>
                  <p className="mt-1 text-xs text-muted">{review.author} | {review.productName}</p>
                </div>
                <span className={`px-3 py-1.5 text-xs font-extrabold capitalize ${review.status === "approved" ? "bg-success/12 text-success" : review.status === "rejected" ? "bg-danger/12 text-danger" : "bg-warning/12 text-warning"}`}>{review.status}</span>
              </div>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-ink-soft">{review.body}</p>
              {review.email ? <p className="mt-3 text-xs text-muted">Contact: {review.email}</p> : null}
              <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
                <button type="button" onClick={() => onModerate(review.id, "approved")} disabled={busyId === review.id || review.status === "approved"} className="button-press flex min-h-11 items-center gap-2 bg-success px-4 text-xs font-extrabold text-[#f7f7f4]"><Check size={17} weight="bold" /> Approve</button>
                <button type="button" onClick={() => onModerate(review.id, "rejected")} disabled={busyId === review.id || review.status === "rejected"} className="button-press flex min-h-11 items-center gap-2 border border-danger px-4 text-xs font-extrabold text-danger hover:bg-danger hover:text-[#f7f7f4]"><XCircle size={17} weight="bold" /> Reject</button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-line bg-surface p-8 text-center"><CheckCircle size={40} weight="duotone" className="mx-auto text-success" /><h2 className="mt-4 font-extrabold text-ink">Queue clear.</h2><p className="mt-2 text-sm text-muted">No reviews match this filter.</p></div>
      )}
    </section>
  );
}

function SetupPanel({ isLive, onReset }: { isLive: boolean; onReset: () => void }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <section className="border border-line bg-surface p-6">
        <h2 className="text-lg font-extrabold text-ink">Data mode</h2>
        <p className="mt-3 text-sm leading-6 text-ink-soft">{isLive ? "Supabase is configured. Product media uploads to the product-media bucket and row policies control admin writes." : "The app is using local browser storage. Everything works as a demo, including product editing and moderation, but data stays on this device."}</p>
        {!isLive ? <button type="button" onClick={onReset} className="button-press mt-6 min-h-11 border border-danger px-4 text-sm font-extrabold text-danger hover:bg-danger hover:text-[#f7f7f4]">Restore demo data</button> : null}
      </section>
      <section className="border border-line bg-surface p-6">
        <h2 className="text-lg font-extrabold text-ink">Environment variables</h2>
        <div className="mt-4 grid gap-3 text-xs text-ink-soft">
          <code className="overflow-x-auto bg-paper-strong p-3">NEXT_PUBLIC_SUPABASE_URL</code>
          <code className="overflow-x-auto bg-paper-strong p-3">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>
        </div>
        <p className="mt-4 text-xs leading-5 text-muted">Never expose the Supabase service role key in a public environment variable.</p>
      </section>
    </div>
  );
}
