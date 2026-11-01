"use client";

import { useEffect, useState } from "react";
import {
  Save,
  X,
  LoaderCircle,
  Video,
  ChevronRight,
} from "lucide-react";

function getInitialValues(lesson) {
  return {
    lessonName: lesson?.lessonname ?? "",
    description: lesson?.description ?? "",
    videoURL: lesson?.video_url ?? "",
    durationSeconds: String(
      lesson?.durationseconds ?? 0
    ),
    lessonOrder: String(lesson?.lessonorder ?? 1),
  };
}

const inputClass = `
  mt-2.5 block h-[54px] w-full
  rounded-xl border border-[#DCE7F5]
  bg-white px-4
  text-[14px] font-medium text-[#0F2A4A]
  outline-none
  transition-colors duration-200
  placeholder:text-[#9AACBF]
  hover:border-[#B9D1EE]
  focus:border-[#2563B8]
  focus:ring-4 focus:ring-[#2563B8]/10
`;

const labelClass =
  "group/field block text-sm font-bold text-[#0F2A4A]";

export default function LessonForm({
  courseId,
  lesson,
  onSubmit,
  onCancel,
  submitting,
}) {
  const [form, setForm] = useState(
    getInitialValues(lesson)
  );
  const [error, setError] = useState("");

  const editing = Boolean(lesson);

  // ================= ORIGINAL FORM LOGIC =================

  useEffect(() => {
    setForm(getInitialValues(lesson));
    setError("");
  }, [lesson]);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const duration = Number(form.durationSeconds);
    const order = Number(form.lessonOrder);

    if (!form.lessonName.trim()) {
      setError("Lesson name is required.");
      return;
    }

    if (
      form.durationSeconds.trim() === "" ||
      !Number.isInteger(duration) ||
      duration < 0
    ) {
      setError("Duration must be a non-negative integer.");
      return;
    }

    if (
      form.lessonOrder.trim() === "" ||
      !Number.isInteger(order) ||
      order < 1
    ) {
      setError("Lesson order must be a positive integer.");
      return;
    }

    if (form.videoURL.trim()) {
      try {
        const url = new URL(form.videoURL.trim());

        if (!["https:", "http:"].includes(url.protocol)) {
          throw new Error("Invalid protocol");
        }
      } catch {
        setError("Enter a valid video URL.");
        return;
      }
    }

    const payload = {
      lessonName: form.lessonName.trim(),
      description: form.description.trim(),
      durationSeconds: duration,
      lessonOrder: order,
      courseId: Number(courseId),
    };

    if (form.videoURL.trim()) {
      payload.videoURL = form.videoURL.trim();
    } else if (editing) {
      payload.videoURL = null;
    }

    try {
      await onSubmit(payload);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to save lesson."
      );
    }
  }

  return (
    <section className="rounded-3xl border border-[#DFE8F3] bg-white p-5 shadow-[0_16px_40px_-30px_rgba(15,42,74,0.3)] sm:p-8 lg:p-9">

      {/* ================= HEADER ================= */}

      <div className="mb-8 flex items-start justify-between gap-5 border-b border-[#E8EFF8] pb-6">
        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#2563B8] text-white">
            <Video size={24} strokeWidth={1.8} />
          </div>

          <div>
            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#64768F]">
              Course Content
              <ChevronRight size={13} />
              Lesson Editor
            </div>

            <h2 className="text-xl font-extrabold tracking-tight text-[#0F2A4A] sm:text-[26px]">
              {editing ? "Edit Lesson" : "Add New Lesson"}
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={onCancel}
          aria-label="Close form"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#64768F] transition-colors duration-200 hover:bg-[#EAF2FC] hover:text-[#2563B8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563B8]"
        >
          <X size={20} />
        </button>
      </div>

      {/* ================= FORM ================= */}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* LESSON TITLE */}

        <label className={labelClass}>
          <span className="transition-colors duration-200 group-focus-within/field:text-[#2563B8]">
            Lesson Title <span className="text-[#2563B8]">*</span>
          </span>

          <input
            name="lessonName"
            value={form.lessonName}
            onChange={updateField}
            placeholder="Introduction to JavaScript"
            required
            className={inputClass}
          />
        </label>

        {/* DESCRIPTION */}

        <label className={labelClass}>
          <span className="transition-colors duration-200 group-focus-within/field:text-[#2563B8]">
            Description
          </span>

          <textarea
            name="description"
            value={form.description}
            onChange={updateField}
            rows={4}
            placeholder="What will students learn?"
            className="
              mt-2.5 block w-full resize-y
              rounded-xl border border-[#DCE7F5]
              bg-white px-4 py-3.5
              text-[14px] font-medium leading-7
              text-[#0F2A4A]
              outline-none
              transition-colors duration-200
              placeholder:text-[#9AACBF]
              hover:border-[#B9D1EE]
              focus:border-[#2563B8]
              focus:ring-4 focus:ring-[#2563B8]/10
            "
          />
        </label>

        {/* VIDEO URL */}

        <label className={labelClass}>
          <span className="transition-colors duration-200 group-focus-within/field:text-[#2563B8]">
            Video URL
          </span>

          <div className="relative">
            <Video
              size={19}
              strokeWidth={1.9}
              className="pointer-events-none absolute left-4 top-[39px] z-10 -translate-y-1/2 text-[#7C93B2] transition-colors duration-200 group-focus-within/field:text-[#2563B8]"
            />

            <input
              name="videoURL"
              type="url"
              value={form.videoURL}
              onChange={updateField}
              placeholder="https://example.com/video"
              className={`${inputClass} pl-12`}
            />
          </div>
        </label>

        {/* DURATION + ORDER */}

        <div className="grid gap-6 sm:grid-cols-2">

          {/* DURATION */}

          <label className={labelClass}>
            <span className="transition-colors duration-200 group-focus-within/field:text-[#2563B8]">
              Duration (seconds) <span className="text-[#2563B8]">*</span>
            </span>

            <input
              name="durationSeconds"
              type="number"
              min="0"
              step="1"
              value={form.durationSeconds}
              onChange={updateField}
              required
              className={inputClass}
            />

            <span className="mt-2 block text-xs font-normal text-[#7C8DA6]">
              Example: 600 = 10 minutes
            </span>
          </label>

          {/* LESSON ORDER */}

          <label className={labelClass}>
            <span className="transition-colors duration-200 group-focus-within/field:text-[#2563B8]">
              Lesson Order <span className="text-[#2563B8]">*</span>
            </span>

            <input
              name="lessonOrder"
              type="number"
              min="1"
              step="1"
              value={form.lessonOrder}
              onChange={updateField}
              required
              className={inputClass}
            />
          </label>
        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-100 bg-red-50 px-5 py-3.5 text-sm font-medium text-red-700"
          >
            {error}
          </div>
        )}

        {/* ================= ACTIONS ================= */}

        <div className="flex flex-col-reverse gap-3 border-t border-[#E8EFF8] pt-6 sm:flex-row sm:items-center">

          {/* SAVE BUTTON */}

          <button
            type="submit"
            disabled={submitting}
            className="
              inline-flex min-h-[50px] items-center justify-center gap-2.5
              rounded-xl bg-[#2563B8] px-8
              text-sm font-bold text-white
              transition-colors duration-200
              hover:bg-[#1D4F94]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#2563B8]
              focus-visible:ring-offset-2
              disabled:cursor-not-allowed disabled:opacity-60
            "
          >
            {submitting ? (
              <LoaderCircle size={19} className="animate-spin" />
            ) : (
              <Save size={19} />
            )}

            <span>
              {submitting
                ? "Saving..."
                : editing
                  ? "Save Changes"
                  : "Create Lesson"}
            </span>
          </button>

          {/* CANCEL BUTTON */}

          <button
            type="button"
            onClick={onCancel}
            className="
              inline-flex min-h-[50px]
              items-center justify-center
              rounded-xl border border-[#D3E2F4]
              bg-white px-7
              text-sm font-bold text-[#55657C]
              transition-colors duration-200
              hover:border-[#2563B8]
              hover:text-[#2563B8]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#2563B8]
              focus-visible:ring-offset-2
            "
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}