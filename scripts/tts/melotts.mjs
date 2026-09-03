/**
 * MeloTTS 한국어 (MIT 라이선스 — 상업 이용 가능).
 *
 * 목소리 품질이 Windows 내장보다 확실히 낫고, CPU에서 실시간으로 돌아 GPU가 필요 없습니다.
 * 대신 파이썬이 필요합니다.
 *
 * 처음 한 번 설치:
 *   pip install git+https://github.com/myshell-ai/MeloTTS.git
 *   pip install g2pkk
 *
 * 설치가 막히면 Windows 내장 음성으로 먼저 파이프라인을 뚫어 두고
 * 나중에 목소리만 갈아 끼우면 됩니다. 나머지 배선은 똑같습니다.
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { writeFile, unlink } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

const run = promisify(execFile);

export const name = "melotts";
export const label = "MeloTTS 한국어 (MIT)";

const PY = process.platform === "win32" ? "python" : "python3";

const py = async (script, args = []) => {
  const file = join(tmpdir(), `shorts-studio-${Date.now()}-${Math.random().toString(36).slice(2)}.py`);
  await writeFile(file, script, "utf8");
  try {
    const { stdout } = await run(PY, [file, ...args], { maxBuffer: 1024 * 1024 * 16 });
    return stdout;
  } finally {
    await unlink(file).catch(() => {});
  }
};

export const check = async () => {
  try {
    await py("import melo.api\nprint('ok')\n");
  } catch {
    throw new Error(
      "MeloTTS가 설치돼 있지 않습니다.\n" +
        "        pip install git+https://github.com/myshell-ai/MeloTTS.git\n" +
        "        pip install g2pkk",
    );
  }
  return "MeloTTS KR";
};

/** 모델을 매번 다시 올리면 느려서, 문장을 한 번에 넘겨 처리합니다 */
export const synthBatch = async ({ items, speed = 1.0 }) => {
  const payload = JSON.stringify(items.map((i) => ({ text: i.text, out: i.outPath })));
  const script = `
import json, sys
from melo.api import TTS

items = json.loads(sys.argv[1])
tts = TTS(language="KR", device="cpu")
speaker_ids = tts.hps.data.spk2id
speaker = speaker_ids["KR"]

for it in items:
    tts.tts_to_file(it["text"], speaker, it["out"], speed=${speed})
    print("done", it["out"])
`;
  await py(script, [payload]);
};

export const synth = async ({ text, outPath, speed = 1.0 }) => {
  await synthBatch({ items: [{ text, outPath }], speed });
};
