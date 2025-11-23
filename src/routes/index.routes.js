import express from "express";
import healthRoutes from "./healthRoutes.js";
import linkRoutes from "./linkRoutes.js";

const router = express.Router();

// Mount all routes
router.use(healthRoutes);
router.use(linkRoutes);

export default router;
