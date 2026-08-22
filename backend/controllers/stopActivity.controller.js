import {
  listStopActivities,
  addStopActivity,
  updateStopActivity,
  removeStopActivity,
} from "../services/stopActivity.service.js";

export const listStopActivitiesController = async (req, res) => {
  try {
    const activities = await listStopActivities({
      tripId: req.params.tripId,
      stopId: req.params.stopId,
      ownerId: req.user.id,
    });

    return res.status(200).json(activities);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};

export const addStopActivityController = async (req, res) => {
  try {
    const {
      otmPlaceId,
      name,
      type,
      image,
      latitude,
      longitude,
      date,
      startTime,
      endTime,
      plannedCost,
      note,
      notes,
    } = req.body || {};

    if (!name || !date) {
      return res.status(400).json({
        message: "name and date are required",
      });
    }

    const activity = await addStopActivity({
      tripId: req.params.tripId,
      stopId: req.params.stopId,
      ownerId: req.user.id,
      otmPlaceId,
      name: name.trim(),
      type,
      image,
      latitude,
      longitude,
      date,
      startTime,
      endTime,
      plannedCost,
      notes: notes ?? note,
    });

    return res.status(201).json(activity);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};

export const updateStopActivityController = async (req, res) => {
  try {
    const {
      otmPlaceId,
      name,
      type,
      image,
      latitude,
      longitude,
      date,
      startTime,
      endTime,
      plannedCost,
      note,
      notes,
    } = req.body || {};

    if (name !== undefined && name.trim().length === 0) {
      return res.status(400).json({
        message: "name cannot be empty",
      });
    }

    const activity = await updateStopActivity({
      tripId: req.params.tripId,
      stopId: req.params.stopId,
      activityId: req.params.id,
      ownerId: req.user.id,
      otmPlaceId,
      name: name !== undefined ? name.trim() : undefined,
      type,
      image,
      latitude,
      longitude,
      date,
      startTime,
      endTime,
      plannedCost,
      notes: notes ?? note,
    });

    return res.status(200).json(activity);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};

export const removeStopActivityController = async (req, res) => {
  try {
    await removeStopActivity({
      tripId: req.params.tripId,
      stopId: req.params.stopId,
      activityId: req.params.id,
      ownerId: req.user.id,
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
    });
  }
};
