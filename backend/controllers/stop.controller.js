import { createStop, listStops, deleteStop } from "../services/stop.service.js";

export const listStopsController = async (req, res) => {
  try {
    const { tripId } = req.params;

    const stops = await listStops({
      tripId,
      ownerId: req.user.id,
    });

    return res.status(200).json(stops);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};

export const createStopController = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { cityId, startDate, endDate, budget } = req.body;

    if (!cityId || !startDate || !endDate) {
      return res.status(400).json({
        message: "cityId, startDate and endDate are required",
      });
    }

    if (endDate < startDate) {
      return res.status(400).json({
        message: "endDate cannot be before startDate",
      });
    }

    const stop = await createStop({
      tripId,
      ownerId: req.user.id,
      cityId,
      startDate,
      endDate,
      budget,
    });

    return res.status(201).json(stop);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};

export const reorderStopsController = async (req, res) => {
  return res.status(501).json({
    message: "Not implemented",
  });
};

export const updateStopController = async (req, res) => {
  return res.status(501).json({
    message: "Not implemented",
  });
};

export const deleteStopController = async (req, res) => {
  try {
    const { tripId, id } = req.params;

    await deleteStop({
      tripId,
      stopId: id,
      ownerId: req.user.id,
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};
