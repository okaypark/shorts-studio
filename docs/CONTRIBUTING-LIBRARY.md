# 창고에 더 넣기

지금 창고에는 94종이 있습니다. 더 필요하면 가져오면 됩니다.

## 가져올 수 있는 곳

| 출처 | 라이선스 | 무엇 |
|---|---|---|
| [reactvideoeditor/remotion-templates](https://github.com/reactvideoeditor/remotion-templates) | MIT | 이미 81종 전부 들어와 있습니다 |
| [reactvideoeditor/clippkit](https://github.com/reactvideoeditor/clippkit) | MIT | 이미 13종 들어와 있습니다. 원본 저장소에 새 컴포넌트가 추가되면 가져오세요 |
| [remotion-animated](https://github.com/stefanwittwer/remotion-animated) | MIT | 이미 설치돼 있습니다 (`npm` 의존성) |
| [Remotion 공식](https://www.remotion.dev/docs) | Remotion License | `@remotion/transitions`, `@remotion/shapes` 등 |

## 절차

1. 컴포넌트 파일을 `src/library/<출처이름>/` 에 **원본 그대로** 복사합니다
2. 파일 상단의 원 저작자 주석은 지우지 않습니다
3. 그 폴더에 `LICENSE` 파일을 함께 둡니다
4. `docs/CATALOG.md` 목록에 한 줄 추가합니다
5. `LICENSE-NOTICE.md` 의 표에 출처를 적습니다
6. `npx tsc --noEmit` 으로 타입이 맞는지 확인합니다

Next.js 전용 코드(`next/image`, `<style jsx>`)가 섞여 있으면 Remotion 것으로 바꿔야 합니다.
`src/library/rve/parallax-pan.tsx` 상단에 그 예가 주석으로 남아 있습니다.

## 가져오지 말아야 할 것

- **React Video Editor Pro** — 상용 라이선스입니다. 넣는 순간 파트너 배포가 위반이 됩니다
- 라이선스가 적혀 있지 않은 저장소 — "라이선스 없음"은 자유가 아니라 권리 유보입니다
- 폰트 파일 — OFL·Apache 외에는 동봉하지 않습니다
- 스톡 음원 — 대개 채널 단위 라이선스라 여러 사람이 공유하면 위반입니다
