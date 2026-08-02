import { DynamicCategories } from "@/components/home/dynamic-categories";
import { FeaturedProducts } from "@/components/home/featured-products";
import { Hero } from "@/components/home/hero";

import { ReviewSpotlight } from "@/components/home/review-spotlight";
import { Reveal } from "@/components/reveal";
import { StoreShell } from "@/components/store-shell";

export default function HomePage() {
  return (
    <StoreShell>
      <Hero />
      <Reveal>
        <DynamicCategories />
      </Reveal>
      <FeaturedProducts />

      <Reveal>
        <ReviewSpotlight />
      </Reveal>
    </StoreShell>
  );
}
