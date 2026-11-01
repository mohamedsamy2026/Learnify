"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowUpRight,
  KeyRound,
  LoaderCircle,
  LogOut,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { getToken, logout } from "@/lib/auth";
import { usersApi } from "@/lib/users";
import AccountNavigation from "./AccountNavigation";

export default function SettingsPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSettings = useCallback(async () => {
    if (!getToken()) {
      router.replace("/login?redirect=/settings");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await usersApi.getMe();
      setUser(data);
    } catch (err) {
      if (err.response?.status === 401) {
        router.replace("/login?redirect=/settings");
        return;
      }

      setError("Unable to load your account settings.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  function handleLogout() {
    logout();
    router.replace("/login");
    router.refresh();
  }

  // ================= LOADING =================

  if (loading && !user) {
    return (
      <main className="relative flex min-h-[75vh] items-center justify-center overflow-hidden bg-[#F6F9FE] px-6">
        <div className="pointer-events-none absolute h-80 w-80 rounded-full bg-[#DCEBFF] opacity-70 blur-[90px]" />

        <div className="relative flex flex-col items-center gap-5 rounded-[28px] border border-white bg-white/80 px-12 py-10 shadow-[0_25px_70px_-35px_rgba(40,107,193,0.3)] backdrop-blur-xl">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF3FF] text-[#286BC1]">
            <LoaderCircle
              size={29}
              className="animate-spin"
            />
          </div>

          <p className="text-sm font-semibold text-[#536B8B]">
            Loading settings...
          </p>
        </div>
      </main>
    );
  }

  // ================= ERROR =================

  if (!user) {
    return (
      <main className="flex min-h-[75vh] flex-col items-center justify-center bg-[#F6F9FE] px-6 text-center">
        <div className="w-full max-w-md rounded-[30px] border border-[#E3ECF8] bg-white p-10 shadow-[0_20px_60px_-30px_rgba(30,70,130,0.2)]">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <ShieldCheck size={30} />
          </div>

          <p
            role="alert"
            className="text-sm font-medium text-red-600"
          >
            {error || "Settings unavailable."}
          </p>

          <button
            type="button"
            onClick={loadSettings}
            className="mt-7 inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#286BC1] px-7 font-semibold text-white shadow-lg shadow-blue-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1955A0]"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-clip bg-[#F6F9FE]">

      {/* ================= HERO ================= */}

      <section className="relative isolate overflow-hidden bg-[#102B53] pb-32 pt-16 text-white sm:pb-36 sm:pt-20">

        {/* Background lighting */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-64 h-[600px] w-[600px] rounded-full bg-[#377EE3]/35 blur-[110px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-52 left-1/3 h-[450px] w-[600px] rounded-full bg-[#65ADFF]/20 blur-[120px]"
        />

        {/* Decorative circles */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-28 top-[-80px] h-[430px] w-[430px] rounded-full border border-white/10 shadow-[0_0_0_55px_rgba(255,255,255,0.025),0_0_0_110px_rgba(255,255,255,0.015)] sm:right-[4%]"
        />

        <div className="settings-enter relative mx-auto max-w-7xl px-6 lg:px-12">

          <div className="mb-5 flex items-center gap-3">
            <span className="h-[2px] w-8 rounded-full bg-[#8BC4FF]" />

            <span className="text-xs font-bold uppercase tracking-[0.24em] text-[#A6CFFF]">
              My Account
            </span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-[-0.035em] sm:text-5xl lg:text-6xl">
            Settings
          </h1>

          <p className="mt-5 max-w-xl text-[15px] leading-7 text-[#BED6F4] sm:text-base">
            Review your account and manage your session.
          </p>

        </div>
      </section>

      {/* ================= MAIN LAYOUT ================= */}

      <div className="relative z-10 mx-auto -mt-16 grid max-w-7xl items-start gap-7 px-6 pb-24 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-12">

        <AccountNavigation role={user.role} />

        <div className="min-w-0 space-y-7">

          {/* ================= ACCOUNT INFORMATION ================= */}

          <section className="settings-enter group relative overflow-hidden rounded-[30px] border border-white bg-white p-6 shadow-[0_22px_60px_-32px_rgba(20,52,92,0.42)] transition-all duration-500 hover:shadow-[0_30px_75px_-32px_rgba(20,52,92,0.48)] sm:p-9">

            {/* Background glow */}

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-[#E9F3FF]/70 blur-3xl transition-all duration-500 group-hover:bg-[#DCEBFF]"
            />

            {/* Header */}

            <div className="relative flex items-center gap-4 border-b border-[#EDF1F7] pb-7">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#286BC1] to-[#79B6FF] text-white shadow-[0_10px_25px_-8px_rgba(40,107,193,0.5)] transition-transform duration-500 motion-safe:group-hover:-rotate-3 motion-safe:group-hover:scale-105">
                <UserRound size={26} strokeWidth={1.8} />
              </div>

              <h2 className="text-xl font-extrabold tracking-tight text-[#102C57] sm:text-2xl">
                Account Information
              </h2>

            </div>

            {/* Account details */}

            <div className="relative mt-7 space-y-5">

              {/* Email */}

              <div className="group/row flex items-center gap-4 rounded-2xl border border-[#EDF2F9] bg-[#F8FAFE] p-5 transition-all duration-300 hover:border-[#D4E5FA] hover:bg-[#F1F7FF]">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#6C91C3] shadow-sm transition-all duration-300 group-hover/row:bg-[#E4F0FF] group-hover/row:text-[#286BC1] motion-safe:group-hover/row:scale-105">
                  <Mail size={21} strokeWidth={1.8} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium text-[#8194AD]">
                    Email Address
                  </p>

                  <p className="mt-1 break-all text-[15px] font-bold text-[#102C57]">
                    {user.email}
                  </p>
                </div>

              </div>

              {/* Account Role */}

              <div className="group/row flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#EDF2F9] bg-[#F8FAFE] p-5 transition-all duration-300 hover:border-[#D4E5FA] hover:bg-[#F1F7FF]">

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#6C91C3] shadow-sm transition-all duration-300 group-hover/row:bg-[#E4F0FF] group-hover/row:text-[#286BC1] motion-safe:group-hover/row:scale-105">
                    <ShieldCheck size={21} strokeWidth={1.8} />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-[#8194AD]">
                      Account Role
                    </p>

                    <p className="mt-1 text-[15px] font-bold capitalize text-[#102C57]">
                      {user.role}
                    </p>
                  </div>

                </div>

                <Link
                  href="/profile"
                  className="group/link inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#D9E8FB] bg-white px-4 text-sm font-bold text-[#286BC1] transition-all duration-300 hover:border-[#A8CDF7] hover:bg-[#EAF4FF]"
                >
                  Edit Profile

                  <ArrowUpRight
                    size={17}
                    className="transition-transform duration-300 motion-safe:group-hover/link:-translate-y-0.5 motion-safe:group-hover/link:translate-x-0.5"
                  />
                </Link>

              </div>

            </div>

          </section>

          {/* ================= SECURITY & SESSION ================= */}

          <section className="settings-enter-delayed group relative overflow-hidden rounded-[30px] border border-[#E3EBF7] bg-white p-6 shadow-[0_20px_60px_-35px_rgba(20,52,92,0.24)] transition-all duration-500 hover:shadow-[0_25px_70px_-35px_rgba(20,52,92,0.34)] sm:p-9">

            {/* Top gradient */}

            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#2F77D2] via-[#79B5FF] to-transparent"
            />

            {/* Header */}

            <div className="flex items-center gap-4 border-b border-[#EDF1F7] pb-7">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EDF5FF] text-[#286BC1] shadow-sm">
                <ShieldCheck size={26} strokeWidth={1.8} />
              </div>

              <h2 className="text-xl font-extrabold tracking-tight text-[#102C57] sm:text-2xl">
                Security & Session
              </h2>

            </div>

            {/* Password management */}

            <div className="group/password mt-7 flex items-start gap-4 rounded-[22px] border border-[#E5EDF8] bg-gradient-to-br from-[#F7FAFF] to-[#EFF6FF] p-5 transition-all duration-300 hover:border-[#C9DFF8] hover:shadow-[0_12px_30px_-20px_rgba(40,107,193,0.3)] sm:p-6">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#286BC1] shadow-[0_6px_15px_-8px_rgba(40,107,193,0.4)] transition-transform duration-300 motion-safe:group-hover/password:-rotate-6">
                <KeyRound size={23} strokeWidth={1.8} />
              </div>

              <div className="min-w-0">

                <h3 className="text-base font-bold text-[#102C57]">
                  Password Management
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#667B98]">
                  Password changes are not available from the
                  dashboard yet. This feature requires a
                  secure backend password-change endpoint.
                </p>

              </div>

            </div>

            {/* Sign out */}

            <div className="mt-9 border-t border-[#EDF1F7] pt-8">

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <h3 className="text-lg font-bold text-[#102C57]">
                    Sign Out
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-[#667B98]">
                    End your current browser session on Learnify.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="group/logout relative inline-flex min-h-[52px] shrink-0 items-center justify-center gap-3 overflow-hidden rounded-2xl border border-red-200 bg-red-50 px-7 text-sm font-bold text-red-700 shadow-[0_6px_18px_-12px_rgba(185,28,28,0.25)] transition-all duration-300 hover:border-red-300 hover:bg-red-100 hover:shadow-[0_12px_25px_-12px_rgba(185,28,28,0.3)] motion-safe:hover:-translate-y-[2px] motion-safe:active:scale-[0.98]"
                >
                  <LogOut
                    size={19}
                    className="transition-transform duration-300 motion-safe:group-hover/logout:translate-x-1"
                  />

                  Log Out
                </button>

              </div>

            </div>

          </section>

          {/* Error */}

          {error && (
            <p
              role="alert"
              className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm font-medium text-red-600"
            >
              {error}
            </p>
          )}

        </div>
      </div>

      {/* ================= ANIMATIONS ================= */}

      <style jsx>{`
        @keyframes settingsFadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: no-preference) {
          .settings-enter {
            animation: settingsFadeUp 0.65s
              cubic-bezier(0.22, 1, 0.36, 1) both;
          }

          .settings-enter-delayed {
            animation: settingsFadeUp 0.75s
              cubic-bezier(0.22, 1, 0.36, 1) 0.12s both;
          }
        }
      `}</style>

    </main>
  );
}