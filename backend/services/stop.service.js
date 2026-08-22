import { eq, and, max } from "drizzle-orm";

import { db } from "../db/connection.js";
import { trips } from "../db/schema/trips.js";
import { tripStops } from "../db/schema/tripStops.js";
import { cities } from "../db/schema/cities.js";

import { serializeStop } from "./trip.service.js";

export const listStops = async ({ tripId, ownerId }) => {
  const [trip] = await db
    .select({ id: trips.id })
    .from(trips)
    .where(and(eq(trips.id, tripId), eq(trips.ownerId, ownerId)));

  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  const stops = await db
    .select({
      id: tripStops.id,
      tripId: tripStops.tripId,
      cityId: tripStops.cityId,
      startDate: tripStops.startDate,
      endDate: tripStops.endDate,
      position: tripStops.position,
      budget: tripStops.budget,
      city: {
        id: cities.id,
        name: cities.name,
        country: cities.country,
        region: cities.region,
        description: cities.description,
        image: cities.image,
        costIndex: cities.costIndex,
        latitude: cities.latitude,
        longitude: cities.longitude,
      },
    })
    .from(tripStops)
    .innerJoin(cities, eq(tripStops.cityId, cities.id))
    .where(eq(tripStops.tripId, tripId))
    .orderBy(tripStops.position);

  return stops.map(serializeStop);
};

export const deleteStop = async ({ tripId, stopId, ownerId }) => {
  const [trip] = await db
    .select({ id: trips.id })
    .from(trips)
    .where(and(eq(trips.id, tripId), eq(trips.ownerId, ownerId)));

  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  const [stop] = await db
    .select({ id: tripStops.id })
    .from(tripStops)
    .where(and(eq(tripStops.id, stopId), eq(tripStops.tripId, tripId)));

  if (!stop) {
    const error = new Error("Stop not found");
    error.statusCode = 404;
    throw error;
  }

  await db.delete(tripStops).where(eq(tripStops.id, stopId));

  return true;
};

export const createStop = async ({
  tripId,
  ownerId,
  cityId,
  startDate,
  endDate,
  budget,
}) => {
  const [trip] = await db
    .select({ id: trips.id })
    .from(trips)
    .where(and(eq(trips.id, tripId), eq(trips.ownerId, ownerId)));

  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  const [city] = await db
    .select()
    .from(cities)
    .where(eq(cities.id, cityId));

  if (!city) {
    const error = new Error("City not found");
    error.statusCode = 404;
    throw error;
  }

  const [positionRow] = await db
    .select({ maxPosition: max(tripStops.position) })
    .from(tripStops)
    .where(eq(tripStops.tripId, tripId));

  const position =
    positionRow?.maxPosition != null
      ? Number(positionRow.maxPosition) + 1
      : 0;

  const [stop] = await db
    .insert(tripStops)
    .values({
      tripId,
      cityId,
      startDate,
      endDate,
      position,
      budget,
    })
    .returning();

  return serializeStop({ ...stop, city });
};
