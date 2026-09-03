/**
 * 개발용 가짜 음성.
 *
 * 진짜 목소리 대신, 그 문장을 읽는 데 걸릴 만한 길이의 조용한 소리를 만듭니다.
 * 목소리 없이도 "음성 길이 → 화면 길이" 배선이 맞는지 확인할 수 있어서,
 * TTS 설치가 안 된 환경에서 파이프라인만 점검할 때 씁니다.
 *
 * 실제 영상에는 쓰지 마세요.
 */
/** 한글은 초당 6.5자 정도가 편하게 들립니다 */
export const estimateSeconds = (text) =>
  Math.max(1.4, text.replace(/\s/g, "").length / 6.5 + 0.7);

export const name = "dev";
export const label = "개발용 (목소리 없음)";

export const check = async (runFfmpeg) => {
  await runFfmpeg(["-version"]);
  return true;
};

export const synth = async ({ text, outPath, runFfmpeg }) => {
  const seconds = estimateSeconds(text);
  await runFfmpeg([
    "-y",
    "-f", "lavfi",
    "-i", `sine=frequency=220:duration=${seconds.toFixed(2)}`,
    // Remotion에 딸린 ffmpeg는 필터가 일부만 들어 있는 경량 빌드입니다.
    // afade 같은 건 없으니 volume 정도만 씁니다.
    "-af", "volume=-38dB",
    "-ar", "24000",
    "-ac", "1",
    outPath,
  ]);
};
