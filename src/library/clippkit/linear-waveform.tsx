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

import React, { useEffect, useState } from "react";
import {
  createSmoothSvgPath,
  MediaUtilsAudioData,
  visualizeAudioWaveform,
} from "@remotion/media-utils";
import { useCurrentFrame, useVideoConfig } from "remotion";

// Helper function to generate waveform samples
const generateWaveformSamples = (
  audioData: MediaUtilsAudioData | null | undefined,
  numberOfSamples: number,
  frame: number,
  waveSpeed: number,
  fps: number
): number[] => {
  if (audioData) {
    return visualizeAudioWaveform({
      fps,
      frame,
      audioData,
      numberOfSamples,
      windowInSeconds: 1 / fps, // Visualize a single frame's worth of audio
    });
  }
  return Array(numberOfSamples)
    .fill(0)
    .map((_, i) => {
      return (
        Math.sin(frame / waveSpeed + (i / numberOfSamples) * 2 * Math.PI) *
          0.5 +
        0.5
      );
    });
};

// Helper function to calculate SVG path from samples
const calculateSvgPath = (
  samples: number[],
  finalWidth: number,
  finalHeight: number,
  waveAmplitude: number,
  strokeWidth: number,
  numberOfSamples: number
): string => {
  const points = samples.map((sample, i) => {
    const x = (i / Math.max(1, numberOfSamples - 1)) * finalWidth;
    let y = Math.round((sample - 0.5) * waveAmplitude + finalHeight / 2);
    y = Math.max(strokeWidth / 2, Math.min(finalHeight - strokeWidth / 2, y));
    return { x, y };
  });

  if (points.length > 1) {
    return createSmoothSvgPath({ points }) as string;
  }
  if (points.length === 1) {
    return `M 0 ${points[0].y} L ${finalWidth} ${points[0].y}`;
  }
  return "";
};

interface LinearWaveformProps {
  audioData?: MediaUtilsAudioData | null;
  numberOfSamples?: number;
  strokeColor?: string;
  strokeWidth?: number;
  fillColor?: string;
  waveAmplitude?: number;
  waveSpeed?: number;
  containerStyle?: React.CSSProperties;
  height?: string | number;
  width?: string | number;
}

export default function LinearWaveform({
  audioData,
  numberOfSamples = 64,
  strokeColor = "var(--foreground)",
  strokeWidth = 2,
  fillColor = "none",
  waveAmplitude = 100,
  waveSpeed = 10,
  containerStyle,
  height: propHeight,
  width: propWidth,
}: LinearWaveformProps) {
  const frame = useCurrentFrame();
  const { width: videoWidth, height: videoHeight, fps } = useVideoConfig();

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
      : videoHeight;
  } else {
    computedHeight = videoHeight;
  }

  const finalWidth = computedWidth;
  const finalHeight = computedHeight;

  const [svgPath, setSvgPath] = useState("");

  useEffect(() => {
    const waveformData = generateWaveformSamples(
      audioData,
      numberOfSamples,
      frame,
      waveSpeed,
      fps
    );

    const newPath = calculateSvgPath(
      waveformData,
      finalWidth,
      finalHeight,
      waveAmplitude,
      strokeWidth,
      numberOfSamples
    );

    setSvgPath(newPath);
  }, [
    frame,
    audioData,
    numberOfSamples,
    waveAmplitude,
    waveSpeed,
    finalWidth,
    finalHeight,
    fps,
    strokeWidth,
  ]);

  return (
    <div
      style={{
        width: finalWidth,
        height: finalHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: "transparent",
        ...containerStyle,
      }}
    >
      <svg
        viewBox={`0 0 ${finalWidth} ${finalHeight}`}
        width={finalWidth}
        height={finalHeight}
        style={{
          width: finalWidth,
          height: finalHeight,
        }}
      >
        <path
          d={svgPath}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill={fillColor}
        />
      </svg>
    </div>
  );
}
