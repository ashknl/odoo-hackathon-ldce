import {
  signup,
  login,
  logout,
  getCurrentUser,
} from "../services/auth.service.js";

export const signupController = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        message:
          "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters",
      });
    }

    const result = await signup({
      name,
      email,
      password,
    });

    return res.status(201).json(result);
  } catch (error) {
    return res.status(
      error.statusCode || 500
    ).json({
      message: error.message,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required",
      });
    }

    const result = await login({
      email,
      password,
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

export const meController = async (req, res) => {
  try {
    const user = await getCurrentUser(
      req.user.id
    );

    return res.status(200).json(user);
  } catch (error) {
    return res.status(
      error.statusCode || 500
    ).json({
      message: error.message,
    });
  }
};

export const logoutController = async (req, res) => {
  try {
    await logout(req.user.id);

    return res.status(204).send();
  } catch (error) {
    return res.status(
      error.statusCode || 500
    ).json({
      message: error.message,
    });
  }
};