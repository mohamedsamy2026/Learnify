
import api from "./api";
import { getToken } from "./auth";

function authenticated() {
  const token = getToken();

  if (!token) {
    throw new Error("AUTH_REQUIRED");
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export const learningApi = {
  async getCourseLessons(courseId) {
    const { data } = await api.get(
      `/lessons/course/${courseId}`,
      authenticated()
    );

    return data;
  },

  async getLessonProgress(lessonId) {
    const { data } = await api.get(
      `/lesson-progress/${lessonId}`,
      authenticated()
    );

    return data;
  },

  async saveProgress({
    lessonId,
    isCompleted,
    lastPositionSeconds,
  }) {
    const { data } = await api.post(
      "/lesson-progress",
      {
        lessonId: Number(lessonId),
        isCompleted: Boolean(isCompleted),
        lastPositionSeconds: Math.max(
          0,
          Math.floor(lastPositionSeconds)
        ),
      },
      authenticated()
    );

    return data;
  },

  async getCourseProgress(courseId) {
    const { data } = await api.get(
      `/lesson-progress/course/${courseId}`,
      authenticated()
    );

    return data;
  },
};
