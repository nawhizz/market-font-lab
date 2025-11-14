import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Node.js < v22에서는 WebSocket 생성자가 필요합니다
neonConfig.webSocketConstructor = ws;

// 데이터베이스 연결을 지연 로딩으로 변경
// 실제로 사용할 때만 연결을 초기화하여 서버 시작 시 에러를 방지
let _db: ReturnType<typeof drizzle> | null = null;
let _pool: Pool | null = null;

/**
 * 데이터베이스 연결을 가져옵니다.
 * DATABASE_URL이 설정되지 않은 경우 에러를 발생시킵니다.
 */
function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL 환경 변수가 설정되지 않았습니다.\n\n" +
      "해결 방법:\n" +
      "1. 프로젝트 루트에 .env 파일을 생성하세요.\n" +
      "2. 다음 내용을 추가하세요:\n" +
      "   DATABASE_URL=your_postgresql_connection_string\n" +
      "   PORT=5000\n\n" +
      "예시 (Neon PostgreSQL):\n" +
      "DATABASE_URL=postgresql://user:password@host/database?sslmode=require\n\n" +
      "Neon 데이터베이스가 없으신가요?\n" +
      "1. https://neon.tech 에서 무료 계정을 만드세요\n" +
      "2. 새 프로젝트를 생성하세요\n" +
      "3. 연결 문자열을 복사하여 .env 파일에 추가하세요"
    );
  }

  if (!_pool) {
    _pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }

  if (!_db) {
    _db = drizzle(_pool);
  }

  return _db;
}

// db를 Proxy로 export하여 실제 사용 시에만 연결 초기화
// 이렇게 하면 서버 시작 시 DATABASE_URL이 없어도 에러가 발생하지 않습니다
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    const dbInstance = getDb();
    const value = dbInstance[prop as keyof typeof dbInstance];
    // 함수인 경우 this 바인딩을 위해 처리
    if (typeof value === "function") {
      return value.bind(dbInstance);
    }
    return value;
  },
});
