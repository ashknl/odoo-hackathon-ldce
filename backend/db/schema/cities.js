import {
  pgTable,
  uuid,
  varchar,
  text,
  numeric,
  decimal,
  boolean,
  index,
} from "drizzle-orm/pg-core";

export const cities = pgTable(
  "cities",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: varchar("name", { length: 255 }).notNull(),

    country: varchar("country", { length: 255 }).notNull(),

    region: varchar("region", { length: 255 }),

    description: text("description"),

    image: text("image"),

    costIndex: numeric("cost_index", {
      precision: 10,
      scale: 2,
    }),

    latitude: decimal("latitude", {
      precision: 10,
      scale: 7,
    }),

    longitude: decimal("longitude", {
      precision: 10,
      scale: 7,
    }),

    popular: boolean("popular").default(false).notNull(),
  },
  (table) => ({
    countryRegionIdx: index("cities_country_region_idx").on(
      table.country,
      table.region
    ),
  })
);