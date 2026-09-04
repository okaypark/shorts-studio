/**
 * Edge TTS 한국어. API 키 없이 Microsoft 온라인 음성 서비스에 연결합니다.
 * Python과 edge-tts 패키지, 인터넷 연결이 필요합니다.
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { join } from "node:path";
import { existsSync } from "node:fs";

const run = promisify(execFile);
const systemPython = process.platform === "win32"
  ? join(process.env.LOCALAPPDATA ?? "", "Programs", "Python", "Python311", "python.exe")
  : "python3";
const bundledPython = join(process.cwd(), ".tools", "miniconda", "envs", "openvoice", process.platform === "win32" ? "python.exe" : "bin/python");
const PY = existsSync(systemPython) ? systemPython : (existsSync(bundledPython) ? bundledPython : systemPython);

export const name = "edge";
export const label = "Edge TTS 한국어 (온라인)";
const VOICE = process.env.EDGE_TTS_VOICE || "ko-KR-SunHiNeural";
const RATE = process.env.EDGE_TTS_RATE || "+0%";

export const check = async () => {
  try {
    await run(PY, ["-c", "import edge_tts; print(edge_tts.__version__)"], { maxBuffer: 1024 * 1024 });
  } catch {
    throw new Error("Edge TTS가 설치돼 있지 않습니다. python -m pip install edge-tts 를 실행하세요.");
  }
  return VOICE;
};

export const synth = async ({ text, outPath }) => {
  await run(PY, [
    "-m", "edge_tts",
    "--voice", VOICE,
    "--rate", RATE,
    "--text", text,
    "--write-media", outPath,
  ], { maxBuffer: 1024 * 1024 * 16 });
};
