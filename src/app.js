import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import apiRoutes from "./routes/index.routes.js";
import linkController from "./controller/linkController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, "../public")));

app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/dashboard.html"));
});

// Health page routes (must be before /:shortCode)
app.get("/health", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/health.html"));
});

app.get("/healthz", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/health.html"));
});

// Stats page route (must be before /:shortCode)
app.get("/stats/:shortCode", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/stats.html"));
});

// Short code redirect (must be last before 404)
app.get("/:shortCode", linkController.redirect);


app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "../public/404.html"));
});

export default app;
