# GlobeTrotter — Project Progress & Context Documentation

> **Repository:** `odoo-hackathon-ldce`  
> **Last Updated:** August 22, 2026  
> **Status:** Frontend Migration Complete · Home Dashboard Complete · Signature Blue Theme Applied · Schema & REST API Layer Aligned · Create Trip Screen Complete · Auth Aligned to 7-Column Users Schema  

---

## 📌 1. Project Architecture Overview

GlobeTrotter is an AI-powered multi-city travel planner and itinerary management platform aligned with the **Hackathon Problem Statement**, PostgreSQL schema (`globetrotter_schema.md`), and REST API specifications (`API.md`).

### Tech Stack
- **Frontend (`/frontend`)**: React 19 + Vite 6 + TypeScript + TailwindCSS + Lucide Icons.
- **Backend (`/backend`)**: Node.js / Express + Drizzle ORM / PostgreSQL 15+ + OpenTripMap POI API.
- **Database Schema**: 3NF Normalized schema documented in `backend/globetrotter_schema.md`.
- **REST API Specs**: Fully specified endpoints documented in `API.md`.

---

## 📋 2. Problem Statement Feature Matrix Status

| # | Screen / Feature | Status | Key Implementation File(s) |
|---|---|---|---|
| 1 | **Login / Signup Screen (Screen 1 & 2)** | ✅ Completed & Schema Aligned | `AuthModal.tsx`, `users` table schema (`name`, `email`, `password_hash`, `profile_image`) |
| 2 | **Dashboard / Home Screen** | ✅ Completed | `HomePage.tsx`, `UserProfileSidebar.tsx`, `HomeHeroBanner.tsx`, `TopRegionalSelections.tsx` |
| 3 | **Create Trip Screen (Screen 4 Mockup)** | ✅ Completed | `CreateTripPage.tsx`, `tripsApi.createTrip()`, `stopsApi.addStop()` |
| 4 | **My Trips (Trip List) Screen** | ✅ Completed | `PreviousTripsSection.tsx`, `tripsApi.getTrips()` |
| 5 | **Itinerary Builder Screen** | 🟡 Ready for Integration | `stopsApi`, `activitiesApi` |
| 6 | **Itinerary View Screen** | 🟡 Ready for Integration | `PreviousTripsSection.tsx`, `publicApi` |
| 7 | **City Search** | ✅ Completed | `HomeHeroBanner.tsx`, `citiesApi.getCities()` |
| 8 | **Activity Search** | ✅ Completed | `activitiesApi.searchActivities()` (OpenTripMap) |
| 9 | **Trip Budget & Cost Breakdown** | ✅ Completed | `tripsApi.getBudget()`, `TopRegionalSelections.tsx` |
| 10 | **Trip Calendar / Timeline** | ✅ Completed | `UserProfileSidebar.tsx` ticket timeline |
| 11 | **Shared / Public Itinerary View** | ✅ Completed | `publicApi.getPublicTrip()`, Share Token slugs |
| 12 | **User Profile / Settings** | ✅ Completed | `UserProfileSidebar.tsx`, `usersApi.updateProfile()` |
| 13 | **Admin / Analytics Dashboard (Optional)**| ⚪ Optional | Planned for future scope |

---

## 🚀 3. Completed Milestones & Accomplishments

### Milestone A: Frontend Workspace Setup & Migration
- Migrated frontend codebase from legacy `new-planning` to `odoo-hackathon-ldce/frontend`.
- Configured Vite 6 dev server (`http://localhost:3000/`) with React 19 and TailwindCSS.

### Milestone B: Personalized Home Dashboard Implementation
Built a feature-rich, schema-compliant user dashboard distinct from the landing page:
1. **UserProfileSidebar (`src/components/HomePage/UserProfileSidebar.tsx`)**: User profile, level badge, points & badges, upcoming trip ticket timeline, and exclusive promo coupon.
2. **HomeHeroBanner (`src/components/HomePage/HomeHeroBanner.tsx`)**: Hero background overlay, live search bar dock, **Group By**, **Filter by Region**, and **Sort By (Cost/Rating)** drop-downs.
3. **TopRegionalSelections (`src/components/HomePage/TopRegionalSelections.tsx`)**: Destination cards with ratings, price per day (`cost_index`), and category tabs.
4. **PreviousTripsSection (`src/components/HomePage/PreviousTripsSection.tsx`)**: Trips grid with status filters (*ALL, UPCOMING, ONGOING, COMPLETED*) and public share links.
5. **WidgetsRow (`src/components/HomePage/WidgetsRow.tsx`)**: Wishlist checklist widget and **Friends Trip** collaborators widget (`VIEWER` / `EDITOR`).
6. **PlanTripFab (`src/components/HomePage/PlanTripFab.tsx`)**: Floating Action Button ("+ Plan a trip") at the bottom-right corner with blue glassmorphism glow.
7. **HomePage Container (`src/components/HomePage/HomePage.tsx`)**: Main dashboard orchestrator.

### Milestone C: Signature Blue Theme Migration
- Standardized all styling around GlobeTrotter's signature blue palette (`#0284c7`, `sky`, `blue`).
- Updated `Navbar.tsx` with view switches (`Home Dashboard` vs `+ Plan New Trip` vs `Landing Page`).

### Milestone D: Schema & REST API Integration Alignment
- **`src/types/schema.ts`**: Single source of truth for PostgreSQL tables (`users`, `trips`, `cities`, `trip_stops`, `planned_activities`, `trip_expenses`, `saved_destinations`, `trip_collaborators`) and API payload aliases.
- **`src/services/api.ts`**: Unified REST API client implementing all `/api/auth/*`, `/api/users/*`, `/api/trips/*`, `/api/cities/*`, `/api/activities/*`, `/api/public/*` endpoints with automated JWT Bearer token handling.

### Milestone E: Create New Trip Screen (Screen 4 Excalidraw Mockup)
- Built `src/components/CreateTripPage.tsx` adhering to the user's Excalidraw mockup:
  - **Form Section ("Plan a new trip")**: Trip Name, Select Primary Destination, Start Date, End Date, Estimated Budget (₹), Description, and Cover Photo preset selector.
  - **Suggestions Section ("Suggestions for Places to Visit / Activities to perform")**: Interactive grid of 6 destination/activity cards with ratings, price per day, and "+ Add to Trip" toggles.
  - **API Contract**: Invokes `tripsApi.createTrip(...)` and `stopsApi.addStop(...)`, saves trip to state, shows toast feedback, and redirects to dashboard.

### Milestone F: Strict `users` Database Table Schema Alignment for Auth
Refactored `AuthModal.tsx` to strictly conform to the 7 columns in the `users` database table (`backend/globetrotter_schema.md`):

| Column | Type | Notes | Form Input Mapping |
|---|---|---|---|
| `id` | UUID PK | Primary Key | Generated by backend API |
| `name` | VARCHAR | User's full name | `Full Name` field on Sign Up |
| `email` | VARCHAR UNIQUE | Login credential | `Email Address` field on Sign In & Sign Up |
| `password_hash` | VARCHAR | Password credential | `Password` field on Sign In & Sign Up |
| `profile_image` | TEXT | Photo URL | `Profile Image` avatar picker / upload |
| `created_at` | TIMESTAMP | Auto timestamp | Managed by PostgreSQL |
| `updated_at` | TIMESTAMP | Auto timestamp | Managed by PostgreSQL |

- Removed non-schema fields (`phone`, `city`, `country`, `additionalInfo`).
- Automated bearer token management (`localStorage.setItem('globetrotter_token', token)`).
- Real validation error reporting for invalid credentials or duplicate registration attempts.

---

## 📡 4. Authentication API Endpoint Specifications

### 1. Account Signup — `POST /api/auth/signup`
- **Request Body**:
  ```json
  {
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "password": "GlobeTrotterPassword2026!"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Ada Lovelace",
      "email": "ada@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### 2. Account Login — `POST /api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "ada@example.com",
    "password": "GlobeTrotterPassword2026!"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Ada Lovelace",
      "email": "ada@example.com",
      "profile_image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### 3. Forgot Password — `POST /api/auth/forgot-password`
- **Request Body**:
  ```json
  {
    "email": "ada@example.com"
  }
  ```
- **Response (204 No Content)**: Returns empty response to prevent account enumeration.

---

## 📁 5. Core File Structure Map

```
odoo-hackathon-ldce/
├── API.md                              # REST API specifications
├── progress.md                         # Project progress & resume guide (THIS FILE)
├── backend/
│   ├── globetrotter_schema.md          # PostgreSQL 3NF database schema reference
│   ├── index.js                        # Express server entry point
│   ├── drizzle.config.js               # Drizzle ORM configuration
│   ├── db/
│   │   ├── connection.js               # DB connection pooling
│   │   └── schema/                     # Drizzle table schemas
│   ├── controllers/
│   │   └── auth.controller.js          # Auth endpoints controller
│   ├── middlewares/
│   │   └── auth.middleware.js          # JWT authentication middleware
│   ├── routes/
│   │   └── auth.routes.js              # Auth routes (/api/auth)
│   ├── services/
│   │   └── auth.service.js             # Auth business logic
│   └── utils/
│       ├── jwt.js                      # Token signing & verification
│       └── password.js                 # Password hashing
└── frontend/
    ├── package.json
    ├── vite.config.ts
    └── src/
        ├── App.tsx                     # Main app root & activeView switcher
        ├── types/
        │   ├── schema.ts               # Core DB & REST API schema types
        │   └── travel.ts               # UI card & package models
        ├── services/
        │   └── api.ts                  # REST API client helper for backend endpoints
        ├── data/
        │   └── homeData.ts             # Schema-compliant mock datasets
        └── components/
            ├── Navbar.tsx              # Navigation bar with view switcher
            ├── AuthModal.tsx           # Sign In & Sign Up modal strictly aligned to users table
            ├── CreateTripPage.tsx      # Create Trip screen (Screen 4 Excalidraw mockup)
            ├── HomePage/
            │   ├── HomePage.tsx        # Home Dashboard container
            │   ├── UserProfileSidebar.tsx # User profile & upcoming ticket
            │   ├── HomeHeroBanner.tsx  # Hero image & search/filter dock
            │   ├── TopRegionalSelections.tsx # Destination cards & category tabs
            │   ├── PreviousTripsSection.tsx  # Travel history & status badges
            │   ├── WidgetsRow.tsx      # Wishlist & Friends trip co-planners
            │   └── PlanTripFab.tsx     # Floating "+ Plan a trip" FAB
            ├── PopularPlaces.tsx       # Landing page popular places grid
            ├── ExploreMore.tsx         # Landing page exploration grid
            └── PlaceDetailModal.tsx    # Destination detail modal
```

---

## 🏃 6. How to Run the Application

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
- App runs locally at: `http://localhost:3000/`

### Production Build Test
```bash
cd frontend
npm run build
```

---

## 🔮 7. Next Steps for Future Development

1. **Backend Auth Controller Integration**:
   - Verify JWT secret key and password hashing (`bcrypt`) in `backend/controllers/auth.controller.js`.
2. **Itinerary Builder Drag & Drop UI**:
   - Build a visual day-wise calendar timeline for adding activities to trip stops.

---
*Created automatically for project state tracking.*
