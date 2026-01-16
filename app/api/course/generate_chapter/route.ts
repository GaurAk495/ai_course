import { getErrorMessage } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { aiChapterSlidesGenerate } from "./action";
import { ChapterSlideConfig } from "./chapterSlideGeneratePrompt";
import { textToSpeech, TextToSpeechResult } from "@/lib/generateAudio";
import prisma from "@/lib/prisma";

type ChapterBody = {
  chapterId: string;
  courseId: string;
  courseSlug: string;
};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<ChapterBody>;
  const { chapterId, courseId, courseSlug } = body;

  if (!chapterId || !courseId || !courseSlug) {
    return NextResponse.json(
      { message: "ChapterId not given" },
      { status: 400 }
    );
  }

  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    /* ---------------- Fetch & Lock Chapter (race-safe) ---------------- */
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: { chapterSlides: true },
    });

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

    // 🔧 FIX 1: status update isolated & quick
    await prisma.chapter.update({
      where: {
        id: chapterId,
        OR: [{ status: "Pending" }, { status: "Error" }],
      },
      data: { status: "InProgress" },
    });

    /* ---------------- Slide Content Generation ---------------- */
    let aiResponse: string;
    try {
      aiResponse = await aiChapterSlidesGenerate(chapter);
    } catch (error) {
      throw new Error("AI_GENERATION_FAILED");
    }

    if (!aiResponse) {
      throw new Error("AI_EMPTY_RESPONSE");
    }

    /* ---------------- Parse & Validate ---------------- */
    let chapterSlidesJson: unknown;
    try {
      chapterSlidesJson = JSON.parse(aiResponse);
    } catch {
      throw new Error("AI_INVALID_JSON");
    }

    const parsed = ChapterSlideConfig.safeParse(chapterSlidesJson);
    if (!parsed.success) {
      throw new Error("AI_SCHEMA_INVALID");
    }

    const chapterSlides = parsed.data;

    /* ---------------- Generating Audio (NO prisma here) ---------------- */
    const audioFiles: TextToSpeechResult[] = [];
    for (const slide of chapterSlides) {
      const audioFile = await textToSpeech({
        text: slide.narration.fullText,
        key: slide.audioFileName,
      });
      audioFiles.push(audioFile);
    }

    /* ---------------- Saving to Database (atomic) ---------------- */
    await prisma.$transaction(async (tx) => {
      await tx.chapterSlides.createMany({
        data: chapterSlides.map((slide, i) => ({
          slideSlug: slide.slideSlug,
          slideIndex: slide.slideIndex,
          title: slide.title,
          subtitle: slide.subtitle,
          html: slide.html,
          revelData: slide.revelData,
          narration: slide.narration,
          audioFileName: slide.audioFileName,
          audioLengthInSeconds: audioFiles[i].audioLengthInSeconds,
          audioUrl: audioFiles[i].url,
          captions: audioFiles[i].captions,
          chapterId,
        })),
      });

      await tx.chapter.update({
        where: { id: chapterId },
        data: { status: "Generated" },
      });
    });

    return NextResponse.json(
      { success: true, audioFiles, chapterSlides },
      { status: 201 }
    );
  } catch (error) {
    // 🔧 FIX 2: safe error update (never throw inside catch)
    try {
      await prisma.chapter.update({
        where: { id: chapterId },
        data: { status: "Error" },
      });
    } catch {
      // swallow db error to avoid masking original issue
    }

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
