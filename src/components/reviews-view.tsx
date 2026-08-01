"use client";

import { FormEvent, useState } from "react";
import { CheckCircle, Star } from "@phosphor-icons/react";
import { useStore } from "./app-provider";
import { initials } from "@/lib/utils";

export function ReviewsView() {
  const { products, approvedReviews, submitReview } = useStore();
  const [productId, setProductId] = useState("");
  const [rating, setRating] = useState(5);
  const [author, setAuthor] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      const product = products.find((item) => item.id === productId);
      await submitReview({
        productId: product?.id,
        productName: product?.name ?? "HALFSPACE store",
        author,
        email,
        rating,
        title,
        body,
      });
      setSuccess(true);
      setAuthor("");
      setEmail("");
      setTitle("");
      setBody("");
      setProductId("");
      setRating(5);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Your review could not be submitted.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <section className="court-texture bg-cobalt text-[#f2f4f5]">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8 lg:py-20">
          <div>
            <h1 className="display-type max-w-[11ch] text-6xl leading-[0.9] text-[#f2f4f5] sm:text-7xl">
              WHAT PLAYERS NOTICED.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-[#dbe5f2]">
              Approved reviews appear publicly. Every new submission goes to the admin queue first.
            </p>
            <div className="mt-8 grid max-w-md grid-cols-2 gap-5 border-t border-[#f2f4f5]/28 pt-6">
              <div>
                <p className="display-type text-4xl text-[#f2f4f5]">{approvedReviews.length}</p>
                <p className="mt-1 text-xs font-bold text-[#c6d5e8]">Approved reviews</p>
              </div>
              <div>
                <p className="display-type text-4xl text-[#f2f4f5]">
                  {approvedReviews.length
                    ? (approvedReviews.reduce((sum, review) => sum + review.rating, 0) / approvedReviews.length).toFixed(1)
                    : "0.0"}
                </p>
                <p className="mt-1 text-xs font-bold text-[#c6d5e8]">Average rating</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-surface p-5 text-ink shadow-court sm:p-7">
            <h2 className="display-type text-4xl text-ink">LEAVE A REVIEW.</h2>
            <div className="mt-6 grid gap-5">
              <label className="grid gap-2">
                <span className="text-sm font-extrabold text-ink">Product</span>
                <select value={productId} onChange={(event) => setProductId(event.target.value)} className="field-input">
                  <option value="">General store review</option>
                  {products.filter((product) => product.active).map((product) => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                  ))}
                </select>
              </label>

              <fieldset>
                <legend className="text-sm font-extrabold text-ink">Rating</legend>
                <div className="mt-2 flex gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      className="flex size-11 items-center justify-center text-action"
                      aria-label={`${value} star${value === 1 ? "" : "s"}`}
                      aria-pressed={rating === value}
                    >
                      <Star size={25} weight={value <= rating ? "fill" : "regular"} />
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-extrabold text-ink">Your name</span>
                  <input required value={author} onChange={(event) => setAuthor(event.target.value)} className="field-input" maxLength={80} autoComplete="name" />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-extrabold text-ink">Email <span className="font-medium text-muted">(not public)</span></span>
                  <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="field-input" maxLength={254} autoComplete="email" />
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-sm font-extrabold text-ink">Review title</span>
                <input required value={title} onChange={(event) => setTitle(event.target.value)} className="field-input" maxLength={100} />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-extrabold text-ink">Your review</span>
                <textarea required value={body} onChange={(event) => setBody(event.target.value)} className="field-input min-h-28 resize-y" minLength={20} maxLength={1000} />
                <span className="text-xs text-muted">20 to 1,000 characters. Reviews are checked before publishing.</span>
              </label>

              {success ? (
                <p role="status" className="flex gap-3 border border-success bg-success/8 p-4 text-sm font-semibold text-success">
                  <CheckCircle size={20} weight="fill" className="shrink-0" /> Review received and sent for approval.
                </p>
              ) : null}
              {error ? <p role="alert" className="border border-danger bg-danger/8 p-4 text-sm font-semibold text-danger">{error}</p> : null}

              <button type="submit" disabled={submitting} className="button-press min-h-13 bg-action px-6 font-extrabold text-[#f7f7f4] hover:bg-action-hover">
                {submitting ? "Submitting..." : "Submit for approval"}
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-18 sm:px-6 lg:px-8 lg:py-24">
        <h2 className="display-type text-5xl text-ink sm:text-6xl">APPROVED BY ADMIN.</h2>
        {approvedReviews.length ? (
          <div className="mt-9 columns-1 gap-5 md:columns-2">
            {approvedReviews.map((review) => (
              <article key={review.id} className="mb-5 break-inside-avoid border border-line bg-surface p-5 sm:p-6">
                <div className="flex gap-1 text-action" aria-label={`${review.rating} out of 5 stars`}>
                  {[1, 2, 3, 4, 5].map((value) => <Star key={value} size={17} weight={value <= review.rating ? "fill" : "regular"} />)}
                </div>
                <h3 className="mt-5 text-lg font-extrabold text-ink">{review.title}</h3>
                <p className="mt-3 text-sm leading-6 text-ink-soft">“{review.body}”</p>
                <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                  <span className="flex size-10 items-center justify-center bg-cobalt text-xs font-extrabold text-[#f2f4f5]">{initials(review.author)}</span>
                  <div>
                    <p className="text-sm font-extrabold text-ink">{review.author}</p>
                    <p className="text-xs text-muted">{review.productName}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 border border-dashed border-line p-8">
            <h3 className="text-lg font-extrabold text-ink">No approved reviews yet.</h3>
            <p className="mt-2 text-sm text-muted">Submit the first review, then approve it in the admin panel.</p>
          </div>
        )}
      </section>
    </div>
  );
}
