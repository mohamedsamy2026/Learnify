"use client";

import { useEffect, useState } from "react";
import {
  LoaderCircle,
  Save,
  X,
  BookOpen,
  ChevronDown,
  Layers3,
} from "lucide-react";

const emptyForm = {
  Coursename: "",
  description: "",
  thumbnail_URL: "",
  Level: "beginner",
  CoursePrice: "0",
  Category: "",
};

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

export default function CourseForm({
  course,
  onSubmit,
  onCancel,
  submitting,
}) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const editing = Boolean(course);

  // ================= ORIGINAL FORM LOGIC =================

  useEffect(() => {
    if (course) {
      setForm({
        Coursename: course.coursename || "",
        description: course.description || "",
        thumbnail_URL: course.thumbnail_url || "",
        Level: course.level || "beginner",
        CoursePrice: String(course.courseprice ?? 0),
        Category: course.category || "",
      });
    } else {
      setForm({ ...emptyForm });
    }

    setError("");
  }, [course]);

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

    const price = Number(form.CoursePrice);

    if (!form.Coursename.trim()) {
      setError("Course name is required.");
      return;
    }

    if (
      form.CoursePrice.trim() === "" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      setError("Enter a valid course price.");
      return;
    }

    if (
      form.thumbnail_URL.trim() &&
      !/^https?:\/\/\S+$/i.test(form.thumbnail_URL.trim())
    ) {
      setError("Thumbnail must be a valid HTTP or HTTPS URL.");
      return;
    }

    const payload = {
      Coursename: form.Coursename.trim(),
      description: form.description.trim(),
      thumbnail_URL: form.thumbnail_URL.trim() || undefined,
      Level: form.Level,
      CoursePrice: price,
      Category: form.Category.trim(),
    };

    await onSubmit(payload);
  }

  return (
    <div className="rounded-3xl border border-[#DFE8F3] bg-white p-5 shadow-[0_16px_40px_-30px_rgba(15,42,74,0.3)] sm:p-8 lg:p-9">

      {/* ================= HEADER ================= */}

      <div className="mb-8 flex items-start justify-between gap-5 border-b border-[#E8EFF8] pb-6">
        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#2563B8] text-white">
            <BookOpen size={24} strokeWidth={1.8} />
          </div>

          <div className="min-w-0">
            <h2 className="text-xl font-extrabold tracking-tight text-[#0F2A4A] sm:text-[26px]">
              {editing ? "Edit Course" : "Create New Course"}
            </h2>

            <p className="mt-1.5 text-sm leading-6 text-[#64768F]">
              Fill in the course information below.
            </p>
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

        {/* COURSE NAME */}

        <label className={labelClass}>
          <span className="transition-colors duration-200 group-focus-within/field:text-[#2563B8]">
            Course Name <span className="text-[#2563B8]">*</span>
          </span>

          <input
            name="Coursename"
            value={form.Coursename}
            onChange={updateField}
            placeholder="e.g. Complete Web Development"
            required
            maxLength={200}
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

        {/* THUMBNAIL URL */}

        <label className={labelClass}>
          <span className="transition-colors duration-200 group-focus-within/field:text-[#2563B8]">
            Thumbnail URL
          </span>

          <input
            name="thumbnail_URL"
            type="url"
            value={form.thumbnail_URL}
            onChange={updateField}
            placeholder="https://example.com/course.jpg"
            className={inputClass}
          />
        </label>

        {/* CATEGORY + LEVEL */}

        <div className="grid gap-6 sm:grid-cols-2">

          {/* CATEGORY */}

          <label className={labelClass}>
            <span className="transition-colors duration-200 group-focus-within/field:text-[#2563B8]">
              Category
            </span>

            <input
              name="Category"
              value={form.Category}
              onChange={updateField}
              placeholder="Development"
              className={inputClass}
            />
          </label>

          {/* LEVEL */}

          <label className={labelClass}>
            <span className="transition-colors duration-200 group-focus-within/field:text-[#2563B8]">
              Level <span className="text-[#2563B8]">*</span>
            </span>

            <div className="relative">
              <select
                name="Level"
                value={form.Level}
                onChange={updateField}
                className={`${inputClass} cursor-pointer appearance-none pr-12`}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>

              <ChevronDown
                size={18}
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-[39px] -translate-y-1/2 text-[#7C93B2]"
              />
            </div>
          </label>
        </div>

        {/* PRICE */}

        <label className={labelClass}>
          <span className="transition-colors duration-200 group-focus-within/field:text-[#2563B8]">
            Price (USD) <span className="text-[#2563B8]">*</span>
          </span>

          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-[39px] -translate-y-1/2 text-sm font-bold text-[#7C93B2]"
            >
              $
            </span>

            <input
              name="CoursePrice"
              type="number"
              min="0"
              step="0.01"
              value={form.CoursePrice}
              onChange={updateField}
              required
              className={`${inputClass} pl-9`}
            />
          </div>

          <span className="mt-2 block text-xs font-normal text-[#7C8DA6]">
            Enter 0 for a free course.
          </span>
        </label>

        {/* ================= ERROR ================= */}

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-100 bg-red-50 px-5 py-3.5 text-sm font-medium text-red-600"
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
                  : "Create Course"}
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
    </div>
  );
}