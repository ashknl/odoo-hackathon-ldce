# GlobeTrotter — Backend API Reference (Implementation-Accurate)

This document is generated from the **actual backend code** in this repository
(`controllers/`, `routes/`, `services/`, `middlewares/`, `utils/`). It lists
every mounted route, what the client must send (headers, path params, query
params, body), and the exact response shapes. Use this to implement the
frontend without reading server code.

---

## 1. Conventions

- **Base URL:** `http://localhost:5000` (configurable via `PORT` env).
- **All routes are mounted under `/api`.** The root `GET /` returns
  `{ "message": "GlobeTrotter API is running" }`.
- **Content-Type:** every request/response body is JSON
  (`Content-Type: application/json`). No endpoint currently accepts
  `multipart/form-data`.
- **Auth:** authenticated endpoints require the header
  `Authorization: Bearer <token>`. Tokens are JWT (7-day expiry), obtained from
  signup/login. Payload: `{ userId, iat, exp }`.
- **Error shape:** every error is `{ "message": "<string>" }`.
- **Dates:** `YYYY-MM-DD` (string). **Times:** `HH:MM` 24-hour (string), may be
  `null`. **IDs:** UUID strings, except OpenTripMap place ids (`otmPlaceId`,
  `activity :id`) which are strings like `"W1823849028"`.
- **Pagination:** list endpoints return
  `{ "data": [...], "count": <total>, "limit": <n>, "offset": <n> }`.

### Auth failure responses (from `auth.middleware.js`)

| Scenario | Status | Body |
|---|---|---|
| No `Authorization` header | `401` | `{ "message": "Authorization header is required" }` |
| Header not `Bearer ...` | `401` | `{ "message": "Invalid authorization format" }` |
| Invalid / expired token | `401` | `{ "message": "Invalid or expired token" }` |

---

## 2. Data Shapes (shared)

### User
```json
{
  "id": "6a197a8d-573b-4175-acdd-8cc6694e71f6",
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "avatarUrl": null,
  "createdAt": "2026-08-22T08:46:23.054Z"
}
```
> `POST /api/auth/signup` returns a shorter `user` object with only
> `id`, `name`, `email`.

### Trip (`serializeTrip`)
```json
{
  "id": "47b30e0d-8970-439e-94eb-897ff8ff2a86",
  "name": "Paris Getaway",
  "description": "Three days in Paris",
  "startDate": "2026-07-01",
  "endDate": "2026-07-03",
  "budget": 800,
  "status": "UPCOMING",
  "coverUrl": null,
  "isPublic": false,
  "shareToken": null,
  "ownerId": "68864a5f-6aa5-46a7-9270-63b8fcf8d1a6",
  "stopCount": 1,
  "createdAt": "2026-08-22T09:48:01.239Z"
}
```
- `budget`, `coverUrl`, `shareToken` may be `null`.
- `status` ∈ `"UPCOMING" | "ONGOING" | "COMPLETED"`.

### City — nested form (`serializeCity`, used inside trips/stops)
```json
{
  "id": "f7846518-2d9e-46b5-b5e9-b0aefc8067ff",
  "name": "Paris",
  "country": "France",
  "region": "Île-de-France",
  "description": "The City of Light, ...",
  "image": "https://images.unsplash.com/...",
  "costIndex": 130,
  "latitude": 48.85341,
  "longitude": 2.3488
}
```
> `costIndex`, `latitude`, `longitude` are **numbers** here.

### City — top-level form (raw DB row, `GET /api/cities*`)
```json
{
  "id": "f7846518-2d9e-46b5-b5e9-b0aefc8067ff",
  "name": "Paris",
  "country": "France",
  "region": "Île-de-France",
  "description": "The City of Light, ...",
  "image": "https://images.unsplash.com/...",
  "costIndex": "130.00",
  "latitude": "48.8534100",
  "longitude": "2.3488000",
  "popular": true
}
```
> ⚠️ In the **top-level city endpoints only**, `costIndex`, `latitude`,
> `longitude` are returned as **strings** (Postgres `numeric`/`decimal`
> columns), and there is an extra `popular` boolean.

### Stop (`serializeStop`)
```json
{
  "id": "83d15be6-1577-429a-a753-6955d4c1ebed",
  "tripId": "47b30e0d-8970-439e-94eb-897ff8ff2a86",
  "cityId": "f7846518-2d9e-46b5-b5e9-b0aefc8067ff",
  "city": { "... nested City form ..." },
  "startDate": "2026-07-01",
  "endDate": "2026-07-03",
  "position": 0,
  "budget": 400,
  "activities": []
}
```
> `budget` is a **number** or `null`. `activities` is `[]` on plain stop
> responses and only populated by the itinerary endpoint.

### Planned Activity (`serializeActivity`)
```json
{
  "id": "e2657129-f57f-4a7e-a361-aeccd9a1818d",
  "tripStopId": "83d15be6-1577-429a-a753-6955d4c1ebed",
  "otmPlaceId": "W1823849028",
  "name": "Louvre Museum",
  "type": "museum",
  "image": null,
  "latitude": null,
  "longitude": null,
  "date": "2026-07-01",
  "startTime": "10:00",
  "endTime": "13:00",
  "plannedCost": 22,
  "position": 1,
  "notes": "Book tickets in advance"
}
```
> `latitude`, `longitude`, `plannedCost` are numbers or `null`.
> `startTime` / `endTime` are `"HH:MM"` or `null`.

---

## 3. Auth — `/api/auth`

### `POST /api/auth/signup` — public
Creates an account and returns a token.

**Body (JSON):**
| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | ✅ | trimmed |
| `email` | string | ✅ | trimmed + lowercased; must be unique |
| `password` | string | ✅ | minimum 6 characters |

**Success `201`:**
```json
{
  "user": { "id": "...", "name": "...", "email": "..." },
  "token": "eyJhbGciOi..."
}
```

**Errors:** `400` missing fields → `{ "message": "Name, email and password are required" }`;
`400` short password → `{ "message": "Password must be at least 6 characters" }`;
`409` duplicate email → `{ "message": "An account with this email already exists" }`.

---

### `POST /api/auth/login` — public

**Body (JSON):**
| Field | Type | Required |
|---|---|---|
| `email` | string | ✅ |
| `password` | string | ✅ |

**Success `200`:**
```json
{
  "user": { "id": "...", "name": "...", "email": "...", "avatarUrl": null, "createdAt": "..." },
  "token": "eyJhbGciOi..."
}
```

**Errors:** `400` → `{ "message": "Email and password are required" }`;
`401` → `{ "message": "Invalid email or password" }`.

---

### `GET /api/auth/me` — 🔒
Returns the current user.

**Success `200`:** User object (see §2).

**Errors:** `404` → `{ "message": "User not found" }`.

---

### `POST /api/auth/logout` — 🔒
Currently a no-op (JWT is stateless).

**Success `204`** (empty body). No request body needed.

---

## 4. User / Profile — `/api/users`

| Method | Route | Status |
|---|---|---|
| `GET` | `/api/users/me` | 🔒 **501 Not implemented** |
| `PATCH` | `/api/users/me` | 🔒 **501 Not implemented** |
| `DELETE` | `/api/users/me` | 🔒 implemented |
| `POST` | `/api/users/me/avatar` | 🔒 **501 Not implemented** |
| `GET` | `/api/users/me/saved-destinations` | 🔒 **501 Not implemented** |
| `POST` | `/api/users/me/saved-destinations` | 🔒 **501 Not implemented** |
| `DELETE` | `/api/users/me/saved-destinations/:id` | 🔒 **501 Not implemented** |

Not-implemented routes return `501 { "message": "Not implemented" }`.

### `DELETE /api/users/me` — 🔒
Deletes the authenticated account (cascades to trips/stops/activities).

**Body (JSON):**
| Field | Type | Required |
|---|---|---|
| `password` | string | ✅ |

**Success `204`** (empty body).

**Errors:** `400` → `{ "message": "Password is required" }`;
`401` → `{ "message": "Invalid password" }`;
`404` → `{ "message": "User not found" }`.

---

## 5. Trips — `/api/trips`

| Method | Route | Status |
|---|---|---|
| `GET` | `/api/trips` | 🔒 implemented |
| `POST` | `/api/trips` | 🔒 implemented |
| `GET` | `/api/trips/:id` | 🔒 implemented |
| `PATCH` | `/api/trips/:id` | 🔒 implemented |
| `DELETE` | `/api/trips/:id` | 🔒 implemented |
| `POST` | `/api/trips/:id/cover` | 🔒 **501 Not implemented** |
| `POST` | `/api/trips/:id/duplicate` | 🔒 **501 Not implemented** |
| `PATCH` | `/api/trips/:id/sharing` | 🔒 **501 Not implemented** |
| `GET` | `/api/trips/:id/itinerary` | 🔒 implemented |
| `GET` | `/api/trips/:id/budget` | 🔒 **501 Not implemented** |
| `GET` | `/api/trips/:id/calendar` | 🔒 implemented |

### `GET /api/trips` — 🔒
Lists the authenticated user's trips (most recent first), each with its stops.

**Success `200`:** array of Trip objects, each extended with `stops`:
```json
[
  {
    "... Trip fields ...": "...",
    "stops": [ { "... Stop fields ...": "..." } ]
  }
]
```

---

### `POST /api/trips` — 🔒
Creates a trip.

**Body (JSON):**
| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | ✅ | trimmed |
| `description` | string | ❌ | `null` if empty |
| `startDate` | string | ✅ | `YYYY-MM-DD` |
| `endDate` | string | ✅ | `YYYY-MM-DD`, must be ≥ `startDate` |
| `budget` | number | ❌ | |

**Success `201`:** Trip object (see §2).

**Errors:** `400` → `{ "message": "Name, startDate and endDate are required" }`;
`400` → `{ "message": "endDate cannot be before startDate" }`.

---

### `GET /api/trips/:id` — 🔒

**Path params:** `id` (trip UUID).

**Success `200`:** Trip object (with `stopCount`).

**Errors:** `404` → `{ "message": "Trip not found" }` (also if owned by another user).

---

### `PATCH /api/trips/:id` — 🔒
Partial update. Any subset of fields may be sent.

**Path params:** `id` (trip UUID).

**Body (JSON)** — all optional, at least one required:
| Field | Type | Notes |
|---|---|---|
| `name` | string | non-empty (trimmed) |
| `description` | string | `null` clears it |
| `startDate` | string | `YYYY-MM-DD` |
| `endDate` | string | `YYYY-MM-DD`, must be ≥ effective start |
| `budget` | number | |
| `status` | string | `UPCOMING` \| `ONGOING` \| `COMPLETED` |

**Success `200`:** updated Trip object.

**Errors:** `400` → `{ "message": "No fields to update" }`;
`400` → `{ "message": "name cannot be empty" }`;
`400` → `{ "message": "endDate cannot be before startDate" }`;
`400` → `{ "message": "Invalid status" }`;
`404` → `{ "message": "Trip not found" }`.

---

### `DELETE /api/trips/:id` — 🔒

**Path params:** `id` (trip UUID).

**Success `204`** (empty body). Cascades to stops and activities.

**Errors:** `404` → `{ "message": "Trip not found" }`.

---

### `GET /api/trips/:id/itinerary` — 🔒
Full itinerary: trip + ordered stops + their activities.

**Path params:** `id` (trip UUID).

**Success `200`:**
```json
{
  "trip": { "... Trip fields (stopCount = number of stops) ..." },
  "stops": [
    {
      "... Stop fields ...": "...",
      "activities": [
        { "... Planned Activity fields ...": "..." }
      ]
    }
  ]
}
```
Stops are ordered by `position`; activities within a stop by `date` then
`position`.

**Errors:** `404` → `{ "message": "Trip not found" }`.

---

### `GET /api/trips/:id/calendar` — 🔒
Day-by-day timeline spanning the trip's full `startDate → endDate` range
(inclusive), even days with no activities.

**Path params:** `id` (trip UUID).

**Success `200`:**
```json
{
  "days": [
    {
      "date": "2026-07-01",
      "stopId": "83d15be6-1577-429a-a753-6955d4c1ebed",
      "city": { "... nested City form ..." },
      "items": [
        {
          "id": "e2657129-f57f-4a7e-a361-aeccd9a1818d",
          "otmPlaceId": "W1823849028",
          "startTime": "10:00",
          "endTime": "13:00",
          "title": "Louvre Museum",
          "cost": 22
        }
      ]
    }
  ]
}
```
- `stopId` / `city` are the stop covering that date, or `null` for a gap day.
- `items[].cost` is a number or `null`.
- Items are ordered by `startTime` then `position`.

**Errors:** `404` → `{ "message": "Trip not found" }`.

---

## 6. Stops — `/api/trips/:tripId/stops`

Nested under trips (`mergeParams`). All require `tripId` in the path.

| Method | Route | Status |
|---|---|---|
| `GET` | `/api/trips/:tripId/stops` | 🔒 implemented |
| `POST` | `/api/trips/:tripId/stops` | 🔒 implemented |
| `PATCH` | `/api/trips/:tripId/stops/reorder` | 🔒 **501 Not implemented** |
| `PATCH` | `/api/trips/:tripId/stops/:id` | 🔒 **501 Not implemented** |
| `DELETE` | `/api/trips/:tripId/stops/:id` | 🔒 implemented |

> ⚠️ `PATCH .../reorder` is registered **before** `PATCH .../:id`, but both are
> currently 501 stubs.

### `GET /api/trips/:tripId/stops` — 🔒

**Path params:** `tripId` (trip UUID).

**Success `200`:** array of Stop objects (ordered by `position`).

**Errors:** `404` → `{ "message": "Trip not found" }`.

---

### `POST /api/trips/:tripId/stops` — 🔒
Adds a stop (city + date range) to the trip. `position` is auto-assigned as the
next index.

**Path params:** `tripId` (trip UUID).

**Body (JSON):**
| Field | Type | Required | Notes |
|---|---|---|---|
| `cityId` | string (UUID) | ✅ | |
| `startDate` | string | ✅ | `YYYY-MM-DD` |
| `endDate` | string | ✅ | `YYYY-MM-DD`, must be ≥ `startDate` |
| `budget` | number | ❌ | |

**Success `201`:** Stop object (with nested `city`).

**Errors:** `400` → `{ "message": "cityId, startDate and endDate are required" }`;
`400` → `{ "message": "endDate cannot be before startDate" }`;
`404` → `{ "message": "Trip not found" }`;
`404` → `{ "message": "City not found" }`.

---

### `DELETE /api/trips/:tripId/stops/:id` — 🔒

**Path params:** `tripId` (trip UUID), `id` (stop UUID).

**Success `204`** (empty body).

**Errors:** `404` → `{ "message": "Trip not found" }`;
`404` → `{ "message": "Stop not found" }`.

---

## 7. Stop Activities — `/api/trips/:tripId/stops/:stopId/activities`

Nested under trips and stops (`mergeParams`). All require `tripId` and `stopId`
in the path.

| Method | Route | Status |
|---|---|---|
| `GET` | `.../activities` | 🔒 implemented |
| `POST` | `.../activities` | 🔒 implemented |
| `PATCH` | `.../activities/:id` | 🔒 implemented |
| `DELETE` | `.../activities/:id` | 🔒 implemented |

### `GET /api/trips/:tripId/stops/:stopId/activities` — 🔒

**Path params:** `tripId`, `stopId`.

**Success `200`:** array of Planned Activity objects (ordered by `date` then
`position`).

**Errors:** `404` → `{ "message": "Stop not found" }`.

---

### `POST /api/trips/:tripId/stops/:stopId/activities` — 🔒
Adds an activity to a stop (snapshots the OpenTripMap place at save time).
`position` is auto-assigned as the next index.

**Path params:** `tripId`, `stopId`.

**Body (JSON):**
| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | ✅ | trimmed |
| `date` | string | ✅ | `YYYY-MM-DD` |
| `otmPlaceId` | string | ❌ | OpenTripMap place id |
| `type` | string | ❌ | e.g. `museum`, `sightseeing` |
| `image` | string | ❌ | URL |
| `latitude` | number | ❌ | |
| `longitude` | number | ❌ | |
| `startTime` | string | ❌ | `HH:MM` |
| `endTime` | string | ❌ | `HH:MM` |
| `plannedCost` | number | ❌ | |
| `notes` | string | ❌ | `note` is accepted as an alias |

**Success `201`:** Planned Activity object.

**Errors:** `400` → `{ "message": "name and date are required" }`;
`404` → `{ "message": "Stop not found" }`.

---

### `PATCH /api/trips/:tripId/stops/:stopId/activities/:id` — 🔒
Partial update. Any subset of the POST fields may be sent (except `position`,
which is not updatable here).

**Path params:** `tripId`, `stopId`, `id` (activity UUID).

**Body (JSON)** — all optional:
`otmPlaceId`, `name`, `type`, `image`, `latitude`, `longitude`, `date`,
`startTime`, `endTime`, `plannedCost`, `notes` (or `note`).

**Success `200`:** updated Planned Activity object.

**Errors:** `400` → `{ "message": "name cannot be empty" }` (if `name` is `""`);
`404` → `{ "message": "Stop not found" }`;
`404` → `{ "message": "Activity not found" }`.

---

### `DELETE /api/trips/:tripId/stops/:stopId/activities/:id` — 🔒

**Path params:** `tripId`, `stopId`, `id` (activity UUID).

**Success `204`** (empty body).

**Errors:** `404` → `{ "message": "Stop not found" }`;
`404` → `{ "message": "Activity not found" }`.

---

## 8. Cities Catalog — `/api/cities`

| Method | Route | Status |
|---|---|---|
| `GET` | `/api/cities` | 🔒 implemented |
| `GET` | `/api/cities/popular` | 🔒 implemented |
| `GET` | `/api/cities/:id` | 🔒 implemented |

> ⚠️ City endpoints return the **raw** city shape (see §2): `costIndex`,
> `latitude`, `longitude` are **strings** and there is a `popular` boolean.

### `GET /api/cities` — 🔒
Search / list cities.

**Query params:**
| Param | Type | Default | Notes |
|---|---|---|---|
| `q` | string | — | case-insensitive `name` substring match |
| `country` | string | — | case-insensitive substring |
| `region` | string | — | case-insensitive substring |
| `limit` | number | `20` | clamped to `1..100` |
| `offset` | number | `0` | |

> If `q` matches nothing locally, the server tries to resolve it via
> OpenTripMap and may create+return a new city row.

**Success `200`:**
```json
{
  "data": [ { "... top-level City form ..." } ],
  "count": 1,
  "limit": 20,
  "offset": 0
}
```

---

### `GET /api/cities/popular` — 🔒
Returns recommended cities (ordered by saved-destination count desc, then
name).

**Query params:**
| Param | Type | Default | Notes |
|---|---|---|---|
| `limit` | number | `25` | clamped to `1..100` |

**Success `200`:** array of top-level City objects (no `popular` field, no
pagination wrapper):
```json
[ { "id": "...", "name": "...", "costIndex": "140.00", "latitude": "52.3676000", "...": "..." } ]
```

---

### `GET /api/cities/:id` — 🔒

**Path params:** `id` (city UUID).

**Success `200`:** top-level City object.

**Errors:** `404` → `{ "message": "City not found" }`.

---

## 9. Activities (OpenTripMap proxy) — `/api/activities`

These are **live proxy endpoints** — there is no local activities table. The
server calls OpenTripMap and normalizes results. Results are not persisted.

| Method | Route | Status |
|---|---|---|
| `GET` | `/api/activities` | 🔒 implemented |
| `GET` | `/api/activities/:id` | 🔒 implemented |

### `GET /api/activities` — 🔒
List or search activities (POIs) near a city.

**Query params:**
| Param | Type | Required | Notes |
|---|---|---|---|
| `cityId` | string (UUID) | ✅ | city to search around |
| `q` | string | ❌ | if set → autosuggest search (requires `cityId`) |
| `type` | string | ❌ | see values below |
| `limit` | number | `20` | clamped to `1..100` |
| `offset` | number | `0` | |

**`type` accepted values** (mapped to OpenTripMap `kinds`):
`sightseeing`, `museum`, `nature`, `beach`, `food`, `architecture`, `historic`,
`religion`, `sport`, `shopping`, `nightlife`, `entertainment`.

**Success `200`:**
```json
{
  "data": [
    {
      "otmPlaceId": "W1823849028",
      "name": "Louvre Museum",
      "kinds": "museums,interesting_places",
      "rate": 3,
      "latitude": 48.8606,
      "longitude": 2.3376,
      "previewUrl": null,
      "wikipediaExtract": null,
      "otmUrl": "https://opentripmap.com/en/card/W1823849028",
      "plannedCost": 15
    }
  ],
  "count": 7369,
  "limit": 20,
  "offset": 0
}
```
> `plannedCost` is an estimated number (server-side heuristic from `kinds`).

**Errors:** `400` → `{ "message": "cityId is required to search activities" }`
(if `q` given without `cityId`);
`400` → `{ "message": "cityId is required to list activities" }`;
`404` → `{ "message": "City not found" }`.

---

### `GET /api/activities/:id` — 🔒
Activity detail (proxied to OpenTripMap `xid`).

**Path params:** `id` (OpenTripMap place id, e.g. `W1823849028`).

**Success `200`:**
```json
{
  "otmPlaceId": "W1823849028",
  "name": "Louvre Museum",
  "kinds": "museums,interesting_places",
  "rate": 3,
  "previewUrl": null,
  "image": null,
  "wikipediaExtract": null,
  "otmUrl": "https://opentripmap.com/en/card/W1823849028",
  "address": null,
  "latitude": 48.8606,
  "longitude": 2.3376,
  "plannedCost": 15
}
```

**Errors:** `404` → `{ "message": "Activity not found" }`.

---

## 10. Public Sharing — `/api/public`

| Method | Route | Status |
|---|---|---|
| `GET` | `/api/public/trips/:token` | public **501 Not implemented** |

Returns `501 { "message": "Not implemented" }`.

---

## 11. Summary Table

| Method | Route | Auth | Implemented |
|---|---|---|---|
| POST | `/api/auth/signup` | — | ✅ |
| POST | `/api/auth/login` | — | ✅ |
| GET | `/api/auth/me` | 🔒 | ✅ |
| POST | `/api/auth/logout` | 🔒 | ✅ (no-op) |
| GET | `/api/users/me` | 🔒 | ❌ 501 |
| PATCH | `/api/users/me` | 🔒 | ❌ 501 |
| DELETE | `/api/users/me` | 🔒 | ✅ |
| POST | `/api/users/me/avatar` | 🔒 | ❌ 501 |
| GET | `/api/users/me/saved-destinations` | 🔒 | ❌ 501 |
| POST | `/api/users/me/saved-destinations` | 🔒 | ❌ 501 |
| DELETE | `/api/users/me/saved-destinations/:id` | 🔒 | ❌ 501 |
| GET | `/api/trips` | 🔒 | ✅ |
| POST | `/api/trips` | 🔒 | ✅ |
| GET | `/api/trips/:id` | 🔒 | ✅ |
| PATCH | `/api/trips/:id` | 🔒 | ✅ |
| DELETE | `/api/trips/:id` | 🔒 | ✅ |
| POST | `/api/trips/:id/cover` | 🔒 | ❌ 501 |
| POST | `/api/trips/:id/duplicate` | 🔒 | ❌ 501 |
| PATCH | `/api/trips/:id/sharing` | 🔒 | ❌ 501 |
| GET | `/api/trips/:id/itinerary` | 🔒 | ✅ |
| GET | `/api/trips/:id/budget` | 🔒 | ❌ 501 |
| GET | `/api/trips/:id/calendar` | 🔒 | ✅ |
| GET | `/api/trips/:tripId/stops` | 🔒 | ✅ |
| POST | `/api/trips/:tripId/stops` | 🔒 | ✅ |
| PATCH | `/api/trips/:tripId/stops/reorder` | 🔒 | ❌ 501 |
| PATCH | `/api/trips/:tripId/stops/:id` | 🔒 | ❌ 501 |
| DELETE | `/api/trips/:tripId/stops/:id` | 🔒 | ✅ |
| GET | `/api/trips/:tripId/stops/:stopId/activities` | 🔒 | ✅ |
| POST | `/api/trips/:tripId/stops/:stopId/activities` | 🔒 | ✅ |
| PATCH | `/api/trips/:tripId/stops/:stopId/activities/:id` | 🔒 | ✅ |
| DELETE | `/api/trips/:tripId/stops/:stopId/activities/:id` | 🔒 | ✅ |
| GET | `/api/cities` | 🔒 | ✅ |
| GET | `/api/cities/popular` | 🔒 | ✅ |
| GET | `/api/cities/:id` | 🔒 | ✅ |
| GET | `/api/activities` | 🔒 | ✅ |
| GET | `/api/activities/:id` | 🔒 | ✅ |
| GET | `/api/public/trips/:token` | — | ❌ 501 |
