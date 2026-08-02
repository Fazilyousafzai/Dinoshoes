import type { Metadata } from "next";
import { AppProvider } from "@/components/app-provider";
import "./globals.css";

const designContract = `<!--
THESIS: HALFSPACE turns the act of crossing a football pitch boundary into the transition from browsing to buying, refusing the floating-shoe-on-black category template.
OWN-WORLD: Weathered cobalt court fields, chalk-white geometry, charcoal rubber surfaces, one safety-orange action color, condensed campaign type, and square-edged controls.
STORY: Buyers meet one decisive drop, browse four positions in their kit, build a loadout, and buy. Admins work in a quieter version of the same system.
FIRST VIEWPORT: Compact charcoal navigation above a cobalt split hero. Copy anchors left, a generated boot crosses a diagonal boundary on the right, and the orange Shop gear action stays visible.
FORM: Street-court inventory, grounded candidate 5, seed key 17f1ff7b.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`;

export const metadata: Metadata = {
  metadataBase: new URL("https://halfspace-football.vercel.app"),
  title: {
    default: "DINO'S COLLECTION | Football gear for the next touch",
    template: "%s | DINO'S COLLECTION",
  },
  description:
    "Shop football studs, grippers, socks, and footballs in a fast mobile-first football store.",
  keywords: ["football shoes", "football studs", "grip socks", "footballs", "football gear"],
  openGraph: {
    title: "DINO'S COLLECTION Football Store",
    description: "Own the next touch with match-ready football gear.",
    images: [{ url: "/images/hero-boot.png", width: 1536, height: 1024 }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <span
          hidden
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: designContract }}
        />
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
