import {
  pgTable,
  uuid,
  varchar,
  text,
  decimal,
  date,
  time,
  numeric,
  integer,
  index,
} from "drizzle-orm/pg-core";

import { tripStops } from "./tripStops.js";

export const plannedActivities = pgTable(
  "planned_activities",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    tripStopId: uuid("trip_stop_id")
      .notNull()
      .references(() => tripStops.id, {
        onDelete: "cascade",
      }),

    otmPlaceId: varchar("otm_place_id", {
      length: 255,
    }),

    name: varchar("name", {
      length: 255,
    }).notNull(),

    type: varchar("type", {
      length: 255,
    }),

    image: text("image"),

    latitude: decimal("latitude", {
      precision: 10,
      scale: 7,
    }),

    longitude: decimal("longitude", {
      precision: 10,
      scale: 7,
    }),

    date: date("date").notNull(),

    startTime: time("start_time"),

    endTime: time("end_time"),

    plannedCost: numeric("planned_cost", {
      precision: 12,
      scale: 2,
    }),

    position: integer("position").notNull(),

    notes: text("notes"),
  },
  (table) => ({
    stopDateIdx: index(
      "planned_activities_stop_date_idx"
    ).on(table.tripStopId, table.date),

    otmPlaceIdx: index(
      "planned_activities_otm_place_id_idx"
    ).on(table.otmPlaceId),
  })
);