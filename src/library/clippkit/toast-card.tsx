"use client";

import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export type PositionPreset =
  | "bottom-left"
  | "bottom-right"
  | "top-left"
  | "top-right"
  | "center";

interface ToastCardProps {
  title?: string;
  message?: string;
  titleColor?: string;
  messageColor?: string;
  backgroundColor?: string;
  titleFontSize?: string;
  messageFontSize?: string;
  width?: string;
  padding?: string;
  borderRadius?: string;
  borderColor?: string;
  borderWidth?: string;
  borderStyle?: "solid" | "dashed" | "dotted";
  boxShadow?: string;
  positionPreset?: PositionPreset;
  margin?: string; // e.g., "20px"

  entryDurationInFrames?: number;
  visibleDurationInFrames?: number;
  exitDurationInFrames?: number;

  damping?: number;
  mass?: number;
  stiffness?: number;

  fontFamily?: string;
  slideOffset?: number; // e.g., 50 (pixels) for vertical slide
}

export default function ToastCard({
  title = "Success!",
  message = "Your action was completed.",
  titleColor = "var(--card-foreground)",
  messageColor = "var(--card-foreground)",
  backgroundColor = "var(--card)",
  titleFontSize = "1.1rem",
  messageFontSize = "0.9rem",
  width = "300px",
  padding = "15px 20px",
  borderRadius = "10px",
  borderColor = "var(--border)",
  borderWidth = "1px",
  borderStyle = "solid",
  boxShadow = "0 4px 12px rgba(0,0,0,0.1)",
  positionPreset = "bottom-left",
  margin = "20px",

  entryDurationInFrames = 30,
  visibleDurationInFrames = 120,
  exitDurationInFrames = 30,

  damping = 25,
  mass = 0.7,
  stiffness = 180,
  fontFamily = "Inter, sans-serif",
  slideOffset = 50, // pixels to slide in/out by
}: ToastCardProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const exitAnimationStartFrame =
    entryDurationInFrames + visibleDurationInFrames;
  const totalComponentAnimationDuration =
    entryDurationInFrames + visibleDurationInFrames + exitDurationInFrames;

  const entryAnimProgress = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    durationInFrames: entryDurationInFrames,
    config: { damping, mass, stiffness },
  });

  const exitAnimProgress = spring({
    frame: frame - exitAnimationStartFrame,
    fps,
    from: 0,
    to: 1,
    durationInFrames: exitDurationInFrames,
    config: { damping, mass, stiffness: stiffness / 1.5 }, // Softer exit
  });

  const opacity =
    interpolate(entryAnimProgress, [0, 1], [0, 1]) *
    interpolate(exitAnimProgress, [0, 1], [1, 0]);

  let yTranslateStart = 0;
  const scaleStart = 0.95;
  const scaleEnd = 1;

  if (positionPreset === "bottom-left" || positionPreset === "bottom-right") {
    yTranslateStart = slideOffset; // Start from below
  } else if (positionPreset === "top-left" || positionPreset === "top-right") {
    yTranslateStart = -slideOffset; // Start from above
  } else if (positionPreset === "center") {
    yTranslateStart = slideOffset; // Center also slides, use full slideOffset from bottom
  }

  const yPos =
    interpolate(entryAnimProgress, [0, 1], [yTranslateStart, 0]) +
    interpolate(exitAnimProgress, [0, 1], [0, yTranslateStart]); // Exit to the same direction it came from

  const scale =
    positionPreset === "center"
      ? interpolate(entryAnimProgress, [0, 1], [scaleStart, scaleEnd]) *
        interpolate(exitAnimProgress, [0, 1], [scaleEnd, scaleStart])
      : 1;

  const transformProperties: string[] = [];
  if (positionPreset === "center") {
    transformProperties.push(`translate(-50%, -50%)`); // Center alignment first
  }
  transformProperties.push(`translateY(${yPos}px)`);
  if (scale !== 1) {
    // Only add scale if it's not 1 to keep transform shorter
    transformProperties.push(`scale(${scale})`);
  }

  const cardStyle: React.CSSProperties = {
    position: "absolute",
    width,
    padding,
    background: backgroundColor,
    borderRadius,
    borderColor,
    borderWidth,
    borderStyle,
    boxShadow,
    fontFamily,
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    boxSizing: "border-box",
    opacity,
    transform: transformProperties.join(" "),
  };

  if (positionPreset === "center") {
    cardStyle.top = "50%";
    cardStyle.left = "50%";
  } else {
    // Vertical positioning
    if (positionPreset.includes("bottom")) {
      cardStyle.bottom = margin;
    } else if (positionPreset.includes("top")) {
      cardStyle.top = margin;
    }

    // Horizontal positioning
    if (positionPreset.includes("left")) {
      cardStyle.left = margin;
      cardStyle.right = "auto"; // Explicitly set right to auto
    } else if (positionPreset.includes("right")) {
      cardStyle.right = margin;
      cardStyle.left = "auto"; // Explicitly set left to auto
    } else {
      // Fallback or default horizontal positioning if needed
      // For current defined presets, this path shouldn't be taken.
      // If it were, centering horizontally might be a safe default:
      // cardStyle.left = "50%";
      // if (!transformProperties.some(t => t.startsWith("translateX")) && !positionPreset.includes("center")) {
      // transformProperties.unshift("translateX(-50%)");
      // }
    }
  }

  // Don't render if fully exited and transparent (past its animation lifecycle)
  if (frame >= totalComponentAnimationDuration && opacity < 0.01) {
    return null;
  }

  return (
    <div style={cardStyle}>
      {title && (
        <h3
          style={{
            margin: 0,
            fontSize: titleFontSize,
            fontWeight: "bold",
            color: titleColor,
          }}
        >
          {title}
        </h3>
      )}
      {message && (
        <p
          style={{
            margin: 0,
            fontSize: messageFontSize,
            color: messageColor,
            opacity: 0.9,
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
