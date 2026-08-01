"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, CheckCircle, LockKey, PaperPlaneTilt } from "@phosphor-icons/react";
import { useStore } from "./app-provider";
import { formatPrice } from "@/lib/utils";

type FormValues = {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes: string;
};

const initial: FormValues = {
  customerName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  notes: "",
};

export function CheckoutForm() {
  const { cart, cartTotal, hydrated, placeOrder, isLive } = useStore();
  const [values, setValues] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      // --- WHATSAPP CHECKOUT LOGIC ---
      // Commented out online pending order:
      // const result = await placeOrder(values);
      // setReference(result);

      let message = `*New Order Request* 🛒\n\n`;
      message += `*Customer Details:*\n`;
      message += `Name: ${values.customerName}\n`;
      message += `Phone: ${values.phone}\n`;
      message += `Address: ${values.address}, ${values.city} ${values.postalCode}\n`;
      if (values.notes) message += `Notes: ${values.notes}\n`;

      message += `\n*Order Details:*\n`;
      cart.forEach((line) => {
        message += `- ${line.quantity}x ${line.product.name} (Size: ${line.size})\n`;
      });
      message += `\n*Total:* ${formatPrice(cartTotal)}`;

      const whatsappNumber = "923319441845"; // Client's WhatsApp number (country code without +)
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

      // Redirect the user to WhatsApp
      window.open(whatsappUrl, "_blank");
      
      // Show success screen on our site as a fallback
      setReference("WHATSAPP-" + Date.now().toString().slice(-6));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The order could not be placed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!hydrated) return <div className="min-h-[70dvh] animate-pulse bg-paper-strong" />;

  if (reference) {
    return (
      <div className="mx-auto flex min-h-[70dvh] max-w-2xl flex-col items-center justify-center px-4 text-center">
        <CheckCircle size={54} weight="fill" className="text-success" />
        <h1 className="display-type mt-5 text-6xl text-ink">ORDER SENT TO WHATSAPP.</h1>
        <p className="mt-4 max-w-md text-base leading-7 text-ink-soft">
          We have redirected you to WhatsApp to complete your order. If the chat didn't open automatically, please click below.
        </p>
        <button onClick={() => window.open(`https://wa.me/923319441845`, "_blank")} className="button-press mt-7 min-h-12 bg-action px-6 py-3 font-extrabold text-[#f7f7f4] hover:bg-action-hover">
          Open WhatsApp
        </button>
        <Link href="/shop" className="mt-4 text-sm font-bold text-ink underline hover:text-cobalt">
          Return to shop
        </Link>
      </div>
    );
  }

  if (!cart.length) {
    return (
      <div className="mx-auto flex min-h-[70dvh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <h1 className="display-type text-6xl text-ink">NOTHING TO CHECK OUT.</h1>
        <p className="mt-4 text-ink-soft">Add at least one product before entering delivery details.</p>
        <Link href="/shop" className="button-press mt-7 min-h-12 bg-action px-6 py-3 font-extrabold text-[#f7f7f4] hover:bg-action-hover">
          Shop gear
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <Link href="/cart" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-ink hover:text-cobalt">
        <ArrowLeft size={18} weight="bold" /> Back to bag
      </Link>
      <div className="mt-5 grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-16">
        <div>
          <h1 className="display-type text-6xl text-ink sm:text-7xl">DELIVERY DETAILS.</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-ink-soft">
            We collect only the information needed to prepare this pending order.
          </p>

          <form onSubmit={handleSubmit} className="mt-9 grid gap-5 sm:grid-cols-2">
            <Field label="Full name" name="customerName" value={values.customerName} autoComplete="name" onChange={(value) => setValues({ ...values, customerName: value })} />
            <Field label="Email" name="email" type="email" value={values.email} autoComplete="email" onChange={(value) => setValues({ ...values, email: value })} />
            <Field label="Phone" name="phone" type="tel" value={values.phone} autoComplete="tel" onChange={(value) => setValues({ ...values, phone: value })} />
            <Field label="City" name="city" value={values.city} autoComplete="address-level2" onChange={(value) => setValues({ ...values, city: value })} />
            <div className="sm:col-span-2">
              <Field label="Street address" name="address" value={values.address} autoComplete="street-address" onChange={(value) => setValues({ ...values, address: value })} />
            </div>
            <Field label="Postal code" name="postalCode" value={values.postalCode} autoComplete="postal-code" onChange={(value) => setValues({ ...values, postalCode: value })} />
            <label className="grid gap-2 sm:col-span-2">
              <span className="text-sm font-extrabold text-ink">Delivery notes <span className="font-medium text-muted">(optional)</span></span>
              <textarea
                name="notes"
                value={values.notes}
                onChange={(event) => setValues({ ...values, notes: event.target.value })}
                className="field-input min-h-28 resize-y"
                maxLength={500}
              />
            </label>

            {error ? (
              <p role="alert" className="border border-danger bg-danger/8 p-4 text-sm font-semibold text-danger sm:col-span-2">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="button-press flex min-h-13 items-center justify-center gap-3 bg-[#25D366] px-6 font-extrabold text-white hover:bg-[#128C7E] sm:col-span-2"
            >
              <PaperPlaneTilt size={20} weight="bold" />
              {submitting ? "Redirecting..." : "Order via WhatsApp"}
            </button>
          </form>
        </div>

        <aside className="self-start border-t-4 border-cobalt bg-surface p-6 shadow-court lg:sticky lg:top-24">
          <h2 className="display-type text-4xl text-ink">SUMMARY.</h2>
          <div className="mt-5 grid gap-4">
            {cart.map((line) => (
              <div key={line.key} className="flex justify-between gap-5 text-sm">
                <div>
                  <p className="font-bold text-ink">{line.quantity} x {line.product.name}</p>
                  <p className="mt-1 text-xs text-muted">Size {line.size}</p>
                </div>
                <p className="shrink-0 font-bold text-ink">{formatPrice(line.product.price * line.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
            <span className="font-extrabold text-ink">Subtotal</span>
            <span className="text-lg font-extrabold text-ink">{formatPrice(cartTotal)}</span>
          </div>
          <div className="mt-6 flex gap-3 border-t border-line pt-5">
            <LockKey size={20} weight="bold" className="shrink-0 text-[#25D366]" />
            <p className="text-xs leading-5 text-muted">
              Checkout redirects to WhatsApp to finalize your order directly with our team.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  value,
  autoComplete,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  autoComplete: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-extrabold text-ink">{label}</span>
      <input
        required
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className="field-input"
        maxLength={name === "email" ? 254 : 140}
      />
    </label>
  );
}
