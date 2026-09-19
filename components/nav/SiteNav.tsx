"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/catalogue", label: "Catalogue" },
  { href: "/taxonomy", label: "Taxonomy" },
  { href: "/map", label: "Map" },
  { href: "/shop", label: "Shop" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b-2 border-hairline bg-bg">
      <a href="#main" className="sr-only-focusable">
        Skip to content
      </a>
      <nav aria-label="Primary" className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex items-center justify-between py-4">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 whitespace-nowrap font-serif text-lg tracking-tight text-ink"
          >
            <Image src="/icon.svg" alt="" width={22} height={22} aria-hidden="true" unoptimized />
            Gordon&rsquo;s Birds
          </Link>

          <ul className="hidden items-center gap-7 text-sm sm:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className="text-ink-muted transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline-none focus-visible:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 sm:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span
              className={`block h-px w-5 bg-ink transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
            />
            <span
              className={`block h-px w-5 bg-ink transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
            />
          </button>
        </div>

        {open && (
          <ul className="flex flex-col gap-1 border-t border-hairline/70 py-3 text-sm sm:hidden">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 text-ink-muted transition-colors hover:text-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
}
