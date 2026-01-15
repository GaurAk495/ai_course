import { getCourse } from "./action";

export type CourseType = Awaited<ReturnType<typeof getCourse>>["course"];
export type ChapterType = NonNullable<CourseType>["chapters"][number];
