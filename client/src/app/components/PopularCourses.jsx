"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  RefreshCw,
  AlertCircle,
  GraduationCap,
} from "lucide-react";

import { coursesApi } from "@/lib/courses";
import CourseCard from "./CourseCard";

export default function PopularCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= ORIGINAL DATA LOGIC =================

  async function loadCourses() {
    try {
      setLoading(true);
      setError("");

      const data = await coursesApi.getAll();

      if (!Array.isArray(data)) {
        throw new Error("Invalid courses response");
      }

      setCourses(data.slice(0, 3));
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setError("We couldn't load the courses right now.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCourses();
  }, []);

  return (
    <section
      id="popular-courses"
      className="bg-white px-6 py-20 sm:py-24 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">

        {/* ================= SECTION HEADER ================= */}

        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">

          {/* HEADING */}
          <div className="max-w-2xl">

            {/* EYEBROW */}
            <div className="mb-4 flex items-center gap-3">
              <span className="h-[2px] w-8 rounded-full bg-[#2563B8]" />

              <span className="text-sm font-bold text-[#2563B8]">
                Featured Courses
              </span>
            </div>

            {/* TITLE */}
            <h2 className="text-4xl font-extrabold leading-tight tracking-[-0.04em] text-[#0F2A4A] sm:text-5xl">
              Popular{" "}
              <span className="text-[#2563B8]">
                Courses
              </span>
            </h2>

            {/* DESCRIPTION */}
            <p className="mt-4 max-w-[530px] text-[15px] leading-8 text-[#55657C] sm:text-base">
              Explore courses designed to help you build
              practical skills and move forward with confidence.
            </p>
          </div>

          {/* VIEW ALL BUTTON */}
          <Link
            href="/courses"
            className="group/view inline-flex min-h-[50px] w-fit shrink-0 items-center justify-center gap-2.5 rounded-xl border border-[#D3E2F4] bg-white px-6 text-sm font-bold text-[#2563B8] transition-colors duration-200 hover:border-[#2563B8] hover:bg-[#F3F8FE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563B8] focus-visible:ring-offset-2"
          >
            View All Courses

            <ArrowRight
              size={18}
              className="transition-transform duration-200 motion-safe:group-hover/view:translate-x-1"
            />
          </Link>
        </div>

        {/* ================= LOADING ================= */}

        {loading ? (
          <div
            role="status"
            aria-label="Loading featured courses"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="relative h-[350px] animate-pulse overflow-hidden rounded-3xl bg-[#E6EEF8] sm:h-[370px]"
              >
                {/* SKELETON CATEGORY */}
                <div className="absolute left-5 top-5 h-8 w-28 rounded-full bg-white/70" />

                {/* SKELETON ARROW */}
                <div className="absolute right-5 top-5 h-10 w-10 rounded-xl bg-white/60" />

                {/* SKELETON DETAILS */}
                <div className="absolute inset-x-0 bottom-0 space-y-4 p-6">
                  <div className="h-6 w-[80%] rounded-lg bg-white/70" />
                  <div className="h-6 w-[55%] rounded-lg bg-white/55" />
                  <div className="mt-6 h-px w-full bg-white/70" />

                  <div className="flex justify-between">
                    <div className="h-4 w-20 rounded-md bg-white/60" />
                    <div className="h-7 w-20 rounded-full bg-white/70" />
                  </div>
                </div>
              </div>
            ))}
          </div>

        ) : error ? (

          /* ================= ERROR STATE ================= */

          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-red-100 bg-[#FFFAFA] px-6 py-12 text-center">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <AlertCircle size={28} strokeWidth={1.7} />
            </div>

            <h3 className="mt-5 text-xl font-extrabold text-[#0F2A4A]">
              Unable to Load Courses
            </h3>

            <p role="alert" className="mt-2 max-w-md text-sm leading-7 text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={loadCourses}
              className="group/retry mt-6 inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-xl border border-[#D3E2F4] bg-white px-6 text-sm font-bold text-[#2563B8] transition-colors duration-200 hover:border-[#2563B8] hover:bg-[#F3F8FE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563B8] focus-visible:ring-offset-2"
            >
              <RefreshCw
                size={17}
                className="transition-transform duration-500 motion-safe:group-hover/retry:rotate-90"
              />
              Try Again
            </button>
          </div>

        ) : courses.length === 0 ? (

          /* ================= EMPTY STATE ================= */

          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed border-[#C9DDF5] bg-[#F9FBFE] px-6 py-12 text-center">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF2FC] text-[#2563B8]">
              <BookOpen size={32} strokeWidth={1.5} />
            </div>

            <h3 className="mt-5 text-2xl font-extrabold text-[#0F2A4A]">
              Exciting courses are coming soon
            </h3>

            <p className="mt-2 max-w-md text-sm leading-7 text-[#64768F]">
              We're preparing our learning catalog.
              Check back soon for new opportunities.
            </p>
          </div>

        ) : (

          /* ================= COURSE GRID ================= */

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <div
                key={course.courseid}
                className="min-w-0"
              >
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        )}

        {/* ================= BOTTOM LINK ================= */}

        {!loading && !error && courses.length > 0 && (
          <div className="mt-10 flex justify-center lg:hidden">
            <Link
              href="/courses"
              className="group/bottom inline-flex items-center gap-2 text-sm font-bold text-[#2563B8] transition-colors hover:text-[#1D4F94]"
            >
              Explore More Courses

              <ArrowRight
                size={17}
                className="transition-transform duration-200 motion-safe:group-hover/bottom:translate-x-1"
              />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}