# GlobeTrotter — PostgreSQL Schema Documentation

> **Stack:** PostgreSQL 15+ · Prisma ORM · OpenTripMap (external POI provider)
> **Tables:** 8 core (+1 optional) · **Style:** Normalized (3NF)
> **Audience:** Backend engineers

---

## Overview

This schema separates the **global catalog** (`cities`) from per-user, per-trip
data (`trips`, `trip_stops`, `planned_activities`, `trip_expenses`). The key
decision is to never store an itinerary as a single fat row or a JSON blob: each
stop, scheduled activity and expense is a first-class row that can be queried,
indexed and aggregated.

**Major change from v1:** the `activities` table has been **removed**. Activity /
POI data now comes from the **OpenTripMap API** at runtime, and is referenced by
an immutable `planned_activities` row at the moment a user schedules it
(snapshotted name, cost, coordinates — so the itinerary survives even if the
OpenTripMap record later changes or disappears).

This directly supports the PRD requirements for multi-city itineraries, budget
tracking, destination search, cost breakdowns and public sharing. The optional
`trip_collaborators` table is only needed if friends co-edit trips; for
read-only public sharing the `share_slug` + `is_public` columns are sufficient.

---

## 1. Core Tables

### `users`

| Column        | Type           | Notes   |
| ------------- | -------------- | ------- |
| id            | UUID PK        |         |
| name          | VARCHAR        |         |
| email         | VARCHAR UNIQUE | login   |
| password_hash | VARCHAR        |         |
| profile_image | TEXT           |         |
| created_at    | TIMESTAMP      |         |
| updated_at    | TIMESTAMP      |         |

> `language` removed in v2 — i18n is handled client-side.

---

### `trips`

| Column      | Type           | Notes                        |
| ----------- | -------------- | ---------------------------- |
| id          | UUID PK        |                              |
| owner_id    | UUID FK        | → `users.id`                 |
| name        | VARCHAR        |                              |
| description | TEXT           |                              |
| cover_image | TEXT           |                              |
| start_date  | DATE           |                              |
| end_date    | DATE           |                              |
| budget      | DECIMAL        |                              |
| status      | ENUM           | `UPCOMING` / `ONGOING` / `COMPLETED` |
| is_public   | BOOLEAN        |                              |
| share_slug  | VARCHAR UNIQUE | public share URL             |
| created_at  | TIMESTAMP      |                              |
| updated_at  | TIMESTAMP      |                              |

---

### `cities`

Reusable, user-agnostic destination catalog. Powers city search, country /
region filtering and cost ranking.

| Column      | Type    | Notes              |
| ----------- | ------- | ------------------ |
| id          | UUID PK |                    |
| name        | VARCHAR |                    |
| country     | VARCHAR |                    |
| region      | VARCHAR | for filtering      |
| description | TEXT    |                    |
| image       | TEXT    |                    |
| cost_index  | DECIMAL | for cost ranking   |
| latitude    | DECIMAL |                    |
| longitude   | DECIMAL |                    |

> `popularity` removed in v2 — ranking is derived from `saved_destinations`
> counts and OpenTripMap activity volume at query time.

---

## 2. Trip Structure Tables

### `trip_stops` ⭐ key normalization table

A trip can contain multiple cities. `position` lets the user reorder stops.

| Column     | Type    | Notes                |
| ---------- | ------- | -------------------- |
| id         | UUID PK |                      |
| trip_id    | UUID FK | → `trips.id`         |
| city_id    | UUID FK | → `cities.id`        |
| start_date | DATE    |                      |
| end_date   | DATE    |                      |
| position   | INT     | reorder stops        |
| budget     | DECIMAL | per-stop budget      |
| notes      | TEXT    |                      |

**Example**

```
Trip: Europe 2026

Stop 1 → Paris     (position = 1)
Stop 2 → Amsterdam (position = 2)
Stop 3 → Berlin    (position = 3)
```

---

### `planned_activities` ⭐ key normalization table (OpenTripMap-backed)

In v2 this table **no longer references a local `activities` table**. Instead,
when a user schedules an activity discovered via the OpenTripMap API, the
relevant fields are **snapshotted** into `planned_activities`. This means:

- The itinerary survives even if the OpenTripMap record later changes or
  disappears.
- Per-trip scheduling data (date, time, planned cost, position) lives here —
  not in the external API.
- `otm_place_id` is kept as a soft reference for re-fetching live details
  (hours, photos, reviews) when the user reopens the itinerary.

| Column         | Type     | Notes                                         |
| -------------- | -------- | --------------------------------------------- |
| id             | UUID PK  |                                               |
| trip_stop_id   | UUID FK  | → `trip_stops.id`                            |
| otm_place_id   | VARCHAR  | soft ref to OpenTripMap place (nullable)      |
| name           | VARCHAR  | snapshotted from OpenTripMap                  |
| type           | VARCHAR  | snapshotted category (museum, hiking, …)      |
| image          | TEXT     | snapshotted image URL                         |
| latitude       | DECIMAL  | snapshotted for map rendering                 |
| longitude      | DECIMAL  | snapshotted for map rendering                 |
| date           | DATE     |                                               |
| start_time     | TIME     |                                               |
| end_time       | TIME     |                                               |
| planned_cost   | DECIMAL  | snapshotted cost at planning time             |
| position       | INT      | order within day                              |
| notes          | TEXT     | user-added notes                              |

**Example**

```
OpenTripMap place: Louvre Museum (otm_place_id = "OTM-abc123")

Trip A: June 10, 10:00, planned_cost = ₹2,000
Trip B: Aug 15, 14:00, planned_cost = ₹2,500
```

The same external POI can be scheduled differently per trip without any
denormalization — and without maintaining a local activity catalog.

---

### `trip_expenses`

For the overall financial breakdown. `trip_stop_id` is **nullable** so expenses
can be trip-level (e.g. overall flights) or stop-level (e.g. museum tickets in
Paris).

| Column        | Type         | Notes                                              |
| ------------- | ------------ | -------------------------------------------------- |
| id            | UUID PK      |                                                    |
| trip_id       | UUID FK      | → `trips.id`                                       |
| trip_stop_id  | UUID FK NULL | → `trip_stops.id` (nullable)                       |
| category      | ENUM         | `TRANSPORT` / `STAY` / `ACTIVITY` / `MEAL` / `OTHER` |
| amount        | DECIMAL      |                                                    |
| description   | TEXT         |                                                    |
| expense_date  | DATE         |                                                    |
| created_at    | TIMESTAMP    |                                                    |

---

### `saved_destinations`

For the user's saved cities.

| Column     | Type      | Notes                          |
| ---------- | --------- | ------------------------------ |
| id         | UUID PK   |                                |
| user_id    | UUID FK   | → `users.id`                   |
| city_id    | UUID FK   | → `cities.id`                  |
| created_at | TIMESTAMP |                                |

**Constraint:** `UNIQUE(user_id, city_id)` — prevents duplicate saves.

---

### `trip_collaborators` *(optional — only if friends co-edit trips)*

Only required if the implementation allows collaborative editing. For
read-only / public-only sharing, `trips.is_public` + `trips.share_slug` is
sufficient and this table can be omitted.

| Column     | Type      | Notes                       |
| ---------- | --------- | --------------------------- |
| id         | UUID PK   |                             |
| trip_id    | UUID FK   | → `trips.id`                |
| user_id    | UUID FK   | → `users.id`                |
| role       | ENUM      | `VIEWER` / `EDITOR`         |
| created_at | TIMESTAMP |                             |

---

## 3. Design Notes — Why This Schema

- **Normalize, don't blob.** A single fat `trips` table would force JSON
  columns for stops and activities, breaking indexable queries on city, date
  and budget. Normalizing to `trip_stops` + `planned_activities` makes every
  dimension queryable and enables aggregation by stop, by date, or by category.

- **`planned_activities` is the snapshot, not a bridge.** With OpenTripMap as
  the source of truth for POI metadata, we no longer maintain a local
  `activities` table. Instead, each `planned_activities` row **snapshots** the
  POI's name, type, image, coordinates and cost at the moment the user adds it
  to a trip. The itinerary survives external API changes, and `otm_place_id`
  remains available for live re-fetches (hours, photos, reviews) on demand.

- **Global catalog separation.** `cities` is user-agnostic and shared across
  all trips. This directly supports the PRD's city search, country / region
  filtering and `cost_index` ranking — all powered by indexed columns, not
  in-app filtering on a JSON blob. POI-level data (museums, hikes, food tours)
  is intentionally **not** stored locally; it lives in OpenTripMap.

- **`trip_expenses.trip_stop_id` is nullable.** Expenses can be trip-level
  (e.g. overall flights) or stop-level (e.g. museum tickets in Paris). The
  nullable FK supports both attributions cleanly and gives the PRD's
  "breakdown by transport / stay / activity / meal" without a separate
  aggregating table.

- **`trip_collaborators` is conditional.** If sharing is read-only (via
  `is_public` + `share_slug`), this table is unnecessary. Add it only when
  friends need to actually edit the same trip; the `role` enum
  (`VIEWER` / `EDITOR`) controls permissions.

---

## 4. Indexes, Constraints & Screen Mapping

### Indexes & Constraints

| Table              | Index / Constraint        | Type        | Rationale                          |
| ------------------ | ------------------------- | ----------- | ---------------------------------- |
| users              | email                     | UNIQUE      | login lookup                       |
| trips              | share_slug                | UNIQUE      | public share URL                   |
| trips              | owner_id                  | FK + INDEX  | list user's trips                  |
| trip_stops         | (trip_id, position)        | COMPOSITE   | ordered itinerary fetch            |
| planned_activities | (trip_stop_id, date)      | COMPOSITE   | day-by-day itinerary               |
| planned_activities | otm_place_id              | INDEX       | reverse lookup by OpenTripMap POI  |
| trip_expenses      | trip_id                   | FK + INDEX  | cost breakdown per trip            |
| saved_destinations | (user_id, city_id)        | UNIQUE      | no duplicate saves                 |
| cities             | (country, region)          | COMPOSITE   | filter by region                   |
| cities             | cost_index                | INDEX       | sort by affordability             |

### Screen → Tables Mapping

| App Screen            | Primary Tables                                            |
| --------------------- | --------------------------------------------------------- |
| Build Itinerary       | `trips`, `trip_stops`, `planned_activities`              |
| My Trips              | `trips`, `trip_stops`                                     |
| Profile               | `users`, `trips`                                          |
| City / POI Search     | `cities` (DB) + OpenTripMap API (live POIs)              |
| Itinerary View        | `trip_stops`, `planned_activities`, `trip_expenses`      |
| Saved Destinations    | `saved_destinations`, `cities`                            |
| Public Trip View      | `trips` (share_slug), `trip_stops`, `planned_activities` |

---

## 5. Entity Relationship Diagram

Solid lines mark required foreign keys; dashed lines mark optional or
conditional relationships. Highlighted tables (`trip_stops`,
`planned_activities`) are the key normalization decisions.

```
USER
 │
 ├──────────────< TRIP
 │                 │
 │                 ├────────< TRIP_STOP >──────── CITY
 │                 │              │
 │                 │              └──< PLANNED_ACTIVITY >── (OpenTripMap API)
 │                 │
 │                 └────────< TRIP_EXPENSE
 │
 └──────────────< SAVED_DESTINATION >──────── CITY


optional (collaborative editing only):

TRIP ──< TRIP_COLLABORATORS >── USER
```

### Final Relationship Summary

```
users            1 ──< trips
users            1 ──< saved_destinations >── cities
trips            1 ──< trip_stops >── cities
trips            1 ──< trip_expenses (trip_stop_id NULL)
trip_stops       1 ──< planned_activities → (otm_place_id, soft ref)
trip_stops       1 ──< trip_expenses (optional FK)
trips            1 ──< trip_collaborators >── users      [optional]
```

### Why this is the final schema

- **PostgreSQL + Prisma + 8 core tables** (down from 9 in v1, because
  `activities` was removed in favour of OpenTripMap).
- `planned_activities` **snapshots** OpenTripMap POI data so itineraries are
  immutable after planning — no broken references if the external API changes.
- `cities` stays as a small, curated, indexed catalog — no `popularity` column
  (derived metric), no POI data (lives in OpenTripMap).
- `users` is stripped down to auth + profile essentials.
- `trip_collaborators` only if collaborative editing is actually required.
