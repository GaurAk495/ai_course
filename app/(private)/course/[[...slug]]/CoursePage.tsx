import { BookOpen, ChartNoAxesColumnIncreasingIcon, Stars } from "lucide-react";
import { notFound } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { getCourse } from "./action";

type CourseType = Awaited<ReturnType<typeof getCourse>>["course"];

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
      <div className="max-w-7xl mx-auto px-4 py-12 md:p-12 rounded-lg bg-linear-to-br from-primary/8 via-blue-600/8 to-green-500/8 ">
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
      </div>
    </div>
  );
}

function CoursePreview({ course }: { course: NonNullable<CourseType> }) {
  return (
    <div className="px-4 -mt-4 md:-mt-6">
      <div className="max-w-6xl mx-auto p-4 md:p-10 rounded-lg border border-foreground/25 bg-background/95 dark:bg-foreground/5  backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold">Course Preview</div>
          <div className="text-sm text-muted-foreground">
            Chapter & short preview
          </div>
        </div>
        <div className="space-y-5">
          {course.chapters.map((chapter, index) => (
            <div
              key={chapter.id}
              className="flex flex-col-reverse justify-start gap-4 md:flex-row md:justify-between md:items-center border border-foreground/25 p-4 rounded-sm "
            >
              <div className="flex items-start gap-4">
                <div className="min-w-8 min-h-8 flex items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                  {index + 1}
                </div>
                <div>
                  <div className="font-semibold text-lg mb-2">
                    {chapter.chapterTitle}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {chapter.subContent.map((subContent, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="text-xs text-muted-foreground">-</div>
                        {subContent}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <Skeleton className="w-68 h-44" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CoursePage;
