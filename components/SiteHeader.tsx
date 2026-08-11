import Link from "next/link";

export default function SiteHeader() {
  return (
    <div className="border-b border-rule bg-[color-mix(in_srgb,var(--paper)_82%,white)]">
      <div className="px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-sm border border-accent/50 bg-paper shadow-[3px_3px_0_rgba(37,75,61,0.14)] transition-transform group-hover:-rotate-3">
            <span className="absolute inset-x-0 top-0 h-2 bg-accent" />
            <span className="absolute left-1 top-3 h-1 w-1 rounded-full bg-amber" />
            <span className="absolute right-0 top-2 bottom-0 w-2 bg-[color-mix(in_srgb,var(--accent)_12%,var(--paper))]" />
            <span
              className="absolute right-0 top-2 bottom-0 w-2 bg-paper"
              style={{
                clipPath:
                  "polygon(100% 0%, 100% 100%, 45% 100%, 85% 84%, 42% 69%, 88% 51%, 45% 34%, 84% 17%, 42% 0%)",
              }}
            />
            <span className="font-serif text-sm font-semibold leading-none text-accent">
              24
            </span>
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-serif text-base sm:text-lg font-semibold tracking-tight">
              Interim Protest Calendar
            </span>
            <span className="mt-1 hidden sm:block font-sans text-[10px] uppercase tracking-[0.16em] text-ink-muted">
              Verified archive
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-2 text-xs font-sans text-ink-muted">
          <a
            href="https://bangladesh-protest-monitor.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-rule bg-paper/70 px-3 py-1.5 hover:border-accent hover:bg-accent hover:text-paper transition-colors"
          >
            Map
          </a>
          <Link
            href="/about"
            className="rounded-full border border-rule bg-paper/70 px-3 py-1.5 hover:border-accent hover:bg-accent hover:text-paper transition-colors"
          >
            About
          </Link>
        </nav>
      </div>
    </div>
  );
}
