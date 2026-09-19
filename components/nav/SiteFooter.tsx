export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-hairline/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-10 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>&copy; {new Date().getFullYear()} Gordon&rsquo;s Birds. A photographic field archive.</p>
      </div>
    </footer>
  );
}
