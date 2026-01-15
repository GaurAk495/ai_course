"use client";
import { useMemo } from "react";
import { BookOpen, ChartNoAxesColumnIncreasingIcon, Stars } from "lucide-react";
import { Player } from "@remotion/player";
import { CourseType } from "./types";
import { calculateVideoDuration } from "./utility";
import { CourseComposition } from "./VideoPreview";

export function CourseHero({ course }: { course: NonNullable<CourseType> }) {
  const allSlides = useMemo(
    () => course.chapters.flatMap((c) => c.chapterSlides),
    [course]
  );

  const slidesDuration = useMemo(() => {
    return allSlides.reduce((acc, slide) => {
      acc[slide.id] = slide.audioLengthInSeconds;
      return acc;
    }, {} as Record<string, number>);
  }, [allSlides]);

  const totalDuration = calculateVideoDuration(allSlides, slidesDuration, 30);
  const isCourseGenerated = allSlides.length > 0;

  return (
    <div className="px-4 mt-4 ">
      <div className="max-w-7xl flex flex-col gap-5 items-center md:flex-row md:items-center md:justify-between md:gap-4 mx-auto px-4 py-12 md:p-12 rounded-lg bg-linear-to-br from-primary dark:from-blue-800/70 to-green-500 dark:to-green-500/80 ">
        <div className="max-w-2xl flex flex-col items-center sm:items-start ">
          <span className="text-sm w-fit flex items-center gap-1 px-2 py-1 rounded-full border border-white/25 mb-4 backdrop-blur-md bg-primary/20 dark:bg-accent inset-shadow-md inset-shadow-black/50 ">
            <Stars size={12} /> Course Preview
          </span>
          <h2 className="text-xl md:text-2xl text-center sm:text-left font-semibold mb-3">
            {course.courseName}
          </h2>
          <p className="text-sm text-center sm:text-left text-muted-foreground mb-3">
            {course.courseDescription}
          </p>

          <div className="flex items-center gap-2">
            <Badge
              icon={
                <ChartNoAxesColumnIncreasingIcon
                  size={16}
                  className="text-blue-600"
                />
              }
              label={course.level}
            />
            <Badge
              icon={<BookOpen size={16} className="text-green-500" />}
              label={`${course.chapters.length} Chapters`}
            />
          </div>
        </div>

        <div className="max-w-xl w-full aspect-video">
          {isCourseGenerated && (
            <Player
              component={CourseComposition}
              inputProps={{
                // @ts-expect-error remotion-slides-error
                slides: allSlides,
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
          )}
        </div>
      </div>
    </div>
  );
}

function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="text-sm text-foreground flex items-center gap-1 p-2 px-2 rounded-full border border-white/25">
      {icon} {label}
    </div>
  );
}
