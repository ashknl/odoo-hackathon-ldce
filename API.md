# GlobeTrotter — REST API Specification

Base URL: `/api`

All request/response bodies are JSON (`Content-Type: application/json`) unless noted (file uploads use `multipart/form-data`).
Authentication uses a bearer token issued at login, sent as `Authorization: Bearer <token>`.
Routes marked 🔒 require auth. Admin routes marked 🔒🔒 additionally require an admin role.

Status codes follow convention: `200` success, `201` created, `204` no content, `400` bad request, `401` unauthorized, `403` forbidden, `404` not found, `409` conflict, `422` validation error, `500` server error.

Paginated list endpoints accept `?limit=20&offset=0` and return:
```json
{ "data": [ ... ], "count": 123, "limit": 20, "offset": 0 }
```

---

## 1. Auth — `/api/auth`

| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/signup` | — | Create account |
| POST | `/api/auth/login` | — | Login, returns bearer token |
| POST | `/api/auth/logout` | 🔒 | Invalidate current session |
| POST | `/api/auth/forgot-password` | — | Request password reset email |
| POST | `/api/auth/reset-password` | — | Reset password with token |
| GET | `/api/auth/me` | 🔒 | Current session user |

### POST `/api/auth/signup`
Request:
```json
{ "name": "Ada Lovelace", "email": "ada@example.com", "password": "••••••" }
```
Response `201`:
```json
{ "user": { "id": 1, "name": "Ada Lovelace", "email": "ada@example.com" }, "token": "..." }
```

### POST `/api/auth/login`
Request: `{ "email": "...", "password": "..." }`
Response `200`: `{ "user": {...}, "token": "..." }`

### POST `/api/auth/forgot-password`
Request: `{ "email": "..." }` → `204` (always, to avoid email enumeration).

### POST `/api/auth/reset-password`
Request: `{ "token": "...", "password": "..." }` → `204`

### GET `/api/auth/me`
Response: current user object (see User shape below).

---

## 2. User / Profile — `/api/users`

| Method | Route | Auth | Purpose |
|---|---|---|---|
| GET | `/api/users/me` | 🔒 | Profile + settings |
| PATCH | `/api/users/me` | 🔒 | Update name / photo / language |
| DELETE | `/api/users/me` | 🔒 | Delete account |
| POST | `/api/users/me/avatar` | 🔒 | Upload profile photo (`multipart/form-data`) |
| GET | `/api/users/me/saved-destinations` | 🔒 | List saved destinations |
| POST | `/api/users/me/saved-destinations` | 🔒 | Save a destination |
| DELETE | `/api/users/me/saved-destinations/:id` | 🔒 | Remove a saved destination |

### User shape
```json
{
  "id": 1,
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "avatarUrl": "https://...",
  "language": "en",
  "createdAt": "2026-08-22T10:00:00Z"
}
```

### PATCH `/api/users/me`
Request (any subset): `{ "name": "...", "language": "en" }` → `200` updated user.

### DELETE `/api/users/me`
Request: `{ "password": "..." }` (confirm) → `204`. Cascades to all trips/stops/activities.

### POST `/api/users/me/avatar`
`multipart/form-data` field `file` → `200` `{ "avatarUrl": "..." }`

### Saved destinations
POST body: `{ "cityId": 42 }` → `201` `{ "id": 7, "cityId": 42, "city": {...} }`

---

## 3. Trips — `/api/trips`

| Method | Route | Auth | Purpose |
|---|---|---|---|
| GET | `/api/trips` | 🔒 | List my trips (dashboard) |
| POST | `/api/trips` | 🔒 | Create trip |
| GET | `/api/trips/:id` | 🔒 | View trip |
| PATCH | `/api/trips/:id` | 🔒 | Edit trip |
| DELETE | `/api/trips/:id` | 🔒 | Delete trip |
| POST | `/api/trips/:id/cover` | 🔒 | Upload cover photo (`multipart/form-data`) |
| POST | `/api/trips/:id/duplicate` | 🔒 | "Copy Trip" (own or shared) |
| PATCH | `/api/trips/:id/sharing` | 🔒 | Toggle public/private, issue token |
| GET | `/api/trips/:id/itinerary` | 🔒 | Full itinerary (stops + activities) |
| GET | `/api/trips/:id/budget` | 🔒 | Cost breakdown (computed server-side) |
| GET | `/api/trips/:id/calendar` | 🔒 | Calendar / timeline view |

### Trip shape
```json
{
  "id": 1,
  "name": "Summer Europe 2026",
  "description": "...",
  "startDate": "2026-07-01",
  "endDate": "2026-07-14",
  "coverUrl": "https://...",
  "isPublic": false,
  "shareToken": "abc123xyz",
  "ownerId": 1,
  "stopCount": 4,
  "createdAt": "2026-08-22T10:00:00Z"
}
```

### POST `/api/trips`
Request: `{ "name": "...", "description": "...", "startDate": "YYYY-MM-DD", "endDate": "YYYY-MM-DD" }` → `201` trip.

### PATCH `/api/trips/:id`
Any subset of trip fields → `200`.

### POST `/api/trips/:id/cover`
`multipart/form-data` field `file` → `200` `{ "coverUrl": "..." }`

### POST `/api/trips/:id/duplicate`
Request: `{ "name": "Copy of ..." }` → `201` new trip (deep copy of stops + activities).

### PATCH `/api/trips/:id/sharing`
Request: `{ "isPublic": true }` → `200` `{ "isPublic": true, "shareToken": "abc123xyz" }`
Generating a fresh opaque token on each enable re-issues the URL; disabling revokes it.

### GET `/api/trips/:id/itinerary`
Response:
```json
{
  "trip": { ... },
  "stops": [
    {
      "id": 10, "cityId": 42, "city": {...},
      "startDate": "2026-07-01", "endDate": "2026-07-04", "order": 0,
      "activities": [ { "id": 100, "activityId": 555, "date": "2026-07-02", "time": "10:00", "note": "..." } ]
    }
  ]
}
```

### GET `/api/trips/:id/budget`
Server computes the breakdown:
```json
{
  "total": 2400,
  "currency": "USD",
  "perDayAverage": 171,
  "breakdown": { "transport": 600, "stay": 900, "activities": 500, "meals": 400 },
  "overBudgetDays": [ { "date": "2026-07-03", "spent": 350, "budget": 200 } ]
}
```

### GET `/api/trips/:id/calendar`
Day-wise layout for the calendar/timeline view:
```json
{
  "days": [
    { "date": "2026-07-01", "stopId": 10, "city": {...}, "items": [ { "activityId": 100, "time": "10:00", "title": "...", "cost": 25 } ] }
  ]
}
```

---

## 4. Stops (cities within a trip) — `/api/trips/:tripId/stops`

Nested under trips for clear ownership and auth scoping.

| Method | Route | Auth | Purpose |
|---|---|---|---|
| GET | `/api/trips/:tripId/stops` | 🔒 | List stops |
| POST | `/api/trips/:tripId/stops` | 🔒 | Add stop (city + dates) |
| PATCH | `/api/trips/:tripId/stops/:id` | 🔒 | Edit stop |
| DELETE | `/api/trips/:tripId/stops/:id` | 🔒 | Remove stop |
| PATCH | `/api/trips/:tripId/stops/reorder` | 🔒 | Reorder cities |

### POST `/api/trips/:tripId/stops`
Request: `{ "cityId": 42, "startDate": "YYYY-MM-DD", "endDate": "YYYY-MM-DD" }` → `201` stop.

### PATCH `/api/trips/:tripId/stops/reorder`
Request: `{ "order": [12, 10, 11] }` (stop IDs in desired sequence) → `200` updated stops list.

---

## 5. Stop Activities — `/api/trips/:tripId/stops/:stopId/activities`

| Method | Route | Auth | Purpose |
|---|---|---|---|
| GET | `.../activities` | 🔒 | Activities attached to a stop |
| POST | `.../activities` | 🔒 | Add activity to stop |
| PATCH | `.../activities/:id` | 🔒 | Edit (date, time, note) |
| DELETE | `.../activities/:id` | 🔒 | Remove activity from stop |

### POST `.../activities`
Request: `{ "activityId": 555, "date": "YYYY-MM-DD", "time": "10:00", "note": "Book ahead" }` → `201`
`activityId` references a row in our activities catalog (see §7); if it came from OpenTripMap it is cached/created server-side via the proxy.

---

## 6. Cities catalog — `/api/cities`

| Method | Route | Auth | Purpose |
|---|---|---|---|
| GET | `/api/cities` | 🔒 | Search (`?q=&country=&region=&limit=&offset=`) |
| GET | `/api/cities/popular` | 🔒 | Recommended destinations |
| GET | `/api/cities/:id` | 🔒 | City detail (country, cost index, popularity) |

`GET /api/cities?q=paris&country=FR` → paginated cities. Backed by our DB; enriched/seeded from OpenTripMap `geoname` resolution (see §9).

---

## 7. Activities catalog — `/api/activities`

| Method | Route | Auth | Purpose |
|---|---|---|---|
| GET | `/api/activities` | 🔒 | Search (`?q=&cityId=&type=&cost=&duration=&limit=&offset=`) |
| GET | `/api/activities/:id` | 🔒 | Activity detail (description, images, kind) |

`GET /api/activities?cityId=42&type=sightseeing&cost=low` → paginated list. Server proxies to OpenTripMap when results are missing/stale and caches normalized rows (see §9).

---

## 8. Public sharing — `/api/public`

| Method | Route | Auth | Purpose |
|---|---|---|---|
| GET | `/api/public/trips/:token` | — | Public read-only itinerary |

Opaque, unguessable token (issued via `PATCH /api/trips/:id/sharing`). Returns the itinerary in the same shape as `GET /api/trips/:id/itinerary` but read-only and stripped of private user fields. `404` if token invalid or sharing disabled.

---

## 9. Third-party integration — OpenTripMap

OpenTripMap provides ~10M tourist POIs from OSM/Wikidata/Wikipedia (ODbL — cacheable, no map restriction). Base URL `https://api.opentripmap.com/0.1/en/places/`, auth via `apikey` query param. Our server wraps it so the API key stays server-side and results are cached/normalized into our `cities`/`activities` tables.

### OpenTripMap methods used
| Method | Upstream call | Purpose |
|---|---|---|
| geoname | `places/geoname?name=<city>` → `{lon, lat, country}` | Resolve a city to coordinates |
| radius | `places/radius?lon=&lat=&radius=&rate=&limit=&offset=&format=json\|count` | List POIs around a stop (paginated; `rate≥2` = has description) |
| xid | `places/xid/<xid>` → details (preview image, wikipedia extract, url, kinds) | Activity detail / quick view |
| autosuggest | `places/autosuggest?name=<partial>&...` | Search-as-you-type |

### Our proxy endpoints (internal, exposed via §6/§7)
These are not public REST routes but document the server-side flow:

- **City resolution**: when a city is added/selected, server calls `geoname`, caches `{cityId, name, country, lat, lon, costIndex, popularity}` into `cities`.
- **Activity discovery**: `GET /api/activities?cityId=` calls `geoname` (or uses cached coords) then `radius`, filters by `kinds`/`rate`, normalizes and caches rows into `activities` with `{activityId, xid, cityId, name, kinds, rate, previewUrl, wikipediaExtract, otmUrl}`.
- **Activity detail**: `GET /api/activities/:id` returns cached row, lazy-fetching `xid` details from OpenTripMap on cache miss.

### Mapping to our filters
- `type` filter → OpenTripMap `kinds` (hierarchical category catalog at `dev.opentripmap.org/catalog`).
- `cost` / `duration` → **not provided by OpenTripMap**. Estimated server-side via heuristics (kinds-based default ranges) or a secondary source; stored on our `activities` rows. Flagged as a known gap for the cost breakdown feature (#9 of the description).

### Env
```
OPENTRIPMAP_API_KEY=...
```
Caching TTL and rate-limit handling are configured server-side.
