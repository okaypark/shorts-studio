# Remotion Shorts Studio + TTS 통합 환경세팅 프롬프트

당신은 Windows 노트북에서 Remotion 쇼츠 제작 환경을 설정하는 담당자입니다.
사용자는 터미널을 직접 사용하지 않습니다. 필요한 점검·설치·명령 실행은 당신이 진행하세요.

## 목표

GitHub 저장소 `okaypark/shorts-studio`를 이 PC의 **내 문서(Documents) 폴더 아래**에 설치하고, Remotion 쇼츠를 미리보기 및 MP4로 렌더링할 수 있는 상태까지 설정·검증하세요.

초기 설정 단계에서 다음 TTS도 모두 준비하세요.

1. **Edge TTS**: 기본 한국어 TTS. API 키 없이 사용하는 무료 온라인 음성 엔진
2. **OpenVoice V2**: Edge TTS 기본 음성에 사용자의 본인 음색을 적용하는 로컬 음성 복제
3. **MeloTTS**: 인터넷 연결이 없거나 Edge TTS를 사용할 수 없을 때 쓰는 로컬 대체 엔진
4. **ElevenLabs**: 선택형 클라우드 TTS 연동용 SDK와 설정 항목

## 작업 원칙

- 경로를 임의로 `C:\shorts-studio`로 정하지 마세요. `[Environment]::GetFolderPath('MyDocuments')`로 실제 내 문서 경로를 확인하고 그 아래 `shorts-studio`를 사용하세요. OneDrive에 연결되어 있어도 반환된 실제 경로를 그대로 사용하세요.

```powershell
$documentsPath = [Environment]::GetFolderPath('MyDocuments')
$projectPath = Join-Path $documentsPath 'shorts-studio'
$projectPath
```

- `$projectPath`가 이미 있다면 삭제·덮어쓰기하지 마세요. 먼저 Git 상태와 사용자 변경 사항을 확인하세요.
- 사용자 파일을 삭제하거나 `git reset --hard`를 사용하지 마세요.
- GitHub 로그인, 관리자 권한, 설치 승인, ElevenLabs API 키가 필요할 때만 사용자에게 정확히 안내하고 기다리세요.
- 외부 이미지나 유료 API를 임의로 사용하지 마세요. ElevenLabs는 SDK까지만 기본 설치하고, API 키와 사용 승인이 없으면 호출하지 마세요.
- 본인 또는 명시적 동의를 받은 음성만 복제하세요. 음성 샘플, speaker embedding, API 키는 외부 전송이나 Git 커밋을 금지합니다.
- 시스템 Python을 변경하지 말고 TTS는 전용 Conda 환경에 설치하세요.
- 설치 전 상태를 검사하고 정상 설치된 항목은 건너뛰세요. 재실행해도 안전하게 구성하세요.
- 과정과 결과를 한국어로 간결하게 보고하세요.

## 1. 사전 점검

- `git --version`, `node -v`, `npm -v`, `python --version`, `conda --version`, `ffmpeg -version`으로 확인하세요.
- Node.js가 없거나 20 미만이면 Node.js LTS 20 이상을 설치하세요.
- Git이 없으면 Git for Windows를 설치하세요.
- Conda가 없으면 Miniconda 설치를 안내하고, 승인이 필요하면 기다리세요.
- FFmpeg가 없으면 설치하세요. 관리자 권한이 필요하면 사용자에게 안내하세요.
- NVIDIA GPU와 CUDA를 검사하고, 가능하면 호환 PyTorch CUDA 빌드를 사용하며 아니면 CPU 모드를 사용하세요.
- 설치 후 버전을 다시 확인하세요.

## 2. 저장소 받기

- `$projectPath`가 없으면 clone하세요.

```powershell
gh repo clone okaypark/shorts-studio $projectPath
```

- `gh`가 없거나 로그인되지 않았다면 공개 저장소 여부를 확인한 뒤 HTTPS로 clone하세요.

```powershell
git clone https://github.com/okaypark/shorts-studio.git $projectPath
```

- 기존 폴더가 있으면 원격 주소, 현재 브랜치, 변경 사항부터 확인하세요. 사용자 변경 사항이 있으면 최신화하지 말고 보고하세요.
- 저장소 루트의 `AGENTS.md`, `CLAUDE.md`를 반드시 먼저 읽고 이후 작업에 적용하세요.

## 3. Remotion 의존성 설치·검증

- `package.json`과 lock 파일을 확인하세요.
- `package-lock.json`이 있으면 `npm ci`를 우선 실행하고, 필요할 때만 `npm install`을 사용하세요.
- `package.json`의 안전한 타입 검사·테스트·빌드 스크립트가 있으면 실행하세요.
- 오류가 나면 원인을 분석하고 해결을 시도하세요. 해결할 수 없으면 명령·원인·다음 조치를 보고하세요.

## 4. TTS 공통 환경 설치

- OpenVoice V2 공식 권장 환경에 맞춰 Python 3.9 Conda 환경 `openvoice`를 만드세요.
- 공식 OpenVoice 저장소는 `$projectPath\third_party\OpenVoice`에 clone하세요. 이미 있으면 삭제하지 말고 상태를 검사하세요.

```powershell
conda create -n openvoice python=3.9 -y
conda run -n openvoice python -m pip install --upgrade pip setuptools wheel
git clone https://github.com/myshell-ai/OpenVoice.git "$projectPath\third_party\OpenVoice"
conda run -n openvoice python -m pip install -e "$projectPath\third_party\OpenVoice"
conda run -n openvoice python -m pip install "git+https://github.com/myshell-ai/MeloTTS.git"
conda run -n openvoice python -m unidic download
conda run -n openvoice python -m pip install elevenlabs
conda run -n openvoice python -m pip install edge-tts
```

- `torch`, `openvoice`, `melo`, `elevenlabs`, `edge_tts` import를 각각 검사하세요.
- Python 패키지 충돌은 격리 환경 안에서 해결하고 Remotion의 Node 의존성을 바꾸지 마세요.

## 5. MeloTTS 설치·점검

- Edge TTS 장애나 오프라인 상황에 대비한 로컬 대체 엔진으로 `TTS(language='KR', device=device)`를 구성하세요.
- 짧은 한국어 문장을 WAV로 생성하고 길이, 채널, 샘플레이트, 파일 크기를 검사하세요.
- GPU가 없으면 CPU로 실행하세요. 모델 최초 다운로드에 필요한 시간과 용량을 알리세요.

## 6. OpenVoice V2와 내 목소리 등록

- Codex 앱에서 사용자가 내 목소리 사용을 요청하면, 음성 대화 기능을 음성 복제로 오인하지 않도록 안내하세요. 사용자에게 이 채팅에 본인 음성 파일(WAV·MP3·M4A)을 첨부하도록 요청하고, 본인 또는 명시적 허가를 받은 음성인지 확인하세요.
- 등록 전 사용자에게 진행 순서를 짧게 안내하세요: `파일 첨부 → 원본 보관·정규화 → 음색 프로필 생성 → 내 목소리로 테스트 음성 생성 → 쇼츠 음성에 적용`.
- 음성 원본과 프로필은 로컬의 `voice_samples/`, `voice_profiles/`에만 보관하고 `.gitignore`에 반드시 추가하세요. 파일명·경로를 포함해 Git 커밋·푸시·외부 공유를 하지 마세요.
- 공식 OpenVoice 문서 또는 공식 Hugging Face의 V2 체크포인트만 사용하고 아래 파일을 확인하세요.

```text
<프로젝트>\third_party\OpenVoice\checkpoints_v2\converter\config.json
<프로젝트>\third_party\OpenVoice\checkpoints_v2\converter\checkpoint.pth
<프로젝트>\third_party\OpenVoice\checkpoints_v2\base_speakers\ses\kr.pth
```

- 체크포인트와 중간 다운로드 파일을 `.gitignore`에 추가하세요.
- 사용자 음성은 아래 구조로 보관하세요.

```text
<프로젝트>\voice_samples\my_voice\reference-original.*
<프로젝트>\voice_samples\my_voice\reference.wav
<프로젝트>\voice_profiles\my_voice\se.pth
```

- 참조 음성이 없다면 설치는 완료하고, 사용자가 직접 녹음한 음성을 선택하도록 안내하세요.
- 권장 샘플은 조용한 환경, 배경음악 없음, 한 명만 발화, 10~30초입니다.
- WAV·MP3·M4A 입력을 지원하고 FFmpeg로 mono 22,050Hz PCM WAV를 생성하세요. 원본은 보존하고 기존 파일을 덮어쓰지 마세요.
- 깨끗한 단일 화자 10~30초 참조 음성은 `ToneColorConverter.extract_se()` 또는 `openvoice.se_extractor.get_se()`로 target speaker embedding을 추출해 `voice_profiles\my_voice\se.pth`에 캐시하세요. Windows에서 선택형 Whisper/VAD 의존성 설치가 불안정하면 전자를 사용하세요.
- 기본적으로 Edge TTS로 한국어 base 음성을 만든 후 WAV로 변환하고, OpenVoice V2 `ToneColorConverter`로 사용자의 음색을 적용하세요.
- Edge TTS 연결에 실패하거나 완전 로컬 처리가 필요한 경우에만 MeloTTS로 base 음성을 생성하세요.
- source embedding은 `checkpoints_v2\base_speakers\ses\kr.pth`, target embedding은 사용자 `se.pth`를 사용하세요.
- 저장소에 해당 CLI가 없다면 기존 구조를 존중해 `scripts/tts_openvoice_v2.py` 또는 동등한 모듈을 구현하세요.
- `npm run voice -- <slug> --provider openvoice-v2`가 Edge TTS로 한국어 base 음성을 만든 뒤 OpenVoice V2로 변환하도록 음성 제공자를 연결하세요. 기본 프로필은 `my_voice`로 두되 `OPENVOICE_PROFILE` 환경 변수로 바꿀 수 있게 하세요.

```powershell
conda run -n openvoice python scripts/tts_openvoice_v2.py register --reference "voice_samples/my_voice/reference.wav" --profile "my_voice"
conda run -n openvoice python scripts/tts_openvoice_v2.py synthesize --text "안녕하세요. 내 목소리로 만든 테스트 음성입니다." --profile "my_voice" --language KR --output "outputs/audio/openvoice-test.wav"
```

- 긴 원고는 문장별로 처리하고 문장 간격, 속도, `tau`, CPU/GPU, 출력 경로를 옵션으로 제공하세요.

## 7. ElevenLabs 선택 연동

- 공식 Python `elevenlabs` SDK 설치와 import까지만 기본 검증하세요.
- `.env.example`에 `ELEVENLABS_API_KEY=` 자리만 준비하고 실제 키는 저장하거나 커밋하지 마세요. `.env`가 `.gitignore`에 있는지 확인하세요.
- 키가 없으면 `설치 성공 / 음성 생성 미실행`으로 보고하세요.
- 사용자가 키를 제공하고 유료 사용을 명시적으로 승인했을 때만 테스트 호출하세요. 호출 전 비용 가능성을 알리세요.
- ElevenLabs 음성 복제도 본인 또는 허가받은 음성에만 사용하세요.

## 8. Edge TTS 설치·점검

- Python `edge-tts` 패키지를 설치하고 `edge_tts` import와 CLI 실행을 확인하세요.
- 별도 API 키는 요구하지 마세요. 다만 Microsoft 온라인 음성 서비스와 인터넷 연결이 필요한 엔진임을 사용자에게 알리세요.
- 사용 가능한 한국어 음성 목록을 조회하고, 기본 음성은 조회 결과에 실제로 존재하는 한국어 음성 중 하나를 선택하세요. 음성 이름을 추측하거나 하드코딩하기 전에 목록을 검사하세요.
- 짧은 한국어 문장을 기존 파일을 덮어쓰지 않는 새 MP3로 생성하고 FFmpeg로 재생 시간과 오디오 스트림을 검사하세요.
- 네트워크가 없거나 서비스 호출이 실패하면 전체 설치 실패로 처리하지 말고 `설치 성공 / 온라인 합성 미검증`으로 보고하세요.
- Edge TTS를 쇼츠 음성 생성과 OpenVoice용 base 음성의 **기본 엔진**으로 사용하세요. 완전 로컬 처리가 필요하거나 Edge TTS가 실패한 경우에만 MeloTTS로 대체하세요.

## 9. 저장소 음성 명령과 통합

- 기존 `npm run voice -- <slug>` 구현을 먼저 읽고 함부로 교체하지 마세요.
- 기존 엔진 선택 방식에 다음 항목을 추가하거나 매핑하세요.

```text
melo          = 오프라인 대체용 MeloTTS 한국어 음성
openvoice-v2  = Edge TTS + OpenVoice V2 내 목소리
elevenlabs    = 선택형 ElevenLabs API
edge          = 기본 무료 온라인 Edge TTS
```

- 기본 음성 엔진은 항상 `edge`로 설정하세요.
- 사용자 음성 프로필이 준비되어 있고 내 목소리 합성을 요청하면 `edge`로 base 음성을 생성한 뒤 `openvoice-v2`로 음색을 적용하세요.
- 사용자 음성 프로필이 없으면 Edge TTS 결과를 그대로 사용하세요. Edge TTS가 실패하거나 오프라인이면 `melo`로 자동 대체하고 그 사실을 알리세요.
- 음성 결과는 영상별 기존 오디오 폴더 규칙을 따르고 기존 파일을 덮어쓰지 마세요.

## 10. Remotion 동작 확인

- `npm run studio`로 Remotion Studio가 실행되는지 확인하세요.
- 첫 실행 시 Remotion 브라우저 엔진 다운로드로 시간이 걸릴 수 있음을 알리세요.
- 기존 예제 또는 샘플 영상 하나로 제작 구조와 렌더링 가능 여부를 확인하세요.
- 가능하면 `npm run make <slug> out/<새로운-파일명>.mp4`로 MP4까지 검증하세요.
- 기존 `out/` 파일은 덮어쓰지 말고 날짜·시간이 포함된 새 이름을 사용하세요.

## 11. 이 저장소의 제작 규칙

- 사용자가 새 쇼츠 제작을 요청하면, 제작에 들어가기 전에 반드시 해당 주제·목적·예상 시청자·플랫폼 특성에 맞는 **스타일과 디자인 콘셉트**를 추천하고 짧게 안내하세요. 예: 영상 톤, 색감, 타이포그래피, 화면 구성, 전환 리듬, BGM/효과음 방향.
- 추천은 매번 영상 내용에 맞춰 구체적으로 정하세요. 주제와 무관한 유행 스타일이나 템플릿을 관성적으로 제안하지 말고, 왜 그 콘셉트가 해당 쇼츠에 어울리는지 한두 문장으로 설명하세요.
- 사용자가 별도 스타일을 지정하지 않았다면 추천한 콘셉트를 기본 제작안으로 적용하세요. 사용자가 스타일을 지정했다면 그 선택을 우선하되, 전달력 또는 타깃 적합성에 중요한 보완점이 있을 때만 간결히 제안하세요.
- 영상은 `videos/<slug>/Video.tsx`에서 영상별로 자유롭게 제작합니다.
- 새 영상은 `videos/index.ts`에 등록합니다.
- 한글 텍스트에는 반드시 `korean` 스타일을 적용합니다.
- `src/library/` 원본은 수정하지 않습니다. 수정할 RVE 컴포넌트는 영상 폴더로 복사해 사용합니다.
- 건강·금융 영상은 제작 전에 `docs/COMPLIANCE.md`를 읽습니다.
- 음성은 `npm run voice -- <slug>`를 사용합니다.
- 기본 음성 생성에는 무료 온라인 `edge-tts`를 사용합니다. 실패하거나 오프라인이면 MeloTTS를 사용합니다.
- 미리보기는 `npm run studio`, 최종 렌더는 `npm run make <slug> out/<파일명>.mp4`입니다.

## 설치 완료 검증

다음을 실제로 검사하고 성공·실패·미실행 이유를 표로 정리하세요.

1. Git, Node.js, npm, Python, Conda, FFmpeg 버전
2. npm 의존성과 안전한 검사 스크립트
3. Remotion Studio 실행과 샘플 MP4 렌더링
4. `torch`, `openvoice`, `melo`, `elevenlabs`, `edge_tts` import
5. CUDA 또는 CPU 선택 결과
6. OpenVoice V2 converter와 한국어 base speaker embedding 로드
7. MeloTTS 한국어 테스트 WAV 생성
8. 참조 음성이 있으면 speaker embedding과 내 목소리 TTS 생성
9. ElevenLabs SDK와 API 키 설정 여부(키 값은 절대 출력하지 않음)
10. Edge TTS 한국어 음성 목록 조회와 테스트 MP3 생성

참조 음성이나 ElevenLabs API 키가 없어도 전체 설치를 실패 처리하지 마세요. `사용자 입력 대기` 또는 `선택 기능 미실행`으로 구분하세요.

## 최종 보고 형식

- 설치 경로:
- Git / Node / npm 버전:
- Python / Conda / FFmpeg 버전:
- 의존성 설치 결과:
- Remotion Studio 실행 결과:
- MeloTTS 설치 및 테스트 결과:
- OpenVoice V2 설치 결과:
- 내 목소리 등록 및 TTS 결과:
- ElevenLabs SDK / API 키 점검 결과:
- Edge TTS 설치 및 테스트 결과:
- MP4 렌더링 결과와 파일 경로:
- 남은 문제 또는 사용자가 해야 할 조치:

## 보안·권리 원칙

- 사용자 본인 또는 명시적 허가를 받은 음성만 사용합니다.
- 원본 음성, speaker embedding, API 키를 외부 공개하거나 Git에 커밋하지 않습니다.
- 사용자 확인 없이 음성 파일을 삭제하거나 덮어쓰지 않습니다.
- 공개 콘텐츠가 실제 발화로 오인될 수 있으면 AI 합성 음성임을 고지하도록 안내합니다.
