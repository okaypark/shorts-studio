/**
 * 음성 길이를 장면 길이로 바꿔 주는 도구들.
 *
 * `npm run voice -- <슬러그>` 가 만든 public/audio/<슬러그>/index.json 을 받아서
 * 각 장면이 몇 프레임이어야 하는지 계산합니다.
 * 목소리를 바꾸면 index.json이 다시 만들어지고, 화면 길이도 알아서 따라갑니다.
 */

export type Take = {
  id: string;
  /** public/ 기준 경로 */
  file: string;
  text: string;
  seconds: number;
};

export type NarrationIndex = {
  slug: string;
  provider: string;
  voice: string | null;
  totalSeconds: number;
  takes: Take[];
};

/** 말이 끝나고 화면이 곧바로 넘어가면 급해 보입니다. 장면마다 조금 여유를 둡니다 */
export const TAIL_FRAMES = 14;

export const takeById = (index: NarrationIndex, id: string): Take => {
  const take = index.takes.find((t) => t.id === id);
  if (!take) {
    throw new Error(
      `내레이션에 "${id}" 가 없습니다. videos/${index.slug}/narration.ts 를 확인하고 npm run voice 를 다시 실행하세요.`,
    );
  }
  return take;
};

/** 이 장면이 차지할 프레임 수 = 음성 길이 + 꼬리 여유 */
export const framesFor = (take: Take, fps = 30): number =>
  Math.max(1, Math.round(take.seconds * fps) + TAIL_FRAMES);

/** 전환이 앞뒤 장면을 겹치므로, 총 길이에서 겹친 만큼 뺍니다 */
export const totalSeconds = (
  index: NarrationIndex,
  { fps = 30, transitionFrames = 12 }: { fps?: number; transitionFrames?: number } = {},
): number => {
  const frames = index.takes.reduce((sum, take) => sum + framesFor(take, fps), 0);
  const overlap = Math.max(0, index.takes.length - 1) * transitionFrames;
  return (frames - overlap) / fps;
};
