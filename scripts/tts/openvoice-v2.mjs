/** OpenVoice V2: Edge TTS 한국어 base 음성에 로컬 음색 프로필을 적용합니다. */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as edge from "./edge.mjs";

const run = promisify(execFile);
const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const bundledConda = join(root, ".tools", "miniconda", "condabin", process.platform === "win32" ? "conda.bat" : "conda");
const conda = process.env.CONDA_EXE || (existsSync(bundledConda) ? bundledConda : "conda");
const profile = process.env.OPENVOICE_PROFILE || "my_voice";

export const name = "openvoice-v2";
export const label = `내 목소리 (OpenVoice V2: ${profile})`;

export const check = async () => {
  await edge.check();
  try {
    await run(conda, ["run", "-n", "openvoice", "python", "-c", "import openvoice"], { maxBuffer: 1024 * 1024 * 16 });
    await run(conda, ["run", "-n", "openvoice", "python", join(root, "scripts", "tts_openvoice_v2.py"), "check", "--profile", profile], { maxBuffer: 1024 * 1024 * 16 });
  } catch {
    throw new Error(
      "내 목소리 환경 또는 프로필을 찾지 못했습니다. OpenVoice V2 설치 후 본인 음성을 등록하세요. " +
      "등록: conda run -n openvoice python scripts/tts_openvoice_v2.py register --reference voice_samples/my_voice/reference.wav --profile my_voice",
    );
  }
  return profile;
};

export const synth = async ({ text, outPath, runFfmpeg }) => {
  const baseMp3 = `${outPath}.edge.mp3`;
  const baseWav = `${outPath}.base.wav`;
  try {
    await edge.synth({ text, outPath: baseMp3 });
    await runFfmpeg(["-y", "-i", baseMp3, "-ac", "1", "-ar", "22050", baseWav]);
    await run(conda, [
      "run", "-n", "openvoice", "python", join(root, "scripts", "tts_openvoice_v2.py"),
      "synthesize", "--base", baseWav, "--profile", profile, "--output", outPath,
    ], { maxBuffer: 1024 * 1024 * 16 });
  } finally {
    await Promise.all([unlink(baseMp3).catch(() => {}), unlink(baseWav).catch(() => {})]);
  }
};
