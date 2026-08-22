import express from "express";

import { getPublicTripController } from "../controllers/public.controller.js";

const router = express.Router();

router.get("/trips/:token", getPublicTripController);

export default router;
