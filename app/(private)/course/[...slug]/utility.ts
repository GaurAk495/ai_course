import { getCourse } from "./action";

type CourseType = Awaited<ReturnType<typeof getCourse>>["course"];
type ChapterType = NonNullable<CourseType>["chapters"][number];

export const calculateVideoDuration = (
  slides: ChapterType["chapterSlides"],
  durationsBySlideId: Record<string, number>,
  fps: number
) => {
  const GAP_SECONDS = 1;
  const GAP_FRAMES = Math.round(GAP_SECONDS * fps);
  const BUFFER_FRAMES = Math.round(0.5 * fps); // That 0.5s buffer we added

  let totalFrames = 0;

  slides.forEach((slide, index) => {
    const rawDur = durationsBySlideId[slide.id] || 6; // default 6s
    const durInFrames = Math.round(rawDur * fps) + BUFFER_FRAMES;

    totalFrames += durInFrames;

    // Add the gap between slides, but NOT after the very last slide
    if (index < slides.length - 1) {
      totalFrames += GAP_FRAMES;
    }
  });

  // Add 1 extra frame to be safe
  return totalFrames + 1;
};

export const isChapterBeingGenerated = (course: NonNullable<CourseType>) => {
  return course.chapters.some((chapter) => chapter.status === "InProgress");
};
