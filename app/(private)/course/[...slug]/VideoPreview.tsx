// CourseComposition.tsx
import React, { useEffect, useMemo, useRef } from "react";
import {
  AbsoluteFill,
  Sequence,
  Audio,
  useVideoConfig,
  useCurrentFrame,
} from "remotion";

/* ---------------------------------- Types --------------------------------- */

type Slide = {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  slideSlug: string;
  slideIndex: number;
  subtitle: string;
  html: string;
  narration: string;
  audioFileName: string;
  audioLengthInSeconds: number;
  audioUrl: string;
  revelData: string[];
  captions: [
    {
      endMs: number;
      startMs: number;
      word: string;
      pitchScaleMaximum: number;
      pitchScaleMinimum: number;
      sourceWordIndex: number;
    }
  ];
  chapterId: string;
};

/* ----------------------- Reveal runtime (iframe side) ------------------------ */

const REVEAL_RUNTIME_SCRIPT = `
<script>
(function () {
  function reset() {
    document.querySelectorAll(".reveal").forEach(el =>
      el.classList.remove("is-on")
    );
  }

  function reveal(id) {
    var el = document.querySelector("[data-reveal='" + id + "']");
    if (el) el.classList.add("is-on");
  }

  window.addEventListener("message", function (e) {
    var msg = e.data;
    if (!msg) return;
    if (msg.type === "RESET") reset();
    if (msg.type === "REVEAL") reveal(msg.id);
  });
})();
</script>
`;

const injectRevealRuntime = (html: string) => {
  if (html.includes("</body>")) {
    return html.replace("</body>", `${REVEAL_RUNTIME_SCRIPT}</body>`);
  }
  return html + REVEAL_RUNTIME_SCRIPT;
};

/* ----------------------- Slide with reveal control -------------------------- */

const SlideIFrameWithReveal = ({ slide }: { slide: Slide }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = React.useState(false);
  const revealPlan = useMemo(() => {
    const ids = slide.revelData ?? [];
    const chunks = convertWordCaptionsToChunks(slide.captions).chunks ?? [];
    return ids.map((id, i) => ({
      id,
      at: chunks[i]?.timestamp?.[0] ?? 0,
    }));
  }, [slide.revelData, slide.captions]);

  // ✅ On load: mark ready + do a clean reset once
  const handleLoad = () => {
    setReady(true);
    iframeRef.current?.contentWindow?.postMessage({ type: "RESET" }, "*");
  };

  // ✅ SCRUB-SAFE: Every render tick, ensure all items that should be visible are visible
  useEffect(() => {
    if (!ready) return;
    const win = iframeRef.current?.contentWindow;
    if (!win) return;

    // If user scrubbed backward, we need to re-apply from scratch:
    // simplest: RESET then re-REVEAL all steps up to "time"
    win.postMessage({ type: "RESET" }, "*");

    for (const step of revealPlan) {
      if (time >= step.at) {
        win.postMessage({ type: "REVEAL", id: step.id }, "*");
      }
    }
  }, [time, ready, revealPlan]);
  return (
    <AbsoluteFill>
      <iframe
        ref={iframeRef}
        srcDoc={injectRevealRuntime(slide.html)}
        onLoad={handleLoad}
        sandbox="allow-scripts allow-same-origin"
        style={{ width: 1280, height: 720, border: "none" }}
      />
      <CaptionOverlay captions={slide.captions} />
      <Audio src={slide.audioUrl} />
    </AbsoluteFill>
  );
};

/* -------------------------- Course Composition ------------------------------- */
type Props = {
  slides: Slide[];
  durationsBySlideId: Record<string, number>;
};
export const CourseComposition = ({ slides, durationsBySlideId }: Props) => {
  const { fps } = useVideoConfig();
  const GAP_SECONDS = 1;
  const GAP_FRAMES = Math.round(GAP_SECONDS * fps);

  const timeline = useMemo(() => {
    let from = 0;
    const BUFFER_SECONDS = 0.5; // Extra time so it doesn't feel cut off
    const BUFFER_FRAMES = Math.round(BUFFER_SECONDS * fps);

    return slides.map((slide) => {
      const rawValue = durationsBySlideId[slide.id];

      // Convert seconds to frames AND add the buffer
      const dur = rawValue
        ? Math.round(rawValue * fps) + BUFFER_FRAMES
        : Math.ceil(6 * fps);

      const item = { slide, from, dur };

      // Move the 'from' point for the next slide
      // This includes the slide duration + your 1s GAP
      from += dur + GAP_FRAMES;

      return item;
    });
  }, [slides, durationsBySlideId, fps, GAP_FRAMES]);

  return (
    <AbsoluteFill>
      {timeline.map(({ slide, from, dur }) => {
        return (
          <Sequence key={from} from={from} durationInFrames={dur}>
            <SlideIFrameWithReveal slide={slide} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

type CaptionChunk = {
  timestamp: [number, number];
  text: string;
};

type CaptionOutput = {
  chunks: CaptionChunk[];
};

function convertWordCaptionsToChunks(
  captions: Slide["captions"],
  options?: {
    maxWordsPerChunk?: number;
    pauseThresholdMs?: number;
  }
): CaptionOutput {
  const maxWords = options?.maxWordsPerChunk ?? 6;
  const pauseThreshold = options?.pauseThresholdMs ?? 400;
  const chunks: CaptionChunk[] = [];

  let currentWords: string[] = [];
  let chunkStart = captions[0]?.startMs ?? 0;

  for (let i = 0; i < captions.length; i++) {
    const current = captions[i];
    const prev = captions[i - 1];

    const isPause = prev && current.startMs - prev.endMs > pauseThreshold;

    if (currentWords.length >= maxWords || isPause) {
      chunks.push({
        timestamp: [chunkStart, prev!.endMs],
        text: currentWords.join(" "),
      });

      currentWords = [];
      chunkStart = current.startMs;
    }

    currentWords.push(current.word);
  }

  // push last chunk
  if (currentWords.length > 0) {
    const last = captions[captions.length - 1];
    chunks.push({
      timestamp: [chunkStart, last.endMs],
      text: currentWords.join(" "),
    });
  }

  return { chunks };
}

const CaptionOverlay = ({ captions }: { captions: Slide["captions"] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Convert captions to chunks (using your existing function)
  const { chunks } = useMemo(
    () => convertWordCaptionsToChunks(captions),
    [captions]
  );

  // Find which chunk to show based on the current time
  const currentChunk = chunks.find((chunk) => {
    const startFrame = (chunk.timestamp[0] / 1000) * fps;
    const endFrame = (chunk.timestamp[1] / 1000) * fps;
    return frame >= startFrame && frame <= endFrame;
  });

  if (!currentChunk) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 50,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none", // Don't block iframe clicks
      }}
    >
      <span
        style={{
          backgroundColor: "rgba(0,0,0,0.7)",
          color: "white",
          padding: "10px 20px",
          borderRadius: "10px",
          fontSize: "2.5rem",
          fontWeight: "bold",
          textAlign: "center",
          maxWidth: "80%",
          fontFamily: "sans-serif",
        }}
      >
        {currentChunk.text}
      </span>
    </div>
  );
};
