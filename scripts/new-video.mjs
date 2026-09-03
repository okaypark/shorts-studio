/**
 * 새 영상 폴더의 뼈대를 만듭니다.
 *
 *   npm run new -- morning-water
 *
 * 보통은 직접 칠 일이 없습니다. AI에게 "이 주제로 영상 만들어줘"라고 하면
 * AI가 폴더와 파일을 직접 씁니다. 이 스크립트는 그 형식의 기준점입니다.
 *
 * 만들어지는 건 최소한의 뼈대뿐입니다. 화면은 창고에서 골라 자유롭게 짜세요.
 */
import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import { join } from "node:path";

const slug = process.argv[2];

if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.log("이름을 영문 소문자와 하이픈으로 지어 주세요.  예: npm run new -- morning-water");
  process.exit(1);
}

const pascal = slug.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
const dir = join(process.cwd(), "videos", slug);

try {
  await access(dir);
  console.log(`이미 있는 영상입니다: videos/${slug}/`);
  process.exit(1);
} catch {
  // 없으면 계속
}

await mkdir(dir, { recursive: true });

const video = `/**
 * ${slug}
 *
 * 정해진 틀이 없습니다. 이 주제에 맞는 화면을 새로 만드세요.
 * 부품은 src/library/ 에 94종 있습니다 — 목록은 docs/CATALOG.md
 */
import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

import { Backdrop, Subtitle, bg, korean, SAFE_AREA } from "../../src/library/studio";

const INK = "#FFFFFF";

const Rise: React.FC<{ delay?: number; children: React.ReactNode }> = ({ delay = 0, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  return <div style={{ opacity: s, transform: \`translateY(\${(1 - s) * 26}px)\` }}>{children}</div>;
};

const Hook: React.FC = () => (
  <Backdrop image={bg("slate-blue")}>
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: \`\${SAFE_AREA.top}px \${SAFE_AREA.side}px \${SAFE_AREA.bottom}px\`,
      }}
    >
      <Rise>
        <h1 style={{ ...korean, color: INK, fontSize: 96, fontWeight: 800, lineHeight: 1.18, margin: 0 }}>
          첫 3초에 걸리는 한 문장
        </h1>
      </Rise>
    </AbsoluteFill>
    <Subtitle>내레이션으로 읽을 문장.</Subtitle>
  </Backdrop>
);

export const ${pascal}: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0E16" }}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={90}>
        <Hook />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 12 })}
      />
      <TransitionSeries.Sequence durationInFrames={120}>
        <Hook />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
`;

const script = `# ${slug}

## 컨셉
(색, 정렬, 모션, 전환을 어떻게 가져갈지 한 줄로)

## 대본

| 장면 | 화면 글씨 | 자막(내레이션) | 초 |
|---|---|---|---|
| 1 | | | 3 |
| 2 | | | 5 |
`;

await writeFile(join(dir, "Video.tsx"), video, "utf8");
await writeFile(join(dir, "script.md"), script, "utf8");

const indexPath = join(process.cwd(), "videos", "index.ts");
let index = await readFile(indexPath, "utf8");
index = index.replace(
  /(import \{ defineVideo.*\n)/,
  `$1import { ${pascal} } from "./${slug}/Video";\n`,
);
index = index.replace(
  /(export const VIDEOS: VideoEntry\[\] = \[\n)/,
  `$1  defineVideo({ id: "${slug}", title: "${slug}", component: ${pascal}, seconds: 18 }),\n`,
);
await writeFile(indexPath, index, "utf8");

console.log(`만들었습니다: videos/${slug}/`);
console.log("`npm run studio` 를 실행하면 목록에 나타납니다.");
