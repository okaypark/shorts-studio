/**
 * Windows 내장 음성 (SAPI).
 *
 * 설치할 게 없습니다. 윈도우에 이미 들어 있는 음성 합성을 PowerShell로 부릅니다.
 * 목소리가 기계적이라 최종 영상용으로는 부족하지만,
 * 파이프라인을 뚫고 타이밍을 잡는 단계에서는 이게 가장 확실합니다.
 *
 * 한국어 음성이 없다고 나오면:
 *   설정 → 시간 및 언어 → 언어 → 한국어 → 옵션 → 음성 을 설치하세요.
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { writeFile, unlink } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

const run = promisify(execFile);

export const name = "windows";
export const label = "Windows 내장 음성";

const ps = async (script) => {
  const file = join(tmpdir(), `shorts-studio-${Date.now()}-${Math.random().toString(36).slice(2)}.ps1`);
  await writeFile(file, "﻿" + script, "utf8");
  try {
    const { stdout } = await run(
      "powershell.exe",
      ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-File", file],
      { maxBuffer: 1024 * 1024 * 8 },
    );
    return stdout;
  } finally {
    await unlink(file).catch(() => {});
  }
};

export const check = async () => {
  if (process.platform !== "win32") {
    throw new Error("이 제공자는 Windows에서만 동작합니다.");
  }
  const out = await ps(`
Add-Type -AssemblyName System.Speech
$s = New-Object System.Speech.Synthesis.SpeechSynthesizer
$ko = $s.GetInstalledVoices() | Where-Object { $_.VoiceInfo.Culture.Name -eq 'ko-KR' }
if ($ko.Count -eq 0) { Write-Output "NONE" } else { Write-Output $ko[0].VoiceInfo.Name }
$s.Dispose()
`);
  const voice = out.trim().split(/\r?\n/).pop();
  if (!voice || voice === "NONE") {
    throw new Error(
      "한국어 음성이 설치돼 있지 않습니다.\n" +
        "        설정 → 시간 및 언어 → 언어 → 한국어 → 옵션 → 음성 에서 설치한 뒤 다시 실행하세요.",
    );
  }
  return voice;
};

export const synth = async ({ text, outPath, rate = 0 }) => {
  // 문장에 작은따옴표가 있으면 PowerShell 문자열이 깨지므로 두 번 씁니다
  const safeText = text.replace(/'/g, "''");
  const safePath = outPath.replace(/'/g, "''");
  await ps(`
Add-Type -AssemblyName System.Speech
$s = New-Object System.Speech.Synthesis.SpeechSynthesizer
$ko = $s.GetInstalledVoices() | Where-Object { $_.VoiceInfo.Culture.Name -eq 'ko-KR' }
if ($ko.Count -gt 0) { $s.SelectVoice($ko[0].VoiceInfo.Name) }
$s.Rate = ${rate}
$s.SetOutputToWaveFile('${safePath}')
$s.Speak('${safeText}')
$s.Dispose()
`);
};
