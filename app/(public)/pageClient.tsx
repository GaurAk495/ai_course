"use client";
import { usePrompt } from "@/components/context/promptContext";

export function QuickVideoSuggestion() {
  const { setInput } = usePrompt();
  return (
    <div className="max-w-xl mx-auto flex flex-wrap gap-2 mt-4 items-center justify-center">
      {QUICK_VIDEO_SUGGESTIONS.map((suggestion) => (
        <button
          key={suggestion.id}
          className="bg-card p-3 rounded-md shadow-sm cursor-pointer"
          onClick={() => setInput(suggestion.prompt)}
        >
          <span className="text-sm font-semibold">{suggestion.title}</span>
        </button>
      ))}
    </div>
  );
}

const QUICK_VIDEO_SUGGESTIONS = [
  {
    id: 1,
    title: "⚛️ React Basics",
    prompt:
      "Generate a beginner-friendly React.js video course explaining components, JSX, props, and state with examples",
  },
  {
    id: 2,
    title: "🐍 Python for Beginners",
    prompt:
      "Generate a Python beginner course covering variables, data types, loops, functions, and simple programs",
  },
  {
    id: 3,
    title: "🌐 HTML Fundamentals",
    prompt:
      "Generate an HTML basics video explaining tags, elements, forms, tables, and page structure",
  },
  {
    id: 4,
    title: "🎨 Tailwind CSS Mastery",
    prompt:
      "Generate a Tailwind CSS course showing utility classes, layout design, responsive UI, and animations",
  },
  {
    id: 5,
    title: "🧠 JavaScript Essentials",
    prompt:
      "Generate a JavaScript basics video covering variables, functions, arrays, objects, and DOM manipulation",
  },
  {
    id: 6,
    title: "🚀 Next.js Quick Start",
    prompt:
      "Generate a Next.js beginner course explaining routing, layouts, server components, and API routes",
  },
];
