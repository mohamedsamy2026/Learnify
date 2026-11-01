"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  BookOpen,
  GraduationCap,
  Layers3,
  LoaderCircle,
} from "lucide-react";

import { coursesApi } from "@/lib/courses";
import EnrollmentCard from "./EnrollmentCard";
import ReviewsSection from "../reviews/ReviewsSection";

export default function CourseDetails({ courseId }) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadCourse() {
      try {
        setLoading(true);
        setError("");
        setCourse(null);

        const data = await coursesApi.getById(courseId);

        if (!active) return;

        setCourse(data);
      } catch (err) {
        if (!active) return;

        setError(
          err.response?.status === 404
            ? "Course not found."
            : "Unable to load this course."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadCourse();

    return () => {
      active = false;
    };
  }, [courseId]);

  // ================= LOADING =================

  if (loading) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center bg-[#F6F9FD]">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-[#DFE8F3] bg-white px-12 py-10 shadow-[0_16px_40px_-28px_rgba(15,42,74,0.3)]">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF2FC] text-[#2563B8]">
            <LoaderCircle
              size={26}
              className="animate-spin"
            />
          </div>

          <p className="text-sm font-semibold text-[#64768F]">
            Loading course...
          </p>
        </div>
      </main>
    );
  }

  // ================= ERROR =================

  if (error || !course) {
    return (
      <main className="flex min-h-[65vh] flex-col items-center justify-center bg-[#F6F9FD] px-6 text-center">
        <div className="w-full max-w-md rounded-3xl border border-[#DFE8F3] bg-white p-10 shadow-[0_16px_40px_-28px_rgba(15,42,74,0.3)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF2FC] text-[#2563B8]">
            <BookOpen size={32} strokeWidth={1.6} />
          </div>

          <h1 className="mt-6 text-3xl font-extrabold text-[#0F2A4A]">
            {error || "Course unavailable"}
          </h1>

          <Link
            href="/courses"
            className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#2563B8] px-6 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#1D4F94] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563B8] focus-visible:ring-offset-2"
          >
            <ArrowLeft size={18} />
            Back to Courses
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-clip bg-[#F6F9FD]">

      {/* ================= COURSE HERO ================= */}

      <section className="bg-[#EAF2FC] px-6 pb-20 pt-14 lg:px-12 lg:pb-24 lg:pt-16">
        <div className="mx-auto max-w-7xl">

          {/* Back Link */}
          <Link
            href="/courses"
            className="group/back inline-flex items-center gap-2 rounded-full border border-[#D3E2F4] bg-white px-5 py-2.5 text-sm font-bold text-[#2563B8] transition-colors duration-200 hover:border-[#2563B8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563B8] focus-visible:ring-offset-2"
          >
            <ArrowLeft
              size={17}
              className="transition-transform duration-200 motion-safe:group-hover/back:-translate-x-1"
            />

            All Courses
          </Link>

          {/* Category and Level */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {course.category && (
              <span className="inline-flex items-center rounded-full bg-white px-4 py-1.5 text-xs font-bold text-[#2563B8]">
                {course.category}
              </span>
            )}

            {course.level && (
              <span className="inline-flex items-center rounded-full bg-[#D9E8F8] px-4 py-1.5 text-xs font-bold capitalize text-[#2B5A91]">
                {course.level}
              </span>
            )}
          </div>

          {/* Course Name */}
          <h1 className="mt-6 max-w-4xl text-4xl font-extrabold leading-[1.12] tracking-[-0.04em] text-[#0F2A4A] sm:text-5xl lg:text-[58px]">
            {course.coursename}
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-2xl text-[16px] leading-8 text-[#55657C] sm:text-lg">
            {course.description ||
              "Explore this course and develop your knowledge at your own pace."}
          </p>

        </div>
      </section>

      {/* ================= COURSE CONTENT ================= */}

      <section className="mx-auto grid max-w-7xl items-start gap-8 px-6 py-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10 lg:px-12 lg:py-14">

        {/* LEFT CONTENT */}
        <div className="min-w-0 space-y-8">

          {/* ================= THUMBNAIL ================= */}

          <div className="group/thumbnail overflow-hidden rounded-3xl border border-[#DFE8F3] bg-white p-2 shadow-[0_16px_40px_-28px_rgba(15,42,74,0.3)]">

            <div className="relative aspect-video overflow-hidden rounded-[20px] bg-gradient-to-br from-[#6FB3F5] to-[#12386F]">

              {course.thumbnail_url ? (
                <img
                  src={course.thumbnail_url}
                  alt={`${course.coursename} course cover`}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover/thumbnail:scale-[1.03]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <GraduationCap
                    size={90}
                    strokeWidth={1.2}
                    className="text-white/85"
                  />
                </div>
              )}

            </div>
          </div>

          {/* ================= ABOUT COURSE ================= */}

          <section className="rounded-3xl border border-[#DFE8F3] bg-white p-7 shadow-[0_16px_40px_-30px_rgba(15,42,74,0.3)] sm:p-9">

            <h2 className="text-2xl font-extrabold tracking-tight text-[#0F2A4A] sm:text-[28px]">
              About This Course
            </h2>

            <p className="mt-5 max-w-3xl whitespace-pre-line text-[15px] leading-8 text-[#55657C] sm:text-base">
              {course.description ||
                "A detailed description has not been added yet."}
            </p>

          </section>

          {/* ================= COURSE OVERVIEW ================= */}

          <section className="rounded-3xl border border-[#DFE8F3] bg-white p-7 shadow-[0_16px_40px_-30px_rgba(15,42,74,0.3)] sm:p-9">

            <h2 className="text-2xl font-extrabold tracking-tight text-[#0F2A4A] sm:text-[28px]">
              Course Overview
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">

              {/* Category */}
              <div className="flex items-center gap-4 rounded-2xl bg-[#F3F8FE] p-5">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#2563B8]">
                  <Layers3 size={24} strokeWidth={1.8} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium text-[#64768F]">
                    Category
                  </p>

                  <p className="mt-1 break-words font-bold text-[#0F2A4A]">
                    {course.category || "General"}
                  </p>
                </div>
              </div>

              {/* Skill Level */}
              <div className="flex items-center gap-4 rounded-2xl bg-[#F3F8FE] p-5">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#2563B8]">
                  <GraduationCap size={24} strokeWidth={1.8} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium text-[#64768F]">
                    Skill Level
                  </p>

                  <p className="mt-1 break-words font-bold capitalize text-[#0F2A4A]">
                    {course.level || "Not specified"}
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* ================= REVIEWS ================= */}

          <ReviewsSection courseId={course.courseid} />

        </div>

        {/* ================= ENROLLMENT SIDEBAR ================= */}

        <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <EnrollmentCard course={course} />
        </div>

      </section>

    </main>
  );
}