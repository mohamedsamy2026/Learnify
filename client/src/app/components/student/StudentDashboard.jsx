"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
  LoaderCircle,
  RefreshCw,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

import { getStudentData } from "@/lib/student";
import EnrolledCourseCard from "./EnrolledCourseCard";

export default function StudentDashboard() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Keep the original authentication, API and data-loading logic.
  const loadDashboard = useCallback(async () => {
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
        router.replace("/login?redirect=/dashboard");
        return;
      }

      setError(
        err.message === "STUDENT_ONLY"
          ? "This dashboard is available to students only."
          : "Unable to load your dashboard. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const stats = useMemo(() => {
    return {
      total: courses.length,
      active: courses.filter((course) => course.status === "active").length,
      pending: courses.filter((course) => course.status === "pending").length,
      completed: courses.filter((course) => course.status === "completed").length,
    };
  }, [courses]);

  const progressCourses = useMemo(() => {
    return courses.filter(
      (course) =>
        ["active", "completed"].includes(course.status) &&
        !course.progressError &&
        course.progressPercentage !== null &&
        course.progressPercentage !== undefined &&
        Number.isFinite(Number(course.progressPercentage))
    );
  }, [courses]);

  const averageProgress = useMemo(() => {
    if (progressCourses.length === 0) return null;

    const totalProgress = progressCourses.reduce(
      (sum, course) => sum + Number(course.progressPercentage),
      0
    );

    return Math.min(
      100,
      Math.max(0, Math.round(totalProgress / progressCourses.length))
    );
  }, [progressCourses]);

  const recentCourses = useMemo(() => {
    return courses
      .filter(
        (course) =>
          course.status === "active" || course.status === "completed"
      )
      .slice(0, 3);
  }, [courses]);

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-canvas px-6">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-line bg-surface px-12 py-10 shadow-[0_16px_40px_-28px_rgba(15,42,74,0.3)]">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-tint text-brand">
            <LoaderCircle size={26} className="animate-spin" />
          </span>
          <span className="text-sm font-semibold text-muted">
            Loading your dashboard...
          </span>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-canvas px-6 py-12">
        <div className="w-full max-w-md rounded-3xl border border-line bg-surface p-8 text-center shadow-[0_16px_40px_-28px_rgba(15,42,74,0.3)] sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <AlertCircle size={32} strokeWidth={1.6} />
          </div>
          <h1 className="mt-6 text-2xl font-extrabold text-ink">
            Dashboard Unavailable
          </h1>
          <p role="alert" className="mt-3 text-sm leading-7 text-muted">
            {error}
          </p>
          <button
            type="button"
            onClick={loadDashboard}
            className="group mt-6 inline-flex min-h-[50px] items-center justify-center gap-2.5 rounded-xl bg-brand px-7 text-sm font-bold text-white transition-colors duration-200 hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            <RefreshCw size={18} className="transition-transform duration-500 motion-safe:group-hover:rotate-90" />
            Try Again
          </button>
        </div>
      </main>
    );
  }

  const statCards = [
    { icon: BookOpen, label: "Enrolled Courses", value: stats.total },
    { icon: GraduationCap, label: "Active Courses", value: stats.active },
    { icon: Clock3, label: "Pending Courses", value: stats.pending },
    { icon: CheckCircle2, label: "Completed Courses", value: stats.completed },
  ];

  return (
    <main className="min-h-screen overflow-x-clip bg-canvas">
      {/* HERO */}
      <section className="bg-ink-soft pb-32 pt-16 text-white sm:pb-36 sm:pt-20">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-6 md:flex-row md:items-center lg:px-12">
          <div className="min-w-0">
            <p className="mb-4 text-sm font-bold text-hxt-9ccbff">
              Student Dashboard
            </p>
            <h1 className="max-w-3xl break-words text-4xl font-extrabold leading-[1.15] tracking-[-0.04em] sm:text-5xl lg:text-[52px]">
              Welcome back, <span className="text-hxt-9ccbff">{user?.name || "Learner"}!</span>
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-8 text-hxt-cddeef sm:text-base">
              Your learning journey continues here. Explore your courses and keep building your skills.
            </p>
          </div>

          <Link
            href="/courses"
            className="group/explore inline-flex min-h-[52px] w-fit shrink-0 items-center justify-center gap-2.5 rounded-xl bg-white px-7 text-sm font-extrabold text-ink-soft transition-colors duration-200 hover:bg-[#EAF2FC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink-soft"
          >
            Explore Courses
            <ArrowRight size={18} className="transition-transform duration-200 motion-safe:group-hover/explore:translate-x-1" />
          </Link>
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-16 max-w-7xl px-6 pb-24 lg:px-12">
        {/* STATS */}
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {statCards.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="rounded-3xl border border-line bg-surface p-6 shadow-[0_16px_40px_-28px_rgba(15,42,74,0.3)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-tint text-brand">
                <Icon size={24} strokeWidth={1.8} />
              </div>
              <p className="mt-6 text-[36px] font-extrabold leading-none tracking-[-0.04em] text-ink">
                {value}
              </p>
              <p className="mt-2 text-sm font-semibold text-muted">{label}</p>
            </div>
          ))}
        </div>

        {/* OVERALL PROGRESS */}
        <section className="mt-6 rounded-3xl border border-line bg-surface p-6 shadow-[0_16px_40px_-28px_rgba(15,42,74,0.3)] sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-tint text-brand">
                <TrendingUp size={24} strokeWidth={1.8} />
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
                  Overall Learning Progress
                </h2>
                <p className="mt-2 max-w-lg text-sm leading-7 text-muted">
                  Your average completion percentage across accessible courses with available progress data.
                </p>
              </div>
            </div>
            <div className="shrink-0 text-left sm:text-right">
              <span className="text-[40px] font-extrabold leading-none tracking-[-0.04em] text-brand">
                {averageProgress === null ? "—" : `${averageProgress}%`}
              </span>
              <p className="mt-2 text-xs font-medium text-subtle">Average Progress</p>
            </div>
          </div>

          <div
            role="progressbar"
            aria-label="Overall learning progress"
            aria-valuenow={averageProgress ?? 0}
            aria-valuemin={0}
            aria-valuemax={100}
            className="mt-7 h-2.5 overflow-hidden rounded-full bg-hxb-dce8f6"
          >
            <div
              className="h-full rounded-full bg-brand transition-[width] duration-700 ease-out"
              style={{ width: `${averageProgress ?? 0}%` }}
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs leading-6 text-subtle">
              Based on {progressCourses.length} {progressCourses.length === 1 ? "course" : "courses"} with available progress data
            </p>
            <Link href="/my-learning" className="group/link inline-flex items-center gap-2 text-sm font-bold text-brand transition-colors hover:text-brand-dark">
              My Learning
              <ArrowRight size={16} className="transition-transform duration-200 motion-safe:group-hover/link:translate-x-1" />
            </Link>
          </div>

          {averageProgress === null && (
            <p className="mt-4 text-sm text-subtle">
              Progress will appear here when you have an accessible course.
            </p>
          )}
        </section>

        {/* CONTINUE LEARNING */}
        <div className="mb-7 mt-14 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-[34px]">
              Continue Learning
            </h2>
            <p className="mt-2 text-sm leading-7 text-muted">
              Jump back into your available courses.
            </p>
          </div>
          <Link href="/my-learning" className="group/all inline-flex min-h-[44px] items-center gap-2.5 rounded-xl border border-line-strong bg-surface px-5 text-sm font-bold text-brand transition-colors duration-200 hover:border-brand hover:bg-tint-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">
            View My Learning
            <ArrowRight size={17} className="transition-transform duration-200 motion-safe:group-hover/all:translate-x-1" />
          </Link>
        </div>

        {recentCourses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {recentCourses.map((course) => (
              <div
                key={course.enrollmentId ?? course.courseId}
                className="min-w-0"
              >
                <EnrolledCourseCard course={course} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed border-hxl-c3d8f2 bg-surface p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-tint text-brand">
              <BookOpen size={32} strokeWidth={1.5} />
            </div>
            <h3 className="mt-6 text-2xl font-extrabold text-ink">
              Your learning journey starts here
            </h3>
            <p className="mt-2 max-w-md text-sm leading-7 text-muted">
              You do not have any active courses yet. Explore the course catalog to get started.
            </p>
            <Link href="/courses" className="group/find mt-6 inline-flex min-h-[50px] items-center justify-center gap-2.5 rounded-xl bg-brand px-7 text-sm font-bold text-white transition-colors duration-200 hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">
              Find a Course
              <ArrowRight size={18} className="transition-transform duration-200 motion-safe:group-hover/find:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}