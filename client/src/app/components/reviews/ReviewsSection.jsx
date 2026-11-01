"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  LoaderCircle,
  MessageSquare,
  RefreshCw,
  Star,
  Pencil,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";

import { authApi, getToken } from "@/lib/auth";
import { reviewsApi } from "@/lib/reviews";
import ReviewForm from "./ReviewForm";
import ReviewCard from "./ReviewCard";

export default function ReviewsSection({ courseId }) {
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  // ================= ORIGINAL DATA LOGIC =================

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await reviewsApi.getByCourse(courseId);
      setReviews(data);
    } catch (err) {
      setError("Unable to load reviews. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      const token = getToken();

      if (!token) {
        setUser(null);
        return;
      }

      try {
        const result = await authApi.getMe(token);

        if (!cancelled) {
          setUser(result.user ?? result);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
        }
      }
    }

    loadUser();

    const handleAuthChange = () => loadUser();

    window.addEventListener(
      "learnify-auth-change",
      handleAuthChange
    );

    return () => {
      cancelled = true;
      window.removeEventListener(
        "learnify-auth-change",
        handleAuthChange
      );
    };
  }, []);

  const userId = user?.userid ?? user?.userId;

  const myReview = useMemo(() => {
    if (!userId) return null;

    return (
      reviews.find(
        (review) =>
          String(review.userid ?? review.userId) ===
          String(userId)
      ) ?? null
    );
  }, [reviews, userId]);

  const average = useMemo(() => {
    const ratings = reviews
      .map((review) => Number(review.rating))
      .filter((value) => value >= 1 && value <= 5);

    if (!ratings.length) return null;

    return (
      ratings.reduce((sum, value) => sum + value, 0) /
      ratings.length
    ).toFixed(1);
  }, [reviews]);

  // ================= ORIGINAL FORM ACTIONS =================

  function openCreate() {
    setEditingReview(null);
    setFormOpen(true);
    setError("");
    setNotice("");
  }

  function openEdit(review) {
    setEditingReview(review);
    setFormOpen(true);
    setError("");
    setNotice("");
  }

  async function handleSave(values) {
    setSaving(true);
    setError("");
    setNotice("");

    try {
      if (editingReview) {
        await reviewsApi.update(
          editingReview.reviewid,
          values
        );
      } else {
        await reviewsApi.create({
          courseId,
          ...values,
        });
      }

      setFormOpen(false);
      setEditingReview(null);

      setNotice(
        editingReview
          ? "Your review has been updated."
          : "Your review has been submitted."
      );

      await loadReviews();
    } catch (err) {
      if (err.message === "AUTH_REQUIRED") {
        throw new Error("Please log in first.");
      }

      if (err.response?.status === 403) {
        throw new Error(
          "Only eligible enrolled students can review this course."
        );
      }

      if (err.response?.status === 409) {
        throw new Error(
          "You have already reviewed this course."
        );
      }

      throw err;
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(review) {
    const confirmed = window.confirm(
      "Are you sure you want to delete your review?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(review.reviewid);
      setError("");
      setNotice("");

      await reviewsApi.remove(review.reviewid);

      setReviews((previous) =>
        previous.filter(
          (item) => item.reviewid !== review.reviewid
        )
      );

      setFormOpen(false);
      setEditingReview(null);
      setNotice("Your review has been deleted.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to delete review."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section
      id="reviews"
      className="rounded-3xl border border-[#DFE8F3] bg-white p-5 shadow-[0_16px_40px_-30px_rgba(15,42,74,0.3)] sm:p-8 lg:p-9"
    >
      {/* ================= HEADER ================= */}

      <div className="flex flex-wrap items-start justify-between gap-6">

        <div className="min-w-0 flex-1">
          <p className="mb-3 text-sm font-bold text-[#2563B8]">
            Community Feedback
          </p>

          <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-[#0F2A4A] sm:text-[30px]">
            Student Reviews
          </h2>

          <p className="mt-2 max-w-md text-sm leading-7 text-[#64768F]">
            Read what learners think about this course.
          </p>
        </div>

        {/* ================= RATING SUMMARY ================= */}

        {average !== null && (
          <div className="min-w-[140px] rounded-2xl bg-[#F3F8FE] px-6 py-4">
            <div className="flex items-center gap-2.5">
              <Star
                size={26}
                className="fill-amber-400 text-amber-400"
              />

              <span className="text-[34px] font-extrabold leading-none tracking-tight text-[#0F2A4A]">
                {average}
              </span>
            </div>

            <p className="mt-2 text-xs font-semibold text-[#64768F]">
              {reviews.length} reviews
            </p>
          </div>
        )}
      </div>

      {/* ================= CONTENT ================= */}

      <div className="mt-8 border-t border-[#E8EFF8] pt-7">

        {/* WRITE REVIEW BUTTON */}

        {user?.role === "student" &&
          !myReview &&
          !formOpen && (
            <button
              type="button"
              onClick={openCreate}
              className="
                group/write inline-flex
                min-h-[48px] items-center justify-center gap-2.5
                rounded-xl bg-[#2563B8]
                px-6 text-sm font-bold text-white
                transition-colors duration-200
                hover:bg-[#1D4F94]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#2563B8]
                focus-visible:ring-offset-2
              "
            >
              <Pencil size={17} />

              <span>Write a Review</span>

              <ArrowUpRight
                size={17}
                className="transition-transform duration-200 motion-safe:group-hover/write:-translate-y-0.5 motion-safe:group-hover/write:translate-x-0.5"
              />
            </button>
          )}

        {/* ================= LOGIN MESSAGE ================= */}

        {!user && (
          <div className="rounded-xl bg-[#F3F8FE] px-5 py-4">
            <p className="text-sm leading-7 text-[#55657C]">
              <Link
                href={`/login?redirect=${encodeURIComponent(
                  `/courses/${courseId}`
                )}`}
                className="font-bold text-[#2563B8] transition-colors hover:text-[#1D4F94] hover:underline"
              >
                Log in
              </Link>{" "}
              with an eligible student account to write a review.
            </p>
          </div>
        )}

        {/* ================= REVIEW FORM ================= */}

        {formOpen && (
          <div>
            <ReviewForm
              review={editingReview}
              saving={saving}
              onSubmit={handleSave}
              onCancel={() => {
                setFormOpen(false);
                setEditingReview(null);
              }}
            />
          </div>
        )}

        {/* ================= SUCCESS NOTICE ================= */}

        {notice && (
          <div
            role="status"
            className="
              mt-5 flex items-start gap-3
              rounded-xl bg-[#EAF4FF]
              px-5 py-4
              text-sm font-medium leading-6
              text-[#174A88]
            "
          >
            <CheckCircle2
              size={19}
              className="mt-0.5 shrink-0 text-[#2563B8]"
            />

            <span>{notice}</span>
          </div>
        )}

        {/* ================= ERROR MESSAGE ================= */}

        {error && (
          <div
            role="alert"
            className="
              mt-5 rounded-xl
              border border-red-100
              bg-red-50 px-5 py-4
              text-sm leading-6 text-red-700
            "
          >
            <div className="flex flex-wrap items-center gap-3">

              <AlertCircle
                size={19}
                className="shrink-0 text-red-500"
              />

              <span className="min-w-0 flex-1">
                {error}
              </span>

              <button
                type="button"
                onClick={loadReviews}
                className="
                  group/retry inline-flex items-center
                  gap-2 rounded-lg px-3 py-2
                  font-bold text-red-700
                  transition-colors
                  hover:bg-red-100
                "
              >
                <RefreshCw
                  size={15}
                  className="transition-transform duration-300 motion-safe:group-hover/retry:rotate-90"
                />
                Retry
              </button>
            </div>
          </div>
        )}

        {/* ================= LOADING ================= */}

        {loading ? (
          <div className="mt-6 flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-2xl bg-[#F9FBFE]">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF2FC] text-[#2563B8]">
              <LoaderCircle
                size={24}
                className="animate-spin"
              />
            </div>

            <p className="text-sm font-semibold text-[#64768F]">
              Loading reviews...
            </p>
          </div>

        ) : reviews.length === 0 ? (

          /* ================= EMPTY STATE ================= */

          <div className="mt-6 flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#C9DCF3] bg-[#F9FBFE] px-6 py-10 text-center">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF2FC] text-[#2563B8]">
              <MessageSquare
                size={28}
                strokeWidth={1.6}
              />
            </div>

            <h3 className="mt-5 text-xl font-extrabold text-[#0F2A4A]">
              No reviews yet
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-7 text-[#64768F]">
              Be the first eligible student to share feedback.
            </p>
          </div>

        ) : (

          /* ================= REVIEWS LIST ================= */

          <div className="mt-6 space-y-4">
            {reviews.map((review) => (
              <div key={review.reviewid}>
                <ReviewCard
                  review={review}
                  isOwner={
                    Boolean(userId) &&
                    String(
                      review.userid ?? review.userId
                    ) === String(userId)
                  }
                  deleting={
                    deletingId === review.reviewid
                  }
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}