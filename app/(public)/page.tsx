import { InputGroupCustom } from "@/components/ui/InputGroupCustom";
import { QuickVideoSuggestion } from "./pageClient";

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
