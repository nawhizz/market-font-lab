import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

// .env 파일에서 환경 변수 로드
config();

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL 환경 변수가 설정되지 않았습니다.\n" +
    "프로젝트 루트에 .env 파일을 생성하고 DATABASE_URL을 설정하세요."
  );
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
