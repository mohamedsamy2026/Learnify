"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock3,
  LoaderCircle,
  RefreshCw,
  PlayCircle,
  Sparkles,
} from "lucide-react";

import { getToken } from "@/lib/auth";
import { learningApi } from "@/lib/learning";
import VideoPlayer from "./VideoPlayer";

export default function LearningPage({ courseId }) {
  const router = useRouter();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [completedIds, setCompletedIds] = useState([]);
  const [lessonPositions, setLessonPositions] = useState({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadLearning = useCallback(async () => {
    const token = getToken();

    if (!token) {
      router.replace(
        `/login?redirect=${encodeURIComponent(
          `/learn/${courseId}`
        )}`
      );
      return;
    }

    try {
      setLoading(true);
      setError("");
      setNotice("");
      setCourse(null);

      const data =
        await learningApi.getCourseLessons(courseId);

      if (
        !data?.course ||
        !Array.isArray(data.lessons)
      ) {
        throw new Error("Invalid lessons response");
      }

      // Load progress for every lesson.
      const results = await Promise.allSettled(
        data.lessons.map((lesson) =>
          learningApi.getLessonProgress(
            lesson.lessonid
          )
        )
      );

      // Do not silently treat failed progress requests
      // as zero progress.
      const failed = results.find(
        (result) => result.status === "rejected"
      );

      if (failed) {
        throw failed.reason;
      }

      const completed = [];
      const positions = {};

      results.forEach((result, index) => {
        const response = result.value;
        const record =
          response?.progress ?? response;

        const lessonId =
          data.lessons[index].lessonid;

        const storedPosition = Number(
          record?.lastpositionseconds ??
          record?.lastPositionSeconds ??
          0
        );

        positions[lessonId] =
          Number.isFinite(storedPosition)
            ? Math.max(0, storedPosition)
            : 0;

        if (
          record?.iscompleted === true ||
          record?.isCompleted === true
        ) {
          completed.push(lessonId);
        }
      });

      setCourse(data.course);
      setLessons(data.lessons);
      setCompletedIds(completed);
      setLessonPositions(positions);
      setSelectedIndex(0);
    } catch (err) {
      const status = err.response?.status;

      if (status === 401) {
        router.replace(
          `/login?redirect=${encodeURIComponent(
            `/learn/${courseId}`
          )}`
        );
        return;
      }

      if (status === 403) {
        setError(
          "You need an active enrollment to access this course."
        );
      } else if (status === 404) {
        setError("Course not found.");
      } else {
        setError(
          "Unable to load the course or your saved progress."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [courseId, router]);

  useEffect(() => {
    loadLearning();
  }, [loadLearning]);

  const selectedLesson = lessons[selectedIndex];

  const isCompleted =
    selectedLesson &&
    completedIds.includes(selectedLesson.lessonid);

  const progressPercentage = lessons.length
    ? Math.round(
        (completedIds.length / lessons.length) * 100
      )
    : 0;

  // SAVE PLAYBACK POSITION
  const handleVideoProgress = useCallback(
    async ({ lessonId, lastPositionSeconds }) => {
      const position = Math.max(
        0,
        Math.floor(lastPositionSeconds)
      );

      await learningApi.saveProgress({
        lessonId,
        isCompleted: false,
        lastPositionSeconds: position,
      });

      setLessonPositions((previous) => ({
        ...previous,
        [lessonId]: position,
      }));
    },
    []
  );

  // MARK LESSON AS COMPLETED
  async function markCompleted() {
    if (!selectedLesson || isCompleted || saving) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setNotice("");

      const lessonId = selectedLesson.lessonid;

      await learningApi.saveProgress({
        lessonId,
        isCompleted: true,
        lastPositionSeconds:
          Math.floor(
            lessonPositions[lessonId] ?? 0
          ),
      });

      setCompletedIds((previous) =>
        previous.includes(lessonId)
          ? previous
          : [...previous, lessonId]
      );

      setNotice(
        "Lesson marked as completed successfully."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to save lesson progress."
      );
    } finally {
      setSaving(false);
    }
  }

  function selectLesson(index) {
    setSelectedIndex(index);
    setError("");
    setNotice("");
  }

  if (loading) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center gap-3 bg-canvas text-sm font-semibold text-brand">
        <LoaderCircle
          size={24}
          className="animate-spin"
        />
        Loading course...
      </main>
    );
  }

  if (!course) {
    return (
      <main className="flex min-h-[65vh] flex-col items-center justify-center bg-canvas px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-tint text-brand">
          <BookOpen size={32} />
        </div>

        <h1 className="mt-5 text-2xl font-extrabold text-ink">
          Course Access
        </h1>

        <p
          role="alert"
          className="mt-2 max-w-md text-muted"
        >
          {error || "Course unavailable."}
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={loadLearning}
            className="inline-flex min-h-[46px] items-center gap-2 rounded-xl border border-line-strong bg-surface px-5 text-sm font-bold text-brand transition-colors duration-200 hover:border-brand hover:bg-tint-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            <RefreshCw size={17} />
            Try Again
          </button>

          <Link
            href="/my-learning"
            className="inline-flex min-h-[46px] items-center rounded-xl bg-brand px-6 text-sm font-bold text-white transition-colors duration-200 hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            Back to My Learning
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-clip bg-canvas">
      {/* HERO */}
      <section className="bg-ink-soft px-6 pb-28 pt-12 text-white sm:pb-32 lg:px-12 lg:pt-16">
        <div className="mx-auto max-w-7xl">
          <Link href="/my-learning" className="group/back inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-sm font-semibold text-hxt-e0efff transition-colors duration-200 hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            <ArrowLeft size={17} className="transition-transform duration-200 motion-safe:group-hover/back:-translate-x-1" />
            My Learning
          </Link>

          <div className="mt-8 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="min-w-0">
              <p className="mb-3 flex items-center gap-2 text-sm font-bold text-hxt-9ccbff">
                <Sparkles size={16} /> Learning Workspace
              </p>
              <h1 className="max-w-3xl break-words text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl">
                {course.coursename}
              </h1>
              <p className="mt-4 text-sm text-hxt-d3e6fa">Continue your learning journey.</p>
            </div>

            <div className="w-full shrink-0 rounded-2xl bg-white/10 p-5 md:max-w-[290px]">
              <div className="mb-3 flex items-center justify-between gap-3 text-sm font-semibold">
                <span className="text-hxt-dcebfc">Course Progress</span>
                <span className="text-xl font-extrabold text-white">{progressPercentage}%</span>
              </div>
              <div role="progressbar" aria-label="Course progress" aria-valuenow={progressPercentage} aria-valuemin={0} aria-valuemax={100} className="h-2 overflow-hidden rounded-full bg-white/20">
                <div className="h-full rounded-full bg-surface transition-[width] duration-700 ease-out" style={{ width: `${progressPercentage}%` }} />
              </div>
              <p className="mt-3 text-xs text-hxt-d0e4fa">{completedIds.length} of {lessons.length} lessons completed</p>
            </div>
          </div>
        </div>
      </section>

      {/* LEARNING WORKSPACE */}
      <div className="relative z-10 mx-auto -mt-14 grid max-w-7xl items-start gap-6 px-6 pb-24 lg:grid-cols-[minmax(0,1fr)_330px] lg:px-12">
        <section className="min-w-0 space-y-6">
          {selectedLesson ? (
            <>
              {/* Existing video player, behavior and position preserved */}
              <div className="overflow-hidden rounded-3xl shadow-[0_20px_50px_-28px_rgba(15,42,74,0.5)]">
                <VideoPlayer
                  key={selectedLesson.lessonid}
                  lesson={selectedLesson}
                  initialPositionSeconds={lessonPositions[selectedLesson.lessonid] ?? 0}
                  onProgressSave={handleVideoProgress}
                />
              </div>

              <div className="rounded-3xl border border-line bg-surface p-6 shadow-[0_16px_40px_-30px_rgba(15,42,74,0.3)] sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="inline-flex items-center gap-2 rounded-full bg-tint px-3.5 py-1.5 text-xs font-bold text-brand">
                    <PlayCircle size={16} /> Lesson {selectedIndex + 1} of {lessons.length}
                  </p>
                  {isCompleted && (
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 size={15} /> Completed
                    </span>
                  )}
                </div>

                <h2 className="mt-5 break-words text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{selectedLesson.lessonname}</h2>
                <p className="mt-4 max-w-3xl whitespace-pre-line leading-8 text-muted">
                  {selectedLesson.description || "No lesson description available."}
                </p>

                {error && <p role="alert" className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
                {notice && <p role="status" className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700"><CheckCircle2 size={18} className="shrink-0" />{notice}</p>}

                <div className="mt-7 flex flex-wrap gap-3 border-t border-tint pt-6">
                  <button type="button" disabled={selectedIndex === 0} onClick={() => selectLesson(selectedIndex - 1)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line-strong bg-surface px-5 text-sm font-bold text-ink transition-colors duration-200 hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line-strong disabled:hover:text-ink">
                    <ArrowLeft size={17} /> Previous
                  </button>
                  <button type="button" disabled={saving || isCompleted} onClick={markCompleted} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-white transition-colors duration-200 hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-brand sm:flex-none">
                    {saving ? <LoaderCircle size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                    {saving ? "Saving..." : isCompleted ? "Completed" : "Mark as Completed"}
                  </button>
                  <button type="button" disabled={selectedIndex === lessons.length - 1} onClick={() => selectLesson(selectedIndex + 1)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line-strong bg-surface px-5 text-sm font-bold text-ink transition-colors duration-200 hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line-strong disabled:hover:text-ink">
                    Next Lesson <ArrowRight size={17} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-3xl border border-line bg-surface p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-tint text-brand"><BookOpen size={32} /></div>
              <h2 className="mt-5 text-xl font-extrabold text-ink">No lessons available yet</h2>
              <p className="mt-2 text-muted">Your instructor has not added any lessons to this course.</p>
            </div>
          )}
        </section>

        {/* COURSE LESSONS SIDEBAR */}
        <aside className="min-w-0 self-start overflow-hidden rounded-3xl border border-line bg-surface p-5 shadow-[0_16px_40px_-30px_rgba(15,42,74,0.3)] lg:sticky lg:top-28">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-ink">Course Content</h2>
              <p className="mt-1.5 text-xs font-medium text-muted">{completedIds.length} of {lessons.length} completed</p>
            </div>
            <button type="button" onClick={loadLearning} aria-label="Refresh course content" className="group/refresh flex h-10 w-10 items-center justify-center rounded-xl bg-tint text-brand transition-colors duration-200 hover:bg-hxb-dae8f8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
              <RefreshCw size={18} className="transition-transform duration-500 motion-safe:group-hover/refresh:rotate-90" />
            </button>
          </div>

          <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-brand transition-[width] duration-700" style={{ width: `${progressPercentage}%` }} />
          </div>

          <div className="mt-5 max-h-[620px] space-y-1.5 overflow-y-auto pr-1">
            {lessons.map((lesson, index) => {
              const active = selectedIndex === index;
              const completed = completedIds.includes(lesson.lessonid);
              const minutes = Math.floor(Number(lesson.durationseconds || 0) / 60);

              return (
                <button
                  key={lesson.lessonid}
                  type="button"
                  onClick={() => selectLesson(index)}
                  aria-current={active ? "step" : undefined}
                  className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${active ? "bg-tint text-hxt-174a88" : "text-muted hover:bg-tint-soft"}`}
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-extrabold ${completed ? "bg-emerald-50 text-emerald-600" : active ? "bg-surface text-brand" : "bg-hxb-eef3fa text-subtle"}`}>
                    {completed ? <CheckCircle2 size={19} /> : String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block break-words text-sm font-bold leading-5">{lesson.lessonname}</span>
                    <span className="mt-1.5 flex items-center gap-1.5 text-xs opacity-75"><Clock3 size={13} />{minutes} min</span>
                    {lessonPositions[lesson.lessonid] > 0 && !completed && (
                      <span className="mt-1.5 block text-xs font-semibold text-brand">
                        Resume from {Math.floor(lessonPositions[lesson.lessonid] / 60)}m {Math.floor(lessonPositions[lesson.lessonid] % 60)}s
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </main>
  );
}