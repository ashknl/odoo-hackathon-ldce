/**
 * GlobeTrotter Travel Interface Models
 * Aligned with `globetrotter_schema.md` & `API.md`
 */

import { City, Trip, TripStop, PlannedActivity, TripExpense } from './schema';

export type CostIndex = 'Budget' | 'Moderate' | 'High' | 'Luxury';
export type TripCategory = 'Multi-City' | 'Cultural' | 'Culinary' | 'Nature & Scenic' | 'Urban & Modern' | 'Coastal & Island';

export interface ActivityItem {
  id: string; // UUID (planned_activities.id)
  name: string;
  category: string;
  cost: number;
  duration?: string;
  rating?: number;
  description?: string;
  includedInSample?: boolean;
  otmPlaceId?: string;
}

export interface ItineraryStop {
  id: string; // UUID (trip_stops.id)
  cityName: string;
  country: string;
  days: number;
  order: number;
  image?: string;
  lodgingEstimate?: number;
  activities: ActivityItem[];
}

export interface ItineraryDay {
  day: number;
  city: string;
  country?: string;
  title: string;
  description: string;
  estimatedCost: number;
  lodging?: string;
  transport?: string;
  highlights: string[];
  activities?: ActivityItem[];
}

export interface Destination {
  id: string; // UUID (cities.id)
  title: string;
  subtitle: string;
  city: string;
  country: string;
  countryCode?: string;
  region: string;
  costIndex: CostIndex;
  popularityScore?: number;
  idealDuration?: string;
  avgDailyCost: number; // cost_index
  rating: number;
  reviewCount?: number;
  priceFrom: number;
  originalPrice?: number;
  image: string;
  gallery?: string[];
  tag: string;
  featured?: boolean;
  categories: TripCategory[];
  description: string;
  bestSeason?: string;
  currency?: string;
  topActivities?: ActivityItem[];
  sampleMultiCityStops?: string[];
  itinerary?: ItineraryDay[];
}

export interface TravelPackage {
  id: string; // UUID (trips.id)
  title: string;
  subtitle: string;
  category: TripCategory;
  destination: string;
  country: string;
  cities: string[];
  stopsCount: number;
  price: number; // budget
  originalPrice?: number;
  days: number;
  nights: number;
  avgCostPerDay: number;
  rating: number;
  reviewCount?: number;
  copiedCount?: number;
  author?: {
    name: string;
    avatar: string;
  };
  budgetBreakdown: {
    stay: number;
    transport: number;
    activities: number;
    meals: number;
  };
  image: string;
  inclusions?: string[];
  itinerary?: ItineraryDay[];
}

export interface QuickFilterState {
  destination: string;
  month: string;
  activityType: string;
  maxBudget: number;
  duration: string;
}

export interface CustomTripPlan {
  tripName: string;
  stops: {
    cityName: string;
    country: string;
    days: number;
    cityId?: string;
  }[];
  startDate: string;
  endDate?: string;
  travelers: number;
  lodgingTier: 'budget' | 'comfort' | 'luxury';
  interests: string[];
  budgetSummary: {
    stay: number;
    transport: number;
    activities: number;
    dining: number;
    totalPerPerson: number;
    grandTotal: number;
    dailyAvg: number;
  };
}

// Cards UI interfaces directly mapped to `cities` schema
export interface PopularPlace {
  id: string; // UUID (cities.id)
  name: string;
  location: string;
  discount: string;
  image: string;
  price: number; // cost_index
  rating: number;
  description: string;
  cityId?: string;
}

export interface ExplorePlace {
  id: string; // UUID (cities.id)
  name: string;
  location: string;
  pricePerPax: number; // cost_index
  rating: number;
  image: string;
  category: string;
  description: string;
  cityId?: string;
}

export interface AdventureStamp {
  id: string; // UUID (cities.id)
  city: string;
  country: string;
  image: string;
  landmark: string;
  description: string;
  cityId?: string;
}
