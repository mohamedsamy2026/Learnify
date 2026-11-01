"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowRight,
  CheckCircle2,
  LoaderCircle,
  LockKeyhole,
} from "lucide-react";

import { enrollmentsApi } from "@/lib/enrollments";

export default function EnrollmentCard({ course }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const price = Number(course.courseprice ?? 0);
  const free = price === 0;

  // ORIGINAL ENROLLMENT LOGIC
  async function handleEnroll() {
    setMessage("");

    const token = localStorage.getItem("token");

    if (!token) {
      router.push(
        `/login?redirect=${encodeURIComponent(
          `/courses/${course.courseid}`
        )}`
      );
      return;
    }

    try {
      setLoading(true);

      const result = await enrollmentsApi.enroll(
        course.courseid,
        token
      );

      const enrollmentStatus =
        result?.enrollment?.status ??
        result?.status ??
        (free ? "active" : "pending");

      setStatus(enrollmentStatus);

      if (enrollmentStatus === "pending") {
        setMessage(
          "Enrollment received. Awaiting activation."
        );
      } else {
        setMessage("Enrollment successful!");
      }
    } catch (error) {
      const statusCode = error.response?.status;

      if (statusCode === 401) {
        localStorage.removeItem("token");
        setMessage(
          "Your session expired. Please log in again."
        );
      } else if (statusCode === 409) {
        setMessage(
          error.response?.data?.message ||
            "You are already enrolled in this course."
        );
      } else {
        setMessage(
          error.response?.data?.message ||
            "Unable to enroll. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <aside className="rounded-3xl border border-[#DFE8F3] bg-white p-5 shadow-[0_16px_40px_-28px_rgba(15,42,74,0.3)] sm:p-6">

      {/* ================= PRICE ================= */}

      <div className="mb-5 rounded-2xl bg-[#F3F8FE] px-6 py-6">
        <p className="text-[13px] font-semibold text-[#64768F]">
          Course Price
        </p>

        <p className="mt-2 text-[42px] font-extrabold leading-none tracking-[-0.04em] text-[#0F2A4A] sm:text-[44px]">
          {free ? "Free" : `$${price.toFixed(2)}`}
        </p>
      </div>

      {/* ================= ENROLL BUTTON ================= */}

      <button
        type="button"
        onClick={handleEnroll}
        disabled={loading || Boolean(status)}
        className={`
          group/button flex min-h-[54px] w-full
          items-center justify-center gap-2.5
          rounded-xl px-5 text-[15px] font-bold text-white
          transition-colors duration-200
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-offset-2
          disabled:cursor-not-allowed
          ${
            status
              ? "bg-[#2F8F73] focus-visible:ring-[#2F8F73]"
              : "bg-[#2563B8] hover:bg-[#1D4F94] focus-visible:ring-[#2563B8]"
          }
          disabled:opacity-65
        `}
      >
        {loading ? (
          <>
            <LoaderCircle
              className="animate-spin"
              size={19}
            />
            <span>Enrolling...</span>
          </>
        ) : status ? (
          <>
            <CheckCircle2 size={19} />
            <span>
              {status === "pending"
                ? "Awaiting Activation"
                : "Enrolled"}
            </span>
          </>
        ) : (
          <>
            <span>
              {free
                ? "Enroll for Free"
                : "Request Enrollment"}
            </span>

            <ArrowRight
              size={19}
              className="transition-transform duration-200 motion-safe:group-hover/button:translate-x-1"
            />
          </>
        )}
      </button>

      {/* ================= STATUS MESSAGE ================= */}

      {message && (
        <div
          role="status"
          className={`
            mt-4 rounded-xl border
            px-4 py-3.5 text-sm leading-6
            ${
              status
                ? "border-green-100 bg-green-50 text-green-700"
                : "border-[#DCE7F5] bg-[#F3F8FE] text-[#55657C]"
            }
          `}
        >
          <div className="flex items-start gap-3">
            {status && (
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0 text-green-600"
              />
            )}

            <span>{message}</span>
          </div>
        </div>
      )}

      {/* ================= BENEFITS ================= */}

      <div className="mt-6 space-y-4 border-t border-[#E8EFF8] pt-6">

        <div className="flex items-center gap-3.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF2FC] text-[#2563B8]">
            <CheckCircle2 size={19} />
          </span>

          <p className="text-[13px] font-medium leading-6 text-[#55657C]">
            Learn at your own pace
          </p>
        </div>

        <div className="flex items-center gap-3.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF2FC] text-[#2563B8]">
            <LockKeyhole size={19} />
          </span>

          <p className="text-[13px] font-medium leading-6 text-[#55657C]">
            Lessons accessible after activation
          </p>
        </div>

      </div>

      {/* ================= LOGIN LINK ================= */}

      <p className="mt-6 border-t border-[#E8EFF8] pt-5 text-center text-xs leading-6 text-[#7C8DA6]">
        Already have an account?{" "}

        <Link
          href="/login"
          className="font-bold text-[#2563B8] transition-colors hover:text-[#1D4F94] hover:underline"
        >
          Log in
        </Link>
      </p>

    </aside>
  );
}