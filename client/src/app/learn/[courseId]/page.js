
import LearningPage from "../../components/learning/LearningPage";

export const metadata = {
  title: "Learning Workspace | Learnify",
  description: "Watch lessons and track your learning progress.",
};

export default async function LearnPage({ params }) {
  const { courseId } = await params;

  return <LearningPage courseId={courseId} />;
}
