
import ManageLessons from "../../../../components/instructor/ManageLessons";

export const metadata = {
  title: "Manage Lessons | Learnify",
  description: "Create and manage lessons for your courses.",
};

export default async function ManageLessonsPage({ params }) {
  const { id } = await params;

  return <ManageLessons courseId={id} />;
}
