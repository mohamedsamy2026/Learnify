import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
} from "lucide-react";

export default function CourseCard({ course }) {
  const id = course.courseid;
  const title = course.coursename || "Untitled Course";
  const price = Number(course.courseprice || 0);
  const thumbnail = course.thumbnail_url;

  return (
    <Link
      href={`/courses/${id}`}
      className="
        group/card relative isolate block
        h-[350px] w-full overflow-hidden
        rounded-3xl bg-[#12386F]
        shadow-[0_10px_30px_-18px_rgba(15,42,74,0.5)]
        transition-shadow duration-300
        hover:shadow-[0_20px_44px_-20px_rgba(15,42,74,0.6)]
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[#2563B8]
        focus-visible:ring-offset-4
        sm:h-[370px]
      "
    >
      {/* ================= COURSE IMAGE ================= */}

      {thumbnail ? (
        <div
          className="
            absolute inset-0
            bg-cover bg-center
            transition-transform duration-700 ease-out
            motion-safe:group-hover/card:scale-105
          "
          style={{
            backgroundImage: `url("${thumbnail}")`,
          }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#4A9AF0] to-[#12386F]">
          <BookOpen
            size={80}
            strokeWidth={1.3}
            className="text-white/80"
          />
        </div>
      )}

      {/* ================= OVERLAY ================= */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0
          bg-gradient-to-t
          from-[#071A39]/90
          via-[#0A2A57]/35
          to-transparent
        "
      />

      {/* ================= TOP ROW ================= */}

      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-5">
        <span className="inline-flex max-w-[75%] items-center rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-bold text-[#12386F]">
          <span className="truncate">
            {course.category || "Course"}
          </span>
        </span>

        <span
          className="
            flex h-10 w-10 shrink-0
            items-center justify-center
            rounded-xl bg-white/20 text-white
            backdrop-blur-md
            transition-colors duration-200
            group-hover/card:bg-white
            group-hover/card:text-[#2563B8]
          "
        >
          <ArrowUpRight size={20} strokeWidth={2} />
        </span>
      </div>

      {/* ================= BOTTOM CONTENT ================= */}

      <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
        <h3 className="line-clamp-2 max-w-[300px] text-[22px] font-extrabold leading-[1.25] tracking-[-0.02em] text-white">
          {title}
        </h3>

        <div
          aria-hidden="true"
          className="mt-5 h-px w-full bg-white/25"
        />

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="min-w-0 truncate text-[13px] font-medium text-[#CFE4FF]">
            {course.level || "All levels"}
          </span>

          <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-white/20 px-3.5 py-1.5 text-[13px] font-bold text-white backdrop-blur-md">
            {price === 0
              ? "Free"
              : `$${price.toFixed(2)}`}
          </span>
        </div>
      </div>
    </Link>
  );
}