import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopBrowser } from "@/components/shop-browser";
import { StoreShell } from "@/components/store-shell";

export const metadata: Metadata = {
  title: "Shop football gear",
  description: "Browse football studs, grippers, socks, and footballs.",
};

export default function ShopPage() {
  return (
    <StoreShell>
      <Suspense fallback={<div className="min-h-[70dvh] animate-pulse bg-paper-strong" />}>
        <ShopBrowser />
      </Suspense>
    </StoreShell>
  );
}
