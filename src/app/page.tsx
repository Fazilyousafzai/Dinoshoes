import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedProducts } from "@/components/home/featured-products";
import { Hero } from "@/components/home/hero";
import { KitBuilder } from "@/components/home/kit-builder";
import { ReviewSpotlight } from "@/components/home/review-spotlight";
import { Reveal } from "@/components/reveal";
import { StoreShell } from "@/components/store-shell";

export default function HomePage() {
  return (
    <StoreShell>
      <Hero />
      <Reveal>
        <CategoryGrid />
      </Reveal>
      <FeaturedProducts />
      <KitBuilder />
      <Reveal>
        <ReviewSpotlight />
      </Reveal>
    </StoreShell>
  );
}
