
import api from "./api";
import { getToken } from "./auth";

// Generate authorization headers
function authHeaders() {
  const token = getToken();

  if (!token) {
    throw new Error("You must log in first.");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

// Instructor API requests
export const instructorApi = {
  // GET ALL COURSES
  async getCourses() {
    const { data } = await api.get("/courses");

    if (!Array.isArray(data)) {
      throw new Error("Invalid courses response");
    }

    return data;
  },

  // CREATE COURSE
  async createCourse(values) {
    const { data } = await api.post("/courses", values, {
      headers: authHeaders(),
    });

    return data;
  },

  // UPDATE COURSE
  async updateCourse(id, values) {
    const { data } = await api.put(
      `/courses/${id}`,
      values,
      {
        headers: authHeaders(),
      }
    );

    return data;
  },

  // DELETE COURSE
  async deleteCourse(id) {
    const { data } = await api.delete(
      `/courses/${id}`,
      {
        headers: authHeaders(),
      }
    );

    return data;
  },
};
