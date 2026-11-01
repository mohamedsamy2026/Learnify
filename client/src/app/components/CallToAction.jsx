import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
} from "lucide-react";

export default function CallToAction() {
  return (
    <section className="bg-surface px-5 py-20 sm:px-6 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] bg-ink-soft sm:rounded-[36px]">
        <div className="flex flex-col items-start justify-between gap-10 px-7 py-12 sm:px-10 sm:py-14 md:flex-row md:items-center lg:px-16 lg:py-16">
          {/* LEFT CONTENT */}

          <div className="max-w-2xl">
            <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-hxt-a8d7ff">
              <GraduationCap size={30} strokeWidth={1.6} />
            </div>

            <h2 className="max-w-xl text-4xl font-extrabold leading-[1.15] tracking-[-0.04em] text-white sm:text-5xl lg:text-[52px]">
              Your Next Chapter
              <span className="mt-1 block text-hxt-8cc8ff">
                Starts Here
              </span>
            </h2>

            <p className="mt-5 max-w-lg text-[15px] leading-8 text-hxt-c9ddf2 sm:text-base">
              Discover new skills, grow your career, and
              take the next step in your learning journey.
            </p>
          </div>

          {/* CTA BUTTON */}

          <Link
            href="/register"
            className="
              group/button inline-flex
              min-h-[54px] w-full shrink-0
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
              sm:w-auto
            "
          >
            <span className="whitespace-nowrap">
              Start Learning Today
            </span>

            <ArrowRight
              size={18}
              className="transition-transform duration-200 motion-safe:group-hover/button:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}