# CAT4U: EVE Online Intelligence Community Frontend

EVE Online의 복잡한 도메인 데이터를 시각화하고, 지능형 블록 기반 에디터를 통해 고품질 가이드 작성을 지원하는 차세대 Next.js 프론트엔드 플랫폼

* 이 프로젝트는 대용량 게임 미디어 업로드의 클라이언트 사이드 최적화와 게임 정적 데이터(SDE)를 활용한 인터랙티브 에디팅 경험을 제공하는 데 초점을 맞춘다.

## 1. 왜 이 프로젝트가 필요한가

* **가이드 작성의 높은 진입장벽**: EVE Online의 가이드는 수많은 아이콘, 함선 수치, 복잡한 피팅 정보를 포함해야 하지만, 일반적인 마크다운이나 위키 에디터로는 이를 구조화하고 시각화하기에 한계가 있음.
* **불필요한 리소스 낭비**: 고해상도 이미지와 영상을 반복 업로드할 때 발생하는 사용자의 대기 시간과 네트워크 비용을 줄이기 위해, 업로드 전 클라이언트 사이드에서의 중복 검증 및 최적화가 필수적임.
* **사용자 경험의 일관성**: 게임 내 UI의 정체성(Identity)을 유지하면서도, 웹 환경에서 최적의 가독성과 반응형 레이아웃을 제공하여 가이드의 전달력을 극대화해야 함.

## 2. 핵심 제약

* **브라우저 성능 최적화**: 수백 개의 인게임 아이콘과 리치 미디어가 포함된 긴 가이드를 렌더링할 때도 60fps 수준의 부드러운 스크롤과 상호작용을 유지해야 함.
* **S3 직접 업로드 보안**: 백엔드 대역폭을 보호하기 위해 클라이언트가 S3에 직접 파일을 전송하되, 이 과정에서 발급된 Pre-signed URL의 오남용을 방지해야 함.
* **엄격한 작성 권한 UI**: ESI 인증 여부에 따라 편집 도구의 노출 여부를 동적으로 제어하고, 승인 대기 중인 문서(`Draft`)의 상태를 시각적으로 명확히 구분해야 함.

## 3. 해결 전략

* **커스텀 블록 기반 에디팅 (BlockNote)**: 단순 텍스트를 넘어 이브 온라인의 아이콘 검색, 함선 피팅 정보 시각화 블록, AI 도우미 메뉴 등을 슬래시 커맨드와 커스텀 메뉴로 구현하여 작성 생산성을 높임.
* **클라이언트 사이드 MD5 중복 제거**: 파일 업로드 시작 전 `SparkMD5`를 이용해 해시를 생성, 백엔드에 기등록 여부를 확인하여 중복 파일의 경우 업로드 과정을 즉시 생략(Instant Upload)함.
* **AI-Assisted Writing UI**: Vercel AI SDK를 연동하여 에디터 내에서 실시간으로 문맥을 분석하고, SDE 데이터를 기반으로 한 수치 교정 및 포매팅 제안 기능을 제공.
* **EVE UI 디자인 시스템**: Tailwind CSS 4를 활용하여 게임의 다크 모드 감성을 현대적으로 재해석한 글래스모피즘(Glassmorphism) 기반 UI 컴포넌트 라이브러리 구축.

## 4. 아키텍처 / 데이터 흐름

### 미디어 업로드 및 최적화 흐름 (Frontend Perspective)
1. **File Selection**: 유저가 이미지/영상 선택
2. **Hashing**: `SparkMD5`를 사용하여 브라우저에서 MD5 해시 계산 (Chunk 단위 처리로 대용량 지원)
3. **Check Duplicate**: 백엔드 API에 해시 전달 → 중복 시 기존 S3 URL 즉시 반환 및 종료
4. **Direct Upload**: 신규 파일인 경우 발급받은 Pre-signed URL로 S3 `incoming` 폴더에 직접 PUT 요청
5. **UI Update**: 업로드 완료 후 에디터 내에 즉시 미리보기 및 최적화 대기 상태 표시

### 지능형 문서 작성 흐름
1. **Slash Command**: `/eve-icon` 또는 `/ai-check` 등으로 특수 블록 호출
2. **Context Provider**: 에디터 내의 현재 텍스트 및 태그 정보를 AI SDK에 전달
3. **Interactive Preview**: AI가 제안한 가이드 초안이나 수정 사항을 사용자가 실시간으로 수락/거절하며 문서 완성

## 5. 주요 구현 포인트

### 5.1 Rich Block-based Editor (BlockNote)
* **Custom Slash Commands**: `/` 입력을 통해 수천 개의 이브 온라인 아이콘을 실시간 검색하여 삽입할 수 있는 커스텀 인라인 메뉴 구현.
* **EVE Fit Rendering**: 함선 피팅 코드(EFT)를 입력하면 이를 파싱하여 웹 환경에서 인터랙티브하게 보여주는 전용 블록 컴포넌트 구축.

### 5.2 클라이언트 사이드 리소스 최적화
* **Streaming Hashing**: 대용량 파일의 해시 계산 시 브라우저 메모리 고갈을 방지하기 위해 파일을 조각(Chunk) 단위로 읽어 처리하는 스트리밍 로직 구현.
* **Image Lazy Loading**: 고해상도 미디어가 많은 가이드 특성을 고려하여 Next.js Image 컴포넌트를 통한 자동 최적화 및 뷰포트 기반 레이지 로딩 적용.

### 5.3 ESI 인증 및 상태 관리
* **Context API**: ESI를 통해 로그인된 사용자의 캐릭터 정보와 권한 등급을 전역 상태로 관리하여, 기능별 접근 제어(RBAC)를 컴포넌트 레벨에서 처리.

## 6. 운영 관점에서 중요했던 점

* **에러 바운더리 설계**: 미디어 업로드 실패나 AI 응답 지연 시에도 에디터 전체가 멈추지 않도록 각 블록 및 유틸리티 단위의 견고한 예외 처리.
* **SEO 및 공유 최적화**: Next.js의 Metadata API를 활용하여 각 가이드 문서의 제목과 내용을 기반으로 한 동적 OG(Open Graph) 태그 생성으로 커뮤니티 전파력 강화.
* **환경별 설정 관리**: 개발(Local), 스테이징, 운영 환경에 따른 API 엔드포인트 및 AI 기능 활성화 여부를 `.env.local`을 통해 엄격히 분리.

## 7. 트레이드오프와 한계

* **브라우저 성능 한계**: 수백 메가바이트 이상의 영상 파일 해싱 시 저사양 기기에서 CPU 점유율이 일시적으로 상승할 수 있음. 이를 보완하기 위해 Web Worker 도입을 검토 중.
* **초기 로딩 속도**: 리치 에디터와 다양한 커스텀 컴포넌트로 인해 번들 사이즈가 커질 수 있으나, Next.js의 Dynamic Import를 사용하여 에디터 관련 모듈을 필요한 시점에만 로드하도록 최적화함.

## 8. 사용 기술

* **Framework**: Next.js 15+ (App Router), React 19
* **Styling**: Tailwind CSS 4, Lucide Icons, React Icons
* **Editor**: BlockNote, @blocknote/xl-ai, @blocknote/shadcn
* **AI/Media**: Vercel AI SDK, SparkMD5, fflate
* **State/Auth**: React Context API, JWT
* **DevOps**: GitHub Actions, Vercel

## 9. 참고 링크

* **Backend Repository**: [CAT4U_WEB_BACKEND](https://github.com/4cozm/CAT4U_WEB_BACKEND)
* **Frontend Repository**: [CAT4U_WEB_FRONTEND](https://github.com/4cozm/CAT4U_WEB_FRONTEND)

---

## 부록: 시작하기 (Getting Started)

### 환경 변수 설정 (.env.local)
프로젝트 루트 디렉토리에 `.env.local` 파일을 생성하고 다음 필수 항목들을 입력합니다.
```env
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
NEXT_PUBLIC_IS_DEV=true
```

### 설치 및 구동
```bash
# 1. 의존성 설치
npm install

# 2. 이모지 및 정적 매니페스트 생성
npm run gen:emoji

# 3. 개발 서버 실행 (Turbopack 사용)
npm run dev
```
