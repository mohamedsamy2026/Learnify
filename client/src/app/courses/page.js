
import CoursesCatalog from "../components/courses/CoursesCatalog";

export const metadata = {
  title: "Explore Courses | Learnify",
  description:
    "Browse courses on Learnify. Search by topic, category, and skill level.",
};

export default function CoursesPage() {
  return (
    <main className="min-h-screen bg-[#F7FAFF]">
      <section className="relative overflow-hidden bg-[#EAF4FF] px-6 pb-20 pt-24 lg:px-12">
        <div
          aria-hidden="true"
          className="absolute -right-32 -top-44 h-[500px] w-[500px] rounded-full border-[95px] border-[#3B8DFA]/10"
        />

        <div className="relative mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-[#286BC1]">
            Discover Your Next Skill
          </p>

          <h1 className="max-w-2xl text-5xl font-extrabold tracking-tight text-[#102C57] sm:text-6xl">
            Explore Our{" "}
            <span className="text-[#3B8DFA]">Courses.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-[#536681]">
            Find courses that match your interests, goals, and
            experience level. Your next learning journey starts here.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-12">
        <CoursesCatalog />
      </section>
    </main>
  );
}
