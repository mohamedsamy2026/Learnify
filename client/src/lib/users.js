
import api from "./api";
import { getToken } from "./auth";

function getAuthConfig() {
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

export const usersApi = {
  async getMe() {
    const { data } = await api.get(
      "/users/me",
      getAuthConfig()
    );

    return data.user ?? data;
  },

  async updateMe(values) {
    const { data } = await api.put(
      "/users/me",
      {
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
      },
      getAuthConfig()
    );

    return data.user ?? data;
  },
};
