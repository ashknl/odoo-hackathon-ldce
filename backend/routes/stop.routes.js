import express from "express";

import {
  listStopsController,
  createStopController,
  reorderStopsController,
  updateStopController,
  deleteStopController,
} from "../controllers/stop.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router({ mergeParams: true });

router.get("/", authMiddleware, listStopsController);
router.post("/", authMiddleware, createStopController);
router.patch("/reorder", authMiddleware, reorderStopsController);
router.patch("/:id", authMiddleware, updateStopController);
router.delete("/:id", authMiddleware, deleteStopController);

export default router;
