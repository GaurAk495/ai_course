"use client";
import { notFound } from "next/navigation";
import { CourseType } from "./types";
import { CourseHero } from "./course-hero";
import { CoursePreview } from "./course-preview";

export default function CoursePage({ course }: { course: CourseType }) {
  if (!course) {
    return notFound();
  }

  return (
    <div className="pb-20">
      <CourseHero course={course} />
      <CoursePreview course={course} />
    </div>
  );
}
