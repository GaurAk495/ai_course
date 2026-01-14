import { getErrorMessage } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { aiChapterSlidesGenerate, dummySlidesData, getChapter } from "./action";
import z from "zod";
import { ChapterSlideConfig } from "./chapterSlideGeneratePrompt";
import { textToSpeech } from "@/lib/generateAudio";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type ChapterBody = {
  chapterId: string;
  courseId: string;
  courseSlug: string;
};

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = (await req.json()) as Partial<ChapterBody>;
    const { chapterId, courseId, courseSlug } = body;
    if (!chapterId || !courseId || !courseSlug) {
      return NextResponse.json(
        { message: "ChapterId not given" },
        { status: 400 }
      );
    }
    const chapter = await getChapter(chapterId);
    if (!chapter) {
      return NextResponse.json(
        { message: "Chapter with this id not found." },
        { status: 400 }
      );
    }
    if (chapter.chapterSlides.length > 0) {
      return NextResponse.json(
        { message: "Chapter already has slides." },
        { status: 400 }
      );
    }

    /* ---------------- Slide Content Generation ---------------- */
    let aiResponse;
    try {
      aiResponse = await aiChapterSlidesGenerate(chapter);
    } catch (error) {
      console.error("AI generation error:", error);
      return NextResponse.json(
        { message: "AI Chapter Slides generation failed" },
        { status: 502 }
      );
    }
    if (!aiResponse) {
      return NextResponse.json(
        { message: "AI returned empty response" },
        { status: 502 }
      );
    }
    /* ---------------- Parse & Validate ---------------- */
    let chapterSlidesJson: unknown;
    try {
      chapterSlidesJson = JSON.parse(aiResponse);
    } catch (err) {
      console.error("AI JSON parse error:", err);
      return NextResponse.json(
        { message: "Invalid JSON returned by AI" },
        { status: 502 }
      );
    }
    /* ---------------- Validate ---------------- */
    const parsed = ChapterSlideConfig.safeParse(chapterSlidesJson);
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
    const chapterSlides = parsed.data;
    console.log("chapterSlides", chapterSlides);
    // const chapterSlides = dummySlidesData;
    /* ---------------- Generating Audio ---------------- */
    const audioPromises = chapterSlides.map((slide) => {
      return textToSpeech({
        text: slide.narration.fullText,
        key: slide.audioFileName,
      });
    });
    const audioFiles = await Promise.all(audioPromises);
    // const audioFiles = dummyTexttoSpeech;
    console.log("audioFiles", audioFiles);

    /* ---------------- Saving to Database ---------------- */

    await prisma.chapterSlides.createMany({
      data: chapterSlides.map((slide, i) => ({
        slideSlug: slide.slideSlug,
        slideIndex: slide.slideIndex,
        title: slide.title,
        subtitle: slide.subtitle,
        html: slide.html,
        revelData: slide.revelData,
        narration: slide.narration,
        audioFileName: slide.audioFileName,
        audioUrl: audioFiles[i].url,
        captions: audioFiles[i].captions,
        chapterId: chapterId,
      })),
    });
    revalidatePath(`/course/${courseSlug}/${courseId}`);
    return NextResponse.json(
      { success: true, audioFiles, chapterSlides },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: getErrorMessage({
          error,
          method: "POST",
          path: "/course/generate_chapter",
        }),
      },
      { status: 500 }
    );
  }
}

const dummyTexttoSpeech = [
  {
    success: true,
    url: "https://store.flowton.online/tts/getting-started-with-chatgpt-01.mp3",
    wordDurations: [
      {
        endMs: 1,
        startMs: 1,
        word: "string",
        pitchScaleMaximum: 1.1,
        pitchScaleMinimum: 1.1,
        sourceWordIndex: 1,
      },
    ],
  },
  {
    success: true,
    url: "https://store.flowton.online/tts/getting-started-with-chatgpt-02.mp3",
    wordDurations: [
      {
        endMs: 1,
        startMs: 1,
        word: "string",
        pitchScaleMaximum: 1.1,
        pitchScaleMinimum: 1.1,
        sourceWordIndex: 1,
      },
    ],
  },
  {
    success: true,
    url: "https://store.flowton.online/tts/getting-started-with-chatgpt-03.mp3",
    wordDurations: [
      {
        endMs: 1,
        startMs: 1,
        word: "string",
        pitchScaleMaximum: 1.1,
        pitchScaleMinimum: 1.1,
        sourceWordIndex: 1,
      },
    ],
  },
];
