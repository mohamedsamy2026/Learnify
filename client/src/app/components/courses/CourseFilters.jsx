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
    <div className="rounded-3xl border border-[#DFE8F3] bg-white p-5 shadow-[0_16px_40px_-30px_rgba(15,42,74,0.3)] sm:p-7">

      {/* HEADER */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2563B8] text-white">
          <SlidersHorizontal size={19} strokeWidth={1.9} />
        </div>

        <h2 className="text-[18px] font-extrabold tracking-tight text-[#0F2A4A]">
          Find your course
        </h2>
      </div>

      {/* FILTER GRID */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        {/* SEARCH */}
        <label className="group/search relative block min-w-0">
          <span className="mb-2 block text-xs font-bold text-[#55657C] transition-colors duration-200 group-focus-within/search:text-[#2563B8]">
            Search
          </span>

          <div className="relative">
            <Search
              size={18}
              strokeWidth={1.9}
              className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#8498B3] transition-colors duration-200 group-focus-within/search:text-[#2563B8]"
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
                border border-[#DCE7F5]
                bg-white
                pl-11 pr-4
                text-sm font-medium
                text-[#0F2A4A]
                outline-none
                transition-colors duration-200
                placeholder:text-[#9AACBF]
                hover:border-[#B9D1EE]
                focus:border-[#2563B8]
                focus:ring-4 focus:ring-[#2563B8]/10
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
      <div className="mt-5 flex items-center justify-end border-t border-[#E8EFF8] pt-4">
        <button
          type="button"
          onClick={onReset}
          className="
            group/reset inline-flex min-h-10
            items-center justify-center gap-2
            rounded-xl px-4
            text-sm font-bold text-[#2563B8]
            transition-colors duration-200
            hover:bg-[#EAF2FC]
            hover:text-[#1D4F94]
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#2563B8]
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
      <span className="mb-2 block text-xs font-bold text-[#55657C] transition-colors duration-200 group-focus-within/select:text-[#2563B8]">
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
            border border-[#DCE7F5]
            bg-white
            px-4 pr-11
            text-sm font-medium
            text-[#0F2A4A]
            outline-none
            transition-colors duration-200
            hover:border-[#B9D1EE]
            focus:border-[#2563B8]
            focus:ring-4 focus:ring-[#2563B8]/10
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
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#7C93B2] transition-colors duration-200 group-focus-within/select:text-[#2563B8]"
        />
      </div>
    </label>
  );
}