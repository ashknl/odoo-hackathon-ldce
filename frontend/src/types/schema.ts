/**
 * GlobeTrotter PostgreSQL Schema Data Models
 * Matching globetrotter_schema.md
 */

export type TripStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED';

export type ExpenseCategory = 'TRANSPORT' | 'STAY' | 'ACTIVITY' | 'MEAL' | 'OTHER';

export type CollaboratorRole = 'VIEWER' | 'EDITOR';

export interface User {
  id: string; // UUID
  name: string;
  email: string;
  profile_image: string;
  level?: string; // e.g. "Beginner Explorer"
  badges?: number; // e.g. 3
  points?: number; // e.g. 85
  created_at?: string;
  updated_at?: string;
}

export interface City {
  id: string; // UUID
  name: string;
  country: string;
  region: string; // e.g. "South Asia", "Kerala", "Europe"
  description: string;
  image: string;
  cost_index: number; // Decimal cost rating / avg daily budget
  latitude: number;
  longitude: number;
  rating?: number; // e.g. 4.7
  reviewCount?: number;
  tags?: string[]; // e.g. ["Romantic", "Adventurous", "Road-trip"]
}

export interface Trip {
  id: string; // UUID
  user_id: string; // UUID FK -> users.id
  name: string;
  description: string;
  cover_image: string;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  budget: number;
  status: TripStatus;
  is_public: boolean;
  share_slug: string;
  created_at?: string;
  updated_at?: string;
  stops?: TripStop[];
}

export interface TripStop {
  id: string; // UUID
  trip_id: string; // UUID FK -> trips.id
  city_id: string; // UUID FK -> cities.id
  start_date: string;
  end_date: string;
  position: number;
  budget: number;
  notes?: string;
  city?: City;
  planned_activities?: PlannedActivity[];
}

export interface PlannedActivity {
  id: string; // UUID
  trip_stop_id: string; // FK -> trip_stops.id
  otm_place_id?: string; // OpenTripMap place ID
  name: string;
  type: string; // e.g. "museum", "hiking", "boat_tour"
  image: string;
  latitude: number;
  longitude: number;
  date: string;
  start_time: string;
  end_time: string;
  planned_cost: number;
  position: number;
  notes?: string;
}

export interface TripExpense {
  id: string; // UUID
  trip_id: string;
  trip_stop_id?: string | null;
  category: ExpenseCategory;
  amount: number;
  description: string;
  expense_date: string;
  created_at?: string;
}

export interface SavedDestination {
  id: string; // UUID
  user_id: string;
  city_id: string;
  created_at: string;
  city?: City;
}

export interface TripCollaborator {
  id: string;
  trip_id: string;
  user_id: string;
  role: CollaboratorRole;
  user?: User;
}

export interface YearlyWishlistItem {
  id: string;
  title: string;
  completed: boolean;
}
