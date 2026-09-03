import { defineVideo, type VideoEntry } from "../src/lib/video";
import { totalSeconds } from "../src/lib/narration";
import type { NarrationIndex } from "../src/lib/narration";
import vitaminDNarration from "../public/audio/vitamin-d-morning/index.json";
import { VitaminDMorning } from "./vitamin-d-morning/Video";
import { DeskStretch3 } from "./desk-stretch-3/Video";

/**
 * 만든 영상을 여기에 한 줄씩 등록합니다.
 * 등록하면 스튜디오 왼쪽 목록에 바로 나타납니다.
 */
export const VIDEOS: VideoEntry[] = [
  defineVideo({
    id: "vitamin-d-morning",
    title: "아침 햇빛 15분",
    component: VitaminDMorning,
    // 길이를 손으로 적지 않습니다. 음성 길이에서 계산됩니다
    seconds: totalSeconds(vitaminDNarration as NarrationIndex),
  }),
  defineVideo({
    id: "desk-stretch-3",
    title: "앉아서 하는 3분 스트레칭",
    component: DeskStretch3,
    seconds: 19,
  }),
];
