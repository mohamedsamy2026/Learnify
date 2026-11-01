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
      className="rounded-3xl border border-line bg-hxb-f9fbfe p-5 sm:p-7"
    >
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4 border-b border-hxl-e5edf7 pb-5">

        <h3 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
          {review ? "Edit Your Review" : "Write a Review"}
        </h3>

        <button
          type="button"
          onClick={onCancel}
          aria-label="Close review form"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted transition-colors duration-200 hover:bg-tint hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <X size={19} />
        </button>
      </div>

      {/* RATING */}
      <div className="mt-6">
        <p className="text-sm font-bold text-ink">
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
                focus-visible:ring-brand
                focus-visible:ring-offset-2
                ${
                  value <= rating
                    ? "border-amber-200 bg-amber-50"
                    : "border-line bg-surface hover:border-amber-200 hover:bg-amber-50"
                }
              `}
            >
              <Star
                size={24}
                strokeWidth={1.8}
                className={
                  value <= rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-hxt-c9d6e6 group-hover/star:text-amber-400"
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
          className="block text-sm font-bold text-ink"
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
          className="mt-3 block w-full resize-y rounded-xl border border-line bg-surface px-4 py-3.5 text-[14px] leading-7 text-ink outline-none transition-colors duration-200 placeholder:text-subtle hover:border-line-strong focus:border-brand focus:ring-4 focus:ring-brand/10"
        />

        <p className="mt-2 text-right text-xs font-medium text-subtle">
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
      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-hxl-e5edf7 pt-5 sm:flex-row sm:items-center">

        <button
          type="submit"
          disabled={saving}
          className="group/submit inline-flex min-h-[50px] items-center justify-center gap-2.5 rounded-xl bg-brand px-7 text-sm font-bold text-white transition-colors duration-200 hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
          className="inline-flex min-h-[50px] items-center justify-center rounded-xl border border-line-strong bg-surface px-7 text-sm font-bold text-muted transition-colors duration-200 hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}