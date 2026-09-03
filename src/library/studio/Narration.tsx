import React from "react";
import { Audio, staticFile } from "remotion";
import type { Take } from "../../lib/narration";
import { Subtitle } from "./Subtitle";

type SubtitleLook = Readonly<{
  color?: string;
  background?: string;
  fontSize?: number;
  bottom?: number;
  align?: "center" | "left";
  style?: React.CSSProperties;
}>;

/**
 * 한 장면의 목소리와 자막을 함께 얹습니다.
 *
 * 자막 문장과 읽는 문장이 항상 같아지므로, 둘이 어긋날 일이 없습니다.
 * 자막 모양을 바꾸고 싶으면 subtitle 로 원하는 걸 직접 넘기세요.
 */
export const Narration: React.FC<{
  take: Take;
  /** 자막을 직접 그리고 싶을 때. 넘기지 않으면 기본 자막이 나옵니다 */
  subtitle?: React.ReactNode | false;
  volume?: number;
  /** 기본 자막의 모양만 바꾸고 싶을 때 (색, 배경, 글자 크기 등) */
  subtitleProps?: SubtitleLook;
}> = ({ take, subtitle, volume = 1, subtitleProps }) => (
  <>
    <Audio src={staticFile(take.file)} volume={volume} />
    {subtitle === false ? null : subtitle ? (
      subtitle
    ) : (
      <Subtitle {...subtitleProps}>{take.text}</Subtitle>
    )}
  </>
);
