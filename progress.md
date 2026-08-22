# GlobeTrotter — Project Progress & Context Documentation

> **Repository:** `odoo-hackathon-ldce`  
> **Last Updated:** August 22, 2026  
> **Status:** Environment Variables Configured · Authentication API Integrated · Schema Aligned · Signature Blue Theme · Create Trip Complete · Home Dashboard Complete  

---

## 📌 1. Environment Variable & API Base URL Configuration

All frontend API interactions derive their base URL from environment variables for deployment flexibility:

- **`.env`**:
  ```env
  VITE_API_BASE_URL=http://localhost:5000/api
  ```
- **`.env.example`**: Included in repo for deployment guidance.
- **`src/services/api.ts`**:
  ```ts
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
  ```
- **`src/vite-env.d.ts`**: TypeScript definitions for `VITE_API_BASE_URL`.

---

## 📋 2. Problem Statement Feature Matrix Status

| # | Screen / Feature | Status | Key Implementation File(s) |
|---|---|---|---|
| 1 | **Login / Signup Screen (Screen 1 & 2)** | ✅ Backend API Integrated | `AuthModal.tsx`, `authApi` (`/api/auth/signup`, `/api/auth/login`) |
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

---

## 🏃 3. How to Change API Base URL on Deployment

For production deployments (e.g. Vercel, Netlify, Render), set the environment variable:
```bash
VITE_API_BASE_URL=https://your-production-backend-domain.com/api
```
All API calls in `src/services/api.ts` will automatically route to the configured URL.
