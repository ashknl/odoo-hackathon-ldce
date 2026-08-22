import { User, City, Trip, TripCollaborator, YearlyWishlistItem } from '../types/schema';

export const CURRENT_HOME_USER: User = {
  id: 'usr-mallik-001',
  name: 'Mallik Cheripally',
  email: 'mallik@globetrotter.io',
  profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  level: 'Beginner',
  badges: 3,
  points: 85,
  created_at: '2025-01-10T08:00:00Z',
  updated_at: '2026-08-20T10:00:00Z'
};

export const POPULAR_CITIES: City[] = [
  {
    id: 'city-munnar',
    name: 'Munnar',
    country: 'India',
    region: 'Kerala',
    description: 'Rolling green tea plantations, misty valleys, and crisp mountain air in God\'s Own Country.',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
    cost_index: 2500,
    latitude: 10.0889,
    longitude: 77.0595,
    rating: 4.7,
    reviewCount: 342,
    tags: ['Recommended', 'Kerala', 'Road-trip', 'Romantic']
  },
  {
    id: 'city-houseboat',
    name: 'House Boat',
    country: 'India',
    region: 'Kerala',
    description: 'Tranquil luxury backwater cruises through Alleppey with private chefs and sunset views.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    cost_index: 4500,
    latitude: 9.4981,
    longitude: 76.3388,
    rating: 4.5,
    reviewCount: 512,
    tags: ['Recommended', 'Kerala', 'Romantic']
  },
  {
    id: 'city-goa',
    name: 'Goa Beach',
    country: 'India',
    region: 'Goa',
    description: 'Golden sandy beaches, vibrant shacks, Portuguese heritage, and watersports.',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    cost_index: 3200,
    latitude: 15.2993,
    longitude: 74.1240,
    rating: 4.4,
    reviewCount: 890,
    tags: ['Goa', 'Exciting', 'Road-trip']
  },
  {
    id: 'city-ooty',
    name: 'Tea Plantation',
    country: 'India',
    region: 'Ooty',
    description: 'Scenic Nilgiri mountain rail rides, sprawling tea gardens, and cool climate retreats.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    cost_index: 2800,
    latitude: 11.4102,
    longitude: 76.6950,
    rating: 4.6,
    reviewCount: 278,
    tags: ['Best of 2019', 'Recommended', 'Road-trip']
  },
  {
    id: 'city-ladakh',
    name: 'Ladakh',
    country: 'India',
    region: 'Ladakh',
    description: 'High-altitude mountain passes, azure Pangong Tso lake, and ancient Buddhist monasteries.',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    cost_index: 5500,
    latitude: 34.1526,
    longitude: 77.5771,
    rating: 4.9,
    reviewCount: 610,
    tags: ['Ladakh', 'Adventurous', 'Exciting']
  },
  {
    id: 'city-andaman',
    name: 'Havelock Island',
    country: 'India',
    region: 'Andaman',
    description: 'Pristine Radhanagar Beach, turquoise waters, scuba diving, and coral reef exploration.',
    image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80',
    cost_index: 6200,
    latitude: 11.9761,
    longitude: 92.9876,
    rating: 4.8,
    reviewCount: 415,
    tags: ['Andaman', 'Romantic', 'Exciting']
  },
  {
    id: 'city-rishikesh',
    name: 'Rishikesh',
    country: 'India',
    region: 'Rishikesh',
    description: 'Yoga capital of the world with white water rafting on the holy Ganges River.',
    image: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=800&q=80',
    cost_index: 1800,
    latitude: 30.0869,
    longitude: 78.2676,
    rating: 4.6,
    reviewCount: 730,
    tags: ['Rishikesh', 'Adventurous']
  },
  {
    id: 'city-paris',
    name: 'Paris',
    country: 'France',
    region: 'World',
    description: 'The City of Light featuring Eiffel Tower, Louvre Museum, and romantic Seine cruises.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    cost_index: 12000,
    latitude: 48.8566,
    longitude: 2.3522,
    rating: 4.9,
    reviewCount: 1540,
    tags: ['World', 'Romantic']
  }
];

export const UPCOMING_TRIP_DATA: Trip = {
  id: 'trip-upcoming-001',
  user_id: CURRENT_HOME_USER.id,
  name: 'Munnar & Kerala Hills Expedition',
  description: 'Relaxing 3 days / 4 nights trip through tea gardens, spice plantations, and serene hills.',
  cover_image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
  start_date: '2026-12-25',
  end_date: '2026-12-29',
  budget: 36000,
  status: 'UPCOMING',
  is_public: true,
  share_slug: 'munnar-kerala-dec25',
  created_at: '2026-08-01T10:00:00Z',
  updated_at: '2026-08-15T12:00:00Z',
  stops: [
    {
      id: 'stop-01',
      trip_id: 'trip-upcoming-001',
      city_id: 'city-hyderabad',
      start_date: '2026-12-25',
      end_date: '2026-12-25',
      position: 1,
      budget: 5000,
      notes: 'Flight departure from Rajiv Gandhi Intl Airport',
      city: {
        id: 'city-hyderabad',
        name: 'Hyderabad',
        country: 'India',
        region: 'Telangana',
        description: 'City of Pearls',
        image: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=800&q=80',
        cost_index: 2000,
        latitude: 17.3850,
        longitude: 78.4867
      }
    },
    {
      id: 'stop-02',
      trip_id: 'trip-upcoming-001',
      city_id: 'city-munnar',
      start_date: '2026-12-25',
      end_date: '2026-12-29',
      position: 2,
      budget: 31000,
      notes: 'Resort stay at Tea Valley',
      city: POPULAR_CITIES[0]
    }
  ]
};

export const USER_PREVIOUS_TRIPS: Trip[] = [
  UPCOMING_TRIP_DATA,
  {
    id: 'trip-past-001',
    user_id: CURRENT_HOME_USER.id,
    name: 'Goa Coastal Getaway',
    description: 'Beach hopping, water sports, and Portuguese heritage exploration in South Goa.',
    cover_image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    start_date: '2026-11-10',
    end_date: '2026-11-15',
    budget: 28000,
    status: 'COMPLETED',
    is_public: true,
    share_slug: 'goa-coastal-nov26',
    created_at: '2026-10-01T08:00:00Z',
    stops: [
      {
        id: 'stop-goa-1',
        trip_id: 'trip-past-001',
        city_id: 'city-goa',
        start_date: '2026-11-10',
        end_date: '2026-11-15',
        position: 1,
        budget: 28000,
        city: POPULAR_CITIES[2]
      }
    ]
  },
  {
    id: 'trip-past-002',
    user_id: CURRENT_HOME_USER.id,
    name: 'Ladakh High Passes Roadtrip',
    description: 'Conquering Khardung La, camping at Pangong Tso lake, and visiting Nubra Valley.',
    cover_image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    start_date: '2026-08-15',
    end_date: '2026-08-25',
    budget: 55000,
    status: 'ONGOING',
    is_public: true,
    share_slug: 'ladakh-expedition-2026',
    created_at: '2026-07-15T09:00:00Z',
    stops: [
      {
        id: 'stop-ladakh-1',
        trip_id: 'trip-past-002',
        city_id: 'city-ladakh',
        start_date: '2026-08-15',
        end_date: '2026-08-25',
        position: 1,
        budget: 55000,
        city: POPULAR_CITIES[4]
      }
    ]
  },
  {
    id: 'trip-past-003',
    user_id: CURRENT_HOME_USER.id,
    name: 'Rishikesh Spiritual & Rafting Trail',
    description: 'White water rafting, Ganga Aarti at Triveni Ghat, and cliff jumping in Shivpuri.',
    cover_image: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=800&q=80',
    start_date: '2026-05-01',
    end_date: '2026-05-05',
    budget: 18000,
    status: 'COMPLETED',
    is_public: false,
    share_slug: 'rishikesh-rafting-may26',
    created_at: '2026-04-10T11:00:00Z',
    stops: [
      {
        id: 'stop-rishikesh-1',
        trip_id: 'trip-past-003',
        city_id: 'city-rishikesh',
        start_date: '2026-05-01',
        end_date: '2026-05-05',
        position: 1,
        budget: 18000,
        city: POPULAR_CITIES[6]
      }
    ]
  }
];

export const YEARLY_WISHLIST: YearlyWishlistItem[] = [
  { id: 'w1', title: 'To buy a coffee in Paris', completed: true },
  { id: 'w2', title: 'To get to the Big Mountain in Ladakh', completed: false },
  { id: 'w3', title: 'To eat at an authentic Japanese ramen house in Kyoto', completed: false },
  { id: 'w4', title: 'To swim with sea turtles in Andaman', completed: false }
];

export const FRIENDS_TRIP_COLLABORATORS: TripCollaborator[] = [
  {
    id: 'collab-1',
    trip_id: 'trip-upcoming-001',
    user_id: 'usr-mari',
    role: 'EDITOR',
    user: {
      id: 'usr-mari',
      name: 'Mari Fernandes',
      email: 'mari@globetrotter.io',
      profile_image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
    }
  },
  {
    id: 'collab-2',
    trip_id: 'trip-upcoming-001',
    user_id: 'usr-lara',
    role: 'VIEWER',
    user: {
      id: 'usr-lara',
      name: 'Lara Olsen',
      email: 'lara@globetrotter.io',
      profile_image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80'
    }
  },
  {
    id: 'collab-3',
    trip_id: 'trip-upcoming-001',
    user_id: 'usr-eric',
    role: 'EDITOR',
    user: {
      id: 'usr-eric',
      name: 'Eric Garcia',
      email: 'eric@globetrotter.io',
      profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    }
  }
];
