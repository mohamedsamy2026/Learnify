"use client";

import { useEffect, useState } from "react";
import {
  LoaderCircle,
  Star,
  X,
  ArrowRight,
} from "lucide-react";

export default function ReviewForm({
  review = null,
  onSubmit,
  onCancel,
  saving = false,
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setRating(Number(review?.rating) || 0);
    setComment(review?.comment || "");
    setError("");
  }, [review]);

  // ORIGINAL SUBMIT LOGIC
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (rating < 1 || rating > 5) {
      setError("Please select a rating.");
      return;
    }

    if (comment.trim().length > 2000) {
      setError("Review cannot exceed 2000 characters.");
      return;
    }

    try {
      await onSubmit({
        rating,
        comment: comment.trim(),
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to save your review."
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-[#DFE8F3] bg-[#F9FBFE] p-5 sm:p-7"
    >
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4 border-b border-[#E5EDF7] pb-5">

        <h3 className="text-xl font-extrabold tracking-tight text-[#0F2A4A] sm:text-2xl">
          {review ? "Edit Your Review" : "Write a Review"}
        </h3>

        <button
          type="button"
          onClick={onCancel}
          aria-label="Close review form"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#64768F] transition-colors duration-200 hover:bg-[#EAF2FC] hover:text-[#2563B8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563B8]"
        >
          <X size={19} />
        </button>
      </div>

      {/* RATING */}
      <div className="mt-6">
        <p className="text-sm font-bold text-[#0F2A4A]">
          Your Rating
        </p>

        <div
          role="group"
          aria-label="Select a rating from 1 to 5 stars"
          className="mt-3 flex flex-wrap items-center gap-2"
        >
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              aria-label={`${value} star${value === 1 ? "" : "s"}`}
              aria-pressed={rating === value}
              className={`
                group/star flex h-12 w-12
                items-center justify-center
                rounded-xl border
                transition-colors duration-200
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#2563B8]
                focus-visible:ring-offset-2
                ${
                  value <= rating
                    ? "border-amber-200 bg-amber-50"
                    : "border-[#DFE8F3] bg-white hover:border-amber-200 hover:bg-amber-50"
                }
              `}
            >
              <Star
                size={24}
                strokeWidth={1.8}
                className={
                  value <= rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-[#C9D6E6] group-hover/star:text-amber-400"
                }
              />
            </button>
          ))}
        </div>
      </div>

      {/* COMMENT */}
      <div className="mt-7">
        <label
          htmlFor="review-comment"
          className="block text-sm font-bold text-[#0F2A4A]"
        >
          Your Comment
        </label>

        <textarea
          id="review-comment"
          value={comment}
          onChange={(event) =>
            setComment(event.target.value)
          }
          rows={5}
          maxLength={2000}
          placeholder="Share your learning experience..."
          className="mt-3 block w-full resize-y rounded-xl border border-[#DCE7F5] bg-white px-4 py-3.5 text-[14px] leading-7 text-[#0F2A4A] outline-none transition-colors duration-200 placeholder:text-[#9AACBF] hover:border-[#B9D1EE] focus:border-[#2563B8] focus:ring-4 focus:ring-[#2563B8]/10"
        />

        <p className="mt-2 text-right text-xs font-medium text-[#7C8DA6]">
          {comment.length}/2000
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3.5 text-sm font-medium text-red-700"
        >
          {error}
        </div>
      )}

      {/* ACTIONS */}
      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#E5EDF7] pt-5 sm:flex-row sm:items-center">

        <button
          type="submit"
          disabled={saving}
          className="group/submit inline-flex min-h-[50px] items-center justify-center gap-2.5 rounded-xl bg-[#2563B8] px-7 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#1D4F94] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563B8] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? (
            <LoaderCircle
              size={18}
              className="animate-spin"
            />
          ) : (
            <Star size={18} />
          )}

          <span>
            {saving
              ? "Saving..."
              : review
                ? "Save Changes"
                : "Submit Review"}
          </span>

          {!saving && (
            <ArrowRight
              size={17}
              className="transition-transform duration-200 motion-safe:group-hover/submit:translate-x-1"
            />
          )}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="inline-flex min-h-[50px] items-center justify-center rounded-xl border border-[#D3E2F4] bg-white px-7 text-sm font-bold text-[#55657C] transition-colors duration-200 hover:border-[#2563B8] hover:text-[#2563B8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563B8] focus-visible:ring-offset-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}