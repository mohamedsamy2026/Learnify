"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Layers,
  Gift,
  GraduationCap,
} from "lucide-react";

import { coursesApi } from "@/lib/courses";

export default function Statistics() {
  const [stats, setStats] = useState(null);

  // ================= DATA LOGIC =================

  useEffect(() => {
    let active = true;

    async function loadStats() {
      try {
        const courses = await coursesApi.getAll();

        if (!Array.isArray(courses)) return;

        const categories = new Set(
          courses
            .map((course) =>
              course.category?.trim().toLowerCase()
            )
            .filter(Boolean)
        );

        const freeCourses = courses.filter(
          (course) => Number(course.courseprice) === 0
        );

        if (active) {
          setStats({
            courses: courses.length,
            categories: categories.size,
            free: freeCourses.length,
          });
        }
      } catch (error) {
        console.error("Failed to load statistics:", error);
      }
    }

    loadStats();

    return () => {
      active = false;
    };
  }, []);

  const items = [
    {
      label: "Available Courses",
      value: stats?.courses,
      icon: BookOpen,
    },
    {
      label: "Learning Categories",
      value: stats?.categories,
      icon: Layers,
    },
    {
      label: "Free Courses",
      value: stats?.free,
      icon: Gift,
    },
    {
      label: "Learning Opportunities",
      value: stats?.courses,
      icon: GraduationCap,
    },
  ];

  return (
    <section className="bg-[#1B4B87] px-5 py-14 text-white sm:px-6 sm:py-16 lg:px-12">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {items.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex min-h-[180px] flex-col items-center justify-center rounded-2xl border border-white/15 bg-white/[0.07] px-4 py-7 text-center sm:min-h-[200px]"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-[#BBDDFF]">
              <Icon size={24} strokeWidth={1.7} />
            </div>

            <span className="text-[34px] font-extrabold leading-none tracking-[-0.04em] text-white sm:text-[42px]">
              {value ?? "—"}
            </span>

            <span className="mt-3 text-xs font-medium leading-5 text-[#D3E5F8] sm:text-sm">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}