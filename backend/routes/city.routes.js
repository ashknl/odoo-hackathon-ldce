import express from "express";

import {
  listCitiesController,
  listPopularCitiesController,
  getCityController,
} from "../controllers/city.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, listCitiesController);
router.get("/popular", authMiddleware, listPopularCitiesController);
router.get("/:id", authMiddleware, getCityController);

export default router;
