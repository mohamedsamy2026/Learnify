
import api from "./api";

const TOKEN_KEY = "token";
const USER_KEY = "learnify_user";

// AUTH API
export const authApi = {
  // LOGIN
  async login(credentials) {
    const { data } = await api.post(
      "/auth/login",
      credentials
    );

    return data;
  },

  // REGISTER
  async register(userData) {
    const { data } = await api.post(
      "/auth/register",
      userData
    );

    return data;
  },

  // GET CURRENT USER
  async getMe(token) {
    if (!token) {
      throw new Error("Authentication token missing");
    }

    const { data } = await api.get("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  },
};

// SAVE LOGIN SESSION
export function saveSession(data) {
  if (typeof window === "undefined") return;

  if (!data?.token) {
    throw new Error("Authentication token missing");
  }

  // Supports both login and register responses.
  const user = data.user ?? {
    userId: data.userId ?? data.userid,
    name: data.name,
    email: data.email,
    role: data.role,
  };

  if (!user?.userId && !user?.userid) {
    throw new Error("User information missing");
  }

  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  // Notify Navbar and other components.
  window.dispatchEvent(
    new Event("learnify-auth-change")
  );

  return user;
}

// GET JWT TOKEN
export function getToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
}

// GET STORED USER
export function getStoredUser() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedUser = localStorage.getItem(USER_KEY);

    return storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch {
    return null;
  }
}

// CHECK AUTHENTICATION
export function isAuthenticated() {
  return Boolean(getToken());
}

// LOGOUT
export function logout() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);

  window.dispatchEvent(
    new Event("learnify-auth-change")
  );
}

// GET DASHBOARD BASED ON USER ROLE
export function getDashboardPath(role) {
  return role === "instructor"
    ? "/instructor"
    : "/dashboard";
}

// SAFE REDIRECT
export function getSafeRedirect(
  redirect,
  role = "student"
) {
  const defaultPath = getDashboardPath(role);

  if (
    typeof redirect !== "string" ||
    !redirect.startsWith("/") ||
    redirect.startsWith("//") ||
    redirect.includes("\\")
  ) {
    return defaultPath;
  }

  // Avoid redirecting an instructor to the
  // student dashboard or vice versa.
  if (
    role === "instructor" &&
    (redirect === "/dashboard" ||
      redirect.startsWith("/dashboard/") ||
      redirect === "/my-learning" ||
      redirect.startsWith("/my-learning/"))
  ) {
    return defaultPath;
  }

  if (
    role === "student" &&
    (redirect === "/instructor" ||
      redirect.startsWith("/instructor/"))
  ) {
    return defaultPath;
  }

  return redirect;
}

// FORMAT API ERRORS
export function getApiError(error) {
  const status = error.response?.status;
  const data = error.response?.data;

  if (!error.response) {
    return (
      "Cannot connect to the server. " +
      "Please try again."
    );
  }

  if (status === 409) {
    return "This email address is already registered or in use.";
  }

  if (status === 401) {
    return "Invalid email or password, or your session has expired.";
  }

  if (status === 403) {
    return "You do not have permission to perform this action.";
  }

  if (status === 400) {
    return (
      (typeof data?.message === "string" &&
        data.message) ||
      "Please check the information you entered."
    );
  }

  if (status >= 500) {
    return (
      "Something went wrong on the server. " +
      "Please try again."
    );
  }

  return (
    (typeof data?.message === "string" &&
      data.message) ||
    (typeof data === "string" && data) ||
    "Something went wrong. Please try again."
  );
}
