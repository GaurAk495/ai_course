"use client";
import { useMemo } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Player } from "@remotion/player";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChapterSubContent } from "./chapter-sub-content";
import { ChapterType } from "./types";
import { calculateVideoDuration } from "./utility";
import { CourseComposition } from "./VideoPreview";

interface ChapterProps {
  chapter: ChapterType;
  index: number;
  isGeneratingChapter: boolean;
  handleOnGenerate: (value: boolean) => void;
}

export function ChapterCard({
  chapter,
  index,
  isGeneratingChapter,
  handleOnGenerate,
}: ChapterProps) {
  const { slug } = useParams();
  const router = useRouter();
  const slugArray = Array.isArray(slug) ? slug : [];
  const [courseId, courseSlug] = slugArray;
  if (!courseId || !courseSlug) {
    return notFound();
  }
  const slidesDuration = useMemo(() => {
    return chapter.chapterSlides.reduce((acc, slide) => {
      acc[slide.id] = slide.audioLengthInSeconds;
      return acc;
    }, {} as Record<string, number>);
  }, [chapter.chapterSlides]);

  const generateSlide = async () => {
    const toastId = toast.loading("Generating Chapter...");
    try {
      handleOnGenerate(true);
      await axios.post("/api/course/generate_chapter", {
        chapterId: chapter.id,
        courseId,
        courseSlug,
      });
      router.refresh();
      toast.success("Chapter generated successfully", { id: toastId });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed";
      toast.error(errorMessage, { id: toastId });
    } finally {
      handleOnGenerate(false);
    }
  };

  const totalDuration = calculateVideoDuration(
    chapter.chapterSlides,
    slidesDuration,
    30
  );

  return (
    <div className="flex flex-col-reverse justify-start gap-4 md:flex-row md:justify-between md:items-center border border-foreground/25 p-4 rounded-sm ">
      <div className="flex items-start gap-4">
        <div className="min-w-8 min-h-8 flex items-center justify-center rounded-2xl bg-accent text-accent-foreground">
          {index + 1}
        </div>
        <div>
          <div className="font-semibold text-lg mb-2">
            {chapter.chapterTitle}
          </div>
          <div className="text-sm text-muted-foreground mb-4">
            {chapter.subContent.map((sub, i) => (
              <ChapterSubContent key={i} subContent={sub} />
            ))}
          </div>

          {/* Action Buttons */}
          {chapter.status === "Pending" &&
            chapter.chapterSlides.length === 0 &&
            !isGeneratingChapter && (
              <Button
                onClick={generateSlide}
                variant="outline"
                className="border px-6 text-sm py-2 rounded-sm"
              >
                Generate Slides
              </Button>
            )}

          {(chapter.status === "InProgress" ||
            (isGeneratingChapter && chapter.status !== "Generated")) && (
            <Button
              disabled
              variant="outline"
              className="border px-6 text-sm py-2 rounded-sm"
            >
              Generating...
            </Button>
          )}

          {chapter.status === "Generated" && (
            <Button
              variant="outline"
              className="border px-6 text-sm py-2 rounded-sm"
            >
              Play Video
            </Button>
          )}
        </div>
      </div>

      <div className="w-full md:w-96 aspect-video">
        {chapter.status === "Generated" ? (
          <Player
            component={CourseComposition}
            inputProps={{
              // @ts-expect-error remotion-slides-error
              slides: chapter.chapterSlides,
              durationsBySlideId: slidesDuration,
            }}
            durationInFrames={totalDuration}
            fps={30}
            compositionWidth={1280}
            compositionHeight={720}
            controls
            style={{ width: "100%", height: "100%", borderRadius: ".6rem" }}
            acknowledgeRemotionLicense
          />
        ) : (
          <Skeleton className="w-full h-full flex justify-center items-center">
            <h1>Chapter is not Generated</h1>
          </Skeleton>
        )}
      </div>
    </div>
  );
}
