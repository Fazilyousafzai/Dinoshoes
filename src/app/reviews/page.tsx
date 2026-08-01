import type { Metadata } from "next";
import { ReviewsView } from "@/components/reviews-view";
import { StoreShell } from "@/components/store-shell";

export const metadata: Metadata = {
  title: "Player reviews",
  description: "Read approved football gear reviews or submit your own for moderation.",
};

export default function ReviewsPage() {
  return (
    <StoreShell>
      <ReviewsView />
    </StoreShell>
  );
}
