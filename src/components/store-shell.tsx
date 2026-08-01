import type { ReactNode } from "react";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function StoreShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-paper text-ink">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
