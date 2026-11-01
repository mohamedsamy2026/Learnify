import {
  Pencil,
  Star,
  Trash2,
  UserRound,
  LoaderCircle,
} from "lucide-react";

export default function ReviewCard({
  review,
  isOwner = false,
  onEdit,
  onDelete,
  deleting = false,
}) {
  const rating = Number(review.rating) || 0;

  return (
    <article className="rounded-2xl border border-[#DFE8F3] bg-white p-5 sm:p-6">
      <div className="flex items-start gap-4">

        {/* Avatar */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EAF2FC] text-[#2563B8]">
          <UserRound size={22} strokeWidth={1.8} />
        </div>

        <div className="min-w-0 flex-1">

          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-3">

            <div className="min-w-0">

              {/* Student name */}
              <p className="break-words text-[15px] font-extrabold text-[#0F2A4A] sm:text-base">
                {review.name ||
                  review.username ||
                  "Learnify Student"}
              </p>

              {/* Rating */}
              <div
                className="mt-2 flex items-center gap-1"
                aria-label={`${rating} out of 5 stars`}
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <Star
                    key={value}
                    size={16}
                    strokeWidth={1.8}
                    className={
                      value <= rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-[#C9D6E6]"
                    }
                  />
                ))}
              </div>
            </div>

            {/* Owner actions */}
            {isOwner && (
              <div className="flex shrink-0 items-center gap-2">

                {/* Edit */}
                <button
                  type="button"
                  onClick={() => onEdit(review)}
                  aria-label="Edit review"
                  className="
                    flex h-10 w-10
                    items-center justify-center
                    rounded-xl bg-[#EAF2FC]
                    text-[#2563B8]
                    transition-colors duration-200
                    hover:bg-[#DAE8F8]
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#2563B8]
                  "
                >
                  <Pencil size={17} />
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => onDelete(review)}
                  disabled={deleting}
                  aria-label="Delete review"
                  className="
                    flex h-10 w-10
                    items-center justify-center
                    rounded-xl bg-red-50
                    text-red-600
                    transition-colors duration-200
                    hover:bg-red-100
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-red-500
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {deleting ? (
                    <LoaderCircle
                      size={17}
                      className="animate-spin"
                    />
                  ) : (
                    <Trash2 size={17} />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Review comment */}
          {review.comment && (
            <p className="mt-4 whitespace-pre-line break-words text-[14px] leading-7 text-[#55657C] sm:text-[15px]">
              {review.comment}
            </p>
          )}

        </div>
      </div>
    </article>
  );
}