"use client";

import Link from "next/link";
import { ArrowRight, Star } from "@phosphor-icons/react";
import { useStore } from "@/components/app-provider";
import { initials } from "@/lib/utils";

export function ReviewSpotlight() {
  const { approvedReviews } = useStore();
  const [lead, supporting] = approvedReviews;

  if (!lead) return null;

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-18 sm:px-6 lg:px-8 lg:py-24">
      <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:gap-16">
        <div>
          <div className="flex gap-1 text-action" aria-label={`${lead.rating} out of 5 stars`}>
            {Array.from({ length: 5 }, (_, index) => (
              <Star key={index} size={19} weight={index < lead.rating ? "fill" : "regular"} />
            ))}
          </div>
          <blockquote className="display-type mt-6 max-w-[18ch] text-5xl leading-[0.98] text-ink sm:text-6xl">
            “{lead.body}”
          </blockquote>
          <div className="mt-7 flex items-center gap-4">
            <span className="flex size-12 items-center justify-center bg-cobalt font-extrabold text-[#f2f4f5]">
              {initials(lead.author)}
            </span>
            <div>
              <p className="font-extrabold text-ink">{lead.author}</p>
              <p className="text-sm text-muted">Reviewed {lead.productName}</p>
            </div>
          </div>
        </div>

        <div className="self-end border-t border-line pt-7">
          {supporting ? (
            <>
              <h3 className="text-lg font-extrabold text-ink">{supporting.title}</h3>
              <p className="mt-3 text-sm leading-6 text-ink-soft">“{supporting.body}”</p>
              <p className="mt-4 text-sm font-bold text-ink">{supporting.author}</p>
            </>
          ) : null}
          <Link
            href="/reviews"
            className="button-press mt-7 inline-flex min-h-12 items-center gap-3 bg-ink px-5 text-sm font-extrabold text-paper hover:bg-cobalt"
          >
            Read reviews <ArrowRight size={18} weight="bold" />
          </Link>
        </div>
      </div>
    </section>
  );
}
