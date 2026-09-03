import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SAFE_AREA, korean } from "./korean";

/**
 * 화면 하단 자막.
 *
 * 소리를 끄고 보는 시청자가 대다수라 자막은 장식이 아니라 본문입니다.
 * 모양은 props 로 얼마든지 바꿀 수 있지만, 자막 자체를 빼지는 마세요.
 */
export const Subtitle: React.FC<{
  children: React.ReactNode;
  color?: string;
  background?: string;
  fontSize?: number;
  /** 화면 아래에서 띄우는 거리 */
  bottom?: number;
  align?: "center" | "left";
  style?: React.CSSProperties;
}> = ({
  children,
  color = "#F2F5F7",
  background = "rgba(9,12,15,.78)",
  fontSize = 42,
  bottom = SAFE_AREA.bottom - 240,
  align = "center",
  style,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: align === "center" ? "center" : "flex-start",
        padding: `0 ${SAFE_AREA.side}px ${bottom}px`,
      }}
    >
      <div
        style={{
          ...korean,
          opacity,
          maxWidth: "100%",
          background,
          color,
          fontSize,
          fontWeight: 600,
          lineHeight: 1.42,
          letterSpacing: "-0.01em",
          textAlign: align,
          padding: "18px 28px",
          borderRadius: 8,
          ...style,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
