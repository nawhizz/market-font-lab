import express, { type Request, Response, NextFunction, Router } from "express";
import { config } from "dotenv";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

// .env 파일에서 환경 변수 로드
// 서버 시작 시 가장 먼저 실행되어야 함
config();

const app = express();

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// 동적 라우터 - 초기화 완료 후 동작
const dynamicRouter = Router();
let initialized = false;
let initPromise: Promise<void> | null = null;

async function ensureInitialized() {
  if (initialized) return;
  if (initPromise) {
    await initPromise;
    return;
  }

  initPromise = (async () => {
    const server = await registerRoutes(dynamicRouter as any);

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(dynamicRouter as any, server);
    } else {
      serveStatic(dynamicRouter as any);
    }

    initialized = true;

    // Vercel 서버리스 환경에서는 listen하지 않음
    // 로컬 개발 환경에서만 listen
    if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
      // ALWAYS serve the app on the port specified in the environment variable PORT
      // Other ports are firewalled. Default to 5000 if not specified.
      // this serves both the API and the client.
      // It is the only port that is not firewalled.
      const port = parseInt(process.env.PORT || '5000', 10);
      
      // Windows에서는 0.0.0.0이 지원되지 않으므로 플랫폼에 따라 host 설정
      // 개발 환경에서는 localhost 사용, 프로덕션에서는 0.0.0.0 사용 (Linux/Mac)
      const host = process.platform === 'win32' 
        ? 'localhost' 
        : (process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost');
      
      server.listen(port, host, () => {
        log(`serving on http://${host}:${port}`);
      });
      
      // 에러 핸들링 추가
      server.on('error', (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE') {
          log(`Port ${port} is already in use. Please use a different port.`);
        } else {
          log(`Server error: ${err.message}`);
        }
        process.exit(1);
      });
    }
  })();

  await initPromise;
}

// 모든 요청을 동적 라우터로 전달하되, 먼저 초기화 보장
app.use(async (req, res, next) => {
  await ensureInitialized();
  dynamicRouter(req, res, next);
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({ message });
});

// Vercel 서버리스와 로컬 환경 모두 지원하는 export
export default app;
