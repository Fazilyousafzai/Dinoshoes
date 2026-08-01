import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";
import { StoreShell } from "@/components/store-shell";

export const metadata: Metadata = { title: "Shopping bag" };

export default function CartPage() {
  return (
    <StoreShell>
      <CartView />
    </StoreShell>
  );
}
