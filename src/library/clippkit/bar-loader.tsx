"use client";

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

interface BarLoaderProps {
  loadingText?: string;
  barColor?: string;
  textColor?: string;
  height?: string | number;
  width?: string | number;
  containerStyle?: React.CSSProperties;
  hideText?: boolean;
  barBorderRadius?: string | number;
  trackColor?: string;
  barHeight?: string | number;
}

export default function BarLoader({
  loadingText = "Loading...",
  barColor = "var(--foreground)",
  textColor = "var(--foreground)",
  height: propHeight,
  width: propWidth,
  containerStyle,
  hideText = false,
  barBorderRadius,
  trackColor = "var(--muted)",
  barHeight: propBarHeight,
}: BarLoaderProps) {
  const frame = useCurrentFrame();
  const {
    durationInFrames,
    width: videoWidth,
    height: videoHeight,
  } = useVideoConfig();

  let computedWidth: number;
  if (typeof propWidth === "number") {
    computedWidth = propWidth;
  } else if (typeof propWidth === "string" && propWidth.endsWith("%")) {
    const percentage = parseFloat(propWidth.substring(0, propWidth.length - 1));
    computedWidth = !isNaN(percentage)
      ? (percentage / 100) * videoWidth
      : videoWidth;
  } else {
    computedWidth = videoWidth;
  }

  let computedHeight: number;
  if (typeof propHeight === "number") {
    computedHeight = propHeight;
  } else if (typeof propHeight === "string" && propHeight.endsWith("%")) {
    const percentage = parseFloat(
      propHeight.substring(0, propHeight.length - 1)
    );
    computedHeight = !isNaN(percentage)
      ? (percentage / 100) * videoHeight
      : videoHeight / 4; // Default to 1/4th of video height if not specified
  } else {
    computedHeight = videoHeight / 4; // Default to 1/4th of video height
  }

  const finalWidth = computedWidth;
  const finalHeight = computedHeight;
  const calculatedBarHeight = Math.max(8, finalHeight / 4); // Ensure bar is at least 8px or 1/4 of component height

  let actualBarHeight: number;
  if (typeof propBarHeight === "number") {
    actualBarHeight = propBarHeight;
  } else if (typeof propBarHeight === "string") {
    if (propBarHeight.endsWith("%")) {
      const percentage = parseFloat(
        propBarHeight.substring(0, propBarHeight.length - 1)
      );
      actualBarHeight = !isNaN(percentage)
        ? (percentage / 100) * finalHeight
        : calculatedBarHeight;
    } else if (propBarHeight.endsWith("px")) {
      const pxValue = parseFloat(
        propBarHeight.substring(0, propBarHeight.length - 2)
      );
      actualBarHeight = !isNaN(pxValue) ? pxValue : calculatedBarHeight;
    } else {
      // Assuming it's a number as a string, or fallback
      const numValue = parseFloat(propBarHeight);
      actualBarHeight = !isNaN(numValue) ? numValue : calculatedBarHeight;
    }
  } else {
    actualBarHeight = calculatedBarHeight;
  }

  const textHeight = finalHeight - actualBarHeight;
  const actualBarBorderRadius =
    barBorderRadius !== undefined ? barBorderRadius : actualBarHeight / 2;

  const progress = frame / durationInFrames;

  return (
    <div
      style={{
        width: finalWidth,
        height: finalHeight,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: "transparent",
        textAlign: "center",
        ...containerStyle,
      }}
    >
      {!hideText && (
        <div
          style={{
            height: textHeight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: textColor,
            fontSize: Math.max(16, textHeight / 2.5), // Responsive font size, adjusted for better fit
            fontWeight: "bold",
            lineHeight: 1.2, // Ensure text is vertically centered if it wraps
            paddingBottom: actualBarHeight / 4, // Add some space between text and bar
          }}
        >
          {loadingText}
        </div>
      )}
      <div
        style={{
          width: "80%", // Bar container width
          height: actualBarHeight,
          backgroundColor: trackColor, // Background of the bar track
          borderRadius: actualBarBorderRadius,
          overflow: "hidden",
          marginTop: hideText ? 0 : actualBarHeight / 4, // Adjust top margin if text is hidden
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            backgroundColor: barColor,
            borderRadius: actualBarBorderRadius,
            transition: "width 0.1s linear",
          }}
        />
      </div>
    </div>
  );
}
