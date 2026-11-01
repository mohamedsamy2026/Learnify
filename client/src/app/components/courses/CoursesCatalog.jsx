"use client";

import { useEffect, useMemo, useState } from "react";

import {
  AlertCircle,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

import { coursesApi } from "@/lib/courses";
import CourseCard from "../CourseCard";
import CourseFilters from "./CourseFilters";

const PAGE_SIZE = 9;

export default function CoursesCatalog() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [level, setLevel] = useState("all");
  const [price, setPrice] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  // ================= ORIGINAL API LOGIC =================

  async function loadCourses() {
    try {
      setLoading(true);
      setError("");

      const data = await coursesApi.getAll();

      if (!Array.isArray(data)) {
        throw new Error("Invalid courses response");
      }

      setCourses(data);
    } catch (err) {
      console.error("Error loading courses:", err);
      setError("Unable to load courses. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCourses();
  }, []);

  // ================= ORIGINAL FILTERING =================

  const categories = useMemo(() => {
    return [
      ...new Set(
        courses
          .map((course) => course.category)
          .filter(Boolean)
      ),
    ].sort();
  }, [courses]);

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return courses
      .filter((course) => {
        const matchesSearch =
          !query ||
          (course.coursename || "")
            .toLowerCase()
            .includes(query) ||
          (course.description || "")
            .toLowerCase()
            .includes(query);

        const matchesCategory =
          category === "all" ||
          course.category === category;

        const matchesLevel =
          level === "all" ||
          (course.level || "").toLowerCase() === level;

        const coursePrice = Number(course.courseprice);

        const matchesPrice =
          price === "all" ||
          (price === "free" && coursePrice === 0) ||
          (price === "paid" && coursePrice > 0);

        return (
          matchesSearch &&
          matchesCategory &&
          matchesLevel &&
          matchesPrice
        );
      })
      .sort((a, b) => {
        if (sort === "price-low") {
          return (
            Number(a.courseprice) -
            Number(b.courseprice)
          );
        }

        if (sort === "price-high") {
          return (
            Number(b.courseprice) -
            Number(a.courseprice)
          );
        }

        return Number(b.courseid) - Number(a.courseid);
      });
  }, [courses, search, category, level, price, sort]);

  const totalPages = Math.ceil(
    filteredCourses.length / PAGE_SIZE
  );

  const paginatedCourses = filteredCourses.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  function updateFilter(setter, value) {
    setter(value);
    setPage(1);
  }

  function resetFilters() {
    setSearch("");
    setCategory("all");
    setLevel("all");
    setPrice("all");
    setPage(1);
  }

  return (
    <div className="relative">

      {/* ================= FILTERS ================= */}

      <CourseFilters
        search={search}
        onSearchChange={(value) =>
          updateFilter(setSearch, value)
        }
        category={category}
        onCategoryChange={(value) =>
          updateFilter(setCategory, value)
        }
        categories={categories}
        level={level}
        onLevelChange={(value) =>
          updateFilter(setLevel, value)
        }
        price={price}
        onPriceChange={(value) =>
          updateFilter(setPrice, value)
        }
        onReset={resetFilters}
      />

      {/* ================= RESULTS TOOLBAR ================= */}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-b border-[#E3ECF7] pb-5">

        {/* Results count */}
        <p
          className="text-sm font-semibold text-[#55657C]"
          aria-live="polite"
        >
          {loading ? (
            "Loading courses..."
          ) : (
            <>
              <span className="text-xl font-extrabold text-[#0F2A4A]">
                {filteredCourses.length}
              </span>{" "}
              courses found
            </>
          )}
        </p>

        {/* SORT CONTROL */}
        <label className="flex items-center gap-3">

          <span className="whitespace-nowrap text-sm font-semibold text-[#64768F]">
            Sort by
          </span>

          <div className="group/sort relative">
            <select
              value={sort}
              onChange={(event) =>
                updateFilter(setSort, event.target.value)
              }
              className="
                h-[44px] min-w-[170px]
                cursor-pointer appearance-none
                rounded-xl
                border border-[#DCE7F5]
                bg-white
                pl-4 pr-10
                text-sm font-semibold
                text-[#0F2A4A]
                outline-none
                transition-colors duration-200
                hover:border-[#B9D1EE]
                focus:border-[#2563B8]
                focus:ring-4 focus:ring-[#2563B8]/10
              "
            >
              <option value="newest">Newest</option>
              <option value="price-low">
                Price: Low to High
              </option>
              <option value="price-high">
                Price: High to Low
              </option>
            </select>

            <ChevronDown
              size={17}
              aria-hidden="true"
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7C93B2]"
            />
          </div>
        </label>
      </div>

      {/* ================= LOADING ================= */}

      {loading ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="h-[350px] animate-pulse overflow-hidden rounded-3xl border border-[#E3ECF7] bg-white p-4"
            >
              {/* Image skeleton */}
              <div className="h-[175px] rounded-2xl bg-[#E6EEF8]" />

              {/* Text skeleton */}
              <div className="mt-6 space-y-4 px-1">
                <div className="h-4 w-[35%] rounded-full bg-[#E6EEF8]" />

                <div className="h-5 w-[80%] rounded-full bg-[#E6EEF8]" />

                <div className="h-4 w-[60%] rounded-full bg-[#E6EEF8]" />

                <div className="flex justify-between pt-3">
                  <div className="h-5 w-16 rounded-full bg-[#E6EEF8]" />
                  <div className="h-9 w-24 rounded-xl bg-[#E6EEF8]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (

        /* ================= ERROR STATE ================= */

        <div className="mt-8 flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-red-100 bg-white p-8 text-center">

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <AlertCircle size={32} strokeWidth={1.7} />
          </div>

          <h2 className="mt-5 text-2xl font-extrabold text-[#0F2A4A]">
            Something went wrong
          </h2>

          <p className="mt-2 max-w-md text-sm leading-7 text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={loadCourses}
            className="
              group/retry mt-6 inline-flex min-h-12
              items-center justify-center gap-2.5
              rounded-xl bg-[#2563B8]
              px-7 text-sm font-bold text-white
              transition-colors duration-200
              hover:bg-[#1D4F94]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#2563B8]
              focus-visible:ring-offset-2
            "
          >
            <RefreshCw
              size={18}
              className="transition-transform duration-500 motion-safe:group-hover/retry:rotate-90"
            />

            Try Again
          </button>
        </div>

      ) : paginatedCourses.length === 0 ? (

        /* ================= EMPTY STATE ================= */

        <div className="mt-8 flex min-h-[340px] flex-col items-center justify-center rounded-3xl border border-dashed border-[#C3D8F2] bg-white p-8 text-center">

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF2FC] text-[#2563B8]">
            <BookOpen size={32} strokeWidth={1.5} />
          </div>

          <h2 className="mt-6 text-2xl font-extrabold text-[#0F2A4A]">
            No courses found
          </h2>

          <p className="mt-2 max-w-md text-sm leading-7 text-[#64768F]">
            Try changing your filters or check back for new courses.
          </p>

          <button
            type="button"
            onClick={resetFilters}
            className="mt-5 rounded-xl px-5 py-2.5 text-sm font-bold text-[#2563B8] transition-colors duration-200 hover:bg-[#EAF2FC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563B8]"
          >
            Clear filters
          </button>
        </div>

      ) : (

        /* ================= COURSE GRID ================= */

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedCourses.map((course) => (
            <div
              key={course.courseid}
              className="min-w-0"
            >
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      )}

      {/* ================= PAGINATION ================= */}

      {totalPages > 1 && (
        <nav
          aria-label="Course pagination"
          className="mt-12 flex items-center justify-center gap-3"
        >
          {/* Previous */}
          <button
            type="button"
            disabled={page === 1}
            onClick={() =>
              setPage((current) => current - 1)
            }
            aria-label="Previous page"
            className="
              flex h-11 w-11
              items-center justify-center
              rounded-xl
              border border-[#D3E2F4]
              bg-white text-[#2563B8]
              transition-colors duration-200
              hover:border-[#2563B8]
              hover:bg-[#F3F8FE]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#2563B8]
              focus-visible:ring-offset-2
              disabled:cursor-not-allowed
              disabled:opacity-35
              disabled:hover:border-[#D3E2F4]
              disabled:hover:bg-white
            "
          >
            <ChevronLeft size={20} />
          </button>

          {/* Current page */}
          <div className="flex items-center gap-2 rounded-xl border border-[#DFE8F3] bg-white px-5 py-2.5">
            <span className="text-sm font-bold text-[#2563B8]">
              {page}
            </span>

            <span className="text-sm text-[#9AACBF]">
              /
            </span>

            <span className="text-sm font-semibold text-[#55657C]">
              {totalPages}
            </span>
          </div>

          {/* Next */}
          <button
            type="button"
            disabled={page === totalPages}
            onClick={() =>
              setPage((current) => current + 1)
            }
            aria-label="Next page"
            className="
              flex h-11 w-11
              items-center justify-center
              rounded-xl
              border border-[#D3E2F4]
              bg-white text-[#2563B8]
              transition-colors duration-200
              hover:border-[#2563B8]
              hover:bg-[#F3F8FE]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#2563B8]
              focus-visible:ring-offset-2
              disabled:cursor-not-allowed
              disabled:opacity-35
              disabled:hover:border-[#D3E2F4]
              disabled:hover:bg-white
            "
          >
            <ChevronRight size={20} />
          </button>
        </nav>
      )}
    </div>
  );
}