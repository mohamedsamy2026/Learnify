"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  UserRound,
  Settings,
  LayoutDashboard,
} from "lucide-react";

const links = [
  {
    label: "My Profile",
    href: "/profile",
    icon: UserRound,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function AccountNavigation({ role }) {
  const pathname = usePathname();

  const dashboardHref =
    role === "instructor" ? "/instructor" : "/dashboard";

  const navigationItems = [
    ...links,
    {
      label: "Dashboard",
      href: dashboardHref,
      icon: LayoutDashboard,
    },
  ];

  return (
    <aside
      className="
        group relative overflow-hidden
        rounded-[28px]
        border border-hxl-e1eaf7
        bg-surface
        p-3
        shadow-[0_15px_50px_-20px_rgba(39,103,189,0.18)]
        transition-all duration-500
        hover:shadow-[0_25px_65px_-20px_rgba(39,103,189,0.24)]
        lg:sticky lg:top-32
      "
    >
      {/* Top gradient line */}
      <div
        aria-hidden="true"
        className="
          absolute inset-x-0 top-0 h-[3px]
          bg-gradient-to-r
          from-brand-light
          via-hxg-73b3ff
          to-hxg-c4dfff
        "
      />

      {/* Background glow */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -right-20 -top-24
          h-52 w-52 rounded-full
          bg-hxb-dcebff/60
          blur-[65px]
          transition-all duration-700
          group-hover:bg-hxb-c9e2ff/80
        "
      />

      {/* Header */}
      <div className="relative flex items-center gap-3 px-3 pb-6 pt-5">
        <div
          className="
            flex h-12 w-12 shrink-0
            items-center justify-center
            rounded-2xl
            bg-gradient-to-br
            from-brand-light
            to-hxg-74b1ff
            text-white
            shadow-[0_8px_20px_-6px_rgba(52,120,212,0.5)]
            transition-transform duration-500
            motion-safe:group-hover:rotate-[-5deg]
            motion-safe:group-hover:scale-105
          "
        >
          <UserRound size={23} strokeWidth={1.8} />
        </div>

        <div>
          <h2 className="text-[17px] font-bold tracking-tight text-hxt-203b60">
            My Account
          </h2>

          <div className="mt-2 h-[3px] w-9 rounded-full bg-gradient-to-r from-brand-light to-hxg-9ec9ff" />
        </div>
      </div>

      {/* Navigation */}
      <nav
        aria-label="Account navigation"
        className="relative space-y-2"
      >
        {navigationItems.map(({ label, href, icon: Icon }, index) => {
          const active = pathname === href;

          return (
            <div key={href}>
              {/* Separator before Dashboard */}
              {index === 2 && (
                <div
                  aria-hidden="true"
                  className="mx-3 my-4 h-px bg-gradient-to-r from-transparent via-hxg-dfe8f5 to-transparent"
                />
              )}

              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`
                  group/item relative
                  flex items-center gap-3
                  overflow-hidden
                  rounded-2xl
                  px-3 py-3
                  text-sm font-semibold
                  transition-all duration-300 ease-out
                  motion-safe:hover:-translate-y-[2px]
                  motion-safe:active:scale-[0.98]
                  ${
                    active
                      ? `
                        bg-gradient-to-r
                        from-hxg-e8f2ff
                        via-hxg-f0f7ff
                        to-hxg-f8fbff
                        text-brand
                        shadow-[inset_0_0_0_1px_rgba(52,120,212,0.10)]
                      `
                      : `
                        text-hxt-63758f
                        hover:bg-hxb-f4f8ff
                        hover:text-brand
                        hover:shadow-[0_8px_20px_-10px_rgba(39,103,189,0.20)]
                      `
                  }
                `}
              >
                {/* Active indicator */}
                {active && (
                  <span
                    aria-hidden="true"
                    className="
                      absolute bottom-3 left-0 top-3
                      w-[3px]
                      rounded-r-full
                      bg-gradient-to-b
                      from-brand-light
                      to-hxg-80bcff
                      shadow-[0_0_12px_rgba(52,120,212,0.35)]
                    "
                  />
                )}

                {/* Icon container */}
                <span
                  className={`
                    relative z-10
                    flex h-10 w-10 shrink-0
                    items-center justify-center
                    rounded-xl
                    transition-all duration-300 ease-out
                    motion-safe:group-hover/item:rotate-[-5deg]
                    motion-safe:group-hover/item:scale-110
                    ${
                      active
                        ? `
                          bg-surface
                          text-brand-light
                          shadow-[0_4px_12px_rgba(52,120,212,0.12)]
                        `
                        : `
                          bg-hxb-f0f5fc
                          text-hxt-7589a5
                          group-hover/item:bg-hxb-e6f1ff
                          group-hover/item:text-brand-light
                        `
                    }
                  `}
                >
                  <Icon size={19} strokeWidth={1.9} />
                </span>

                {/* Label */}
                <span className="relative z-10 flex-1">
                  {label}
                </span>

                {/* Subtle hover indicator */}
                <span
                  aria-hidden="true"
                  className={`
                    relative z-10
                    h-1.5 w-1.5
                    rounded-full
                    transition-all duration-300
                    ${
                      active
                        ? "scale-100 bg-brand-light"
                        : "scale-0 bg-hxb-8ebeff group-hover/item:scale-100"
                    }
                  `}
                />
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Bottom decoration */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          relative mx-auto mt-6
          h-[3px] w-14
          rounded-full
          bg-gradient-to-r
          from-transparent
          via-hxg-c5daf5
          to-transparent
        "
      />
    </aside>
  );
}