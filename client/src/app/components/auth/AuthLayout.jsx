
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  GraduationCap,
  Sparkles,
  Star,
  Play,
  CheckCircle2,
  Layers3,
  ArrowRight,
} from "lucide-react";

export default function AuthLayout({
  children,
  title,
  description,
  mode = "login",
}) {
  const isLogin = mode === "login";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F7FAFF]">
      <div className="mx-auto grid min-h-[calc(100vh-112px)] max-w-[1600px] lg:grid-cols-[48%_52%]">

        {/* ================= FORM SIDE ================= */}

        <section className="relative flex items-center justify-center overflow-hidden px-5 py-16 sm:px-10 lg:px-14 xl:px-20">

          {/* Background decorations */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-40 -top-40 h-[400px] w-[400px] rounded-full bg-[#DCEBFF]/60 blur-[100px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-40 right-0 h-[350px] w-[350px] rounded-full bg-[#E4F2FF]/70 blur-[100px]"
          />

          <div className="auth-content-enter relative z-10 w-full max-w-[430px]">

            {/* Small brand mark */}

            <div className="mb-9 inline-flex items-center gap-2.5 rounded-full border border-[#D6E7FC] bg-white/90 px-4 py-2.5 text-[13px] font-semibold text-[#286BC1] shadow-[0_8px_24px_-15px_rgba(40,107,193,0.25)] backdrop-blur-md">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E8F2FF]">
                <GraduationCap size={16} />
              </span>

              Your learning journey starts here
            </div>

            {/* Heading */}

            <h1 className="text-[42px] font-extrabold leading-[1.12] tracking-[-0.055em] text-[#102C57] sm:text-[52px]">
              {title}
            </h1>

            <p className="mt-5 max-w-md text-[15px] leading-8 text-[#71839D]">
              {description}
            </p>

            {/* Form */}

            <div className="mt-10">
              {children}
            </div>

            {/* Auth switch */}

            <p className="mt-9 text-center text-sm text-[#71839D]">
              {isLogin
                ? "New to Learnify?"
                : "Already have an account?"}{" "}

              <Link
                href={isLogin ? "/register" : "/login"}
                className="group/link inline-flex items-center gap-1 font-bold text-[#286BC1] transition-colors hover:text-[#174F9C]"
              >
                {isLogin ? "Create an account" : "Log in"}

                <ArrowUpRight
                  size={15}
                  className="transition-transform duration-300 motion-safe:group-hover/link:translate-x-0.5 motion-safe:group-hover/link:-translate-y-0.5"
                />
              </Link>
            </p>
          </div>
        </section>

        {/* ================= VISUAL SIDE ================= */}

        <section className="auth-visual relative hidden min-h-[760px] flex-col justify-between overflow-hidden bg-[#174A98] p-10 text-white lg:flex xl:p-14">

          {/* Animated gradient background */}
          <div className="auth-gradient pointer-events-none absolute inset-0 bg-gradient-to-br from-[#83C5FF] via-[#347FDE] to-[#102C64]" />

          {/* Light glows */}

          <div className="auth-glow-one pointer-events-none absolute -right-48 -top-48 h-[650px] w-[650px] rounded-full bg-[#A7DDFF]/30 blur-[100px]" />

          <div className="auth-glow-two pointer-events-none absolute -bottom-56 -left-32 h-[550px] w-[550px] rounded-full bg-[#102D70]/60 blur-[110px]" />

          {/* Background grid */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.4) 1px,transparent 1px)",
              backgroundSize: "70px 70px",
              maskImage:
                "linear-gradient(to bottom,transparent,black 30%,black 70%,transparent)",
            }}
          />

          {/* Decorative orbital rings */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[43%] h-[510px] w-[510px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[43%] h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]"
          />

          {/* ================= TOP BRAND ================= */}

          <div className="relative z-10 flex items-center justify-between gap-4">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/25 bg-white/15 shadow-lg backdrop-blur-xl">
                <GraduationCap size={25} strokeWidth={1.8} />
              </div>

              <span className="text-[25px] font-extrabold tracking-[-0.04em]">
                Learnify
              </span>
            </div>

            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-bold tracking-[0.16em] text-white/90 backdrop-blur-xl">
              LEARN • GROW • SUCCEED
            </span>
          </div>

          {/* ================= CENTER CONTENT ================= */}

          <div className="relative z-10 mx-auto w-full max-w-[560px] py-10">

            {/* ================= 3D SCENE ================= */}

            <div className="auth-scene relative mx-auto mb-12 h-[330px] w-full max-w-[500px] sm:h-[370px]">

              {/* Main glow */}

              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[280px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#A8DCFF]/35 blur-[75px]" />

              {/* Orbit */}

              <div className="auth-orbit pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/20" />

              {/* ================= 3D BOOK ================= */}

              <div className="auth-book-float absolute left-1/2 top-[51%] z-20 -translate-x-1/2 -translate-y-1/2">

                <div className="auth-book-scene relative h-[215px] w-[175px] sm:h-[240px] sm:w-[195px]">

                  <div className="auth-book relative h-full w-full">

                    {/* Book pages */}
                    <div className="absolute inset-y-[8px] -right-[11px] w-[28px] rounded-r-[12px] border border-[#BEDCF5] bg-gradient-to-r from-[#C4DDF3] via-white to-[#D7E9F8] shadow-[8px_10px_25px_rgba(10,35,85,0.2)]" />

                    {/* Book spine */}
                    <div className="absolute -left-[10px] inset-y-[5px] w-[24px] rounded-l-xl bg-gradient-to-r from-[#0C3678] to-[#2768C1] shadow-xl" />

                    {/* Cover */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-[20px] border border-white/40 bg-gradient-to-br from-[#E8F5FF] via-[#B9DCFF] to-[#74B1F3] shadow-[25px_35px_65px_rgba(8,29,75,0.4)]">

                      {/* Cover decoration */}
                      <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full border-[28px] border-white/20" />

                      <div className="absolute -bottom-14 -left-14 h-40 w-40 rounded-full border-[30px] border-white/15" />

                      <div className="absolute inset-[11px] rounded-[13px] border border-white/40" />

                      {/* Center graphic */}
                      <div className="relative flex h-[85px] w-[85px] items-center justify-center rounded-[26px] border border-white/50 bg-white/75 text-[#286BC1] shadow-[0_15px_30px_-12px_rgba(40,107,193,0.4)] backdrop-blur-md">
                        <BookOpen
                          size={46}
                          strokeWidth={1.5}
                        />
                      </div>

                      <div className="relative mt-5 text-center">
                        <p className="text-xl font-extrabold tracking-tight text-[#164B90]">
                          Learnify
                        </p>

                        <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-[#347FD8]/35" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ================= FLOATING CARD 1 ================= */}

              <div className="auth-float-one absolute left-0 top-[13%] z-30 sm:left-[3%]">

                <div className="auth-glass-card flex items-center gap-3 rounded-2xl border border-white/35 bg-white/90 px-4 py-3 text-[#173D78] shadow-[0_18px_40px_-15px_rgba(10,34,85,0.45)] backdrop-blur-xl">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E7F1FF] text-[#286BC1]">
                    <GraduationCap size={23} />
                  </div>

                  <div>
                    <p className="text-[13px] font-extrabold">
                      Start Learning
                    </p>
                    <p className="mt-0.5 text-[10px] font-medium text-[#7590B0]">
                      Explore new skills
                    </p>
                  </div>
                </div>
              </div>

              {/* ================= FLOATING CARD 2 ================= */}

              <div className="auth-float-two absolute -right-1 top-[21%] z-30 sm:right-[1%]">

                <div className="auth-glass-card flex items-center gap-3 rounded-2xl border border-white/35 bg-white/90 px-4 py-3 text-[#173D78] shadow-[0_18px_40px_-15px_rgba(10,34,85,0.45)] backdrop-blur-xl">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F7EF] text-[#259568]">
                    <CheckCircle2 size={22} />
                  </div>

                  <div>
                    <p className="text-[13px] font-extrabold">
                      Keep Growing
                    </p>
                    <p className="mt-0.5 text-[10px] font-medium text-[#7590B0]">
                      Every step counts
                    </p>
                  </div>
                </div>
              </div>

              {/* ================= FLOATING CARD 3 ================= */}

              <div className="auth-float-three absolute bottom-[12%] left-[1%] z-30">

                <div className="auth-glass-card flex items-center gap-2.5 rounded-2xl border border-white/35 bg-white/90 px-4 py-3 text-[#173D78] shadow-[0_18px_40px_-15px_rgba(10,34,85,0.45)] backdrop-blur-xl">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF1CF] text-[#D49A28]">
                    <Star size={21} fill="currentColor" />
                  </div>

                  <span className="text-[13px] font-extrabold">
                    Build Your Future
                  </span>
                </div>
              </div>

              {/* ================= FLOATING ICONS ================= */}

              <div className="auth-float-four absolute bottom-[10%] right-[5%] z-30 flex h-14 w-14 rotate-12 items-center justify-center rounded-2xl border border-white/30 bg-[#9CD3FF]/80 text-[#174C90] shadow-xl backdrop-blur-xl">
                <Layers3 size={27} />
              </div>

              <div className="auth-sparkle absolute right-[18%] top-[5%] text-white/80">
                <Sparkles size={23} />
              </div>

              <div className="auth-sparkle-delayed absolute bottom-[27%] left-[20%] text-[#D8EEFF]">
                <Star size={15} fill="currentColor" />
              </div>

            </div>

            {/* ================= MAIN TEXT ================= */}

            <div className="auth-text-enter relative">

              <h2 className="max-w-[520px] text-[38px] font-extrabold leading-[1.13] tracking-[-0.045em] xl:text-[48px]">

                {isLogin ? (
                  <>
                    Welcome Back to

                    <span className="block text-[#D5EDFF]">
                      Your Future.
                    </span>
                  </>
                ) : (
                  <>
                    Your Brighter

                    <span className="block text-[#D5EDFF]">
                      Tomorrow Starts Here.
                    </span>
                  </>
                )}

              </h2>

              <p className="mt-6 max-w-[450px] text-[16px] leading-8 text-[#E2F0FF]">
                Discover courses, build real-world skills,
                and keep moving toward your goals.
              </p>

              {/* Feature pill */}

              <div className="group/feature mt-8 inline-flex items-center gap-3 rounded-2xl border border-white/25 bg-white/15 px-5 py-4 shadow-[0_12px_30px_-16px_rgba(7,28,75,0.3)] backdrop-blur-xl transition-all duration-300 hover:border-white/40 hover:bg-white/20 motion-safe:hover:-translate-y-1">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
                  <Play size={18} fill="currentColor" />
                </div>

                <span className="text-[13px] font-bold">
                  Learn at your own pace
                </span>

                <ArrowRight
                  size={18}
                  className="ml-2 transition-transform duration-300 motion-safe:group-hover/feature:translate-x-1.5"
                />
              </div>

            </div>

          </div>

          {/* ================= FOOTER ================= */}

          <div className="relative z-10 flex items-center justify-between gap-3 border-t border-white/15 pt-6">

            <p className="text-xs font-medium text-blue-100">
              Learnify — Skills for a Brighter Tomorrow
            </p>

            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-6 rounded-full bg-white/80" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
            </div>
          </div>
        </section>
      </div>

      {/* ================= CSS ANIMATIONS ================= */}

      <style>{`
        @keyframes authEnter {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes authFloatOne {
          0%, 100% {
            transform: translateY(0) rotate(-5deg);
          }
          50% {
            transform: translateY(-15px) rotate(-2deg);
          }
        }

        @keyframes authFloatTwo {
          0%, 100% {
            transform: translateY(0) rotate(5deg);
          }
          50% {
            transform: translateY(17px) rotate(2deg);
          }
        }

        @keyframes authFloatThree {
          0%, 100% {
            transform: translateY(0) rotate(-4deg);
          }
          50% {
            transform: translateY(-12px) rotate(0deg);
          }
        }

        @keyframes authFloatFour {
          0%, 100% {
            transform: translateY(0) rotate(12deg);
          }
          50% {
            transform: translateY(-17px) rotate(22deg);
          }
        }

        @keyframes authBookFloat {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(0);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-13px);
          }
        }

        @keyframes authGlowMove {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(-35px, 30px);
          }
        }

        @keyframes authSparkle {
          0%, 100% {
            opacity: 0.5;
            transform: scale(0.85);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        .auth-book-scene {
          perspective: 1000px;
        }

        .auth-book {
          transform-style: preserve-3d;
          transform: rotateY(-18deg) rotateX(9deg) rotateZ(-8deg);
          transition: transform 0.7s cubic-bezier(0.22,1,0.36,1);
        }

        .auth-glass-card {
          transition:
            transform 0.4s cubic-bezier(0.22,1,0.36,1),
            box-shadow 0.4s ease;
        }

        @media (prefers-reduced-motion: no-preference) {
          .auth-content-enter {
            animation: authEnter 0.75s cubic-bezier(0.22,1,0.36,1) both;
          }

          .auth-text-enter {
            animation: authEnter 0.8s cubic-bezier(0.22,1,0.36,1) 0.2s both;
          }

          .auth-float-one {
            animation: authFloatOne 5s ease-in-out infinite;
          }

          .auth-float-two {
            animation: authFloatTwo 6s ease-in-out infinite;
          }

          .auth-float-three {
            animation: authFloatThree 5.5s ease-in-out infinite;
          }

          .auth-float-four {
            animation: authFloatFour 6.5s ease-in-out infinite;
          }

          .auth-book-float {
            animation: authBookFloat 6s ease-in-out infinite;
          }

          .auth-glow-one {
            animation: authGlowMove 12s ease-in-out infinite;
          }

          .auth-glow-two {
            animation: authGlowMove 15s ease-in-out infinite reverse;
          }

          .auth-sparkle {
            animation: authSparkle 3s ease-in-out infinite;
          }

          .auth-sparkle-delayed {
            animation: authSparkle 3s ease-in-out 1.5s infinite;
          }

          .auth-scene:hover .auth-book {
            transform: rotateY(-5deg) rotateX(2deg) rotateZ(-3deg) scale(1.07);
          }

          .auth-glass-card:hover {
            transform: translateY(-4px) scale(1.03);
            box-shadow: 0 24px 45px -15px rgba(10,34,85,0.5);
          }
        }
      `}</style>
    </main>
  );
}
