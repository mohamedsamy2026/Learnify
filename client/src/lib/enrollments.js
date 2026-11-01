
import api from "./api";

export const enrollmentsApi = {
  enroll: async (courseId, token) => {
    const { data } = await api.post(
      "/enrollments",
      { courseId: Number(courseId) },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  },

  getMyCourses: async (token) => {
    const { data } = await api.get("/enrollments/my-courses", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  },
};
