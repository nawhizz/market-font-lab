# 대조시장 폰트 체험 웹페이지

## 프로젝트 개요

대조시장 재디자인 프로젝트의 전용 폰트를 사용자가 직접 체험하고 꾸며볼 수 있는 인터랙티브 웹 애플리케이션입니다. 사용자는 텍스트를 입력하고, 폰트 스타일(색상, 크기, 굵기, 기울임)과 배경색을 자유롭게 조정한 후 저장할 수 있습니다.

## 주요 기능 (MVP)

### 구현 완료된 기능
- ✅ 대조시장 폰트 적용 (Black Han Sans, Noto Sans KR 사용)
- ✅ 텍스트 입력 영역 (ContentEditable 메모창)
- ✅ 스타일 편집 툴바
  - 폰트 색상 선택 (7가지 프리셋)
  - 배경색 선택 (7가지 프리셋)
  - 폰트 크기 조절 (16px ~ 72px)
  - 굵게(Bold) 토글
  - 기울임(Italic) 토글
- ✅ 메모 저장 기능 (PostgreSQL)
- ✅ Toast 알림
- ✅ XSS 방지 처리 (sanitize-html)
- ✅ 입력값 검증
- ✅ 반응형 디자인
- ✅ 다크 모드 지원
- ✅ 풍부한 히어로 섹션 (시장 분위기 표현)

## 기술 스택

### Frontend
- React 18
- TypeScript
- Wouter (라우팅)
- TanStack Query (데이터 페칭)
- Tailwind CSS (스타일링)
- Shadcn UI (컴포넌트)
- Lucide React (아이콘)

### Backend
- Node.js + Express
- PostgreSQL (Neon)
- Drizzle ORM
- sanitize-html (XSS 방지)

### 웹폰트
- Black Han Sans (디스플레이용)
- Noto Sans KR (UI용)
- Google Fonts 사용

## 프로젝트 구조

```
├── client/                 # 프론트엔드
│   ├── src/
│   │   ├── components/    # UI 컴포넌트
│   │   │   ├── ui/       # Shadcn UI 컴포넌트
│   │   │   └── theme-toggle.tsx
│   │   ├── pages/        # 페이지
│   │   │   ├── home.tsx  # 메인 페이지
│   │   │   └── not-found.tsx
│   │   ├── App.tsx
│   │   └── index.css     # 글로벌 스타일
│   └── index.html
├── server/                # 백엔드
│   ├── routes.ts         # API 라우트
│   └── storage.ts        # 데이터베이스 로직
├── shared/
│   └── schema.ts         # 공유 타입 & 스키마
└── db/
    └── index.ts          # 데이터베이스 연결
```

## 데이터베이스 스키마

### memos 테이블
```sql
- id: varchar (UUID, Primary Key)
- content: text (사용자 입력 텍스트, sanitized)
- styles: jsonb {
    color: string,        # 폰트 색상 (hex)
    fontSize: string,     # 폰트 크기 (16-72px)
    fontWeight: string,   # 'normal' | 'bold'
    fontStyle: string     # 'normal' | 'italic'
  }
- bg_color: varchar (배경색, hex)
- created_at: timestamp
```

## API 엔드포인트

### POST /api/memos
메모 저장

**Request Body:**
```json
{
  "content": "대조시장 폰트!",
  "styles": {
    "color": "#D32F2F",
    "fontSize": "32px",
    "fontWeight": "bold",
    "fontStyle": "italic"
  },
  "bgColor": "#FFF8E1"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "createdAt": "2025-11-14T...",
  "message": "Memo saved successfully."
}
```

**보안 처리:**
- XSS 방지: sanitize-html로 HTML 태그 제거
- 입력값 검증: Zod 스키마 검증
- 색상 검증: Hex 색상 형식 (#RRGGBB)
- 폰트 크기 제한: 16-72px

## 개발 가이드

### 사전 요구사항
- Node.js 20 이상
- npm 또는 yarn
- PostgreSQL 데이터베이스 (Neon 권장)

### 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 변수를 설정하세요:

```env
DATABASE_URL=your_postgresql_connection_string
PORT=5000
```

### 설치 및 실행

1. **의존성 설치**
```bash
npm install
```

2. **데이터베이스 마이그레이션**
```bash
npm run db:push
```

3. **개발 서버 실행**
```bash
npm run dev
```

개발 서버는 기본적으로 `http://localhost:5000`에서 실행됩니다.

### 빌드

프로덕션 빌드를 생성하려면:

```bash
npm run build
```

빌드된 파일은 `dist` 디렉토리에 생성됩니다.

### 프로덕션 실행

```bash
npm start
```

## 디자인 시스템

### 색상 팔레트 (시장의 따뜻함)
- Primary: 주황-빨강 계열 (#F57C00 ~ #D32F2F)
- Background: 크림-노랑 계열
- 따뜻하고 생동감 있는 시장 분위기

### 타이포그래피
- Display Font: Black Han Sans (대조시장체 시뮬레이션)
- UI Font: Noto Sans KR, system fonts
- 크기: 16px ~ 72px (사용자 조절 가능)

### 반응형 브레이크포인트
- Mobile: < 768px
- Desktop: ≥ 768px

## 사용자 경험

1. **히어로 섹션**: 풍부한 그래디언트와 장식 요소로 시장 분위기 표현
2. **스타일 툴바**: 직관적인 색상 선택과 크기 조절
3. **메모 에디터**: 실시간 스타일 프리뷰
4. **저장 기능**: Toast 알림으로 저장 확인
5. **다크 모드**: 테마 토글 버튼

## 보안

- XSS 방지: sanitize-html 사용
- SQL Injection 방지: Drizzle ORM 사용
- 입력값 검증: Zod 스키마
- HTTPS 사용 (프로덕션)

## 참고 문서

- PRD: `attached_assets/PRD_1763102663248.md`
- TRD: `attached_assets/TRD_1763102663250.md`
- Design Guidelines: `design_guidelines.md`

## 문제 해결

### 포트가 이미 사용 중인 경우
`.env` 파일에서 `PORT` 환경 변수를 다른 포트로 변경하세요.

### 데이터베이스 연결 오류
`DATABASE_URL` 환경 변수가 올바르게 설정되었는지 확인하세요.

### 빌드 오류
`node_modules`를 삭제하고 `npm install`을 다시 실행해보세요.

## 라이선스

MIT

