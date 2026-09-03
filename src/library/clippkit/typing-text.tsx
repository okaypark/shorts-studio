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

import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface TypingTextProps {
  text?: string;
  textColor?: string;
  cursorColor?: string;
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: string;
  durationInFramesToType?: number; // Total frames to type out the entire text
  cursorBlinkSpeed?: number; // Frames for one blink cycle (e.g., 15 means it blinks every 15 frames)
}

export default function TypingText({
  text = "TYPE ME...",
  textColor = "white",
  cursorColor = "white",
  fontSize = "3rem",
  fontFamily = "'Courier New', monospace",
  fontWeight = "bold",
  durationInFramesToType, // If not provided, defaults to text.length * 5 frames
  cursorBlinkSpeed = 15,
}: TypingTextProps) {
  const frame = useCurrentFrame();

  const actualDurationInFramesToType =
    durationInFramesToType !== undefined
      ? durationInFramesToType
      : text.length * 5; // Default: 5 frames per character

  const visibleCharacters = Math.floor(
    interpolate(frame, [0, actualDurationInFramesToType], [0, text.length], {
      extrapolateRight: "clamp",
    })
  );

  const charactersToRender = text.slice(0, visibleCharacters).split("");

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "90%", // Ensure it doesn't overflow easily
        textAlign: "center",
        padding: "1rem", // Add some padding
      }}
    >
      <span
        style={{
          fontFamily,
          fontSize,
          fontWeight,
          color: textColor,
          display: "inline-block", // To keep cursor on the same line
        }}
      >
        {charactersToRender.map((char, index) => (
          <React.Fragment key={index}>
            {char === " " ? "\u00A0" : char}
          </React.Fragment>
        ))}
      </span>
      <span
        style={{
          display: "inline-block",
          fontFamily,
          fontSize,
          fontWeight,
          color: cursorColor,
          opacity: frame % cursorBlinkSpeed < cursorBlinkSpeed / 2 ? 1 : 0,
          marginLeft: "0.2rem", // Space between text and cursor
          verticalAlign: "middle",
        }}
      >
        ▌
      </span>
    </div>
  );
}
