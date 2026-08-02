"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  List,
  MagnifyingGlass,
  ShoppingBagOpen,
  UserCircle,
  X,
} from "@phosphor-icons/react";
import { useState } from "react";
import { useStore } from "./app-provider";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/reviews", label: "Reviews" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { cartCount } = useStore();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#12161c] text-[#f3f4f2]">
      <div className="mx-auto flex h-[68px] max-w-[1400px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          className="button-press flex size-11 items-center justify-center border border-white/18 lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} weight="bold" /> : <List size={24} weight="bold" />}
        </button>

        <Link
          href="/"
          className="display-type mr-auto text-[1.7rem] leading-none tracking-[-0.02em] text-[#f3f4f2]"
          aria-label="HALFSPACE home"
        >
          HALFSPACE
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {links.map((link) => {
            const active = pathname === link.href.split("?")[0];
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-colors hover:text-white ${
                  active ? "text-white" : "text-[#aeb7c2]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/shop?focus=search"
          className="button-press hidden size-11 items-center justify-center border border-white/18 hover:bg-white/8 min-[390px]:flex"
          aria-label="Search products"
        >
          <MagnifyingGlass size={21} weight="bold" />
        </Link>
        <Link
          href="/admin"
          className="button-press flex size-11 items-center justify-center border border-white/18 hover:bg-white/8"
          aria-label="Open admin panel"
        >
          <UserCircle size={22} weight="bold" />
        </Link>
        <Link
          href="/cart"
          className="button-press relative flex size-11 items-center justify-center bg-action text-[#f7f7f4] hover:bg-action-hover"
          aria-label={`Shopping bag with ${cartCount} items`}
        >
          <ShoppingBagOpen size={22} weight="bold" />
          {cartCount > 0 ? (
            <span className="absolute -right-1.5 -top-1.5 flex min-h-5 min-w-5 items-center justify-center bg-[#f3f4f2] px-1 text-[10px] font-extrabold text-[#12161c]">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          ) : null}
        </Link>
      </div>

      {open ? (
        <nav
          className="border-t border-white/10 bg-[#12161c] px-4 pb-5 pt-3 lg:hidden"
          aria-label="Mobile navigation"
        >
          <div className="mx-auto grid max-w-[1400px]">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center border-b border-white/10 text-base font-semibold text-[#e8ebed]"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/admin" onClick={() => setOpen(false)} className="flex min-h-12 items-center text-base font-semibold text-[#e8ebed]">
              Admin panel
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
