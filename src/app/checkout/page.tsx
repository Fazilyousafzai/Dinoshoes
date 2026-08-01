import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";
import { StoreShell } from "@/components/store-shell";

export const metadata: Metadata = { title: "Checkout details" };

export default function CheckoutPage() {
  return (
    <StoreShell>
      <CheckoutForm />
    </StoreShell>
  );
}
