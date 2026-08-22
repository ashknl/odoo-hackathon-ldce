import {
  pgTable,
  uuid,
  date,
  integer,
  numeric,
  text,
  index,
} from "drizzle-orm/pg-core";

import { trips } from "./trips.js";
import { cities } from "./cities.js";

export const tripStops = pgTable(
  "trip_stops",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    tripId: uuid("trip_id")
      .notNull()
      .references(() => trips.id, {
        onDelete: "cascade",
      }),

    cityId: uuid("city_id")
      .notNull()
      .references(() => cities.id),

    startDate: date("start_date").notNull(),

    endDate: date("end_date").notNull(),

    position: integer("position").notNull(),

    budget: numeric("budget", {
      precision: 12,
      scale: 2,
    }),

    notes: text("notes"),
  },
  (table) => ({
    tripPositionIdx: index(
      "trip_stops_trip_position_idx"
    ).on(table.tripId, table.position),
  })
);