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

interface FloatingCardProps {
  text?: string;
  textColor?: string;
  backgroundColor?: string;
  fontSize?: string;
  width?: string;
  height?: string;
  borderRadius?: string;
  borderColor?: string;
  borderWidth?: string;
  borderStyle?: "solid" | "dashed" | "dotted";
  durationInFrames?: number; // Duration of the entry animation
  damping?: number;
  mass?: number;
  stiffness?: number;
  boxShadow?: string;
  floatAmplitude?: number; // How much the card floats up and down
  floatSpeed?: number; // Speed of the floating animation
}

export default function FloatingCard({
  text = "Floating Card",
  textColor = "var(--card-foreground)",
  backgroundColor = "var(--card)",
  fontSize = "1.25rem",
  width = "200px",
  height = "280px",
  borderRadius = "15px",
  borderColor = "var(--ring)",
  borderWidth = "1px",
  borderStyle = "solid",
  durationInFrames = 30, // Shorter for entry animation
  damping = 12,
  mass = 0.5,
  stiffness = 100,
  boxShadow = `0 1px 3px var(--border), 0 6px 12px oklch(from var(--border) calc(l - 0.1) c h / 30%)`,
  floatAmplitude = 10, // Pixels
  floatSpeed = 30, // Divisor for frame, smaller is faster
}: FloatingCardProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entry animation for scale
  const scale = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    durationInFrames,
    config: {
      damping,
      mass,
      stiffness,
    },
  });

  // Floating animation for position
  const floatOffset = Math.sin(frame / floatSpeed) * floatAmplitude;

  const cardStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: `translate(-50%, -50%) translateY(${floatOffset}px) scale(${scale})`,
    width,
    height,
    background: backgroundColor,
    borderRadius,
    borderColor,
    borderWidth,
    borderStyle,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize,
    fontWeight: "bold",
    color: textColor,
    padding: "10px", // Added padding similar to CardFlip face
    boxSizing: "border-box", // Added for consistent padding behavior
    boxShadow,
    overflow: "hidden", // Ensures border radius is respected with box shadow
  };

  return <div style={cardStyle}>{text}</div>;
}
