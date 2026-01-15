import prisma from "@/lib/prisma";
import { getErrorMessage } from "@/lib/utils";

export const getCourse = async (courseId: string) => {
  try {
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        chapters: {
          include: {
            chapterSlides: true,
          },
        },
      },
      omit: {
        userId: true,
        updatedAt: true,
      },
    });
    if (!course) {
      throw new Error(`Course not found with id: ${courseId}`);
    }
    return { course: course, error: null };
  } catch (error) {
    const errorMessage = getErrorMessage({
      error: error,
      action: "getCourse",
    });
    return { course: null, error: errorMessage };
  }
};
