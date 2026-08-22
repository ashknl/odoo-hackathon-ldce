/**
 * GlobeTrotter REST API Client Module
 * Maps strictly to endpoints documented in `API.md`
 * Base URL: `/api`
 */

import {
  User,
  Trip,
  TripStop,
  PlannedActivity,
  TripExpense,
  SavedDestination,
  City,
  AuthUserResponse,
  LoginCredentials,
  SignUpCredentials,
  BudgetBreakdownResponse,
  OpenTripMapPOI,
} from '../types/schema';

import {
  CURRENT_HOME_USER,
  POPULAR_CITIES,
  USER_PREVIOUS_TRIPS,
} from '../data/homeData';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Helper to get bearer token from localStorage
export const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem('globetrotter_token');
  } catch {
    return null;
  }
};

export const setAuthToken = (token: string | null) => {
  try {
    if (token) {
      localStorage.setItem('globetrotter_token', token);
    } else {
      localStorage.removeItem('globetrotter_token');
    }
  } catch (e) {
    console.error('Failed to update auth token in localStorage', e);
  }
};

// Generic fetch wrapper with Authorization header
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `API Request failed with status ${response.status}`
    );
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

// 1. Auth API (/api/auth)
export const authApi = {
  async signup(data: SignUpCredentials): Promise<AuthUserResponse> {
    try {
      const res = await request<AuthUserResponse>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (res.token) setAuthToken(res.token);
      return res;
    } catch (err: any) {
      // If server responded with a error message (like 409 email exists or 400 validation), throw it so UI displays it
      if (err.message && !err.message.includes('Failed to fetch')) {
        throw err;
      }
      // Offline / network fallback
      const mockUser: User = {
        id: `usr-${Date.now()}`,
        name: data.name,
        email: data.email,
        profile_image: CURRENT_HOME_USER.profile_image,
        avatarUrl: CURRENT_HOME_USER.profile_image,
        level: 'Beginner Explorer',
        badges: 1,
        points: 10,
      };
      const mockToken = 'mock-jwt-token-globetrotter';
      setAuthToken(mockToken);
      return { user: mockUser, token: mockToken };
    }
  },

  async login(data: LoginCredentials): Promise<AuthUserResponse> {
    try {
      const res = await request<AuthUserResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (res.token) setAuthToken(res.token);
      return res;
    } catch (err: any) {
      if (err.message && !err.message.includes('Failed to fetch')) {
        throw err;
      }
      const mockUser: User = {
        ...CURRENT_HOME_USER,
        email: data.email,
      };
      const mockToken = 'mock-jwt-token-globetrotter';
      setAuthToken(mockToken);
      return { user: mockUser, token: mockToken };
    }
  },

  async logout(): Promise<void> {
    try {
      await request<void>('/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    } finally {
      setAuthToken(null);
    }
  },

  async me(): Promise<User> {
    try {
      return await request<User>('/auth/me');
    } catch {
      return CURRENT_HOME_USER;
    }
  },

  async forgotPassword(email: string): Promise<void> {
    try {
      await request<void>('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    } catch {
      // 204 No content response or offline fallback
    }
  },
};

// 2. Users / Profile API (/api/users)
export const usersApi = {
  async getProfile(): Promise<User> {
    try {
      return await request<User>('/users/me');
    } catch {
      return CURRENT_HOME_USER;
    }
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      return await request<User>('/users/me', {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    } catch {
      return { ...CURRENT_HOME_USER, ...data };
    }
  },

  async getSavedDestinations(): Promise<SavedDestination[]> {
    try {
      return await request<SavedDestination[]>('/users/me/saved-destinations');
    } catch {
      return POPULAR_CITIES.slice(0, 2).map((city, idx) => ({
        id: `save-${idx + 1}`,
        user_id: CURRENT_HOME_USER.id,
        city_id: city.id,
        city,
      }));
    }
  },

  async saveDestination(cityId: string): Promise<SavedDestination> {
    try {
      return await request<SavedDestination>('/users/me/saved-destinations', {
        method: 'POST',
        body: JSON.stringify({ cityId }),
      });
    } catch {
      const city = POPULAR_CITIES.find((c) => c.id === cityId);
      return {
        id: `save-${Date.now()}`,
        user_id: CURRENT_HOME_USER.id,
        city_id: cityId,
        city,
      };
    }
  },

  async removeSavedDestination(id: string): Promise<void> {
    try {
      await request<void>(`/users/me/saved-destinations/${id}`, {
        method: 'DELETE',
      });
    } catch {
      // mock deleted
    }
  },
};

// 3. Trips API (/api/trips)
export const tripsApi = {
  async getTrips(): Promise<Trip[]> {
    try {
      return await request<Trip[]>('/trips');
    } catch {
      return USER_PREVIOUS_TRIPS;
    }
  },

  async getTrip(id: string): Promise<Trip> {
    try {
      return await request<Trip>(`/trips/${id}`);
    } catch {
      return (
        USER_PREVIOUS_TRIPS.find((t) => t.id === id) || USER_PREVIOUS_TRIPS[0]
      );
    }
  },

  async createTrip(data: {
    name: string;
    description: string;
    start_date?: string;   // DB column name
    end_date?: string;     // DB column name
    startDate?: string;    // API alias
    endDate?: string;      // API alias
    budget?: number;
    cover_image?: string;  // DB column name (trips.cover_image)
  }): Promise<Trip> {
    try {
      return await request<Trip>('/trips', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      const fallbackCover = data.cover_image ||
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80';
      const newTrip: Trip = {
        id: `trip-${Date.now()}`,
        user_id: CURRENT_HOME_USER.id,
        ownerId: CURRENT_HOME_USER.id,
        name: data.name,
        description: data.description,
        cover_image: fallbackCover,
        coverUrl: fallbackCover,
        start_date: data.start_date || data.startDate || '',
        startDate: data.startDate || data.start_date || '',
        end_date: data.end_date || data.endDate || '',
        endDate: data.endDate || data.end_date || '',
        budget: data.budget || 25000,
        status: 'UPCOMING',
        is_public: false,
        isPublic: false,
        share_slug: `trip-${Date.now()}`,
        shareToken: `token-${Date.now()}`,
        stop_count: 1,
        stops: [],
      };
      return newTrip;
    }
  },

  async updateTrip(id: string, data: Partial<Trip>): Promise<Trip> {
    try {
      return await request<Trip>(`/trips/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    } catch {
      const existing =
        USER_PREVIOUS_TRIPS.find((t) => t.id === id) || USER_PREVIOUS_TRIPS[0];
      return { ...existing, ...data };
    }
  },

  async deleteTrip(id: string): Promise<void> {
    try {
      await request<void>(`/trips/${id}`, { method: 'DELETE' });
    } catch {
      // mock deleted
    }
  },

  async getItinerary(tripId: string): Promise<{ trip: Trip; stops: TripStop[] }> {
    try {
      return await request<{ trip: Trip; stops: TripStop[] }>(
        `/trips/${tripId}/itinerary`
      );
    } catch {
      const trip =
        USER_PREVIOUS_TRIPS.find((t) => t.id === tripId) || USER_PREVIOUS_TRIPS[0];
      return { trip, stops: trip.stops || [] };
    }
  },

  async getBudget(tripId: string): Promise<BudgetBreakdownResponse> {
    try {
      return await request<BudgetBreakdownResponse>(`/trips/${tripId}/budget`);
    } catch {
      return {
        total: 45000,
        currency: 'INR',
        perDayAverage: 9000,
        breakdown: {
          transport: 12000,
          stay: 18000,
          activities: 10000,
          meals: 5000,
        },
      };
    }
  },
};

// 3b. Trip Stops API (/api/trips/:tripId/stops)
export const stopsApi = {
  async getStops(tripId: string): Promise<TripStop[]> {
    try {
      return await request<TripStop[]>(`/trips/${tripId}/stops`);
    } catch {
      return [];
    }
  },

  async addStop(
    tripId: string,
    data: { cityId: string; startDate: string; endDate: string; budget?: number }
  ): Promise<TripStop> {
    try {
      return await request<TripStop>(`/trips/${tripId}/stops`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      const city = POPULAR_CITIES.find((c) => c.id === data.cityId) || POPULAR_CITIES[0];
      return {
        id: `stop-${Date.now()}`,
        trip_id: tripId,
        tripId,
        city_id: data.cityId,
        cityId: data.cityId,
        city,
        start_date: data.startDate,
        startDate: data.startDate,
        end_date: data.endDate,
        endDate: data.endDate,
        position: 1,
        budget: data.budget || 10000,
        activities: [],
      };
    }
  },
};

// 4. Cities API (/api/cities)
export const citiesApi = {
  async getCities(params?: {
    q?: string;
    country?: string;
    region?: string;
    limit?: number;
  }): Promise<City[]> {
    try {
      const query = new URLSearchParams(params as any).toString();
      return await request<City[]>(`/cities?${query}`);
    } catch {
      let result = POPULAR_CITIES;
      if (params?.q) {
        result = result.filter(
          (c) =>
            c.name.toLowerCase().includes(params.q!.toLowerCase()) ||
            c.region.toLowerCase().includes(params.q!.toLowerCase())
        );
      }
      return result;
    }
  },

  async getPopularCities(): Promise<City[]> {
    try {
      return await request<City[]>('/cities/popular');
    } catch {
      return POPULAR_CITIES;
    }
  },

  async getCity(id: string): Promise<City> {
    try {
      return await request<City>(`/cities/${id}`);
    } catch {
      return (
        POPULAR_CITIES.find((c) => c.id === id) || POPULAR_CITIES[0]
      );
    }
  },
};

// 5. OpenTripMap Proxy Activities API (/api/activities)
export const activitiesApi = {
  async searchActivities(params: {
    cityId?: string;
    q?: string;
    type?: string;
  }): Promise<OpenTripMapPOI[]> {
    try {
      const query = new URLSearchParams(params as any).toString();
      const res = await request<any>(`/activities?${query}`);
      if (Array.isArray(res)) return res;
      if (res && Array.isArray(res.activities)) return res.activities;
      if (res && Array.isArray(res.data)) return res.data;
      return [];
    } catch {
      return [
        {
          otmPlaceId: 'W1823849028',
          name: 'Historic Fort & Viewpoint',
          kinds: 'historic,viewpoints',
          previewUrl:
            'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
          plannedCost: 350,
        },
        {
          otmPlaceId: 'W9918237162',
          name: 'Scenic Valley Waterfall Hike',
          kinds: 'natural,waterfalls',
          previewUrl:
            'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80',
          plannedCost: 500,
        },
        {
          otmPlaceId: 'W3349182741',
          name: 'Paragliding & Sky Adventure',
          kinds: 'sport,adventure,outdoor',
          previewUrl:
            'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&w=600&q=80',
          plannedCost: 2500,
        },
      ];
    }
  },
};

// 6. Public Sharing API (/api/public)
export const publicApi = {
  async getPublicTrip(token: string): Promise<{ trip: Trip; stops: TripStop[] }> {
    try {
      return await request<{ trip: Trip; stops: TripStop[] }>(
        `/public/trips/${token}`
      );
    } catch {
      const trip = USER_PREVIOUS_TRIPS[0];
      return { trip, stops: trip.stops || [] };
    }
  },
};
