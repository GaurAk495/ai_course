import { ai } from "@/lib/ai";
import prisma from "@/lib/prisma";
import { Course_config_prompt } from "@/lib/prompt";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { CourseConfigSchema } from "./schemaType";
import { getErrorMessage } from "@/lib/utils";
import { ThinkingLevel } from "@google/genai";

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

    const model = "gemini-2.5-flash";
    const config = {
      thinkingConfig:
        model !== "gemini-2.5-flash"
          ? { thinkingLevel: ThinkingLevel.MEDIUM }
          : { thinkingBudget: 8082 },
      responseMimeType: "application/json",
      responseJsonSchema: CourseConfigSchema.toJSONSchema(),
      systemInstruction: [
        {
          text: Course_config_prompt,
        },
      ],
    };

    const contents = [
      {
        role: "user",
        parts: [
          {
            text: "The Course is about: " + userInput,
          },
        ],
      },
    ];

    let aiResponse;
    try {
      aiResponse = await ai.models.generateContent({ model, contents, config });
    } catch (error) {
      console.error("AI generation error:", error);
      return NextResponse.json(
        { message: "AI generation failed" },
        { status: 502 }
      );
    }
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
      console.error("AI JSON parse error:", err);
      return NextResponse.json(
        { message: "Invalid JSON returned by AI" },
        { status: 502 }
      );
    }

    const parsed = CourseConfigSchema.safeParse(courseJson);
    if (!parsed.success) {
      console.error("Schema validation error:", z.treeifyError(parsed.error));
      return NextResponse.json(
        {
          message: "AI response does not match expected schema",
          errors: z.treeifyError(parsed.error),
        },
        { status: 422 }
      );
    }

    const {
      courseSlug,
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
          courseSlug,
          courseName,
          courseDescription,
          level,
          totalChapters,
          userId,
        },
      });

      await tx.chapter.createMany({
        data: chapters.map((chapter) => ({
          chapterSlug: chapter.chapterSlug,
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
    return NextResponse.json(
      { error: getErrorMessage({ error, method: "POST", path: "/course" }) },
      { status: 500 }
    );
  }
}
