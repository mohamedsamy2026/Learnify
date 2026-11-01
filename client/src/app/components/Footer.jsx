import Link from "next/link";
import { GraduationCap } from "lucide-react";

const footerLinks = [
  { label: "Courses", href: "/courses" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Pricing", href: "/pricing" },
  { label: "Help", href: "/help" },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-line bg-canvas">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12 lg:px-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          {/* ================= BRAND ================= */}

          <div>
            <Link
              href="/"
              aria-label="Learnify Home"
              className="group/brand inline-flex items-center gap-3"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white">
                <GraduationCap size={22} strokeWidth={1.8} />
              </div>

              <span className="text-[22px] font-extrabold tracking-[-0.03em] text-ink transition-colors duration-200 group-hover/brand:text-brand">
                Learnify
              </span>
            </Link>

            <p className="mt-3 text-xs font-medium text-subtle">
              © 2026 Learnify. All rights reserved.
            </p>
            <p className="mt-1 text-xs font-semibold text-brand">
              Skills for a Brighter Tomorrow
            </p>
          </div>

          {/* ================= FOOTER LINKS ================= */}

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center gap-x-8 gap-y-3"
          >
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-1 text-sm font-semibold text-muted transition-colors duration-200 hover:text-brand focus-visible:text-brand focus-visible:outline-none"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}