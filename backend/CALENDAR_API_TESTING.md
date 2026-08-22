# Testing the Trip Calendar API

Covers the calendar / timeline view endpoint under `/api/trips`:

| # | Method | Route | Purpose |
|---|---|---|---|
| 1 | GET | `/api/trips/:id/calendar` | Day-wise calendar / timeline view |

Requires a valid bearer token, and the trip must belong to the authenticated
user (requests are scoped to `owner_id`).

---

## 1. Prerequisites

From the `backend/` directory:

```bash
npm install
npx drizzle-kit migrate
node index.js
```

The API is available at `http://localhost:5000`.

> **Note:** the `POST /api/trips/:tripId/stops` endpoint is not implemented yet,
> so the stop and activity rows used below are created directly via SQL. The
> calendar endpoint itself is fully implemented.

---

## 2. Get a token for a real user

```bash
TOKEN=$(curl -s -X POST -H "Content-Type: application/json" \
  -d '{"name":"Calendar Tester","email":"calendartester@example.com","password":"secret123"}' \
  "http://localhost:5000/api/auth/signup" | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>console.log(JSON.parse(d).token))')
echo "$TOKEN"
```

---

## 3. Create a trip

```bash
TRIP=$(curl -s -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Paris Getaway","description":"Three days in Paris","startDate":"2026-07-01","endDate":"2026-07-03","budget":800}' \
  "http://localhost:5000/api/trips")
echo "$TRIP"
export TRIP_ID=$(echo "$TRIP" | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>console.log(JSON.parse(d).id))')
echo "TRIP_ID=$TRIP_ID"
```

---

## 4. Get a city id

```bash
CITY=$(curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:5000/api/cities?q=paris" | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>console.log(JSON.parse(d).data[0].id))')
echo "CITY_ID=$CITY"
```

---

## 5. Create a stop (direct SQL — endpoint not implemented yet)

```bash
psql "$DATABASE_URL" -c "INSERT INTO trip_stops (trip_id, city_id, start_date, end_date, position) \
  VALUES ('$TRIP_ID', '$CITY', '2026-07-01', '2026-07-03', 1) RETURNING id;"
```

Copy the returned `id`:

```bash
export STOP_ID="<the-returned-stop-id>"
```

---

## 6. Add activities (direct SQL — or via the stop activities API)

Two activities on different days so the day-wise layout is visible. Use the
stop activities endpoint if you prefer an API-only flow (see
`STOP_ACTIVITIES_API_TESTING.md`):

```bash
psql "$DATABASE_URL" -c "INSERT INTO planned_activities \
  (trip_stop_id, otm_place_id, name, type, date, start_time, end_time, planned_cost, position, notes) VALUES \
  ('$STOP_ID', 'W1823849028', 'Louvre Museum', 'museum',  '2026-07-01', '10:00', '13:00', 22, 1, 'Book tickets in advance'), \
  ('$STOP_ID', 'W281389531',  'Eiffel Tower',   'sightseeing', '2026-07-02', '14:00', '16:00', 29, 2, 'Book the summit ticket');"
```

---

## 7. Endpoint — Calendar / timeline view (GET)

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:5000/api/trips/$TRIP_ID/calendar" | python3 -m json.tool
```

Response `200`:

```json
{
  "days": [
    {
      "date": "2026-07-01",
      "stopId": "b9e2c2e5-1f8a-4b1d-9c5d-7b2a1e4c6f11",
      "city": {
        "id": "f7846518-2d9e-46b5-b5e9-b0aefc8067ff",
        "name": "Paris",
        "country": "France",
        "region": "Île-de-France",
        "description": "The City of Light, known for its art, fashion and world-famous landmarks.",
        "image": "https://images.unsplash.com/...",
        "costIndex": 130,
        "latitude": 48.8566,
        "longitude": 2.3522
      },
      "items": [
        {
          "id": "7f0ad47d-3c8e-4c8e-9b52-0c92e1b3e3e6",
          "otmPlaceId": "W1823849028",
          "startTime": "10:00",
          "endTime": "13:00",
          "title": "Louvre Museum",
          "cost": 22
        }
      ]
    },
    {
      "date": "2026-07-02",
      "stopId": "b9e2c2e5-1f8a-4b1d-9c5d-7b2a1e4c6f11",
      "city": {
        "id": "f7846518-2d9e-46b5-b5e9-b0aefc8067ff",
        "name": "Paris",
        "country": "France",
        "region": "Île-de-France",
        "description": "The City of Light, known for its art, fashion and world-famous landmarks.",
        "image": "https://images.unsplash.com/...",
        "costIndex": 130,
        "latitude": 48.8566,
        "longitude": 2.3522
      },
      "items": [
        {
          "id": "8a1be58e-4d9f-4d9e-9c5d-8c2b2f5d7c22",
          "otmPlaceId": "W281389531",
          "startTime": "14:00",
          "endTime": "16:00",
          "title": "Eiffel Tower",
          "cost": 29
        }
      ]
    },
    {
      "date": "2026-07-03",
      "stopId": "b9e2c2e5-1f8a-4b1d-9c5d-7b2a1e4c6f11",
      "city": {
        "id": "f7846518-2d9e-46b5-b5e9-b0aefc8067ff",
        "name": "Paris",
        "country": "France",
        "region": "Île-de-France",
        "description": "The City of Light, known for its art, fashion and world-famous landmarks.",
        "image": "https://images.unsplash.com/...",
        "costIndex": 130,
        "latitude": 48.8566,
        "longitude": 2.3522
      },
      "items": []
    }
  ]
}
```

### Notes on the shape

- `days` spans the trip's full range (`startDate` → `endDate` inclusive), even
  days with no activities.
- Each day carries the `stopId` and `city` of the stop covering that date, or
  `null` for a gap day outside any stop.
- `items` are ordered by `startTime` then `position`, and include `id` so they
  can be edited/deleted later.
- `cost` is the snapshotted `planned_cost` (number) or `null` when not set.

---

## 8. Expected error cases

| Scenario | Status | Body |
|---|---|---|
| Missing `Authorization` header | `401` | `{ "message": "Authorization header is required" }` |
| Invalid / expired token | `401` | `{ "message": "Invalid or expired token" }` |
| Trip not found / owned by another user | `404` | `{ "message": "Trip not found" }` |
