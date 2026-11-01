"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  CheckCircle2,
  LoaderCircle,
  Mail,
  RefreshCw,
  Save,
  UserRound,
} from "lucide-react";

import { getToken } from "@/lib/auth";
import { usersApi } from "@/lib/users";
import AccountNavigation from "./AccountNavigation";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // ========================================
  // LOAD PROFILE — ORIGINAL LOGIC
  // ========================================

  const loadProfile = useCallback(async () => {
    if (!getToken()) {
      router.replace("/login?redirect=/profile");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await usersApi.getMe();

      setUser(data);

      setForm({
        name: data.name ?? "",
        email: data.email ?? "",
      });
    } catch (err) {
      if (err.response?.status === 401) {
        router.replace("/login?redirect=/profile");
        return;
      }

      setError("Unable to load your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // ========================================
  // INPUT HANDLING — ORIGINAL LOGIC
  // ========================================

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setNotice("");
  }

  // ========================================
  // SAVE PROFILE — ORIGINAL LOGIC
  // ========================================

  async function handleSubmit(event) {
    event.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();

    if (name.length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setNotice("");

      await usersApi.updateMe({ name, email });

      const updatedUser = await usersApi.getMe();

      setUser(updatedUser);

      setForm({
        name: updatedUser.name ?? name,
        email: updatedUser.email ?? email,
      });

      window.dispatchEvent(
        new Event("learnify-auth-change")
      );

      setNotice("Your profile has been updated successfully.");
    } catch (err) {
      if (err.response?.status === 401) {
        router.replace("/login?redirect=/profile");
        return;
      }

      if (err.response?.status === 409) {
        setError("This email address is already in use.");
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to update your profile."
        );
      }
    } finally {
      setSaving(false);
    }
  }

  // ========================================
  // LOADING STATE
  // ========================================

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
            Loading your profile...
          </p>
        </div>
      </main>
    );
  }

  // ========================================
  // ERROR STATE
  // ========================================

  if (!user) {
    return (
      <main className="flex min-h-[75vh] flex-col items-center justify-center bg-[#F6F9FE] px-6 text-center">
        <div className="w-full max-w-md rounded-[30px] border border-[#E3ECF8] bg-white p-10 shadow-[0_20px_60px_-30px_rgba(30,70,130,0.2)]">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <UserRound size={30} />
          </div>

          <p
            role="alert"
            className="text-sm font-medium text-red-600"
          >
            {error || "Profile unavailable."}
          </p>

          <button
            type="button"
            onClick={loadProfile}
            className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#286BC1] px-7 font-semibold text-white shadow-lg shadow-blue-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1955A0]"
          >
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      </main>
    );
  }

  // ========================================
  // INPUT STYLING
  // ========================================

  const inputClass = `
    mt-3 block h-[56px] w-full
    rounded-2xl
    border border-[#DFE8F6]
    bg-[#F8FAFF]
    px-5
    text-[15px] font-medium
    text-[#17365F]
    outline-none
    transition-all duration-300 ease-out
    hover:border-[#BDD3F0]
    hover:bg-white
    focus:border-[#438DE9]
    focus:bg-white
    focus:shadow-[0_0_0_4px_rgba(66,142,233,0.10),0_12px_28px_-18px_rgba(38,107,193,0.45)]
  `;

  return (
    <main className="min-h-screen overflow-x-clip bg-[#F6F9FE]">

      {/* ========================================
          HERO SECTION
      ======================================== */}

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

        {/* Decorative depth */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-28 top-[-80px] h-[430px] w-[430px] rounded-full border border-white/10 shadow-[0_0_0_55px_rgba(255,255,255,0.025),0_0_0_110px_rgba(255,255,255,0.015)] sm:right-[4%]"
        />

        <div className="profile-enter relative mx-auto max-w-7xl px-6 lg:px-12">

          {/* Eyebrow */}

          <div className="mb-5 flex items-center gap-3">
            <span className="h-[2px] w-8 rounded-full bg-[#8BC4FF]" />

            <span className="text-xs font-bold uppercase tracking-[0.24em] text-[#A6CFFF]">
              My Account
            </span>
          </div>

          {/* Heading */}

          <h1 className="text-4xl font-extrabold tracking-[-0.035em] sm:text-5xl lg:text-6xl">
            My Profile
          </h1>

          <p className="mt-5 max-w-xl text-[15px] leading-7 text-[#BED6F4] sm:text-base">
            Manage your personal information.
          </p>

        </div>
      </section>

      {/* ========================================
          MAIN LAYOUT
      ======================================== */}

      <div className="relative z-10 mx-auto -mt-16 grid max-w-7xl items-start gap-7 px-6 pb-24 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-12">

        {/* ACCOUNT SIDEBAR */}

        <AccountNavigation role={user.role} />

        {/* CONTENT */}

        <div className="min-w-0 space-y-7">

          {/* ========================================
              PROFILE SUMMARY CARD
          ======================================== */}

          <section
            className="
              profile-enter
              group relative overflow-hidden
              rounded-[30px]
              border border-white
              bg-white
              p-6 sm:p-8
              shadow-[0_22px_60px_-32px_rgba(20,52,92,0.42)]
              transition-all duration-500
              hover:shadow-[0_30px_75px_-32px_rgba(20,52,92,0.48)]
            "
          >

            {/* Soft background glow */}

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-[#E9F3FF]/70 blur-3xl transition-all duration-500 group-hover:bg-[#DCEBFF]"
            />

            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">

              {/* Avatar */}

              <div
                className="
                  relative flex
                  h-[88px] w-[88px]
                  shrink-0 items-center justify-center
                  rounded-[26px]
                  bg-gradient-to-br
                  from-[#2369C5]
                  via-[#468FE8]
                  to-[#9BC8FF]
                  text-white
                  ring-[5px] ring-[#EAF3FF]
                  shadow-[0_15px_28px_-11px_rgba(40,108,193,0.6)]
                  transition-transform duration-500 ease-out
                  motion-safe:group-hover:-rotate-3
                  motion-safe:group-hover:scale-[1.04]
                "
              >
                <UserRound
                  size={39}
                  strokeWidth={1.6}
                />

                {/* Avatar reflection */}

                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-[26px] bg-gradient-to-tr from-transparent via-transparent to-white/20"
                />
              </div>

              {/* Account details */}

              <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-5">

                <div className="min-w-0">

                  <h2 className="break-words text-2xl font-extrabold tracking-tight text-[#102C57] sm:text-[28px]">
                    {user.name}
                  </h2>

                  <p className="mt-2 break-all text-sm font-medium text-[#7488A5]">
                    {user.email}
                  </p>

                </div>

                {/* Role */}

                <span
                  className="
                    inline-flex items-center
                    rounded-full
                    border border-[#D5E7FF]
                    bg-[#EDF5FF]
                    px-4 py-2
                    text-xs font-bold capitalize
                    tracking-wide text-[#286BC1]
                    shadow-[0_4px_12px_-8px_rgba(40,107,193,0.3)]
                  "
                >
                  {user.role || "Member"}
                </span>

              </div>
            </div>

          </section>

          {/* ========================================
              PERSONAL INFORMATION CARD
          ======================================== */}

          <section
            className="
              profile-enter-delayed
              relative overflow-hidden
              rounded-[30px]
              border border-[#E3EBF7]
              bg-white
              p-6 sm:p-9
              shadow-[0_20px_60px_-35px_rgba(20,52,92,0.24)]
              transition-shadow duration-500
              hover:shadow-[0_25px_70px_-35px_rgba(20,52,92,0.34)]
            "
          >

            {/* Top accent */}

            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#2F77D2] via-[#79B5FF] to-transparent"
            />

            {/* Section heading */}

            <div className="mb-8 border-b border-[#EDF1F7] pb-7">

              <h2 className="text-2xl font-extrabold tracking-tight text-[#102C57] sm:text-[28px]">
                Personal Information
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#7488A5]">
                Update your name and email address.
              </p>

            </div>

            {/* ========================================
                ERROR MESSAGE
            ======================================== */}

            {error && (
              <div
                role="alert"
                className="mb-7 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-700"
              >
                {error}
              </div>
            )}

            {/* ========================================
                SUCCESS MESSAGE
            ======================================== */}

            {notice && (
              <div
                role="status"
                className="mb-7 flex items-center gap-3 rounded-2xl border border-green-100 bg-green-50 px-5 py-4 text-sm font-medium text-green-700"
              >
                <CheckCircle2
                  size={20}
                  className="shrink-0"
                />

                {notice}
              </div>
            )}

            {/* ========================================
                PROFILE FORM
            ======================================== */}

            <form
              onSubmit={handleSubmit}
              className="space-y-8"
            >

              {/* INPUT GRID */}

              <div className="grid gap-7 xl:grid-cols-2">

                {/* FULL NAME */}

                <label className="group/field block">

                  <span className="flex items-center gap-2.5 text-sm font-bold text-[#17365F]">

                    <UserRound
                      size={18}
                      strokeWidth={1.9}
                      className="text-[#7A9CC8] transition-colors duration-300 group-focus-within/field:text-[#3478D4]"
                    />

                    Full Name

                  </span>

                  <input
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />

                </label>

                {/* EMAIL ADDRESS */}

                <label className="group/field block">

                  <span className="flex items-center gap-2.5 text-sm font-bold text-[#17365F]">

                    <Mail
                      size={18}
                      strokeWidth={1.9}
                      className="text-[#7A9CC8] transition-colors duration-300 group-focus-within/field:text-[#3478D4]"
                    />

                    Email Address

                  </span>

                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />

                </label>

              </div>

              {/* ========================================
                  FORM ACTIONS
              ======================================== */}

              <div className="flex flex-col-reverse gap-4 border-t border-[#EDF1F7] pt-7 sm:flex-row sm:items-center sm:justify-between">

                {/* RESET BUTTON */}

                <button
                  type="button"
                  onClick={loadProfile}
                  disabled={saving}
                  className="
                    group/reset
                    inline-flex min-h-[52px]
                    items-center justify-center
                    gap-2.5
                    rounded-2xl
                    border border-[#E0EAF6]
                    bg-white
                    px-5
                    text-sm font-bold
                    text-[#607A9B]
                    transition-all duration-300
                    hover:border-[#B8D5F8]
                    hover:bg-[#F5F9FF]
                    hover:text-[#286BC1]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >

                  <RefreshCw
                    size={17}
                    className="transition-transform duration-500 motion-safe:group-hover/reset:-rotate-90"
                  />

                  Reset Changes

                </button>

                {/* SAVE BUTTON */}

                <button
                  type="submit"
                  disabled={saving}
                  className="
                    group/save
                    relative inline-flex
                    min-h-[52px]
                    items-center justify-center
                    gap-3
                    overflow-hidden
                    rounded-2xl
                    bg-gradient-to-r
                    from-[#286BC1]
                    to-[#4A98EE]
                    px-8
                    text-sm font-bold
                    text-white
                    shadow-[0_12px_25px_-10px_rgba(40,107,193,0.55)]
                    transition-all duration-300 ease-out
                    hover:shadow-[0_18px_32px_-10px_rgba(40,107,193,0.65)]
                    motion-safe:hover:-translate-y-[2px]
                    motion-safe:active:scale-[0.98]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    disabled:hover:translate-y-0
                  "
                >

                  {/* Button glow */}

                  <span
                    aria-hidden="true"
                    className="
                      pointer-events-none absolute inset-0
                      bg-gradient-to-r
                      from-white/0
                      via-white/20
                      to-white/0
                      opacity-0
                      transition-opacity duration-300
                      group-hover/save:opacity-100
                    "
                  />

                  {/* Icon */}

                  <span className="relative z-10">

                    {saving ? (
                      <LoaderCircle
                        size={19}
                        className="animate-spin"
                      />
                    ) : (
                      <Save
                        size={19}
                        className="transition-transform duration-300 motion-safe:group-hover/save:scale-110"
                      />
                    )}

                  </span>

                  {/* Text */}

                  <span className="relative z-10">
                    {saving ? "Saving..." : "Save Changes"}
                  </span>

                </button>

              </div>

            </form>

          </section>

        </div>
      </div>

      {/* ========================================
          ENTRANCE ANIMATIONS
      ======================================== */}

      <style jsx>{`
        @keyframes profileFadeUp {
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
          .profile-enter {
            animation: profileFadeUp 0.65s
              cubic-bezier(0.22, 1, 0.36, 1) both;
          }

          .profile-enter-delayed {
            animation: profileFadeUp 0.75s
              cubic-bezier(0.22, 1, 0.36, 1) 0.12s both;
          }
        }
      `}</style>

    </main>
  );
}