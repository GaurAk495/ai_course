import prisma from "@/lib/prisma";

import axios from "axios";
import { Generate_Video_Prompt } from "./chapterSlideGeneratePrompt";
import { pollinationsToken } from "@/lib/polai";

export const getChapter = async (chapterId: string) => {
  return await prisma.chapter.findUnique({
    where: {
      id: chapterId,
    },
    include: {
      chapterSlides: true,
    },
    omit: {
      createdAt: true,
      updatedAt: true,
    },
  });
};

type ChapterData = NonNullable<Awaited<ReturnType<typeof getChapter>>>;

export const aiChapterSlidesGenerate = async (chapter: ChapterData) => {
  const res = await axios.post(
    "https://gen.pollinations.ai/v1/chat/completions",
    {
      model: "openai",
      messages: [
        {
          role: "system",
          content: Generate_Video_Prompt,
        },
        {
          role: "user",
          content: JSON.stringify(chapter),
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${pollinationsToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return res.data.choices[0].message.content;
};

export const dummySlidesData = [
  {
    slideSlug: "getting-started-with-chatgpt-01",
    slideIndex: 1,
    title: "What ChatGPT Can and Cannot Do",
    subtitle: "Core capabilities and practical limits",
    audioFileName: "getting-started-with-chatgpt-01.mp3",
    narration: {
      fullText:
        "In this slide we outline what ChatGPT excels at and where it has limits. It can generate ideas, summarize text, and assist with drafts, but it may occasionally produce incorrect or fabricated information. Recognizing these strengths and limitations helps you set realistic expectations and use it more effectively.",
    },
    html: "<script src='https://cdn.tailwindcss.com'></script><style>.reveal { opacity:0; transform:translateY(12px); } .reveal.is-on { opacity:1; transform:translateY(0); } .bg-grad { background: linear-gradient(135deg,#0f172a 0%,#0b1220 100%); } .card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.04); padding: 18px; border-radius:8px; }</style><div style='width:1280px;height:720px;' class='bg-grad text-white font-sans p-10 flex flex-col'> <header class='flex items-center justify-between mb-6'> <div> <div class='text-sm text-gray-300'>Getting Started with ChatGPT</div> <div class='text-2xl font-semibold mt-1'>Overview</div> </div> <div class='text-xs text-gray-400'>Slide 1 of 3</div> </header> <main class='flex-1 grid grid-cols-12 gap-6'> <section class='col-span-7 flex flex-col justify-center'> <h1 class='text-5xl font-bold leading-tight'>What ChatGPT Can and Cannot Do</h1> <p class='text-gray-300 mt-3 text-lg'>Core capabilities and practical limits to keep in mind as you start using the tool.</p> </section> <aside class='col-span-5 flex flex-col gap-4'> <div class='card reveal' data-reveal='r1'> <h3 class='text-lg font-medium'>Strengths</h3> <p class='text-gray-300 mt-1'>Creative generation, summarization, brainstorming, and drafting support.</p> </div> <div class='card reveal' data-reveal='r2'> <h3 class='text-lg font-medium'>Limitations</h3> <p class='text-gray-300 mt-1'>May hallucinate facts, can be out of date, and might miss nuance without clear prompts.</p> </div> <div class='card reveal' data-reveal='r3'> <h3 class='text-lg font-medium'>Practical Tip</h3> <p class='text-gray-300 mt-1'>Verify critical information and pair outputs with trusted sources or human review.</p> </div> </aside> </main> </div>",
    revelData: ["r1", "r2", "r3"],
  },
  {
    slideSlug: "getting-started-with-chatgpt-02",
    slideIndex: 2,
    title: "Define Clear Productivity Goals",
    subtitle: "Set outcomes and success metrics",
    audioFileName: "getting-started-with-chatgpt-02.mp3",
    narration: {
      fullText:
        "Setting clear productivity goals focuses your use of ChatGPT toward measurable outcomes. Decide which tasks you want to automate, accelerate, or improve and choose success metrics like time saved or drafts produced. Starting with small, well-defined goals makes it easier to iterate and scale successful workflows.",
    },
    html: "<script src='https://cdn.tailwindcss.com'></script><style>.reveal { opacity:0; transform:translateY(12px); } .reveal.is-on { opacity:1; transform:translateY(0); } .bg-grad { background: linear-gradient(135deg,#071029 0%,#08101a 100%); } .card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.04); padding: 16px; border-radius:8px; }</style><div style='width:1280px;height:720px;' class='bg-grad text-white font-sans p-10 flex flex-col'> <header class='flex items-center justify-between mb-6'> <div> <div class='text-sm text-gray-300'>Getting Started with ChatGPT</div> <div class='text-2xl font-semibold mt-1'>Goals</div> </div> <div class='text-xs text-gray-400'>Slide 2 of 3</div> </header> <main class='flex-1 grid grid-cols-12 gap-6'> <section class='col-span-7 flex flex-col justify-center'> <h1 class='text-5xl font-bold leading-tight'>Define Clear Productivity Goals</h1> <p class='text-gray-300 mt-3 text-lg'>Turn ad-hoc use into measurable improvements with focused objectives.</p> </section> <aside class='col-span-5 flex flex-col gap-4'> <div class='card reveal' data-reveal='r1'> <h3 class='text-lg font-medium'>Choose an Outcome</h3> <p class='text-gray-300 mt-1'>Examples: faster reports, higher-quality emails, or prototype code generation.</p> </div> <div class='card reveal' data-reveal='r2'> <h3 class='text-lg font-medium'>Define Metrics</h3> <p class='text-gray-300 mt-1'>Measure time saved, drafts produced, or reduction in review cycles.</p> </div> <div class='card reveal' data-reveal='r3'> <h3 class='text-lg font-medium'>Iterate</h3> <p class='text-gray-300 mt-1'>Start small, refine prompts and steps, then scale what works.</p> </div> </aside> </main> </div>",
    revelData: ["r1", "r2", "r3"],
  },
  {
    slideSlug: "getting-started-with-chatgpt-03",
    slideIndex: 3,
    title: "Choose the Right Interface and Tools",
    subtitle: "Select interfaces, integrations, and plugins",
    audioFileName: "getting-started-with-chatgpt-03.mp3",
    narration: {
      fullText:
        "Selecting the right interface and tools helps you apply ChatGPT where it fits best in your workflow. Consider the web app for exploration, the API for automation, or plugins and extensions for task-specific integration. Match tool capabilities to your security, collaboration, and automation needs before adopting them widely.",
    },
    html: "<script src='https://cdn.tailwindcss.com'></script><style>.reveal { opacity:0; transform:translateY(12px); } .reveal.is-on { opacity:1; transform:translateY(0); } .bg-grad { background: linear-gradient(135deg,#081226 0%,#061222 100%); } .card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.04); padding: 16px; border-radius:8px; }</style><div style='width:1280px;height:720px;' class='bg-grad text-white font-sans p-10 flex flex-col'> <header class='flex items-center justify-between mb-6'> <div> <div class='text-sm text-gray-300'>Getting Started with ChatGPT</div> <div class='text-2xl font-semibold mt-1'>Tools & Interfaces</div> </div> <div class='text-xs text-gray-400'>Slide 3 of 3</div> </header> <main class='flex-1 grid grid-cols-12 gap-6'> <section class='col-span-7 flex flex-col justify-center'> <h1 class='text-5xl font-bold leading-tight'>Choose the Right Interface and Tools</h1> <p class='text-gray-300 mt-3 text-lg'>Pick the platform and integrations that match your use case and constraints.</p> </section> <aside class='col-span-5 flex flex-col gap-4'> <div class='card reveal' data-reveal='r1'> <h3 class='text-lg font-medium'>Web App</h3> <p class='text-gray-300 mt-1'>Great for exploration, prototyping, and one-off tasks.</p> </div> <div class='card reveal' data-reveal='r2'> <h3 class='text-lg font-medium'>API</h3> <p class='text-gray-300 mt-1'>Use for automation, batch processing, and embedding into systems.</p> </div> <div class='card reveal' data-reveal='r3'> <h3 class='text-lg font-medium'>Plugins & Extensions</h3> <p class='text-gray-300 mt-1'>Add task-specific features, but review permissions and security before enabling.</p> </div> </aside> </main> </div>",
    revelData: ["r1", "r2", "r3"],
  },
];
