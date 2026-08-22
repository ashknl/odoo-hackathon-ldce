# GlobeTrotter — Missing APIs Analysis Report

> **Repository:** `odoo-hackathon-ldce`  
> **Target:** Make GlobeTrotter 100% Fully Functional  
> **Reference Specs:** `API.md`, `globetrotter_schema.md`, Frontend Components, and Problem Statement Requirements  

---

## 📌 Executive Summary

Comparing all 11 Frontend Pages (`HomePage`, `CreateTripPage`, `ItineraryBuilderPage`, `UserTripListingPage`, `UserProfilePage`, `SearchDiscoveryPage`, `ItineraryViewBudgetPage`, `CommunityTabPage`, `CalendarViewPage`, `Navbar` Wishlist/Bookings) against `API.md`, the core CRUD operations for Trips, Stops, and OpenTripMap Activity Proxies are well defined. 

However, to ensure **100% full functionality** without falling back on client-side mocks, the following missing API endpoints must be implemented.

---

## 📋 Missing APIs List by Frontend Page Name & Feature

### 1. Community Tab Page (Screen 10)
> **Frontend Page / File:** `CommunityTabPage.tsx`  
> **Gap:** `API.md` currently has **no endpoints** for user community posts, experience sharing, likes, or comments.

* **`GET /api/community/posts`**
  * **Page Name:** Community Tab Page (`CommunityTabPage.tsx`)
  * **Purpose:** Fetch community experience posts with pagination and live filtering.
  * **Query Parameters:** `?q=Manali&category=Activity Highlight&groupBy=activities&sortBy=likes&limit=20&offset=0`
  * **Response `200`:**
    ```json
    {
      "posts": [
        {
          "id": "post-101",
          "authorName": "Aarav Sharma",
          "authorAvatar": "https://...",
          "authorBadge": "Globetrotter Pro",
          "title": "Hidden Gem: Sunset Paragliding in Manali",
          "location": "Manali, Himachal Pradesh",
          "category": "Activity Highlight",
          "rating": 4.9,
          "cost": 3200,
          "content": "Trekking up Solang Valley for sunset paragliding...",
          "image": "https://...",
          "likes": 42,
          "commentsCount": 9,
          "createdAt": "2026-08-22T12:00:00Z"
        }
      ]
    }
    ```
* **`POST /api/community/posts`** 🔒
  * **Page Name:** Community Tab Page (`CommunityTabPage.tsx`) — *Share Your Experience Modal*
  * **Purpose:** Publish a new trip or activity experience to the community.
  * **Request Body:**
    ```json
    {
      "title": "3-Day Backpacker Itinerary to Paris",
      "location": "Paris, France",
      "category": "Trip Experience",
      "rating": 5,
      "cost": 24500,
      "content": "Explored the Louvre and Eiffel Tower gardens..."
    }
    ```
  * **Response `201`:** Created post object.
* **`POST /api/community/posts/:id/like`** 🔒
  * **Page Name:** Community Tab Page (`CommunityTabPage.tsx`)
  * **Purpose:** Toggle like on a community post.
  * **Response `200`:** `{ "likes": 43, "isLiked": true }`
* **`POST /api/community/posts/:id/comments`** 🔒
  * **Page Name:** Community Tab Page (`CommunityTabPage.tsx`)
  * **Purpose:** Add a comment to a community post.
  * **Request Body:** `{ "text": "Great tip on the Metro pass!" }`

---

### 2. Calendar View Screen (Screen 11)
> **Frontend Page / File:** `CalendarViewPage.tsx`  
> **Gap:** `GET /api/trips/:id/calendar` only fetches single-trip calendar view. Needs a cross-trip calendar overview and drag-to-reorder timing persistence.

* **`GET /api/trips/calendar/overview`** 🔒
  * **Page Name:** Calendar View Screen (`CalendarViewPage.tsx`)
  * **Purpose:** Fetch calendar event bands for all user trips spanning a month or date range.
  * **Query Parameters:** `?startMonth=2026-09-01&endMonth=2026-09-30`
* **`PATCH /api/trips/:tripId/stops/:stopId/activities/reorder`** 🔒
  * **Page Name:** Calendar View Screen (`CalendarViewPage.tsx`) — *Expandable Day Drawer*
  * **Purpose:** Save reordered daily activity timeline sequence when dragging/moving activities up or down on the calendar drawer.
  * **Request Body:**
    ```json
    {
      "orderedActivityIds": ["act-101", "act-103", "act-102"]
    }
    ```

---

### 3. Header Navbar & Wishlist Drawer
> **Frontend Page / File:** `Navbar.tsx`, `HomePage.tsx`, `SearchDiscoveryPage.tsx`  
> **Gap:** `API.md` includes `saved-destinations` for cities, but lacks generic wishlist endpoints for POIs and activity bookmarks.

* **`GET /api/users/me/wishlist`** 🔒
  * **Page Name:** Navigation Bar & Wishlist Drawer (`Navbar.tsx`)
  * **Purpose:** Retrieve user's bookmarked activities and destinations across devices.
* **`POST /api/users/me/wishlist`** 🔒
  * **Page Name:** Search & Discovery Page (`SearchDiscoveryPage.tsx`) & Home Dashboard (`HomePage.tsx`)
  * **Purpose:** Bookmark an activity or city.
  * **Request Body:** `{ "itemType": "activity" | "city", "itemId": "W1823849028", "title": "Louvre Museum" }`
* **`DELETE /api/users/me/wishlist/:id`** 🔒
  * **Page Name:** Navigation Bar & Wishlist Drawer (`Navbar.tsx`)
  * **Purpose:** Remove item from user's wishlist.

---

### 4. Header Navbar & Bookings Modal
> **Frontend Page / File:** `Navbar.tsx`  
> **Gap:** Missing endpoints to fetch or record user flight/hotel/activity bookings.

* **`GET /api/bookings/my-bookings`** 🔒
  * **Page Name:** Navigation Bar & Bookings Modal (`Navbar.tsx`)
  * **Purpose:** Retrieve list of user's confirmed bookings and reservations.
* **`POST /api/bookings`** 🔒
  * **Page Name:** Search Discovery Page (`SearchDiscoveryPage.tsx`) & Itinerary Budget Page (`ItineraryViewBudgetPage.tsx`)
  * **Purpose:** Record a booking reservation or affiliate redirect record.
  * **Request Body:**
    ```json
    {
      "tripId": "550e8400-e29b-41d4-a716-446655440000",
      "type": "STAY" | "FLIGHT" | "ACTIVITY",
      "vendorName": "Booking.com",
      "amount": 12000
    }
    ```

---

### 5. Itinerary Builder Screen (Screen 5)
> **Frontend Page / File:** `ItineraryBuilderPage.tsx`  
> **Gap:** `API.md` has single activity `PATCH`, but lacks bulk position reordering.

* **`PATCH /api/trips/:tripId/stops/:stopId/activities/positions`** 🔒
  * **Page Name:** Itinerary Builder Screen (`ItineraryBuilderPage.tsx`)
  * **Purpose:** Batch update `position` and `date` when activities are moved between days or drag-reordered.
  * **Request Body:**
    ```json
    {
      "activities": [
        { "id": "act-1", "position": 1, "date": "2026-09-10" },
        { "id": "act-2", "position": 2, "date": "2026-09-10" }
      ]
    }
    ```

---

## 📊 Summary Table of Missing Endpoints with Page Names

| # | Frontend Page Name | Component File | Missing Endpoint | Method | Auth | Purpose |
|---|---|---|---|---|---|---|
| 1 | **Community Tab Screen (Screen 10)** | `CommunityTabPage.tsx` | `/api/community/posts` | `GET` | — | Fetch community posts (filtered/paginated) |
| 2 | **Community Tab Screen (Screen 10)** | `CommunityTabPage.tsx` | `/api/community/posts` | `POST` | 🔒 | Share a new trip/activity experience |
| 3 | **Community Tab Screen (Screen 10)** | `CommunityTabPage.tsx` | `/api/community/posts/:id/like` | `POST` | 🔒 | Toggle post like |
| 4 | **Community Tab Screen (Screen 10)** | `CommunityTabPage.tsx` | `/api/community/posts/:id/comments` | `POST` | 🔒 | Add post comment |
| 5 | **Calendar View Screen (Screen 11)** | `CalendarViewPage.tsx` | `/api/trips/calendar/overview` | `GET` | 🔒 | Fetch month calendar bands for all user trips |
| 6 | **Calendar View Screen (Screen 11)** | `CalendarViewPage.tsx` | `/api/trips/:tripId/stops/:stopId/activities/reorder` | `PATCH` | 🔒 | Save reordered daily schedule |
| 7 | **Header Navbar & Wishlist** | `Navbar.tsx` | `/api/users/me/wishlist` | `GET` / `POST` / `DELETE` | 🔒 | Bookmarked POIs & destinations |
| 8 | **Header Navbar & Bookings** | `Navbar.tsx` | `/api/bookings/my-bookings` | `GET` / `POST` | 🔒 | Manage user flight/hotel/activity bookings |
| 9 | **Itinerary Builder (Screen 5)** | `ItineraryBuilderPage.tsx` | `/api/trips/:tripId/stops/:stopId/activities/positions` | `PATCH` | 🔒 | Batch update activity positions/dates |
