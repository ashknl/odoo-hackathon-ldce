import express from "express";

import {
  signupController,
  loginController,
  logoutController,
  meController,
} from "../controllers/auth.controller.js";

import {
  authMiddleware,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/signup",
  signupController
);

router.post(
  "/login",
  loginController
);

router.get(
  "/me",
  authMiddleware,
  meController
);

router.post(
  "/logout",
  authMiddleware,
  logoutController
);

export default router;