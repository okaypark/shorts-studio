"use client";

import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";

export interface CircularProgressProps {
  // Overall appearance & behavior
  size?: number; // Overall size of the component
  progressSource?: "time" | "prop"; // 'time' for animation, 'prop' for external control
  progress?: number; // Current progress (0-100), used if progressSource is 'prop'
  durationInFrames?: number; // Duration for one full 0-100% cycle if progressSource is 'time'
  loopProgress?: boolean; // Whether the progress animation should loop

  // Background (Track) Circle
  showTrack?: boolean;
  trackColor?: string;
  trackStrokeWidth?: number;

  // Progress Arc
  progressStrokeWidth?: number;
  progressStrokeLinecap?: "butt" | "round" | "square";
  progressColorMode?: "solid" | "gradient";
  progressSolidColor?: string;
  progressGradientStartColor?: string;
  progressGradientEndColor?: string;

  // Rotating Dots
  showRotatingDots?: boolean;
  dotColor?: string;
  dotRadius?: number;
  dotDistanceFromCenter?: number; // Distance of the dot from the center of the main circle
  rotationSpeed?: number; // Multiplier for rotation speed, positive for clockwise, negative for counter-clockwise

  // Pulse Effect
  enablePulse?: boolean;
  pulseMagnitude?: number; // e.g., 0.05 for 5% pulse
  pulseSpeed?: number; // Speed of the pulse animation

  // Percentage Text
  showPercentageText?: boolean;
  textColor?: string;
  textSize?: string | number;
  textFontWeight?: string | number;
  textStyle?: React.CSSProperties;

  // Container
  containerStyle?: React.CSSProperties;
}

export default function CircularLoader({
  // Overall appearance & behavior
  size = 200,
  progressSource = "time",
  progress: propProgress = 0,
  durationInFrames = 90,
  loopProgress = true,

  // Background (Track) Circle
  showTrack = true,
  trackColor = "rgba(255, 255, 255, 0.1)",
  trackStrokeWidth = 12,

  // Progress Arc
  progressStrokeWidth = 12,
  progressStrokeLinecap = "round",
  progressColorMode = "gradient",
  progressSolidColor = "#3b82f6",
  progressGradientStartColor = "#3b82f6",
  progressGradientEndColor = "#1e3a8a",

  // Pulse Effect
  enablePulse = true,
  pulseMagnitude = 0.05,
  pulseSpeed = 10,

  // Percentage Text
  showPercentageText = true,
  textColor = "white",
  textSize = "3rem",
  textFontWeight = "bold",
  textStyle,

  // Container
  containerStyle,
}: CircularProgressProps) {
  const frame = useCurrentFrame();
  // const { fps } = useVideoConfig(); // fps is not used in this version

  const actualRadius =
    (size - Math.max(trackStrokeWidth, progressStrokeWidth)) / 2;
  const circumference = 2 * Math.PI * actualRadius;

  const currentProgress = React.useMemo(() => {
    if (progressSource === "prop") {
      return Math.min(100, Math.max(0, propProgress));
    }
    // Time-based progress
    const totalFramesForCycle = durationInFrames;
    const currentFrameInCycle = loopProgress
      ? frame % totalFramesForCycle
      : Math.min(frame, totalFramesForCycle);
    return interpolate(
      currentFrameInCycle,
      [0, totalFramesForCycle],
      [0, 100],
      { extrapolateRight: "clamp", easing: Easing.linear }
    );
  }, [frame, progressSource, propProgress, durationInFrames, loopProgress]);

  const strokeDashoffset =
    circumference - (currentProgress / 100) * circumference;
  const pulse = enablePulse
    ? 1 + Math.sin(frame / pulseSpeed) * pulseMagnitude
    : 1;

  const mainContainerStyle: React.CSSProperties = {
    position: "relative",
    width: size,
    height: size,
    transform: `scale(${pulse})`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ...containerStyle, // Allow user to override default centering etc.
  };

  const svgViewBox = `0 0 ${size} ${size}`;
  const svgStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    transform: "rotate(-90deg)", // Start arc from the top
    transformOrigin: "center center",
  };

  const percentageTextStyle: React.CSSProperties = {
    position: "absolute", // Ensure it's centered within the main container
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: textSize,
    fontWeight: textFontWeight,
    color: textColor,
    zIndex: 2, // Above SVG elements
    ...textStyle,
  };

  return (
    <div style={mainContainerStyle}>
      {/* Background circle */}
      {showTrack && (
        <svg width="100%" height="100%" viewBox={svgViewBox} style={svgStyle}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={actualRadius}
            fill="none"
            stroke={trackColor}
            strokeWidth={trackStrokeWidth}
          />
        </svg>
      )}

      {/* Progress circle */}
      <svg width="100%" height="100%" viewBox={svgViewBox} style={svgStyle}>
        <defs>
          {progressColorMode === "gradient" && (
            <linearGradient
              id="progressGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor={progressGradientStartColor} />
              <stop offset="100%" stopColor={progressGradientEndColor} />
            </linearGradient>
          )}
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={actualRadius}
          fill="none"
          stroke={
            progressColorMode === "gradient"
              ? "url(#progressGradient)"
              : progressSolidColor
          }
          strokeWidth={progressStrokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap={progressStrokeLinecap}
        />
      </svg>

      {/* Percentage text */}
      {showPercentageText && (
        <div style={percentageTextStyle}>{Math.round(currentProgress)}%</div>
      )}
    </div>
  );
}
