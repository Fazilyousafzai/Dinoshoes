import type { Metadata } from "next";
import { ProductDetail } from "@/components/product-detail";
import { StoreShell } from "@/components/store-shell";
import { demoProducts } from "@/lib/demo-data";

export function generateStaticParams() {
  return demoProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = demoProducts.find((item) => item.slug === slug);
  return {
    title: product?.name ?? "Product",
    description: product?.description ?? "View football gear from DINO'S COLLECTION.",
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <StoreShell>
      <ProductDetail slug={slug} />
    </StoreShell>
  );
}
