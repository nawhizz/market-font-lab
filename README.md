# Market Font Lab (대조시장체 랩)

대조시장의 따뜻한 감성을 담은 폰트로 나만의 메시지를 만들어보는 웹 애플리케이션입니다.

## 기술 스택

### Frontend
- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Vite** - 빌드 도구
- **TailwindCSS** - 스타일링
- **Radix UI** - UI 컴포넌트
- **TanStack Query** - 상태 관리
- **Wouter** - 라우팅

### Backend (Serverless)
- **Vercel** - 서버리스 플랫폼
- **Neon Database** - PostgreSQL 데이터베이스
- **Drizzle ORM** - 타입 안전 ORM

## 프로젝트 구조

```
MarketFontLab/
├── api/                    # Vercel 서버리스 함수
│   └── memos.ts           # POST /api/memos
├── client/                 # Frontend 소스
│   ├── src/
│   │   ├── components/    # React 컴포넌트
│   │   ├── pages/         # 페이지 컴포넌트
│   │   └── lib/           # 유틸리티
│   └── index.html
├── db/                     # 데이터베이스 레이어
│   ├── index.ts           # DB 연결 (lazy loading)
│   └── storage.ts         # 데이터 액세스 레이어
├── shared/                 # Frontend/Backend 공유 코드
│   └── schema.ts          # DB 스키마 & Zod 검증
├── dist/public/           # 빌드 출력 (정적 파일)
└── vercel.json            # Vercel 배포 설정
```

## 로컬 개발

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 다음을 추가:

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

Neon 데이터베이스 연결 문자열은 [Neon Console](https://console.neon.tech)에서 확인할 수 있습니다.

### 3. 데이터베이스 스키마 푸시

```bash
npm run db:push
```

### 4. 개발 서버 실행

```bash
npm run dev
```

개발 서버가 `http://localhost:3000`에서 실행됩니다.

## 빌드 & 배포

### 프로덕션 빌드

```bash
npm run build
```

빌드 결과물은 `dist/public/` 디렉토리에 생성됩니다.

### Vercel 배포

1. **Vercel CLI 설치** (선택사항)
   ```bash
   npm i -g vercel
   ```

2. **GitHub 연동 배포** (권장)
   - GitHub 저장소에 push
   - Vercel이 자동으로 빌드 & 배포

3. **환경 변수 설정** (Vercel Dashboard)
   - `DATABASE_URL`: Neon PostgreSQL 연결 문자열

## 기능

- ✨ **실시간 폰트 프리뷰**: 입력한 텍스트를 대조시장체로 실시간 표시
- 🎨 **스타일 커스터마이징**: 
  - 폰트 크기 조절 (16-72px)
  - 텍스트 색상 변경
  - 배경 색상 변경
  - Bold/Italic 스타일
- 💾 **메모 저장**: 작성한 메모를 데이터베이스에 저장
- 📱 **반응형 디자인**: iPad 및 다양한 기기 최적화

## API 엔드포인트

### POST /api/memos

메모를 생성합니다.

**Request Body:**
```json
{
  "content": "메모 내용",
  "styles": {
    "fontSize": "32",
    "color": "#000000",
    "fontWeight": "normal",
    "fontStyle": "normal"
  },
  "bgColor": "#FFFFFF"
}
```

**Response:**
```json
{
  "id": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "message": "Memo saved successfully."
}
```

## 라이선스

MIT

## 기여

이슈와 Pull Request를 환영합니다!
