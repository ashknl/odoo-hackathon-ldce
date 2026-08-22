import express from "express";

import {
  listTripsController,
  createTripController,
  getTripController,
  updateTripController,
  deleteTripController,
  uploadCoverController,
  duplicateTripController,
  updateSharingController,
  getItineraryController,
  getBudgetController,
  getCalendarController,
} from "../controllers/trip.controller.js";

import stopRoutes from "./stop.routes.js";
import stopActivityRoutes from "./stopActivity.routes.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, listTripsController);
router.post("/", authMiddleware, createTripController);
router.get("/:id", authMiddleware, getTripController);
router.patch("/:id", authMiddleware, updateTripController);
router.delete("/:id", authMiddleware, deleteTripController);
router.post("/:id/cover", authMiddleware, uploadCoverController);
router.post("/:id/duplicate", authMiddleware, duplicateTripController);
router.patch("/:id/sharing", authMiddleware, updateSharingController);
router.get("/:id/itinerary", authMiddleware, getItineraryController);
router.get("/:id/budget", authMiddleware, getBudgetController);
router.get("/:id/calendar", authMiddleware, getCalendarController);

router.use("/:tripId/stops", stopRoutes);
router.use(
  "/:tripId/stops/:stopId/activities",
  stopActivityRoutes
);

export default router;
