import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); //Import path module

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// API-specific middleware for /api routes
app.use('/api', cors({
  origin: 'https://xlnt-connect.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Access-Control-Allow-Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Request logging middleware
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

(async () => {
  // Register API routes first
  const routes = registerRoutes(app); // Assuming registerRoutes returns the routes object


  // Only handle /api/v1 routes
  app.use('/api/v1', routes);

  // Global error handler for API routes
  app.use('/api', (err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('API Error:', err);
    const status = err.statusCode || err.status || 500;
    const message = err.message || "Internal Server Error";
    const code = err.code || "SERVER_001";

    res.status(status).json({ 
      error: message,
      code: code,
      timestamp: new Date().toISOString()
    });
  });

  // All other routes should be handled by the frontend
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });


  // Setup Vite after API routes
  if (app.get("env") === "development") {
    await setupVite(app); //Removed server argument as it's not needed here.  Assumes setupVite handles non-API routes.
  } else {
    serveStatic(app);
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    log(`Server running on port ${PORT}`);
  });
})();