import express from "express";

import {
  getMeController,
  updateMeController,
  deleteMeController,
  uploadAvatarController,
  listSavedDestinationsController,
  saveDestinationController,
  removeSavedDestinationController,
} from "../controllers/user.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/me", authMiddleware, getMeController);
router.patch("/me", authMiddleware, updateMeController);
router.delete("/me", authMiddleware, deleteMeController);
router.post("/me/avatar", authMiddleware, uploadAvatarController);
router.get(
  "/me/saved-destinations",
  authMiddleware,
  listSavedDestinationsController
);
router.post(
  "/me/saved-destinations",
  authMiddleware,
  saveDestinationController
);
router.delete(
  "/me/saved-destinations/:id",
  authMiddleware,
  removeSavedDestinationController
);

export default router;
