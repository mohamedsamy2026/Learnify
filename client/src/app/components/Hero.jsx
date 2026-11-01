import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative isolate min-h-[620px] overflow-hidden bg-gradient-to-b from-tint-soft to-canvas">
      {/* DOT PATTERN */}
      <div
        aria-hidden="true"
        className="bg-dots pointer-events-none absolute -left-10 bottom-10 hidden h-56 w-72 opacity-70 lg:block"
      />

      {/* BACKGROUND SHAPE */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[20%] -top-[35%] hidden h-[950px] w-[950px] rounded-full bg-brand-light lg:block"
      />

      {/* MAIN CONTENT */}
      <div className="relative mx-auto grid min-h-[620px] max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:gap-8 lg:px-12 lg:py-20">
        {/* LEFT CONTENT */}
        <div className="relative z-20 max-w-[600px]">
          <h1 className="text-[clamp(3rem,5.5vw,5rem)] font-extrabold leading-[1.02] tracking-[-0.045em] text-ink">
            <span className="block">Skills for a</span>
            <span className="mt-1 block text-brand underline decoration-accent decoration-[6px] underline-offset-[10px]">Brighter</span>
            <span className="block">Tomorrow</span>
          </h1>

          <p className="mt-7 max-w-[450px] text-base leading-8 text-muted sm:text-lg">
            Learnify helps you build real-world skills with
            expert-led courses and hands-on projects, and join
            a global community of learners.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            {/* PRIMARY BUTTON */}
            <Link
              href="/courses"
              className="group/start inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-xl bg-brand px-7 text-sm font-bold text-white shadow-[0_8px_20px_-8px_rgba(37,99,184,0.55)] transition-colors duration-200 hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              Start Learning
              <ArrowRight
                size={18}
                className="transition-transform duration-200 motion-safe:group-hover/start:translate-x-1"
              />
            </Link>

            {/* SECONDARY BUTTON */}
            <Link
              href="/courses"
              className="group/explore inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-xl border border-line-strong bg-surface px-6 text-sm font-bold text-ink transition-colors duration-200 hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-tint text-brand">
                <Play size={13} fill="currentColor" className="ml-0.5" />
              </span>
              Explore Courses
            </Link>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative z-10 flex min-h-[380px] items-end justify-center lg:min-h-[540px]">
          {/* MOBILE BACKGROUND */}
          <div
            aria-hidden="true"
            className="absolute inset-5 rounded-[45%_55%_35%_65%] bg-hxb-cfe2f8 lg:hidden"
          />

          {/* IMAGE WRAPPER */}
          <div className="relative h-[390px] w-full max-w-[480px] overflow-hidden rounded-[45%_55%_35%_65%] sm:h-[470px] lg:h-[550px] lg:max-w-[560px] lg:rounded-[48%_0_0_36%]">
            <Image
              src="/images/HeroImg.png"
              alt="Smiling Learnify student holding a tablet"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>

      {/* BOTTOM CURVE */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-12 left-[-5%] z-10 h-20 w-[110%] rounded-[50%] bg-surface"
      />
    </section>
  );
}