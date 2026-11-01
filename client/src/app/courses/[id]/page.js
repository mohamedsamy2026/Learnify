
import CourseDetails from "../../components/course-details/CourseDetails";

export const metadata = {
  title: "Course Details | Learnify",
  description: "Explore course information, ratings, and enrollment.",
};

export default async function CourseDetailsPage({ params }) {
  const { id } = await params;

  return <CourseDetails courseId={id} />;
}
