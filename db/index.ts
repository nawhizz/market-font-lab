import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

// 데이터베이스 연결을 지연 로딩으로 변경
// 실제로 사용할 때만 연결을 초기화하여 서버 시작 시 에러를 방지
let _db: ReturnType<typeof drizzle> | null = null;

/**
 * 데이터베이스 연결을 초기화합니다.
 * DATABASE_URL이 설정되지 않은 경우 에러를 발생시킵니다.
 * 
 * Vercel과 같은 서버리스 환경에서는 HTTP 기반 연결을 사용합니다.
 */
function getDb(): ReturnType<typeof drizzle> {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL 환경 변수가 설정되지 않았습니다.\n\n" +
      "해결 방법:\n" +
      "1. Vercel 대시보드에서 환경 변수를 설정하세요.\n" +
      "2. DATABASE_URL을 추가하세요.\n\n" +
      "예시 (Neon PostgreSQL):\n" +
      "DATABASE_URL=postgresql://user:password@host/database?sslmode=require\n\n" +
      "Neon 데이터베이스가 없으신가요?\n" +
      "1. https://neon.tech 에서 무료 계정을 만드세요\n" +
      "2. 새 프로젝트를 생성하세요\n" +
      "3. 연결 문자열을 Vercel 환경 변수에 추가하세요"
    );
  }

  if (!_db) {
    // Vercel 서버리스 환경에서는 HTTP 기반 neon 클라이언트 사용
    const sql = neon(process.env.DATABASE_URL);
    _db = drizzle(sql);
  }

  return _db;
}

/**
 * 데이터베이스 인스턴스
 * 실제 사용 시에만 초기화되므로 서버 시작 시 DATABASE_URL이 없어도 에러가 발생하지 않습니다.
 * 
 * Proxy를 사용하여 지연 로딩을 구현합니다.
 * Drizzle의 메서드 체이닝이 정상 작동하도록 모든 메서드와 속성을 올바르게 전달합니다.
 */
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop, receiver) {
    const dbInstance = getDb();
    const value = Reflect.get(dbInstance, prop, dbInstance);
    
    // 함수인 경우 this 바인딩 유지
    if (typeof value === "function") {
      return value.bind(dbInstance);
    }
    
    return value;
  },
  
  // Drizzle의 메서드 체이닝을 위해 필요한 trap들
  has(_target, prop) {
    const dbInstance = getDb();
    return Reflect.has(dbInstance, prop);
  },
  
  ownKeys(_target) {
    const dbInstance = getDb();
    return Reflect.ownKeys(dbInstance);
  },
  
  getOwnPropertyDescriptor(_target, prop) {
    const dbInstance = getDb();
    return Reflect.getOwnPropertyDescriptor(dbInstance, prop);
  },
});
