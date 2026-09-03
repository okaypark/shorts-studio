/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Happy coding and building amazing videos! 🎉
 */

"use client";

import { spring, useCurrentFrame, useVideoConfig } from "remotion";

interface CardFlipProps {
  frontText?: string;
  backText?: string;
  frontTextColor?: string;
  backTextColor?: string;
  frontBackgroundColor?: string;
  backBackgroundColor?: string;
  fontSize?: string;
  width?: string;
  height?: string;
  borderRadius?: string;
  borderColor?: string;
  borderWidth?: string;
  borderStyle?: "solid" | "dashed" | "dotted";
  durationInFrames?: number;
  damping?: number;
  mass?: number;
  stiffness?: number;
  boxShadow?: string;
}

export default function CardFlip({
  frontText = "Clippk.it",
  backText = "Remotion",
  frontTextColor = "var(--card-foreground)",
  backTextColor = "var(--card-foreground)",
  frontBackgroundColor = "var(--muted)",
  backBackgroundColor = "var(--card)",
  fontSize = "1.25rem",
  width = "200px",
  height = "280px",
  borderRadius = "15px",
  borderColor = "var(--ring)",
  borderWidth = "1px",
  borderStyle = "solid",
  durationInFrames = 70,
  damping = 18,
  mass = 0.5,
  stiffness = 100,
  boxShadow = `0 1px 3px var(--border), 0 6px 12px oklch(from var(--border) calc(l - 0.1) c h / 30%)`,
}: CardFlipProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rotation = spring({
    frame,
    fps,
    from: 0,
    to: 360,
    durationInFrames,
    config: {
      damping,
      mass,
      stiffness,
    },
  });

  const commonFaceStyle: React.CSSProperties = {
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    borderRadius,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize,
    fontWeight: "bold",
    padding: "10px",
    boxSizing: "border-box",
    borderWidth,
    borderStyle,
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        perspective: "1200px",
        perspectiveOrigin: "50% 50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <div
        style={{
          width,
          height,
          transform: `rotateY(${rotation}deg)`,
          transformStyle: "preserve-3d",
          position: "relative",
          boxShadow,
          borderRadius,
        }}
      >
        <div
          style={{
            ...commonFaceStyle,
            background: frontBackgroundColor,
            color: frontTextColor,
            borderColor: borderColor,
          }}
        >
          {frontText}
        </div>
        <div
          style={{
            ...commonFaceStyle,
            background: backBackgroundColor,
            color: backTextColor,
            borderColor: borderColor,
            transform: "rotateY(180deg)",
          }}
        >
          {backText}
        </div>
      </div>
    </div>
  );
}
