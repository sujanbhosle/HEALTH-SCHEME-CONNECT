
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

// Mock Services (Simulating Microservices within one process)
import hospitalRouter from "./backend/routes/hospitals.js";
import schemeRouter from "./backend/routes/schemes.js";
import reviewRouter from "./backend/routes/reviews.js";
import authRouter from "./backend/routes/auth.js";
import aiRouter from "./backend/routes/ai.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes (The "Microservices" Gateway)
  app.use("/api/hospitals", hospitalRouter);
  app.use("/api/schemes", schemeRouter);
  app.use("/api/reviews", reviewRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/ai", aiRouter);

  // Healthy check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", services: ["hospitals", "schemes", "reviews", "auth", "ai"] });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Microservices Gateway running on http://localhost:${PORT}`);
  });
}

startServer();
