import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

const categories = [
  {
    name: "Football Studs",
    description: "Firm-ground speed and close control.",
    href: "/shop?category=studs",
    image: "/images/category-studs.png",
    className: "md:col-span-6 md:row-span-2",
  },
  {
    name: "Grippers",
    description: "Less movement inside the boot.",
    href: "/shop?category=grippers",
    image: "/images/category-grippers.png",
    className: "md:col-span-3",
  },
  {
    name: "Socks",
    description: "Cushioning where matches ask for it.",
    href: "/shop?category=socks",
    image: "/images/category-socks.png",
    className: "md:col-span-3",
  },
  {
    name: "Footballs",
    description: "Training and match-day flight.",
    href: "/shop?category=footballs",
    image: "/images/category-footballs.png",
    className: "md:col-span-6",
  },
];

export function CategoryGrid() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <h2 className="display-type max-w-[12ch] text-4xl leading-[0.92] text-ink sm:text-5xl">
        START WITH YOUR POSITION.
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-6 text-ink-soft sm:text-base sm:leading-7">
        Browse the essentials separately, or bring them together in the kit builder.
      </p>

      <div className="no-scrollbar mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 md:mx-0 md:grid md:grid-cols-12 md:grid-rows-[200px_200px] md:overflow-visible lg:gap-4">
        {categories.map((category) => (
          <article
            key={category.name}
            className={`w-[82vw] max-w-[360px] shrink-0 snap-start md:w-auto md:max-w-none ${category.className}`}
          >
            <Link href={category.href} className="group flex h-full flex-col overflow-hidden bg-surface">
              <div className="relative aspect-[4/3] overflow-hidden bg-paper-strong md:flex-1 md:aspect-auto">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 767px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                />
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_40px] items-center gap-3 border border-t-0 border-line px-3 py-2.5 sm:px-4">
                <div className="min-w-0">
                  <h3 className="text-sm font-extrabold text-ink">{category.name}</h3>
                </div>
                <span className="flex size-9 shrink-0 items-center justify-center bg-ink text-paper transition-colors group-hover:bg-cobalt">
                  <ArrowUpRight size={16} weight="bold" />
                </span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
