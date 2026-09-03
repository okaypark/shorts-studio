/**
 * 내레이션 음성을 만들고, 그 길이를 재서 남깁니다.
 *
 *   npm run voice -- vitamin-d-morning
 *   npm run voice -- vitamin-d-morning --provider windows
 *   npm run voice -- vitamin-d-morning --provider melotts
 *
 * 하는 일:
 *   1. videos/<슬러그>/narration.ts 의 문장들을 읽습니다
 *   2. 문장마다 음성 파일을 만듭니다 (mp3)
 *   3. 각 음성의 실제 길이를 재서 public/audio/<슬러그>/index.json 에 적습니다
 *   4. 영상은 그 길이를 그대로 장면 길이로 씁니다 — 소리와 화면이 자동으로 맞습니다
 *
 * 목소리를 바꿔도 3번이 다시 계산되므로 화면도 알아서 따라갑니다.
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdir, writeFile, readFile, rm, access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const run = promisify(execFile);
const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith("--"));
const providerName = (() => {
  const i = args.indexOf("--provider");
  return i >= 0 ? args[i + 1] : "windows";
})();

if (!slug) {
  console.log("어느 영상인지 알려주세요.  예: npm run voice -- vitamin-d-morning");
  process.exit(1);
}

/** Remotion에 딸려 오는 ffmpeg를 씁니다. 따로 설치할 필요가 없습니다 */
const ffmpeg = join(root, "node_modules", ".bin", process.platform === "win32" ? "remotion.cmd" : "remotion");

const runFfmpeg = (ffArgs) => run(ffmpeg, ["ffmpeg", ...ffArgs], { maxBuffer: 1024 * 1024 * 16 });

const probeSeconds = async (file) => {
  const { stdout } = await run(
    ffmpeg,
    ["ffprobe", "-v", "quiet", "-show_entries", "format=duration", "-of", "csv=p=0", file],
    { maxBuffer: 1024 * 1024 },
  );
  const value = parseFloat(String(stdout).trim().split(/\r?\n/).pop());
  if (Number.isFinite(value)) return value;
  throw new Error(`음성 길이를 잴 수 없습니다: ${file}`);
};

const main = async () => {
  const narrationPath = join(root, "videos", slug, "narration.ts");
  try {
    await access(narrationPath);
  } catch {
    console.log(`videos/${slug}/narration.ts 가 없습니다.`);
    console.log("장면별 내레이션 문장을 그 파일에 먼저 적어 주세요.");
    process.exit(1);
  }

  // .ts 파일은 Node가 바로 실행할 수 없으므로, 문장만 읽어 냅니다 (컴파일 불필요)
  const raw = await readFile(narrationPath, "utf8");
  const matches = [
    ...raw.matchAll(/id:\s*"([^"]+)"\s*,\s*text:\s*"((?:[^"\\]|\\.)*)"/g),
  ];
  const takes = matches.map((m) => ({
    id: m[1],
    text: m[2].replace(/\\"/g, '"').replace(/\\n/g, " "),
  }));

  if (!takes?.length) {
    console.log("narration.ts 에서 문장을 찾지 못했습니다. 형식을 확인해 주세요.");
    process.exit(1);
  }

  const provider = await import(`./tts/${providerName}.mjs`).catch(() => null);
  if (!provider) {
    console.log(`모르는 제공자입니다: ${providerName}  (windows | melotts | dev)`);
    process.exit(1);
  }

  console.log(`\n제공자: ${provider.label}`);
  let voice;
  try {
    voice = await provider.check(runFfmpeg);
  } catch (err) {
    console.log(`\n쓸 수 없습니다 — ${err.message}\n`);
    process.exit(1);
  }
  console.log(`음성: ${voice === true ? "-" : voice}`);

  const outDir = join(root, "public", "audio", slug);
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  const tmpDir = join(outDir, "_wav");
  await mkdir(tmpDir, { recursive: true });

  console.log(`\n${takes.length}개 문장을 읽습니다.`);

  const wavItems = takes.map((take, i) => ({
    ...take,
    index: i,
    wavPath: join(tmpDir, `${String(i + 1).padStart(2, "0")}.wav`),
  }));

  if (provider.synthBatch) {
    await provider.synthBatch({ items: wavItems.map((w) => ({ text: w.text, outPath: w.wavPath })) });
  } else {
    for (const item of wavItems) {
      await provider.synth({ text: item.text, outPath: item.wavPath, runFfmpeg });
      process.stdout.write(".");
    }
    process.stdout.write("\n");
  }

  const entries = [];
  for (const item of wavItems) {
    const file = `${String(item.index + 1).padStart(2, "0")}.mp3`;
    const mp3Path = join(outDir, file);
    // wav 그대로 두면 저장소가 무거워집니다. mp3로 줄여서 보관합니다
    await runFfmpeg(["-y", "-i", item.wavPath, "-codec:a", "libmp3lame", "-q:a", "4", mp3Path]);
    const seconds = await probeSeconds(mp3Path);
    entries.push({
      id: item.id,
      file: `audio/${slug}/${file}`,
      text: item.text,
      seconds: Number(seconds.toFixed(3)),
    });
    console.log(`  ${item.id.padEnd(12)} ${seconds.toFixed(2)}초`);
  }

  await rm(tmpDir, { recursive: true, force: true });

  const total = entries.reduce((a, e) => a + e.seconds, 0);
  const index = {
    slug,
    provider: providerName,
    voice: voice === true ? null : voice,
    generatedAt: new Date().toISOString(),
    totalSeconds: Number(total.toFixed(3)),
    takes: entries,
  };
  await writeFile(join(outDir, "index.json"), JSON.stringify(index, null, 2) + "\n", "utf8");

  console.log(`\n전체 ${total.toFixed(1)}초`);
  console.log(`public/audio/${slug}/index.json 에 저장했습니다.`);
  console.log("`npm run studio` 로 소리와 화면이 맞는지 확인하세요.");
};

main().catch((err) => {
  console.error("\n실패했습니다:", err.message);
  process.exit(1);
});
