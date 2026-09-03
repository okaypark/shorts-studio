/**
 * 파트너용 업데이트 명령. `npm run update` 하나로 끝납니다.
 *
 *   1. 내 쪽에 저장 안 된 변경이 있으면 멈추고 알려줍니다 (덮어쓰지 않습니다)
 *   2. git pull
 *   3. 의존성이 바뀌었으면 npm install
 *
 * 파트너는 push하지 않습니다. 저장소는 읽기 전용으로 씁니다.
 */
import { execSync } from "node:child_process";

const run = (cmd, opts = {}) =>
  execSync(cmd, { stdio: "pipe", encoding: "utf8", ...opts }).trim();

const step = (msg) => console.log(`\n▸ ${msg}`);

try {
  run("git rev-parse --is-inside-work-tree");
} catch {
  console.log("이 폴더는 아직 git 저장소가 아닙니다. 관리자에게 clone 주소를 받으세요.");
  process.exit(1);
}

step("내 변경사항 확인");
const dirty = run("git status --porcelain");
if (dirty) {
  console.log("저장 안 된 변경이 있어서 업데이트를 멈췄습니다:\n");
  console.log(dirty);
  console.log("\n내가 만든 대본은 content/scripts/ 안에 있습니다.");
  console.log("그 파일들을 다른 곳에 복사해 두고 다시 실행하거나, AI에게 정리를 부탁하세요.");
  process.exit(1);
}
console.log("  깨끗합니다.");

step("최신 내용 받기");
const before = run("git rev-parse HEAD");
console.log(run("git pull --ff-only"));
const after = run("git rev-parse HEAD");

if (before === after) {
  console.log("\n이미 최신입니다.");
  process.exit(0);
}

step("바뀐 부분 확인");
const changed = run(`git diff --name-only ${before} ${after}`);
console.log(changed || "  (없음)");

if (changed.includes("package.json") || changed.includes("package-lock.json")) {
  step("새 라이브러리 설치");
  execSync("npm install", { stdio: "inherit" });
}

console.log("\n업데이트 완료. `npm run studio` 로 확인해 보세요.");
