"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  BookOpen,
  CircleDollarSign,
  GraduationCap,
  Layers,
  LoaderCircle,
  Plus,
  RefreshCw,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { authApi, getToken } from "@/lib/auth";
import { instructorApi } from "@/lib/instructor";
import CourseForm from "./CourseForm";
import InstructorCourseCard from "./InstructorCourseCard";

function getErrorMessage(error) {
  if (error.response?.status === 401) {
    return "Your session has expired. Please log in again.";
  }

  if (error.response?.status === 403) {
    return "You do not have permission to perform this action.";
  }

  return (
    error.response?.data?.message ||
    error.message ||
    "Something went wrong. Please try again."
  );
}

export default function InstructorDashboard() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // ================= ORIGINAL DASHBOARD LOGIC =================

  const loadDashboard = useCallback(async () => {
    const token = getToken();

    if (!token) {
      router.replace("/login?redirect=/instructor");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const profileResponse = await authApi.getMe(token);
      const profile = profileResponse.user ?? profileResponse;

      const role = profile.role;
      const userId = profile.userid ?? profile.userId;

      if (role !== "instructor") {
        setError("This dashboard is only available to instructors.");
        return;
      }

      if (!userId) {
        throw new Error("Your profile is missing a user ID.");
      }

      const allCourses = await instructorApi.getCourses();

      setUser(profile);
      setCourses(
        allCourses.filter(
          (course) =>
            String(course.instructorid) === String(userId)
        )
      );
    } catch (err) {
      if (err.response?.status === 401) {
        router.replace("/login?redirect=/instructor");
        return;
      }

      setError(getErrorMessage(err));
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
      free: courses.filter(
        (course) => Number(course.courseprice) === 0
      ).length,
      paid: courses.filter(
        (course) => Number(course.courseprice) > 0
      ).length,
      categories: new Set(
        courses.map((course) => course.category).filter(Boolean)
      ).size,
    };
  }, [courses]);

  function openCreateForm() {
    setEditingCourse(null);
    setFormOpen(true);
    setError("");
    setNotice("");
  }

  function openEditForm(course) {
    setEditingCourse(course);
    setFormOpen(true);
    setError("");
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSave(values) {
    try {
      setSaving(true);
      setError("");
      setNotice("");

      if (editingCourse) {
        await instructorApi.updateCourse(
          editingCourse.courseid,
          values
        );

        setNotice("Course updated successfully.");
      } else {
        await instructorApi.createCourse(values);
        setNotice("Course created successfully.");
      }

      setFormOpen(false);
      setEditingCourse(null);

      await loadDashboard();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(course) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${course.coursename}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(course.courseid);
      setError("");
      setNotice("");

      await instructorApi.deleteCourse(course.courseid);

      setCourses((previous) =>
        previous.filter(
          (item) => item.courseid !== course.courseid
        )
      );

      setNotice("Course deleted successfully.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  }

  // ================= LOADING =================

  if (loading && !user) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-canvas px-6">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-line bg-surface px-12 py-10 shadow-[0_16px_40px_-28px_rgba(15,42,74,0.3)]">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-tint text-brand">
            <LoaderCircle
              size={26}
              className="animate-spin"
            />
          </div>

          <p className="text-sm font-semibold text-muted">
            Loading instructor dashboard...
          </p>
        </div>
      </main>
    );
  }

  // ================= ACCESS STATE =================

  if (!user) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center bg-canvas px-6 text-center">
        <div className="w-full max-w-md rounded-3xl border border-line bg-surface p-9 shadow-[0_16px_40px_-28px_rgba(15,42,74,0.3)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-tint text-brand">
            <GraduationCap size={32} strokeWidth={1.6} />
          </div>

          <h1 className="mt-6 text-2xl font-extrabold text-ink">
            Instructor Access
          </h1>

          <p className="mt-3 text-sm leading-7 text-muted">
            {error || "Please log in with an instructor account."}
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-brand px-7 text-sm font-bold text-white transition-colors duration-200 hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            Back to Home
          </Link>

          {error && (
            <button
              type="button"
              onClick={loadDashboard}
              className="mt-4 block w-full text-sm font-bold text-brand hover:underline"
            >
              Try Again
            </button>
          )}
        </div>
      </main>
    );
  }

  // ================= STAT CARDS DATA =================

  const statCards = [
    {
      label: "Total Courses",
      value: stats.total,
      icon: BookOpen,
    },
    {
      label: "Free Courses",
      value: stats.free,
      icon: GraduationCap,
    },
    {
      label: "Paid Courses",
      value: stats.paid,
      icon: CircleDollarSign,
    },
    {
      label: "Categories",
      value: stats.categories,
      icon: Layers,
    },
  ];

  return (
    <main className="min-h-screen overflow-x-clip bg-canvas">

      {/* ================= HERO ================= */}

      <section className="bg-ink-soft pb-32 pt-16 text-white sm:pb-36 sm:pt-20">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-6 md:flex-row md:items-center lg:px-12">

          <div className="min-w-0">
            <p className="mb-4 text-sm font-bold text-hxt-9ccbff">
              Instructor Workspace
            </p>

            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.12] tracking-[-0.04em] sm:text-5xl lg:text-[52px]">
              Welcome,{" "}
              <span className="text-hxt-9ccbff">
                {user.name || "Instructor"}!
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-[15px] leading-8 text-hxt-cddeef sm:text-base">
              Manage your courses and build learning experiences.
            </p>
          </div>

          {/* Create course button */}
          <button
            type="button"
            onClick={openCreateForm}
            className="
              group/create inline-flex
              min-h-[52px] w-fit shrink-0
              items-center justify-center gap-2.5
              rounded-xl bg-white px-7
              text-sm font-extrabold text-ink-soft
              transition-colors duration-200
              hover:bg-[#EAF2FC]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-white
              focus-visible:ring-offset-2
              focus-visible:ring-offset-ink-soft
            "
          >
            <Plus
              size={20}
              className="transition-transform duration-200 motion-safe:group-hover/create:rotate-90"
            />

            Create Course

            <ArrowUpRight size={17} className="opacity-60" />
          </button>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}

      <div className="relative z-10 mx-auto -mt-16 max-w-7xl px-6 pb-24 lg:px-12">

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-700"
          >
            <AlertCircle size={20} className="shrink-0" />
            {error}
          </div>
        )}

        {/* Success message */}
        {notice && (
          <div
            role="status"
            className="mb-6 flex items-start gap-3 rounded-xl border border-hxl-cfe2f8 bg-tint px-5 py-4 text-sm font-medium text-hxt-174a88"
          >
            <CheckCircle2 size={20} className="shrink-0" />
            {notice}
          </div>
        )}

        {/* ================= COURSE FORM ================= */}

        {formOpen && (
          <div className="mb-10">
            <CourseForm
              course={editingCourse}
              onSubmit={handleSave}
              onCancel={() => {
                setFormOpen(false);
                setEditingCourse(null);
              }}
              submitting={saving}
            />
          </div>
        )}

        {/* ================= STATISTICS ================= */}

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {statCards.map(({ label, value, icon: Icon }) => (
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

              <p className="mt-2 text-sm font-semibold text-muted">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* ================= MY COURSES HEADER ================= */}

        <div className="mb-7 mt-14 flex flex-wrap items-end justify-between gap-4">

          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-[34px]">
              My Courses
            </h2>

            <p className="mt-2 text-sm leading-7 text-muted">
              Courses you have created and manage.
            </p>
          </div>

          <button
            type="button"
            onClick={loadDashboard}
            disabled={loading}
            className="
              group/refresh inline-flex min-h-[44px]
              items-center justify-center gap-2.5
              rounded-xl border border-line-strong
              bg-surface px-5
              text-sm font-bold text-brand
              transition-colors duration-200
              hover:border-brand
              hover:bg-tint-soft
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-brand
              focus-visible:ring-offset-2
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <RefreshCw
              size={17}
              className={
                loading
                  ? "animate-spin"
                  : "transition-transform duration-500 motion-safe:group-hover/refresh:rotate-90"
              }
            />

            Refresh
          </button>
        </div>

        {/* ================= COURSE LIST ================= */}

        {courses.length === 0 ? (

          /* EMPTY STATE */
          <div className="flex min-h-[340px] flex-col items-center justify-center rounded-3xl border border-dashed border-hxl-c3d8f2 bg-surface p-8 text-center">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-tint text-brand">
              <BookOpen size={32} strokeWidth={1.5} />
            </div>

            <h3 className="mt-6 text-2xl font-extrabold text-ink">
              No courses yet
            </h3>

            <p className="mt-2 max-w-md text-sm leading-7 text-muted">
              Create your first course and start building
              your Learnify catalog.
            </p>

            <button
              type="button"
              onClick={openCreateForm}
              className="
                group/first mt-6 inline-flex min-h-12
                items-center justify-center gap-2.5
                rounded-xl bg-brand
                px-7 text-sm font-bold text-white
                transition-colors duration-200
                hover:bg-brand-dark
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-brand
                focus-visible:ring-offset-2
              "
            >
              <Plus
                size={18}
                className="transition-transform duration-200 motion-safe:group-hover/first:rotate-90"
              />

              Create First Course
            </button>
          </div>

        ) : (

          /* COURSE GRID */
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <div
                key={course.courseid}
                className="min-w-0"
              >
                <InstructorCourseCard
                  course={course}
                  onEdit={openEditForm}
                  onDelete={handleDelete}
                  deleting={deletingId === course.courseid}
                />
              </div>
            ))}
          </div>

        )}
      </div>
    </main>
  );
}