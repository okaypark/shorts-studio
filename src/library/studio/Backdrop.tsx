import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * 배경 한 겹. 이미지든 색이든 받아서 깔고, 위에 어두운 막(스크림)을 덮습니다.
 *
 * 쓰든 안 쓰든 자유입니다. 배경을 직접 그리고 싶으면 이 컴포넌트를 무시하고
 * AbsoluteFill 에 원하는 걸 넣으세요.
 */
export const Backdrop: React.FC<{
  /** public/ 기준 경로. 예: "images/backgrounds/calm-teal.svg" */
  image?: string;
  /** 이미지가 없을 때 깔리는 색 또는 그라디언트 */
  color?: string;
  /** 이미지 위에 덮는 막. false 로 끄거나 직접 지정할 수 있습니다 */
  scrim?: string | false;
  /** 천천히 확대(켄 번스). 끄려면 false */
  zoom?: boolean | { from: number; to: number };
  children?: React.ReactNode;
}> = ({ image, color = "#101418", scrim, zoom = true, children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const range = zoom === false ? null : zoom === true ? { from: 1.05, to: 1.13 } : zoom;
  const scale = range
    ? interpolate(frame, [0, durationInFrames], [range.from, range.to], {
        extrapolateRight: "clamp",
      })
    : 1;

  const scrimStyle =
    scrim === false
      ? null
      : (scrim ??
        "linear-gradient(180deg, rgba(0,0,0,.35) 0%, rgba(0,0,0,.12) 45%, rgba(0,0,0,.88) 100%)");

  return (
    <AbsoluteFill style={{ background: color }}>
      {image ? (
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Img
            src={staticFile(image)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${scale})`,
            }}
          />
        </AbsoluteFill>
      ) : null}
      {scrimStyle ? <AbsoluteFill style={{ background: scrimStyle }} /> : null}
      {children ? <AbsoluteFill>{children}</AbsoluteFill> : null}
    </AbsoluteFill>
  );
};

/** public/images/backgrounds/ 에 들어 있는 12종 */
export const BACKGROUNDS = [
  "dawn-green",
  "soft-mint",
  "calm-teal",
  "deep-forest",
  "slate-blue",
  "dusk-violet",
  "graphite",
  "sand-warm",
  "amber-dusk",
  "clay-rose",
  "ocean-night",
  "paper-light",
] as const;

export const bg = (name: (typeof BACKGROUNDS)[number]) => `images/backgrounds/${name}.svg`;
