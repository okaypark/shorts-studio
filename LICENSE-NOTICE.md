# 라이선스 안내

이 저장소를 쓰기 전에 한 번은 읽어 주세요. 길지 않습니다.

---

## Remotion — 각자 판단해야 하는 부분

이 저장소는 [Remotion](https://www.remotion.dev)으로 영상을 만듭니다.
Remotion은 오픈소스지만 MIT가 아니고, 자체 라이선스를 씁니다.

- **개인, 3인 이하 조직, 비영리 단체는 무료**입니다. 상업적 영상 제작도 포함됩니다
- 그보다 큰 영리 조직은 Company License가 필요합니다

**이 저장소는 부품 창고일 뿐, 공동 작업 프로젝트가 아닙니다.**
설치와 컴포넌트만 공통이고, 영상 기획·대본·제작·배포는 각 사용자가 자기 사업 명의로
독립적으로 수행합니다. 만든 영상과 코드의 권리도 만든 사람에게 있습니다.

따라서 **Remotion 라이선스 요건은 각자 자기 조직 규모를 기준으로 판단**하시면 됩니다.
확실하지 않으면 [Remotion License FAQ](https://www.remotion.dev/docs/license/faq)를 보거나
Remotion 측에 직접 문의하세요.

Remotion 자체는 이 저장소에 복사돼 있지 않습니다. `package.json`에 버전만 고정돼 있고,
`npm install` 할 때 각자 내려받습니다.

---

## 창고에 들어 있는 것

| 항목 | 출처 | 라이선스 | 재배포 |
|---|---|---|---|
| `src/library/rve/` 81종 | [remotion-templates](https://github.com/reactvideoeditor/remotion-templates) (React Video Editor) | MIT | 자유 |
| `src/library/clippkit/` 13종 | [clippkit](https://github.com/reactvideoeditor/clippkit) | MIT | 자유 |
| `src/library/studio/` | 이 저장소 자작 | — | 자유 |
| `videos/` 예시 2종 | 이 저장소 자작 | — | 자유 |
| `public/images/backgrounds/` 12종 | 이 저장소 자작 (코드로 생성) | — | 자유 |
| `remotion-animated` | [stefanwittwer](https://github.com/stefanwittwer/remotion-animated) | MIT | 자유 |
| Pretendard (`public/fonts/`) | [orioncactus](https://github.com/orioncactus/pretendard) | SIL OFL 1.1 | 자유 — `OFL.txt` 동봉 |

MIT로 들여온 파일은 **원본 그대로** 두고 각 폴더에 라이선스 파일을 함께 뒀습니다.
파일 상단의 원 저작자 주석은 지우지 마세요.

RVE 원본 3개 파일(`ken-burns`, `parallax-pan`, `zoom-pulse`)만 Next.js 전용 코드를
Remotion용으로 바꿨고, 그 사실을 파일 상단에 적어 뒀습니다.

배경 이미지 12종은 스톡에서 받아온 게 아니라 코드로 만든 것입니다.
**어떤 주제, 어떤 브랜드의 영상에 써도 문제가 없습니다.**

---

## 창고에 들어 있지 않은 것, 그리고 그 이유

- **사진·영상 소재** — 스톡 사이트 약관은 대개 "받은 사람 본인"에게만 사용을 허락합니다.
  여러 명이 공유하는 저장소에 넣으면 그 조건을 벗어납니다. 각자 받아서 자기 `public/images/` 에 넣으세요
- **배경 음악** — 대개 채널·프로젝트 단위 라이선스입니다. 같은 이유로 동봉하지 않습니다
- **React Video Editor Pro** — 상용 라이선스라 재배포할 수 없습니다. 무료로 공개된 템플릿 81종만 들여왔습니다
- **특정 브랜드 이미지·로고** — 각 브랜드의 사용 규정을 따라야 합니다.
  공용 창고에 넣지 말고, 필요한 사람이 자기 폴더에 넣어 쓰세요

새 오픈소스를 가져올 때는 `docs/CONTRIBUTING-LIBRARY.md` 의 절차를 따르고,
위 표에 한 줄 추가하세요.
