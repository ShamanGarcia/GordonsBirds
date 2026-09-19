"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/admin/actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        Email
        <input
          type="email"
          name="email"
          required
          autoComplete="username"
          className="border border-hairline bg-white px-3 py-2 focus:border-accent focus:outline-none"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Password
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="border border-hairline bg-white px-3 py-2 focus:border-accent focus:outline-none"
        />
      </label>
      {state?.error && <p className="text-sm text-clay">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="mt-2 border border-ink px-5 py-2.5 text-sm text-ink transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
