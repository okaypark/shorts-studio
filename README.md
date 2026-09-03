# shorts-studio

리모션(Remotion)으로 숏폼 영상을 만드는 공용 작업 환경입니다.
바로 쓸 수 있는 컴포넌트 **94종**이 들어 있고, 영상은 각자 자유롭게 짭니다.
건강 정보, 생활 정보, 제품 소개 — 분야를 가리지 않습니다.

**터미널을 몰라도 됩니다.** Claude 앱이나 Codex 앱에서 이 폴더를 열고
"이런 영상 만들어줘"라고 말하면, AI가 `CLAUDE.md`를 읽고 알아서 처리합니다.

---

## 처음 한 번만 하면 되는 준비

1. **Node.js 설치** — [nodejs.org](https://nodejs.org)에서 LTS 버전
2. **폴더 위치** — `C:\shorts-studio` 처럼 **짧고 영문인 경로**에 둡니다
   (Windows는 경로가 길거나 한글이 섞이면 설치가 실패합니다)
3. **설치** — AI에게 "설치해줘"라고 하거나:

   ```
   npm install
   ```

---

## 쓰는 법

| 하고 싶은 것 | 명령 |
|---|---|
| 미리보기 창 열기 | `npm run studio` |
| 영상 파일로 뽑기 | `npm run make <슬러그> out/영상.mp4` |
| 만들 수 있는 영상 목록 | `npm run list` |
| 최신 창고 받기 | `npm run update` |
| 내레이션 음성 만들기 | `npm run voice -- 슬러그` |
| 새 영상 뼈대 만들기 | `npm run new -- 영상이름` |

`npm run studio` 를 실행하면 브라우저가 열리고, 왼쪽 목록에서 영상을 고르면 바로 재생됩니다.
코드를 고치면 화면이 즉시 따라 바뀝니다.

---

## 폴더 구조

```
videos/              ← 작업하는 곳. 영상 하나당 폴더 하나
  vitamin-d-morning/   Video.tsx  ← 자유롭게 짠 컴포지션
  desk-stretch-3/      Video.tsx

src/library/         ← 부품 창고 94종
  rve/                 81종 — 복사해서 고쳐 쓰는 템플릿
  clippkit/            13종 — props 받아서 그대로 쓰는 컴포넌트
  studio/              배경·자막·한글 타이포 기본기

public/images/       ← 배경 12종 기본 제공. 사진은 각자 추가
docs/CATALOG.md      ← 창고 94종 목록
CLAUDE.md            ← AI가 읽는 작업 지침
out/                 ← 완성된 영상 (공유되지 않습니다)
```

---

## 정해진 스타일이 없습니다

이건 의도된 설계입니다. 템플릿을 정해두면 모두의 영상이 똑같이 나옵니다.
그래서 이 저장소는 **틀이 아니라 부품**을 공유합니다. 같은 창고를 쓰면서도
사람마다, 영상마다 다른 얼굴이 나오는 게 목표입니다.

예시로 들어 있는 두 영상을 나란히 보세요. 색도 정렬도 모션도 전환도 공유하는 게 없습니다.

---

## 만든 영상은 누구 것인가

**만든 사람 것입니다.** 이 저장소는 설치와 부품만 공통이고,
기획·대본·제작·배포는 각자 자기 사업으로 합니다.
자세한 내용은 [`LICENSE-NOTICE.md`](./LICENSE-NOTICE.md).

---

## 막혔을 때

- 설치나 실행이 안 되면 AI에게 오류 메시지를 그대로 보여주세요. `CLAUDE.md`에 해결법이 있습니다
- 대본 쓰는 법은 [`docs/SCRIPT-GUIDE.md`](./docs/SCRIPT-GUIDE.md)
- 화면 규칙은 [`docs/VISUAL-GUIDE.md`](./docs/VISUAL-GUIDE.md)
- 음성 붙이는 법은 [`docs/VOICE.md`](./docs/VOICE.md)
- 건강·금융 주제라면 [`docs/COMPLIANCE.md`](./docs/COMPLIANCE.md)를 먼저 확인하세요
