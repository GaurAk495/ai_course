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
      throw new Error("Course not found");
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

// const getCourseReturn = {
//   id: "0714cc29-858b-4ebb-990f-7e051a9c629d",
//   courseSlug: "chatgpt-productivity-prompts",
//   courseName: "How to Use ChatGPT to Maximize Productivity: Prompting Essentials",
//   courseDescription: "Learn to use ChatGPT to speed up tasks and improve focus.\nMaster prompt techniques to get precise, actionable outputs.\nApply simple workflows to boost daily productivity.",
//   level: "Beginner",
//   totalChapters: 3,
//   createdAt: 2026-01-12T10:30:38.003Z,
//   chapters: [
//     {
//       id: "498b1fdd-ff3f-4ce5-af69-857224c83131",
//       chapterSlug: "getting-started-with-chatgpt",
//       chapterTitle: "Getting Started with ChatGPT",
//       subContent: [ "What ChatGPT can and cannot do", "Define clear productivity goals",
//         "Choose the right interface and tools"
//       ],
//       courseId: "0714cc29-858b-4ebb-990f-7e051a9c629d",
//       createdAt: 2026-01-12T10:30:38.145Z,
//       updatedAt: 2026-01-12T10:30:38.145Z,
//       chapterSlides: [],
//     }, {
//       id: "7f3f9125-ce19-4c42-ad7b-58cbb6b8bac8",
//       chapterSlug: "prompting-fundamentals",
//       chapterTitle: "Prompting Fundamentals",
//       subContent: [ "Write clear and specific instructions", "Provide context and examples",
//         "Specify format, length, and tone"
//       ],
//       courseId: "0714cc29-858b-4ebb-990f-7e051a9c629d",
//       createdAt: 2026-01-12T10:30:38.145Z,
//       updatedAt: 2026-01-12T10:30:38.145Z,
//       chapterSlides: [],
//     }, {
//       id: "eec8b641-a09a-4f54-8342-33f122727898",
//       chapterSlug: "advanced-prompts-workflows",
//       chapterTitle: "Advanced Prompts and Workflows",
//       subContent: [ "Use stepwise refinement and follow ups", "Create reusable prompt templates",
//         "Integrate prompts into daily tasks"
//       ],
//       courseId: "0714cc29-858b-4ebb-990f-7e051a9c629d",
//       createdAt: 2026-01-12T10:30:38.145Z,
//       updatedAt: 2026-01-12T10:30:38.145Z,
//       chapterSlides: [],
//     }
//   ],
// }
