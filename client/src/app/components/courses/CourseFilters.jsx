"use client";

import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
} from "lucide-react";

export default function CourseFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
  level,
  onLevelChange,
  price,
  onPriceChange,
  onReset,
}) {
  return (
    <div className="rounded-3xl border border-line bg-surface p-5 shadow-[0_16px_40px_-30px_rgba(15,42,74,0.3)] sm:p-7">

      {/* HEADER */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white">
          <SlidersHorizontal size={19} strokeWidth={1.9} />
        </div>

        <h2 className="text-[18px] font-extrabold tracking-tight text-ink">
          Find your course
        </h2>
      </div>

      {/* FILTER GRID */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        {/* SEARCH */}
        <label className="group/search relative block min-w-0">
          <span className="mb-2 block text-xs font-bold text-muted transition-colors duration-200 group-focus-within/search:text-brand">
            Search
          </span>

          <div className="relative">
            <Search
              size={18}
              strokeWidth={1.9}
              className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-hxt-8498b3 transition-colors duration-200 group-focus-within/search:text-brand"
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                onSearchChange(event.target.value)
              }
              placeholder="Search courses..."
              className="
                h-[50px] w-full
                rounded-xl
                border border-line
                bg-surface
                pl-11 pr-4
                text-sm font-medium
                text-ink
                outline-none
                transition-colors duration-200
                placeholder:text-subtle
                hover:border-line-strong
                focus:border-brand
                focus:ring-4 focus:ring-brand/10
              "
            />
          </div>
        </label>

        {/* CATEGORY */}
        <FilterSelect
          label="Category"
          value={category}
          onChange={onCategoryChange}
          options={[
            { value: "all", label: "All categories" },
            ...categories.map((item) => ({
              value: item,
              label: item,
            })),
          ]}
        />

        {/* LEVEL */}
        <FilterSelect
          label="Level"
          value={level}
          onChange={onLevelChange}
          options={[
            { value: "all", label: "All levels" },
            { value: "beginner", label: "Beginner" },
            { value: "intermediate", label: "Intermediate" },
            { value: "advanced", label: "Advanced" },
          ]}
        />

        {/* PRICE */}
        <FilterSelect
          label="Price"
          value={price}
          onChange={onPriceChange}
          options={[
            { value: "all", label: "All prices" },
            { value: "free", label: "Free" },
            { value: "paid", label: "Paid" },
          ]}
        />
      </div>

      {/* FOOTER */}
      <div className="mt-5 flex items-center justify-end border-t border-tint pt-4">
        <button
          type="button"
          onClick={onReset}
          className="
            group/reset inline-flex min-h-10
            items-center justify-center gap-2
            rounded-xl px-4
            text-sm font-bold text-brand
            transition-colors duration-200
            hover:bg-tint
            hover:text-brand-dark
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-brand
          "
        >
          <X
            size={17}
            className="transition-transform duration-200 motion-safe:group-hover/reset:rotate-90"
          />

          Reset filters
        </button>
      </div>
    </div>
  );
}

// REUSABLE FILTER SELECT
function FilterSelect({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <label className="group/select block min-w-0">
      <span className="mb-2 block text-xs font-bold text-muted transition-colors duration-200 group-focus-within/select:text-brand">
        {label}
      </span>

      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="
            h-[50px] w-full
            cursor-pointer appearance-none
            rounded-xl
            border border-line
            bg-surface
            px-4 pr-11
            text-sm font-medium
            text-ink
            outline-none
            transition-colors duration-200
            hover:border-line-strong
            focus:border-brand
            focus:ring-4 focus:ring-brand/10
          "
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* DROPDOWN ARROW */}
        <ChevronDown
          size={18}
          strokeWidth={2}
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-hxt-7c93b2 transition-colors duration-200 group-focus-within/select:text-brand"
        />
      </div>
    </label>
  );
}