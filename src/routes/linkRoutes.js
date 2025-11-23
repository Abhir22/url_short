import express from "express";
import linkController from "../controller/linkController.js";

const router = express.Router();

router.post("/shorten", linkController.create);
router.get("/links", linkController.getAll);
router.get("/links/:shortCode", linkController.getOne);
router.delete("/:shortCode", linkController.delete);

export default router;
