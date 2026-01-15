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

const normalizeCourse = (course: (typeof landingPageData)[number]): Course => {
  return {
    ...course,
    level: course.level as Level,
    createdAt: new Date(course.createdAt),
    updatedAt: new Date(course.updatedAt),
  };
};

export const LandingPageCourses = async (): Promise<Course[]> => {
  return landingPageData.map(normalizeCourse);
};
export type CourseItemType = Awaited<
  ReturnType<typeof getGeneratedCourses>
>[number];

export enum Level {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced",
}

export type Course = {
  id: string;
  courseSlug: string;
  courseName: string;
  courseDescription: string;
  level: Level;
  totalChapters: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

const landingPageData = [
  {
    id: "0bfe207e-84e7-4316-9756-a2be7b72677c",
    courseSlug: "tanstack-query-fundamentals",
    courseName: "TanStack Query: Queries, Mutations & Infinite Scrolling",
    courseDescription:
      "Learn core TanStack Query patterns to fetch, cache, and sync server state in React.\nExplore queries, mutations, infinite scrolling, and cache timing like staleTime and cacheTime.",
    level: "Intermediate",
    totalChapters: 3,
    userId: "user_389W6zri3dfemZT2qIS1AmE6yJt",
    createdAt: "2026-01-12T10:06:10.600Z",
    updatedAt: "2026-01-12T10:06:10.600Z",
  },
  {
    id: "0714cc29-858b-4ebb-990f-7e051a9c629d",
    courseSlug: "chatgpt-productivity-prompts",
    courseName:
      "How to Use ChatGPT to Maximize Productivity: Prompting Essentials",
    courseDescription:
      "Learn to use ChatGPT to speed up tasks and improve focus.\nMaster prompt techniques to get precise, actionable outputs.\nApply simple workflows to boost daily productivity.",
    level: "Beginner",
    totalChapters: 3,
    userId: "user_389W6zri3dfemZT2qIS1AmE6yJt",
    createdAt: "2026-01-12T10:30:38.003Z",
    updatedAt: "2026-01-12T10:30:38.003Z",
  },
  {
    id: "1664e03a-9823-410c-bd57-0bff303d7ddb",
    courseSlug: "basic-devops",
    courseName: "Basics of DevOps",
    courseDescription:
      "Learn core DevOps concepts, practices, and tools to streamline software delivery.\nBuild practical knowledge of CI/CD, Infrastructure as Code, and monitoring to collaborate and deliver reliably.",
    level: "Beginner",
    totalChapters: 3,
    userId: "user_389W6zri3dfemZT2qIS1AmE6yJt",
    createdAt: "2026-01-12T14:01:32.173Z",
    updatedAt: "2026-01-12T14:01:32.173Z",
  },
  {
    id: "73d34f6c-d062-419a-b131-b0192b01d9c4",
    courseSlug: "express-typescript-intermediate",
    courseName: "Express with TypeScript — Intermediate",
    courseDescription:
      "Build robust Express APIs using TypeScript. Learn advanced typing patterns, middleware, validation, error handling, and testing for production-ready services.",
    level: "Intermediate",
    totalChapters: 3,
    userId: "user_389W6zri3dfemZT2qIS1AmE6yJt",
    createdAt: "2026-01-12T14:23:32.883Z",
    updatedAt: "2026-01-12T14:23:32.883Z",
  },
];
