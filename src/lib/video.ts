import type React from "react";

/**
 * 영상 하나를 등록하는 최소 정보입니다.
 *
 * 이 저장소는 "정해진 틀에 내용을 채우는" 방식이 아니라
 * "영상마다 자유롭게 짜고 등록만 하는" 방식입니다.
 * 그래서 여기서 강제하는 건 길이와 크기뿐입니다. 화면 안쪽은 전부 자유입니다.
 */
export type VideoEntry = {
  /** 컴포지션 ID. 영문 소문자와 하이픈. 폴더 이름과 같게 맞춥니다 */
  id: string;
  /** 스튜디오 목록에 보이는 이름 */
  title: string;
  component: React.FC;
  /** 초 단위 길이. 프레임이 아니라 초로 적습니다 */
  seconds: number;
  fps?: number;
  /** 미리 정해진 비율 이름, 또는 직접 지정한 크기 */
  format?: Format;
  size?: { width: number; height: number };
};

export type Format = "portrait" | "square" | "landscape";

export const FORMATS: Record<Format, { width: number; height: number }> = {
  portrait: { width: 1080, height: 1920 },
  square: { width: 1080, height: 1080 },
  landscape: { width: 1920, height: 1080 },
};

export const defineVideo = (entry: VideoEntry): VideoEntry => entry;

export const resolveSize = (entry: VideoEntry) =>
  entry.size ?? FORMATS[entry.format ?? "portrait"];

export const resolveFps = (entry: VideoEntry) => entry.fps ?? 30;

export const resolveDuration = (entry: VideoEntry) =>
  Math.max(1, Math.round(entry.seconds * resolveFps(entry)));
