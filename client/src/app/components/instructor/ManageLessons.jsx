"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Clock3,
  GraduationCap,
  LoaderCircle,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  Video,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";

import { authApi, getToken } from "@/lib/auth";
import { coursesApi } from "@/lib/courses";
import { lessonsApi } from "@/lib/lessons";
import LessonForm from "./LessonForm";

function getMessage(error) {
  if (error.response?.status === 401) {
    return "Your session expired. Please log in again.";
  }

  if (error.response?.status === 403) {
    return "You do not have permission for this action.";
  }

  if (error.response?.status === 409) {
    return "This lesson cannot be deleted because related records exist.";
  }

  return (
    error.response?.data?.message ||
    error.message ||
    "Something went wrong. Please try again."
  );
}

function formatDuration(seconds) {
  const minutes = Math.floor(Number(seconds || 0) / 60);
  const remaining = Number(seconds || 0) % 60;

  return `${minutes}m ${String(remaining).padStart(2, "0")}s`;
}

export default function ManageLessons({ courseId }) {
  const router = useRouter();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // ================= ORIGINAL DATA LOGIC =================

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setAuthorized(false);

      const token = getToken();

      if (!token) {
        router.replace(
          `/login?redirect=${encodeURIComponent(
            `/instructor/courses/${courseId}/lessons`
          )}`
        );
        return;
      }

      const profileData = await authApi.getMe(token);
      const user = profileData.user ?? profileData;

      if (user.role !== "instructor") {
        throw new Error(
          "Only instructors can manage lessons."
        );
      }

      const courseData = await coursesApi.getById(courseId);
      const userId = user.userid ?? user.userId;

      if (
        !userId ||
        String(courseData.instructorid) !== String(userId)
      ) {
        throw new Error(
          "You can only manage lessons in your own courses."
        );
      }

      setAuthorized(true);
      setCourse(courseData);

      const lessonData = await lessonsApi.getByCourse(courseId);
      setLessons(lessonData);
    } catch (err) {
      if (err.response?.status === 401) {
        router.replace("/login");
        return;
      }

      setError(getMessage(err));
    } finally {
      setLoading(false);
    }
  }, [courseId, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ================= ORIGINAL FORM ACTIONS =================

  function openCreate() {
    setEditingLesson(null);
    setFormOpen(true);
    setError("");
    setNotice("");
  }

  function openEdit(lesson) {
    setEditingLesson(lesson);
    setFormOpen(true);
    setError("");
    setNotice("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSave(values) {
    setSaving(true);

    try {
      if (editingLesson) {
        await lessonsApi.update(
          editingLesson.lessonid,
          values
        );

        setNotice("Lesson updated successfully.");
      } else {
        await lessonsApi.create(values);
        setNotice("Lesson created successfully.");
      }

      const updated = await lessonsApi.getByCourse(courseId);

      setLessons(updated);
      setFormOpen(false);
      setEditingLesson(null);
    } catch (err) {
      throw err;
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(lesson) {
    const confirmed = window.confirm(
      `Delete "${lesson.lessonname}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(lesson.lessonid);
      setError("");
      setNotice("");

      await lessonsApi.remove(lesson.lessonid);

      setLessons((previous) =>
        previous.filter(
          (item) => item.lessonid !== lesson.lessonid
        )
      );

      setNotice("Lesson deleted successfully.");
    } catch (err) {
      setError(getMessage(err));
    } finally {
      setDeletingId(null);
    }
  }

  // ================= LOADING =================

  if (loading && !course) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#F6F9FD] px-6">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-[#DFE8F3] bg-white px-12 py-10 shadow-[0_16px_40px_-28px_rgba(15,42,74,0.3)]">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF2FC] text-[#2563B8]">
            <LoaderCircle
              size={26}
              className="animate-spin"
            />
          </div>

          <p className="text-sm font-semibold text-[#64768F]">
            Loading lessons...
          </p>
        </div>
      </main>
    );
  }

  // ================= ACCESS STATE =================

  if (!authorized || !course) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#F6F9FD] px-6 py-12">
        <div className="w-full max-w-md rounded-3xl border border-[#DFE8F3] bg-white p-9 text-center shadow-[0_16px_40px_-28px_rgba(15,42,74,0.3)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF2FC] text-[#2563B8]">
            <GraduationCap size={32} strokeWidth={1.6} />
          </div>

          <h1 className="mt-6 text-2xl font-extrabold text-[#0F2A4A]">
            Unable to Access Course
          </h1>

          <p className="mt-3 text-sm leading-7 text-[#64768F]">
            {error || "Course unavailable."}
          </p>

          <Link
            href="/instructor"
            className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#2563B8] px-7 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#1D4F94] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563B8] focus-visible:ring-offset-2"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const summaryCards = [
    {
      label: "Total Lessons",
      value: lessons.length,
      icon: BookOpen,
    },
    {
      label: "Total Duration",
      value: formatDuration(
        lessons.reduce(
          (sum, lesson) =>
            sum + Number(lesson.durationseconds || 0),
          0
        )
      ),
      icon: Clock3,
    },
    {
      label: "Lessons With Video",
      value: lessons.filter((lesson) => lesson.video_url).length,
      icon: Video,
    },
  ];

  return (
    <main className="min-h-screen overflow-x-clip bg-[#F6F9FD]">

      {/* ================= HERO ================= */}

      <section className="bg-[#12386F] pb-32 pt-14 text-white sm:pb-36 sm:pt-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">

          {/* BACK LINK */}

          <Link
            href="/instructor"
            className="group/back inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-sm font-semibold text-blue-100 transition-colors duration-200 hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ArrowLeft
              size={17}
              className="transition-transform duration-200 motion-safe:group-hover/back:-translate-x-1"
            />
            Instructor Dashboard
          </Link>

          {/* HEADER CONTENT */}

          <div className="mt-9 flex flex-col justify-between gap-8 md:flex-row md:items-end">

            <div className="min-w-0">
              <p className="mb-3 text-sm font-bold text-[#9CCBFF]">
                Course Content Management
              </p>

              <h1 className="text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl lg:text-[52px]">
                Manage Lessons
              </h1>

              <p className="mt-4 max-w-xl break-words text-[16px] leading-8 text-[#C6DCF4]">
                {course.coursename}
              </p>
            </div>

            {/* ADD LESSON */}

            <button
              type="button"
              onClick={openCreate}
              className="group/create inline-flex min-h-[52px] w-fit shrink-0 items-center justify-center gap-2.5 rounded-xl bg-white px-7 text-sm font-extrabold text-[#12386F] transition-colors duration-200 hover:bg-[#EAF3FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#12386F]"
            >
              <Plus
                size={20}
                className="transition-transform duration-200 motion-safe:group-hover/create:rotate-90"
              />

              Add Lesson

              <ArrowUpRight size={17} className="opacity-60" />
            </button>
          </div>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}

      <div className="relative z-10 mx-auto -mt-16 max-w-7xl px-6 pb-24 lg:px-12">

        {/* ERROR */}

        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-700"
          >
            <AlertCircle size={20} className="shrink-0" />
            {error}
          </div>
        )}

        {/* NOTICE */}

        {notice && (
          <div
            role="status"
            className="mb-6 flex items-start gap-3 rounded-xl border border-[#CFE2F8] bg-[#EAF4FF] px-5 py-4 text-sm font-medium text-[#174A88]"
          >
            <CheckCircle2 size={20} className="shrink-0" />
            {notice}
          </div>
        )}

        {/* ================= LESSON FORM ================= */}

        {formOpen && (
          <div className="mb-10">
            <LessonForm
              courseId={courseId}
              lesson={editingLesson}
              submitting={saving}
              onSubmit={handleSave}
              onCancel={() => {
                setFormOpen(false);
                setEditingLesson(null);
              }}
            />
          </div>
        )}

        {/* ================= SUMMARY CARDS ================= */}

        <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
          {summaryCards.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="rounded-3xl border border-[#DFE8F3] bg-white p-6 shadow-[0_16px_40px_-28px_rgba(15,42,74,0.3)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF2FC] text-[#2563B8]">
                <Icon size={24} strokeWidth={1.8} />
              </div>

              <p className="mt-6 text-[34px] font-extrabold leading-none tracking-[-0.04em] text-[#0F2A4A] sm:text-[36px]">
                {value}
              </p>

              <p className="mt-2 text-sm font-semibold text-[#64768F]">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* ================= CURRICULUM HEADER ================= */}

        <div className="mb-7 mt-14 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#0F2A4A] sm:text-[34px]">
              Course Curriculum
            </h2>

            <p className="mt-2 text-sm leading-7 text-[#64768F]">
              Lessons are displayed in their assigned order.
            </p>
          </div>

          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="group/refresh inline-flex min-h-[44px] items-center justify-center gap-2.5 rounded-xl border border-[#D3E2F4] bg-white px-5 text-sm font-bold text-[#2563B8] transition-colors duration-200 hover:border-[#2563B8] hover:bg-[#F3F8FE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563B8] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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

        {/* ================= EMPTY STATE ================= */}

        {lessons.length === 0 ? (
          <div className="flex min-h-[340px] flex-col items-center justify-center rounded-3xl border border-dashed border-[#C3D8F2] bg-white p-8 text-center">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF2FC] text-[#2563B8]">
              <BookOpen size={32} strokeWidth={1.5} />
            </div>

            <h3 className="mt-6 text-2xl font-extrabold text-[#0F2A4A]">
              No lessons yet
            </h3>

            <p className="mt-2 max-w-md text-sm leading-7 text-[#64768F]">
              Start building your course by adding the first lesson.
            </p>

            <button
              type="button"
              onClick={openCreate}
              className="group/first mt-6 inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-[#2563B8] px-7 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#1D4F94] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563B8] focus-visible:ring-offset-2"
            >
              <Plus
                size={18}
                className="transition-transform duration-200 motion-safe:group-hover/first:rotate-90"
              />
              Add First Lesson
            </button>
          </div>
        ) : (

          /* ================= LESSON LIST ================= */

          <div className="space-y-4">

            {lessons.map((lesson) => (
              <article
                key={lesson.lessonid}
                className="flex flex-col justify-between gap-5 rounded-2xl border border-[#DFE8F3] bg-white p-5 shadow-[0_10px_30px_-24px_rgba(15,42,74,0.3)] transition-shadow duration-300 hover:shadow-[0_16px_40px_-26px_rgba(15,42,74,0.4)] sm:flex-row sm:items-center sm:p-6"
              >
                {/* LEFT CONTENT */}
                <div className="flex min-w-0 items-start gap-4 sm:gap-5">

                  {/* LESSON NUMBER */}
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EAF2FC] text-lg font-extrabold text-[#2563B8]">
                    {lesson.lessonorder}
                  </span>

                  {/* DETAILS */}
                  <div className="min-w-0">

                    <h3 className="break-words text-lg font-extrabold leading-7 text-[#0F2A4A]">
                      {lesson.lessonname}
                    </h3>

                    {lesson.description && (
                      <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-[#64768F]">
                        {lesson.description}
                      </p>
                    )}

                    {/* METADATA */}
                    <div className="mt-3 flex flex-wrap items-center gap-2.5">

                      <span className="inline-flex items-center gap-2 rounded-full bg-[#F3F8FE] px-3 py-1.5 text-xs font-semibold text-[#55657C]">
                        <Clock3
                          size={15}
                          className="text-[#2563B8]"
                        />
                        {formatDuration(
                          lesson.durationseconds
                        )}
                      </span>

                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                          lesson.video_url
                            ? "bg-[#EBF8F2] text-[#2F7D64]"
                            : "bg-[#F3F6FA] text-[#7C8DA6]"
                        }`}
                      >
                        <Video size={15} />
                        {lesson.video_url
                          ? "Video added"
                          : "No video"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex shrink-0 gap-3 sm:ml-4">

                  <button
                    type="button"
                    onClick={() => openEdit(lesson)}
                    className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#EAF2FC] px-5 text-sm font-bold text-[#2563B8] transition-colors duration-200 hover:bg-[#DAE8F8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563B8] sm:flex-none"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(lesson)}
                    disabled={deletingId === lesson.lessonid}
                    className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 px-5 text-sm font-bold text-red-600 transition-colors duration-200 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                  >
                    {deletingId === lesson.lessonid ? (
                      <LoaderCircle
                        size={16}
                        className="animate-spin"
                      />
                    ) : (
                      <Trash2 size={16} />
                    )}
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}