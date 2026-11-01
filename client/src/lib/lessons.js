
import api from "./api";
import { getToken } from "./auth";

function getAuthConfig() {
  const token = getToken();

  if (!token) {
    throw new Error("Please log in first.");
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export const lessonsApi = {
  // GET LESSONS OF A SPECIFIC COURSE
  async getByCourse(courseId) {
    const { data } = await api.get(
      `/lessons/course/${courseId}`,
      getAuthConfig()
    );

    if (!Array.isArray(data.lessons)) {
      throw new Error("Invalid lessons response");
    }

    return data.lessons;
  },

  // CREATE LESSON
  async create(values) {
    const { data } = await api.post(
      "/lessons",
      values,
      getAuthConfig()
    );

    return data;
  },

  // UPDATE LESSON
  async update(lessonId, values) {
    const { data } = await api.put(
      `/lessons/${lessonId}`,
      values,
      getAuthConfig()
    );

    return data;
  },

  // DELETE LESSON
  async remove(lessonId) {
    const { data } = await api.delete(
      `/lessons/${lessonId}`,
      getAuthConfig()
    );

    return data;
  },
};
