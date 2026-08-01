"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowRight, LockKey } from "@phosphor-icons/react";
import { login, type LoginState } from "@/app/admin/login/actions";

const initialState: LoginState = { error: null };

export function LoginForm({ configured, next }: { configured: boolean; next: string }) {
  const [state, action, pending] = useActionState(login, initialState);

  if (!configured) {
    return (
      <div className="border-t-4 border-warning bg-surface p-6 shadow-court">
        <LockKey size={34} weight="duotone" className="text-warning" />
        <h2 className="mt-4 text-xl font-extrabold text-ink">Demo mode is open.</h2>
        <p className="mt-3 text-sm leading-6 text-ink-soft">Add the Supabase URL and publishable key to require authentication. Until then, data remains in this browser only.</p>
        <Link href="/admin" className="button-press mt-6 flex min-h-12 items-center justify-center gap-3 bg-action px-5 font-extrabold text-[#f7f7f4] hover:bg-action-hover">
          Open demo admin <ArrowRight size={19} weight="bold" />
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="border-t-4 border-cobalt bg-surface p-6 shadow-court sm:p-8">
      <input type="hidden" name="next" value={next} />
      <h2 className="text-xl font-extrabold text-ink">Admin sign in</h2>
      <div className="mt-6 grid gap-5">
        <label className="grid gap-2">
          <span className="text-sm font-extrabold text-ink">Email</span>
          <input required type="email" name="email" autoComplete="email" className="field-input" maxLength={254} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-extrabold text-ink">Password</span>
          <input required type="password" name="password" autoComplete="current-password" className="field-input" minLength={8} />
        </label>
        {state.error ? <p role="alert" className="border border-danger bg-danger/8 p-4 text-sm font-semibold text-danger">{state.error}</p> : null}
        <button type="submit" disabled={pending} className="button-press flex min-h-12 items-center justify-center gap-3 bg-action px-5 font-extrabold text-[#f7f7f4] hover:bg-action-hover">
          <LockKey size={19} weight="bold" /> {pending ? "Signing in..." : "Sign in"}
        </button>
      </div>
    </form>
  );
}
