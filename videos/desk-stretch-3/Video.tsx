/**
 * 예시 2 — 같은 저장소, 완전히 다른 얼굴.
 *
 * 1번 예시(vitamin-d-morning)와 나란히 놓고 보세요.
 * 배경도, 글자 정렬도, 모션도, 전환도 공유하는 게 없습니다.
 * 이게 이 저장소가 노리는 상태입니다 — 파트너마다 다른 영상이 나오는 것.
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";

import { Subtitle, korean, SAFE_AREA } from "../../src/library/studio";
// 창고에서 가져다 쓰는 것들 — 배경 하나, 텍스트 모션 하나
import GridPulse from "../../src/library/rve/grid-pulse";
import TypingText from "../../src/library/clippkit/typing-text";

const BG = "#07080C";
const INK = "#F2F4FA";
const DIM = "#6E7794";
const HOT = "#FF5E3A";

/** 왼쪽 정렬 + 굵은 규칙선. 1번 예시의 가운데 정렬과 정반대로 갑니다 */
const Left: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      justifyContent: "center",
      flexDirection: "column",
      gap: 20,
      padding: `${SAFE_AREA.top}px ${SAFE_AREA.side}px ${SAFE_AREA.bottom}px`,
    }}
  >
    {children}
  </AbsoluteFill>
);

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      display: "inline-block",
      alignSelf: "flex-start",
      background: HOT,
      color: "#0B0B0B",
      fontSize: 26,
      fontWeight: 800,
      letterSpacing: ".14em",
      padding: "8px 16px",
    }}
  >
    {children}
  </div>
);

const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: BG }}>
    <GridPulse />
    {children}
  </AbsoluteFill>
);

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const w = interpolate(frame, [8, 30], [0, 100], { extrapolateRight: "clamp" });
  return (
    <Frame>
      <Left>
        <Label>50 MIN RULE</Label>
        <h1 style={{ ...korean, color: INK, fontSize: 94, fontWeight: 800, lineHeight: 1.16, margin: 0 }}>
          {"목이 아픈 건 자세가 아니라\n시간 때문입니다"}
        </h1>
        <div style={{ height: 6, width: `${w}%`, background: HOT }} />
      </Left>
      <Subtitle background="rgba(255,255,255,.08)" color={INK} align="left">
        아무리 좋은 자세도 한 시간을 넘기면 부담이 쌓입니다.
      </Subtitle>
    </Frame>
  );
};

const Versus: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 6, fps, config: { damping: 200 } });
  const rows = [
    { k: "흔한 해결", v: "더 좋은 의자를 산다", dim: true },
    { k: "실제 효과", v: "50분마다 자세를 바꾼다", dim: false },
  ];
  return (
    <Frame>
      <Left>
        {rows.map((r, i) => (
          <div
            key={r.k}
            style={{
              opacity: interpolate(s, [0, 1], [0, 1]),
              transform: `translateX(${(1 - s) * (i === 0 ? -40 : 40)}px)`,
              borderTop: `2px solid ${r.dim ? "#252A3A" : HOT}`,
              paddingTop: 18,
              marginBottom: 26,
            }}
          >
            <p style={{ color: r.dim ? DIM : HOT, fontSize: 26, fontWeight: 700, letterSpacing: ".12em", margin: "0 0 8px" }}>
              {r.k}
            </p>
            <p
              style={{
                ...korean,
                color: r.dim ? DIM : INK,
                fontSize: 64,
                fontWeight: 800,
                lineHeight: 1.24,
                margin: 0,
                textDecoration: r.dim ? "line-through" : "none",
              }}
            >
              {r.v}
            </p>
          </div>
        ))}
      </Left>
      <Subtitle background="rgba(255,255,255,.08)" color={INK} align="left">
        장비보다 중요한 건 같은 자세를 끊어주는 주기입니다.
      </Subtitle>
    </Frame>
  );
};

const Moves: React.FC = () => {
  const frame = useCurrentFrame();
  const moves = [
    { n: "01", t: "턱 당겨 목 뒤 늘이기", s: "20초" },
    { n: "02", t: "어깨 뒤로 모으기", s: "10회" },
    { n: "03", t: "등받이 잡고 상체 비틀기", s: "좌우 15초" },
  ];
  return (
    <Frame>
      <Left>
        <Label>DESK SET</Label>
        {moves.map((m, i) => {
          const o = interpolate(frame, [10 + i * 14, 26 + i * 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={m.n}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 22,
                opacity: o,
                transform: `translateY(${(1 - o) * 18}px)`,
                borderBottom: "1px solid #1C2130",
                padding: "18px 0",
              }}
            >
              <span style={{ color: HOT, fontSize: 34, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
                {m.n}
              </span>
              <span style={{ ...korean, color: INK, fontSize: 50, fontWeight: 700, flex: 1 }}>{m.t}</span>
              <span style={{ color: DIM, fontSize: 32, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                {m.s}
              </span>
            </div>
          );
        })}
      </Left>
      <Subtitle background="rgba(255,255,255,.08)" color={INK} align="left">
        일어나지 않고도 할 수 있어서 하루에 여러 번 반복하기 쉽습니다.
      </Subtitle>
    </Frame>
  );
};

/** 창고의 TypingText 를 그대로 씁니다 — props 만 우리 톤에 맞게 넘깁니다 */
const Closing: React.FC = () => (
  <Frame>
    <Left>
      {/*
        창고 컴포넌트를 그대로 쓸 때 걸리는 두 가지:
        (1) 대부분 화면 정중앙에 절대 배치됩니다 → 자리를 잡아주는 상자로 감쌉니다
        (2) 한글 줄바꿈 규칙을 모릅니다 → 상자에 korean 을 펼쳐 넣으면 상속됩니다
      */}
      <div style={{ ...korean, position: "relative", height: 300, width: "100%", maxWidth: 820 }}>
        <TypingText
          text={"가장 좋은 자세는\n다음 자세다"}
          textColor={INK}
          cursorColor={HOT}
          fontSize="4.6rem"
          fontFamily='"Pretendard Variable", sans-serif'
          fontWeight="800"
          durationInFramesToType={55}
        />
      </div>
      <p style={{ color: DIM, fontSize: 30, fontWeight: 600, margin: 0 }}>
        — 물리치료 분야에서 자주 인용되는 말
      </p>
    </Left>
    <Subtitle background="rgba(255,255,255,.08)" color={INK} align="left">
      지금 한 번, 20초만 해보세요.
    </Subtitle>
  </Frame>
);

export const DeskStretch3: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: BG }}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={100}>
        <Hook />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: 18 })}
      />
      <TransitionSeries.Sequence durationInFrames={155}>
        <Versus />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={wipe({ direction: "from-left" })}
        timing={linearTiming({ durationInFrames: 14 })}
      />
      <TransitionSeries.Sequence durationInFrames={215}>
        <Moves />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: 18 })}
      />
      <TransitionSeries.Sequence durationInFrames={130}>
        <Closing />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
