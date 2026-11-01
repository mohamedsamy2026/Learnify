
import api from "./api";
import { getToken } from "./auth";

function authConfig() {
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

export const reviewsApi = {
  async getByCourse(courseId) {
    const { data } = await api.get(
      `/reviews/course/${courseId}`
    );

    const reviews = Array.isArray(data)
      ? data
      : data?.reviews;

    if (!Array.isArray(reviews)) {
      throw new Error("Invalid reviews response");
    }

    return reviews;
  },

  async create({ courseId, rating, comment }) {
    const { data } = await api.post(
      "/reviews",
      {
        courseId: Number(courseId),
        rating: Number(rating),
        comment: comment.trim(),
      },
      authConfig()
    );

    return data;
  },

  async update(reviewId, { rating, comment }) {
    const { data } = await api.put(
      `/reviews/${reviewId}`,
      {
        rating: Number(rating),
        comment: comment.trim(),
      },
      authConfig()
    );

    return data;
  },

  async remove(reviewId) {
    const { data } = await api.delete(
      `/reviews/${reviewId}`,
      authConfig()
    );

    return data;
  },
};
