import {
  listActivities,
  getActivity,
} from "../services/activity.service.js";

export const listActivitiesController = async (req, res) => {
  try {
    const {
      q,
      cityId,
      type,
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

    const result = await listActivities({
      q: q ? q.trim() : undefined,
      cityId: cityId ? cityId.trim() : undefined,
      type: type ? type.trim() : undefined,
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

export const getActivityController = async (req, res) => {
  try {
    const { id } = req.params;

    const activity = await getActivity(id);

    return res.status(200).json(activity);
  } catch (error) {
    return res.status(
      error.statusCode || 500
    ).json({
      message: error.message,
    });
  }
};
