export type CostIndex = 'Budget' | 'Moderate' | 'High' | 'Luxury';
export type TripCategory = 'Multi-City' | 'Cultural' | 'Culinary' | 'Nature & Scenic' | 'Urban & Modern' | 'Coastal & Island';

export interface ActivityItem {
  id: string;
  name: string;
  category: 'Sightseeing' | 'Food & Dining' | 'Culture & Arts' | 'Adventure' | 'Day Trip';
  cost: number;
  duration: string; // e.g. "2-3 hrs"
  rating: number;
  description: string;
  includedInSample?: boolean;
}

export interface ItineraryStop {
  id: string;
  cityName: string;
  country: string;
  days: number;
  order: number;
  image?: string;
  lodgingEstimate: number;
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
  id: string;
  title: string;
  subtitle: string;
  city: string;
  country: string;
  countryCode: string;
  region: string;
  costIndex: CostIndex;
  popularityScore: number; // e.g. 96 (%)
  idealDuration: string; // e.g. "5-7 Days"
  avgDailyCost: number; // in USD
  rating: number;
  reviewCount: number;
  priceFrom: number;
  originalPrice?: number;
  image: string;
  gallery: string[];
  tag: string;
  featured?: boolean;
  categories: TripCategory[];
  description: string;
  bestSeason: string;
  currency: string;
  topActivities: ActivityItem[];
  sampleMultiCityStops?: string[];
  itinerary: ItineraryDay[];
}

export interface TravelPackage {
  id: string;
  title: string;
  subtitle: string;
  category: TripCategory;
  destination: string;
  country: string;
  cities: string[];
  stopsCount: number;
  price: number;
  originalPrice?: number;
  days: number;
  nights: number;
  avgCostPerDay: number;
  rating: number;
  reviewCount: number;
  copiedCount: number;
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
  inclusions: string[];
  itinerary: ItineraryDay[];
}

export interface JournalEntry {
  id: string;
  title: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  date: string;
  readTime: string;
  image: string;
  category: string;
  location: string;
  stops: string[];
}

export interface Testimonial {
  id: string;
  author: string;
  avatar: string;
  role: string;
  location: string;
  tripName: string;
  rating: number;
  quote: string;
  verified: boolean;
  savedMoney: string;
  date: string;
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
  }[];
  startDate: string;
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

export interface PopularPlace {
  id: string;
  name: string;
  location: string;
  discount: string;
  image: string;
  price: number;
  rating: number;
  description: string;
}

export interface ExplorePlace {
  id: string;
  name: string;
  location: string;
  pricePerPax: number;
  rating: number;
  image: string;
  category: string;
  description: string;
}

export interface AdventureStamp {
  id: string;
  city: string;
  country: string;
  image: string;
  landmark: string;
  description: string;
}
