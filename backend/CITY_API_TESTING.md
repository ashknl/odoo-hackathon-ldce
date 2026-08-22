# Testing the City Catalog & Activities APIs

Covers the city catalog (`/api/cities`) and OpenTripMap proxy (`/api/activities`):

| # | Method | Route | Purpose |
|---|---|---|---|
| 1 | GET | `/api/cities` | Search cities (paginated) |
| 2 | GET | `/api/cities/popular` | Recommended destinations |
| 3 | GET | `/api/cities/:id` | City detail |
| 4 | GET | `/api/activities` | Search activities around a city (paginated) |
| 5 | GET | `/api/activities/:id` | Activity detail (OpenTripMap proxy) |

All endpoints require a valid bearer token.

---

## 1. Prerequisites

From the `backend/` directory:

```bash
npm install
```

Ensure `.env` is configured:

```env
DATABASE_URL=postgresql://...
OPENTRIPMAP_API_KEY=5ae2e3f221c38a28845f05b6b588a45444bc25f8a21a62e271f71871
JWT_SECRET=odoo-hackathon
PORT=5000
```

Apply the Drizzle migrations (creates the `cities` table + `popular` column):

```bash
npx drizzle-kit migrate
```

Start the server:

```bash
node index.js
```

The API is now available at `http://localhost:5000`.

---

## 2. Generate a test token

The routes are protected by `authMiddleware`. Generate a token using the same
`JWT_SECRET` as `.env`:

```bash
node -e 'import jwt from "jsonwebtoken"; console.log(jwt.sign({ userId: "550e8400-e29b-41d4-a716-446655440000" }, "odoo-hackathon", { expiresIn: "7d" }));'
```

Copy the output and export it for the examples below:

```bash
export TOKEN="<paste-the-token-here>"
```

> Alternatively, sign up via `POST /api/auth/signup` and use the returned token.

---

## 3. Endpoint 1 — Search cities

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:5000/api/cities?q=paris&limit=5&offset=0" | python3 -m json.tool
```

Query params:

| Param | Type | Notes |
|---|---|---|
| `q` | string | Case-insensitive name search |
| `country` | string | Case-insensitive country filter |
| `region` | string | Case-insensitive region filter |
| `limit` | number | Default `20`, max `100` |
| `offset` | number | Default `0` |

Expected response (paginated shape):

```json
{
  "data": [
    {
      "id": "f7846518-2d9e-46b5-b5e9-b0aefc8067ff",
      "name": "Paris",
      "country": "France",
      "region": "Île-de-France",
      "description": "The City of Light, known for its art, fashion and world-famous landmarks.",
      "image": "https://images.unsplash.com/...",
      "costIndex": "130.00",
      "latitude": "48.8534100",
      "longitude": "2.3488000"
    }
  ],
  "count": 1,
  "limit": 5,
  "offset": 0
}
```

### Seed-on-demand behavior

Searching a city that is **not** in the DB (e.g. `Amsterdam`) triggers an
OpenTripMap `geoname` lookup. The city is resolved, inserted into the `cities`
table, and returned — with `region`, `description` and `image` empty until
enriched:

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:5000/api/cities?q=Amsterdam" | python3 -m json.tool
```

```json
{
  "data": [
    {
      "id": "8605d952-5922-4e81-bc97-60f5f1b0a1e9",
      "name": "Amsterdam",
      "country": "NL",
      "region": null,
      "description": null,
      "image": null,
      "costIndex": "140.00",
      "latitude": "52.3740300",
      "longitude": "4.8896900"
    }
  ],
  "count": 1,
  "limit": 20,
  "offset": 0
}
```

### Filter by country / region

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:5000/api/cities?country=France" | python3 -m json.tool
```

---

## 4. Endpoint 2 — Popular / recommended cities

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:5000/api/cities/popular?limit=3" | python3 -m json.tool
```

`limit` defaults to `25` (max `100`).

On first call with an empty `cities` table, 30 curated destinations (25 marked
`popular`) are seeded automatically. Rankings are derived from
`saved_destinations` save counts; non-popular cities are excluded.

Expected response (plain array):

```json
[
  {
    "id": "b95a9a41-87c7-43e1-b523-1bd8f5448b7d",
    "name": "Barcelona",
    "country": "Spain",
    "region": "Catalonia",
    "description": "Sunny Mediterranean city celebrated for Gaudí architecture and beaches.",
    "image": "https://images.unsplash.com/...",
    "costIndex": "110.00",
    "latitude": "41.3887900",
    "longitude": "2.1589900"
  }
]
```

---

## 5. Endpoint 3 — City detail

Grab an `id` from either list above, then:

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:5000/api/cities/8605d952-5922-4e81-bc97-60f5f1b0a1e9" | python3 -m json.tool
```

Expected response (single object):

```json
{
  "id": "8605d952-5922-4e81-bc97-60f5f1b0a1e9",
  "name": "Amsterdam",
  "country": "NL",
  "region": null,
  "description": null,
  "image": null,
  "costIndex": "140.00",
  "latitude": "52.3740300",
  "longitude": "4.8896900"
}
```

Unknown id → `404`:

```json
{
  "message": "City not found"
}
```

---

## 6. Endpoint 4 — Search activities around a city

> **No request body.** This is a `GET` route — send only the `Authorization`
> header and pass everything as query params. The only required param is
> `cityId` (a valid city UUID). `curl` sends no body for `GET`.

First grab a valid `cityId` (e.g. Paris) from `/api/cities?q=paris`, then:

```bash
export CITY_ID="<a-city-id-from-above>"

curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:5000/api/activities?cityId=$CITY_ID&limit=3" | python3 -m json.tool
```

Query params:

| Param | Type | Notes |
|---|---|---|
| `cityId` | string | **Required** — resolves to cached coordinates in the DB |
| `q` | string | Name search (OpenTripMap `autosuggest`) |
| `type` | string | Filter mapped to OpenTripMap `kinds` (e.g. `sightseeing`, `museum`) |
| `limit` | number | Default `20`, max `100` |
| `offset` | number | Default `0` |

Expected response (paginated shape, live OpenTripMap data):

```json
{
  "data": [
    {
      "otmPlaceId": "N191031796",
      "name": "Point zéro des routes de France",
      "kinds": "milestones,historic,monuments_and_memorials,interesting_places",
      "rate": 3,
      "latitude": 48.85332489013672,
      "longitude": 2.3488595485687256,
      "previewUrl": null,
      "wikipediaExtract": null,
      "otmUrl": "https://opentripmap.com/en/card/N191031796",
      "plannedCost": 10
    }
  ],
  "count": 7369,
  "limit": 3,
  "offset": 0
}
```

### Filter by type

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:5000/api/activities?cityId=$CITY_ID&type=museum&limit=3" | python3 -m json.tool
```

### Name search (`q`)

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:5000/api/activities?cityId=$CITY_ID&q=eiffel&limit=3" | python3 -m json.tool
```

---

## 7. Endpoint 5 — Activity detail

> **No request body.** The `otmPlaceId` goes in the URL path; only the
> `Authorization` header is sent.

Use an `otmPlaceId` from the list above:

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:5000/api/activities/Q3485982" | python3 -m json.tool
```

Expected response (single object):

```json
{
  "otmPlaceId": "Q3485982",
  "name": "Siege of Paris",
  "kinds": "battlefields,historic,historical_places,interesting_places",
  "rate": "3",
  "previewUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/...",
  "image": "https://commons.wikimedia.org/wiki/File:...",
  "wikipediaExtract": "The siege of Paris was an assault...",
  "otmUrl": "https://opentripmap.com/en/card/Q3485982",
  "address": {
    "city": "Paris",
    "country": "France"
  },
  "latitude": 48.85660171508789,
  "longitude": 2.351830005645752,
  "plannedCost": 10
}
```

Unknown `otmPlaceId` → `404`:

```json
{
  "message": "Activity not found"
}
```

---

## 8. Expected error cases

| Scenario | Status | Body |
|---|---|---|
| Missing `Authorization` header | `401` | `{ "message": "Authorization header is required" }` |
| Invalid / expired token | `401` | `{ "message": "Invalid or expired token" }` |
| Unknown city id | `404` | `{ "message": "City not found" }` |
| Unknown activity (`otmPlaceId`) | `404` | `{ "message": "Activity not found" }` |
| `/api/activities` without `cityId` | `400` | `{ "message": "cityId is required to list activities" }` |
| `q` search without `cityId` | `400` | `{ "message": "cityId is required to search activities" }` |
| `OPENTRIPMAP_API_KEY` not set in `.env` | `500` | `{ "message": "OpenTripMap API key is not configured" }` |
| OpenTripMap upstream failure | `502` | `{ "message": "OpenTripMap request failed" }` |
