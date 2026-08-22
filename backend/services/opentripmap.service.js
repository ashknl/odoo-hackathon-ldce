import "dotenv/config";

const OTM_BASE_URL =
  "https://api.opentripmap.com/0.1/en/places";

const COST_INDEX_BY_COUNTRY = {
  US: 180,
  GB: 160,
  CH: 190,
  JP: 150,
  SG: 170,
  AU: 150,
  NZ: 140,
  CA: 140,
  NO: 180,
  DK: 170,
  SE: 160,
  IS: 190,
  IE: 140,
  NL: 140,
  BE: 130,
  LU: 150,
  AT: 130,
  DE: 120,
  FR: 130,
  IT: 120,
  ES: 110,
  PT: 100,
  GR: 95,
  IN: 45,
  TH: 50,
  VN: 40,
  ID: 45,
  MY: 55,
  PH: 45,
  LK: 40,
  NP: 35,
  BD: 35,
  PK: 35,
  BR: 70,
  AR: 65,
  CL: 70,
  CO: 55,
  PE: 55,
  MX: 65,
  TR: 60,
  EG: 45,
  MA: 50,
  ZA: 60,
  KE: 50,
  AE: 130,
  QA: 140,
};

export const getOpenTripMapApiKey = () => {
  return process.env.OPENTRIPMAP_API_KEY;
};

const request = async (path, params = {}) => {
  const apiKey = getOpenTripMapApiKey();

  if (!apiKey) {
    const error = new Error(
      "OpenTripMap API key is not configured"
    );

    error.statusCode = 500;

    throw error;
  }

  const query = new URLSearchParams({
    ...params,
    apikey: apiKey,
  });

  const response = await fetch(
    `${OTM_BASE_URL}${path}?${query.toString()}`
  );

  if (!response.ok) {
    const error = new Error(
      "OpenTripMap request failed"
    );

    error.statusCode = 502;

    throw error;
  }

  return response.json();
};

export const estimateCostIndex = (countryCode) => {
  const code = (
    countryCode || ""
  ).toUpperCase();

  return COST_INDEX_BY_COUNTRY[code] ?? 100;
};

export const resolveCity = async (name) => {
  const data = await request("/geoname", {
    name,
  });

  if (
    !data ||
    data.status === "error" ||
    !data.name ||
    data.lat == null ||
    data.lon == null
  ) {
    return null;
  }

  return {
    name: data.name,
    country: data.country,
    region: data.region || null,
    latitude: String(data.lat),
    longitude: String(data.lon),
    costIndex: String(
      estimateCostIndex(data.country)
    ),
  };
};
