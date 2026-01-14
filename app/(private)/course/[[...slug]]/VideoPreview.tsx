import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

export default function VideoPreview() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opacity = frame / durationInFrames;
  return (
    <AbsoluteFill className="bg-black justify-center items-center">
      <h1 className="text-5xl" style={{ opacity }}>
        VideoPreview
      </h1>
    </AbsoluteFill>
  );
}
