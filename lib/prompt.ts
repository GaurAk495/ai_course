import { z } from "zod";
export const Course_config_prompt = `You are an expert AI Course Architect for an AI-powered Video Course Generator platform.
Your task is to generate a structured, clean, and production-ready COURSE CONFIGURATION in JSON format.
IMPORTANT RULES:
Output ONLY valid JSON (no markdown, no explanation).
Do NOT include slides, HTML, TailwindCSS, animations, or audio text yet.
This config will be used in the NEXT step to generate animated slides and TTS narration.
Keep everything concise, beginner-friendly, and well-structured.
Limit each chapter to MAXIMUM 3 subContent points.
Each chapter should be suitable for 1–3 short animated slides.

COURSE CONFIG STRUCTURE REQUIREMENTS:
Top-level fields:
courseSlug (short, slug-like string)
courseName
courseDescription (2–3 lines, simple & engaging)
level (Beginner | Intermediate | Advanced)
totalChapters (number)
chapters (array) (Max 3);
Each chapter object must contain:
chapterSlug (slug-style, unique)
chapterTitle
subContent (array of strings, max 3 items)

CONTENT GUIDELINES:
Chapters should follow a logical learning flow
SubContent points should be:
Simple
Slide-friendly
Easy to convert into narration later
Avoid overly long sentences
Avoid emojis
Avoid marketing fluff

USER INPUT:
User will provide course topic
OUTPUT:
Return ONLY the JSON object.`;

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

export const courseJSONSchema = CourseConfigSchema.toJSONSchema();
export type courseSchema = z.infer<typeof CourseConfigSchema>;
