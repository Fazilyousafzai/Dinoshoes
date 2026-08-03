import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const params = await searchParams;
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  );

  return (
    <main className="grid min-h-[100dvh] bg-paper lg:grid-cols-[1.05fr_0.95fr]">
      <section className="court-texture flex min-h-[42dvh] flex-col justify-between bg-cobalt p-6 text-[#f2f4f5] sm:p-10 lg:min-h-[100dvh] lg:p-14">
        <Link href="/" className="display-type text-3xl text-[#f2f4f5]">DINO FOOTBALL SHOES</Link>
        <div className="max-w-xl py-12">
          <h1 className="display-type max-w-[10ch] text-6xl leading-[0.88] text-[#f2f4f5] sm:text-7xl lg:text-8xl">RUN THE STORE FROM THE SIDELINE.</h1>
          <p className="mt-5 max-w-md text-base leading-7 text-[#dbe5f2]">Secure catalog, stock, media, and review operations in one mobile-ready panel.</p>
        </div>
      </section>
      <section className="flex items-center justify-center px-4 py-10 sm:px-8 lg:px-14">
        <div className="w-full max-w-md">
          <LoginForm configured={configured} next={params.next ?? "/admin"} />
          <Link href="/" className="mt-6 inline-flex min-h-11 items-center text-sm font-bold text-ink hover:text-cobalt">Return to storefront</Link>
        </div>
      </section>
    </main>
  );
}
