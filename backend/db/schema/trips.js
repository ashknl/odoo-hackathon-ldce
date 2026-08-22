import {
  pgTable,
  uuid,
  varchar,
  text,
  date,
  numeric,
  boolean,
  timestamp,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";

import { users } from "./users.js";

export const tripStatusEnum = pgEnum("trip_status", [
  "UPCOMING",
  "ONGOING",
  "COMPLETED",
]);

export const trips = pgTable(
  "trips",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    name: varchar("name", { length: 255 }).notNull(),

    description: text("description"),

    coverImage: text("cover_image"),

    startDate: date("start_date").notNull(),

    endDate: date("end_date").notNull(),

    budget: numeric("budget", {
      precision: 12,
      scale: 2,
    }),

    status: tripStatusEnum("status")
      .default("UPCOMING")
      .notNull(),

    isPublic: boolean("is_public")
      .default(false)
      .notNull(),

    shareSlug: varchar("share_slug", {
      length: 255,
    }).unique(),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    ownerIdx: index("trips_owner_id_idx").on(table.ownerId),
  })
);