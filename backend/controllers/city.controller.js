import {
  listCities,
  listPopularCities,
  getCity,
} from "../services/city.service.js";

export const listCitiesController = async (req, res) => {
  try {
    const {
      q,
      country,
      region,
      limit,
      offset,
    } = req.query || {};

    const parsedLimit = Math.min(
      Math.max(parseInt(limit, 10) || 20, 1),
      100
    );

    const parsedOffset = Math.max(
      parseInt(offset, 10) || 0,
      0
    );

    const result = await listCities({
      q: q ? q.trim() : undefined,
      country: country ? country.trim() : undefined,
      region: region ? region.trim() : undefined,
      limit: parsedLimit,
      offset: parsedOffset,
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(
      error.statusCode || 500
    ).json({
      message: error.message,
    });
  }
};

export const listPopularCitiesController = async (req, res) => {
  try {
    const { limit } = req.query || {};

    const parsedLimit = Math.min(
      Math.max(parseInt(limit, 10) || 25, 1),
      100
    );

    const cities = await listPopularCities({
      limit: parsedLimit,
    });

    return res.status(200).json(cities);
  } catch (error) {
    return res.status(
      error.statusCode || 500
    ).json({
      message: error.message,
    });
  }
};

export const getCityController = async (req, res) => {
  try {
    const { id } = req.params;

    const city = await getCity(id);

    return res.status(200).json(city);
  } catch (error) {
    return res.status(
      error.statusCode || 500
    ).json({
      message: error.message,
    });
  }
};
