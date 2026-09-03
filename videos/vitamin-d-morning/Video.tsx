/**
 * 예시 1 — 차분한 편집형.
 *
 * 이 파일이 보여주려는 것: 영상 하나는 자기 폴더 안에서 자유롭게 짭니다.
 * 정해진 틀이 없고, 씬 개수도 구성도 마음대로입니다.
 * 창고(src/library)에서 필요한 것만 골라 쓰고, 나머지는 직접 씁니다.
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

import { Backdrop, Narration, bg, korean, SAFE_AREA } from "../../src/library/studio";
// 창고에서 그대로 가져다 쓰는 예 — 배경 위에 은은한 빛망울을 얹습니다
import BokehCircles from "../../src/library/rve/bokeh-circles";

// npm run voice -- vitamin-d-morning 이 만든 음성 목록입니다.
// 장면 길이를 여기서 가져오므로, 목소리를 바꾸면 화면 길이도 알아서 따라갑니다.
import narrationIndex from "../../public/audio/vitamin-d-morning/index.json";
import { framesFor, takeById, type NarrationIndex } from "../../src/lib/narration";

const narration = narrationIndex as NarrationIndex;
const take = (id: string) => takeById(narration, id);
const frames = (id: string) => framesFor(take(id));

const SUB_STYLE = { color: "#EFF6F2", background: "rgba(7,18,15,.80)" } as const;

const INK = "#FFFFFF";
const SUB = "#A9C6BB";
const ACCENT = "#5BD69B";

const Center: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      flexDirection: "column",
      gap: 24,
      padding: `${SAFE_AREA.top}px ${SAFE_AREA.side}px ${SAFE_AREA.bottom}px`,
    }}
  >
    {children}
  </AbsoluteFill>
);

const Rise: React.FC<{ delay?: number; children: React.ReactNode }> = ({ delay = 0, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  return (
    <div style={{ opacity: s, transform: `translateY(${(1 - s) * 26}px)` }}>{children}</div>
  );
};

const Hook: React.FC = () => (
  <Backdrop image={bg("dawn-green")}>
    <BokehCircles />
    <Center>
      <Rise>
        <h1 style={{ ...korean, color: INK, fontSize: 100, fontWeight: 800, lineHeight: 1.18, margin: 0 }}>
          {"실내에만 있으면\n비타민D는 안 만들어집니다"}
        </h1>
      </Rise>
    </Center>
    <Narration take={take("hook")} subtitleProps={SUB_STYLE} />
  </Backdrop>
);

const Point: React.FC = () => (
  <Backdrop image={bg("soft-mint")}>
    <Center>
      <Rise>
        <h2 style={{ ...korean, color: INK, fontSize: 84, fontWeight: 800, margin: 0 }}>핵심은 UVB</h2>
      </Rise>
      <Rise delay={10}>
        <p style={{ ...korean, color: SUB, fontSize: 46, fontWeight: 500, lineHeight: 1.5, margin: 0 }}>
          피부에서 비타민D가 만들어지려면 자외선B가 직접 닿아야 합니다.
        </p>
      </Rise>
    </Center>
    <Narration take={take("point")} subtitleProps={SUB_STYLE} />
  </Backdrop>
);

const Steps: React.FC = () => {
  const items = ["오전 10시~오후 3시 사이", "팔과 다리를 드러내고", "10~20분, 주 3회 이상"];
  return (
    <Backdrop image={bg("calm-teal")}>
      <Center>
        <Rise>
          <h2 style={{ ...korean, color: INK, fontSize: 70, fontWeight: 800, margin: "0 0 12px" }}>
            실천은 이 세 가지
          </h2>
        </Rise>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, width: "100%" }}>
          {items.map((item, i) => (
            <Rise key={item} delay={12 + i * 9}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  textAlign: "left",
                  background: "rgba(255,255,255,.07)",
                  borderLeft: `5px solid ${ACCENT}`,
                  padding: "20px 26px",
                  borderRadius: 6,
                }}
              >
                <span
                  style={{
                    color: ACCENT,
                    fontSize: 30,
                    fontWeight: 700,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ ...korean, color: INK, fontSize: 52, fontWeight: 600, lineHeight: 1.34 }}>
                  {item}
                </span>
              </div>
            </Rise>
          ))}
        </div>
      </Center>
      <Narration take={take("steps")} subtitleProps={SUB_STYLE} />
    </Backdrop>
  );
};

const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const glow = interpolate(Math.sin(frame / 10), [-1, 1], [0.55, 1]);
  return (
    <Backdrop image={bg("deep-forest")}>
      <Center>
        <Rise>
          <p style={{ color: ACCENT, fontSize: 30, fontWeight: 700, letterSpacing: ".12em", opacity: glow, margin: 0 }}>
            오늘의 실천
          </p>
        </Rise>
        <Rise delay={8}>
          <h2 style={{ ...korean, color: INK, fontSize: 92, fontWeight: 800, lineHeight: 1.2, margin: 0 }}>
            {"오늘 점심,\n15분만 밖에서"}
          </h2>
        </Rise>
      </Center>
      <Narration take={take("cta")} subtitleProps={SUB_STYLE} />
    </Backdrop>
  );
};

const t = () => (
  <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 12 })} />
);

export const VitaminDMorning: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0C1A16" }}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={frames("hook")}>
        <Hook />
      </TransitionSeries.Sequence>
      {t()}
      <TransitionSeries.Sequence durationInFrames={frames("point")}>
        <Point />
      </TransitionSeries.Sequence>
      {t()}
      <TransitionSeries.Sequence durationInFrames={frames("steps")}>
        <Steps />
      </TransitionSeries.Sequence>
      {t()}
      <TransitionSeries.Sequence durationInFrames={frames("cta")}>
        <Cta />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
