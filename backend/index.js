import "dotenv/config";

import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import tripRoutes from "./routes/trip.routes.js";
import cityRoutes from "./routes/city.routes.js";
import activityRoutes from "./routes/activity.routes.js";
import publicRoutes from "./routes/public.routes.js";

import { seedCities } from "./services/city.service.js";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "GlobeTrotter API is running",
  });
});

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/trips",
  tripRoutes
);

app.use(
  "/api/cities",
  cityRoutes
);

app.use(
  "/api/activities",
  activityRoutes
);

app.use(
  "/api/public",
  publicRoutes
);

seedCities().catch((error) => {
  console.error("Failed to seed cities:", error.message);
});

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});