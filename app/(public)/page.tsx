import { InputGroupCustom } from "@/components/ui/InputGroupCustom";
import { QuickVideoSuggestion } from "./pageClient";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CourseItemType, getGeneratedCourses } from "./action";

export default function Home() {
  return (
    <>
      <Hero />
    </>
  );
}

function Hero() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-2  relative">
      <div className="pt-10 md:pt-24 text-center">
        <h1 className="text-3xl font-bold md:text-5xl mb-4">
          Learn Smarter with{" "}
          <span className="text-primary">Ai Video Courses</span>
        </h1>
        <p className="text-lg md:text-2xl mb-6 text-muted-foreground">
          Watch video tutorials and learn at your own pace.
        </p>
      </div>
      <InputGroupCustom />
      <QuickVideoSuggestion />
      <GeneratedCourses />
      <HeroAnimation />
    </div>
  );
}

function HeroAnimation() {
  return (
    <div className="absolute inset-0 -z-1">
      <div className="absolute w-52 h-52 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary/10 blur-3xl rounded-full" />
      <div className="absolute w-52 h-52 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary/10 blur-3xl rounded-full" />
      <div className="absolute w-52 h-52 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary/10 blur-3xl rounded-full" />
    </div>
  );
}

async function GeneratedCourses() {
  const courses = await getGeneratedCourses();
  return (
    <div className="py-10">
      <h2 className="text-3xl font-bold text-center mb-6">My Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}

function CourseCard({ course }: { course: CourseItemType }) {
  return (
    <div className="dark:bg-white/10 bg-black/10 backdrop-blur-sm p-4 rounded-sm">
      <h3 className="text-semibold text-lg mb-2 line-clamp-1">
        {course.courseName}
      </h3>
      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
        {course.courseDescription}
      </p>
      <div className="flex items-center justify-start gap-2 mb-2">
        <p className="text-sm text-muted-foreground px-2 py-1 rounded-2xl border border-muted-foreground">
          {course.totalChapters} Chapters
        </p>
        <p className="text-sm text-muted-foreground px-2 py-1 rounded-2xl border border-muted-foreground">
          {course.level}
        </p>
      </div>
      <p className="text-[12px] inline-flex items-center">
        <CalendarIcon size={12} className="mr-2" />
        {course.createdAt.toDateString()}
      </p>
      <Link
        href={`/course/${course.courseSlug}/${course.id}`}
        className="cursor-pointer"
      >
        <Button className="w-full mt-4">Watch Now</Button>
      </Link>
    </div>
  );
}
