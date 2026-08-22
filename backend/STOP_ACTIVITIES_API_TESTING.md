# Testing the Stop Activities APIs

Covers the three activities endpoints nested under a trip stop:

| # | Method | Route | Purpose |
|---|---|---|---|
| 1 | GET | `/api/trips/:tripId/stops/:stopId/activities` | List activities on a stop |
| 2 | POST | `/api/trips/:tripId/stops/:stopId/activities` | Add an activity to a stop (marks it as planned) |
| 3 | DELETE | `/api/trips/:tripId/stops/:stopId/activities/:id` | Remove an activity from a stop |

All require a valid bearer token. Requests are scoped to the authenticated
user: the trip must belong to the token's user, the stop must belong to the
trip, and the activity must belong to the stop — otherwise `404` is returned.

---

## 1. Prerequisites

From the `backend/` directory:

```bash
npm install
npx drizzle-kit migrate
node index.js
```

The API is available at `http://localhost:5000`.

> **Note on stops:** the `POST /api/trips/:tripId/stops` endpoint is not
> implemented yet, so the steps below create the stop row directly via SQL.
> You need one `trip_stops` row before you can attach activities to it.

---

## 2. Get a token for a real user

```bash
TOKEN=$(curl -s -X POST -H "Content-Type: application/json" \
  -d '{"name":"Activity Tester","email":"activitytester@example.com","password":"secret123"}' \
  "http://localhost:5000/api/auth/signup" | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>console.log(JSON.parse(d).token))')
echo "$TOKEN"
```

---

## 3. Create a trip

```bash
TRIP=$(curl -s -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Paris Getaway","startDate":"2026-07-01","endDate":"2026-07-03","budget":800}' \
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

Use `psql` with the same connection string as `.env`:

```bash
psql "$DATABASE_URL" -c "INSERT INTO trip_stops (trip_id, city_id, start_date, end_date, position) \
  VALUES ('$TRIP_ID', '$CITY', '2026-07-01', '2026-07-03', 1) RETURNING id;"
```

Copy the returned `id`:

```bash
export STOP_ID="<the-returned-stop-id>"
```

---

## 6. Test data — ready-to-send POST bodies

Paste any of these `-d` payloads into the `curl` in [section 7](#7-endpoint-1--add-an-activity-post).
They cover different `type` values and fall within the stop's date range
(`2026-07-01` → `2026-07-03`).

```json
{
  "otmPlaceId": "W1823849028",
  "name": "Louvre Museum",
  "type": "museum",
  "date": "2026-07-02",
  "startTime": "10:00",
  "endTime": "13:00",
  "plannedCost": 22,
  "note": "Book tickets in advance"
}
```

```json
{
  "otmPlaceId": "W281389531",
  "name": "Eiffel Tower",
  "type": "sightseeing",
  "date": "2026-07-02",
  "startTime": "14:00",
  "endTime": "16:00",
  "plannedCost": 29,
  "note": "Book the summit ticket"
}
```

```json
{
  "otmPlaceId": "W436892051",
  "name": "Le Marais Food Tour",
  "type": "food",
  "date": "2026-07-02",
  "startTime": "12:30",
  "endTime": "14:30",
  "plannedCost": 45
}
```

```json
{
  "otmPlaceId": "W1178991112",
  "name": "Jardin du Luxembourg",
  "type": "nature",
  "date": "2026-07-03",
  "startTime": "09:00",
  "endTime": "11:00",
  "plannedCost": 0,
  "note": "Free entry, bring a picnic"
}
```

```json
{
  "otmPlaceId": "W382601532",
  "name": "Seine River Cruise",
  "type": "entertainment",
  "date": "2026-07-03",
  "startTime": "18:00",
  "endTime": "19:30",
  "plannedCost": 18,
  "note": "Board at Pont Neuf"
}
```

---

## 7. Endpoint 1 — Add an activity (POST)

The client snapshots the OpenTripMap place fields at save time. Sending this
request is what marks the activity as planned for the trip.

```bash
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{
    "otmPlaceId": "W1823849028",
    "name": "Louvre Museum",
    "type": "museum",
    "date": "2026-07-02",
    "startTime": "10:00",
    "endTime": "13:00",
    "plannedCost": 22,
    "note": "Book tickets in advance"
  }' \
  "http://localhost:5000/api/trips/$TRIP_ID/stops/$STOP_ID/activities" | python3 -m json.tool
```

Body fields:

| Field | Type | Notes |
|---|---|---|
| `name` | string | **Required** — snapshotted from OpenTripMap |
| `date` | string | **Required** — `YYYY-MM-DD` |
| `otmPlaceId` | string | Soft reference to the OpenTripMap place |
| `type` | string | Snapshotted category (`museum`, `hiking`, …) |
| `startTime` | string | `HH:MM` |
| `endTime` | string | `HH:MM` |
| `plannedCost` | number | Snapshotted cost at planning time |
| `note` | string | User note (stored in the `notes` column) |

Response `201` (planned activity):

```json
{
  "id": "7f0ad47d-3c8e-4c8e-9b52-0c92e1b3e3e6",
  "tripStopId": "b9e2c2e5-1f8a-4b1d-9c5d-7b2a1e4c6f11",
  "otmPlaceId": "W1823849028",
  "name": "Louvre Museum",
  "type": "museum",
  "image": null,
  "latitude": null,
  "longitude": null,
  "date": "2026-07-02",
  "startTime": "10:00",
  "endTime": "13:00",
  "plannedCost": 22,
  "position": 1,
  "notes": "Book tickets in advance"
}
```

`position` is auto-assigned within the stop (increments with each activity
added). `note` is echoed back as `notes`.

---

## 8. Endpoint 2 — List activities on a stop (GET)

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:5000/api/trips/$TRIP_ID/stops/$STOP_ID/activities" | python3 -m json.tool
```

Response `200` (array, ordered by `date` then `position`):

```json
[
  {
    "id": "7f0ad47d-3c8e-4c8e-9b52-0c92e1b3e3e6",
    "tripStopId": "b9e2c2e5-1f8a-4b1d-9c5d-7b2a1e4c6f11",
    "otmPlaceId": "W1823849028",
    "name": "Louvre Museum",
    "type": "museum",
    "image": null,
    "latitude": null,
    "longitude": null,
    "date": "2026-07-02",
    "startTime": "10:00",
    "endTime": "13:00",
    "plannedCost": 22,
    "position": 1,
    "notes": "Book tickets in advance"
  }
]
```

---

## 9. Endpoint 3 — Remove an activity (DELETE)

Grab the activity `id` from the POST or GET response, then:

```bash
curl -s -o /dev/null -w "HTTP %{http_code}\n" \
  -X DELETE -H "Authorization: Bearer $TOKEN" \
  "http://localhost:5000/api/trips/$TRIP_ID/stops/$STOP_ID/activities/$ACTIVITY_ID"
```

Returns `204 No Content` (empty body).

Verify it is gone:

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:5000/api/trips/$TRIP_ID/stops/$STOP_ID/activities"
```

```json
[]
```

---

## 10. Expected error cases

| Scenario | Status | Body |
|---|---|---|
| Missing `Authorization` header | `401` | `{ "message": "Authorization header is required" }` |
| Invalid / expired token | `401` | `{ "message": "Invalid or expired token" }` |
| Stop not found / not owned | `404` | `{ "message": "Stop not found" }` |
| `POST` without `name` or `date` | `400` | `{ "message": "name and date are required" }` |
| `DELETE` unknown activity id | `404` | `{ "message": "Activity not found" }` |
| `DELETE` activity under a different stop | `404` | `{ "message": "Activity not found" }` |
