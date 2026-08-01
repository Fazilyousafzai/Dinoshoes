import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-paper px-4 text-center">
      <div className="max-w-lg">
        <h1 className="display-type text-6xl text-ink">ADMIN ACCESS REQUIRED.</h1>
        <p className="mt-4 text-base leading-7 text-ink-soft">Your account is signed in, but its profile does not have the admin role.</p>
        <Link href="/" className="button-press mt-7 inline-flex min-h-12 items-center bg-ink px-6 font-extrabold text-paper hover:bg-cobalt">Return to store</Link>
      </div>
    </main>
  );
}
