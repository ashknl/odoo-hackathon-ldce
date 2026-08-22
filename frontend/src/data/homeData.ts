import {
  User,
  City,
  Trip,
  YearlyWishlistItem,
  TripCollaborator,
} from '../types/schema';

// 1. Current Active User matching `users` table
export const CURRENT_HOME_USER: User = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'Mallik Cheripally',
  email: 'mallik@globetrotter.io',
  profile_image:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  avatarUrl:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  level: 'Beginner Explorer',
  badges: 3,
  points: 85,
  created_at: '2026-08-01T10:00:00Z',
  createdAt: '2026-08-01T10:00:00Z',
};

// 2. Cities Catalog matching `cities` table
export const POPULAR_CITIES: City[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Munnar',
    country: 'India',
    region: 'Kerala',
    description: 'Rolling tea gardens, misty hill stations, and scenic valleys.',
    image:
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    cost_index: 3500,
    costIndex: 3500,
    latitude: 10.0889,
    longitude: 77.0595,
    rating: 4.8,
    tags: ['Recommended', 'Kerala', 'Nature'],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Palolem Beach',
    country: 'India',
    region: 'Goa',
    description: 'Golden palm-fringed sands, sunset cruises, and vibrant nightlife.',
    image:
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    cost_index: 4200,
    costIndex: 4200,
    latitude: 15.01,
    longitude: 74.023,
    rating: 4.9,
    tags: ['Recommended', 'Goa', 'Coastal & Island'],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Leh & Pangong',
    country: 'India',
    region: 'Ladakh',
    description: 'High-altitude mountain passes, crystal lakes, and ancient monasteries.',
    image:
      'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
    cost_index: 6800,
    costIndex: 6800,
    latitude: 34.1526,
    longitude: 77.5771,
    rating: 4.9,
    tags: ['Recommended', 'Ladakh', 'Adventurous'],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'Havelock Island',
    country: 'India',
    region: 'Andaman',
    description: 'Turquoise waters, scuba diving, and white sandy beaches.',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    cost_index: 8500,
    costIndex: 8500,
    latitude: 11.9761,
    longitude: 92.9876,
    rating: 4.7,
    tags: ['Recommended', 'Andaman', 'Romantic'],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    name: 'Rishikesh Valley',
    country: 'India',
    region: 'Rishikesh',
    description: 'Ganges river rafting, yoga retreats, and Himalayan foothills.',
    image:
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    cost_index: 2900,
    costIndex: 2900,
    latitude: 30.0869,
    longitude: 78.2676,
    rating: 4.6,
    tags: ['Rishikesh', 'Adventurous', 'Exciting'],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    name: 'Santorini',
    country: 'Greece',
    region: 'World',
    description: 'Whitewashed cliffside villas and Mediterranean sunsets.',
    image:
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
    cost_index: 18500,
    costIndex: 18500,
    latitude: 36.3932,
    longitude: 25.4615,
    rating: 4.9,
    tags: ['World', 'Romantic'],
  },
];

// 3. User Upcoming Trip Ticket Data matching `trips`, `trip_stops`, `cities`
export const UPCOMING_TRIP_DATA: Trip = {
  id: '550e8400-e29b-41d4-a716-446655440010',
  user_id: CURRENT_HOME_USER.id,
  ownerId: CURRENT_HOME_USER.id,
  name: 'Kerala & Munnar Getaway',
  description: 'Holiday trip to Munnar tea plantations and Alleppey backwaters.',
  cover_image:
    'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
  coverUrl:
    'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
  start_date: '2026-12-25',
  startDate: '2026-12-25',
  end_date: '2026-12-28',
  endDate: '2026-12-28',
  budget: 45000,
  status: 'UPCOMING',
  is_public: true,
  isPublic: true,
  share_slug: 'kerala-munnar-2026',
  shareToken: 'kerala-munnar-2026',
  stop_count: 2,
  stops: [
    {
      id: '550e8400-e29b-41d4-a716-446655440101',
      trip_id: '550e8400-e29b-41d4-a716-446655440010',
      tripId: '550e8400-e29b-41d4-a716-446655440010',
      city_id: '550e8400-e29b-41d4-a716-446655440001',
      cityId: '550e8400-e29b-41d4-a716-446655440001',
      city: POPULAR_CITIES[0],
      start_date: '2026-12-25',
      startDate: '2026-12-25',
      end_date: '2026-12-27',
      endDate: '2026-12-27',
      position: 1,
      budget: 25000,
      activities: [
        {
          id: '550e8400-e29b-41d4-a716-446655440201',
          trip_stop_id: '550e8400-e29b-41d4-a716-446655440101',
          tripStopId: '550e8400-e29b-41d4-a716-446655440101',
          otm_place_id: 'W1823849028',
          otmPlaceId: 'W1823849028',
          name: 'Tea Museum & Garden Trek',
          type: 'museum',
          date: '2026-12-26',
          start_time: '09:00',
          startTime: '09:00',
          end_time: '12:00',
          endTime: '12:00',
          planned_cost: 450,
          plannedCost: 450,
          position: 1,
        },
      ],
    },
  ],
};

// 4. User Trips History List matching `trips` table
export const USER_PREVIOUS_TRIPS: Trip[] = [
  UPCOMING_TRIP_DATA,
  {
    id: '550e8400-e29b-41d4-a716-446655440020',
    user_id: CURRENT_HOME_USER.id,
    ownerId: CURRENT_HOME_USER.id,
    name: 'Goa Coastal Roadtrip',
    description: 'Beach hopping, fort exploring, and sunset dinner cruises in North & South Goa.',
    cover_image:
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    coverUrl:
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    start_date: '2026-10-10',
    startDate: '2026-10-10',
    end_date: '2026-10-15',
    endDate: '2026-10-15',
    budget: 38000,
    status: 'COMPLETED',
    is_public: true,
    isPublic: true,
    share_slug: 'goa-coastal-roadtrip-2026',
    shareToken: 'goa-coastal-roadtrip-2026',
    stop_count: 1,
    stops: [
      {
        id: '550e8400-e29b-41d4-a716-446655440102',
        trip_id: '550e8400-e29b-41d4-a716-446655440020',
        tripId: '550e8400-e29b-41d4-a716-446655440020',
        city_id: '550e8400-e29b-41d4-a716-446655440002',
        cityId: '550e8400-e29b-41d4-a716-446655440002',
        city: POPULAR_CITIES[1],
        start_date: '2026-10-10',
        startDate: '2026-10-10',
        end_date: '2026-10-15',
        endDate: '2026-10-15',
        position: 1,
        budget: 38000,
        activities: [],
      },
    ],
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440030',
    user_id: CURRENT_HOME_USER.id,
    ownerId: CURRENT_HOME_USER.id,
    name: 'Ladakh High Pass Expedition',
    description: 'Motorcycle journey through Khardung La, Nubra Valley, and Pangong Tso.',
    cover_image:
      'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
    coverUrl:
      'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
    start_date: '2026-08-01',
    startDate: '2026-08-01',
    end_date: '2026-08-08',
    endDate: '2026-08-08',
    budget: 72000,
    status: 'COMPLETED',
    is_public: true,
    isPublic: true,
    share_slug: 'ladakh-expedition-2026',
    shareToken: 'ladakh-expedition-2026',
    stop_count: 1,
    stops: [
      {
        id: '550e8400-e29b-41d4-a716-446655440103',
        trip_id: '550e8400-e29b-41d4-a716-446655440030',
        tripId: '550e8400-e29b-41d4-a716-446655440030',
        city_id: '550e8400-e29b-41d4-a716-446655440003',
        cityId: '550e8400-e29b-41d4-a716-446655440003',
        city: POPULAR_CITIES[2],
        start_date: '2026-08-01',
        startDate: '2026-08-01',
        end_date: '2026-08-08',
        endDate: '2026-08-08',
        position: 1,
        budget: 72000,
        activities: [],
      },
    ],
  },
];

// 5. Yearly Wishlist Widget Items
export const YEARLY_WISHLIST: YearlyWishlistItem[] = [
  { id: 'w-1', title: 'Scuba dive in Havelock Island, Andaman', completed: false },
  { id: 'w-2', title: 'Stay in a floating houseboat in Alleppey', completed: true },
  { id: 'w-3', title: 'Watch sunrise over Pangong Tso Lake', completed: true },
  { id: 'w-4', title: 'River rafting in Rishikesh Ganges', completed: false },
];

// 6. Friends Trip Collaborators List matching `trip_collaborators` table
export const FRIENDS_TRIP_COLLABORATORS: TripCollaborator[] = [
  {
    id: 'collab-1',
    trip_id: UPCOMING_TRIP_DATA.id,
    tripId: UPCOMING_TRIP_DATA.id,
    user_id: '550e8400-e29b-41d4-a716-446655440091',
    userId: '550e8400-e29b-41d4-a716-446655440091',
    role: 'EDITOR',
    user: {
      id: '550e8400-e29b-41d4-a716-446655440091',
      name: 'Aarav Sharma',
      email: 'aarav@example.com',
      profile_image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      avatarUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
  },
  {
    id: 'collab-2',
    trip_id: UPCOMING_TRIP_DATA.id,
    tripId: UPCOMING_TRIP_DATA.id,
    user_id: '550e8400-e29b-41d4-a716-446655440092',
    userId: '550e8400-e29b-41d4-a716-446655440092',
    role: 'EDITOR',
    user: {
      id: '550e8400-e29b-41d4-a716-446655440092',
      name: 'Priya Patel',
      email: 'priya@example.com',
      profile_image:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      avatarUrl:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    },
  },
  {
    id: 'collab-3',
    trip_id: UPCOMING_TRIP_DATA.id,
    tripId: UPCOMING_TRIP_DATA.id,
    user_id: '550e8400-e29b-41d4-a716-446655440093',
    userId: '550e8400-e29b-41d4-a716-446655440093',
    role: 'VIEWER',
    user: {
      id: '550e8400-e29b-41d4-a716-446655440093',
      name: 'Rohan Gupta',
      email: 'rohan@example.com',
      profile_image:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      avatarUrl:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    },
  },
];
