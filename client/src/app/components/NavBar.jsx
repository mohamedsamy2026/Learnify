"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  GraduationCap,
  Menu,
  X,
  ArrowRight,
  UserRound,
  ChevronDown,
  LayoutDashboard,
  BookOpen,
  Settings,
  LogOut,
} from "lucide-react";

import { authApi, getToken, logout } from "@/lib/auth";

const spring = {
  type: "spring",
  stiffness: 300,
  damping: 32,
  mass: 0.9,
};

function getNavigationLinks(user) {
  const links = [
    { label: "Home", href: "/" },
    { label: "Courses", href: "/courses" },
  ];

  if (user?.role === "student") {
    links.push({
      label: "My Learning",
      href: "/my-learning",
    });
  }

  if (user?.role === "instructor") {
    links.push({
      label: "Dashboard",
      href: "/instructor",
    });
  }

  return links;
}

function getAccountLinks(user) {
  return [
    {
      label: "My Profile",
      href: "/profile",
      icon: UserRound,
    },
    {
      label: "Dashboard",
      href:
        user?.role === "instructor"
          ? "/instructor"
          : "/dashboard",
      icon: LayoutDashboard,
    },
    ...(user?.role === "student"
      ? [
          {
            label: "My Learning",
            href: "/my-learning",
            icon: BookOpen,
          },
        ]
      : []),
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const navRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);

  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const transition = reduceMotion
    ? { duration: 0 }
    : spring;

  const loadUser = useCallback(async () => {
    const token = getToken();

    if (!token) {
      setUser(null);
      setAuthReady(true);
      return;
    }

    try {
      const data = await authApi.getMe(token);
      const profile = data?.user ?? data;

      setUser(profile);
    } catch {
      // Do not display private account links when
      // the session cannot be verified.
      setUser(null);
    } finally {
      setAuthReady(true);
    }
  }, []);

  useEffect(() => {
    loadUser();

    window.addEventListener(
      "learnify-auth-change",
      loadUser
    );

    return () => {
      window.removeEventListener(
        "learnify-auth-change",
        loadUser
      );
    };
  }, [loadUser]);

  function closeMenus() {
    setIsExpanded(false);
    setIsMobileOpen(false);
    setIsAccountOpen(false);
    setHoveredLink(null);
  }

  useEffect(() => {
    setIsExpanded(false);
    setIsMobileOpen(false);
    setIsAccountOpen(false);
    setHoveredLink(null);
  }, [pathname]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        closeMenus();
      }
    }

    function handleClickOutside(event) {
      if (!navRef.current?.contains(event.target)) {
        closeMenus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener(
      "pointerdown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
      document.removeEventListener(
        "pointerdown",
        handleClickOutside
      );
    };
  }, []);

  function handleLogout() {
    logout();
    setUser(null);
    closeMenus();
    router.replace("/");
    router.refresh();
  }

  const navigationLinks = getNavigationLinks(user);
  const accountLinks = user ? getAccountLinks(user) : [];

  const leftLinks = navigationLinks.slice(0, 2);
  const rightLinks = navigationLinks.slice(2);

  const linkProps = {
    pathname,
    hoveredLink,
    setHoveredLink,
    transition,
    closeMenus,
  };

  return (
    <header
      ref={navRef}
      className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4 sm:top-5"
    >
      <nav
        aria-label="Main navigation"
        className="pointer-events-auto relative"
      >
        {/* DESKTOP NAVBAR */}
        <div
          className="hidden lg:block"
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") {
              setIsExpanded(true);
            }
          }}
          onPointerLeave={(event) => {
            if (event.pointerType === "mouse") {
              setIsExpanded(false);
              setIsAccountOpen(false);
              setHoveredLink(null);
            }
          }}
          onFocusCapture={() => setIsExpanded(true)}
          onBlurCapture={(event) => {
            if (
              !event.currentTarget.contains(
                event.relatedTarget
              )
            ) {
              setIsExpanded(false);
              setIsAccountOpen(false);
              setHoveredLink(null);
            }
          }}
        >
          <LayoutGroup id="learnify-navbar">
            <motion.div
              layout
              transition={transition}
              className="flex h-[68px] items-center justify-center gap-2 rounded-full border border-[#DCE7F5] bg-white/95 px-2 shadow-[0_8px_30px_rgba(15,42,74,0.10)] backdrop-blur-xl"
            >
              {/* LEFT LINKS */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    key="left-links"
                    initial={{
                      opacity: 0,
                      width: 0,
                      scale: 0.95,
                    }}
                    animate={{
                      opacity: 1,
                      width: "auto",
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      width: 0,
                      scale: 0.95,
                    }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.28,
                    }}
                    className="flex items-center overflow-hidden"
                  >
                    <div className="flex items-center gap-1 whitespace-nowrap pl-2">
                      {leftLinks.map((link) => (
                        <DesktopLink
                          key={link.href}
                          link={link}
                          {...linkProps}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CENTER LOGO */}
              <Link
                href="/"
                onClick={closeMenus}
                aria-label="Learnify Home"
                className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#2563B8] text-white transition-colors duration-200 hover:bg-[#1D4F94] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563B8] focus-visible:ring-offset-2"
              >
                <GraduationCap
                  size={28}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </Link>

              {/* RIGHT LINKS */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    key="right-links"
                    initial={{
                      opacity: 0,
                      width: 0,
                      scale: 0.95,
                    }}
                    animate={{
                      opacity: 1,
                      width: "auto",
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      width: 0,
                      scale: 0.95,
                    }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.28,
                    }}
                    className="flex items-center"
                  >
                    <div className="flex items-center gap-1 whitespace-nowrap pr-2">
                      {rightLinks.map((link) => (
                        <DesktopLink
                          key={link.href}
                          link={link}
                          {...linkProps}
                        />
                      ))}

                      <div className="mx-2 h-6 w-px bg-[#DCE7F5]" />

                      {!authReady ? (
                        <div className="h-10 w-20 animate-pulse rounded-full bg-[#EAF2FC]" />
                      ) : user ? (
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setIsAccountOpen((prev) => !prev)
                            }
                            aria-label="Open account menu"
                            aria-expanded={isAccountOpen}
                            aria-haspopup="true"
                            className={`flex h-11 items-center gap-2 rounded-full border px-1.5 pr-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563B8] ${
                              isAccountOpen
                                ? "border-[#2563B8] bg-[#EAF2FC]"
                                : "border-[#DCE7F5] bg-white hover:bg-[#F3F8FE]"
                            }`}
                          >
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2563B8] text-white">
                              <UserRound size={18} />
                            </span>
                            <ChevronDown
                              size={15}
                              className={`text-[#55657C] transition-transform ${
                                isAccountOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          <AnimatePresence>
                            {isAccountOpen && (
                              <motion.div
                                initial={{
                                  opacity: 0,
                                  y: -8,
                                  scale: 0.97,
                                }}
                                animate={{
                                  opacity: 1,
                                  y: 0,
                                  scale: 1,
                                }}
                                exit={{
                                  opacity: 0,
                                  y: -6,
                                  scale: 0.97,
                                }}
                                transition={{ duration: 0.18 }}
                                className="absolute right-0 top-[56px] z-50 w-72 overflow-hidden rounded-2xl border border-[#DCE7F5] bg-white p-2 shadow-[0_16px_44px_rgba(15,42,74,0.14)]"
                              >
                                <AccountMenu
                                  user={user}
                                  links={accountLinks}
                                  pathname={pathname}
                                  closeMenus={closeMenus}
                                  onLogout={handleLogout}
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <>
                          <Link
                            href="/login"
                            onClick={closeMenus}
                            className="rounded-full px-4 py-3 text-sm font-semibold text-[#0F2A4A] transition-colors hover:text-[#2563B8]"
                          >
                            Log In
                          </Link>

                          <Link
                            href="/register"
                            onClick={closeMenus}
                            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#2563B8] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#1D4F94]"
                          >
                            Get Started
                            <ArrowRight size={16} />
                          </Link>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        </div>

        {/* MOBILE & TABLET */}
        <div className="lg:hidden">
          <button
            type="button"
            onClick={() =>
              setIsMobileOpen((prev) => !prev)
            }
            aria-label={
              isMobileOpen
                ? "Close navigation"
                : "Open navigation"
            }
            aria-expanded={isMobileOpen}
            aria-controls="learnify-mobile-menu"
            className="relative flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-white bg-[#2563B8] text-white shadow-[0_8px_24px_rgba(15,42,74,0.20)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563B8] focus-visible:ring-offset-2"
          >
            <GraduationCap size={29} strokeWidth={2} />

            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#0F2A4A] text-white">
              {isMobileOpen ? (
                <X size={13} />
              ) : (
                <Menu size={13} />
              )}
            </span>
          </button>

          <AnimatePresence>
            {isMobileOpen && (
              <motion.div
                id="learnify-mobile-menu"
                key="mobile-menu"
                initial={{
                  opacity: 0,
                  y: -12,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                  scale: 0.97,
                }}
                transition={{
                  duration: reduceMotion ? 0 : 0.22,
                }}
                className="absolute left-1/2 top-[76px] w-[min(350px,calc(100vw-32px))] -translate-x-1/2 overflow-hidden rounded-3xl border border-[#DCE7F5] bg-white p-3 shadow-[0_16px_44px_rgba(15,42,74,0.14)]"
              >
                <div className="flex flex-col gap-1">
                  {navigationLinks.map((link) => {
                    const active =
                      link.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(link.href);

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={closeMenus}
                        aria-current={
                          active ? "page" : undefined
                        }
                        className={`rounded-xl px-5 py-3 text-center text-sm font-semibold transition-colors ${
                          active
                            ? "bg-[#2563B8] text-white"
                            : "text-[#0F2A4A] hover:bg-[#EEF5FD]"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>

                {authReady && user ? (
                  <div className="mt-3 border-t border-[#E5EDF8] pt-3">
                    <AccountMenu
                      user={user}
                      links={accountLinks}
                      pathname={pathname}
                      closeMenus={closeMenus}
                      onLogout={handleLogout}
                    />
                  </div>
                ) : authReady ? (
                  <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[#E5EDF8] pt-3">
                    <Link
                      href="/login"
                      onClick={closeMenus}
                      className="rounded-xl bg-[#EAF2FC] px-4 py-3 text-center text-sm font-semibold text-[#0F2A4A] transition-colors hover:bg-[#DDEAF9]"
                    >
                      Log In
                    </Link>

                    <Link
                      href="/register"
                      onClick={closeMenus}
                      className="rounded-xl bg-[#2563B8] px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#1D4F94]"
                    >
                      Get Started
                    </Link>
                  </div>
                ) : (
                  <div className="mt-3 h-12 animate-pulse rounded-xl bg-[#EAF2FC]" />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </header>
  );
}

function AccountMenu({
  user,
  links,
  pathname,
  closeMenus,
  onLogout,
}) {
  return (
    <div>
      {/* USER INFORMATION */}
      <div className="flex items-center gap-3 rounded-xl bg-[#F3F8FE] p-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2563B8] text-white">
          <UserRound size={20} />
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-[#0F2A4A]">
            {user.name || "Learnify User"}
          </p>

          <p className="truncate text-xs text-[#64768F]">
            {user.email || ""}
          </p>

          <p className="mt-0.5 text-[11px] font-semibold capitalize text-[#2563B8]">
            {user.role || "Member"}
          </p>
        </div>
      </div>

      {/* ACCOUNT LINKS */}
      <div className="my-2 space-y-0.5">
        {links.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              onClick={closeMenus}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                active
                  ? "bg-[#EAF2FC] text-[#2563B8]"
                  : "text-[#55657C] hover:bg-[#F3F8FE] hover:text-[#0F2A4A]"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </div>

      {/* LOGOUT */}
      <div className="border-t border-[#E5EDF8] pt-2">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </div>
    </div>
  );
}

function DesktopLink({
  link,
  pathname,
  hoveredLink,
  setHoveredLink,
  transition,
  closeMenus,
}) {
  const isActive =
    link.href === "/"
      ? pathname === "/"
      : pathname.startsWith(link.href);

  const isHovered = hoveredLink === link.href;

  const showPill =
    hoveredLink === null ? isActive : isHovered;

  return (
    <Link
      href={link.href}
      onClick={closeMenus}
      onMouseEnter={() => setHoveredLink(link.href)}
      onMouseLeave={() => setHoveredLink(null)}
      aria-current={isActive ? "page" : undefined}
      className={`relative flex min-h-10 items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
        showPill
          ? "text-white"
          : "text-[#0F2A4A] hover:text-[#2563B8]"
      }`}
    >
      {showPill && (
        <motion.span
          layoutId="learnify-active-pill"
          transition={transition}
          className="absolute inset-0 rounded-full bg-[#2563B8]"
          aria-hidden="true"
        />
      )}

      <span className="relative z-10">
        {link.label}
      </span>
    </Link>
  );
}