import Link from "next/link";

import {
  BookOpen,
  Pencil,
  Trash2,
  ArrowUpRight,
  LoaderCircle,
} from "lucide-react";

export default function InstructorCourseCard({
  course,
  onEdit,
  onDelete,
  deleting,
}) {
  const price = Number(course.courseprice ?? 0);

  return (
    <article
      className="
        lift group/card flex h-full flex-col
        overflow-hidden rounded-3xl
        border border-line bg-surface
        shadow-[0_10px_30px_-22px_rgba(15,42,74,0.3)]
        transition-shadow duration-300
        hover:shadow-[0_20px_44px_-24px_rgba(15,42,74,0.4)]
      "
    >
      {/* IMAGE SECTION */}

      <div className="relative h-48 shrink-0 overflow-hidden bg-gradient-to-br from-hxg-6fb3f5 to-hxg-1b4b87">

        {course.thumbnail_url ? (
          <img
            src={course.thumbnail_url}
            alt={course.coursename}
            className="h-full w-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover/card:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BookOpen
              size={64}
              strokeWidth={1.3}
              className="text-white/85"
            />
          </div>
        )}

        {/* PRICE BADGE */}
        <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-extrabold text-ink-soft">
          {price === 0 ? "Free" : `$${price.toFixed(2)}`}
        </span>
      </div>

      {/* CONTENT */}

      <div className="flex flex-1 flex-col p-5 sm:p-6">

        {/* CATEGORY + LEVEL */}
        <div className="flex flex-wrap items-center justify-between gap-3">

          <span className="inline-flex max-w-full items-center rounded-full bg-tint px-3 py-1 text-xs font-bold text-brand">
            <span className="truncate">
              {course.category || "General"}
            </span>
          </span>

          <span className="text-xs font-semibold capitalize text-subtle">
            {course.level || "Beginner"}
          </span>
        </div>

        {/* COURSE NAME */}
        <h3 className="mt-4 line-clamp-2 min-h-[56px] text-[20px] font-extrabold leading-[1.4] tracking-tight text-ink">
          {course.coursename}
        </h3>

        {/* DESCRIPTION */}
        <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-muted">
          {course.description || "No description added yet."}
        </p>

        {/* FLEX SPACER */}
        <div className="flex-1" />

        {/* ACTIONS */}
        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-tint pt-5">

          {/* EDIT BUTTON */}
          <button
            type="button"
            onClick={() => onEdit(course)}
            className="
              inline-flex min-h-[44px]
              items-center justify-center gap-2
              rounded-xl bg-tint
              px-3 text-sm font-bold text-brand
              transition-colors duration-200
              hover:bg-hxb-dae8f8
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-brand
            "
          >
            <Pencil size={16} />
            Edit
          </button>

          {/* DELETE BUTTON */}
          <button
            type="button"
            disabled={deleting}
            onClick={() => onDelete(course)}
            className="
              inline-flex min-h-[44px]
              items-center justify-center gap-2
              rounded-xl bg-red-50
              px-3 text-sm font-bold text-red-600
              transition-colors duration-200
              hover:bg-red-100
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-red-500
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {deleting ? (
              <LoaderCircle
                size={16}
                className="animate-spin"
              />
            ) : (
              <Trash2 size={16} />
            )}

            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>

        {/* MANAGE LESSONS */}
        <Link
          href={`/instructor/courses/${course.courseid}/lessons`}
          className="
            group/lessons mt-3
            inline-flex min-h-[46px] w-full
            items-center justify-center gap-2
            rounded-xl border border-line-strong
            bg-surface px-4 text-sm font-bold
            text-ink
            transition-colors duration-200
            hover:border-brand
            hover:text-brand
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-brand
            focus-visible:ring-offset-2
          "
        >
          Manage Lessons

          <ArrowUpRight
            size={17}
            className="transition-transform duration-200 motion-safe:group-hover/lessons:-translate-y-0.5 motion-safe:group-hover/lessons:translate-x-0.5"
          />
        </Link>
      </div>
    </article>
  );
}