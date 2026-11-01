"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  LoaderCircle,
  RefreshCw,
  Search,
  ArrowRight,
  AlertCircle,
  GraduationCap,
} from "lucide-react";

import { getStudentData } from "@/lib/student";
import EnrolledCourseCard from "./EnrolledCourseCard";

const tabs = [
  { id: "all", label: "All Courses" },
  { id: "active", label: "Active" },
  { id: "pending", label: "Pending" },
  { id: "completed", label: "Completed" },
];

export default function MyLearning() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");

  // ================= ORIGINAL DATA LOGIC =================

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getStudentData();

      setUser(data.user);
      setCourses(data.enrollments);
    } catch (err) {
      if (
        err.message === "AUTH_REQUIRED" ||
        err.response?.status === 401
      ) {
        router.replace("/login?redirect=/my-learning");
        return;
      }

      if (err.message === "STUDENT_ONLY") {
        setError("This page is available to students only.");
      } else {
        setError("Unable to load your courses. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = useMemo(() => {
    return courses.filter((course) => {
      const matchesTab =
        tab === "all" || course.status === tab;

      const matchesSearch = course.title
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [courses, tab, search]);

  return (
    <main className="min-h-screen overflow-x-clip bg-[#F6F9FD]">

      {/* ================= HERO ================= */}

      <section className="bg-[#12386F] px-6 pb-32 pt-16 text-white sm:pb-36 sm:pt-20 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-bold text-[#9CCBFF]">
            My Learning Space
          </p>

          <h1 className="text-4xl font-extrabold leading-tight tracking-[-0.04em] sm:text-5xl lg:text-[54px]">
            My <span className="text-[#9CCBFF]">Learning</span>
          </h1>

          <p className="mt-5 max-w-xl text-[15px] leading-8 text-[#CDDEEF] sm:text-base">
            View your enrolled courses and pick up where
            you left off.
          </p>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}

      <div className="relative z-10 mx-auto -mt-16 max-w-7xl px-6 pb-24 lg:px-12">

        {loading ? (

          /* ================= LOADING STATE ================= */

          <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-3xl border border-[#DFE8F3] bg-white p-10 shadow-[0_16px_40px_-28px_rgba(15,42,74,0.3)]">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF2FC] text-[#2563B8]">
              <LoaderCircle
                size={26}
                className="animate-spin"
              />
            </div>

            <p className="text-sm font-semibold text-[#64768F]">
              Loading your courses...
            </p>
          </div>

        ) : error ? (

          /* ================= ERROR STATE ================= */

          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-red-100 bg-white px-6 py-12 text-center shadow-[0_16px_40px_-28px_rgba(15,42,74,0.3)]">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <AlertCircle size={28} strokeWidth={1.7} />
            </div>

            <h2 className="mt-5 text-xl font-extrabold text-[#0F2A4A]">
              Unable to Load Courses
            </h2>

            <p
              role="alert"
              className="mt-2 max-w-md text-sm leading-7 text-[#64768F]"
            >
              {error}
            </p>

            <button
              type="button"
              onClick={loadData}
              className="group/retry mt-6 inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-xl bg-[#2563B8] px-6 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#1D4F94] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563B8] focus-visible:ring-offset-2"
            >
              <RefreshCw
                size={17}
                className="transition-transform duration-500 motion-safe:group-hover/retry:rotate-90"
              />
              Try Again
            </button>
          </div>

        ) : (

          <>
            {/* ================= FILTER TOOLBAR ================= */}

            <div className="rounded-3xl border border-[#DFE8F3] bg-white p-4 shadow-[0_16px_40px_-28px_rgba(15,42,74,0.3)] sm:p-5">
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

                {/* ================= TABS ================= */}

                <div
                  role="group"
                  aria-label="Filter courses by enrollment status"
                  className="flex flex-wrap gap-2"
                >
                  {tabs.map((item) => {
                    const active = tab === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setTab(item.id)}
                        aria-pressed={active}
                        className={`
                          inline-flex min-h-[44px]
                          items-center justify-center
                          rounded-xl px-5
                          text-sm font-bold
                          transition-colors duration-200
                          focus-visible:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-[#2563B8]
                          focus-visible:ring-offset-2
                          ${
                            active
                              ? "bg-[#2563B8] text-white"
                              : "bg-[#F3F7FC] text-[#55657C] hover:bg-[#E8F0FA] hover:text-[#2563B8]"
                          }
                        `}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>

                {/* ================= SEARCH ================= */}

                <label className="group/search relative block w-full shrink-0 lg:w-72">

                  <Search
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#8498B3] transition-colors duration-200 group-focus-within/search:text-[#2563B8]"
                  />

                  <input
                    type="search"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search my courses"
                    aria-label="Search my courses"
                    className="
                      h-[48px] w-full rounded-xl
                      border border-[#DCE7F5]
                      bg-[#F9FBFE] pl-11 pr-4
                      text-sm font-medium text-[#0F2A4A]
                      outline-none
                      transition-colors duration-200
                      placeholder:text-[#9AACBF]
                      hover:border-[#B9D1EE]
                      focus:border-[#2563B8]
                      focus:bg-white
                      focus:ring-4
                      focus:ring-[#2563B8]/10
                    "
                  />
                </label>
              </div>
            </div>

            {/* ================= RESULTS HEADER ================= */}

            <div className="mb-6 mt-12 flex flex-wrap items-end justify-between gap-4">

              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-[#0F2A4A] sm:text-[30px]">
                  My Courses
                </h2>

                <p
                  aria-live="polite"
                  className="mt-2 text-sm font-medium text-[#64768F]"
                >
                  {filtered.length} courses found
                </p>
              </div>

              {/* REFRESH */}
              <button
                type="button"
                onClick={loadData}
                disabled={loading}
                className="
                  group/refresh inline-flex min-h-[44px]
                  items-center justify-center gap-2.5
                  rounded-xl border border-[#D3E2F4]
                  bg-white px-5
                  text-sm font-bold text-[#2563B8]
                  transition-colors duration-200
                  hover:border-[#2563B8]
                  hover:bg-[#F3F8FE]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#2563B8]
                  focus-visible:ring-offset-2
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <RefreshCw
                  size={17}
                  className="transition-transform duration-500 motion-safe:group-hover/refresh:rotate-90"
                />

                Refresh
              </button>
            </div>

            {/* ================= COURSE GRID ================= */}

            {filtered.length ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((course) => (
                  <div
                    key={
                      course.enrollmentId ?? course.courseId
                    }
                    className="min-w-0"
                  >
                    <EnrolledCourseCard course={course} />
                  </div>
                ))}
              </div>
            ) : (

              /* ================= EMPTY STATE ================= */

              <div className="flex min-h-[340px] flex-col items-center justify-center rounded-3xl border border-dashed border-[#C3D8F2] bg-white p-8 text-center">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF2FC] text-[#2563B8]">
                  <BookOpen
                    size={32}
                    strokeWidth={1.5}
                  />
                </div>

                <h2 className="mt-6 text-2xl font-extrabold text-[#0F2A4A]">
                  No courses found
                </h2>

                <p className="mt-2 max-w-md text-sm leading-7 text-[#64768F]">
                  Explore available courses or try another filter.
                </p>

                <Link
                  href="/courses"
                  className="group/explore mt-6 inline-flex min-h-[50px] items-center justify-center gap-2.5 rounded-xl bg-[#2563B8] px-7 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#1D4F94] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563B8] focus-visible:ring-offset-2"
                >
                  <GraduationCap size={19} />

                  Explore Courses

                  <ArrowRight
                    size={18}
                    className="transition-transform duration-200 motion-safe:group-hover/explore:translate-x-1"
                  />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}