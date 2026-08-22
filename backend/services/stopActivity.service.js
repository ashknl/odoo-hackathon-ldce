import { and, asc, desc, eq } from "drizzle-orm";

import { db } from "../db/connection.js";
import { trips } from "../db/schema/trips.js";
import { tripStops } from "../db/schema/tripStops.js";
import { plannedActivities } from "../db/schema/plannedActivities.js";

const formatTime = (value) => {
  if (value == null) {
    return null;
  }

  const text = String(value);

  return text.length > 5 ? text.slice(0, 5) : text;
};

export const serializeActivity = (activity) => ({
  id: activity.id,
  tripStopId: activity.tripStopId,
  otmPlaceId: activity.otmPlaceId,
  name: activity.name,
  type: activity.type,
  image: activity.image,
  latitude:
    activity.latitude != null ? Number(activity.latitude) : null,
  longitude:
    activity.longitude != null ? Number(activity.longitude) : null,
  date: activity.date,
  startTime: formatTime(activity.startTime),
  endTime: formatTime(activity.endTime),
  plannedCost:
    activity.plannedCost != null
      ? Number(activity.plannedCost)
      : null,
  position: activity.position,
  notes: activity.notes,
});

const findStop = async ({ tripId, stopId, ownerId }) => {
  const [stop] = await db
    .select({ id: tripStops.id })
    .from(tripStops)
    .innerJoin(trips, eq(tripStops.tripId, trips.id))
    .where(
      and(
        eq(tripStops.id, stopId),
        eq(tripStops.tripId, tripId),
        eq(trips.ownerId, ownerId)
      )
    );

  if (!stop) {
    const error = new Error("Stop not found");

    error.statusCode = 404;

    throw error;
  }

  return stop;
};

export const listStopActivities = async ({
  tripId,
  stopId,
  ownerId,
}) => {
  await findStop({ tripId, stopId, ownerId });

  const activities = await db
    .select()
    .from(plannedActivities)
    .where(eq(plannedActivities.tripStopId, stopId))
    .orderBy(
      asc(plannedActivities.date),
      asc(plannedActivities.position)
    );

  return activities.map(serializeActivity);
};

export const addStopActivity = async ({
  tripId,
  stopId,
  ownerId,
  otmPlaceId,
  name,
  type,
  image,
  latitude,
  longitude,
  date,
  startTime,
  endTime,
  plannedCost,
  notes,
}) => {
  await findStop({ tripId, stopId, ownerId });

  const [maxRow] = await db
    .select({ position: plannedActivities.position })
    .from(plannedActivities)
    .where(eq(plannedActivities.tripStopId, stopId))
    .orderBy(desc(plannedActivities.position))
    .limit(1);

  const position = (maxRow?.position ?? 0) + 1;

  const [activity] = await db
    .insert(plannedActivities)
    .values({
      tripStopId: stopId,
      otmPlaceId: otmPlaceId ?? null,
      name,
      type: type ?? null,
      image: image ?? null,
      latitude: latitude ?? null,
      longitude: longitude ?? null,
      date,
      startTime: startTime ?? null,
      endTime: endTime ?? null,
      plannedCost: plannedCost ?? null,
      position,
      notes: notes ?? null,
    })
    .returning();

  return serializeActivity(activity);
};

export const updateStopActivity = async ({
  tripId,
  stopId,
  activityId,
  ownerId,
  otmPlaceId,
  name,
  type,
  image,
  latitude,
  longitude,
  date,
  startTime,
  endTime,
  plannedCost,
  notes,
}) => {
  await findStop({ tripId, stopId, ownerId });

  const [existing] = await db
    .select({ id: plannedActivities.id })
    .from(plannedActivities)
    .where(
      and(
        eq(plannedActivities.id, activityId),
        eq(plannedActivities.tripStopId, stopId)
      )
    );

  if (!existing) {
    const error = new Error("Activity not found");

    error.statusCode = 404;

    throw error;
  }

  const values = {};

  if (otmPlaceId !== undefined) {
    values.otmPlaceId = otmPlaceId ?? null;
  }

  if (name !== undefined) {
    values.name = name;
  }

  if (type !== undefined) {
    values.type = type ?? null;
  }

  if (image !== undefined) {
    values.image = image ?? null;
  }

  if (latitude !== undefined) {
    values.latitude = latitude ?? null;
  }

  if (longitude !== undefined) {
    values.longitude = longitude ?? null;
  }

  if (date !== undefined) {
    values.date = date;
  }

  if (startTime !== undefined) {
    values.startTime = startTime ?? null;
  }

  if (endTime !== undefined) {
    values.endTime = endTime ?? null;
  }

  if (plannedCost !== undefined) {
    values.plannedCost = plannedCost ?? null;
  }

  if (notes !== undefined) {
    values.notes = notes ?? null;
  }

  const [updated] = await db
    .update(plannedActivities)
    .set(values)
    .where(
      and(
        eq(plannedActivities.id, activityId),
        eq(plannedActivities.tripStopId, stopId)
      )
    )
    .returning();

  return serializeActivity(updated);
};

export const removeStopActivity = async ({
  tripId,
  stopId,
  activityId,
  ownerId,
}) => {
  await findStop({ tripId, stopId, ownerId });

  const [deleted] = await db
    .delete(plannedActivities)
    .where(
      and(
        eq(plannedActivities.id, activityId),
        eq(plannedActivities.tripStopId, stopId)
      )
    )
    .returning({ id: plannedActivities.id });

  if (!deleted) {
    const error = new Error("Activity not found");

    error.statusCode = 404;

    throw error;
  }

  return true;
};
