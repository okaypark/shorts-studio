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
npm run voice -- <슬러그> --provider edge      (기본값)
npm run voice -- <슬러그> --provider melotts
npm run voice -- <슬러그> --provider windows
npm run voice -- <슬러그> --provider dev
npm run voice -- <슬러그> --provider openvoice-v2
```

| 제공자 | 품질 | 설치 | 상업 이용 |
|---|---|---|---|
| `edge` | 좋음 | Python + `edge-tts`, 인터넷 연결 | 배포 전 서비스 이용 조건 확인 |
| `windows` | 낮음 (기계음) | 없음 — 윈도우에 이미 있음 | 자유 |
| `melotts` | 준수 | 파이썬 + pip 설치 | **MIT — 자유** |
| `dev` | 목소리 없음 | 없음 | 점검용 |

기본 제공자는 `edge`입니다. 인터넷 연결이 없거나 Edge TTS를 사용할 수 없으면 `melotts`,
설치 상태만 확인할 때는 `windows` 또는 `dev`를 사용하세요.
목소리를 바꿔도 고칠 코드는 없습니다 — `index.json` 이 다시 만들어지고 화면이 따라갑니다.

### 내 목소리 (OpenVoice V2)

Codex 앱의 음성 대화는 작업 지시용이며, 쇼츠용 음성 복제는 별도 등록 과정이 필요합니다.
본인 또는 명시적으로 사용 허가를 받은 10~30초 녹음 파일을 채팅에 첨부하면, 아래 순서로 처리합니다.

1. 원본을 `voice_samples/<프로필>/reference-original.*`에 보관하고 22,050Hz 모노 WAV로 정규화합니다.
2. OpenVoice V2가 `voice_profiles/<프로필>/se.pth` 음색 프로필을 만듭니다.
3. `npm run voice -- <슬러그> --provider openvoice-v2`로 Edge TTS의 한국어 base 음성에 그 프로필을 적용합니다.

기본 프로필 이름은 `my_voice`이고, 다른 프로필은 `OPENVOICE_PROFILE=<이름>`으로 선택합니다.
원본과 프로필은 개인 정보이므로 Git에 포함하지 않습니다.

### Edge TTS 설치

```
python -m pip install edge-tts
```

기본 한국어 음성은 `ko-KR-SunHiNeural`입니다. `EDGE_TTS_VOICE`로 음성을,
`EDGE_TTS_RATE`로 속도를 바꿀 수 있습니다. 예: `EDGE_TTS_RATE=+15%`.
Edge TTS는 API 키가 필요 없지만 온라인 서비스에 연결되므로 배포 목적에 맞는 이용 조건을 확인하세요.

### MeloTTS 설치

```
pip install git+https://github.com/myshell-ai/MeloTTS.git
pip install g2pkk
```

CPU로 실시간 처리되므로 그래픽카드가 필요 없습니다.

품질이나 사용 조건 때문에 공식 상용 TTS가 필요하면 각자 발급받은 키로 제공자를 추가하세요.
키는 `.env`에 두고 절대 커밋하지 마세요.

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
