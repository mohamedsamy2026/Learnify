import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Heart,
  Sparkles,
} from "lucide-react";

export default function Testimonials() {
  return (
    <section className="bg-canvas px-6 py-20 lg:px-12 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* ================= LEFT CONTENT ================= */}

        <div className="max-w-xl">
          {/* EYEBROW */}
          <div className="mb-5 flex items-center gap-3">
            <span className="h-[2px] w-8 rounded-full bg-brand" />

            <p className="text-sm font-bold text-brand">
              Why Learnify
            </p>
          </div>

          {/* TITLE */}
          <h2 className="max-w-lg text-4xl font-extrabold leading-[1.1] tracking-[-0.04em] text-ink sm:text-5xl lg:text-[52px]">
            Learn Today.
            <span className="mt-1 block text-brand">
              Grow Tomorrow.
            </span>
          </h2>

          {/* DESCRIPTION */}
          <p className="mt-6 max-w-[460px] text-[15px] leading-8 text-muted sm:text-base">
            Whether you're exploring a new subject or building
            your career, Learnify brings courses, lessons,
            and learning progress together in one place.
          </p>

          {/* EXPLORE LINK */}
          <Link
            href="/courses"
            className="
              group/explore mt-8
              inline-flex min-h-12
              items-center gap-2.5
              font-bold text-brand
              transition-colors duration-200
              hover:text-brand-dark
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-brand
              focus-visible:ring-offset-4
            "
          >
            Explore Courses

            <ArrowRight
              size={19}
              className="transition-transform duration-200 motion-safe:group-hover/explore:translate-x-1"
            />
          </Link>
        </div>

        {/* ================= RIGHT FEATURE CARD ================= */}

        <div className="rounded-[28px] border border-line bg-surface p-7 shadow-[0_20px_50px_-30px_rgba(15,42,74,0.25)] sm:p-9">
          {/* HEART ICON */}
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white">
            <Heart size={26} strokeWidth={1.7} />
          </div>

          {/* CARD TITLE */}
          <h3 className="mt-7 max-w-md text-2xl font-extrabold leading-snug tracking-[-0.02em] text-ink sm:text-[27px]">
            Built for your learning journey
          </h3>

          {/* ================= FEATURES ================= */}

          <div className="mt-7 divide-y divide-tint">
            {/* FIRST FEATURE */}
            <div className="flex items-start gap-4 py-5 first:pt-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-tint text-brand">
                <BookOpenCheck size={22} strokeWidth={1.8} />
              </div>

              <div className="min-w-0">
                <h4 className="text-[15px] font-extrabold text-ink">
                  Learn at your own pace
                </h4>

                <p className="mt-1.5 text-sm leading-7 text-muted">
                  Explore lessons and follow your course progress.
                </p>
              </div>
            </div>

            {/* SECOND FEATURE */}
            <div className="flex items-start gap-4 py-5 last:pb-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-tint text-brand">
                <Sparkles size={22} strokeWidth={1.8} />
              </div>

              <div className="min-w-0">
                <h4 className="text-[15px] font-extrabold text-ink">
                  Find your next skill
                </h4>

                <p className="mt-1.5 text-sm leading-7 text-muted">
                  Discover courses across different subjects
                  and skill levels.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}