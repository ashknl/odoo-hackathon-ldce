# Testing the City Catalog APIs

Covers the three endpoints under `/api/cities`:

| # | Method | Route | Purpose |
|---|---|---|---|
| 1 | GET | `/api/cities` | Search cities (paginated) |
| 2 | GET | `/api/cities/popular` | Recommended destinations |
| 3 | GET | `/api/cities/:id` | City detail |

All three require a valid bearer token.

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

Apply the Drizzle migration (creates the `cities` table):

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

`limit` defaults to `10` (max `50`).

On first call with an empty `cities` table, 8 curated destinations are seeded
automatically. Rankings are derived from `saved_destinations` save counts.

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

## 6. Expected error cases

| Scenario | Status | Body |
|---|---|---|
| Missing `Authorization` header | `401` | `{ "message": "Authorization header is required" }` |
| Invalid / expired token | `401` | `{ "message": "Invalid or expired token" }` |
| Unknown city id | `404` | `{ "message": "City not found" }` |
| `OPENTRIPMAP_API_KEY` not set in `.env` | `500` | `{ "message": "OpenTripMap API key is not configured" }` |
| OpenTripMap upstream failure | `502` | `{ "message": "OpenTripMap request failed" }` |
