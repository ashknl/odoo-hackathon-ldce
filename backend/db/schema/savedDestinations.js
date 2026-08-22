import {
  pgTable,
  uuid,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

import { users } from "./users.js";
import { cities } from "./cities.js";

export const savedDestinations = pgTable(
  "saved_destinations",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    cityId: uuid("city_id")
      .notNull()
      .references(() => cities.id, {
        onDelete: "cascade",
      }),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userCityUnique: unique(
      "saved_destinations_user_city_unique"
    ).on(table.userId, table.cityId),
  })
);