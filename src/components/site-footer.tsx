import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

export function SiteFooter() {
  return (
    <footer className="bg-[#12161c] text-[#f0f2f2]">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8 lg:py-18">
        <div>
          <Link href="/" className="display-type text-4xl text-[#f0f2f2]">
            DINO'S COLLECTION
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-[#aeb7c2]">
            Football gear built around the moments that decide a match. Demo catalog content should be replaced before launch.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-bold text-[#f0f2f2]">Shop</h2>
          <div className="mt-4 grid gap-3 text-sm text-[#aeb7c2]">
            <Link href="/shop?category=studs" className="hover:text-white">Football Studs</Link>
            <Link href="/shop?category=grippers" className="hover:text-white">Grippers</Link>
            <Link href="/shop?category=socks" className="hover:text-white">Socks</Link>
            <Link href="/shop?category=footballs" className="hover:text-white">Footballs</Link>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-bold text-[#f0f2f2]">Store</h2>
          <div className="mt-4 grid gap-3 text-sm text-[#aeb7c2]">
            <Link href="/reviews" className="hover:text-white">Reviews</Link>
            <Link href="/cart" className="hover:text-white">Shopping bag</Link>
            <Link href="/admin" className="inline-flex items-center gap-1 hover:text-white">
              Admin panel <ArrowUpRight size={15} weight="bold" />
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-[#8d98a5]">
        <p>Demo storefront. Add final policies, contact details, currency, and payment setup before production.</p>
      </div>
    </footer>
  );
}
