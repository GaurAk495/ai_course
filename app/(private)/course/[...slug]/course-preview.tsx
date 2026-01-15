"use client";
import { useState } from "react";
import { ChapterCard } from "./chapter-card";
import { CourseType } from "./types";
import { isChapterBeingGenerated } from "./utility";

export function CoursePreview({ course }: { course: NonNullable<CourseType> }) {
  const [isGeneratingChapter, setIsGeneratingChapter] = useState(() =>
    isChapterBeingGenerated(course)
  );

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
            <ChapterCard
              key={chapter.id}
              chapter={chapter}
              index={index}
              isGeneratingChapter={isGeneratingChapter}
              handleOnGenerate={setIsGeneratingChapter}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
