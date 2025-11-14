# Neon 데이터베이스 설정 가이드

이 가이드는 MarketFontLab 프로젝트에 Neon PostgreSQL 데이터베이스를 설정하는 방법을 설명합니다.

## 1단계: Neon 계정 및 프로젝트 생성

1. **Neon 웹사이트 방문**: https://neon.tech
2. **무료 계정 생성** (GitHub 계정으로 간편 가입 가능)
3. **새 프로젝트 생성**
   - 프로젝트 이름 입력 (예: "market-font-lab")
   - 데이터베이스 이름 입력 (기본값 사용 가능)
   - 지역 선택 (가장 가까운 지역 선택 권장)

## 2단계: 연결 문자열 가져오기

1. Neon 콘솔에서 생성한 프로젝트 선택
2. **Connection Details** 또는 **Connection String** 섹션으로 이동
3. **Connection String** 복사
   - 형식: `postgresql://[user]:[password]@[host]/[dbname]?sslmode=require`

## 3단계: .env 파일 생성

프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Neon PostgreSQL 연결 문자열
DATABASE_URL=postgresql://[user]:[password]@[host]/[dbname]?sslmode=require

# 서버 포트 (기본값: 5000)
PORT=5000
```

**중요**: 
- `[user]`, `[password]`, `[host]`, `[dbname]`을 Neon에서 제공한 실제 값으로 교체하세요
- `.env` 파일은 절대 Git에 커밋하지 마세요 (이미 .gitignore에 포함되어 있음)

## 4단계: 의존성 설치

Neon 관련 패키지가 이미 설치되어 있는지 확인하고, 필요시 설치하세요:

```bash
npm install
```

필요한 패키지:
- `@neondatabase/serverless` - Neon 서버리스 드라이버
- `drizzle-orm` - Drizzle ORM
- `drizzle-kit` - Drizzle 마이그레이션 도구
- `ws` - WebSocket 지원 (Node.js < v22)

## 5단계: 데이터베이스 스키마 마이그레이션

프로젝트에는 이미 `memos` 테이블 스키마가 정의되어 있습니다. 이를 Neon 데이터베이스에 적용하세요:

```bash
npm run db:push
```

이 명령은 `shared/schema.ts`에 정의된 스키마를 Neon 데이터베이스에 동기화합니다.

## 6단계: 서버 실행 및 테스트

```bash
npm run dev
```

서버가 정상적으로 시작되면 `http://localhost:5000`에서 애플리케이션에 접속할 수 있습니다.

## 스키마 정보

현재 프로젝트에는 다음 테이블이 정의되어 있습니다:

### memos 테이블
- `id` (varchar, UUID, Primary Key)
- `content` (text) - 사용자 입력 텍스트
- `styles` (jsonb) - 폰트 스타일 정보
  - `color`: 폰트 색상 (hex)
  - `fontSize`: 폰트 크기 (16-72px)
  - `fontWeight`: 'normal' | 'bold'
  - `fontStyle`: 'normal' | 'italic'
- `bgColor` (varchar) - 배경색 (hex)
- `createdAt` (timestamp) - 생성 시간

## 문제 해결

### 연결 오류가 발생하는 경우
1. `.env` 파일의 `DATABASE_URL`이 올바른지 확인
2. Neon 콘솔에서 데이터베이스가 활성 상태인지 확인
3. 방화벽이나 네트워크 설정 확인

### 마이그레이션 오류가 발생하는 경우
1. `DATABASE_URL`이 올바르게 설정되었는지 확인
2. Neon 프로젝트에 충분한 권한이 있는지 확인
3. `npm run db:push` 대신 `npx drizzle-kit push`를 직접 실행해보세요

## 추가 리소스

- [Neon 공식 문서](https://neon.tech/docs)
- [Drizzle ORM 문서](https://orm.drizzle.team)
- [Neon + Drizzle 가이드](https://neon.tech/docs/serverless/drizzle)

## 다음 단계

데이터베이스가 설정되면 다음을 수행할 수 있습니다:

- ✅ 메모 저장 기능 테스트
- ✅ 데이터베이스 쿼리 최적화
- ✅ Neon 브랜치 기능 활용 (개발/프로덕션 분리)
- ✅ 자동 스케일링 및 성능 모니터링

