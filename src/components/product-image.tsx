import Image from "next/image";

export function ProductImage({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 82vw, 25vw",
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  if (src.startsWith("/") && !src.startsWith("//")) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={className}
      />
    );
  }

  // Dynamic Supabase and local camera URLs bypass Next's optimizer by design.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} />;
}
