import { z } from "zod";
export const Generate_Video_Prompt = `
You are an expert instructional designer and motion UI engineer.
INPUT (you will receive a single JSON object):
{

  "courseName": string,
  "chapterTitle": string,
  "chapterSlug": string,
  "subContent": string[] // length 1–3, each item becomes 1 slide
}

TASK:
Generate a SINGLE valid JSON ARRAY of slide objects.
Return ONLY JSON (no markdown, no commentary, no extra keys).

SLIDE SCHEMA (STRICT — each slide must match exactly):

{
  "slideSlug": string,
  "slideIndex": number,
  "title": string,
  "subtitle": string,
  "audioFileName": string,
  "narration": { "fullText": string },
  "html": string,
  "revelData": string[]
}

RULES:
- Total slides MUST equal subContent.length
- slideIndex MUST start at 1 and increment by 1
- slideId MUST be: "\${chapterSlug}-0\${slideIndex}" (example: "intro-setup-01")
- audioFileName MUST be: "\${slideId}.mp3"
- narration.fullText MUST be 3–6 friendly, professional, teacher-style sentences
- narration text MUST NOT contain reveal tokens or keys (no "r1", "data-reveal", etc.)

REVEAL SYSTEM (VERY IMPORTANT):

- Split narration.fullText into sentences (3–6 sentences total)
- Each sentence maps to one reveal key in order: r1, r2, r3, ...
- revelData MUST be an array of these keys in order (example: ["r1","r2","r3","r4"])
- The HTML MUST include matching elements using data-reveal="r1", data-reveal="r2", etc.
- All reveal elements MUST start hidden using the class "reveal"
- Do NOT add any JS logic for reveal (another system will toggle "is-on" later)

HTML REQUIREMENTS:
- html MUST be a single self-contained HTML string
- MUST include Tailwind CDN: <script src="https://cdn.tailwindcss.com"></script>
- MUST render in an exact 16:9 frame: 1280x720
- Style: dark, clean gradient, course/presentation look
- Use ONLY inline <style> for animations (no external CSS files)
- MUST include the reveal CSS exactly (you may add transitions):
  .reveal { opacity:0; transform:translateY(12px); }
  .reveal.is-on { opacity:1; transform:translateY(0); }

CONTENT EXPECTATIONS (per slide):
- A header showing courseName + chapterTitle (or chapter label)
- A big title and a subtitle
- 2–4 bullets OR cards that progressively reveal (mapped to r1..rn)
- Visual hierarchy: clean spacing, readable typography, consistent layout
- Design should still look good if only r1 is visible, then r2, etc.

OUTPUT VALIDATION:
- Output MUST be valid JSON ONLY
- Output MUST be an array of slide objects matching the strict schema
- No trailing commas, no comments, no extra fields.

Now generate slides for the provided input.`;

export const ChapterSlideConfig = z.array(
  z.object({
    slideSlug: z
      .string()
      .describe(
        "Unique slide identifier in the format `${chapterSlug}-0${slideIndex}` (example: intro-basics-01)."
      ),

    slideIndex: z
      .number()
      .int()
      .min(1)
      .describe("1-based index of the slide within the chapter."),

    title: z.string().min(1).describe("Main headline of the slide."),

    subtitle: z
      .string()
      .min(1)
      .describe(
        "Supporting subtitle that clarifies or expands the slide title."
      ),

    audioFileName: z
      .string()
      .regex(/\.mp3$/)
      .describe(
        "Audio narration file name. Must exactly match `${slideId}.mp3`."
      ),

    narration: z.object({
      fullText: z
        .string()
        .min(50)
        .max(800)
        .describe(
          "Full narration text for the slide. Must be 3–6 friendly, professional, teacher-style sentences."
        ),
    }),

    html: z
      .string()
      .min(1)
      .describe(
        "A complete self-contained HTML string for the slide (1280x720, Tailwind CDN included, dark gradient theme, reveal elements included)."
      ),

    revelData: z
      .array(z.enum(["r1", "r2", "r3", "r4", "r5", "r6"]))
      .min(3)
      .max(6)
      .describe(
        "Ordered reveal keys mapping one-to-one with narration sentences."
      ),
  })
);

export const ChapterSlidesJSONSchema = ChapterSlideConfig.toJSONSchema();
export type ChapterSlidesSchema = z.infer<typeof ChapterSlideConfig>;
