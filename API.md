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
 token || POST | `/api/auth/signup` | — | Create account |
| POST | `/api/auth/login` | — | Login, returns bearer
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
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Ada Lovelace",
    "email": "ada@example.com"
  },
  "token": "..."
}
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
| PATCH | `/api/users/me` | 🔒 | Update name / photo |
| DELETE | `/api/users/me` | 🔒 | Delete account |
| POST | `/api/users/me/avatar` | 🔒 | Upload profile photo (`multipart/form-data`) |
| GET | `/api/users/me/saved-destinations` | 🔒 | List saved destinations |
| POST | `/api/users/me/saved-destinations` | 🔒 | Save a destination |
| DELETE | `/api/users/me/saved-destinations/:id` | 🔒 | Remove a saved destination |

### User shape
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "avatarUrl": "https://...",
  "createdAt": "2026-08-22T10:00:00Z"
}
```

> `language` is not stored server-side — i18n preference is handled client-side.

### PATCH `/api/users/me`
Request (any subset): `{ "name": "..." }` → `200` updated user.

### DELETE `/api/users/me`
Request: `{ "password": "..." }` (confirm) → `204`. Cascades to all trips/stops/activities.

### POST `/api/users/me/avatar`
`multipart/form-data` field `file` → `200` `{ "avatarUrl": "..." }`

### Saved destinations
POST body: `{ "cityId": "550e8400-e29b-41d4-a716-446655440001" }` → `201`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "cityId": "550e8400-e29b-41d4-a716-446655440001",
  "city": { ... }
}
```

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
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Summer Europe 2026",
  "description": "...",
  "startDate": "2026-07-01",
  "endDate": "2026-07-14",
  "coverUrl": "https://...",
  "isPublic": false,
  "shareToken": "abc123xyz",
  "ownerId": "550e8400-e29b-41d4-a716-446655440001",
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
  "trip": { "..." : "..." },
  "stops": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440010",
      "cityId": "550e8400-e29b-41d4-a716-446655440042",
      "city": { "..." : "..." },
      "startDate": "2026-07-01",
      "endDate": "2026-07-04",
      "position": 0,
      "activities": [
        {
          "id": "550e8400-e29b-41d4-a716-446655440100",
          "otmPlaceId": "W1823849028",
          "name": "Louvre Museum",
          "type": "museum",
          "date": "2026-07-02",
          "startTime": "10:00",
          "endTime": "13:00",
          "plannedCost": 22,
          "note": "Book tickets in advance"
        }
      ]
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
    {
      "date": "2026-07-01",
      "stopId": "550e8400-e29b-41d4-a716-446655440010",
      "city": { "..." : "..." },
      "items": [
        {
          "otmPlaceId": "W1823849028",
          "startTime": "10:00",
          "title": "Louvre Museum",
          "cost": 22
        }
      ]
    }
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
Request:
```json
{
  "cityId": "550e8400-e29b-41d4-a716-446655440042",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD"
}
```
→ `201` stop.

### PATCH `/api/trips/:tripId/stops/reorder`
Request:
```json
{
  "order": [
    "550e8400-e29b-41d4-a716-446655440012",
    "550e8400-e29b-41d4-a716-446655440010",
    "550e8400-e29b-41d4-a716-446655440011"
  ]
}
```
→ `200` updated stops list.

---

## 5. Stop Activities — `/api/trips/:tripId/stops/:stopId/activities`

| Method | Route | Auth | Purpose |
|---|---|---|---|
| GET | `.../activities` | 🔒 | Activities attached to a stop |
| POST | `.../activities` | 🔒 | Add activity to stop |
| PATCH | `.../activities/:id` | 🔒 | Edit (date, time, note) |
| DELETE | `.../activities/:id` | 🔒 | Remove activity from stop |

### POST `.../activities`
The client sends the OTM place ID and snapshots the key fields at save time so the itinerary is resilient to upstream API changes.

Request:
```json
{
  "otmPlaceId": "W1823849028",
  "name": "Louvre Museum",
  "type": "museum",
  "date": "YYYY-MM-DD",
  "startTime": "10:00",
  "endTime": "13:00",
  "plannedCost": 22,
  "note": "Book tickets in advance"
}
```
→ `201` planned activity.

---

## 6. Cities catalog — `/api/cities`

| Method | Route | Auth | Purpose |
|---|---|---|---|
| GET | `/api/cities` | 🔒 | Search (`?q=&country=&region=&limit=&offset=`) |
| GET | `/api/cities/popular` | 🔒 | Recommended destinations |
| GET | `/api/cities/:id` | 🔒 | City detail (country, cost index) |

`GET /api/cities?q=paris&country=FR` → paginated cities. Backed by our DB; enriched/seeded from OpenTripMap `geoname` resolution (see §9).

---

## 7. Activities — `/api/activities`

| Method | Route | Auth | Purpose |
|---|---|---|---|
| GET | `/api/activities` | 🔒 | Search (`?q=&cityId=&type=&limit=&offset=`) |
| GET | `/api/activities/:id` | 🔒 | Activity detail (description, images, kind) |

`GET /api/activities?cityId=550e8400-e29b-41d4-a716-446655440042&type=sightseeing` → paginated list.

These routes are **proxy endpoints** — there is no local activities table. The server forwards requests to OpenTripMap (`radius` / `autosuggest` calls), normalizes the response, and returns it directly to the client. Results are **not persisted**; only the fields the user explicitly schedules are snapshotted into `planned_activities` via `POST .../stops/:stopId/activities`.

---

## 8. Public sharing — `/api/public`

| Method | Route | Auth | Purpose |
|---|---|---|---|
| GET | `/api/public/trips/:token` | — | Public read-only itinerary |

Opaque, unguessable token (issued via `PATCH /api/trips/:id/sharing`). Returns the itinerary in the same shape as `GET /api/trips/:id/itinerary` but read-only and stripped of private user fields. `404` if token invalid or sharing disabled.

---

## 9. Third-party integration — OpenTripMap

OpenTripMap provides ~10M tourist POIs from OSM/Wikidata/Wikipedia (ODbL — cacheable, no map restriction). Base URL `https://api.opentripmap.com/0.1/en/places/`, auth via `apikey` query param. Our server wraps it so the API key stays server-side.

### OpenTripMap methods used

| Method | Upstream call | Purpose |
|---|---|---|
| geoname | `places/geoname?name=<city>` → `{lon, lat, country}` | Resolve a city to coordinates |
| radius | `places/radius?lon=&lat=&radius=&rate=&limit=&offset=&format=json\|count` | List POIs around a stop (paginated; `rate≥2` = has description) |
| xid | `places/xid/<xid>` → details (preview image, wikipedia extract, url, kinds) | Activity detail / quick view |
| autosuggest | `places/autosuggest?name=<partial>&...` | Search-as-you-type |

### Our proxy endpoints (internal, exposed via §6/§7)
These are not public REST routes but document the server-side flow:

- **City resolution**: when a city is added/selected, server calls `geoname` and caches `{ name, country, lat, lon, costIndex }` into the `cities` table.
- **Activity discovery**: `GET /api/activities?cityId=` calls `geoname` (or uses cached coords) then `radius`, filters by `kinds`/`rate`, normalizes the result, and returns it to the client. Results are **not written to any local table** — they are live OTM data.
- **Activity detail**: `GET /api/activities/:id` proxies to the OTM `xid` endpoint and returns `{ otmPlaceId, name, kinds, previewUrl, wikipediaExtract, otmUrl }` directly. When the user schedules the activity, the client POSTs the relevant snapshot fields to `planned_activities` (see §5).

### Mapping to our filters
- `type` filter → OpenTripMap `kinds` (hierarchical category catalog at `dev.opentripmap.org/catalog`).
- `cost` / `duration` → **not provided by OpenTripMap**. Estimated server-side via heuristics (kinds-based default ranges) or a secondary source. Flagged as a known gap for the cost breakdown feature.

### Env
```
OPENTRIPMAP_API_KEY=...
```