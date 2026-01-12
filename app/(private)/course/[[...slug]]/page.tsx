import { notFound } from "next/navigation";
import { getCourse } from "./action";
import CoursePage from "./CoursePage";

async function page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  if (!slug || slug.length !== 2) {
    return notFound();
  }

  const [_, courseId] = slug;
  const { course, error } = await getCourse(courseId);
  if (error || !course) {
    return notFound();
  }

  return <CoursePage course={course} />;
}

export default page;
