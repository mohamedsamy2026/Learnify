import Link from "next/link";

import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  LockKeyhole,
  RotateCcw,
} from "lucide-react";

const statusConfig = {
  active: {
    label: "Active",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  pending: {
    label: "Pending Activation",
    className:
      "border-amber-200 bg-amber-50 text-amber-700",
  },
  completed: {
    label: "Completed",
    className:
      "border-blue-200 bg-blue-50 text-blue-700",
  },
  cancelled: {
    label: "Cancelled",
    className:
      "border-red-200 bg-red-50 text-red-700",
  },
};

export default function EnrolledCourseCard({ course }) {
  const status = statusConfig[course.status] ?? {
    label: "Unavailable",
    className:
      "border-slate-200 bg-slate-100 text-slate-600",
  };

  const canLearn =
    course.status === "active" ||
    course.status === "completed";

  const percentage = Number(course.progressPercentage);

  const hasProgress =
    canLearn &&
    !course.progressError &&
    course.progressPercentage !== null &&
    course.progressPercentage !== undefined &&
    Number.isFinite(percentage);

  const progress = hasProgress
    ? Math.min(100, Math.max(0, percentage))
    : null;

  return (
    <article
      className="
        group/card flex h-full flex-col
        overflow-hidden rounded-3xl
        border border-[#DFE8F3] bg-white
        shadow-[0_10px_30px_-22px_rgba(15,42,74,0.3)]
        transition-shadow duration-300
        hover:shadow-[0_20px_44px_-24px_rgba(15,42,74,0.4)]
      "
    >
      {/* ================= COURSE IMAGE ================= */}

      <div className="relative flex h-48 shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br from-[#6FB3F5] to-[#1B4B87]">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={`${course.title} course cover`}
            className="h-full w-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover/card:scale-105"
          />
        ) : (
          <BookOpen
            size={64}
            strokeWidth={1.3}
            className="text-white/85"
          />
        )}
      </div>

      {/* ================= COURSE CONTENT ================= */}

      <div className="flex flex-1 flex-col p-5 sm:p-6">

        {/* CATEGORY + STATUS */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="min-w-0 max-w-full truncate text-xs font-bold text-[#2563B8]">
            {course.category}
          </span>

          <span
            className={`
              inline-flex items-center
              rounded-full border
              px-3 py-1
              text-[11px] font-bold
              ${status.className}
            `}
          >
            {status.label}
          </span>
        </div>

        {/* COURSE TITLE */}
        <h3 className="mt-4 line-clamp-2 min-h-[56px] text-[20px] font-extrabold leading-[1.4] tracking-tight text-[#0F2A4A]">
          {course.title}
        </h3>

        {/* DESCRIPTION */}
        <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-[#64768F]">
          {course.description ||
            "Continue your learning journey."}
        </p>

        {/* ================= COURSE PROGRESS ================= */}

        {canLearn && (
          <div className="mt-5 rounded-2xl bg-[#F3F8FE] p-4">
            {hasProgress ? (
              <>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-[13px] font-semibold text-[#55657C]">
                    Course Progress
                  </span>

                  <span className="text-[15px] font-extrabold text-[#2563B8]">
                    {progress}%
                  </span>
                </div>

                <div
                  role="progressbar"
                  aria-label={`${course.title} progress`}
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="h-2 overflow-hidden rounded-full bg-[#DCE8F6]"
                >
                  <div
                    className="h-full rounded-full bg-[#2563B8] transition-[width] duration-700 ease-out"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>

                <p className="mt-3 text-xs font-medium text-[#64768F]">
                  {course.completedLessons} of{" "}
                  {course.totalLessons} lessons completed
                </p>
              </>
            ) : (
              <div className="flex items-center gap-3 text-sm text-[#64768F]">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#2563B8]">
                  <RotateCcw size={18} />
                </span>

                Progress temporarily unavailable
              </div>
            )}
          </div>
        )}

        {/* ================= ENROLLMENT STATUS ================= */}

        <div className="mt-5 flex items-center gap-2.5 text-[13px] font-medium text-[#64768F]">
          {course.status === "pending" ? (
            <>
              <Clock3
                size={18}
                className="shrink-0 text-amber-600"
              />
              Waiting for activation
            </>
          ) : course.status === "completed" ? (
            <>
              <CheckCircle2
                size={18}
                className="shrink-0 text-green-600"
              />
              Enrollment completed
            </>
          ) : course.status === "active" ? (
            <>
              <BookOpen
                size={18}
                className="shrink-0 text-[#2563B8]"
              />
              Ready to learn
            </>
          ) : (
            <>
              <LockKeyhole
                size={18}
                className="shrink-0"
              />
              Learning access unavailable
            </>
          )}
        </div>

        {/* ================= ACTION ================= */}

        <div className="mt-auto pt-6">
          {canLearn && course.courseId ? (
            <Link
              href={`/learn/${course.courseId}`}
              className="
                group/action flex min-h-[50px]
                w-full items-center justify-center gap-2.5
                rounded-xl bg-[#2563B8] px-5
                text-sm font-bold text-white
                transition-colors duration-200
                hover:bg-[#1D4F94]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#2563B8]
                focus-visible:ring-offset-2
              "
            >
              {progress === 100
                ? "Review Lessons"
                : "Continue Learning"}

              <ArrowRight
                size={18}
                className="transition-transform duration-200 motion-safe:group-hover/action:translate-x-1"
              />
            </Link>
          ) : (
            <div className="flex min-h-[50px] items-center justify-center gap-2 rounded-xl bg-[#EEF2F7] px-5 text-sm font-bold text-[#8194AD]">
              <LockKeyhole size={17} />
              Access Unavailable
            </div>
          )}
        </div>
      </div>
    </article>
  );
}