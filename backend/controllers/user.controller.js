import { deleteAccount } from "../services/user.service.js";

export const getMeController = async (req, res) => {
  return res.status(501).json({
    message: "Not implemented",
  });
};

export const updateMeController = async (req, res) => {
  return res.status(501).json({
    message: "Not implemented",
  });
};

export const deleteMeController = async (req, res) => {
  try {
    const { password } = req.body || {};

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    await deleteAccount({
      userId: req.user.id,
      password,
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(
      error.statusCode || 500
    ).json({
      message: error.message,
    });
  }
};

export const uploadAvatarController = async (req, res) => {
  return res.status(501).json({
    message: "Not implemented",
  });
};

export const listSavedDestinationsController = async (req, res) => {
  return res.status(501).json({
    message: "Not implemented",
  });
};

export const saveDestinationController = async (req, res) => {
  return res.status(501).json({
    message: "Not implemented",
  });
};

export const removeSavedDestinationController = async (req, res) => {
  return res.status(501).json({
    message: "Not implemented",
  });
};
