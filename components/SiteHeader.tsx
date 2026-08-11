import Link from "next/link";

export default function SiteHeader() {
  return (
    <div className="border-b border-rule">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
        <Link href="/" className="font-serif text-sm font-semibold tracking-tight">
          Interim Govt. Protest Watch
        </Link>
        <nav className="flex items-center gap-4 text-xs font-sans text-ink-muted">
          <a
            href="https://bangladesh-protest-monitor.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink"
          >
            Map ↗
          </a>
          <Link href="/about" className="hover:text-ink">
            About
          </Link>
        </nav>
      </div>
    </div>
  );
}
