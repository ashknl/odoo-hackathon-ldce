# Testing the Trip APIs (View / Edit / Delete)

Covers the three trip endpoints implemented under `/api/trips`:

| # | Method | Route | Purpose |
|---|---|---|---|
| 1 | GET | `/api/trips/:id` | View a single trip |
| 2 | PATCH | `/api/trips/:id` | Edit a trip (partial update) |
| 3 | DELETE | `/api/trips/:id` | Delete a trip |

All require a valid bearer token, and the trip must belong to the authenticated
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

---

## 2. Get a token for a real user

Trip rows reference `users.id`, so the token's `userId` must exist in the DB.
The simplest way is to sign up (creates the user and returns a token):

```bash
TOKEN=$(curl -s -X POST -H "Content-Type: application/json" \
  -d '{"name":"Trip Tester","email":"triptester@example.com","password":"secret123"}' \
  "http://localhost:5000/api/auth/signup" | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>console.log(JSON.parse(d).token))')
echo "$TOKEN"
```

> If you already have a user, generate a token for that user's id instead:
> `node -e 'import jwt from "jsonwebtoken"; console.log(jwt.sign({userId:"<user-id>"},"odoo-hackathon",{expiresIn:"7d"}))'`

---

## 3. Create a trip (to get an `id` to test against)

The view/edit/delete endpoints operate on an existing trip, so create one first:

```bash
TRIP=$(curl -s -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Summer Europe","description":"Two week trip","startDate":"2026-07-01","endDate":"2026-07-14","budget":2400}' \
  "http://localhost:5000/api/trips")

echo "$TRIP"
export TRIP_ID=$(echo "$TRIP" | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>console.log(JSON.parse(d).id))')
echo "TRIP_ID=$TRIP_ID"
```

Response `201` (trip shape):

```json
{
  "id": "1b50f05f-d98b-457c-9c1c-0eecfb5aa896",
  "name": "Summer Europe",
  "description": "Two week trip",
  "startDate": "2026-07-01",
  "endDate": "2026-07-14",
  "budget": 2400,
  "status": "UPCOMING",
  "coverUrl": null,
  "isPublic": false,
  "shareToken": null,
  "ownerId": "6a197a8d-573b-4175-acdd-8cc6694e71f6",
  "stopCount": 0,
  "createdAt": "2026-08-22T08:46:23.054Z"
}
```

---

## 4. Endpoint 1 — View trip

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:5000/api/trips/$TRIP_ID" | python3 -m json.tool
```

Returns `200` with the trip object (same shape as above, with `stopCount`).

---

## 5. Endpoint 2 — Edit trip

`PATCH` accepts any subset of fields. Send **JSON in the body**:

```bash
curl -s -X PATCH -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Summer Europe 2026","budget":3200}' \
  "http://localhost:5000/api/trips/$TRIP_ID" | python3 -m json.tool
```

Updatable fields:

| Field | Type | Notes |
|---|---|---|
| `name` | string | Non-empty |
| `description` | string | `null` clears it |
| `startDate` | string | `YYYY-MM-DD` |
| `endDate` | string | `YYYY-MM-DD` |
| `budget` | number | Decimal |
| `status` | string | `UPCOMING` \| `ONGOING` \| `COMPLETED` |

Response `200` with the updated trip.

### Partial date update

Only the provided dates change; the other is preserved from the DB, and the
range is validated against it:

```bash
curl -s -X PATCH -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"endDate":"2026-07-21"}' \
  "http://localhost:5000/api/trips/$TRIP_ID"
```

---

## 6. Endpoint 3 — Delete trip

```bash
curl -s -o /dev/null -w "HTTP %{http_code}\n" \
  -X DELETE -H "Authorization: Bearer $TOKEN" \
  "http://localhost:5000/api/trips/$TRIP_ID"
```

Returns `204 No Content` (empty body). Stops and activities cascade-delete.

Verify it is gone:

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "http://localhost:5000/api/trips/$TRIP_ID"
```

```json
{ "message": "Trip not found" }
```

---

## 7. Expected error cases

| Scenario | Status | Body |
|---|---|---|
| Missing `Authorization` header | `401` | `{ "message": "Authorization header is required" }` |
| Invalid / expired token | `401` | `{ "message": "Invalid or expired token" }` |
| Trip not found / owned by another user | `404` | `{ "message": "Trip not found" }` |
| `PATCH` with empty body | `400` | `{ "message": "No fields to update" }` |
| `PATCH` with empty `name` | `400` | `{ "message": "name cannot be empty" }` |
| `endDate` before `startDate` | `400` | `{ "message": "endDate cannot be before startDate" }` |
| Invalid `status` value | `400` | `{ "message": "Invalid status" }` |
