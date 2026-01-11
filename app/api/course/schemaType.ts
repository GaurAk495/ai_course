import { z } from "zod";

export const CourseConfigSchema = z
  .object({
    courseSlug: z
      .string()
      .regex(/^[a-z0-9-]+$/)
      .describe(
        "A short, slug-style unique identifier for the course. Use lowercase letters, numbers, and hyphens only."
      ),

    courseName: z
      .string()
      .min(1)
      .describe("The human-readable title of the course."),

    courseDescription: z
      .string()
      .min(20)
      .max(300)
      .describe(
        "A simple and engaging 2–3 line description explaining what the course teaches."
      ),

    level: z
      .enum(["Beginner", "Intermediate", "Advanced"])
      .describe("The difficulty level of the course."),

    totalChapters: z
      .number()
      .int()
      .min(1)
      .max(3)
      .describe(
        "The total number of chapters in the course. Must match the length of the chapters array."
      ),

    chapters: z
      .array(
        z.object({
          chapterSlug: z
            .string()
            .regex(/^[a-z0-9-]+$/)
            .describe("A slug-style unique identifier for the chapter."),

          chapterTitle: z.string().min(1).describe("The title of the chapter."),

          subContent: z
            .array(
              z
                .string()
                .describe(
                  "A short, slide-friendly learning point suitable for narration."
                )
            )
            .min(1)
            .max(3)
            .describe(
              "Key learning points for the chapter. Maximum of 3 items."
            ),
        })
      )
      .min(1)
      .max(3)
      .describe("An ordered list of chapters. Maximum of 3 chapters."),
  })
  .refine((data) => data.totalChapters === data.chapters.length, {
    message:
      "totalChapters must exactly match the number of chapters provided.",
    path: ["totalChapters"],
  });
