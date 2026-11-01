import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative isolate min-h-[620px] overflow-hidden bg-[#F6F9FD]">
      {/* BACKGROUND SHAPE */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[20%] -top-[35%] hidden h-[950px] w-[950px] rounded-full bg-[#3B82E0] lg:block"
      />

      {/* MAIN CONTENT */}
      <div className="relative mx-auto grid min-h-[620px] max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:gap-8 lg:px-12 lg:py-20">
        {/* LEFT CONTENT */}
        <div className="relative z-20 max-w-[600px]">
          <h1 className="text-[clamp(3rem,5.5vw,5rem)] font-extrabold leading-[1.02] tracking-[-0.045em] text-[#0F2A4A]">
            <span className="block">Skills for a</span>
            <span className="mt-1 block text-[#2563B8]">Brighter</span>
            <span className="block">Tomorrow</span>
          </h1>

          <p className="mt-7 max-w-[450px] text-base leading-8 text-[#55657C] sm:text-lg">
            Learnify helps you build real-world skills with
            expert-led courses and hands-on projects, and join
            a global community of learners.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            {/* PRIMARY BUTTON */}
            <Link
              href="/courses"
              className="group/start inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-xl bg-[#2563B8] px-7 text-sm font-bold text-white shadow-[0_8px_20px_-8px_rgba(37,99,184,0.55)] transition-colors duration-200 hover:bg-[#1D4F94] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563B8] focus-visible:ring-offset-2"
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
              className="group/explore inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-xl border border-[#D3E2F4] bg-white px-6 text-sm font-bold text-[#0F2A4A] transition-colors duration-200 hover:border-[#2563B8] hover:text-[#2563B8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563B8] focus-visible:ring-offset-2"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EAF2FC] text-[#2563B8]">
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
            className="absolute inset-5 rounded-[45%_55%_35%_65%] bg-[#CFE2F8] lg:hidden"
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
        className="pointer-events-none absolute -bottom-12 left-[-5%] z-10 h-20 w-[110%] rounded-[50%] bg-white"
      />
    </section>
  );
}