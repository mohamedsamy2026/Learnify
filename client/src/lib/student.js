
import { authApi, getToken } from "./auth";
import { enrollmentsApi } from "./enrollments";
import { learningApi } from "./learning";

function normalizeEnrollment(item) {
  const course = item.course ?? item;

  return {
    enrollmentId:
      item.enrollmentid ?? item.enrollmentId ?? null,
    courseId:
      course.courseid ??
      course.courseId ??
      item.courseid ??
      item.courseId,
    title:
      course.coursename ??
      item.coursename ??
      "Untitled Course",
    description:
      course.description ?? item.description ?? "",
    thumbnail:
      course.thumbnail_url ??
      item.thumbnail_url ??
      "",
    category:
      course.category ??
      item.category ??
      "General",
    level:
      course.level ?? item.level ?? "",
    status: String(
      item.status ??
      item.enrollmentstatus ??
      "unknown"
    ).toLowerCase(),
    progressPercentage: null,
    totalLessons: null,
    completedLessons: null,
    progressError: false,
  };
}

export async function getStudentData() {
  const token = getToken();

  if (!token) {
    throw new Error("AUTH_REQUIRED");
  }

  const profileResponse =
    await authApi.getMe(token);

  const user =
    profileResponse?.user ?? profileResponse;

  if (!user || user.role !== "student") {
    throw new Error("STUDENT_ONLY");
  }

  const enrollmentResponse =
    await enrollmentsApi.getMyCourses(token);

  const enrollmentList =
    Array.isArray(enrollmentResponse)
      ? enrollmentResponse
      : enrollmentResponse?.enrollments ??
        enrollmentResponse?.courses;

  if (!Array.isArray(enrollmentList)) {
    throw new Error(
      "INVALID_ENROLLMENTS_RESPONSE"
    );
  }

  const enrollments =
    enrollmentList.map(normalizeEnrollment);

  // Load actual progress for accessible courses.
  const enrichedCourses = await Promise.all(
    enrollments.map(async (course) => {
      if (
        !["active", "completed"].includes(
          course.status
        ) ||
        !course.courseId
      ) {
        return course;
      }

      try {
        const progress =
          await learningApi.getCourseProgress(
            course.courseId
          );

        return {
          ...course,
          progressPercentage:
            Number(progress.progressPercentage),
          totalLessons:
            Number(progress.totalLessons),
          completedLessons:
            Number(progress.completedLessons),
        };
      } catch {
        // Never replace a failed API request with
        // fabricated 0% progress.
        return {
          ...course,
          progressError: true,
        };
      }
    })
  );

  return {
    user,
    enrollments: enrichedCourses,
  };
}
