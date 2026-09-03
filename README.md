# shorts-studio

리모션(Remotion)으로 숏폼 영상을 만드는 공용 작업 환경입니다.
바로 쓸 수 있는 컴포넌트 **94종**이 들어 있고, 영상은 각자 자유롭게 짭니다.
건강 정보, 생활 정보, 제품 소개 — 분야를 가리지 않습니다.

**터미널을 몰라도 됩니다.** Claude 앱이나 Codex 앱에서 이 폴더를 열고
"이런 영상 만들어줘"라고 말하면, AI가 `CLAUDE.md`를 읽고 알아서 처리합니다.

---

## 처음 한 번만 하면 되는 준비

### AI에게 맡기는 방법 (권장)

터미널을 직접 사용할 필요가 없습니다. Codex 또는 Claude에
[`ENVIRONMENT_SETUP_PROMPT.md`](./ENVIRONMENT_SETUP_PROMPT.md)의 전체 내용을 보내고 실행을 요청하세요.

예를 들어 다음과 같이 말하면 됩니다.

> 이 환경세팅 프롬프트대로 설치와 검증을 진행해줘. 필요한 명령은 직접 실행하고,
> 권한 승인이나 로그인처럼 내가 해야 하는 작업이 있을 때만 알려줘.

AI가 다음 작업을 순서대로 진행합니다.

1. Windows의 실제 **내 문서(Documents)** 경로 확인
2. `내 문서\shorts-studio`에 이 저장소 설치 또는 기존 저장소의 변경 사항 점검
3. Git, Node.js 20 이상, npm과 Remotion 의존성 설치
4. Edge TTS(기본), OpenVoice V2(내 목소리), MeloTTS(로컬 대체), ElevenLabs SDK(선택) 설치·점검
5. Remotion Studio 실행 및 샘플 MP4 렌더링 검증

설치 중 관리자 권한, GitHub 로그인 또는 ElevenLabs API 키가 필요한 경우에만 AI의 안내에 따라
진행하세요. ElevenLabs는 API 키와 유료 사용 승인이 없으면 호출하지 않습니다. 내 목소리 기능은
본인이 직접 녹음했거나 사용 허가를 받은 10~30초 음성 샘플을 준비한 뒤 등록합니다.

### 직접 설치하는 방법

1. **Node.js 설치** — [nodejs.org](https://nodejs.org)에서 LTS 20 이상 버전
2. **폴더 위치** — Windows의 내 문서 폴더 아래 `shorts-studio`에 둡니다
3. **설치** — 저장소 폴더에서 다음 명령을 실행합니다.

   ```powershell
   npm ci
   ```

`package-lock.json`이 없을 때만 `npm install`을 사용하세요. TTS까지 포함한 전체 설치와 검증은
위 환경세팅 프롬프트를 사용하는 방법이 가장 간단합니다.

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
