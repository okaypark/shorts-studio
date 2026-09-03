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

import { useCurrentFrame } from "remotion";

interface GlitchTextProps {
  text?: string;
  textColor?: string;
  glitchTextColor1?: string;
  glitchTextColor2?: string;
  glitchTextColor3?: string;
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: string;
  glitchStrength?: number;
  glitchSpeed?: number;
  sporadicGlitchChance?: number;
}

export default function GlitchText({
  text = "GLITCH",
  textColor = "white", // Using new CSS variable
  glitchTextColor1 = "var(--glitch-color-1)", // Using new CSS variable
  glitchTextColor2 = "var(--glitch-color-2)", // Using new CSS variable
  fontSize = "5rem",
  fontFamily = "monospace",
  fontWeight = "bold",
  glitchStrength = 10,
  glitchSpeed = 5,
  sporadicGlitchChance,
}: GlitchTextProps) {
  const frame = useCurrentFrame();

  let currentGlitchIntensity = 0;
  let currentRgbOffset = 0;

  if (sporadicGlitchChance !== undefined && sporadicGlitchChance > 0) {
    // Sporadic glitch logic
    if (Math.random() < sporadicGlitchChance) {
      // Glitch happens based on chance
      // Use glitchSpeed to determine how often a *new* random glitch can occur,
      // rather than how fast a continuous sine wave moves.
      // For example, a higher glitchSpeed could mean we only pick new random values less often.
      // This interpretation might need refinement based on desired effect.
      // For now, let's make it so that a glitch, when it occurs, has a random intensity.
      if (
        frame % Math.max(1, Math.floor(glitchSpeed)) === 0 ||
        glitchSpeed < 1
      ) {
        currentGlitchIntensity = (Math.random() - 0.5) * 2 * glitchStrength; // Random value between -glitchStrength and +glitchStrength
        currentRgbOffset = (Math.random() - 0.5) * 2 * (glitchStrength / 1.5); // Slightly less offset for RGB
      }
    }
    // Else, no glitch on this frame for sporadic mode
  } else {
    // Original continuous glitch logic
    currentGlitchIntensity = Math.sin(frame / glitchSpeed) * glitchStrength;
    currentRgbOffset =
      Math.sin(frame / (glitchSpeed / 2)) * (glitchStrength / 2);
  }

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        fontSize,
        fontWeight,
        fontFamily,
      }}
    >
      <div
        style={{
          position: "absolute",
          color: glitchTextColor1,
          transform: `translate(${currentRgbOffset}px, ${currentGlitchIntensity}px)`,
          mixBlendMode: "screen", // Consider if 'screen' is desired for B&W
          opacity: 0.6, // Added opacity for better layering
        }}
      >
        {text}
      </div>
      <div
        style={{
          position: "absolute",
          color: glitchTextColor2,
          transform: `translate(${-currentRgbOffset}px, ${-currentGlitchIntensity}px)`,
          mixBlendMode: "screen", // Consider if 'screen' is desired for B&W
          opacity: 0.6, // Added opacity for better layering
        }}
      >
        {text}
      </div>
      <div style={{ color: textColor, opacity: 0.8 }}>{text}</div>
    </div>
  );
}
