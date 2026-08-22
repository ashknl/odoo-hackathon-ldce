import { Destination, TravelPackage, JournalEntry, Testimonial } from '../types/travel';

export const POPULAR_CITIES = [
  'Tokyo', 'Kyoto', 'Paris', 'Rome', 'Florence', 'Barcelona', 
  'Lucerne', 'Zurich', 'Bali', 'Ubud', 'Bangkok', 'Amsterdam', 'New York', 'Montreal'
];

export const DESTINATIONS: Destination[] = [
  {
    id: 'japan-golden-route',
    title: 'Tokyo, Kyoto & Osaka Golden Route',
    subtitle: 'High-speed Shinkansen transit, historic shrines & modern culinary alleys',
    city: 'Tokyo & Kyoto',
    country: 'Japan',
    countryCode: 'JP',
    region: 'East Asia',
    costIndex: 'Moderate',
    popularityScore: 98,
    idealDuration: '8-10 Days',
    avgDailyCost: 165,
    rating: 4.96,
    reviewCount: 428,
    priceFrom: 1480,
    originalPrice: 1750,
    tag: 'Top Multi-City Pick',
    featured: true,
    categories: ['Multi-City', 'Cultural', 'Culinary'],
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Explore the neon-lit districts of Shibuya and Shinjuku, take the bullet train past Mount Fuji, and wander through the thousand vermilion torii gates of Fushimi Inari in ancient Kyoto.',
    bestSeason: 'March — May & Oct — Nov',
    currency: 'JPY (¥)',
    sampleMultiCityStops: ['Tokyo (3d)', 'Hakone (1d)', 'Kyoto (3d)', 'Osaka (2d)'],
    topActivities: [
      { id: 'act-1', name: 'JR Shinkansen Bullet Train Transit', category: 'Sightseeing', cost: 130, duration: '2.5 hrs', rating: 4.9, description: 'High-speed transit between Tokyo and Kyoto with Mount Fuji views.' },
      { id: 'act-2', name: 'Kyoto Bamboo Forest & Tenryu-ji', category: 'Culture & Arts', cost: 25, duration: '3 hrs', rating: 4.8, description: 'Guided walking tour through Arashiyama and UNESCO heritage zen gardens.' },
      { id: 'act-3', name: 'Tsukiji Outer Market Food Tour', category: 'Food & Dining', cost: 45, duration: '2 hrs', rating: 4.9, description: 'Fresh sashimi, wagyu skewers, and matcha tasting with local foodies.' },
      { id: 'act-4', name: 'Dotonbori Street Food Odyssey', category: 'Food & Dining', cost: 35, duration: '2.5 hrs', rating: 4.9, description: 'Takoyaki and okonomiyaki evening crawl in vibrant Osaka.' }
    ],
    itinerary: [
      {
        day: 1,
        city: 'Tokyo',
        title: 'Arrival & Shibuya Crossing Sunset',
        description: 'Check into your hotel, stroll through Meiji Jingu shrine, and witness the energetic pulse of Shibuya Crossing at twilight.',
        estimatedCost: 140,
        lodging: 'Hotel Gracery Shinjuku',
        transport: 'Narita Express Rail Pass',
        highlights: ['Shibuya Sky Observation', 'Harajuku street culture', 'Ramen dinner']
      },
      {
        day: 2,
        city: 'Tokyo',
        title: 'Old & New: Asakusa to Akihabara',
        description: 'Explore Senso-ji temple in the morning, cruise the Sumida River, and dive into electronics and anime culture.',
        estimatedCost: 110,
        lodging: 'Hotel Gracery Shinjuku',
        highlights: ['Senso-ji Temple', 'Tokyo Skytree view', 'Sumida River Boat']
      },
      {
        day: 3,
        city: 'Kyoto',
        title: 'Shinkansen to Kyoto & Fushimi Inari',
        description: 'Ride the bullet train to Kyoto. Afternoon hike through thousands of vermilion gates at Fushimi Inari Taisha.',
        estimatedCost: 195,
        lodging: 'Kyoto Machiya Townhouse',
        transport: 'Tokaido Shinkansen (2h 15m)',
        highlights: ['Fushimi Inari sunset hike', 'Gion geisha district walk', 'Kaiseki dinner']
      },
      {
        day: 4,
        city: 'Kyoto',
        title: 'Golden Pavilion & Arashiyama Groves',
        description: 'Marvel at Kinkaku-ji temple reflected in the pond, followed by a peaceful walk in the Arashiyama bamboo forest.',
        estimatedCost: 120,
        lodging: 'Kyoto Machiya Townhouse',
        highlights: ['Kinkaku-ji Golden Temple', 'Tenryu-ji zen temple', 'Matcha ceremony']
      },
      {
        day: 5,
        city: 'Osaka',
        title: 'Osaka Castle & Dotonbori Night Market',
        description: 'Short 30-minute train to Osaka. Tour the grand castle grounds and finish with vibrant street food along Dotonbori canal.',
        estimatedCost: 130,
        lodging: 'Cross Hotel Osaka',
        transport: 'JR Local Line (30m)',
        highlights: ['Osaka Castle grounds', 'Kuromon Ichiba Market', 'Dotonbori food tasting']
      }
    ]
  },
  {
    id: 'italy-classic-voyage',
    title: 'Rome, Florence & Amalfi Coast',
    subtitle: 'Colosseum wonders, Renaissance masterworks & cliffside Mediterranean vistas',
    city: 'Rome, Florence & Positano',
    country: 'Italy',
    countryCode: 'IT',
    region: 'Southern Europe',
    costIndex: 'Moderate',
    popularityScore: 97,
    idealDuration: '7-9 Days',
    avgDailyCost: 155,
    rating: 4.94,
    reviewCount: 382,
    priceFrom: 1340,
    originalPrice: 1590,
    tag: 'Cultural Essential',
    featured: true,
    categories: ['Multi-City', 'Cultural', 'Coastal & Island'],
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Immerse in the timeless wonder of Rome’s ancient monuments, admire Michelangelo’s David in Florence, and cruise past pastel-colored villages along the Amalfi coast.',
    bestSeason: 'April — June & Sept — Oct',
    currency: 'EUR (€)',
    sampleMultiCityStops: ['Rome (3d)', 'Florence (2d)', 'Naples/Amalfi (3d)'],
    topActivities: [
      { id: 'act-it-1', name: 'Colosseum & Roman Forum VIP Access', category: 'Culture & Arts', cost: 65, duration: '3 hrs', rating: 4.9, description: 'Skip-the-line guided access to the gladiatorial arena floor and ancient ruins.' },
      { id: 'act-it-2', name: 'Frecciarossa High-Speed Rail', category: 'Sightseeing', cost: 45, duration: '1.5 hrs', rating: 4.8, description: 'Comfortable 300 km/h train connecting Rome Termini and Florence SMN.' },
      { id: 'act-it-3', name: 'Uffizi Gallery Renaissance Tour', category: 'Culture & Arts', cost: 50, duration: '2.5 hrs', rating: 4.8, description: 'Masterpieces by Botticelli, da Vinci, and Caravaggio.' },
      { id: 'act-it-4', name: 'Positano & Amalfi Coast Catamaran', category: 'Day Trip', cost: 95, duration: '4 hrs', rating: 4.9, description: 'Scenic boat cruise with swim stops and limoncello tastings.' }
    ],
    itinerary: [
      {
        day: 1,
        city: 'Rome',
        title: 'Arrival & Piazza Navona Sunset Walk',
        description: 'Arrive in the Eternal City. Evening stroll through Campo de’ Fiori, the Pantheon, and gelato at Piazza Navona.',
        estimatedCost: 135,
        lodging: 'Hotel Artemide Rome',
        highlights: ['Pantheon dome interior', 'Trevi Fountain night illumination', 'Authentic Cacio e Pepe']
      },
      {
        day: 2,
        city: 'Rome',
        title: 'Colosseum & Vatican City Museums',
        description: 'Morning exploration of the Colosseum followed by afternoon in the Vatican Museums and Sistine Chapel.',
        estimatedCost: 160,
        lodging: 'Hotel Artemide Rome',
        highlights: ['Colosseum Arena', 'Sistine Chapel ceiling', 'St. Peter’s Basilica']
      },
      {
        day: 3,
        city: 'Florence',
        title: 'High-Speed Rail to Florence & Duomo Views',
        description: 'Board the Frecciarossa train to Tuscany. Climb the Duomo cupola and watch the sunset from Piazzale Michelangelo.',
        estimatedCost: 180,
        lodging: 'Grand Hotel Cavour Florence',
        transport: 'Frecciarossa Express (1h 35m)',
        highlights: ['Duomo Brunelleschi Cupola', 'Ponte Vecchio walk', 'Florentine steak dinner']
      },
      {
        day: 4,
        city: 'Florence',
        title: 'Uffizi Masterpieces & Tuscan Wine Tasting',
        description: 'Discover Renaissance masterpieces in the morning, followed by an afternoon Chianti vineyard day trip.',
        estimatedCost: 145,
        lodging: 'Grand Hotel Cavour Florence',
        highlights: ['Uffizi Gallery', 'Chianti Classico tasting', 'San Miniato al Monte']
      },
      {
        day: 5,
        city: 'Amalfi Coast',
        title: 'Naples Transit & Positano Cliffside Vista',
        description: 'Scenic journey south to the Amalfi Coast. Check into your cliffside terrace hotel overlooking the azure Tyrrhenian Sea.',
        estimatedCost: 190,
        lodging: 'Hotel Poseidon Positano',
        transport: 'High-speed rail + coastal ferry',
        highlights: ['Positano beach panorama', 'Fresh seafood pasta', 'Sunset aperitivo']
      }
    ]
  },
  {
    id: 'france-switzerland-alpine',
    title: 'Paris, Lucerne & Swiss Alps Circuit',
    subtitle: 'Haussmann boulevards, Lake Lucerne steamers & snow-draped alpine peaks',
    city: 'Paris, Lucerne & Interlaken',
    country: 'France & Switzerland',
    countryCode: 'FR/CH',
    region: 'Central Europe',
    costIndex: 'High',
    popularityScore: 96,
    idealDuration: '8-11 Days',
    avgDailyCost: 210,
    rating: 4.95,
    reviewCount: 312,
    priceFrom: 1890,
    originalPrice: 2200,
    tag: 'Scenic Grandeur',
    featured: true,
    categories: ['Multi-City', 'Nature & Scenic', 'Cultural'],
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Combine the romantic urban elegance of Paris with the dramatic mountain lakes and cogwheel railways of the Swiss Jungfrau region.',
    bestSeason: 'May — October',
    currency: 'EUR (€) / CHF (Fr)',
    sampleMultiCityStops: ['Paris (3d)', 'Basel (1d)', 'Lucerne (2d)', 'Interlaken/Grindelwald (3d)'],
    topActivities: [
      { id: 'act-fr-1', name: 'Louvre Museum Guided Discovery', category: 'Culture & Arts', cost: 60, duration: '2.5 hrs', rating: 4.8, description: 'Explore the Mona Lisa and Venus de Milo with an expert historian.' },
      { id: 'act-fr-2', name: 'TGV Lyria High-Speed Cross-Border', category: 'Sightseeing', cost: 95, duration: '3 hrs', rating: 4.9, description: 'Smooth 320 km/h train connection from Paris Gare de Lyon to Zurich/Basel.' },
      { id: 'act-fr-3', name: 'Mount Pilatus Golden Roundtrip', category: 'Day Trip', cost: 85, duration: '4 hrs', rating: 4.9, description: 'Lake Lucerne boat cruise, world’s steepest cogwheel railway, and cable car.' },
      { id: 'act-fr-4', name: 'Jungfraujoch Top of Europe Train', category: 'Sightseeing', cost: 160, duration: '5 hrs', rating: 4.9, description: 'Europe’s highest railway station (3,454m) with Aletsch Glacier ice palace.' }
    ],
    itinerary: [
      {
        day: 1,
        city: 'Paris',
        title: 'Seine River Cruise & Eiffel Tower Lights',
        description: 'Arrive in Paris, stroll the Latin Quarter, and enjoy an evening glass-canopy boat cruise on the Seine.',
        estimatedCost: 175,
        lodging: 'Hotel Le Marais Paris',
        highlights: ['Seine River Cruise', 'Eiffel Tower sparkle', 'French Bistro dinner']
      },
      {
        day: 2,
        city: 'Paris',
        title: 'Louvre Treasures & Montmartre Artists',
        description: 'Morning at the Louvre, afternoon at Sacré-Cœur with sweeping rooftop views across Paris.',
        estimatedCost: 150,
        lodging: 'Hotel Le Marais Paris',
        highlights: ['Louvre masterpieces', 'Montmartre artist square', 'Fresh macarons']
      },
      {
        day: 3,
        city: 'Lucerne',
        title: 'TGV into Switzerland & Chapel Bridge Walk',
        description: 'Board the TGV train through the French countryside to lakeside Lucerne. Walk the 14th-century wooden Chapel Bridge.',
        estimatedCost: 220,
        lodging: 'Hotel des Balances Lucerne',
        transport: 'TGV Lyria + Swiss Federal Rail (3h 40m)',
        highlights: ['TGV scenic ride', 'Chapel Bridge & Water Tower', 'Lake Lucerne promenade']
      },
      {
        day: 4,
        city: 'Interlaken',
        title: 'Jungfrau Alpine Valleys & Grindelwald First',
        description: 'Scenic train into the Bernese Oberland. Ride the Eiger Express gondola to alpine hiking trails.',
        estimatedCost: 240,
        lodging: 'Romantik Hotel Schweizerhof',
        transport: 'Swiss Panoramic Train (1h 15m)',
        highlights: ['Eiger North Face views', 'Grindelwald Cliff Walk', 'Swiss cheese fondue']
      }
    ]
  },
  {
    id: 'bali-ubud-island',
    title: 'Bali, Ubud & Nusa Penida Escape',
    subtitle: 'Terraced emerald rice paddies, cliffside temples & tropical manta ray lagoons',
    city: 'Seminyak, Ubud & Nusa Penida',
    country: 'Indonesia',
    countryCode: 'ID',
    region: 'Southeast Asia',
    costIndex: 'Budget',
    popularityScore: 94,
    idealDuration: '6-8 Days',
    avgDailyCost: 85,
    rating: 4.92,
    reviewCount: 350,
    priceFrom: 690,
    originalPrice: 850,
    tag: 'Budget Favorite',
    featured: false,
    categories: ['Multi-City', 'Nature & Scenic', 'Coastal & Island'],
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Find inner balance among the lush jungle canopies of Ubud, explore sacred water temples, and sail to the dramatic T-Rex cliffs of Nusa Penida.',
    bestSeason: 'April — October',
    currency: 'IDR (Rp)',
    sampleMultiCityStops: ['Seminyak (2d)', 'Ubud (3d)', 'Nusa Penida (2d)'],
    topActivities: [
      { id: 'act-ba-1', name: 'Tegallalang Rice Terraces & Swing', category: 'Sightseeing', cost: 18, duration: '2.5 hrs', rating: 4.8, description: 'UNESCO nominated cascading rice fields and jungle photography.' },
      { id: 'act-ba-2', name: 'Nusa Penida Speedboat & Snorkel', category: 'Day Trip', cost: 55, duration: '6 hrs', rating: 4.9, description: 'Manta Point swimming, Kelingking Beach, and Broken Beach.' },
      { id: 'act-ba-3', name: 'Balinese Cooking & Organic Farm Tour', category: 'Food & Dining', cost: 28, duration: '3 hrs', rating: 4.9, description: 'Traditional market shopping and 5-course heritage feast.' }
    ],
    itinerary: [
      {
        day: 1,
        city: 'Seminyak',
        title: 'Tropical Welcome & Sunset Beach Club',
        description: 'Land in Denpasar, transfer to your private pool villa, and relax along Seminyak beach.',
        estimatedCost: 75,
        lodging: 'The Seminyak Beach Resort',
        highlights: ['Private villa check-in', 'Sunset cocktails', 'Fresh grilled seafood']
      },
      {
        day: 2,
        city: 'Ubud',
        title: 'Sacred Monkey Forest & Artisan Markets',
        description: 'Travel into the jungle heart of Ubud. Tour the monkey sanctuary and discover handmade craft markets.',
        estimatedCost: 80,
        lodging: 'Kamandalu Ubud Resort',
        highlights: ['Sacred Monkey Forest', 'Ubud Art Market', 'Traditional Balinese dance']
      },
      {
        day: 3,
        city: 'Nusa Penida',
        title: 'Speedboat to Kelingking Cliff & Manta Lagoon',
        description: 'Early morning speedboat to Nusa Penida. Gaze down at the turquoise waters of Kelingking cliff.',
        estimatedCost: 95,
        lodging: 'Semabu Hills Nusa Penida',
        highlights: ['Kelingking T-Rex viewpoint', 'Snorkeling with Manta rays', 'Crystal Bay sunset']
      }
    ]
  },
  {
    id: 'spain-barcelona-costa',
    title: 'Barcelona & Costa Brava Coastal Trail',
    subtitle: 'Gaudí architectural dreams, tapas crawls & Mediterranean coves',
    city: 'Barcelona & Girona',
    country: 'Spain',
    countryCode: 'ES',
    region: 'Southern Europe',
    costIndex: 'Moderate',
    popularityScore: 93,
    idealDuration: '6-8 Days',
    avgDailyCost: 140,
    rating: 4.91,
    reviewCount: 275,
    priceFrom: 1120,
    originalPrice: 1350,
    tag: 'Architecture & Sun',
    featured: false,
    categories: ['Multi-City', 'Cultural', 'Culinary'],
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Marvel at the stained glass symphonies of Sagrada Família, stroll through Park Güell, and unwind in secluded Mediterranean coves.',
    bestSeason: 'May — October',
    currency: 'EUR (€)',
    sampleMultiCityStops: ['Barcelona (3d)', 'Girona (1d)', 'Cadaqués / Costa Brava (2d)'],
    topActivities: [
      { id: 'act-sp-1', name: 'Sagrada Família Tower Tour', category: 'Culture & Arts', cost: 42, duration: '2 hrs', rating: 4.9, description: 'Skip-the-line entry with audio guide and Nativity tower access.' },
      { id: 'act-sp-2', name: 'El Born & Gothic Quarter Tapas Crawl', category: 'Food & Dining', cost: 55, duration: '3 hrs', rating: 4.9, description: 'Ibérico ham, patatas bravas, and vermouth tasting.' },
      { id: 'act-sp-3', name: 'Girona Medieval Walls & Jewish Quarter', category: 'Day Trip', cost: 35, duration: '4 hrs', rating: 4.8, description: 'Historic Game of Thrones filming locations and Cathedral.' }
    ],
    itinerary: [
      {
        day: 1,
        city: 'Barcelona',
        title: 'Gothic Quarter & Passeig de Gràcia',
        description: 'Explore the narrow medieval alleyways of the Gothic Quarter and see Gaudí’s Casa Batlló exterior.',
        estimatedCost: 125,
        lodging: 'H10 Cubik Barcelona',
        highlights: ['Barcelona Cathedral', 'Tapas dinner in El Born', 'Plaça Reial']
      },
      {
        day: 2,
        city: 'Barcelona',
        title: 'Sagrada Família & Park Güell Magic',
        description: 'Spend the morning inside Gaudí’s masterwork basilica and afternoon at the mosaic terrace of Park Güell.',
        estimatedCost: 145,
        lodging: 'H10 Cubik Barcelona',
        highlights: ['Sagrada Família interior', 'Park Güell skyline view', 'Barceloneta beach walk']
      },
      {
        day: 3,
        city: 'Costa Brava',
        title: 'Girona Medieval Walls & Secluded Coves',
        description: 'Short express train to Girona, followed by a coastal drive to the whitewashed fishing village of Cadaqués.',
        estimatedCost: 160,
        lodging: 'Hotel Playa Sol Cadaqués',
        highlights: ['Girona Roman walls', 'Salvador Dalí House visit', 'Mediterranean paella']
      }
    ]
  },
  {
    id: 'usa-canada-crossborder',
    title: 'New York, Boston & Montreal Corridor',
    subtitle: 'Broadway skylines, historic Freedom Trail & French-Canadian charm',
    city: 'New York, Boston & Montreal',
    country: 'USA & Canada',
    countryCode: 'US/CA',
    region: 'North America',
    costIndex: 'High',
    popularityScore: 91,
    idealDuration: '7-10 Days',
    avgDailyCost: 225,
    rating: 4.89,
    reviewCount: 210,
    priceFrom: 1650,
    originalPrice: 1950,
    tag: 'East Coast Circuit',
    featured: false,
    categories: ['Multi-City', 'Urban & Modern', 'Cultural'],
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Experience Manhattan’s iconic skyscrapers, explore Boston’s historic university campuses, and savor poutine and Old Port cobblestones in Montreal.',
    bestSeason: 'June — October',
    currency: 'USD ($) / CAD ($)',
    sampleMultiCityStops: ['New York (3d)', 'Boston (2d)', 'Montreal (3d)'],
    topActivities: [
      { id: 'act-us-1', name: 'High Line & Summit One Vanderbilt', category: 'Sightseeing', cost: 52, duration: '3 hrs', rating: 4.9, description: 'Interactive multi-sensory glass observatory overlooking the Manhattan skyline.' },
      { id: 'act-us-2', name: 'Amtrak Acela Express Transit', category: 'Sightseeing', cost: 75, duration: '3.5 hrs', rating: 4.8, description: 'Comfortable rail journey connecting New York Penn to Boston South Station.' },
      { id: 'act-us-3', name: 'Old Montreal Historic Food Tour', category: 'Food & Dining', cost: 65, duration: '3 hrs', rating: 4.9, description: 'Fresh bagels, maple pastries, artisan cheeses, and smoked meats.' }
    ],
    itinerary: [
      {
        day: 1,
        city: 'New York',
        title: 'Central Park, Broadway & Times Square',
        description: 'Stroll through Central Park, take in the views from Top of the Rock, and catch an evening Broadway show.',
        estimatedCost: 230,
        lodging: 'Arlo Midtown NYC',
        highlights: ['Central Park Bow Bridge', 'Top of the Rock', 'Broadway theater']
      },
      {
        day: 2,
        city: 'Boston',
        title: 'Amtrak to Boston & Freedom Trail Walk',
        description: 'Board the morning Amtrak to Boston. Follow the red brick Freedom Trail and tour Harvard Yard.',
        estimatedCost: 210,
        lodging: 'The Godfrey Hotel Boston',
        transport: 'Amtrak Acela (3h 40m)',
        highlights: ['Boston Common', 'Freedom Trail landmarks', 'New England Clam Chowder']
      },
      {
        day: 3,
        city: 'Montreal',
        title: 'Cross to Canada & Old Montreal Charm',
        description: 'Arrive in Montreal. Explore Notre-Dame Basilica and savor dinner in the historic cobblestone Old Port.',
        estimatedCost: 190,
        lodging: 'Hotel Nelligan Montreal',
        highlights: ['Notre-Dame Basilica', 'Mont-Royal viewpoint', 'Smoked meat dinner']
      }
    ]
  }
];

export const TRAVEL_PACKAGES: TravelPackage[] = [
  {
    id: 'pkg-japan-golden-shinkansen',
    title: 'The Great Japan Golden Corridor',
    subtitle: 'Tokyo · Hakone Onsen · Kyoto Shrines · Osaka Kitchen',
    category: 'Multi-City',
    destination: 'Japan Multi-City',
    country: 'Japan',
    cities: ['Tokyo', 'Hakone', 'Kyoto', 'Osaka'],
    stopsCount: 4,
    price: 1850,
    originalPrice: 2200,
    days: 9,
    nights: 8,
    avgCostPerDay: 205,
    rating: 4.98,
    reviewCount: 164,
    copiedCount: 840,
    author: {
      name: 'Kenji Sato',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    budgetBreakdown: {
      stay: 780,
      transport: 380,
      activities: 310,
      meals: 380
    },
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=85',
    inclusions: [
      '7-Day JR All-Japan Rail Pass (Unlimited Shinkansen)',
      'Traditional Ryokan Stay with Kaiseki Dinner in Hakone',
      'Curated Day-wise Digital Itinerary with offline maps',
      'Fushimi Inari & Arashiyama Guided Walking Pass',
      'Automated Multi-currency Expense Tracker'
    ],
    itinerary: [
      {
        day: 1,
        city: 'Tokyo',
        title: 'Arrival in Tokyo & Shinjuku Neon Night Walk',
        description: 'Land at Haneda/Narita, activate your JR Pass, and take an evening walk through Omoide Yokocho.',
        estimatedCost: 140,
        highlights: ['Shinjuku neon view', 'Tokyo Metropolitan Government building', 'Ramen tasting']
      },
      {
        day: 2,
        city: 'Tokyo',
        title: 'Meiji Shrine, Harajuku & teamLab Planets',
        description: 'Morning serenity in Yoyogi park followed by the world-famous immersive digital art museum.',
        estimatedCost: 170,
        highlights: ['teamLab Planets ticket', 'Meiji Jingu garden', 'Shibuya sunset']
      },
      {
        day: 3,
        city: 'Hakone',
        title: 'Romancecar to Mt. Fuji Views & Onsen Retreat',
        description: 'Travel to Hakone. Cruise Lake Ashi on a pirate ship and soak in mineral hot spring baths with Mt. Fuji backdrop.',
        estimatedCost: 260,
        lodging: 'Hakone Kowakien Ten-yu (Ryokan)',
        highlights: ['Lake Ashi cruise', 'Hakone Ropeway', 'Multi-course Kaiseki dinner']
      },
      {
        day: 4,
        city: 'Kyoto',
        title: 'Shinkansen to Kyoto & Gion Geisha District',
        description: 'Morning bullet train to Kyoto. Explore traditional wooden machiya townhouses in historic Gion.',
        estimatedCost: 190,
        highlights: ['Bullet train travel', 'Gion Shirakawa canal', 'Yasaka Shrine']
      },
      {
        day: 5,
        city: 'Kyoto',
        title: 'Kiyomizu-dera & Fushimi Inari Vermilion Paths',
        description: 'Sunrise at Kiyomizu-dera wooden terrace, followed by hiking through 10,000 torii gates.',
        estimatedCost: 120,
        highlights: ['Kiyomizu-dera wooden stage', 'Fushimi Inari hike', 'Matcha parfait']
      },
      {
        day: 6,
        city: 'Osaka',
        title: 'Osaka Castle & Dotonbori Street Food Paradise',
        description: 'Head to Japan’s food capital. Sample authentic Takoyaki and Kushikatsu along the vibrant canal.',
        estimatedCost: 150,
        highlights: ['Osaka Castle panoramic deck', 'Dotonbori Glico sign', 'Street food crawl']
      }
    ]
  },
  {
    id: 'pkg-europe-grand-circuit',
    title: 'Classic European Grand Tour',
    subtitle: 'Paris · Lucerne · Florence · Rome',
    category: 'Multi-City',
    destination: 'Western Europe Circuit',
    country: 'France, Switzerland, Italy',
    cities: ['Paris', 'Lucerne', 'Florence', 'Rome'],
    stopsCount: 4,
    price: 2450,
    originalPrice: 2890,
    days: 12,
    nights: 11,
    avgCostPerDay: 204,
    rating: 4.96,
    reviewCount: 220,
    copiedCount: 1150,
    author: {
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
    },
    budgetBreakdown: {
      stay: 1100,
      transport: 480,
      activities: 420,
      meals: 450
    },
    image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=85',
    inclusions: [
      'Cross-Border Eurail High-Speed Pass (TGV + Frecciarossa)',
      'Handpicked 4-Star Boutique City Hotels near Transit Hubs',
      'VIP Skip-the-Line Louvre, Uffizi & Colosseum Entrances',
      'Lake Lucerne Panoramic Steamship Cruise',
      'Full Interactive Budget Calculator & Shared Itinerary Link'
    ],
    itinerary: [
      {
        day: 1,
        city: 'Paris',
        title: 'Arrival in Paris & Seine Champagne Cruise',
        description: 'Check in near Saint-Germain, enjoy an introductory evening cruise down the Seine under illuminated bridges.',
        estimatedCost: 180,
        highlights: ['Seine River Boat', 'Notre-Dame vista', 'French wine bar']
      },
      {
        day: 2,
        city: 'Paris',
        title: 'Louvre Masterpieces & Montmartre Sunset',
        description: 'VIP early entrance to the Louvre followed by twilight at Sacré-Cœur with views across Paris.',
        estimatedCost: 160,
        highlights: ['Louvre Museum', 'Sacré-Cœur panorama', 'Macaron bakery tour']
      },
      {
        day: 3,
        city: 'Lucerne',
        title: 'TGV into the Swiss Alps & Lake Promenade',
        description: 'High-speed rail to Lucerne. Walk the medieval Chapel Bridge and cruise the blue alpine lake.',
        estimatedCost: 240,
        highlights: ['TGV scenic ride', 'Chapel Bridge', 'Lake Lucerne boat']
      },
      {
        day: 4,
        city: 'Florence',
        title: 'Scenic Train to Tuscany & Duomo Sunset',
        description: 'Cross the Alps into Florence. Climb Brunelleschi’s dome and enjoy Florentine steak.',
        estimatedCost: 210,
        highlights: ['Duomo cupola', 'Piazzale Michelangelo sunset', 'Tuscan wine tasting']
      },
      {
        day: 5,
        city: 'Rome',
        title: 'Frecciarossa to Rome & Colosseum Forum',
        description: 'High-speed train to Rome. Tour the ancient Colosseum and Roman Forum with a certified historian.',
        estimatedCost: 230,
        highlights: ['Colosseum Arena', 'Roman Forum', 'Trevi Fountain night walk']
      }
    ]
  },
  {
    id: 'pkg-iberian-sun-culture',
    title: 'Iberian Splendors & Tapas Route',
    subtitle: 'Madrid · Seville · Granada · Barcelona',
    category: 'Multi-City',
    destination: 'Spain Multi-City',
    country: 'Spain',
    cities: ['Madrid', 'Seville', 'Granada', 'Barcelona'],
    stopsCount: 4,
    price: 1580,
    originalPrice: 1850,
    days: 10,
    nights: 9,
    avgCostPerDay: 158,
    rating: 4.93,
    reviewCount: 142,
    copiedCount: 620,
    author: {
      name: 'Carlos Mendez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    },
    budgetBreakdown: {
      stay: 680,
      transport: 310,
      activities: 290,
      meals: 300
    },
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=85',
    inclusions: [
      'Renfe AVE High-Speed Train Tickets across Andalusia & Cataluña',
      'Alhambra Palace & Nasrid Palaces Guaranteed Access Pass',
      'Authentic Flamenco Tablao Show in Seville with Sangria',
      'Gaudí Sagrada Família & Park Güell Guided Entrances',
      'Real-Time Daily Budget & Dining Suggestions'
    ],
    itinerary: [
      {
        day: 1,
        city: 'Madrid',
        title: 'Prado Museum & Royal Palace Gardens',
        description: 'Explore Velázquez and Goya in the Prado, stroll the Sabatini gardens, and enjoy tapas at Mercado de San Miguel.',
        estimatedCost: 140,
        highlights: ['Prado Museum', 'Royal Palace', 'San Miguel Tapas Market']
      },
      {
        day: 2,
        city: 'Seville',
        title: 'AVE to Seville & Santa Cruz Flamenco',
        description: 'High-speed AVE train south to sunny Seville. Tour the Real Alcázar and watch passionate live flamenco.',
        estimatedCost: 165,
        highlights: ['Real Alcázar palace', 'Plaza de España', 'Flamenco show']
      },
      {
        day: 3,
        city: 'Granada',
        title: 'The Mystical Alhambra & Albaicín Views',
        description: 'Travel to Granada. Marvel at the intricate Moorish stucco carvings of the Nasrid Palaces.',
        estimatedCost: 150,
        highlights: ['Alhambra Nasrid Palaces', 'Mirador de San Nicolás sunset', 'Tapas with every drink']
      },
      {
        day: 4,
        city: 'Barcelona',
        title: 'Flight to Barcelona & Sagrada Família Wonder',
        description: 'Arrive in Barcelona. Step inside Gaudí’s breathtaking forest of stone pillars and stained glass.',
        estimatedCost: 180,
        highlights: ['Sagrada Família', 'Park Güell sunset', 'Barceloneta seafood paella']
      }
    ]
  }
];

export const JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'journal-1',
    title: 'How We Planned a 3-City Japan Trip for Under $1,600',
    excerpt: 'A detailed breakdown of how using GlobeTrotter’s automatic budget estimator and Shinkansen schedule planner saved our group over $450 per person on transit and accommodations.',
    author: {
      name: 'Maya Lin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'GlobeTrotter Community Creator'
    },
    date: 'August 12, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80',
    category: 'Budget Strategy',
    location: 'Tokyo → Kyoto → Osaka',
    stops: ['Tokyo', 'Kyoto', 'Osaka']
  },
  {
    id: 'journal-2',
    title: 'The Art of Multi-City Itinerary Building: 5 Golden Rules',
    excerpt: 'Why packing too many stops ruins trips, how to calculate realistic transit buffers, and how visual timelines keep your travel days stress-free.',
    author: {
      name: 'David Krause',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      role: 'Travel Writer & Planner'
    },
    date: 'July 28, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1000&q=80',
    category: 'Planning Guide',
    location: 'Paris → Lucerne → Florence',
    stops: ['Paris', 'Lucerne', 'Florence']
  },
  {
    id: 'journal-3',
    title: 'Collaborative Travel: Planning an Italian Odyssey with 4 Friends',
    excerpt: 'Sharing public itinerary links, voting on daily activities, and tracking shared dining expenses without endless spreadsheet headaches.',
    author: {
      name: 'Sofia Rossi',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      role: 'Group Trip Leader'
    },
    date: 'July 14, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1000&q=80',
    category: 'Group Travel',
    location: 'Rome → Florence → Positano',
    stops: ['Rome', 'Florence', 'Positano']
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    author: 'Sarah & Mark Jenkins',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    role: 'Couple Travelers (10-Day Honeymoon)',
    location: 'San Francisco, CA',
    tripName: 'Tokyo, Kyoto & Hakone Golden Corridor',
    rating: 5,
    quote: 'GlobeTrotter took the overwhelm out of planning our multi-city trip. Adding stops, seeing the automatic budget breakdown per day, and knowing our exact transit times gave us total peace of mind.',
    verified: true,
    savedMoney: 'Saved $620 vs travel agency',
    date: 'July 2026'
  },
  {
    id: 'test-2',
    author: 'Dr. Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    role: 'Solo Adventurer & Photographer',
    location: 'London, UK',
    tripName: 'Paris, Lucerne & Bernese Oberland',
    rating: 5,
    quote: 'The timeline view is brilliant. I was able to reorder our train days, assign photography spots for sunrise, and share the live link with my family back home in one click.',
    verified: true,
    savedMoney: 'Stayed 100% within $2,200 budget',
    date: 'June 2026'
  },
  {
    id: 'test-3',
    author: 'Camila Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    role: 'Family Trip Planner (4 Pax)',
    location: 'Austin, TX',
    tripName: 'Madrid, Seville & Barcelona Circuit',
    rating: 5,
    quote: 'Being able to see estimated costs split by Stay, Transport, Activities, and Meals in real-time is a game-changer. We cloned an existing community itinerary and tailored it in 15 minutes!',
    verified: true,
    savedMoney: 'Cloned & customized in 15 min',
    date: 'May 2026'
  }
];

export const PLATFORM_STATS = [
  { value: '120K+', label: 'Itineraries Created', detail: 'Across 85+ countries worldwide' },
  { value: '450+', label: 'Cities Cataloged', detail: 'With cost indices and curated activities' },
  { value: '$2.4M', label: 'Traveler Budget Saved', detail: 'Via smart automatic estimation' },
  { value: '4.95★', label: 'Traveler Satisfaction', detail: 'From 18,000+ verified ratings' }
];

export const CORE_PILLARS = [
  {
    name: 'Multi-City Stop Management',
    desc: 'Add, reorder, and assign customized durations to each city stop with fluid drag-and-drop mechanics.',
    badge: 'Core Feature #1'
  },
  {
    name: 'Automated Budget Breakdown',
    desc: 'Instant financial projections across transport, stay, activities, and dining with average cost per day.',
    badge: 'Core Feature #2'
  },
  {
    name: 'Day-Wise Visual Timeline',
    desc: 'Review your journey on an interactive day-by-day calendar with scheduled activity blocks and times.',
    badge: 'Core Feature #3'
  },
  {
    name: 'Community & Sharable Links',
    desc: 'Publish public read-only itineraries, generate shareable links, or 1-click copy dream trips from others.',
    badge: 'Core Feature #4'
  }
];

export const POPULAR_PLACES = [
  {
    id: 'sc-mindanou',
    name: 'SC. Mindanou',
    location: 'Mindanou, Philippines',
    discount: '20% OFF',
    image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=800&q=80',
    price: 320,
    rating: 4.9,
    description: 'Emerald clear waters nestled amidst dramatic tropical karst peaks and pristine hidden lagoons.'
  },
  {
    id: 'disneyland-tokyo',
    name: 'Disneyland Tokyo',
    location: 'Tokyo, Japan',
    discount: '20% OFF',
    image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80',
    price: 280,
    rating: 4.9,
    description: 'Iconic enchanting theme park experience blending futuristic fantasy with classic storybook magic.'
  },
  {
    id: 'tousand-island',
    name: 'Tousand Island',
    location: 'Java, Indonesia',
    discount: '20% OFF',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    price: 240,
    rating: 4.8,
    description: 'Tropical archipelago of white sand atolls, coral reef sanctuaries, and peaceful turquoise sunsets.'
  },
  {
    id: 'basliika-santo',
    name: 'Basliika Santo',
    location: 'Venice, Italy',
    discount: '20% OFF',
    image: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=800&q=80',
    price: 390,
    rating: 4.95,
    description: 'Venetian grand canal masterpiece with domed baroque architecture reflecting on sunset waters.'
  }
];

export const SWEET_MEMORIES_DATA = {
  title: 'Travel to make sweet memories',
  subtitle: 'Find trips that fit a flexible lifestyle',
  steps: [
    {
      num: '01',
      title: 'Find trips that fit your freedom',
      description: 'Travelling offers freedom and flexibility, solitude and spontaneity, and privacy and purpose.'
    },
    {
      num: '02',
      title: 'Get back to nature by travel',
      description: "The world is a playground and you can finally explore Mother Nature's inimitable canvas."
    },
    {
      num: '03',
      title: 'Reignite those travel tastebuds',
      description: 'There are infinite reasons to love travel, one of them being the food, glorious food.'
    }
  ],
  heroImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80',
  reviews: [
    {
      name: 'Kamelia Diana',
      rating: 4.9,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80'
    },
    {
      name: 'Haikal Adam',
      rating: 4.9,
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=160&q=80'
    },
    {
      name: 'Joe Zefrano',
      rating: 4.9,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80'
    }
  ]
};

export const EXPLORE_MORE_PLACES = [
  {
    id: 'amalfi-coast',
    name: 'Amalfi Coast',
    location: 'Amalfi, Italy',
    pricePerPax: 148,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    category: 'Beach',
    description: 'Pastel cliffside villages cascading into the sparkling blue Tyrrhenian Sea.'
  },
  {
    id: 'taj-mahal',
    name: 'Taj Mahal',
    location: 'Agra, India',
    pricePerPax: 140,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
    category: 'Popular destination',
    description: 'Peerless marble mausoleum symbolizing eternal romance and Mughal architectural genius.'
  },
  {
    id: 'tanah-gajah',
    name: 'Tanah Gajah',
    location: 'Bali, Indonesia',
    pricePerPax: 148,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    category: 'Islands',
    description: 'Hot air balloon rides floating serenely over Ubud emerald rice paddies and shrines.'
  },
  {
    id: 'osaka-castle',
    name: 'Osaka Castle',
    location: 'Osaka, Japan',
    pricePerPax: 156,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=800&q=80',
    category: 'Popular destination',
    description: 'Historic tiered citadel crowned with gold ornaments and surrounded by cherry trees.'
  },
  {
    id: 'cape-reinga',
    name: 'Cape Reinga',
    location: 'Northland, New Zealand',
    pricePerPax: 164,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=800&q=80',
    category: 'Nation parks',
    description: 'Dramatic northern lighthouse overlooking where the Tasman Sea and Pacific Ocean collide.'
  },
  {
    id: 'sorrento-italy',
    name: 'Sorrento, Italy',
    location: 'Amalfi, Italy',
    pricePerPax: 172,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80',
    category: 'Beach',
    description: 'Citrus groves, historic piazza terraces, and cliffside panoramas of the Bay of Naples.'
  },
  {
    id: 'fuji-five-lakes',
    name: 'Lake Kawaguchiko',
    location: 'Yamanashi, Japan',
    pricePerPax: 135,
    rating: 4.95,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    category: 'Lake',
    description: 'Crystal calm lake mirror reflecting Mount Fuji framed by seasonal maple foliage.'
  },
  {
    id: 'siargao-cloud-9',
    name: 'Cloud 9 Surfing',
    location: 'Siargao, Philippines',
    pricePerPax: 125,
    rating: 4.85,
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80',
    category: 'Surfing',
    description: 'World-famous boardwalk and barreling ocean waves on a serene coconut palm island.'
  },
  {
    id: 'yosemite-valley',
    name: 'Yosemite Valley',
    location: 'California, USA',
    pricePerPax: 155,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=800&q=80',
    category: 'Camp',
    description: 'Towering granite monoliths, ancient sequoia groves, and starlit wilderness campgrounds.'
  }
];

export const ADVENTURE_STAMPS = [
  {
    id: 'paris',
    city: 'PARIS',
    country: 'France',
    landmark: 'Eiffel Tower',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
    description: 'City of lights, classical architecture, world-renowned cafes, and romantic boulevards.'
  },
  {
    id: 'new-york',
    city: 'NEW YORK',
    country: 'United States',
    landmark: 'Statue of Liberty',
    image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=600&q=80',
    description: 'High-energy metropolis with skyline views, Broadway theatres, and iconic urban energy.'
  },
  {
    id: 'seoul',
    city: 'SEOUL',
    country: 'South Korea',
    landmark: 'Gyeongbokgung Palace',
    image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=600&q=80',
    description: 'Dynamic harmony of royal Joseon dynastic palaces, futuristic design, and night markets.'
  },
  {
    id: 'bali',
    city: 'BALI',
    country: 'Indonesia',
    landmark: 'Ulun Danu Water Temple',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
    description: 'Island of gods with sacred lakeside temples, lush terraced hills, and peaceful traditions.'
  }
];
