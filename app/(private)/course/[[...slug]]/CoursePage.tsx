"use client";
import { BookOpen, ChartNoAxesColumnIncreasingIcon, Stars } from "lucide-react";
import { notFound, useParams } from "next/navigation";
import { getCourse } from "./action";
import { Player } from "@remotion/player";
import VideoPreview from "./VideoPreview";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import axios from "axios";

type CourseType = Awaited<ReturnType<typeof getCourse>>["course"];
type ChapterType = NonNullable<CourseType>["chapters"][number];

function CoursePage({ course }: { course: CourseType }) {
  if (course === null) {
    return notFound();
  }
  return (
    <>
      <CourseHero course={course} />
      <CoursePreview course={course} />
    </>
  );
}

function CourseHero({ course }: { course: NonNullable<CourseType> }) {
  return (
    <div className="px-4 mt-4 ">
      <div className="max-w-7xl flex flex-col gap-5 items-center md:flex-row md:items-center md:justify-between md:gap-4 mx-auto px-4 py-12 md:p-12 rounded-lg bg-linear-to-br from-primary dark:from-blue-800/70 to-green-500 dark:to-green-500/80 ">
        <div className="max-w-2xl flex flex-col items-center sm:items-start ">
          <span className="text-sm w-fit flex items-center gap-1 px-2 py-1 rounded-full border border-white/25 mb-4 backdrop-blur-md bg-primary/20 dark:bg-accent inset-shadow-md inset-shadow-black/50 ">
            <Stars size={12} /> Course Preview
          </span>
          <h2 className="text-xl md:text-2xl text-center sm:text-left font-semibold text-foreground mb-3 text-balance">
            {course.courseName}
          </h2>
          <p className="text-sm text-center sm:text-left text-balance text-muted-foreground mb-3">
            {course.courseDescription}
          </p>

          <div className="flex items-center gap-2">
            <div className="text-sm text-foreground flex items-center gap-1 p-2 px-2 rounded-full border border-white/25">
              <ChartNoAxesColumnIncreasingIcon
                size={16}
                className="text-blue-600 font-semibold"
              />
              {course.level}
            </div>
            <div className="text-sm text-foreground flex items-center gap-1 p-2 px-2 rounded-full border border-white/25">
              <BookOpen size={16} className="text-green-500 font-semibold" />{" "}
              {course.chapters.length} Chapters
            </div>
          </div>
        </div>
        <div className="max-w-xl w-full aspect-video">
          <Player
            component={VideoPreview}
            durationInFrames={120}
            fps={30}
            compositionWidth={1280}
            compositionHeight={720}
            controls={true}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: ".6rem",
            }}
            acknowledgeRemotionLicense={true}
          />
        </div>
      </div>
    </div>
  );
}

function CoursePreview({ course }: { course: NonNullable<CourseType> }) {
  const [isGeneratingChapter, setIsGeneratingChapter] = useState(false);
  const handleOnGenerate = (value: boolean) => setIsGeneratingChapter(value);
  return (
    <div className="px-4 -mt-4 md:-mt-6">
      <div className="max-w-6xl mx-auto p-4 md:p-10 rounded-lg border border-foreground/25 bg-white/5 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold">Course Preview</div>
          <div className="text-sm text-muted-foreground">
            Chapter & short preview
          </div>
        </div>
        <div className="space-y-5">
          {course.chapters.map((chapter, index) => (
            <Chapter
              chapter={chapter}
              index={index}
              key={chapter.id}
              isGeneratingChapter={isGeneratingChapter}
              handleOnGenerate={handleOnGenerate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Chapter({
  chapter,
  index,
  isGeneratingChapter,
  handleOnGenerate,
}: {
  chapter: ChapterType;
  index: number;
  isGeneratingChapter: boolean;
  handleOnGenerate: (value: boolean) => void;
}) {
  const { slug } = useParams();
  const [courseId, courseSlug] = slug || [];
  const generateSlide = async () => {
    const toastId = toast.loading("Generating Chapter...");
    try {
      handleOnGenerate(true);
      //generating chapter
      const response = await axios.post("/api/course/generate_chapter", {
        chapterId: chapter.id,
        courseId,
        courseSlug,
      });

      toast.success("Chapter generated successfully", { id: toastId });
    } catch (error) {
      let errorMessage = "Failed to generate chapter";

      if (axios.isAxiosError(error)) {
        errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, { id: toastId });
    } finally {
      handleOnGenerate(false);
    }
  };
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
            {chapter.subContent.map((subContent, index) => (
              <ChapterSubContent key={index} subContent={subContent} />
            ))}
          </div>
          {chapter.chapterSlides.length === 0 ? (
            <Button
              onClick={generateSlide}
              disabled={isGeneratingChapter}
              variant={"outline"}
              className="border px-6 text-sm py-2 rounded-sm "
            >
              Generate Slides
            </Button>
          ) : (
            <Button
              disabled={isGeneratingChapter}
              variant={"outline"}
              className="border px-6 text-sm py-2 rounded-sm "
            >
              View Slides
            </Button>
          )}
        </div>
      </div>
      <div className="w-full md:w-96 aspect-video">
        <Player
          component={VideoPreview}
          durationInFrames={120}
          fps={30}
          compositionWidth={1280}
          compositionHeight={720}
          controls={true}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: ".6rem",
          }}
          acknowledgeRemotionLicense
        />
      </div>
    </div>
  );
}

function ChapterSubContent({ subContent }: { subContent: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="text-xs text-muted-foreground">-</div>
      {subContent}
    </div>
  );
}

export default CoursePage;
