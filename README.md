# GlobeTrotter

### *Empowering Personalized Travel Planning*

GlobeTrotter is a personalized, intelligent travel planning platform that lets users dream, design, and organize multi-city trips with ease. Built for the Odoo Hackathon 2026.

---

## Vision

To transform the way people plan and experience travel — empowering users to explore global destinations, visualize journeys through structured itineraries, make cost-effective decisions, and share their travel plans within a community.

## Mission

Build a user-centric, responsive application that simplifies planning multi-city travel with intuitive tools to:

- Add and manage travel stops and durations
- Explore cities and activities of interest
- Estimate trip budgets automatically
- Visualize timelines and plans
- Share trip plans with others

## Problem Statement

A complete travel planning application where users can:

- Create customized multi-city itineraries
- Assign travel dates, activities, and budgets
- Discover activities and destinations through search
- Receive cost breakdowns and visual calendars
- Share their plans publicly or with friends

## Features

1. **Login / Signup** — authenticate to manage personal travel plans
2. **Dashboard / Home** — upcoming trips, popular cities, quick actions
3. **Create Trip** — name, dates, description, cover photo
4. **My Trips** — list, view, edit, and delete trips
5. **Itinerary Builder** — add cities, dates, and activities per stop
6. **Itinerary View** — day-wise layout, timeline / list toggle
7. **City Search** — find cities by country, region, and cost index
8. **Activity Search** — browse experiences by type, cost, and duration (OpenTripMap)
9. **Budget & Cost Breakdown** — estimates by transport, stay, activities, meals
10. **Trip Calendar / Timeline** — visual day-by-day plan
11. **Shared / Public Itinerary** — read-only shareable trips
12. **User Profile / Settings** — profile, preferences, saved destinations
13. **Admin / Analytics Dashboard** *(optional)*

## Tech Stack

- **Frontend** (`/frontend`): React 19 + Vite + TypeScript + TailwindCSS
- **Backend** (`/backend`): Node.js + Express + Drizzle ORM + JWT auth
- **Database**: Supabase (PostgreSQL)
- **External API**: OpenTripMap for POI / activity discovery

## Getting Started

### Backend

```bash
cd backend
npm install
node index.js            # runs on http://localhost:5000
```

Requires a `backend/.env` with:

```
DATABASE_URL=<supabase-postgres-connection-string>
JWT_SECRET=<your-secret>
OPENTRIPMAP_API_KEY=<opentripmap-api-key>
PORT=5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Docs

- `DESCRIPTION.md` — full problem statement and feature breakdown
- `API.md` — REST API specification
- `backend/globetrotter_schema.md` — PostgreSQL schema
- `Hackathon-api-requests/` — Bruno API test collection

## Mockup

[View Excalidraw Mockup](https://link.excalidraw.com/l/65VNwvy7c4X/6CzbTgEeSr1)
