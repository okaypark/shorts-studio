import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import type React from "react";

/**
 * 이 파일에 있는 것만이 이 저장소에서 "지켜야 하는 규칙"입니다.
 * 스타일이 아니라 한글이 제대로 보이기 위한 조건이라서 그렇습니다.
 * 색·레이아웃·모션은 전부 자유롭게 하시고, 이것만 쓰세요.
 */

export const FONT_FAMILY = "Pretendard Variable";

loadFont({
  family: FONT_FAMILY,
  url: staticFile("fonts/PretendardVariable.woff2"),
  weight: "45 920",
}).catch((err) => {
  console.warn("폰트를 불러오지 못했습니다. 시스템 폰트로 대체합니다.", err);
});

export const FONT_STACK = `"${FONT_FAMILY}", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif`;

/**
 * 한글 텍스트에는 항상 이걸 펼쳐 넣으세요.
 *
 *   <h1 style={{ ...korean, fontSize: 90, color: "#fff" }}>
 *
 * keep-all 이 없으면 "비타민D는"이 "비타 / 민D는"으로 끊깁니다.
 * pre-line 이 없으면 대본에 쓴 줄바꿈(\n)이 무시됩니다.
 */
export const korean: React.CSSProperties = {
  fontFamily: FONT_STACK,
  wordBreak: "keep-all",
  overflowWrap: "break-word",
  whiteSpace: "pre-line",
  textWrap: "balance",
};

/**
 * 세로 영상에서 플랫폼 UI(하단 버튼, 상단 프로필)에 가려지는 영역입니다.
 * 중요한 글자를 이 바깥으로 내보내지 마세요.
 */
export const SAFE_AREA = {
  top: 220,
  bottom: 380,
  side: 80,
} as const;

/** 자막 읽는 속도. 한글은 초당 6~7자가 편합니다 */
export const readingSeconds = (text: string): number =>
  Math.max(1.6, text.replace(/\s/g, "").length / 6.5 + 0.8);
