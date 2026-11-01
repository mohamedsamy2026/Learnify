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
    <footer className="w-full border-t border-[#E3ECF7] bg-white">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12 lg:px-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          {/* ================= BRAND ================= */}

          <div>
            <Link
              href="/"
              aria-label="Learnify Home"
              className="group/brand inline-flex items-center gap-3"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2563B8] text-white">
                <GraduationCap size={22} strokeWidth={1.8} />
              </div>

              <span className="text-[22px] font-extrabold tracking-[-0.03em] text-[#0F2A4A] transition-colors duration-200 group-hover/brand:text-[#2563B8]">
                Learnify
              </span>
            </Link>

            <p className="mt-3 text-xs font-medium text-[#7C8DA6]">
              © 2026 Learnify. All rights reserved.
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
                className="py-1 text-sm font-semibold text-[#55657C] transition-colors duration-200 hover:text-[#2563B8] focus-visible:text-[#2563B8] focus-visible:outline-none"
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