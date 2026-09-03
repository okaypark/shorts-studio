# 음성 붙이기

내레이션을 넣으면 **화면 길이를 손으로 맞출 필요가 없어집니다.**
음성 길이를 재서 장면 길이로 그대로 쓰기 때문입니다. 목소리를 바꾸면 화면도 알아서 따라갑니다.

---

## 쓰는 법

1. `videos/<슬러그>/narration.ts` 에 장면별 문장을 적습니다

   ```ts
   export const narration = [
     { id: "hook", text: "창가에 앉아 있어도 유리는 자외선B를 거의 통과시키지 않습니다." },
     { id: "point", text: "유리창을 사이에 두면 그 파장이 대부분 걸러집니다." },
   ];
   ```

2. 음성을 만듭니다

   ```
   npm run voice -- <슬러그>
   ```

3. 영상에서 그 길이를 씁니다

   ```tsx
   import narrationIndex from "../../public/audio/<슬러그>/index.json";
   import { framesFor, takeById, type NarrationIndex } from "../../src/lib/narration";

   const narration = narrationIndex as NarrationIndex;
   const take = (id: string) => takeById(narration, id);
   const frames = (id: string) => framesFor(take(id));

   <TransitionSeries.Sequence durationInFrames={frames("hook")}>
     <Hook />
   </TransitionSeries.Sequence>
   ```

   장면 안에서는 목소리와 자막을 한 줄로 얹습니다:

   ```tsx
   <Narration take={take("hook")} />
   ```

   자막 문장과 읽는 문장이 같은 곳에서 나오므로 둘이 어긋날 일이 없습니다.

4. 영상 길이도 자동입니다 — `videos/index.ts` 에서

   ```ts
   seconds: totalSeconds(narrationIndex as NarrationIndex)
   ```

문장을 고쳤으면 2번을 다시 실행하세요. 그게 전부입니다.

---

## 목소리 고르기

```
npm run voice -- <슬러그> --provider windows   (기본값)
npm run voice -- <슬러그> --provider melotts
npm run voice -- <슬러그> --provider dev
```

| 제공자 | 품질 | 설치 | 상업 이용 |
|---|---|---|---|
| `windows` | 낮음 (기계음) | 없음 — 윈도우에 이미 있음 | 자유 |
| `melotts` | 준수 | 파이썬 + pip 설치 | **MIT — 자유** |
| `dev` | 목소리 없음 | 없음 | 점검용 |

**권장 순서는 `windows` → `melotts` 입니다.**
먼저 Windows 내장 음성으로 파이프라인이 도는지 확인하고, 그다음 목소리만 갈아 끼우세요.
처음부터 MeloTTS로 가면 문제가 생겼을 때 설치 문제인지 배선 문제인지 구분이 안 됩니다.
목소리를 바꿔도 고칠 코드는 없습니다 — `index.json` 이 다시 만들어지고 화면이 따라갑니다.

### MeloTTS 설치

```
pip install git+https://github.com/myshell-ai/MeloTTS.git
pip install g2pkk
```

CPU로 실시간 처리되므로 그래픽카드가 필요 없습니다.

### 쓰지 않는 것

**edge-tts는 넣지 않았습니다.** 무료 한국어 TTS로 가장 많이 쓰이지만,
npm 패키지가 CC BY-NC-SA(비상업 전용)이고 파이썬판은 GPL입니다.
게다가 마이크로소프트의 비공식 엔드포인트를 쓰는 방식이라, 사업용 영상에 쓰면 두 겹으로 걸립니다.

품질이 더 필요하면 구글·애저 클라우드 TTS의 무료 티어를 각자 키로 붙이는 쪽이 안전합니다.
그 경우 키는 `.env` 에 두고 절대 커밋하지 마세요.

---

## 음성 없이 만드는 영상

내레이션이 필요 없는 영상도 많습니다. 자막만으로 충분한 경우죠.
그때는 `narration.ts` 없이 장면 길이를 직접 적으면 됩니다 —
`videos/desk-stretch-3` 이 그 예입니다.

---

## 알아둘 것

- 음성 파일은 `public/audio/<슬러그>/` 에 mp3로 저장됩니다. 영상의 일부라서 저장소에 함께 둡니다
- 장면은 음성보다 약 0.5초(14프레임) 깁니다. 말이 끝나자마자 화면이 넘어가면 급해 보이기 때문입니다
- Remotion에 딸린 ffmpeg를 쓰므로 따로 설치할 게 없습니다.
  다만 필터가 일부만 들어 있는 경량 빌드라 `afade` 같은 건 없습니다
