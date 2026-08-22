/**
 * GlobeTrotter REST API Client Module
 * Maps strictly to endpoints documented in `backend/API_ENDPOINTS.md`
 * Base URL: `http://localhost:5000/api` or `/api` via dev server proxy
 */

import {
  User,
  Trip,
  TripStop,
  PlannedActivity,
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

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

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

// 1. Auth API (/api/auth) - Fully Implemented in Backend
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
      if (err.message && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError')) {
        throw err;
      }
      // Offline fallback
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
      if (err.message && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError')) {
        throw err;
      }
      // Offline fallback
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
    const token = getAuthToken();
    if (!token) throw new Error('No token found');
    try {
      return await request<User>('/auth/me');
    } catch (err: any) {
      if (token === 'mock-jwt-token-globetrotter') {
        return CURRENT_HOME_USER;
      }
      throw err;
    }
  },
};

// 2. Users / Profile API (/api/users)
export const usersApi = {
  async getProfile(): Promise<User> {
    try {
      return await request<User>('/auth/me');
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
      // 501 Fallback: local memory update
      return { ...CURRENT_HOME_USER, ...data };
    }
  },

  async deleteAccount(password: string): Promise<void> {
    await request<void>('/users/me', {
      method: 'DELETE',
      body: JSON.stringify({ password }),
    });
    setAuthToken(null);
  },

  async getSavedDestinations(): Promise<SavedDestination[]> {
    try {
      return await request<SavedDestination[]>('/users/me/saved-destinations');
    } catch {
      // 501 Fallback: return static saved destinations
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
      // static fallback
    }
  },
};

// Helper to normalize Trip API properties
function normalizeTrip(trip: any): Trip {
  const fallbackCover = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80';
  return {
    ...trip,
    id: trip.id,
    user_id: trip.user_id || trip.ownerId || CURRENT_HOME_USER.id,
    ownerId: trip.ownerId || trip.user_id || CURRENT_HOME_USER.id,
    name: trip.name,
    description: trip.description || '',
    cover_image: trip.cover_image || trip.coverUrl || fallbackCover,
    coverUrl: trip.coverUrl || trip.cover_image || fallbackCover,
    start_date: trip.start_date || trip.startDate || '',
    startDate: trip.startDate || trip.start_date || '',
    end_date: trip.end_date || trip.endDate || '',
    endDate: trip.endDate || trip.end_date || '',
    budget: Number(trip.budget) || 25000,
    status: trip.status || 'UPCOMING',
    is_public: Boolean(trip.is_public ?? trip.isPublic),
    isPublic: Boolean(trip.isPublic ?? trip.is_public),
    share_slug: trip.share_slug || trip.shareToken || `trip-${trip.id}`,
    shareToken: trip.shareToken || trip.share_slug || `trip-${trip.id}`,
    stop_count: trip.stopCount ?? trip.stop_count ?? (trip.stops ? trip.stops.length : 0),
    stops: Array.isArray(trip.stops) ? trip.stops.map(normalizeStop) : [],
  };
}

function normalizeStop(stop: any): TripStop {
  return {
    ...stop,
    id: stop.id,
    trip_id: stop.trip_id || stop.tripId,
    tripId: stop.tripId || stop.trip_id,
    city_id: stop.city_id || stop.cityId,
    cityId: stop.cityId || stop.city_id,
    city: stop.city ? normalizeCity(stop.city) : undefined,
    start_date: stop.start_date || stop.startDate || '',
    startDate: stop.startDate || stop.start_date || '',
    end_date: stop.end_date || stop.endDate || '',
    endDate: stop.endDate || stop.start_date || '',
    position: Number(stop.position) || 0,
    budget: stop.budget != null ? Number(stop.budget) : undefined,
    activities: Array.isArray(stop.activities) ? stop.activities.map(normalizeActivity) : [],
  };
}

function normalizeActivity(act: any): PlannedActivity {
  return {
    ...act,
    id: act.id,
    trip_stop_id: act.trip_stop_id || act.tripStopId,
    tripStopId: act.tripStopId || act.trip_stop_id,
    otm_place_id: act.otm_place_id || act.otmPlaceId,
    otmPlaceId: act.otmPlaceId || act.otm_place_id,
    name: act.name || act.title,
    title: act.title || act.name,
    type: act.type || act.category,
    category: act.category || act.type,
    image: act.image || act.preview_url,
    preview_url: act.preview_url || act.image,
    latitude: act.latitude != null ? Number(act.latitude) : undefined,
    longitude: act.longitude != null ? Number(act.longitude) : undefined,
    date: act.date || '',
    start_time: act.start_time || act.startTime,
    startTime: act.startTime || act.start_time,
    end_time: act.end_time || act.endTime,
    endTime: act.endTime || act.end_time,
    planned_cost: act.planned_cost != null ? Number(act.planned_cost) : (act.plannedCost != null ? Number(act.plannedCost) : 500),
    plannedCost: act.plannedCost != null ? Number(act.plannedCost) : (act.planned_cost != null ? Number(act.planned_cost) : 500),
    position: Number(act.position) || 0,
    notes: act.notes || act.note || '',
  };
}

function normalizeCity(city: any): City {
  return {
    ...city,
    id: city.id,
    name: city.name,
    country: city.country,
    region: city.region || 'International',
    description: city.description || '',
    image: city.image || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    cost_index: Number(city.costIndex ?? city.cost_index) || 120,
    costIndex: Number(city.costIndex ?? city.cost_index) || 120,
    latitude: Number(city.latitude) || 0,
    longitude: Number(city.longitude) || 0,
    rating: city.rating || 4.8,
  };
}

// 3. Trips API (/api/trips) - Implemented in Backend
export const tripsApi = {
  async getTrips(): Promise<Trip[]> {
    try {
      const res = await request<any[]>('/trips');
      return res.map(normalizeTrip);
    } catch {
      return USER_PREVIOUS_TRIPS;
    }
  },

  async getTrip(id: string): Promise<Trip> {
    try {
      const res = await request<any>(`/trips/${id}`);
      return normalizeTrip(res);
    } catch {
      return USER_PREVIOUS_TRIPS.find((t) => t.id === id) || USER_PREVIOUS_TRIPS[0];
    }
  },

  async createTrip(data: {
    name: string;
    description?: string;
    startDate: string;
    endDate: string;
    budget?: number;
    cover_image?: string;
  }): Promise<Trip> {
    try {
      const res = await request<any>('/trips', {
        method: 'POST',
        body: JSON.stringify({
          name: data.name,
          description: data.description || null,
          startDate: data.startDate,
          endDate: data.endDate,
          budget: data.budget ? Number(data.budget) : undefined,
        }),
      });
      return normalizeTrip(res);
    } catch {
      // Local fallback
      const fallbackCover = data.cover_image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80';
      const newTrip: Trip = {
        id: `trip-${Date.now()}`,
        user_id: CURRENT_HOME_USER.id,
        ownerId: CURRENT_HOME_USER.id,
        name: data.name,
        description: data.description || '',
        cover_image: fallbackCover,
        coverUrl: fallbackCover,
        start_date: data.startDate,
        startDate: data.startDate,
        end_date: data.endDate,
        endDate: data.endDate,
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
      const res = await request<any>(`/trips/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          startDate: data.startDate || data.start_date,
          endDate: data.endDate || data.end_date,
          budget: data.budget ? Number(data.budget) : undefined,
          status: data.status,
        }),
      });
      return normalizeTrip(res);
    } catch {
      const existing = USER_PREVIOUS_TRIPS.find((t) => t.id === id) || USER_PREVIOUS_TRIPS[0];
      return { ...existing, ...data };
    }
  },

  async deleteTrip(id: string): Promise<void> {
    try {
      await request<void>(`/trips/${id}`, { method: 'DELETE' });
    } catch {
      // fallback handled in UI
    }
  },

  async getItinerary(tripId: string): Promise<{ trip: Trip; stops: TripStop[] }> {
    try {
      const res = await request<any>(`/trips/${tripId}/itinerary`);
      return {
        trip: normalizeTrip(res.trip),
        stops: Array.isArray(res.stops) ? res.stops.map(normalizeStop) : [],
      };
    } catch {
      const trip = USER_PREVIOUS_TRIPS.find((t) => t.id === tripId) || USER_PREVIOUS_TRIPS[0];
      return { trip, stops: trip.stops || [] };
    }
  },

  async getCalendar(tripId: string): Promise<{ days: Array<{ date: string; stopId?: string; city?: City; items: any[] }> }> {
    try {
      return await request<any>(`/trips/${tripId}/calendar`);
    } catch {
      return { days: [] };
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

// 4. Trip Stops API (/api/trips/:tripId/stops)
export const stopsApi = {
  async getStops(tripId: string): Promise<TripStop[]> {
    try {
      const res = await request<any[]>(`/trips/${tripId}/stops`);
      return res.map(normalizeStop);
    } catch {
      return [];
    }
  },

  async addStop(
    tripId: string,
    data: { cityId: string; startDate: string; endDate: string; budget?: number }
  ): Promise<TripStop> {
    try {
      const res = await request<any>(`/trips/${tripId}/stops`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return normalizeStop(res);
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

  async deleteStop(tripId: string, stopId: string): Promise<void> {
    try {
      await request<void>(`/trips/${tripId}/stops/${stopId}`, { method: 'DELETE' });
    } catch {
      // fallback
    }
  },
};

// 5. Stop Activities API (/api/trips/:tripId/stops/:stopId/activities)
export const stopActivitiesApi = {
  async getActivities(tripId: string, stopId: string): Promise<PlannedActivity[]> {
    try {
      const res = await request<any[]>(`/trips/${tripId}/stops/${stopId}/activities`);
      return res.map(normalizeActivity);
    } catch {
      return [];
    }
  },

  async addActivity(
    tripId: string,
    stopId: string,
    data: {
      name: string;
      date: string;
      otmPlaceId?: string;
      type?: string;
      image?: string;
      latitude?: number;
      longitude?: number;
      startTime?: string;
      endTime?: string;
      plannedCost?: number;
      notes?: string;
    }
  ): Promise<PlannedActivity> {
    try {
      const res = await request<any>(`/trips/${tripId}/stops/${stopId}/activities`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return normalizeActivity(res);
    } catch {
      return {
        id: `act-${Date.now()}`,
        trip_stop_id: stopId,
        tripStopId: stopId,
        name: data.name,
        title: data.name,
        date: data.date,
        type: data.type || 'sightseeing',
        category: data.type || 'sightseeing',
        image: data.image,
        startTime: data.startTime || '10:00',
        endTime: data.endTime || '12:00',
        plannedCost: data.plannedCost || 500,
        notes: data.notes || '',
        position: 1,
      };
    }
  },

  async updateActivity(
    tripId: string,
    stopId: string,
    activityId: string,
    data: Partial<PlannedActivity>
  ): Promise<PlannedActivity> {
    try {
      const res = await request<any>(`/trips/${tripId}/stops/${stopId}/activities/${activityId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      return normalizeActivity(res);
    } catch {
      return { id: activityId, ...data } as PlannedActivity;
    }
  },

  async deleteActivity(tripId: string, stopId: string, activityId: string): Promise<void> {
    try {
      await request<void>(`/trips/${tripId}/stops/${stopId}/activities/${activityId}`, {
        method: 'DELETE',
      });
    } catch {
      // fallback
    }
  },
};

// 6. Cities Catalog API (/api/cities) - Implemented in Backend
export const citiesApi = {
  async getCities(params?: {
    q?: string;
    country?: string;
    region?: string;
    limit?: number;
    offset?: number;
  }): Promise<City[]> {
    try {
      const query = new URLSearchParams(params as any).toString();
      const res = await request<any>(`/cities?${query}`);
      const list = Array.isArray(res) ? res : (res?.data || []);
      return list.map(normalizeCity);
    } catch {
      let result = POPULAR_CITIES;
      if (params?.q) {
        result = result.filter(
          (c) =>
            c.name.toLowerCase().includes(params.q!.toLowerCase()) ||
            c.region.toLowerCase().includes(params.q!.toLowerCase()) ||
            c.country.toLowerCase().includes(params.q!.toLowerCase())
        );
      }
      return result;
    }
  },

  async getPopularCities(): Promise<City[]> {
    try {
      const res = await request<any[]>('/cities/popular');
      return Array.isArray(res) ? res.map(normalizeCity) : POPULAR_CITIES;
    } catch {
      return POPULAR_CITIES;
    }
  },

  async getCity(id: string): Promise<City> {
    try {
      const res = await request<any>(`/cities/${id}`);
      return normalizeCity(res);
    } catch {
      return POPULAR_CITIES.find((c) => c.id === id) || POPULAR_CITIES[0];
    }
  },
};

// 7. OpenTripMap Proxy Activities API (/api/activities) - Implemented in Backend
export const activitiesApi = {
  async searchActivities(params: {
    cityId?: string;
    q?: string;
    type?: string;
    limit?: number;
  }): Promise<OpenTripMapPOI[]> {
    try {
      const query = new URLSearchParams(params as any).toString();
      const res = await request<any>(`/activities?${query}`);
      const list = Array.isArray(res) ? res : (res?.data || res?.activities || []);
      return list.map((item: any) => ({
        otmPlaceId: item.otmPlaceId || item.xid || `otm-${Math.random()}`,
        name: item.name,
        kinds: item.kinds || item.type || 'attraction',
        previewUrl: item.previewUrl || item.image || item.preview_url,
        wikipediaExtract: item.wikipediaExtract || item.description,
        otmUrl: item.otmUrl,
        latitude: item.latitude != null ? Number(item.latitude) : undefined,
        longitude: item.longitude != null ? Number(item.longitude) : undefined,
        plannedCost: item.plannedCost != null ? Number(item.plannedCost) : 500,
      }));
    } catch {
      return [
        {
          otmPlaceId: 'W1823849028',
          name: 'Historic Fort & Viewpoint',
          kinds: 'historic,viewpoints',
          previewUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
          plannedCost: 350,
        },
        {
          otmPlaceId: 'W9918237162',
          name: 'Scenic Valley Waterfall Hike',
          kinds: 'natural,waterfalls',
          previewUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80',
          plannedCost: 500,
        },
        {
          otmPlaceId: 'W3349182741',
          name: 'Paragliding & Sky Adventure',
          kinds: 'sport,adventure,outdoor',
          previewUrl: 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&w=600&q=80',
          plannedCost: 2500,
        },
      ];
    }
  },

  async getActivityDetail(id: string): Promise<OpenTripMapPOI> {
    try {
      const res = await request<any>(`/activities/${id}`);
      return {
        otmPlaceId: res.otmPlaceId || res.xid || id,
        name: res.name,
        kinds: res.kinds || 'attraction',
        previewUrl: res.previewUrl || res.image,
        wikipediaExtract: res.wikipediaExtract,
        otmUrl: res.otmUrl,
        latitude: res.latitude != null ? Number(res.latitude) : undefined,
        longitude: res.longitude != null ? Number(res.longitude) : undefined,
        plannedCost: res.plannedCost != null ? Number(res.plannedCost) : 500,
      };
    } catch {
      return {
        otmPlaceId: id,
        name: 'Selected Activity Detail',
        kinds: 'sightseeing,historic',
        previewUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
        plannedCost: 500,
      };
    }
  },
};

// 8. Public Sharing API (/api/public)
export const publicApi = {
  async getPublicTrip(token: string): Promise<{ trip: Trip; stops: TripStop[] }> {
    try {
      const res = await request<any>(`/public/trips/${token}`);
      return {
        trip: normalizeTrip(res.trip),
        stops: Array.isArray(res.stops) ? res.stops.map(normalizeStop) : [],
      };
    } catch {
      const trip = USER_PREVIOUS_TRIPS[0];
      return { trip, stops: trip.stops || [] };
    }
  },
};
