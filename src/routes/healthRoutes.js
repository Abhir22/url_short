import express from "express";
import healthController from "../controller/healthController.js";

const router = express.Router();

router.get("/health", healthController.getHealth);

export default router;
