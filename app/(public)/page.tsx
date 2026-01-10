import { InputGroupCustom } from "@/components/ui/InputGroupCustom";
import styles from "./page.module.css";
import { cn } from "@/lib/utils";

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
      <div className="pt-24 text-center">
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

export const QUICK_VIDEO_SUGGESTIONS = [
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

function QuickVideoSuggestion() {
  return (
    <div className="max-w-xl mx-auto flex flex-wrap gap-2 mt-4 items-center justify-center">
      {QUICK_VIDEO_SUGGESTIONS.map((suggestion) => (
        <div key={suggestion.id} className="bg-card p-3 rounded-md shadow-sm">
          <h3 className="text-sm font-semibold">{suggestion.title}</h3>
        </div>
      ))}
    </div>
  );
}
