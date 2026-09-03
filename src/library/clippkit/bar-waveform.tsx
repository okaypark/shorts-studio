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
    // For bar waveform, we might want to adjust how windowInSeconds or smoothing works
    // For now, using a similar approach to linear waveform
    return visualizeAudioWaveform({
      fps,
      frame,
      audioData,
      numberOfSamples,
      windowInSeconds: 1 / fps, // Visualize a single frame's worth of audio
    });
  }
  // Fallback for when audioData is not available - simple sine wave
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

interface BarWaveformProps {
  audioData?: MediaUtilsAudioData | null;
  numberOfSamples?: number;
  barColor?: string;
  barWidth?: number; // Width of each bar
  barGap?: number; // Gap between bars
  waveAmplitude?: number; // Max height of the bars
  waveSpeed?: number;
  containerStyle?: React.CSSProperties;
  height?: string | number;
  width?: string | number;
  barBorderRadius?: string | number;
  growUpwardsOnly?: boolean; // New prop: if true, bars only grow upwards from the center
}

export default function BarWaveform({
  audioData,
  numberOfSamples = 64,
  barColor = "var(--foreground)",
  barWidth = 5,
  barGap = 2,
  waveAmplitude = 100,
  waveSpeed = 10,
  containerStyle,
  height: propHeight,
  width: propWidth,
  barBorderRadius = 0,
  growUpwardsOnly = false, // Default value for the new prop
}: BarWaveformProps) {
  const frame = useCurrentFrame();
  const { width: videoWidth, height: videoHeight, fps } = useVideoConfig();

  const finalWidth = typeof propWidth === "number" ? propWidth : videoWidth;
  const finalHeight = typeof propHeight === "number" ? propHeight : videoHeight;

  const [barHeights, setBarHeights] = useState<number[]>([]);

  useEffect(() => {
    const waveformData = generateWaveformSamples(
      audioData,
      numberOfSamples,
      frame,
      waveSpeed,
      fps
    );

    // Map waveform data (0 to 1) to bar heights
    const newBarHeights = waveformData.map((sample) =>
      // Ensure minimum height for visibility, scale by waveAmplitude and center
      Math.max(1, sample * waveAmplitude)
    );
    setBarHeights(newBarHeights);
  }, [frame, audioData, numberOfSamples, waveAmplitude, waveSpeed, fps]);

  // Calculate total width occupied by bars and gaps to center them if needed
  const totalBarWidth = numberOfSamples * barWidth;
  const totalGapWidth = (numberOfSamples - 1) * barGap;
  const waveformVisualWidth = totalBarWidth + totalGapWidth;
  const startX = (finalWidth - waveformVisualWidth) / 2;

  return (
    <div
      style={{
        width: finalWidth,
        height: finalHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center", // Or use startX for precise positioning
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
        {barHeights.map((barH, i) => {
          const x = startX + i * (barWidth + barGap);
          // Bars drawn from center, extending up and down
          // For simplicity, drawing upwards from baseline for now
          let rectY: number;
          let rectHeightValue: number;

          if (growUpwardsOnly) {
            // Bar grows upwards from the center line
            const upwardHeight = barH / 2; // Height from the center line
            rectY = finalHeight / 2 - upwardHeight;
            // Height of the bar is upwardHeight, capped by the available space above the center line (finalHeight / 2)
            // Also ensure a minimum height of 1 for visibility if upwardHeight is very small but not zero
            rectHeightValue =
              upwardHeight > 0
                ? Math.max(1, Math.min(upwardHeight, finalHeight / 2))
                : 0;
          } else {
            // Original behavior: bar is centered vertically
            rectY = finalHeight / 2 - barH / 2;
            // Ensure a minimum height of 1 for visibility if barH is very small but not zero
            rectHeightValue =
              barH > 0 ? Math.max(1, Math.min(barH, finalHeight)) : 0;
          }

          return (
            <rect
              key={i}
              x={x}
              y={rectY}
              width={barWidth}
              height={rectHeightValue}
              fill={barColor}
              rx={barBorderRadius} // For rounded corners
              ry={barBorderRadius} // For rounded corners
            />
          );
        })}
      </svg>
    </div>
  );
}
