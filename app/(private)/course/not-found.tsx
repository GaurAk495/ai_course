"use client";

import { useParams } from "next/navigation";

export default function NotFound() {
  const params = useParams();
  const location = params.slug as string[];
  const course = location ? location.join("/") : "";
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
      <h1>404</h1>
      <p>{course}</p>
      <p>Course not found</p>
    </div>
  );
}
