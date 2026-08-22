import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
} from "drizzle-orm";

import { db } from "../db/connection.js";
import { cities } from "../db/schema/cities.js";
import { savedDestinations } from "../db/schema/savedDestinations.js";

import { resolveCity } from "./opentripmap.service.js";

const CITY_SEED = [
  {
    name: "Paris",
    country: "France",
    region: "Île-de-France",
    description:
      "The City of Light, known for its art, fashion and world-famous landmarks.",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    costIndex: "130",
    latitude: "48.8566000",
    longitude: "2.3522000",
    popular: true,
  },
  {
    name: "London",
    country: "United Kingdom",
    region: "England",
    description:
      "Historic capital blending royal heritage with modern culture.",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80",
    costIndex: "160",
    latitude: "51.5074000",
    longitude: "-0.1278000",
    popular: true,
  },
  {
    name: "New York",
    country: "United States",
    region: "New York",
    description:
      "The city that never sleeps, home to iconic skyline and diverse culture.",
    image:
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80",
    costIndex: "180",
    latitude: "40.7128000",
    longitude: "-74.0060000",
    popular: true,
  },
  {
    name: "Tokyo",
    country: "Japan",
    region: "Kanto",
    description:
      "A vibrant metropolis blending ultramodern skyscrapers with historic temples.",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",
    costIndex: "150",
    latitude: "35.6762000",
    longitude: "139.6503000",
    popular: true,
  },
  {
    name: "Rome",
    country: "Italy",
    region: "Lazio",
    description:
      "Eternal city of ancient ruins, Renaissance art and cuisine.",
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
    costIndex: "120",
    latitude: "41.9028000",
    longitude: "12.4964000",
    popular: true,
  },
  {
    name: "Barcelona",
    country: "Spain",
    region: "Catalonia",
    description:
      "Sunny Mediterranean city celebrated for Gaudí architecture and beaches.",
    image:
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80",
    costIndex: "110",
    latitude: "41.3851000",
    longitude: "2.1734000",
    popular: true,
  },
  {
    name: "Amsterdam",
    country: "Netherlands",
    region: "North Holland",
    description:
      "Canals, bicycles and world-class museums in a charming historic core.",
    image:
      "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=800&q=80",
    costIndex: "140",
    latitude: "52.3676000",
    longitude: "4.9041000",
    popular: true,
  },
  {
    name: "Dubai",
    country: "United Arab Emirates",
    region: "Dubai",
    description:
      "Futuristic skyline, luxury shopping and desert adventures.",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
    costIndex: "130",
    latitude: "25.2048000",
    longitude: "55.2708000",
    popular: true,
  },
  {
    name: "Singapore",
    country: "Singapore",
    region: "Singapore",
    description:
      "A garden city known for its clean streets, hawker food and skyline.",
    image:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80",
    costIndex: "170",
    latitude: "1.3521000",
    longitude: "103.8198000",
    popular: true,
  },
  {
    name: "Bangkok",
    country: "Thailand",
    region: "Central Thailand",
    description:
      "Bustling capital known for ornate temples and vibrant street life.",
    image:
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80",
    costIndex: "50",
    latitude: "13.7563000",
    longitude: "100.5018000",
    popular: true,
  },
  {
    name: "Istanbul",
    country: "Turkey",
    region: "Marmara",
    description:
      "Transcontinental city where East meets West across the Bosphorus.",
    image:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80",
    costIndex: "60",
    latitude: "41.0082000",
    longitude: "28.9784000",
    popular: true,
  },
  {
    name: "Prague",
    country: "Czechia",
    region: "Bohemia",
    description:
      "Fairy-tale old town of gothic spires and cobblestone lanes.",
    image:
      "https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=800&q=80",
    costIndex: "90",
    latitude: "50.0755000",
    longitude: "14.4378000",
    popular: true,
  },
  {
    name: "Vienna",
    country: "Austria",
    region: "Vienna",
    description:
      "Imperial palaces, coffeehouses and a celebrated classical music scene.",
    image:
      "https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=800&q=80",
    costIndex: "130",
    latitude: "48.2082000",
    longitude: "16.3738000",
    popular: true,
  },
  {
    name: "Athens",
    country: "Greece",
    region: "Attica",
    description:
      "Birthplace of democracy, crowned by the ancient Acropolis.",
    image:
      "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?auto=format&fit=crop&w=800&q=80",
    costIndex: "95",
    latitude: "37.9838000",
    longitude: "23.7275000",
    popular: true,
  },
  {
    name: "Lisbon",
    country: "Portugal",
    region: "Lisbon",
    description:
      "Hilly coastal capital of pastel facades, trams and fado music.",
    image:
      "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?auto=format&fit=crop&w=800&q=80",
    costIndex: "100",
    latitude: "38.7223000",
    longitude: "-9.1393000",
    popular: true,
  },
  {
    name: "Berlin",
    country: "Germany",
    region: "Berlin",
    description:
      "A creative hub of history, street art and thriving nightlife.",
    image:
      "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=800&q=80",
    costIndex: "120",
    latitude: "52.5200000",
    longitude: "13.4050000",
    popular: true,
  },
  {
    name: "Madrid",
    country: "Spain",
    region: "Madrid",
    description:
      "Spain's lively capital of grand plazas, tapas and world-class art.",
    image:
      "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80",
    costIndex: "110",
    latitude: "40.4168000",
    longitude: "-3.7038000",
    popular: true,
  },
  {
    name: "Venice",
    country: "Italy",
    region: "Veneto",
    description:
      "Romantic floating city of canals, gondolas and Renaissance grandeur.",
    image:
      "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=800&q=80",
    costIndex: "120",
    latitude: "45.4408000",
    longitude: "12.3155000",
    popular: true,
  },
  {
    name: "Sydney",
    country: "Australia",
    region: "New South Wales",
    description:
      "Harbour city defined by the Opera House and sun-drenched beaches.",
    image:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80",
    costIndex: "150",
    latitude: "-33.8688000",
    longitude: "151.2093000",
    popular: true,
  },
  {
    name: "Los Angeles",
    country: "United States",
    region: "California",
    description:
      "Entertainment capital of beaches, Hollywood and endless sunshine.",
    image:
      "https://images.unsplash.com/photo-1580655653885-65763b2597d0?auto=format&fit=crop&w=800&q=80",
    costIndex: "170",
    latitude: "34.0522000",
    longitude: "-118.2437000",
    popular: true,
  },
  {
    name: "San Francisco",
    country: "United States",
    region: "California",
    description:
      "Iconic hills, cable cars and the Golden Gate Bridge by the bay.",
    image:
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80",
    costIndex: "180",
    latitude: "37.7749000",
    longitude: "-122.4194000",
    popular: true,
  },
  {
    name: "Cape Town",
    country: "South Africa",
    region: "Western Cape",
    description:
      "Coastal city beneath Table Mountain with vineyards and beaches.",
    image:
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=800&q=80",
    costIndex: "60",
    latitude: "-33.9249000",
    longitude: "18.4241000",
    popular: true,
  },
  {
    name: "Rio de Janeiro",
    country: "Brazil",
    region: "Rio de Janeiro",
    description:
      "Vibrant beaches, samba and the Christ the Redeemer statue.",
    image:
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=80",
    costIndex: "70",
    latitude: "-22.9068000",
    longitude: "-43.1729000",
    popular: true,
  },
  {
    name: "Bali",
    country: "Indonesia",
    region: "Bali",
    description:
      "Island paradise of rice terraces, temples and surf beaches.",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    costIndex: "45",
    latitude: "-8.6705000",
    longitude: "115.2126000",
    popular: true,
  },
  {
    name: "Kathmandu",
    country: "Nepal",
    region: "Bagmati",
    description:
      "Gateway to the Himalayas, rich with temples and trekking culture.",
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
    costIndex: "35",
    latitude: "27.7172000",
    longitude: "85.3240000",
    popular: true,
  },
  {
    name: "Marrakech",
    country: "Morocco",
    region: "Marrakesh-Safi",
    description:
      "Labyrinthine souks, riads and the buzz of Jemaa el-Fnaa square.",
    image:
      "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=800&q=80",
    costIndex: "50",
    latitude: "31.6295000",
    longitude: "-7.9811000",
    popular: false,
  },
  {
    name: "Hanoi",
    country: "Vietnam",
    region: "Hanoi",
    description:
      "Old-world charm with lakes, temples and legendary street food.",
    image:
      "https://images.unsplash.com/photo-1557750255-c76072a7aad1?auto=format&fit=crop&w=800&q=80",
    costIndex: "40",
    latitude: "21.0278000",
    longitude: "105.8342000",
    popular: false,
  },
  {
    name: "Budapest",
    country: "Hungary",
    region: "Budapest",
    description:
      "Danube-spanning city of thermal baths and grand architecture.",
    image:
      "https://images.unsplash.com/photo-1565426873118-a17ed65d74b9?auto=format&fit=crop&w=800&q=80",
    costIndex: "80",
    latitude: "47.4979000",
    longitude: "19.0402000",
    popular: false,
  },
  {
    name: "Auckland",
    country: "New Zealand",
    region: "Auckland",
    description:
      "Harbour metropolis surrounded by volcanoes and sailing culture.",
    image:
      "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=800&q=80",
    costIndex: "140",
    latitude: "-36.8509000",
    longitude: "174.7645000",
    popular: false,
  },
  {
    name: "Reykjavik",
    country: "Iceland",
    region: "Capital Region",
    description:
      "Northernmost capital, base for geysers, glaciers and the aurora.",
    image:
      "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=800&q=80",
    costIndex: "190",
    latitude: "64.1466000",
    longitude: "-21.9426000",
    popular: false,
  },
];

export const seedCities = async () => {
  const [{ total }] = await db
    .select({ total: count() })
    .from(cities);

  if (Number(total) >= CITY_SEED.length) {
    return;
  }

  for (const seedCity of CITY_SEED) {
    const [existing] = await db
      .select({ id: cities.id })
      .from(cities)
      .where(
        and(
          eq(cities.name, seedCity.name),
          eq(cities.country, seedCity.country)
        )
      )
      .limit(1);

    if (existing) {
      await db
        .update(cities)
        .set({ popular: seedCity.popular })
        .where(eq(cities.id, existing.id));
    } else {
      await db.insert(cities).values(seedCity);
    }
  }
};

export const listCities = async ({
  q,
  country,
  region,
  limit,
  offset,
}) => {
  const conditions = [];

  if (q) {
    conditions.push(ilike(cities.name, `%${q}%`));
  }

  if (country) {
    conditions.push(ilike(cities.country, `%${country}%`));
  }

  if (region) {
    conditions.push(ilike(cities.region, `%${region}%`));
  }

  const where =
    conditions.length > 0
      ? and(...conditions)
      : undefined;

  const [{ total }] = await db
    .select({ total: count() })
    .from(cities)
    .where(where);

  const data = await db
    .select()
    .from(cities)
    .where(where)
    .orderBy(asc(cities.name))
    .limit(limit)
    .offset(offset);

  if (data.length === 0 && q) {
    const resolved = await resolveCity(q);

    if (resolved) {
      const [existingCity] = await db
        .select()
        .from(cities)
        .where(
          and(
            ilike(cities.name, resolved.name),
            ilike(cities.country, resolved.country)
          )
        )
        .limit(1);

      if (existingCity) {
        return {
          data: [existingCity],
          count: 1,
          limit,
          offset,
        };
      }

      const [created] = await db
        .insert(cities)
        .values({
          ...resolved,
          popular: false,
        })
        .returning();

      return {
        data: [created],
        count: 1,
        limit,
        offset,
      };
    }
  }

  return {
    data,
    count: Number(total),
    limit,
    offset,
  };
};

export const listPopularCities = async ({
  limit = 25,
} = {}) => {
  await seedCities();

  const rows = await db
    .select({
      id: cities.id,
      name: cities.name,
      country: cities.country,
      region: cities.region,
      description: cities.description,
      image: cities.image,
      costIndex: cities.costIndex,
      latitude: cities.latitude,
      longitude: cities.longitude,
      saves: count(savedDestinations.id),
    })
    .from(cities)
    .leftJoin(
      savedDestinations,
      eq(savedDestinations.cityId, cities.id)
    )
    .where(eq(cities.popular, true))
    .groupBy(cities.id)
    .orderBy(
      desc(count(savedDestinations.id)),
      asc(cities.name)
    )
    .limit(limit);

  return rows.map(({ saves, ...city }) => city);
};

export const getCity = async (id) => {
  const [city] = await db
    .select()
    .from(cities)
    .where(eq(cities.id, id));

  if (!city) {
    const error = new Error("City not found");

    error.statusCode = 404;

    throw error;
  }

  return city;
};
