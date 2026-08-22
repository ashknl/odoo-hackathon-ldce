import { createTrip, listTrips } from "../services/trip.service.js";

export const listTripsController = async (req, res) => {
  try {
    const trips = await listTrips({
      ownerId: req.user.id,
    });

    return res.status(200).json(trips);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};

export const createTripController = async (req, res) => {
  try {
    const { name, description, startDate, endDate, budget } = req.body;

    if (!name || !startDate || !endDate) {
      return res.status(400).json({
        message: "Name, startDate and endDate are required",
      });
    }

    if (endDate < startDate) {
      return res.status(400).json({
        message: "endDate cannot be before startDate",
      });
    }

    const trip = await createTrip({
      ownerId: req.user.id,
      name,
      description,
      startDate,
      endDate,
      budget,
    });

    return res.status(201).json(trip);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};

export const getTripController = async (req, res) => {
  return res.status(501).json({
    message: "Not implemented",
  });
};

export const updateTripController = async (req, res) => {
  return res.status(501).json({
    message: "Not implemented",
  });
};

export const deleteTripController = async (req, res) => {
  return res.status(501).json({
    message: "Not implemented",
  });
};

export const uploadCoverController = async (req, res) => {
  return res.status(501).json({
    message: "Not implemented",
  });
};

export const duplicateTripController = async (req, res) => {
  return res.status(501).json({
    message: "Not implemented",
  });
};

export const updateSharingController = async (req, res) => {
  return res.status(501).json({
    message: "Not implemented",
  });
};

export const getItineraryController = async (req, res) => {
  return res.status(501).json({
    message: "Not implemented",
  });
};

export const getBudgetController = async (req, res) => {
  return res.status(501).json({
    message: "Not implemented",
  });
};

export const getCalendarController = async (req, res) => {
  return res.status(501).json({
    message: "Not implemented",
  });
};
