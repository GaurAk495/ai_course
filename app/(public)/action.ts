import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const getGeneratedCourses = async () => {
  const { userId } = await auth();
  if (!userId) {
    return [];
  }
  const courses = await prisma.course.findMany({
    where: {
      userId,
    },
  });
  return courses;
};

export type CourseItemType = Awaited<
  ReturnType<typeof getGeneratedCourses>
>[number];
