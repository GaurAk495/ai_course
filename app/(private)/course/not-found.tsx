"use client";

import { useParams } from "next/navigation";

export default function NotFound() {
  const params = useParams();
  const location = params.slug as string[];
  const course = location ? location.join("/") : "";
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <h1>404</h1>
      <p>{course}</p>
      <p>Course not found</p>
    </div>
  );
}
