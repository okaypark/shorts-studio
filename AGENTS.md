# 작업 지침

작업 지침은 [`CLAUDE.md`](./CLAUDE.md) 한 곳에 모여 있습니다.
Codex를 포함한 모든 코딩 에이전트는 그 문서를 먼저 읽으세요.

핵심만 옮기면:

- 이 저장소는 템플릿이 아니라 **부품 창고**입니다. 영상마다 `videos/<slug>/Video.tsx` 에서 자유롭게 짭니다
- 창고는 `src/library/` 94종. 목록은 `docs/CATALOG.md`
- clippkit 13종은 props 를 받아 그대로 import, RVE 81종은 영상 폴더로 복사해서 수정
- 한글에는 반드시 `korean` 스타일을 펼쳐 넣습니다 (안 하면 단어 중간에서 줄이 끊깁니다)
- 직전 영상과 같은 얼굴이 나오면 실패입니다. 컨셉을 매번 새로 잡으세요
- 건강·금융 주제는 `docs/COMPLIANCE.md` 를 먼저 확인
- 음성은 `npm run voice -- <슬러그>` (기본 Windows 내장). 음성 길이가 곧 장면 길이입니다 — `docs/VOICE.md`
- 미리보기 `npm run studio`, 출력 `npm run make <슬러그> out/<이름>.mp4`
