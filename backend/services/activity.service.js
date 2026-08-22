import { eq } from "drizzle-orm";

import { db } from "../db/connection.js";
import { cities } from "../db/schema/cities.js";

import {
  autosuggest,
  getPlaceDetails,
  radiusCount,
  radiusSearch,
} from "./opentripmap.service.js";

const TYPE_TO_KINDS = {
  sightseeing: "interesting_places",
  museum: "museums",
  nature: "natural",
  beach: "beaches",
  food: "foods",
  architecture: "architecture",
  historic: "historic",
  religion: "religion",
  sport: "sport",
  shopping: "shops",
  nightlife: "amusements",
  entertainment: "amusements",
};

const resolveKinds = (type) => {
  if (!type) {
    return undefined;
  }

  return TYPE_TO_KINDS[type] ?? type;
};

export const estimateActivityCost = (kinds) => {
  const value = (kinds || "").toLowerCase();

  if (value.includes("museum")) return 15;
  if (value.includes("theatres") || value.includes("concerts")) return 40;
  if (value.includes("amusements")) return 30;
  if (value.includes("foods") || value.includes("restaurants")) return 20;
  if (value.includes("natural") || value.includes("beaches")) return 0;
  if (value.includes("historic") || value.includes("monuments")) return 10;
  if (value.includes("religion")) return 0;

  return 20;
};

const toOtmUrl = (xid) =>
  `https://opentripmap.com/en/card/${xid}`;

const normalizeRadiusItem = (item) => ({
  otmPlaceId: item.xid,
  name: item.name,
  kinds: item.kinds || "",
  rate: item.rate,
  latitude: item.point?.lat ?? null,
  longitude: item.point?.lon ?? null,
  previewUrl: item.preview?.source ?? null,
  wikipediaExtract: null,
  otmUrl: item.otm ?? toOtmUrl(item.xid),
  plannedCost: estimateActivityCost(item.kinds),
});

const normalizeAutosuggestItem = (feature) => {
  const props = feature.properties || {};
  const [lon, lat] =
    feature.geometry?.coordinates ?? [null, null];

  return {
    otmPlaceId: props.xid,
    name: props.name,
    kinds: props.kinds || "",
    rate: props.rate,
    latitude: lat,
    longitude: lon,
    previewUrl: null,
    wikipediaExtract: null,
    otmUrl: toOtmUrl(props.xid),
    plannedCost: estimateActivityCost(props.kinds),
  };
};

const getCityCoordinates = async (cityId) => {
  const [city] = await db
    .select()
    .from(cities)
    .where(eq(cities.id, cityId));

  if (!city) {
    const error = new Error("City not found");

    error.statusCode = 404;

    throw error;
  }

  return {
    lon: city.longitude,
    lat: city.latitude,
  };
};

export const listActivities = async ({
  q,
  cityId,
  type,
  limit,
  offset,
}) => {
  const kinds = resolveKinds(type);

  if (q) {
    if (!cityId) {
      const error = new Error(
        "cityId is required to search activities"
      );

      error.statusCode = 400;

      throw error;
    }

    const { lon, lat } = await getCityCoordinates(cityId);

    const features = await autosuggest({
      name: q,
      lon,
      lat,
    });

    const data = features
      .map(normalizeAutosuggestItem)
      .slice(offset, offset + limit);

    return {
      data,
      count: features.length,
      limit,
      offset,
    };
  }

  if (!cityId) {
    const error = new Error(
      "cityId is required to list activities"
    );

    error.statusCode = 400;

    throw error;
  }

  const { lon, lat } = await getCityCoordinates(cityId);

  const [count, rows] = await Promise.all([
    radiusCount({ lon, lat, kinds }),
    radiusSearch({ lon, lat, kinds, limit, offset }),
  ]);

  return {
    data: rows.map(normalizeRadiusItem),
    count,
    limit,
    offset,
  };
};

export const getActivity = async (id) => {
  const place = await getPlaceDetails(id);

  if (!place || place.error || !place.xid) {
    const error = new Error("Activity not found");

    error.statusCode = 404;

    throw error;
  }

  return {
    otmPlaceId: place.xid,
    name: place.name,
    kinds: place.kinds || "",
    rate: place.rate,
    previewUrl: place.preview?.source ?? null,
    image: place.image ?? null,
    wikipediaExtract:
      place.wikipedia_extracts?.text ?? null,
    otmUrl: place.otm ?? toOtmUrl(place.xid),
    address: place.address ?? null,
    latitude: place.point?.lat ?? null,
    longitude: place.point?.lon ?? null,
    plannedCost: estimateActivityCost(place.kinds),
  };
};
