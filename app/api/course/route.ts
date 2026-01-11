import { ai } from "@/lib/ai";
import prisma from "@/lib/prisma";
import { Course_config_prompt } from "@/lib/prompt";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

type courseBody = {
  userInput: string;
  type: string;
};

export async function POST(req: NextRequest) {
  try {
    /* ---------------- Auth ---------------- */
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    /* ---------------- Body ---------------- */
    const body = (await req.json()) as Partial<courseBody>;
    const userInput = body.userInput?.trim();

    if (!userInput) {
      return NextResponse.json(
        { message: "Invalid or empty input" },
        { status: 400 }
      );
    }

    /* ---------------- AI Generation ---------------- */
    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userInput,
      config: {
        systemInstruction: Course_config_prompt,
        responseMimeType: "application/json",
        responseJsonSchema: CourseConfigSchema.toJSONSchema(),
      },
    });

    const rawText = aiResponse.text;
    if (!rawText) {
      return NextResponse.json(
        { message: "AI returned empty response" },
        { status: 502 }
      );
    }

    /* ---------------- Parse & Validate ---------------- */
    let courseJson: unknown;
    try {
      courseJson = JSON.parse(rawText);
    } catch (err) {
      console.error("AI JSON parse error:", rawText);
      return NextResponse.json(
        { message: "Invalid JSON returned by AI" },
        { status: 502 }
      );
    }

    const parsed = CourseConfigSchema.safeParse(courseJson);
    if (!parsed.success) {
      console.error("Schema validation error:", parsed.error.format());
      return NextResponse.json(
        {
          message: "AI response does not match expected schema",
          errors: parsed.error.format(),
        },
        { status: 422 }
      );
    }

    const {
      courseId,
      courseName,
      courseDescription,
      level,
      totalChapters,
      chapters,
    } = parsed.data;

    /* ---------------- Database (Atomic) ---------------- */
    const result = await prisma.$transaction(async (tx) => {
      const course = await tx.course.create({
        data: {
          courseId,
          courseName,
          courseDescription,
          level,
          totalChapters,
          userId,
        },
      });

      await tx.chapter.createMany({
        data: chapters.map((chapter) => ({
          chapterId: chapter.chapterId,
          chapterTitle: chapter.chapterTitle,
          subContent: chapter.subContent,
          courseId: course.id,
        })),
      });

      return course;
    });

    /* ---------------- Response ---------------- */
    return NextResponse.json(
      {
        message: "success",
        courseId: result.id,
        course: parsed.data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /course error:", error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong";
}

const CourseConfigSchema = z
  .object({
    courseId: z
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
          chapterId: z
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
