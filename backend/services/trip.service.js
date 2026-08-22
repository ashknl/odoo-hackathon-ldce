import {
  and,
  eq,
  desc,
  count,
  inArray,
} from "drizzle-orm";

import { db } from "../db/connection.js";
import { trips } from "../db/schema/trips.js";
import { tripStops } from "../db/schema/tripStops.js";
import { cities } from "../db/schema/cities.js";

export const serializeTrip = (trip) => ({
  id: trip.id,
  name: trip.name,
  description: trip.description,
  startDate: trip.startDate,
  endDate: trip.endDate,
  budget: trip.budget != null ? Number(trip.budget) : null,
  status: trip.status,
  coverUrl: trip.coverImage,
  isPublic: trip.isPublic,
  shareToken: trip.shareSlug,
  ownerId: trip.ownerId,
  stopCount:
    trip.stopCount != null ? Number(trip.stopCount) : 0,
  createdAt: trip.createdAt,
});

export const serializeStop = (stop) => ({
  id: stop.id,
  tripId: stop.tripId,
  cityId: stop.cityId,
  city: stop.city
    ? {
        id: stop.city.id,
        name: stop.city.name,
        country: stop.city.country,
        region: stop.city.region,
        description: stop.city.description,
        image: stop.city.image,
        costIndex:
          stop.city.costIndex != null
            ? Number(stop.city.costIndex)
            : null,
        latitude:
          stop.city.latitude != null
            ? Number(stop.city.latitude)
            : null,
        longitude:
          stop.city.longitude != null
            ? Number(stop.city.longitude)
            : null,
      }
    : null,
  startDate: stop.startDate,
  endDate: stop.endDate,
  position: stop.position,
  budget: stop.budget != null ? Number(stop.budget) : null,
  activities: [],
});

export const createTrip = async ({
  ownerId,
  name,
  description,
  startDate,
  endDate,
  budget,
}) => {
  const [trip] = await db
    .insert(trips)
    .values({
      ownerId,
      name: name.trim(),
      description: description?.trim() || null,
      startDate,
      endDate,
      budget,
    })
    .returning();

  return serializeTrip(trip);
};

export const listTrips = async ({ ownerId }) => {
  const rows = await db
    .select({
      id: trips.id,
      name: trips.name,
      description: trips.description,
      coverImage: trips.coverImage,
      startDate: trips.startDate,
      endDate: trips.endDate,
      budget: trips.budget,
      status: trips.status,
      isPublic: trips.isPublic,
      shareSlug: trips.shareSlug,
      ownerId: trips.ownerId,
      createdAt: trips.createdAt,
      stopCount: count(tripStops.id),
    })
    .from(trips)
    .leftJoin(tripStops, eq(tripStops.tripId, trips.id))
    .where(eq(trips.ownerId, ownerId))
    .groupBy(trips.id)
    .orderBy(desc(trips.createdAt));

  const tripIds = rows.map((row) => row.id);

  const stops = tripIds.length
    ? await db
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
        .where(inArray(tripStops.tripId, tripIds))
        .orderBy(tripStops.position)
    : [];

  const stopsByTrip = {};

  for (const stop of stops) {
    if (!stopsByTrip[stop.tripId]) {
      stopsByTrip[stop.tripId] = [];
    }

    stopsByTrip[stop.tripId].push(serializeStop(stop));
  }

  return rows.map((row) => ({
    ...serializeTrip(row),
    stops: stopsByTrip[row.id] || [],
  }));
};

const VALID_STATUSES = [
  "UPCOMING",
  "ONGOING",
  "COMPLETED",
];

export const getTrip = async ({ id, ownerId }) => {
  const [row] = await db
    .select({
      id: trips.id,
      name: trips.name,
      description: trips.description,
      coverImage: trips.coverImage,
      startDate: trips.startDate,
      endDate: trips.endDate,
      budget: trips.budget,
      status: trips.status,
      isPublic: trips.isPublic,
      shareSlug: trips.shareSlug,
      ownerId: trips.ownerId,
      createdAt: trips.createdAt,
      stopCount: count(tripStops.id),
    })
    .from(trips)
    .leftJoin(tripStops, eq(tripStops.tripId, trips.id))
    .where(
      and(
        eq(trips.id, id),
        eq(trips.ownerId, ownerId)
      )
    )
    .groupBy(trips.id);

  if (!row) {
    const error = new Error("Trip not found");

    error.statusCode = 404;

    throw error;
  }

  return serializeTrip(row);
};

export const updateTrip = async ({
  id,
  ownerId,
  name,
  description,
  startDate,
  endDate,
  budget,
  status,
}) => {
  const [existing] = await db
    .select({
      startDate: trips.startDate,
      endDate: trips.endDate,
    })
    .from(trips)
    .where(
      and(
        eq(trips.id, id),
        eq(trips.ownerId, ownerId)
      )
    );

  if (!existing) {
    const error = new Error("Trip not found");

    error.statusCode = 404;

    throw error;
  }

  const nextStartDate = startDate ?? existing.startDate;
  const nextEndDate = endDate ?? existing.endDate;

  if (nextEndDate < nextStartDate) {
    const error = new Error(
      "endDate cannot be before startDate"
    );

    error.statusCode = 400;

    throw error;
  }

  if (
    status !== undefined &&
    !VALID_STATUSES.includes(status)
  ) {
    const error = new Error("Invalid status");

    error.statusCode = 400;

    throw error;
  }

  const values = {
    updatedAt: new Date(),
  };

  if (name !== undefined) {
    values.name = name.trim();
  }

  if (description !== undefined) {
    values.description = description?.trim() || null;
  }

  if (startDate !== undefined) {
    values.startDate = startDate;
  }

  if (endDate !== undefined) {
    values.endDate = endDate;
  }

  if (budget !== undefined) {
    values.budget = budget;
  }

  if (status !== undefined) {
    values.status = status;
  }

  const [updated] = await db
    .update(trips)
    .set(values)
    .where(
      and(
        eq(trips.id, id),
        eq(trips.ownerId, ownerId)
      )
    )
    .returning();

  return serializeTrip(updated);
};

export const deleteTrip = async ({ id, ownerId }) => {
  const [deleted] = await db
    .delete(trips)
    .where(
      and(
        eq(trips.id, id),
        eq(trips.ownerId, ownerId)
      )
    )
    .returning({ id: trips.id });

  if (!deleted) {
    const error = new Error("Trip not found");

    error.statusCode = 404;

    throw error;
  }

  return true;
};
