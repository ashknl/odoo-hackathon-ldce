/**
 * GlobeTrotter PostgreSQL Schema & REST API TypeScript Definitions
 * Aligned strictly with `backend/globetrotter_schema.md` & `API.md`
 */

// 1. Core Users Model (table: `users`)
// Schema columns: id, name, email, password_hash, profile_image, created_at, updated_at
export interface User {
  // --- `users` table columns ---
  id: string;             // UUID PK
  name: string;           // VARCHAR
  email: string;          // VARCHAR UNIQUE (login)
  password_hash?: string; // VARCHAR (never sent to client)
  profile_image?: string; // TEXT — DB column name
  created_at?: string;    // TIMESTAMP
  updated_at?: string;    // TIMESTAMP

  // --- REST API camelCase aliases (same data, different key) ---
  avatarUrl?: string;     // alias for profile_image in API responses
  createdAt?: string;
  updatedAt?: string;

  // --- UI-only computed fields (not stored in DB) ---
  level?: string;         // Derived traveler tier for display
  points?: number;        // Gamification points (UI only)
  badges?: number;        // Badge count (UI only)
}

// Auth API Session & Token shapes
export interface AuthUserResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface SignUpCredentials {
  name: string;
  email: string;
  password?: string;
}

// 2. Global Cities Catalog Model (table: `cities`)
// Schema columns: id, name, country, region, description, image, cost_index, latitude, longitude
export interface City {
  // --- `cities` table columns ---
  id: string;          // UUID PK
  name: string;        // VARCHAR — e.g. "Paris"
  country: string;     // VARCHAR — e.g. "France"
  region: string;      // VARCHAR — for filtering
  description: string; // TEXT
  image: string;       // TEXT — city image URL
  cost_index: number;  // DECIMAL — for cost ranking
  latitude: number;    // DECIMAL
  longitude: number;   // DECIMAL

  // --- REST API camelCase alias ---
  costIndex?: number;  // alias for cost_index in API responses

  // --- UI-only derived/extra fields ---
  rating?: number;     // Derived metric (not in DB; from reviews/external)
  tags?: string[];     // UI filter tags (not a DB column)
}

// 3. Trips Model (table: `trips`)
// Schema columns: id, user_id, name, description, cover_image, start_date, end_date,
//                 budget, status, is_public, share_slug, created_at, updated_at
export type TripStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED';

export interface Trip {
  // --- `trips` table columns ---
  id: string;           // UUID PK
  user_id: string;      // UUID FK → users.id
  name: string;
  description: string;
  cover_image: string;  // TEXT — DB column name
  start_date: string;   // DATE (YYYY-MM-DD)
  end_date: string;     // DATE (YYYY-MM-DD)
  budget: number;       // DECIMAL
  status: TripStatus;   // ENUM: UPCOMING | ONGOING | COMPLETED
  is_public: boolean;   // BOOLEAN
  share_slug: string;   // VARCHAR UNIQUE — public share URL
  created_at?: string;  // TIMESTAMP
  updated_at?: string;  // TIMESTAMP

  // --- REST API camelCase aliases ---
  ownerId?: string;     // alias for user_id
  coverUrl?: string;    // alias for cover_image
  startDate?: string;   // alias for start_date
  endDate?: string;     // alias for end_date
  isPublic?: boolean;   // alias for is_public
  shareToken?: string;  // alias for share_slug
  createdAt?: string;
  updatedAt?: string;

  // --- Joined / UI fields ---
  stop_count?: number;  // Derived count
  stopCount?: number;
  stops?: TripStop[];   // Joined trip_stops rows
  expenses?: TripExpense[];
}

// 4. Trip Stops Model (table: `trip_stops`)
export interface TripStop {
  id: string; // UUID PK
  trip_id: string; // UUID FK -> trips.id
  tripId?: string;
  city_id: string; // UUID FK -> cities.id
  cityId?: string;
  city?: City; // Joined city object
  start_date: string; // DATE (YYYY-MM-DD)
  startDate?: string;
  end_date: string; // DATE (YYYY-MM-DD)
  endDate?: string;
  position: number; // INT (ordering within trip)
  budget?: number; // DECIMAL (per-stop budget)
  notes?: string; // TEXT
  activities?: PlannedActivity[];
}

// 5. Planned Activities Model (table: `planned_activities` - OpenTripMap snapshotted)
export interface PlannedActivity {
  id: string; // UUID PK
  trip_stop_id: string; // UUID FK -> trip_stops.id
  tripStopId?: string;
  otm_place_id?: string; // VARCHAR (soft ref to OpenTripMap POI)
  otmPlaceId?: string;
  name: string; // snapshotted place name
  type: string; // snapshotted category (e.g. museum, hiking, nature)
  image?: string; // snapshotted preview URL
  latitude?: number;
  longitude?: number;
  date: string; // DATE (YYYY-MM-DD)
  start_time?: string; // TIME (HH:MM)
  startTime?: string;
  end_time?: string; // TIME (HH:MM)
  endTime?: string;
  planned_cost?: number; // DECIMAL
  plannedCost?: number;
  position?: number; // order within day
  notes?: string;
}

// OpenTripMap POI Proxy Item (for live API search)
export interface OpenTripMapPOI {
  otmPlaceId: string; // xid
  name: string;
  kinds: string;
  previewUrl?: string;
  wikipediaExtract?: string;
  otmUrl?: string;
  latitude?: number;
  longitude?: number;
  plannedCost?: number;
}

// 6. Trip Expenses Model (table: `trip_expenses`)
export type ExpenseCategory = 'TRANSPORT' | 'STAY' | 'ACTIVITY' | 'MEAL' | 'OTHER';

export interface TripExpense {
  id: string; // UUID PK
  trip_id: string; // UUID FK -> trips.id
  tripId?: string;
  trip_stop_id?: string | null; // UUID FK -> trip_stops.id (nullable)
  tripStopId?: string | null;
  category: ExpenseCategory; // ENUM
  amount: number; // DECIMAL
  description: string;
  expense_date: string; // DATE
  expenseDate?: string;
  created_at?: string;
  createdAt?: string;
}

export interface BudgetBreakdownResponse {
  total: number;
  currency: string;
  perDayAverage: number;
  breakdown: {
    transport: number;
    stay: number;
    activities: number;
    meals: number;
    other?: number;
  };
  overBudgetDays?: Array<{ date: string; spent: number; budget: number }>;
}

// 7. Saved Destinations Model (table: `saved_destinations`)
export interface SavedDestination {
  id: string; // UUID PK
  user_id: string; // UUID FK -> users.id
  userId?: string;
  city_id: string; // UUID FK -> cities.id
  cityId?: string;
  city?: City;
  created_at?: string;
  createdAt?: string;
}

// 8. Trip Collaborators Model (table: `trip_collaborators`)
export type CollaboratorRole = 'VIEWER' | 'EDITOR';

export interface TripCollaborator {
  id: string; // UUID PK
  trip_id: string; // UUID FK -> trips.id
  tripId?: string;
  user_id: string; // UUID FK -> users.id
  userId?: string;
  user?: User;
  role: CollaboratorRole; // ENUM
  created_at?: string;
  createdAt?: string;
}

// Widget Items
export interface YearlyWishlistItem {
  id: string;
  title: string;
  completed: boolean;
}
