import express from "express";

import {
  listActivitiesController,
  getActivityController,
} from "../controllers/activity.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, listActivitiesController);
router.get("/:id", authMiddleware, getActivityController);

export default router;
