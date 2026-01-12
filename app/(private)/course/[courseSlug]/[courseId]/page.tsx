import { notFound } from "next/navigation";

import { getCourse } from "./action";
import CoursePage from "./CoursePage";

async function page({
  params,
}: {
  params: Promise<{ courseSlug: string; courseId: string }>;
}) {
  const { courseSlug, courseId } = await params;
  if (!courseSlug || !courseId) {
    return notFound();
  }
  const { course, error } = await getCourse(courseId);
  if (error) {
    return notFound();
  }
  if (!course) {
    return notFound();
  }
  return <CoursePage course={course} />;
}

export default page;
