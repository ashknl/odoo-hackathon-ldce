import express from "express";

import {
  listStopActivitiesController,
  addStopActivityController,
  updateStopActivityController,
  removeStopActivityController,
} from "../controllers/stopActivity.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router({ mergeParams: true });

router.get("/", authMiddleware, listStopActivitiesController);
router.post("/", authMiddleware, addStopActivityController);
router.patch("/:id", authMiddleware, updateStopActivityController);
router.delete("/:id", authMiddleware, removeStopActivityController);

export default router;
