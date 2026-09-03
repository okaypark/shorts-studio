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

interface PoppingTextProps {
  text?: string;
  colors?: string[];
  fontSize?: string;
  delayPerChar?: number;
  fontWeight?: string;
}

export default function PoppingText({
  text: textProp = "Popping Text",
  colors: colorsProp = [
    "var(--foreground)", // Default to CSS variable for foreground color
    "var(--primary)", // Default to CSS variable for primary color
  ],
  fontSize: fontSizeProp = "4rem", // Changed to 4rem to match sliding-text
  delayPerChar = 7,
  fontWeight: fontWeightProp = "bold",
}: PoppingTextProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textChars = textProp.split("");
  const currentColors = colorsProp;

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "100%",
        textAlign: "center",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {textChars.map((char, i) => {
        const delay = i * delayPerChar;
        const colorIndex = i % currentColors.length;

        const opacity = spring({
          frame: frame - delay,
          fps,
          from: 0,
          to: 1,
          config: {
            mass: 0.3,
            damping: 8,
            stiffness: 100,
          },
        });

        const scale = spring({
          frame: frame - delay,
          fps,
          from: 0,
          to: 1,
          config: {
            mass: 0.4,
            damping: 7,
            stiffness: 150,
          },
        });

        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity,
              color: currentColors[colorIndex],
              fontSize: fontSizeProp,
              fontWeight: fontWeightProp,
              transform: `scale(${scale})`,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
    </div>
  );
}
