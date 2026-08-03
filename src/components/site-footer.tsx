import Link from "next/link";
import { FacebookLogo, TiktokLogo, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";

export function SiteFooter() {
  return (
    <footer className="bg-[#12161c] text-[#f0f2f2]">
      <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="max-w-md">
          <Link href="/" className="display-type text-4xl text-[#f2f4f5] sm:text-5xl lg:text-7xl">
            DINO FOOTBALL SHOES
          </Link>
          <p className="mt-1 text-sm leading-6 text-[#aeb7c2]">
            Football gear built around the moments that decide a match.
          </p>
          <div className="mt-6">
            <h3 className="text-sm font-bold text-[#f0f2f2]">Feel free to contact us</h3>
            <div className="mt-3 flex items-center gap-4 text-[#aeb7c2]">
              <a href="https://www.facebook.com/sohail.dino" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <FacebookLogo size={28} weight="fill" />
              </a>
              <a href="https://www.tiktok.com/@sohaildino7?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <span className="sr-only">TikTok</span>
                <TiktokLogo size={28} weight="fill" />
              </a>
              <a href="https://wa.me/923319441845" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <span className="sr-only">WhatsApp</span>
                <WhatsappLogo size={28} weight="fill" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-[#8d98a5]">
        <p>&copy; {new Date().getFullYear()} DINO FOOTBALL SHOES. All rights reserved.</p>
      </div>
    </footer>
  );
}
