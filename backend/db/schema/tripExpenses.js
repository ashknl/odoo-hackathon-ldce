import {
  pgTable,
  uuid,
  text,
  date,
  numeric,
  timestamp,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";

import { trips } from "./trips.js";
import { tripStops } from "./tripStops.js";

export const expenseCategoryEnum = pgEnum(
  "expense_category",
  [
    "TRANSPORT",
    "STAY",
    "ACTIVITY",
    "MEAL",
    "OTHER",
  ]
);

export const tripExpenses = pgTable(
  "trip_expenses",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    tripId: uuid("trip_id")
      .notNull()
      .references(() => trips.id, {
        onDelete: "cascade",
      }),

    tripStopId: uuid("trip_stop_id").references(
      () => tripStops.id,
      {
        onDelete: "cascade",
      }
    ),

    category: expenseCategoryEnum("category").notNull(),

    amount: numeric("amount", {
      precision: 12,
      scale: 2,
    }).notNull(),

    description: text("description"),

    expenseDate: date("expense_date").notNull(),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    tripIdx: index("trip_expenses_trip_id_idx").on(
      table.tripId
    ),
  })
);