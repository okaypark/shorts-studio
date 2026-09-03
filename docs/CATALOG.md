# 컴포넌트 창고 목록

이 저장소에는 바로 쓸 수 있는 컴포넌트 **94종**이 들어 있습니다.
영상을 만들 때는 여기서 골라 조합하세요. 없으면 직접 쓰면 되고, 새로 만든 게 쓸 만하면
`src/library/studio/` 에 넣어 다음에도 쓰면 됩니다.

## 두 종류의 창고 — 쓰는 법이 다릅니다

| | `src/library/clippkit/` (13종) | `src/library/rve/` (81종) |
|---|---|---|
| 형태 | props 를 받습니다 | 내용이 안에 박혀 있습니다 |
| 쓰는 법 | **그대로 import** 해서 값만 넘김 | **영상 폴더로 복사**해서 내용을 고침 |
| 예 | `<TypingText text="..." textColor="#fff" />` | `cp src/library/rve/donut-chart.tsx videos/내영상/Donut.tsx` 후 수정 |

원본 파일은 고치지 마세요. 창고는 깨끗하게 두고, 고친 사본을 각자 영상 폴더에 둡니다.
그래야 `npm run update` 로 창고가 갱신돼도 내 작업이 날아가지 않습니다.

## 한글을 쓸 때 꼭 확인할 것

창고 컴포넌트는 전부 영어 기준으로 만들어져서 한글 줄바꿈 규칙을 모릅니다.
감싸는 상자에 `korean` 을 펼쳐 넣으면 상속됩니다. 안 하면 "자세다"가 "자세 / 다"로 끊깁니다.

```tsx
import { korean } from "../../src/library/studio";

<div style={{ ...korean, position: "relative", height: 300 }}>
  <TypingText text={"가장 좋은 자세는\n다음 자세다"} />
</div>
```

대부분의 창고 컴포넌트는 **화면 정중앙에 절대 배치**됩니다.
원하는 자리에 두려면 위처럼 크기를 가진 상자로 감싸세요.

---

## clippkit — props 를 받는 13종

| 파일 | 무엇 |
|---|---|
| `typing-text` | 한 글자씩 타이핑 + 커서 깜빡임 |
| `sliding-text` | 방향을 골라 미끄러져 들어오는 텍스트 |
| `popping-text` | 글자별 스프링 팝 등장, 글자마다 색 지정 가능 |
| `glitch-text` | RGB 분리 글리치 |
| `card-flip` | 앞뒤 3D 카드 뒤집기 |
| `floating-card` | 떠 있는 카드 |
| `toast-card` | 알림 토스트 |
| `bar-loader` / `circular-loader` / `screen-loader` | 로딩 표시 3종 |
| `bar-waveform` / `linear-waveform` / `circular-waveform` | 오디오 파형 3종 (실제 음원 분석) |

---


## RVE — 차트·데이터

| 파일 | 무엇 |
|---|---|
| `chart-animation` | Animated SVG bar chart with staggered bar growth |
| `line-chart` | SVG polyline drawing left-to-right with data points |
| `pie-chart` | Segmented circle with sequential segment reveals |
| `donut-chart` | Ring chart with animated segments and centre metric |
| `area-chart` | Gradient-filled area under a line, revealing left to right |
| `progress-bars` | Horizontal bars filling to different widths |
| `stat-counter` | Large number counting up with comma formatting |
| `comparison-chart` | Side-by-side before/after metric comparison |
| `circular-progress` | Animated progress ring with percentage |

## RVE — 텍스트

| 파일 | 무엇 |
|---|---|
| `animated-text` | Character-by-character text reveal |
| `bounce-text` | Spring bounce entrance for titles |
| `bubble-pop-text` | Characters pop in inside bubbles |
| `floating-bubble-text` | Floating label with sine-wave wobble |
| `glitch-text` | RGB split glitch with decay |
| `popping-text` | Spring-based scale pop entrance |
| `pulsing-text` | Continuous scale pulse for emphasis |
| `slide-text` | Directional slide-in text |
| `typewriter-subtitle` | Character-by-character typing with cursor |

## RVE — 콘텐츠 애니메이션

| 파일 | 무엇 |
|---|---|
| `animated-list` | Staggered list item entrance |
| `card-flip` | 3D card flip with front/back content |
| `countdown-timer` | 5-4-3-2-1-GO with spring scale |
| `notification-pop` | Stacking notification toasts |
| `particle-explosion` | Burst particles from centre |
| `progress-steps` | Step indicator filling in sequence |
| `rotating-carousel` | 3D rotating card carousel |
| `sound-wave` | Audio waveform bar visualiser |
| `text-highlight` | Sequential word highlighting |

## RVE — 배경

| 파일 | 무엇 |
|---|---|
| `bokeh-circles` | Floating soft circles with drift |
| `geometric-patterns` | Rotating/scaling geometric shapes |
| `gradient-shift` | Slowly shifting ambient gradient |
| `grid-pulse` | Dot grid with ripple wave pulse |
| `liquid-wave` | Flowing SVG wave shapes |
| `matrix-rain` | Falling code rain columns |
| `noise-grain` | Subtle film grain overlay |
| `pixel-transition` | Pixelated grid reveal |
| `starfield` | Flying-through-space star effect |

## RVE — 시네마틱

| 파일 | 무엇 |
|---|---|
| `camera-shake` | Decaying shake for impact moments |
| `film-burn` | Warm light leak overlay |
| `ken-burns` | Pan and zoom for images |
| `letterbox-reveal` | Black bars retracting to reveal |
| `parallax-pan` | Multi-layer parallax scrolling |
| `spotlight-reveal` | Expanding circle clip-path reveal |
| `vignette-pulse` | Pulsing darkened edges overlay |
| `whip-pan` | Fast horizontal pan with motion blur |
| `zoom-pulse` | Rhythmic zoom in/out pulse |

## RVE — 전환

| 파일 | 무엇 |
|---|---|
| `blinds-transition` | Horizontal blinds opening |
| `clock-wipe` | Radial clock-hand sweep |
| `cross-dissolve` | Classic cross-fade between scenes |
| `fade-through-black` | Dip to black between scenes |
| `iris-transition` | Circular iris close/open |
| `morph-transition` | Scale-and-fade morph |
| `push-transition` | New scene pushes old off-screen |
| `slide-wipe` | Spring-driven panel slide |
| `zoom-through` | Zoom in then zoom out reveal |

## RVE — 로고·브랜딩

| 파일 | 무엇 |
|---|---|
| `logo-blur-reveal` | Focus-pull blur to sharp |
| `logo-bounce-drop` | Drop from above with bounce |
| `logo-fade-reveal` | Fade in with subtle scale-up |
| `logo-glitch-reveal` | RGB split glitch decaying to clean |
| `logo-scale-rotate` | Spinning scale entrance |
| `logo-spin-reveal` | 3D Y-axis spin reveal |
| `logo-split-reveal` | Left/right halves expanding |
| `logo-stroke-draw` | SVG stroke drawing animation |
| `logo-typewriter` | Icon + typed company name |

## RVE — 인트로·아웃트로

| 파일 | 무엇 |
|---|---|
| `chapter-title` | Chapter number with extending lines |
| `cinematic-title-intro` | Title spring-in with growing underline |
| `countdown-intro` | Ring countdown 3-2-1-GO |
| `credits-roll` | Scrolling movie-style credits |
| `end-card` | Outro with subscribe CTA |
| `lower-third` | News-style name/title bar |
| `quote-card` | Animated quotation with attribution |
| `subscribe-reminder` | Floating subscribe overlay |
| `title-split` | Split text meeting in centre |

## RVE — 이미지·미디어

| 파일 | 무엇 |
|---|---|
| `gallery-grid` | Staggered 2x3 grid reveal |
| `image-carousel` | Horizontal sliding with centre focus |
| `image-comparison-slider` | Before/after sliding divider |
| `image-zoom-reveal` | Zoom-out focus-pull reveal |
| `masonry-gallery` | Pinterest-style staggered grid |
| `photo-stack` | Overlapping frames with rotation |
| `picture-in-picture` | PiP overlay layout |
| `polaroid-frame` | Polaroid-style photo with drop-in |
| `split-screen` | Two panels sliding to meet |

---

## 창고에 더 넣기

`docs/CONTRIBUTING-LIBRARY.md` 의 절차를 따르세요.
MIT·Apache 라이선스만 들여옵니다. 라이선스가 적혀 있지 않은 저장소는 "자유"가 아니라
"권리 유보"이므로 가져오지 않습니다.
